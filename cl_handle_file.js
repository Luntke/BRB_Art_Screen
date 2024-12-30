"use strict";
//
//    File Exists
//
//Takes a file path and returns a boolean if the path points to an existing
//file.
//

let file_exists = function(file_path){
	let path_is_valid = fs.existsSync(file_path);
	
	if(path_is_valid === false){
		return false;
	}
	
	let path_is_file = fs.statSync(file_path).isFile();
	
	return path_is_file;
};
"use strict";
//
//    Create Folder
//
//Takes an absolute file path and an optional options object and resolves when
//the folder has been created. Regardless of options, if the folder already
//exists no error is thrown.
//
//
//The optional options argument is an object which looks like this:
//
//{
//    recursive: [Boolean] (optional)
//        A boolean indicating if all parent folders should be created as well.
//        When not set it defaults to false and an error is thrown if the folder
//        you want to create will be in a folder which does not exist.
//            Default: false
//}
//

let create_folder = function(file_path, _options){
	//  Arguments  //
	
	let options = {
		recursive: false
	};
	
	if(is_object(_options)){
		if(is_boolean(_options.recursive)){
			options.recursive = _options.recursive;
		}
	}
	
	//  Creating Folder  //
	
	return new Promise(function(resolve, reject){
		try {
			fs.mkdir(file_path, options, function(error){
				if(error){
					if(error.syscall === "mkdir"
					&& error.code === "EEXIST"){
						resolve();
					} else {
						reject(error);
					}
					return;
				}
				
				resolve();
			});
		} catch(error){
			reject(error);
		}
	});
};
"use strict";
//
//    Get Absolute Path
//
//Takes a relative file path and returns an absolute path which is independent
//of the working directory of the command line. If the given path does not start
//with a dot an error is thrown.
//

let get_absolute_path = function(relative_path){
	if(!relative_path.startsWith(".")){
		throw new Error("Value given to get_absolute_path is not a relative path.");
	}
	
	return path.resolve(__dirname, relative_path);
};
"use strict";
//
//    Copy File
//
//Takes a source path and target path, copies the source file to the target
//location and returns a promise which resolves with no value on success. If the
//source path does not exist or another error occured the promise rejects with
//an error.
//

let copy_file = function(source_path, target_path){
	return new Promise(function(resolve, reject){
		try {
			fs.copyFile(source_path, target_path, function(error){
				if(error){
					reject(error);
					return;
				}
				
				resolve();
			});
		} catch(error){
			reject(error);
		}
	});
};

"use strict";
//
//    Get Buffer From File
//
//Takes a file path and resolves with the buffer of that file.
//

let get_buffer_from_file = function(file_path){
	return new Promise(function(resolve, reject){
		fs.readFile(file_path, function(error, buffer){
			if(error){
				reject(error);
			} else {
				resolve(buffer);
			}
		})
	});
};
"use strict";
//
//    Write Buffer To File
//
//Takes a buffer (or string) and a file path and returns a promise that resolves
//when the data has been written to the file. An error is thrown if the folder
//in which the file should be written to does not exist.
//

let write_buffer_to_file = function(data, file_path){
	return new Promise(function(resolve, reject){
		fs.writeFile(file_path, data, function(error){
			if(error){
				reject(error);
			} else {
				resolve();
			}
		});
	});
};
"use strict";
//
//    Get String From File
//
//Takes a file path to a file and resolves with the file content as a string.
//

let get_string_from_file = function(file_path){
	return new Promise(function(resolve, reject){
		let options = {
			encoding: "utf8"
		};
		
		fs.readFile(file_path, options, function(error, string){
			if(error) {
				reject(error);
			} else {
				resolve(string);
			}
		});
	});
};

"use strict";
//
//    Write String To File
//
//Takes a string (or buffer) and a file path and returns a promise that resolves
//when the data has been written to the file. An error is thrown if the folder
//in which the file should be written to does not exist.
//

let write_string_to_file = function(data, file_path){
	return new Promise(function(resolve, reject){
		fs.writeFile(file_path, data, function(error){
			if(error){
				reject(error);
			} else {
				resolve();
			}
		});
	});
};

"use strict";
//
//    Get Files In Folder
//
//Takes a file path and returns an array of file paths that point to existing
//files in the given file path. If the given file path does not point to an
//existing folder then an error is thrown.
//

let get_files_in_folder = function(file_path){
	//  Check Arguments  //
	
	let is_folder = folder_exists(file_path);
	
	if(!is_folder){
		throw "The given file path did not point to an existing folder.";
	}
	
	//  Read Directory  //
	
	let options = {
		encoding: "utf8",
		withFileTypes: true
	};
	
	let directory_data = fs.readdirSync(file_path, options);
	
	let file_list = [];
	
	for(let folder_object of directory_data){
		if(folder_object.isFile()){
			file_list.push(folder_object.name);
		}
	}
	
	//  Return  //
	
	return file_list;
};
"use strict";
//
//    Folder Exists
//
//Takes a file path and returns a boolean if the path points to an existing
//folder.
//

let folder_exists = function(file_path){
	let path_is_valid = fs.existsSync(file_path);
	
	if(path_is_valid === false){
		return false;
	}
	
	let path_is_folder = fs.statSync(file_path).isDirectory();
	
	return path_is_folder;
};





"use strict";
//
//    Load Modules
//
//Loads all Node.js modules which are required for this project.
//

//Used to interact with the file system.
const fs = require("fs");

//Used to get information about the currently running process.
const process = require("process");

//Used to resolve file paths to the correct directory independent of the working
//directory of the command line.
const path = require("path");

//Used to compress and uncompress data in combination with reading from or
//writing to the file system.
const zlib = require("zlib");

//Used to read, write and edit various image formats.
const sharp = require("sharp");


const child_process = require("child_process");
const util = require("util");
const exec_promisified = util.promisify(child_process.exec);







"use strict";
//
//    Get Average Color
//
//The given object has to be a raw sharp object with data and info properties by
//getting the buffer of a raw image with the resolveWithObject option set to
//true. The return value is an array with the RGB values of the average color.
//Each color is weighted by its alpha value, so that a transparent pixel has
//less influence on the average color than an opaque pixel. Due to how color
//values are stored in computers you can get a better average color brightness
//by taking the square root of the average of the sum of the squares of all
//color values. See this video for more information:
//    https://www.youtube.com/watch?v=LKnqECcg6Gw
//
//
//The given object has to have these properties:
//    data: [Buffer]
//        A buffer with the image data.
//    info: {
//        format: [String]
//            Has to be set to "raw".
//        width: [Number]
//            The number of horizontal pixels of the image.
//        height: [Number]
//            The number of vertical pixels of the image.
//        channels: [Number]
//            The amount of channels used in the data buffer. It is 3 if there
//            is no alpha channel and 4 if there is one.
//        premultiplied: [Boolean]
//            A boolean indicating if the rgb values of the buffer have been
//            multiplied by the alpha value. If it is set to true we need to
//            divide each pixel's color values by its alpha to get the actual
//            color values.
//        size: [Number]
//            The total size of the data buffer in bytes. It is equal to the
//            width times height times channels.
//    }
//
//The returned array has these indeces:
//    index 0: red   [Number]
//        A number between 0 and 255.
//    index 1: green [Number]
//        A number between 0 and 255.
//    index 2: blue  [Number]
//        A number between 0 and 255.
//

let get_average_color = function(object){
	//  Check Arguments  //
	
	let data = object.data;
	let info = object.info;
	
	if(info.format !== "raw"){
		throw new Error("The given image data is not in the raw format.");
	}
	
	
	//  Variables  //
	
	let red = 0;
	let green = 1;
	let blue = 2;
	let alpha = 3;
	
	
	//  Functions  //
	
	let get_rooted_color_normal = function(squared_value){
		return (
			Math.round(
				Math.sqrt(
					(squared_value / total_pixel)
				)
			)
		);
	};
	
	let get_rooted_color_alpha = function(squared_value){
		if(total_alpha === 0){
			return 0;
		}
		
		return (
			Math.round(
				Math.sqrt(
					((squared_value * 255) / total_alpha)
				)
			)
		);
	};
	
	let get_color_weight = function(color){
		return (color ** 2);
	};
	
	let get_color_weight_alpha = function(color, alpha){
		alpha = (alpha / 255);
		
		return ((color ** 2) * alpha);
	};
	
	
	//  Calculation  //
	
	let channels = info.channels;
	let total_pixel = (data.length / channels);
	let total_alpha = 0;
	
	let squared_red = 0;
	let squared_green = 0;
	let squared_blue = 0;
	
	let get_rooted_color;
	
	
	//We can ignore premultiplication as Sharp doesn't return the values that
	//way.
	if(channels === 3){
		get_rooted_color = get_rooted_color_normal;
		
		for(let i = 0;i < data.length;i += channels){
			squared_red += get_color_weight(data[i + red]);
			squared_green += get_color_weight(data[i + green]);
			squared_blue += get_color_weight(data[i + blue]);
		}
	} else if(channels === 4){
		get_rooted_color = get_rooted_color_alpha;
		
		for(let i = 0;i < data.length;i += channels){
			total_alpha += data[i + alpha];
			
			squared_red += get_color_weight_alpha(
				data[i + red],
				data[i + alpha]
			);
			squared_green += get_color_weight_alpha(
				data[i + green],
				data[i + alpha]
			);
			squared_blue += get_color_weight_alpha(
				data[i + blue],
				data[i + alpha]
			);
		}
	} else {
		throw new Error("Unknown amount of channels.");
	}
	
	/*
	console.log("squared: ", squared_red, squared_green, squared_blue);
	console.log("total pixel: ", total_pixel);
	if(channels === 4){
		console.log("total alpha: ", total_alpha);
		console.log("total visible pixel: ", (total_alpha / 255));
	}
	*/
	
	return ([
		get_rooted_color(squared_red),
		get_rooted_color(squared_green),
		get_rooted_color(squared_blue)
	]);
};

let get_target_dimensions = function(width_source, height_source, width_max, height_max){
	let is_valid_input = function(value){
		return (
		    typeof value === "number"
		&&  value > 0
		&&  value % 1 === 0
		);
	};
	
	if(!is_valid_input(width_source)
	|| !is_valid_input(height_source)
	|| !is_valid_input(width_max)
	|| !is_valid_input(height_max)){
		throw new Error("Invalid dimensions given.");
	}
	
	
	if(width_source <= width_max
	&& height_source <= height_max){
		return ({
			width: width_source,
			height: height_source
		});
	}
	
	let width;
	let height;
	
	if((width_source / height_source) > (width_max / height_max)){
		//Image is too wide.
		
		width = width_max;
		height = Math.ceil(height_source * width_max / width_source);
		
	} else {
		//Image has correct dimensions or is too tall.
		
		width = Math.ceil(width_source * height_max / height_source);
		height = height_max;
		
	}
	
	return ({
		width: width,
		height: height
	});
};

let sleep = function(milliseconds){
	return new Promise(function(resolve, reject){
		setTimeout(resolve, milliseconds);
	});
};

let is_object = function(value){
	return (Object(value) === value);
};

let hasOwnProperty = function(object, property){
	return Object.prototype.hasOwnProperty.call(object, property);
};

let is_boolean = function(value){
	return (typeof value === "boolean");
};




let get_metadata = function(image){
	return new Promise(function(resolve, reject){
		image.metadata()
		.then(function(metadata){
			resolve(metadata);
		})
		.catch(function(error){
			reject(error)
		});
	});
};


"use strict";
//
//    Get Command Line Arguments
//
//Returns the array of command line arguments given to the script. All command
//line arguments given to Node.js after the argument of the JavaScript file to
//execute are command line arguments for that JavaScript file. The argumnts of
//the command are split by whitespace except for whitespace quoted by quotation
//marks (for example "a b"). Note that the "&" character has a special meaning
//in the command line and using an unquoted URL as an argument may run undesired
//commands, from simply invalid commands to shutting down your PC to worse.
//

let get_command_line_arguments = function(){
	//The first element of process.argv is the path to Node.js. The second
	//element is the path to the JavaScript file being executed. All remaining
	//elements are command line arguments given to the script.
	let command_line_arguments = process.argv.slice(2);
	
	return command_line_arguments;
};


let get_image_data = function(path){
	return new Promise(function(resolve, reject){
		try {
			sharp(path)
			.raw()
			.toBuffer(function(error, buffer, info){
				if(error){
					reject(error)
				} else {
					resolve({
						buffer: buffer,
						info: info
					});
				}
			});
		} catch(error){
			reject(error)
		}
	});
};



/*
let handle_image = async function(){
	//  Create Small Thumbnail  //
	
	let thumbnail_background_color = "#773159";
	
	await sharp(source_file)
	.resize({
		width: 128,
		height: 128,
		fit: "contain",
		kernel: "lanczos3",
		background: thumbnail_background_color
	})
	.flatten({
		background: thumbnail_background_color
	})
	.jpeg({
		quality: 80
	})
	.toFile(target_thumbnail_small, function(error){
		if(error){
			console.log(error);
		} else {
			console.log("Done file " + id);
		}
	});
	
	
	//  Create Resized Image  //
	
	let source_width = file_data[id].original_width;
	let source_height = file_data[id].original_height;
	let width_max = 1080;
	let height_max = 720;
	
	if(source_width <= width_max
	&& source_height <= height_max){
		let buffer = await get_buffer_from_file(source_file);
		await write_buffer_to_file(buffer, target_resized);
		
		//If the file doesn't have to be resized make it an empty file so
		//that the file can be skipped next time. It's a bit of a hack.
		//await write_string_to_file("", target_resized);
	} else if(data.type === "gif"){
		let target_sizes = get_target_dimensions(
			source_width,
			source_height,
			width_max,
			height_max
		);
		
		//Solution from Superusers:
		//    https://superuser.com/a/1362406
		//
		//This makes the resized image look better than when Chrome resizes
		//it, however for some GIFs the file size increases. The increase
		//doesn't seem significant.
		
		let command = `ffmpeg -hide_banner -v warning -i ${source_file} -filter_complex "[0:v] scale=${target_sizes.width}:${target_sizes.height}:flags=lanczos,split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse" ${target_resized}`;
		
		const {stdout, stderr} = await exec(command);
		//console.log("stdout:", stdout);
		//console.log("stderr:", stderr);
		console.log("Done file " + id);
	} else if(data.type === "png"){
		await sharp(source_file)
		.resize({
			width: width_max,
			height: height_max,
			fit: "inside",
			kernel: "lanczos3"
		})
		.png()
		.toFile(target_resized, function(error){
			if(error){
				console.log(error);
			} else {
				console.log("Done file " + id);
			}
		});
	} else {
		await sharp(source_file)
		.resize({
			width: width_max,
			height: height_max,
			fit: "inside",
			kernel: "lanczos3"
		})
		.jpeg({
			quality: 95
		})
		.toFile(target_resized, function(error){
			if(error){
				console.log(error);
			} else {
				console.log("Done file " + id);
			}
		});
	}
	
	
	//  Get Average Color  //
	
	let file_normal = await sharp(source_file)
	.resize({
		width: 128,
		height: 128,
		fit: "inside",
		kernel: "lanczos3"
	})
	.raw()
	.toBuffer({
		resolveWithObject: true
	});
	
	file_data[id].average_color = get_average_color(file_normal);
};
*/




"use strict";
//
//    Delete File Sync
//
//Takes a file path and deletes it synchronously from the disk.
//

let delete_file_sync = function(file_path){
	fs.unlinkSync(file_path);
};








//The returned object has these properties:
//    base_name: [String]
//        The file name without the extension.
//    id: [String]
//        Same as the base name.
//    extension: [String]
//        The extension part of the file name. Note that this does not include
//        the point between the base name and extension.
//    full_name: [String]
//        The full file name made up of the base name and extension.
//    absolute_path: [String]
//        The absolute path to the file.
let get_file_name_info = function(file_name){
	let base_name;
	let extension;
	
	let last_point_index = file_name.lastIndexOf(".");
	
	if(last_point_index >= 0){
		base_name = file_name.substring(0, last_point_index);
		extension = file_name.substring(last_point_index + 1);
	} else {
		base_name = file_name;
		extension = "";
	}
	
	return ({
		base_name: base_name,
		id: base_name,
		extension: extension,
		full_name: file_name,
		absolute_path: (source_folder + "/" + file_name)
	});
};

let valid_extensions = new Set([
	"png",
	"jpg",
	"gif",
	"webm",
	"mp4"
]);

let is_video_map = {
	"png": false,
	"jpg": false,
	"gif": false,
	"webm": true,
	"mp4": true
};

let extension_to_resize_map = {
	"png": "png",
	"jpg": "png",
	"gif": "gif",
	"webm": "webm",
	"mp4": "mp4"
};


let width_max = 1080;
let height_max = 720;
let thumbnail_width = 128;
let thumbnail_height = 128;
let thumbnail_quality = 80;
let thumbnail_background = "#773159";



let file = null;
//This is either the source image or the first frame of the gif or video.
let image = null;
//An object with a data and info property where the data is the image buffer.
let image_object = null;
let is_video = false;
let average_color = [0, 0, 0];
let file_width = 0;
let file_height = 0;


//The location for ffmpeg to temporarily store the first frame of a video.
let video_first_frame_path = get_absolute_path(
	"./data/__video_first_frame__.png"
);

let source_folder = get_absolute_path("./images/gallery");
let target_resize_folder = get_absolute_path("./images/gallery_resized");
let target_thumbnail_folder = get_absolute_path("./images/thumbnails");
let target_new_resize_folder = get_absolute_path("./new_images/gallery_resized");
let target_new_thumbnail_folder = get_absolute_path("./new_images/thumbnails");




let load_image = async function(){
	is_video = is_video_map[file.extension];
	
	if(is_video){
		await video_extract_first_frame();
		
		image = await sharp(video_first_frame_path);
	} else {
		image = await sharp(file.absolute_path);
	}
	
	await parse_file_dimensions();
};

let parse_file_dimensions = async function(){
	let {error, data, info} = await image.clone()
	.raw()
	.toBuffer({
		resolveWithObject: true
	});
	
	if(error){
		throw error;
	}
	
	file_width = info.width;
	file_height = info.height;
};

let load_average_color = async function(){
	let image_object = await image.clone()
	.resize({
		width: 128,
		height: 128,
		fit: "inside",
		kernel: "lanczos3"
	})
	.raw()
	.toBuffer({
		resolveWithObject: true
	});
	
	average_color = get_average_color(image_object);
};

let video_extract_first_frame = async function(){
	let spawn_command = "ffmpeg";
	
	let spawn_arguments = [
		"-i", file.absolute_path,
		
		"-hide_banner",
		"-loglevel", "warning",
		"-frames:v", "1",
		"-f", "image2",
		"-y",
		
		video_first_frame_path
	];
	
	let spawn_options = {
		"detached": false,
		"serialization": "json",
		"shell": false,
		"windowsHide": true
	};
	
	let child_data = await child_process.spawnSync(
		spawn_command,
		spawn_arguments,
		spawn_options
	);
	
	if(child_data.status !== 0){
		console.log(String(child_data.stdout));
		console.log(String(child_data.stderr));
		throw "Error extracting first frame of video.";
	}
};


let create_thumbnail = async function(){
	let target_extension = "jpg";
	
	let source_path = file.absolute_path;
	let target_path = (
		`${target_thumbnail_folder}/${file.id}_thumbnail.${target_extension}`
	);
	let target_new_path = (
		`${target_new_thumbnail_folder}/${file.id}_thumbnail.${target_extension}`
	);
	
	
	//Both resize and flatten need to set the background color to cover the
	//entirety of the new image. Using resize with fit "contain" can create
	//letterboxing which extends the image boundaries to the desired size.
	//Resize's background value only affects the extended area. Flatten's
	//background value only affects the background on the original image area.
	//They both default to black if not set.
	await image.clone()
	.resize({
		width: thumbnail_width,
		height: thumbnail_height,
		fit: "contain",
		kernel: "lanczos3",
		background: thumbnail_background
	})
	.flatten({
		background: thumbnail_background
	})
	.jpeg({
		quality: thumbnail_quality
	})
	.toFile(target_path);
	
	
	//  Copy To New Folder  //
	
	await copy_file(target_path, target_new_path);
};


let resize_file = async function(){
	let target_extension = extension_to_resize_map[file.extension];
	
	let source_path = file.absolute_path;
	let target_path = (
		`${target_resize_folder}/${file.id}_resized.${target_extension}`
	);
	let target_new_path = (
		`${target_new_resize_folder}/${file.id}_resized.${target_extension}`
	);
	let target_path_placeholder = (
		`${target_resize_folder}/${file.id}_placeholder.png`
	);
	let target_new_path_placeholder = (
		`${target_new_resize_folder}/${file.id}_placeholder.png`
	);
	
	
	if(is_video){
		
		await copy_file(source_path, target_path);
		
		
		//  Creating Video Placeholder  //
		
		//A video placeholder image is required due to a clip path rendering bug
		//in OBS if the affected element contains a video.
		
		if(file_width > width_max
		|| file_height > height_max){
			
			await image.clone()
			.resize({
				width: width_max,
				height: height_max,
				fit: "inside",
				kernel: "lanczos3"
			})
			.toFormat("png")
			.toFile(target_path_placeholder);
			
		} else {
			
			await image.clone()
			.toFormat("png")
			.toFile(target_path_placeholder);
			
		}
		
	} else if(file.extension === "gif"){
		
		await copy_file(source_path, target_path);
		
	} else {
		
		if(file_width > width_max
		|| file_height > height_max){
			
			await image.clone()
			.resize({
				width: width_max,
				height: height_max,
				fit: "inside",
				kernel: "lanczos3"
			})
			.toFormat(target_extension)
			.toFile(target_path);
			
		} else {
			
			await image.clone()
			.toFormat(target_extension)
			.toFile(target_path);
			
		}
		
	}
	
	
	//  Copy To New Folder  //
	
	await copy_file(target_path, target_new_path);
	
	
	if(is_video){
		await copy_file(target_path_placeholder, target_new_path_placeholder);
	}
};




let main = async function(){
	let cl_arguments = get_command_line_arguments();
	
	if(cl_arguments.length === 0){
		throw "You have to give a file name as an argument.";
	}
	if(cl_arguments.length > 1){
		throw "You have gave too many arguments.";
	}
	
	
	file = get_file_name_info(cl_arguments[0]);
	
	if(!file_exists(file.absolute_path)){
		throw "The file to handle does not exist.";
	}
	if(!valid_extensions.has(file.extension)){
		throw "The file's extension isn't supported.";
	}
	
	
	create_folder(target_resize_folder, {recursive: true});
	create_folder(target_thumbnail_folder, {recursive: true});
	create_folder(target_new_resize_folder, {recursive: true});
	create_folder(target_new_thumbnail_folder, {recursive: true});
	
	
	await load_image();
	await load_average_color();
	await create_thumbnail();
	await resize_file();
	
	
	if(file_exists(video_first_frame_path)
	&& __filename !== video_first_frame_path){
		delete_file_sync(video_first_frame_path);
	}
	
	process.stdout.write(JSON.stringify({
		average_color: average_color,
		width: file_width,
		height: file_height
	}));
};

main()
.catch(function(error){
	console.error(error);
	process.exitCode = 1;
});




























