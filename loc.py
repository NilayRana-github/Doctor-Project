# By microsoft bing api

import requests

# location = "Rana street vaniyawad killapardi district: valsad" # replace with your location name

location = "NIMHANS, Dr M H Marigowda Rd, Hombegowda Nagar, Bengaluru, Karnataka 560029"
# location = "Bengaluru, Karnataka" # replace with your location name

# location = "WHPR+XR3, 1st Block, Siddapura, Jayanagar, Bengaluru, Karnataka 560029" # replace with your location name
bing_maps_api_key = "AoOruZG9yQNqu7fz6oTERwqYNzFDTMGiqUsqowL7XFgNhx2KOcwWBoqmkkvGaUZd" # replace with your Bing Maps API key

url = f"https://dev.virtualearth.net/REST/v1/Locations?q={location}&key={bing_maps_api_key}"
response = requests.get(url).json()

coordinates = response["resourceSets"][0]["resources"][0]["point"]["coordinates"]
latitude = coordinates[0]
longitude = coordinates[1]
print(f"Latitude: {latitude}, Longitude: {longitude}")


## This is Nominatim

# from geopy.geocoders import Nominatim
#
# geolocator = Nominatim(user_agent="my-app")
# # location = geolocator.geocode("Bellary Road, Bengaluru, Karnataka 560004, india")
# # location = geolocator.geocode("Hosur Road, Bangalore, Karnataka, India")
# # location = geolocator.geocode("98, Hal Airport Road, Bangalore, Karnataka, India")
# # location = geolocator.geocode("Bannerghatta Road, Bangalore, Karnataka, India")
# location = geolocator.geocode("NIMHANS Bengaluru, 8th Main Road, 2nd Block, Someshwara Nagar, Jayanagar, Bengaluru, Karnataka")
#
#
# print(location.latitude, location.longitude)


