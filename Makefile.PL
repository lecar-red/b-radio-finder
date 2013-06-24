use strict;
use warnings;
use ExtUtils::MakeMaker;

WriteMakefile(
    NAME                => 'BrewFinder',
    AUTHOR              => q{Lee <leecarmichael123@gmail.com>},
    VERSION_FROM        => 'lib/BrewFinder.pm',
    ABSTRACT            => 'Retrieve Brewers Radio stations based on location',
    ($ExtUtils::MakeMaker::VERSION >= 6.3002
      ? ('LICENSE'=> 'perl')
      : ()),
    PL_FILES            => {},
    PREREQ_PM => {
        'Test::More' => 0,
        'YAML'       => 0,
        'Dancer'     => 1.3095,
        'Template'   => 0,

        'Dancer::Plugin::Database' => 0,

        'Geo::Coder::Google'    => 0,
	'GIS::Distance'         => 0,
        #'Geo::Distance::Google' => 0,
    },
    dist                => { COMPRESS => 'gzip -9f', SUFFIX => 'gz', },
    clean               => { FILES => 'BrewFinder-*' },
);
