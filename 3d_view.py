import trimesh
import numpy as np
import open3d as o3d

# Define the dimensions of the buildings and floors
building_width = 50
building_depth = 50
building_height = 200
floor_height = 20

# Define the colors for the buildings and floors
building_color = [0, 0, 1]  # blue
floor_color = [0, 0, 0]  # black

# Create the 3D models for the buildings and floors
building_models = []
for i in range(6):
    for j in range(10):
        # Create a box mesh for each floor of the building
        floor_mesh = trimesh.creation.box((building_width, building_depth, floor_height))
        # Move the floor mesh to its appropriate position within the building
        floor_mesh.apply_translation([0, 0, j * floor_height])
        # Add a black border to the floor mesh
        floor_mesh.show_edges = True
        floor_mesh.visual.vertex_colors = [floor_color] * len(floor_mesh.vertices)
        # Add the floor mesh to the building mesh
        if j == 0:
            building_mesh = floor_mesh
        else:
            building_mesh += floor_mesh
    # Add a blue color to the building mesh
    building_mesh.visual.vertex_colors = [building_color] * len(building_mesh.vertices)
    # Add the building mesh to the list of building models
    building_models.append(building_mesh)

# Define the dimensions of the streets and the buildings on each side
street_width = 500
street_depth = 50
building_spacing = 100

# Create the 3D models for the streets and buildings
street_models = []
for i in range(2):
    # Create a street mesh
    street_mesh = trimesh.creation.box((street_width, street_depth, 1))
    # Move the street mesh to its appropriate position
    street_mesh.apply_translation([0, (i * 2 - 1) * (building_spacing * 3 + street_depth) / 2, 0])
    # Add the street mesh to the list of street models
    street_models.append(street_mesh)
    for j in range(3):
        # Create a copy of the building mesh
        building_mesh = building_models[j * 2 + i].copy()
        # Move the building mesh to its appropriate position
        building_mesh.apply_translation([0, (j - 1) * building_spacing, 0])
        # Add the building mesh to the street mesh
        street_mesh += building_mesh
    # Add a blue color to the street mesh
    street_mesh.visual.vertex_colors = [building_color] * len(street_mesh.vertices)

# Combine all of the models into a single scene
scene = o3d.geometry.TriangleMesh()
for model in building_models + street_models:
    scene += model

# Visualize the scene
o3d.visualization.draw_geometries([scene])




# import trimesh
# from trimesh.viewer import SceneViewer
# import pyglet
#
# # create a scene
# scene = trimesh.Scene()
#
# # define building parameters
# num_buildings = 6
# num_floors = 10
# building_color = [0, 0, 1]  # blue
# floor_border_color = [0, 0, 0]  # black
#
# # add the buildings
# for i in range(num_buildings):
#     building_name = f"Building{i}"
#     for j in range(num_floors):
#         floor_name = f"{building_name} Floor{j}"
#         # create a box mesh for the floor
#         floor_mesh = trimesh.creation.box(extents=[10, 10, 1])
#         # translate the box to a new location
#         floor_mesh.apply_translation([i*20, 0, j*5])
#         # set the floor mesh visual properties
#         floor_mesh.visual = trimesh.visual.ColorVisuals(color=floor_border_color)
#         # add the mesh to the scene with the unique name
#         scene.add_geometry(floor_mesh, name=floor_name)
#     # create a box mesh for the building
#     building_mesh = trimesh.creation.box(extents=[10, 10, num_floors*5])
#     # translate the box to a new location
#     building_mesh.apply_translation([i*20, 0, 0])
#     # set the building mesh visual properties
#     building_mesh.visual = trimesh.visual.ColorVisuals(color=building_color)
#     # add the mesh to the scene with the unique name
#     scene.add_geometry(building_mesh, name=building_name)
#
# # add the streets
# street_color1 = [0, 0, 0]  # black
# street_color2 = [1, 1, 1]  # white
# num_buildings_per_street = 3
# for i in range(num_buildings_per_street):
#     # create a box mesh for the street
#     street_mesh1 = trimesh.creation.box(extents=[10, 1, num_floors*5])
#     street_mesh2 = trimesh.creation.box(extents=[10, 1, num_floors*5])
#     # translate the box to a new location
#     street_mesh1.apply_translation([(i+0.5)*20*num_buildings_per_street, -5, 0])
#     street_mesh2.apply_translation([(i+0.5)*20*num_buildings_per_street, 5, 0])
#     # set the street mesh visual properties
#     street_mesh1.visual = trimesh.visual.ColorVisuals(color=street_color1)
#     street_mesh2.visual = trimesh.visual.ColorVisuals(color=street_color2)
#     # add the mesh to the scene with the unique name
#     scene.add_geometry(street_mesh1, name=f"Street{i}")
#     scene.add_geometry(street_mesh2, name=f"Street{i+num_buildings_per_street}")
#
# # create a viewer with keyboard and mouse controls
# viewer = SceneViewer(scene, viewer=trimesh.viewer.gl.GLViewer)
#
# # set the camera position for a top-down view
# viewer.set_camera(angles=[-90, 0, 0], distance=150)
#
# # start the viewer
# pyglet.app.run()





# import trimesh
# from trimesh.viewer import SceneViewer
# import pyglet
#
# # create a scene
# scene = trimesh.Scene()
#
# # add 10 buildings with 20 to 25 floors each
# for i in range(10):
#     # create a box mesh for the building
#     building_mesh = trimesh.creation.box(extents=[10, 10, i*5+20])
#     # translate the box to a new location
#     building_mesh.apply_translation([i*20, 0, 0])
#     # add the mesh to the scene
#     scene.add_geometry(building_mesh)
#
# # create a viewer with keyboard and mouse controls
# viewer = SceneViewer(scene, keys='interactive')
#
# # set the camera position for a top-down view
# viewer.set_camera(angles=[-90, 0, 0], distance=50)
#
# # start the viewer
# pyglet.app.run()
