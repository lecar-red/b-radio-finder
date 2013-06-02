use Test::More tests => 2;
use strict;
use warnings;

use lib qw( lib );

# the order is important
use BrewFinder;
use Dancer::Test;

route_exists [POST => '/search'], 'a route handler is defined for /search';
response_status_is ['POST' => '/'], 200, 'response status is 200 for /search';

# maybe more complex then
my $resp = dancer_response( POST => '/search', { headers => [ 'X-Requested-With' => 'XMLHttpRequest' ]} ); 

is $resp->{status}, 200, '/search return 200';
