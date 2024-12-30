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

//Used to spawn child processes.
const child_process = require("child_process");



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



//Takes a path and an optional options object and returns an object with
//statistics about the path. If there is no file system entry for the given path
//an error is thrown.
let get_path_statistics = function(path, options={}){
	return fs.statSync(path, options);
};


let load_file_data = async function(){
	file_data = JSON.parse(await get_string_from_file(file_data_path));
};

let save_file_data = async function(){
	let json_string = JSON.stringify(file_data);
	let js_string = `let file_data = ${json_string};`;
	
	await write_string_to_file(json_string, file_data_path);
	await write_string_to_file(js_string, file_data_js_path);
};








let process_image = function(file){
	return new Promise(function(resolve, reject){
		let child = null;
		let has_exited = false;
		
		try {
			/*
			let data = child_process.spawnSync(
				"node",
				[
					image_processing_path,
					file.base_name
				],
				{
					"detached": false,
					"serialization": "json",
					"shell": false,
					"windowsHide": true
				}
			);
			
			console.log(data.pid);
			console.log(data.status);
			console.log(String(data.stderr));
			console.log(String(data.stdout));
			
			
			console.log("Processed " + file.base_name);
			resolve();
			*/
			
			let spawn_command = "node";
			
			let spawn_arguments = [
				image_processing_path,
				file.full_name
			];
			
			let spawn_options = {
				"detached": false,
				"serialization": "json",
				"shell": false,
				"windowsHide": true
			};
			
			child = child_process.spawn(
				spawn_command,
				spawn_arguments,
				spawn_options
			);
			
			
			let data_out = "";
			let data_err = "";
			
			
			child.on("close", function(code, signal){
				//console.log(`Process closed with code ${code}.`);
			});
			child.on("error", function(error){
				console.log(`Process error for file ${file.id}.`);
				console.error(error);
			});
			child.on("exit", function(code, signal){
				//console.log(`Process exited with code ${code}.`);
				
				has_exited = true;
				child = null;
				
				if(code !== 0){
					console.log(data_out);
					console.error(data_err);
					
					reject(`Processing file ${file.id} exited with code ${code}.`);
				} else {
					handle_processed_data(file, data_out);
					
					resolve();
				}
			});
			child.on("message", function(message, send_handle){
				//console.log("Received message:", message);
			});
			child.on("spawn", function(){
				//console.log("Process spawned");
			});
			
			
			child.stdout.on("data", function(data){
				//console.log("stdout:", String(data));
				
				data_out += String(data);
			});
			child.stderr.on("data", function(data){
				//console.log("stderr:", String(data));
				
				data_err += String(data);
			});
		} catch(error){
			if(child !== null
			&& has_exited !== true){
				child.kill();
			}
			
			console.log(`Error processing file ${file.base_name}`);
			console.log("stdout:", String(data_out));
			console.log("stderr:", String(data_err));
			reject(error);
		}
	});
};

let handle_processed_data = function(file, data_out){
	let process_data = JSON.parse(data_out);
	let file_statistics = get_path_statistics(file.absolute_path);
	
	file_data[file.base_name] = {
		base_name: file.base_name,
		extension: file.extension,
		width: process_data.width,
		height: process_data.height,
		size: file_statistics.size,
		modification_time: file_statistics.mtimeMs,
		average_color: process_data.average_color
	};
};

let extension_to_resize_map = {
	"png": "png",
	"jpg": "png",
	"gif": "gif",
	"webm": "webm",
	"mp4": "mp4"
};

let has_to_be_processed = function(file){
	let resize_extension = extension_to_resize_map[file.extension];
	let thumbnail_extension = "jpg";
	let placeholder_extension = "png";
	
	let target_resize_path = (
		`${target_resize_folder}/${file.id}_resized.${resize_extension}`
	);
	let target_placeholder_path = (
		`${target_resize_folder}/${file.id}_placeholder.${placeholder_extension}`
	);
	let target_thumbnail_path = (
		`${target_thumbnail_folder}/${file.id}_thumbnail.${thumbnail_extension}`
	);
	
	if(!hasOwnProperty(file_data, file.base_name)
	|| file_data[file.base_name].extension !== file.extension
	|| !file_exists(target_resize_path)
	|| !file_exists(target_thumbnail_path)){
		return true;
	}
	
	if(file.is_video === true
	&& !(file_exists(target_placeholder_path))){
		return true;
	}
	
	let file_statistics = get_path_statistics(file.absolute_path);
	let file_size = file_statistics.size;
	let modification_time = file_statistics.mtimeMs;
	
	
	if(file_data[file.base_name].size !== file_size
	|| file_data[file.base_name].modification_time !== modification_time){
		return true;
	}
	
	return false;
};


//The returned object has these properties:
//    base_name: [String]
//        The file name without the extension.
//    id: [Number]
//        Same as the base name but converted into a number.
//    extension: [String]
//        The extension part of the file name. Note that this does not include
//        the point between the base name and extension.
//    full_name: [String]
//        The full file name made up of the base name and extension.
//    absolute_path: [String]
//        The absolute path to the file.
//    is_video: [Boolean]
//        A boolean indicating if the file is a video. Videos need to have a
//        placeholder image.
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
		id: Number(base_name),
		extension: extension,
		full_name: file_name,
		absolute_path: (source_folder + "/" + file_name),
		is_video: (extension_is_video_map.get(extension) === true)
	});
};

let valid_extensions = new Set([
	"png",
	"jpg",
	"gif",
	"webm",
	"mp4"
]);

let extension_is_video_map = new Map([
	["png",  false],
	["jpg",  false],
	["gif",  false],
	["webm", true],
	["mp4",   true]
]);

let is_valid_file_name = function(file){
	if(!valid_extensions.has(file.extension)
	|| file.base_name.length === 0){
		return false;
	}
	
	let number = Number(file.base_name);
	
	if(Number.isNaN(number)
	|| number < 0
	|| number % 1 !== 0){
		return false;
	}
	
	return true;
};

let are_base_names_unique = function(files){
	let base_names = new Set();
	let are_unique = true;
	
	for(let file of files){
		if(base_names.has(file.base_name)){
			console.log("Base name used more than once:", file.base_name);
			are_unique = false;
		} else {
			base_names.add(file.base_name);
		}
	}
	
	return are_unique;
};

let log_processing_progress = function(file, processed_count, files_to_compile){
	let progress_string = (
		String(processed_count + 1)
		.padStart(String(files_to_compile.length).length, " ")
	);
	console.log((
		`(${progress_string} / ${files_to_compile.length}) ` +
		`Processing file ${file.id}`
	));
};



let source_folder = get_absolute_path("./images/gallery");
let target_resize_folder = get_absolute_path("./images/gallery_resized");
let target_thumbnail_folder = get_absolute_path("./images/thumbnails");
let target_new_resize_folder = get_absolute_path("./new_images/gallery_resized");
let target_new_thumbnail_folder = get_absolute_path("./new_images/thumbnails");

let file_data_path = get_absolute_path("./data/file_data_v2.json");
let file_data_js_path = get_absolute_path("./data/file_data_v2.js");
let image_processing_path = get_absolute_path("./cl_handle_file.js");


//Every property looks like this:
//    [base_name]: {
//        base_name: [String]
//            The base name of the source image.
//        extension: [String]
//            The file extension of the source image, for example "png", "jpg"
//            or "webm".
//        width: [Number]
//            The width of the video or image.
//        height: [Number]
//            The height of the video or image.
//        size: [Number]
//            The size of the file in bytes.
//        modification_time: [Number]
//            The most recent time the source file is set to have been modified
//            in Unix time in milliseconds.
//        average_color: [Array]
//            The average color of the image or first from of the animation as
//            an array with the RGB values.
//            
//            Example: [199, 174, 122]
//}
let file_data = {};


let main = async function(){
	//  Check And Load Files  //
	
	if(!file_exists(image_processing_path)){
		console.log("File to process images does not exist.");
		return;
	}
	
	if(file_exists(file_data_path)){
		await load_file_data();
	}
	
	
	//  Create Folders  //
	
	create_folder(target_resize_folder, {recursive: true});
	create_folder(target_thumbnail_folder, {recursive: true});
	create_folder(target_new_resize_folder, {recursive: true});
	create_folder(target_new_thumbnail_folder, {recursive: true});
	
	
	//  Get Images To Process  //
	
	let source_files = get_files_in_folder(source_folder)
	.map(get_file_name_info);
	
	
	for(let file of source_files){
		if(!is_valid_file_name(file)){
			console.log("Invalid file name in image source folder:", file);
			return;
		}
	}
	
	
	if(!are_base_names_unique(source_files)){
		console.log("A file's base name has to be unique. Make sure that files with different extensions don't use the same base name.");
		return;
	}
	
	
	
	//  Process Images  //
	
	let processing_error = false;
	let processed_count = 0;
	
	try {
		let files_to_compile = [];
		
		console.log("Checking for files to processes.");
		
		for(let file of source_files){
			if(has_to_be_processed(file)){
				files_to_compile.push(file);
			}
		}
		
		//Sorting by their IDs so that they are processed in numeric order.
		files_to_compile.sort(function(a, b){
			return (a.id - b.id);
		});
		
		console.log(`Processing ${files_to_compile.length} file(s):`);
		
		
		for(let file of files_to_compile){
			log_processing_progress(file, processed_count, files_to_compile);
			
			await process_image(file);
			processed_count += 1;
		}
	} catch(error){
		console.log("Error processing images.");
		console.error(error);
		
		process.exitCode = 1;
		processing_error = true;
	}
	
	await save_file_data();
	
	if(processing_error === true){
		console.error(`Error while compiling all files. Fix the error and run again to finish compiling. Successfully compiled ${processed_count} new file(s).`);
	} else {
		console.log(`All files compiled successfully.`);
	}
};

main()
.catch(function(error){
	console.error(error);
	process.exitCode = 1;
});




























