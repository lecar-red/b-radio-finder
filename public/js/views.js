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

    /*
     * this feels like the correct thing to do but doesn't
     * fit with route.navigate thing 
    events: {
        'click .close': 
    },
    */

    render: function() {
        this.el = $(this.id);
        return this;
    },

    // seems like there must be some
    show: function() {
        this.$el.modal('show');
    },

    hide: function() {
        this.$el.modal('hide');
    }
});

var PlaceholderView = Backbone.View.extend({
    el: '#ph',

    render: function() {
        this.el = $(this.id);
        return this;
    },

    show: function() {
        this.$el.show();
    },

    hide: function() {
        this.$el.hide();
    }
});
