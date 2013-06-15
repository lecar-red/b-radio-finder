var Station = Backbone.Model.extend({
    idAttribute: 'station_id',

    urlRoot: '/station',
});

var Stations = Backbone.Collection.extend({
    url: '/stations',
    model: Station
});

var SearchLocation = Backbone.Model.extend({
    defaults: {
        lat: 'n/a',
        lng: 'n/a'
    }
});

var CurrentLocation = Backbone.Model.extend({
});
