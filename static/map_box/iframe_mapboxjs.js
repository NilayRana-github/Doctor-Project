// var mapElem = document.getElementById('map');
// var latitude = mapElem.dataset.latitude;
// var longitude = mapElem.dataset.longitude;

// console.log("Iframe Latitude")
// console.log(latitude);

// console.log("Iframe Longitude")
// console.log(longitude);

// mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

// // Making map
// var map = new mapboxgl.Map({
//     container: 'map',
//     // style: 'mapbox://styles/mapbox/satellite-streets-v12',
//     // style: 'mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl',
//     style: 'mapbox://styles/nilay-welogical/clfl370y2000601t6x1jh0fmw',
//     // style: 'mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0',
//     // style: 'mapbox://styles/mapbox/satellite-v9',
//     // style: 'mapbox://styles/mapbox/dark-v11',
//     // style: 'mapbox://styles/mapbox/outdoors-v12',

//     // center: [-110, 45],
//     // center: [77.587384, 12.917639],
//     center: [-122.4194, 37.7749],

//     zoom: 25,
//     pitch: 60
// });

// // map.on('load', function() {
// //     directions.setOrigin([77.587384, 12.917639]);
// //     directions.setDestination([longitude, latitude]);
// // });

// // Create a 3D building layer for the map
// map.on('load', function() {

//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//     map.addLayer({
//       'id': '3d-buildings',
//       'source': 'composite',
//       'source-layer': 'building',
//       'filter': ['==', 'extrude', 'true'],
//       'type': 'fill-extrusion',
//       'minzoom': 20,
//       'paint': {
//         // 'fill-extrusion-color': 'red',
//         'fill-extrusion-color': '#aaa',

//         'fill-extrusion-height': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'height']
//         ],
//         'fill-extrusion-base': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'min_height']
//         ],
//         'fill-extrusion-opacity': 0.6
//       }
//     });
// })



// // Adding the map controls
// // Full screen control
// map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// // Navigation Control
// // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// // 3d view navigation
// map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

// // Live Location control
// map.addControl(new mapboxgl.GeolocateControl({
//     positionOptions: {
//         enableHighAccuracy: true
//     },
//     trackUserLocation: true,
//     showUserHeading: true
// }), 'top-right');

// // Direction code control
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',

//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 60,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         // updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 5000);
//         }
//       };

//       moveAlongPath();

//     }
//   });

//   // Change the map style to the desired style
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl');
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0');
// }

// document.getElementById('directions-btn').addEventListener('click', getDirections);






var mapElem = document.getElementById('map');
var latitude = mapElem.dataset.latitude;
var longitude = mapElem.dataset.longitude;

console.log("Iframe Latitude")
console.log(latitude);

console.log("Iframe Longitude")
console.log(longitude);

mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

// Making map
var map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/satellite-streets-v12',
    // style: 'mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl',
    // style: 'mapbox://styles/nilay-welogical/clfl370y2000601t6x1jh0fmw',
    // style: 'mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0',
    // style: 'mapbox://styles/mapbox/satellite-v9',
    // style: 'mapbox://styles/mapbox/dark-v11',
    style: 'mapbox://styles/mapbox/outdoors-v12',

    // center: [-110, 45],
    // center: [77.587384, 12.917639],
    center: [-122.4194, 37.7749],

    zoom: 25,
    pitch: 60
});

// map.on('load', function() {
//     directions.setOrigin([77.587384, 12.917639]);
//     directions.setDestination([longitude, latitude]);
// });

// Create a 3D building layer for the map
map.on('load', function() {

  directions.setOrigin([77.587384, 12.917639]);
  directions.setDestination([longitude, latitude]);

    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 20,
      'paint': {
        // 'fill-extrusion-color': 'red',
        'fill-extrusion-color': '#aaa',

        'fill-extrusion-height': [
          'interpolate', ['linear'], ['zoom'],
          15, 0,
          15.05, ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate', ['linear'], ['zoom'],
          15, 0,
          15.05, ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    });
})



// Adding the map controls
// Full screen control
map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// Navigation Control
// map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// 3d view navigation
map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

// Live Location control
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
}), 'top-right');

// Direction code control
const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving',
    alternatives: false,
    interactive: false,
    congestion: true,
    controls: {inputs: false, instructions: false}
});

map.addControl(directions, 'top-left');

directions.setOrigin([77.587384, 12.917639]);
directions.setDestination([longitude, latitude]);





// Original code

function getDirections() {

  // Direction origin and destination lat,long
  directions.setOrigin([77.587384, 12.917639]);
  directions.setDestination([longitude, latitude]);

  // When the route is calculated, rotate the camera towards the destination
  directions.on('route', function(event) {
    if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
      const start = event.route[0].legs[0].steps[0].maneuver.location;
      const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
      const bearing = turf.bearing(
        turf.point([start[0], start[1]]),
        turf.point([end[0], end[1]])
      );
      map.flyTo({
        center: start,
        zoom: 25,
        bearing: bearing,
        pitch: 50,
        speed: 10,
        curve: 1
      });

      let currentStep = 0;
      const steps = event.route[0].legs[0].steps;

      const moveAlongPath = function() {
        const step = steps[currentStep];
        const end = step.maneuver.location;
        const distance = turf.distance(turf.point(start), turf.point(end));
        const duration = distance / (1 / 10000);
        map.easeTo({
          center: end,
          duration: duration,
          zoom: 21,
          pitch: 60,
          bearing: step.maneuver.bearing_after,
          easing: function(t) {
            return t;
          }
        });

        // updateLiveLocationMarker(end); // Update the live location marker's position

        currentStep++;
        if (currentStep < steps.length) {
          setTimeout(moveAlongPath, duration);
        } else {
          // If the current step is the last step, wait for a few seconds and then redirect to the next page
          setTimeout(function() {
            window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
          }, 5000);
        }
      };

      moveAlongPath();

    }
  });

  // Change the map style to the desired style
  // map.setStyle('mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl');
  // map.setStyle('mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0');
}

document.getElementById('directions-btn').addEventListener('click', getDirections);

