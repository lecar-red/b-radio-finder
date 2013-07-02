var StationView = Backbone.View.extend({
    className: 'station span12',

    template: _.template($('#station-tmpl').html()),

    initialize: function() {
        this.model.on('change', this.render, this);
    },

    render: function() {
        var attrs = this.model.toJSON();
        this.$el.html(this.template(attrs));
    }
});

// this is more or less boilerplate code for a collection
var StationsView = Backbone.View.extend({
    // easier tracking
    // id: 'stations',

    className: 'row',

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('reset', this.addAll, this);
    },

    render: function() {
        this.addAll();
    },

    addOne: function(m) {
        var v = new StationView({model: m});

        v.render();
    
        this.$el.append(v.el);
    },

    addAll: function() {
        this.$el.empty();
        this.collection.forEach(this.addOne, this);
    }
});

var SearchingView = Backbone.View.extend({
    className: 'span12 searching',

    template: _.template($("#searching-tmpl").html()),

    initialize: function() {
        this.model.on('change', this.render, this);
    },

    render: function() {
        var attrs = this.model.toJSON();
        this.$el.html(this.template(attrs));
    }
});

var AboutView = Backbone.View.extend({
    el: '#about',

    show: function() {
        this.$el.modal('show');
    },

    hide: function() {
        this.$el.modal('hide');
    }
});

var PlaceholderView = Backbone.View.extend({
    el: '#ph',

    show: function() {
        this.$el.show();
    },

    hide: function() {
        this.$el.hide();
    }
});

var CurrentLocationView = Backbone.View.extend({
    el: '#here',
    tagName: 'button',

    events: {
        'click': 'request_location'
    },

    initialize: function() {
        this.location_input = $('[name=loc]');
        this.model.on('change', this.update_input, this);
    },

    update_input: function() {
        if ( this.model.get('lat') && this.model.get('lng') ) {
            this.location_input.val( this.model.get('lat') + ", " + this.model.get('lng') );
        }
        else {
            this.location_input.val("");
        }
    },

    request_location: function() {
        var locModel = this.model;
        var $button  = this.$el;

        if ( navigator.geolocation ) {
            $button.button('toggle');

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    $button.button('toggle');
                    locModel.set({
                        'lat': position.coords.latitude,
                        'lng': position.coords.longitude
                    });
                },
                // error handler
                function(error) {
                    var errors = {
                        0: 'Unknown Error',
                        1: 'Permission Denied',
                        2: 'Position Unavailable',
                        3: 'Timed out'
                    };

                    $button.button('toggle');

                    // this feels kind of wrong but maybe not...
                    locModel.clear();
                    locModel.set({
                        error_msg:  errors[error],
                        error_code: error
                    });
                }
            )
        }
        else {
            // throw unsupported error
        }
    }

});
