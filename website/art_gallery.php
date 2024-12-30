<?php

//Disable Caching of the document.
//Source: https://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers#answer-2068407

header("Cache-Control: no-cache, no-store, must-revalidate");//HTTP 1.1.
header("Pragma: no-cache");//HTTP 1.0.
header("Expires: 0");//Proxies.

?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Jerma Art Gallery</title>
	
	<meta name="referrer" content="origin">
	<meta name="author" content="Merlin Luntke, Twitch Lazy_Luc"/>
	<meta name="viewport" content="width=1280,height=720,initial-scale=1.0">
	<meta name="theme-color" content="#8c2f72"/>
	<meta name="robots" content="noindex, nofollow"/>
	
	<link href="./styles/styles_v117.css" rel="stylesheet" type="text/css"/>
	
	<link rel="shortcut icon" sizes="16x16" href="/images/favicon_16.png"/>
	<link rel="shortcut icon" sizes="32x32" href="/images/favicon_32.png"/>
	<link rel="shortcut icon" sizes="48x48" href="/images/favicon_48.png"/>
	<link rel="shortcut icon" sizes="64x64" href="/images/favicon_64.png"/>
	<link rel="shortcut icon" sizes="96x96" href="/images/favicon_96.png"/>
	<link rel="shortcut icon apple-touch-icon" sizes="144x144" href="/images/favicon_144.png"/>
	<link rel="shortcut icon apple-touch-icon" sizes="192x192" href="/images/favicon_192.png"/>
	
	<link rel="preload" as="font" href="./fonts/Kalam/Kalam-Regular.ttf" crossorigin>
</head>
<body>

<style>
.text_divider {
    background: linear-gradient(to right, #79206100 10%, hsl(223 50% 37% / 1) 30%, hsl(223 50% 37% / 1) 70%, #79206100 90%);
}
.is_brb #image_area {
    background-color: hsl(223 54% 20% / 1);
}
</style>


<!--  HTML  -->

<div id="container">
	<div id="image_viewer" class="is_brb">
		<div id="animation_layer_node">
			<svg id="paint_svg" width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
				<path id="animation_paint_node"></path>
			</svg>
			<svg id="paintcan_svg" width="180" height="720" xmlns="http://www.w3.org/2000/svg">
				<path d="M 117 287 L 162 278 L 168 280 L 171.5 284 L 171 312 L 169 350 L 174 351 L 180 353 L 180 365 L 176 367 L 173 370 L 172 373 L 173 376 L 172 379 L 168 381 L 163 382 L 153 382 L 149 381 L 144 379 L 141 378 L 137 378 L 132 378 L 129 379 L 125 381 L 122 383 L 119 384 L 111 384 L 107 381 L 104 378 L 99 376 L 93 374 L 88 373 L 75 373 L 69 372 L 66 371 L 64 369 L 63 368 L 64 365 L 65 363 L 66 362 L 69 360 L 71 359 L 75 357.5 L 77 356.5 L 86 356 Z"></path>
			</svg>
			<div id="animation_germ_node"></div>
			<div id="animation_paint_can"></div>
			<svg id="hat_layer" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
				<path id="hat_area" d="M 10 111 S 7 104 19 92 S 29 85 35 81 S 46 75 50 73 S 57 70 63 68 S 79 67 56 86 S 46 90 19 112 Q 14 116 10 111 Z"></path>
				<path id="hat_peak" d="M 32 82 S 27 83 28 76 S 36 74 33 81 Z"></path>
				<path id="hat_debug" d="" style="fill: rgb(0 0 0);display: none;"></path>
			</svg>
			<svg id="transition_svg" width="1080" height="720" xmlns="http://www.w3.org/2000/svg">
				<clipPath id="transition_clippath">
					<path id="transition_path_node"></path>
				</clipPath>
			</svg>
		</div>
		<div id="navigation">
			<div id="menu_button_area"></div>
			<div class="text_container">
				<div class="text_aligner">
					<div class="text_user"></div>
					<div class="text_divider"></div>
					<div class="text_description"></div>
				</div>
			</div>
			<svg width="210" height="720" xmlns="http://www.w3.org/2000/svg" style="position: absolute;top: 0px;right: 0px;">
				<defs>
					<filter id="svg_filter_shadow">
						<feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="#000000" flood-opacity="0.4"></feDropShadow>
					</filter>
				</defs>
				
				<path d="M 12 0 L 12 720 L 210 720 L 210 0" style="fill: rgb(140 47 114);fill: hsl(223 50% 37% / 1);"></path>
				<path d="M 12 0 L 12 55 L 12 113 L 12 168 L 11 221 L 13 270 L 12 314 L 13 353 L 14 403 L 13 445 L 14 489 L 14 535 L 15 575 L 14 612 L 13 656 L 14 685 L 13 714 L 14 717 L 32 717 L 53 716 L 71 716 L 102 715 L 123 715 L 143 716 L 173 716 L 194 717 L 208 718 L 208 683 L 206 649 L 207 616 L 206 578 L 208 540 L 207 514 L 206 477 L 204 445 L 207 411 L 205 398 L 174 399 L 153 396 L 123 397 L 92 396 L 63 395 L 46 395 L 29 396 L 14 394" style="stroke-width: 15px;stroke: #792061;fill: rgb(99 27 82);fill: hsl(223 57% 25% / 1);stroke: hsl(223 58% 30% / 1);"></path>
				
				<g filter="url(#svg_filter_shadow)" style="stroke-width: 5px;stroke: #0f676f;fill: #0e97a3;transform: translate(0px, -3px);">
					<path d=" M 44 37 L 44 25 L 99 22 L 102 35 L 85 38 L 78 106 L 61 107 L 63 40 Z" style="transform: translate(98px, 0px);"></path>
					<path d="M 96 106 L 112 106 L 112 77 L 134 105 L 145 92 L 123 67 L 134 69 L 150 48 L 129 24 L 97 23 Z M 108 53 L 109 38 L 126 38 L 131 47 L 124 55 Z" style="transform: translate(-5px, 0px);"></path>
					<path d=" M 34 107 L 64 24 L 81 24 L 100 108 L 82 108 L 77 87 L 59 83 L 51 110 Z M 61 66 L 78 68 L 71 43 Z" style="transform: translate(-13px, 0px);"></path>
				</g>
			</svg>
		</div>
		<div id="image_area">
			
		</div>
	</div>
	<div id="menu_container">
		<div class="settings_container"></div>
		<div class="thumbnail_container"></div>
	</div>
	<div id="theater_curtain">
		<div id="error_text">
			There was an error loading the BRB screen assets :(
		</div>
		<svg id="brush_paint_svg" width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
			<path id="curtain_left"></path>
			<path id="curtain_right"></path>
		</svg>
	</div>
</div>


<!--  Scripts  -->


<script src="./submissions_v153.js"></script>

<script src="./scripts/scripts_v117.js"></script>
<script>
debug_enabled = false;
</script>


</body>
</html>