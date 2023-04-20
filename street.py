import folium
import requests

# Define the Bing Maps API endpoint and parameters
endpoint = "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/"
api_key = "AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd"

# Initialize the folium map
m = folium.Map(location=[0, 0], zoom_start=2)


# Define a callback function to handle map click events
def on_map_click(event):
    # Get the clicked location from the event
    lonlat = event['latlng']
    lat, lon = lonlat[::-1]

    # Construct the URL for the street view image
    url = f"{endpoint}{lat},{lon}/0?heading=0&key={api_key}"

    # Send a GET request to the API endpoint to retrieve the image data
    response = requests.get(url)

    # Get the image data from the response
    image_data = response.content

    # Add a marker to the map at the clicked location with the street view image as its icon
    marker = folium.Marker(location=lonlat, icon=folium.features.CustomIcon(image_data, icon_size=(640, 480)))
    marker.add_to(m)


# Register the callback function for map click events
m.add_child(folium.ClickForMarker(popup=None, callback=on_map_click))

# Display the map
m

# import folium
# import requests
#
# # Define the Bing Maps API endpoint and parameters
# endpoint = "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/"
# api_key = "AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd"
#
# # Initialize the folium map
# m = folium.Map(location=[0, 0], zoom_start=2)
#
# # Define a callback function to handle map click events
# def on_map_click(event):
#     # Get the clicked location from the event
#     lonlat = event.latlng
#     lat, lon = lonlat[::-1]
#
#     # Construct the URL for the street view image
#     url = f"{endpoint}{lat},{lon}/0?heading=0&key={api_key}"
#
#     # Send a GET request to the API endpoint to retrieve the image data
#     response = requests.get(url)
#
#     # Get the image data from the response
#     image_data = response.content
#
#     # Add a marker to the map at the clicked location with the street view image as its icon
#     marker = folium.Marker(location=lonlat, icon=folium.features.CustomIcon(image_data, icon_size=(640, 480)))
#     m.add_child(marker)
#
# # Register the callback function for map click events
# m.add_child(folium.plugins.ScrollZoomToggler())
# m.add_child(folium.plugins.Fullscreen())
# m.add_child(folium.plugins.LocateControl())
# m.add_child(folium.plugins.Search())
# m.add_child(folium.plugins.Draw(export=True))
# m.add_child(folium.plugins.EasyButton('fa-globe',callback=on_map_click,title='Click to get Street View'))
#
# # Display the map
# m


# import requests
#
# # Bing Maps API endpoint for street-side imagery
# url = 'https://dev.virtualearth.net/REST/v1/Imagery/Map/Birdseye/'
#
# # Bing Maps API key
# api_key = 'AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd'
#
# # Location to retrieve street-side imagery for (latitude, longitude)
# location = '47.60357,-122.32945'
#
# # Zoom level for the street-side imagery (range from 17 to 21)
# zoom = 18
#
# # Parameters for the API request
# params = {
#     'key': api_key,
#     'mapSize': '800,600',  # size of the street-side image
#     'heading': '0',  # compass heading of the camera (0-359 degrees)
#     'pitch': '0',  # pitch angle of the camera (-90 to 90 degrees)
#     'fov': '90',  # field of view of the camera (1-120 degrees)
#     'center': location,
#     'zoomLevel': zoom,
#     'style': 'r',  # 'r' for bird's eye view
# }
#
# # Send a GET request to the Bing Maps API with the specified parameters
# response = requests.get(url, params=params)
#
# # Save the street-side image to a file
# with open('street_view.jpg', 'wb') as f:
#     f.write(response.content)


# import json
# import requests
# from openlayers import Map, View, Feature, Point
# from openlayers.source import OSM
# from openlayers.layer import Tile, Vector
# from openlayers.style import Icon
#
# # Define the Bing Maps API endpoint and parameters
# endpoint = "https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/"
# api_key = "YOUR_BING_MAPS_API_KEY"
#
# # Initialize the OpenLayers map
# view = View(center=[0, 0], zoom=2)
# map = Map(view=view)
#
# # Add an OSM tile layer to the map
# osm_layer = Tile(source=OSM())
# map.add_layer(osm_layer)
#
# # Add a vector layer for displaying the clicked point
# vector_layer = Vector()
# map.add_layer(vector_layer)
#
# # Define a callback function to handle map click events
# def on_map_click(event):
#     # Get the clicked location from the event
#     lonlat = event.coordinate
#     lat, lon = lonlat[::-1]
#
#     # Construct the URL for the street view image
#     url = f"{endpoint}{lat},{lon}/0?heading=0&key={api_key}"
#
#     # Send a GET request to the API endpoint to retrieve the image data
#     response = requests.get(url)
#
#     # Decode the response JSON and extract the image URL
#     data = json.loads(response.text)
#     image_url = data["resourceSets"][0]["resources"][0]["imageUrl"]
#
#     # Add the clicked point to the vector layer
#     feature = Feature(geometry=Point(lonlat))
#     feature.style = Icon(src=image_url, anchor=[0.5, 0.5])
#     vector_layer.clear()
#     vector_layer.add_feature(feature)
#
# # Register the callback function for map click events
# map.on("click", on_map_click)
#
# # Display the map
# map.show()
#
