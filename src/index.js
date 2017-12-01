var config = require('./config');
var login = require('./login');
var user = null;
var state = 'Educacion';
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
    zoom: 5,
    center: [-75.927, -8.744],
    hash: true
  });

  map.on('click', config.layerId, function(e) {
    var html = "<div class='pill'> <a id='progress' href='#' class='col12 button'>Start Mapping in JOSM</a>";
    if (e.features[0].properties.status === 'progress' && user.display_name === e.features[0].properties.user) {
      html = "<a id='done' href='#' class='col12 button'>Mark task as done</a>";
      html = html + "<a id='download' href='#' class='col12 button'>Download in JOSM</a>";
    }
    if (e.features[0].properties.status === 'progress' && user.display_name !== e.features[0].properties.user) {
      html =
        '<div>The block was taken by ' +
        e.features[0].properties.user +
        ', ' +
        markedAt(e.features[0].properties.date) +
        '</div>';
      html = html + "<a id='empty' href='#' class='col12 button'>Unblock</a>";
    }
    if (e.features[0].properties.status === 'done') {
      html =
        '<div>Marked as done by ' +
        e.features[0].properties.user +
        ', ' +
        markedAt(e.features[0].properties.date) +
        '</div>';
      html = html + "<a id='validate' href='#' class='col12 button'>Validate</a>";
      html = html + "<a id='empty' href='#' class='col12 button'>Invalidate</a>";
      html = html + "<a id='download' href='#' class='col12 button'>Download in JOSM</a>";
    }
    if (e.features[0].properties.status === 'validate') {
      html =
        '<div>Validate by ' + e.features[0].properties.user + ', ' + markedAt(e.features[0].properties.date) + '</div>';
      html = "<a id='empty' href='#' class='col12 button'>Invalidate</a>";
      html = html + "<a id='download' href='#' class='col12 button'>Download in JOSM</a>";
    }
    html = html + '</div>';
    if (!user) {
      html = '<h5>You need to authenticate!!</h5>';
    }
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map);
    $('#progress').on('click', function(event) {
      downloadJOSM('progress', e.features[0]);
      event.stopPropagation();
    });
    $('#done').on('click', function(event) {
      save('done', e.features[0]);
      event.stopPropagation();
    });
    $('#validate').on('click', function(event) {
      save('validate', e.features[0]);
      event.stopPropagation();
    });
    $('#empty').on('click', function(event) {
      save('empty', e.features[0]);
      event.stopPropagation();
    });
    $('#download').on('click', function(event) {
      downloadJOSM(null, e.features[0]);
      event.stopPropagation();
    });
  });

  function downloadJOSM(type, obj) {
    var bbox = turf.bbox(obj);
    $.ajax({
      url:
        config.josmLocalServer +
        'load_and_zoom?left=' +
        bbox[0] +
        '&right=' +
        bbox[2] +
        '&top=' +
        bbox[3] +
        '&bottom=' +
        bbox[1],
      complete: function(t) {
        if (t.status !== 200) {
          alert('JOSM remote control did not respond, Do you have JOSM running?,  is it your JOSM is running in https');
        } else {
          window.open(config.urltofile + obj.properties.id + '.osm');
          if (type === 'progress') {
            save(type, obj);
          }
        }
      }
    });
    console.log(config.urltofile + obj.properties.id + '.osm');
  }

  function save(type, obj) {
    firebase
      .database()
      .ref(config.layerId + '/' + obj.properties.id)
      .set({
        status: type,
        user: user.display_name,
        date: Date()
      });
  }

  function getFeatures() {
    firebase
      .database()
      .ref(config.layerId)
      .on(
        'value',
        function(snapshot) {
          loadGist(snapshot.val() || {});
        },
        function(errorObject) {
          console.log('The read failed: ' + errorObject.code);
        }
      );
  }

  function loadGist(done) {
    if (gridData) {
      print(done, gridData);
    } else {
      $.getJSON(config.gist[state], function(data) {
        gridData = data;
        print(done, gridData);
        $('#map').removeClass('loading');
      });
    }
  }

  function print(done, data) {
    var centroids = turf.featureCollection([]);
    for (var i = 0; i < data.features.length; i++) {
      data.features[i].properties.status = 'empty';
      if (done[data.features[i].properties.id]) {
        data.features[i].properties = Object.assign(data.features[i].properties, done[data.features[i].properties.id]);
        var cen = turf.centroid(data.features[i]);
        cen.properties.user = data.features[i].properties.user;
        centroids.features.push(cen);
      }
    }
    if (map.getSource(config.layerId)) {
      map.getSource(config.layerId).setData(data);
      map.getSource('line').setData(data);
      map.getSource('label').setData(centroids);
    } else {
      map.addLayer({
        id: config.layerId,
        type: 'fill',
        source: {
          type: 'geojson',
          data: data
        },
        paint: {
          'fill-color': {
            property: 'status',
            type: 'categorical',
            stops: [['empty', '#51503f'], ['progress', '#eaa8a8'], ['done', '#f4f0a1'], ['validate', '#8ef9be']]
          },
          'fill-opacity': 0.4
        }
      });
      map.addLayer({
        id: 'line',
        type: 'line',
        source: {
          type: 'geojson',
          data: data
        },
        paint: {
          'line-width': 1,
          'line-color': {
            type: 'categorical',
            property: 'status',
            stops: [['empty', '#51503f'], ['progress', '#eaa8a8'], ['done', '#ffd400'], ['validate', '#2de561']]
          }
        }
      });
      map.addLayer({
        id: 'label',
        type: 'symbol',
        maxzoom: 16,
        minzoom: 10,
        source: {
          type: 'geojson',
          data: centroids
        },
        layout: {
          'text-field': 'By: {user}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 10
        },
        paint: {
          'text-color': '#6b6b6b',
          'text-halo-color': '#fff',
          'text-halo-width': 1
        }
      });
    }
  }
  $(document).ready(function() {
    getFeatures();
    $('#layer').change(function() {
      gridData = null;
      state = $(this).val();
      getFeatures();
    });
  });
};

function markedAt(date) {
  if (!date) {
    date = new Date(Date.now() - 3 * 12 * 3600 * 1000);
  }
  date_marked = new Date(date);
  date_now = new Date();
  seconds = Math.floor((date_now - date_marked) / 1000);
  minutes = Math.floor(seconds / 60);
  hours = Math.floor(minutes / 60);
  days = Math.floor(hours / 24);
  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
  if (hours > 24) {
    return hours / 24 + 'd ago';
  } else if (hours > 0) {
    return hours + 'h ago';
  } else if (minutes > 0 && minutes < 60) {
    return minutes + 'min ago';
  } else {
    return seconds + 's ago';
  }
}
