var app = {};

// feels like this should be in its own view too
function populate_location(pos) {
    $('[name=loc]').val(pos.coords.latitude + ", " + pos.coords.longitude);
}

var BrewApp = Backbone.Router.extend({
    defaults: {
        debug: false
    },

    routes: {
        '': 'index',
        'about': 'about',
        'current': 'current'
    },

    initialize: function(options) {
        if ( typeof options !== 'undefined' ) {
            this.debug = options.debug ? options.debug : false; 
        }

        // setup application
        this.stations     = new Stations;
        this.stationsView = new StationsView({collection: this.stations});
    
        this.searchloc     = new SearchLocation;
        this.searchingView = new SearchingView({model: this.searchloc});

        this.currentLoc    = new CurrentLocation;

        this.phView = new PlaceholderView;
        this.about  = new AboutView;

        // basic setup, could be called later
        this.stationsView.render();

        // add to page
        $('.row.output').prepend(this.searchingView.el);
        $('.row.output').after(this.stationsView.el); 
    },

    start: function() {
        // setup history thingy
        //Backbone.history.start({pushState: true});
        Backbone.history.start();
    },

    index: function() {
        this.about.hide();
    },

    about: function() {
        this.about.show();
    },

    current: function() {
        console.log("Fetch current location");

    }
});

$(function() {
    app = new BrewApp;
    app.start();

    // setup view hander on input
    // i suspect this could be backbone viewized
    $('body').on('click', '#here', function(e) {
        e.preventDefault();

        // add error handler
        navigator.geolocation.getCurrentPosition(populate_location);
    });
    
    // Usability stuff:
    //  - flip button while searching
    //  - 
    
    // for now just setup basic submit handler
    // TODO: convert into route
    $('body').on('submit', 'form', function(e) {
        var $input = $(e.target).find('[name=loc]');

        e.preventDefault();

        $input.parent().removeClass('error');

        if ( !$input.val().length ) {
            $input.parent().addClass('error');
            return;
        }

        $input.attr('readonly', true);

        app.searchloc.set({loc: $input.val()});
        
        // fetch stations
        app.stations.fetch({
            reset: true,
            data: {'loc': $input.val()},
            //done: function(data, status, resp) { 
            // backbone, adjusts args to callbacks
            success: function(collection, respData, options) { 
                var resp = options.xhr;

                if (app.debug) {
                    $('#debug pre').text(resp.responseText).parent().fadeIn();
                }

                $input.val('');

                // pass data.source to searchloc
                if ( respData.source ) {
                    app.searchloc.set(respData.source);
                }

                app.phView.hide();
            },
            //fail: function(resp, status, error) {
            error: function(resp, status, error) {
                // todo: add user messaging
                console.log("Error: " + status + " - " + error);
            },
            //always: function(resp, status, err) {
            complete: function(resp, status, err) {
                $input.attr('readonly', false);
            }
        });
    });
});
