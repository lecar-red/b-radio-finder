var app = {};

app.debug = false;

function populate_location(pos) {
    $('[name=loc]').val(pos.coords.latitude + ", " + pos.coords.longitude);
}

$(function() {
    app.stations     = new Stations;
    app.stationsView = new StationsView({collection: app.stations});

    app.searchloc     = new SearchLocation;
    app.searchingView = new SearchingView({model: app.searchloc});

    // basic setup
    app.stationsView.render();

    // add to page
    $('.row.output').prepend(app.searchingView.el);
    $('.row .span12').after(app.stationsView.el); 

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
            success: function(data, status, obj) { 
                var resp = obj.xhr;

                if (app.debug) {
                    $('#debug pre').text(resp.responseText).parent().fadeIn();
                }

                $input.val('');

                // pass data.source to searchloc
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
