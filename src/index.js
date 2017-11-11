var config = require('./config')
var login = require('./login')
var user = null;
login(function(u) {
    user = u;
});
module.exports = function() {

    var gridData = null;
    firebase.initializeApp(config.fconfig);
    mapboxgl.accessToken = config.accessToken;
    var map = new mapboxgl.Map({
        container: 'map',
        style: config.style,
        zoom: 12,
        center: [-71.97722138410576, -13.517379300798098]
    });

    map.on('click', config.layerId, function(e) {
        var html = '<li id="start"><a href="#">Start Mapping in JOSM</a></li><li id="done"><a href="#">Mark task as done</a></li>';
        if (!user) {
            html = '<h5>Authenticate</h5>'
        }
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(html)
            .addTo(map)
        $('#start').on('click', function(event) {
            downloadJOSM(e.features[0])
            save('progress', e.features[0])
        });
        $('#done').on('click', function(event) {
            save('done', e.features[0])
        });
    })

    function downloadJOSM(id) {
        $.getJSON('http://localhost:8111/import?new_layer=true&url=https://s3.amazonaws.com/tofix/aa.osm');
    }

    function save(type, obj) {
        firebase.database().ref(config.layerId + '/' + obj.properties.idgrid).set({
            status: type
        });
    }

    $(document).ready(function() {
        getFeatures();
    });

    function getFeatures() {
        firebase.database().ref(config.layerId).on("value", function(snapshot) {
            loadGist(snapshot.val() || {})
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    function loadGist(done) {
        if (gridData) {
            print(done, gridData)
        } else {
            $.getJSON(config.gist, function(data) {
                gridData = data
                print(done, gridData)
            });
        }
    }

    function print(done, data) {
        for (var i = 0; i < data.features.length; i++) {
            data.features[i].properties.status = 'empty'
            if (done[data.features[i].properties.idgrid]) {
                data.features[i].properties = Object.assign(data.features[i].properties, done[data.features[i].properties.idgrid])
            }
        }
        if (map.getSource(config.layerId)) {
            map.getSource(config.layerId).setData(data);
        } else {
            map.addLayer({
                'id': config.layerId,
                'type': 'fill',
                'source': {
                    'type': 'geojson',
                    'data': data
                },
                'paint': {
                    'fill-color': {
                        property: 'status',
                        type: 'categorical',
                        stops: [
                            ['empty', '#51503f'],
                            ['progress', '#ffaa00'],
                            ['done', '#2de561']
                        ]
                    },
                    'fill-opacity': 0.3
                }
            });
            map.addLayer({
                'id': 'line',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': data
                },
                'paint': {
                    'line-width': 1,
                    'line-color': {
                        'type': 'categorical',
                        'property': 'status',
                        stops: [
                            ['empty', '#51503f'],
                            ['progress', '#ffaa00'],
                            ['done', '#2de561']
                        ]
                    }
                }
            });
        }
    }
}