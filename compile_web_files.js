"use strict";
//
//    Compile
//
//Compiles the files into a single JavaScript and CSS file, which will have to
//be minified. See "./minifying.txt" for information about how to do that. The
//files will be saved under "../scripts_v[version].js" and
//"../styles_v[version].css". If those files and their ".min" variants already
//exist this will throw an error, as an unchanged version may cause cache
//related issues.
//


//  Variables  //

let version = 117;

//The order of some of these JavaScript files relative to others matters.
let script_files = [
"./scripts/api/get_last_file.js",
"./scripts/api/set_last_file.js",
"./scripts/api/get_settings.js",
"./scripts/api/set_settings.js",

"./scripts/general/functions.js",
"./scripts/general/get_formatting_object.js",
"./scripts/general/settings.js",
"./scripts/general/variables.js",
"./scripts/general/visibility_change.js",

"./scripts/animation/data.js",
"./scripts/animation/animation.js",
"./scripts/image_viewer/automatic_timer.js",
"./scripts/image_viewer/hat_artist.js",
"./scripts/image_viewer/image_viewer.js",
"./scripts/image_viewer/set_paint_color.js",
"./scripts/image_viewer/transition.js",
"./scripts/menu/menu.js",
"./scripts/thumbnail_gallery/thumbnail_gallery.js",

"./scripts/main.js"
];

let style_files = [
"./styles/general.css",
"./styles/hat_artist.css",
"./styles/image_viewer.css",
"./styles/loading_screen.css",
"./styles/menu.css"
];


//  Compiling Variables  //

const fs = require("fs");

let remove_debug_regex = /\/\/\[debug_start\](.*?)\/\/\[debug_end\]/gs;
let remove_strict_regex = /\"use strict\";/g;

//Takes a script string and returns it with debug code removed and a single
//"use strict"; expression, at the start.
let get_cleaned_up_script = function(text){
	let strict_text = "\"use strict\";\n";
	
	text = text.replace(remove_debug_regex, "");
	
	text = text.replace(remove_strict_regex, "");
	
	return (strict_text + text);
};

let scripts_file_path = ("./webpage/scripts_v" + version + ".js");
let scripts_min_file_path = ("./webpage/scripts_v" + version + ".min.js");
let styles_file_path = ("./webpage/styles_v" + version + ".css");
let styles_min_file_path = ("./webpage/styles_v" + version + ".min.css");


//  Check For Existing Files  //

let errors = [];

if(fs.existsSync(scripts_file_path)){
	errors.push("The scripts file version " + version + " is already in use.");
}
if(fs.existsSync(scripts_min_file_path)){
	errors.push("The scripts minified file version " + version + " is already in use.");
}
if(fs.existsSync(styles_file_path)){
	errors.push("The styles file version " + version + " is already in use.");
}
if(fs.existsSync(styles_min_file_path)){
	errors.push("The styles minified file version " + version + " is already in use.");
}

if(errors.length > 0){
	for(let error of errors){
		console.log(error);
	}
	console.log("\nIncrease the version number to fix this issue.");
	
	process.exitCode = 1;
	return;
}


//  Compiling  //

//Scripts

let scripts_text = "";

for(let file_name of script_files){
	scripts_text += fs.readFileSync(file_name, {
		encoding: "utf8"
	});
}

let scripts_cleaned_text = get_cleaned_up_script(scripts_text);

fs.writeFile(scripts_file_path, scripts_cleaned_text, function(error){
	if(error){
		throw error;
	} else {
		console.log("Saved the scripts file.");
	}
});

//Styles

let style_text = "";

for(let file_name of style_files){
	style_text += fs.readFileSync(file_name, {
		encoding: "utf8"
	});
}

fs.writeFile(styles_file_path, style_text, function(error){
	if(error){
		throw error;
	} else {
		console.log("Saved the styles file.");
	}
});

//Empty minified versions
/*
fs.writeFile(scripts_min_file_path, "", function(error){
	if(error){
		throw error;
	} else {
		console.log("Created the empty scripts minified file.");
	}
});

fs.writeFile(styles_min_file_path, "", function(error){
	if(error){
		throw error;
	} else {
		console.log("Created the empty styles minified file.");
	}
});
*/