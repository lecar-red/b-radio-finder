#!/usr/bin/perl
use strict;
use warnings;

use Geo::Coder::Google;
use Data::Dumper qw( Dumper );

my $name = shift || die "Missing state, city or zip\n";

my $geocoder = Geo::Coder::Google->new(apiver => 3);
my $location = $geocoder->geocode(location => $name);

print Dumper($location), "\n";

exit;
