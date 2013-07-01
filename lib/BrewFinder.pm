package BrewFinder;

#
# TODO: enable responsive bootstrap stuff
# 

use Dancer ':syntax';
use Dancer::Plugin::Ajax;
use Dancer::Plugin::Database;

use Geo::Coder::Google;
use GIS::Distance;

use strict;
use warnings;

our $VERSION = '0.1';

get '/' => sub {
    template 'index';
};

# return post results
ajax '/stations' => sub {
    my $current  = params->{loc};

    if ( !$current ) {
        return to_json { error => 'missing required parameter' };
    }

    # should figure out way to cache this a bit 
    my $geocoder = Geo::Coder::Google->new( apiver => 3 );
    my $geodata  = $geocoder->geocode( $current );

    debug $geodata;

    # need to make more friendly
    die "Unable to geocode: $current"
        unless $geodata && defined $geodata->{geometry} && defined $geodata->{geometry}->{location};

    # return results as array in sorted order
    to_json({
    	locations => fetch_results( 
            $geodata->{geometry}->{location}->{lat}, 
            $geodata->{geometry}->{location}->{lng} 
        ), 
    	source    => build_source( $geodata )
    });
};

sub fetch_results {
    my ( $lat, $lng ) = @_;
    my $gis = GIS::Distance->new;
    my %results;

    # basically calc distance and sort out top three results
    foreach my $station ( database->quick_select( 'station', {} )) {
        my $distance = $gis->distance( $station->{lat}, $station->{lng} => $lat, $lng );
        
        $results{ $station->{station_id} } = { 
            # used for sorting
            distance => int( $distance->miles ),
            %$station,
        };
    }

    my @sorted = sort { $results{$a}->{distance} <=> $results{$b}->{distance} } keys %results; 
    my $top = [];

    foreach my $id ( @sorted ) {
        push @{ $top }, $results{$id}; 

        last if scalar @$top > 2;
    }

    return $top; 
}

sub build_source {
    my $geodata = shift || return {};
    my ($city, $state, $zip) = (0, 2, 4);

    debug "address_components: ", $geodata->{address_components};
    debug "location: ", $geodata->{geometry}->{location};

    # ugh, sometimes there isn't a place of interest for the map
    if ( $geodata->{address_components}->[0] &&
         $geodata->{address_components}->[0]->{types} &&
         grep { /^point_of_interest$/ } @{ $geodata->{address_components}->[0]->{types} } ) {

        # adjust locations
        ($city, $state, $zip) = (1, 3, 5);
    }

    return {
        loc => sprintf( "%s, %s %s", 
            get_short_name($geodata->{address_components}->[$city]),
            get_short_name($geodata->{address_components}->[$state]),
            get_short_name($geodata->{address_components}->[$zip])
        ),
        # return lat & lng
        %{ $geodata->{geometry}->{location} }
    };
}

# retrieves short_name from passed in hashref
# - return N/A if hashref isn't defined or 'short_name' key doesn't exist
sub get_short_name {
    my $ele = shift;

    return $ele && $ele->{short_name} ? $ele->{short_name} : 'N/A';
}

true;
