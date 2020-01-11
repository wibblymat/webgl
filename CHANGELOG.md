# Changelog

## v2.0.0
- (**Breaking**) Boil down the Renderable and Renderer to basics
  - No longer 2D specific
  - Made the old Renderable2D into a sublass called SimplerRenderable2D
- Make the renderer context public so that games can bind things to it
- Add the ability to set a vec2 uniform
- Allow data textures to be updated, and to have any internal format
- Make mipmapping optional
- Fix some bugs

## v1.0.0
Initial release. Some basic helpers, mostly only suitable for 2D rendering, distilled out of games I have made.
