
### BRB Art Screen

This is a Code-Showcase for my résumé and not intended for use by anyone. [Here is a video](https://youtu.be/PBCq9aa4iSE) to show it in use. It was used by Jerma985 as an Art Showcase screen during breaks in his Livestream. It was made using JavaScript, Node.js and a little bit of PHP (of course HTML and CSS as well). The code uploaded here is incomplete and does not represent the entire project, scripts have been joined into one file. Art was made by YenWenLen.

The animation of the character on the right is done by moving the displayed area on a sprite sheet 15 times per second. The transition animation of the art is meant to look like flowing ink and is implemented using a CSS clip-path and a lot of SVG images as frames. I created this animation by creating my own simple animation software in the file [animation/draw_map.html](animation/draw_map.html). It allows for playblack of the whole animation, moving frame by frame and drawing of SVGs using the mouse. The previous frame can be seen at the same time to assist with drawing the next frame.

User submitted art was manually saved and added to a list of submissions. The Node.js-script [compile_images.js](compile_images.js) would then be executed. This file would process only new or changed source files to optimize the execution speed. Any image would be resized to the display size on the Livestream using the npm package Sharp. The Node.js-script [cl_handle_file.js](cl_handle_file.js) would be spawned as a child-process to handle images, because of a memory-leak in the Sharp version in use.
