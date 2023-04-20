var mapElem = document.getElementById("map");
var latitude = mapElem.dataset.latitude;
var longitude = mapElem.dataset.longitude;

console.log(latitude)
console.log(longitude)

var mapView = new ol.View({
  center: ol.proj.fromLonLat([longitude, latitude]),
  zoom: 18.5
});

var map = new ol.Map({
  target: 'map',
  view: mapView,
  controls: []
});

var osmTile = new ol.layer.Tile({
  title: 'Open Street Map',
  visible: true,
  source: new ol.source.OSM()
});

var markerLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
      })
    ]
  }),
  style: new ol.style.Style({
    image: new ol.style.Icon({
      src: 'static/resources/images/icons8-location-50.png',
      imgSize: [250, 250],
      offset: [0, 0],
      size: [50, 50]
    })
  })
});

var circleLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Circle(ol.proj.fromLonLat([longitude, latitude]), 50)
      })
    ]
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      width: 4
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })
});

map.addLayer(osmTile);

// toggle event
function toggleLayer(eve) {
    var lyrname = eve.target.value;
    var checkedStatus = eve.target.checked;
    var lyrList = map.getLayers();

    lyrList.forEach(function(element){
        if (lyrname == element.get('title')){
            element.setVisible(checkedStatus);
        }
    });
}

// Adding 1st satellite view feature
var satelliteTile1 = new ol.layer.Tile({
    title: 'Bing Aerial',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd',
        imagerySet: 'AerialWithLabels'
  })
});

map.addLayer(satelliteTile1);

// Adding 2nd satellite view feature
var satelliteTile2 = new ol.layer.Tile({
    title: 'Bing Aerial',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd',
        imagerySet: 'Road'
  })
});

map.addLayer(satelliteTile2);

// Adding 3rd satellite view feature
var satelliteTile3 = new ol.layer.Tile({
    title: 'Bing Aerial',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd',
        imagerySet: 'CanvasDark'
  })
});

map.addLayer(satelliteTile3);

// Adding 4th satellite view feature
var satelliteTile4 = new ol.layer.Tile({
    title: 'Bing Aerial',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd',
        imagerySet: 'CanvasLight'
  })
});

map.addLayer(satelliteTile4);

// satellite checkboxes
var satelliteCheckbox1 = document.getElementById('satellite-checkbox1');
var satelliteCheckbox2 = document.getElementById('satellite-checkbox2');
var satelliteCheckbox3 = document.getElementById('satellite-checkbox3');
var satelliteCheckbox4 = document.getElementById('satellite-checkbox4');

// satellite checkbox functions
satelliteCheckbox1.addEventListener('change', function() {
    var isChecked = this.checked;
    satelliteTile1.setVisible(isChecked);
});

satelliteCheckbox2.addEventListener('change', function() {
    var isChecked = this.checked;
    satelliteTile2.setVisible(isChecked);
});

satelliteCheckbox3.addEventListener('change', function() {
    var isChecked = this.checked;
    satelliteTile3.setVisible(isChecked);
});

satelliteCheckbox4.addEventListener('change', function() {
    var isChecked = this.checked;
    satelliteTile4.setVisible(isChecked);
});

map.addLayer(circleLayer);
map.addLayer(markerLayer);

// End of adding layers

// Start of Live Location Js code

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  // Fetch location name using Nominatim
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lon);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var result = JSON.parse(xhr.responseText);
      var locationName = result.display_name;
      console.log("Location Name: " + locationName);
      addLocationMarker(lat, lon, locationName);
    } else {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send();

  // Add red location icon at current location
  function addLocationMarker(lat, lon, locationName) {
    var locationMarker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([lon, lat])
      ),
      name: locationName
    });
    var locationVectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [locationMarker],
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          src: 'static/resources/images/icons8-location-50.png',
          imgSize: [50, 50],
          opacity: 0.75,
          anchor: [0.5, 1],
        }),
        text: new ol.style.Text({
          text: locationName,
          font: '12px Arial,sans-serif',
          fill: new ol.style.Fill({
            color: 'black'
          }),
          backgroundFill: new ol.style.Fill({
            color: 'white'
          }),
          padding: [3, 3, 3, 3],
          textAlign: 'center'
        })
      })
    });
    map.addLayer(locationVectorLayer);

    // Add blue circle marker at current location
    var accuracyMarker = new ol.Feature({
      geometry: new ol.geom.Circle(
        ol.proj.fromLonLat([lon, lat]), position.coords.accuracy
      ),
    });
    var accuracyVectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [accuracyMarker],
      }),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          width: 0.01,
          radius: 2,
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      opacity: 2,
    });
    map.addLayer(accuracyVectorLayer);

    // Set map center and zoom to current location
    var mapView = map.getView();
    mapView.setCenter(ol.proj.fromLonLat([lon, lat]));
    mapView.setZoom(16);
  }
}

// End of Live Location Js code

// Start of Enabling Dark and Light mode Js code

const toggleButton = document.querySelector('#dark-mode-toggle');
const body = document.querySelector('body');

toggleButton.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
});

// End of Enabling Dark and Light mode Js code


// Add mouse position control
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: function(coord) {
        return ol.coordinate.format(coord, 'Latitude: {y}, Longitude: {x}', 6);
    },
    projection: 'EPSG:4326',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});

map.addControl(mousePositionControl);

// Add scale line control
var scaleLineControl = new ol.control.ScaleLine({
    units: 'metric',
    bar: 'true',
    text: 'true',
    target:  document.getElementById('scale-line')
});

map.addControl(scaleLineControl);

// Start of search feature

var searchInput = document.getElementById('search-input');
var searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function() {
  var searchText = searchInput.value;
  if (searchText) {
    var url = 'https://dev.virtualearth.net/REST/v1/Locations?q=' + searchText +'&key=AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd'+ '&format=json';
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.resourceSets[0].resources.length > 0) {
          var result = data.resourceSets[0].resources[0];
          var coords = [parseFloat(result.point.coordinates[1]), parseFloat(result.point.coordinates[0])];
          map.getView().animate({center: ol.proj.fromLonLat(coords), zoom: 16});

          // Create a red location icon
          var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
          });

          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
              src: 'static/resources/images/icons8-location-50.png',
              anchor: [0.5, 0.5],
              imgSize: [50, 50],
              size: [50, 50],
              scale: 1,
              offset: [0, 0]
            })
          });

          iconFeature.setStyle(iconStyle);

          // Create a blue circle
          var circleFeature = new ol.Feature({
            geometry: new ol.geom.Circle(ol.proj.fromLonLat(coords), 500)
          });

          var circleStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'blue',
              width: 2,
              radius: 20
            }),
            fill: new ol.style.Fill({
              color: 'rgba(0, 0, 255, 0.1)'
            })
          });

          circleFeature.setStyle(circleStyle);

          // Add the features to a new vector layer
          var vectorSource = new ol.source.Vector({
            features: [iconFeature,circleFeature]
          });

          var vectorLayer = new ol.layer.Vector({
            source: vectorSource
          });

          map.addLayer(vectorLayer);
        } else {
          alert('Location not found');
        }
      });
  }
});

// End of search feature

// Start of Zoom In button Control

var zoomInButton = document.createElement('button');
zoomInButton.innerHTML = '<img src="static/resources/images/icons8-zoom-in-50.png" alt="" style="width:18px;height 18px; filter:brightness(0) invert(1);vertical-align:middle"></img>';
zoomInButton.className = 'myButton';

var zoomInElement = document.createElement('div');
zoomInElement.className = 'zoomInButtonDiv';
zoomInElement.appendChild(zoomInButton);

var zoomInControl = new ol.control.Control({
    element: zoomInElement
});

zoomInButton.addEventListener("click", () => {
    var zoom = mapView.getZoom();
    mapView.setZoom(zoom + 0.5);
});

map.addControl(zoomInControl);

// Zoom Out button
var zoomOutButton = document.createElement('button');
zoomOutButton.innerHTML = '<img src="static/resources/images/icons8-zoom-out-50.png" alt="" style="width:20px;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
zoomOutButton.className = 'myButton';

var zoomOutElement = document.createElement('div');
zoomOutElement.className = 'zoomOutButtonDiv';
zoomOutElement.appendChild(zoomOutButton);

var zoomOutControl = new ol.control.Control({
    element: zoomOutElement
});

zoomOutButton.addEventListener("click", () => {
    var zoom = mapView.getZoom();
    mapView.setZoom(zoom - 0.5);
});

map.addControl(zoomOutControl);

// End of zoom control


// start : home Control

var homeButton = document.createElement('button');
homeButton.innerHTML = '<img src="static/resources/images/home.svg" alt="" style="width:15px;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
homeButton.className = 'myButton';

var homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);

var homeControl = new ol.control.Control({
    element: homeElement
})

homeButton.addEventListener("click", () => {
    location.href = "";
})

map.addControl(homeControl);

// end : home Control

// start : full screen Control

var fsButton = document.createElement('button');
fsButton.innerHTML = '<img src="static/resources/images/fullscreen.svg" alt="" style="width:15px;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
fsButton.className = 'myButton';

var fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

var fsControl = new ol.control.Control({
    element: fsElement
})

fsButton.addEventListener("click", () => {
    var mapEle = document.getElementById("map");
    if (mapEle.requestFullscreen) {
        mapEle.requestFullscreen();
    } else if (mapEle.msRequestFullscreen) {
        mapEle.msRequestFullscreen();
    } else if (mapEle.mozRequestFullscreen) {
        mapEle.mozRequestFullscreen();
    } else if (mapEle.webkitRequestFullscreen) {
        mapEle.webkitRequestFullscreen();
    }
})

map.addControl(fsControl);

// end : full screen Control


// start : zoomIn Control

var zoomInInteraction = new ol.interaction.DragBox();

zoomInInteraction.on('boxend', function () {
    var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
    map.getView().fit(zoomInExtent);
});

var ziButton = document.createElement('button');
ziButton.innerHTML = '<img src="static/resources/images/zoomIn.svg" alt="" style="width:18px;height:18px;transform: rotate(270deg);filter:brightness(0) invert(1);vertical-align:middle"></img>';
ziButton.className = 'myButton';
ziButton.id = 'ziButton';

var ziElement = document.createElement('div');
ziElement.className = 'ziButtonDiv';
ziElement.appendChild(ziButton);

var ziControl = new ol.control.Control({
    element: ziElement
})

var zoomInFlag = false;
ziButton.addEventListener("click", () => {
    ziButton.classList.toggle('clicked');
    zoomInFlag = !zoomInFlag;
    if (zoomInFlag) {
        document.getElementById("map").style.cursor = "zoom-in";
        map.addInteraction(zoomInInteraction);
    } else {
        map.removeInteraction(zoomInInteraction);
        document.getElementById("map").style.cursor = "default";
    }
})

map.addControl(ziControl);

// end : zoomIn Control

// start : zoomOut Control

var zoomOutInteraction = new ol.interaction.DragBox();

zoomOutInteraction.on('boxend', function () {
    var zoomOutExtent = zoomOutInteraction.getGeometry().getExtent();
    map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));

    mapView.setZoom(mapView.getZoom() - 1)
});

var zoButton = document.createElement('button');
zoButton.innerHTML = '<img src="static/resources/images/zoomOut.png" alt="" style="width:18px;height:18px;transform: rotate(270deg);filter:brightness(0) invert(1);vertical-align:middle"></img>';
zoButton.className = 'myButton';
zoButton.id = 'zoButton';

var zoElement = document.createElement('div');
zoElement.className = 'zoButtonDiv';
zoElement.appendChild(zoButton);

var zoControl = new ol.control.Control({
    element: zoElement
})

var zoomOutFlag = false;
zoButton.addEventListener("click", () => {
    zoButton.classList.toggle('clicked');
    zoomOutFlag = !zoomOutFlag;
    if (zoomOutFlag) {
        document.getElementById("map").style.cursor = "zoom-out";
        map.addInteraction(zoomOutInteraction);
    } else {
        map.removeInteraction(zoomOutInteraction);
        document.getElementById("map").style.cursor = "default";
    }
})

map.addControl(zoControl);

// end : zoomOut Control

// start : Length and Area Measurement Control

var lengthButton = document.createElement('button');
lengthButton.innerHTML = '<img src="static/resources/images/measure-length.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
lengthButton.className = 'myButton';
lengthButton.id = 'lengthButton';

var lengthElement = document.createElement('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendChild(lengthButton);

var lengthControl = new ol.control.Control({
    element: lengthElement
})

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    lengthButton.classList.toggle('clicked');
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if (lengthFlag) {
        map.removeInteraction(draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }

})

map.addControl(lengthControl);

var areaButton = document.createElement('button');
areaButton.innerHTML = '<img src="static/resources/images/measure-area.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
areaButton.className = 'myButton';
areaButton.id = 'areaButton';


var areaElement = document.createElement('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendChild(areaButton);

var areaControl = new ol.control.Control({
    element: areaElement
})

var areaFlag = false;
areaButton.addEventListener("click", () => {
    // disableOtherInteraction('areaButton');
    areaButton.classList.toggle('clicked');
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if (areaFlag) {
        map.removeInteraction(draw);
        addInteraction('Polygon');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})

map.addControl(areaControl);

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue polygon, Double click to complete';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click to continue line, Double click to complete';

var draw; // global so we can remove it later

var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33',
            }),
        }),
    }),
});

map.addLayer(vector);

function addInteraction(intType) {

    draw = new ol.interaction.Draw({
        source: source,
        type: intType,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(200, 200, 200, 0.6)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
            }),
        }),
    });
    map.addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    /**
     * Currently drawn feature.
     * @type {import("../src/ol/Feature.js").default}
     */
    var sketch;

    /**
     * Handle pointer move.
     * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
     */
    var pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Click to start drawing';

        if (sketch) {
            var geom = sketch.getGeometry();
            // if (geom instanceof ol.geom.Polygon) {
            //   helpMsg = continuePolygonMsg;
            // } else if (geom instanceof ol.geom.LineString) {
            //   helpMsg = continueLineMsg;
            // }
        }

        //helpTooltipElement.innerHTML = helpMsg;
        //helpTooltip.setPosition(evt.coordinate);

        //helpTooltipElement.classList.remove('hidden');
    };

    map.on('pointermove', pointerMoveHandler);

    // var listener;
    draw.on('drawstart', function (evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        //listener = sketch.getGeometry().on('change', function (evt) {
        sketch.getGeometry().on('change', function (evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        //ol.Observable.unByKey(listener);
    });
}


/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
var helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
var helpTooltip;

/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    });
    map.addOverlay(helpTooltip);
}

// map.getViewport().addEventListener('mouseout', function () {
//     helpTooltipElement.classList.add('hidden');
// });

/**
* The measure tooltip element.
* @type {HTMLElement}
*/
var measureTooltipElement;


/**
* Overlay to show the measurement.
* @type {Overlay}
*/
var measureTooltip;

/**
 * Creates a new measure tooltip
 */

function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
    });
    map.addOverlay(measureTooltip);
}





/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
    var length = ol.sphere.getLength(line);
    var output;
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
    var area = ol.sphere.getArea(polygon);
    var output;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
};

// end : Length and Area Measurement Control
