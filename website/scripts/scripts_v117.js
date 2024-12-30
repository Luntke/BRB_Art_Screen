"use strict";

//
//    Get Last File
//
//Resolves with last shown file text.
//

let get_last_file = async function(){
	let url = "./api/get_last_file.php";
	let response = await fetch(url);
	
	if(response.status !== 200){
		throw new Error("Error fetching last file data.");
	}
	
	return await response.text();
};
//
//    Set Last File
//
//Takes an ID and sets it as the ID of the last shown file.
//

let set_last_file = async function(data){
	let url = "./api/set_last_file.php";
	
	let response = await fetch(url, {
		method: "POST",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data)
	});
	
	if(response.status !== 200){
		throw new Error("Error setting last file data.");
	}
	
	return await response.text();
};
//
//    Get Settings
//
//Resolves with settings text.
//

let get_settings = async function(){
	let url = "./api/get_settings.php";
	let response = await fetch(url);
	
	if(response.status !== 200){
		throw new Error("Error fetching settings.");
	}
	
	return await response.text();
};
//
//    Set Settings
//
//Takes a settings object and sets it as the settings.
//

let set_settings = async function(data){
	let url = "./api/set_settings.php";
	
	let response = await fetch(url, {
		method: "POST",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data)
	});
	
	if(response.status !== 200){
		throw new Error("Error saving settings.");
	}
	
	return await response.text();
};
//
//    Functions
//
//Collection of small general functions.
//

let debug_enabled = true;

let console_log = function(...args){
	if(debug_enabled === true){
		console.log(...args);
	};
};


//Returns a boolean indicating if the given value is an object.
let is_object = function(value){
	return (value === Object(value));
};

let hasOwnProperty = function(object, property){
	return Object.prototype.hasOwnProperty.call(object, property);
};


let get_time = function(){
	return performance.now();
};

let sleep = function(ms){
	return new Promise(function(resolve, reject){
		setTimeout(resolve, ms);
	});
};


let hex_to_rgb = function(hex){
	let result = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex);
	
	if(result === null){
		return null;
	}
	
	return ([
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	]);
};


//Takes an array and returns a copy of the array in which the elements have
//their order randomized.
let get_random_element_order = function(_array){
	let array = _array.slice();
	
	for(let i = (array.length - 1);i >= 1;i -= 1){
		let random_index = Math.floor((i + 1) * Math.random());
		
		let x = array[i];
		array[i] = array[random_index];
		array[random_index] = x;
	}
	
	return array;
};

//
//    Get Formatting Object
//
//The given string can have formatting blocks similar to HTML elements, but it's
//save for the string to contain any HTML. Only the allowed blocks have
//functionality. The returned object has the properties "node" and "is_valid".
//If "is_valid" is not true then the node has no formatting and the text is
//equal to the given string including any formatting text.
//
//
//These are the allowed formatting blocks:
//    "b"
//        Draws the text bold.
//    "i"
//        Draws the text italicized.
//    "s"
//        Draws the text with a strikethrough.
//
//Examples:
//    get_formatting_object("<b>This is bold.</b>")
//        All of the text is bold.
//    get_formatting_object("<i>This is <s>terrible</s> <b>cool</b></i> :)")
//        Most of the text is italicized, the word "terrible" has a
//        strikethrough and the word "cool" is bold.
//

let get_formatting_object = function(string){
	//  Variables  //
	
	let block_type_to_html_element = {
		"b": "b",
		"i": "i",
		"s": "s"
	};
	let block_types = Object.keys(block_type_to_html_element);
	let block_regex = new RegExp(`<(\\/)?(${block_types.join("|")})>`, "g");
	
	
	//  Find Formatting Blocks  //
	
	let matched_blocks = [];
	
	for(let match of string.matchAll(block_regex)){
		let object = {
			type: block_type_to_html_element[match[2]],
			is_closing: false,
			index_start: match.index,
			index_end: (match.index + match[0].length)
		};
		
		if(match[1] !== undefined){
			object.is_closing = true;
		}
		
		matched_blocks.push(object);
	}
	
	
	//  Check Validity  //
	
	let type_stack = [];
	let is_valid = true;
	
	//This checks whether or not the blocks are opened and closed in the correct
	//order.
	for(let block of matched_blocks){
		if(block.is_closing === false){
			type_stack.push(block.type);
		} else {
			if(type_stack.length > 0
			&& type_stack[type_stack.length - 1] === block.type){
				type_stack.pop();
			} else {
				is_valid = false;
				break;
			}
		}
	}
	
	//All opened blocks have to close.
	if(type_stack.length > 0){
		is_valid = false;
	}
	
	
	if(is_valid !== true){
		let div = document.createElement("div");
		let text = document.createTextNode(string);
		div.appendChild(text);
		
		return ({
			node: div,
			is_valid: false
		});
	}
	
	
	//  Create Output  //
	
	let div = document.createElement("div");
	let parent = div;
	let index = 0;
	
	for(let block of matched_blocks){
		let string_part = string.substring(index, block.index_start);
		let text = document.createTextNode(string_part);
		parent.appendChild(text);
		
		index = block.index_end;
		
		if(block.is_closing === false){
			let element = document.createElement(block.type);
			parent.appendChild(element);
			
			parent = element;
		} else {
			parent = parent.parentElement;
		}
	}
	
	
	if(index < string.length){
		let string_part = string.substring(index, string.length);
		let text = document.createTextNode(string_part);
		parent.appendChild(text);
	}
	
	
	//  Return  //
	
	return ({
		node: div,
		is_valid: true
	});
};



//
//    Settings
//
//Handles everything around the settings.
//

let settings = null;

//Global settings restrictions.
let time_per_image_min = 5;
let time_per_image_max = 60;

(function(){
	//  Variables  //
	
	let values = {};
	
	let load_called = false;
	let has_loaded = false;
	
	
	//  Functions  //
	
	let get_default_values = function(){
		return ({
			time_per_image: 15,
			random_order: null
		});
	};
	
	let set_default_values = function(){
		values = get_default_values();
	};
	
	
	//  Methods  //
	
	let load = async function(){
		if(load_called === true){
			return;
		}
		load_called = true;
		
		try {
			let string = await get_settings();
			
			if(string.length === 0){
				throw "Loaded settings don't exist.";
			};
			let data = JSON.parse(string);
			
			if(typeof data !== "object"){
				throw "Loaded settings are not an object.";
			}
			
			
			let default_values = get_default_values();
			
			for(let property in default_values){
				if(data[property] === undefined){
					values[property] = default_values[property];
				} else {
					values[property] = data[property];
				}
			}
			
			
			
			if(typeof values["time_per_image"] !== "number"
			|| Number.isNaN(values["time_per_image"])
			|| values["time_per_image"] < time_per_image_min
			|| values["time_per_image"] > time_per_image_max){
				values["time_per_image"] = default_values["time_per_image"];
			}
			
			
			if(!Array.isArray(values["random_order"])){
				values["random_order"] = null;
			}
			
			
			console_log("Settings loaded");
		} catch(error){
			console.error(error);
			
			set_default_values();
			console_log("Error loading settings, using default values instead.");
		}
		
		has_loaded = true;
	};
	
	let save = async function(){
		try {
			await set_settings(values);
			console_log("Settings saved");
		} catch(error){
			console.error(error);
			console_log("Error saving settings");
		}
	};
	
	
	let get = function(property){
		if(!values.hasOwnProperty(property)){
			throw new Error("Can't get setting as the given setting name is invalid.");
		}
		
		return values[property];
	};
	
	let set = function(property, value){
		if(!values.hasOwnProperty(property)){
			throw new Error("Can't set setting as the given setting name is invalid.");
		}
		
		values[property] = value;
	};
	
	
	//  Return  //
	
	settings = ({
		load: load,
		save: save,
		get has_loaded(){
			return has_loaded;
		},
		
		get: get,
		set: set
	});
	
})();

//
//    Variables
//
//Useful general use variables.
//


//"png" appears twice as it is the file type for both resized png and jpg files.
let number_to_extension = {
	"0": "png",
	"1": "png",
	"2": "gif",
	"3": "webm",
	"4": "mp4",
};

let extension_to_video_map = {
	"png": false,
	"jpg": false,
	"gif": false,
	"webm": true,
	"mp4": true
};

/*
0: id
1: user
2: description
3: extension
4: average_color
*/
let Submission = {
	get_id: function(index){
		return submissions[index][0];
	},
	get_user: function(index){
		return submissions[index][1];
	},
	get_description: function(index){
		return submissions[index][2];
	},
	get_type: function(index){
		return number_to_extension[submissions[index][3]];
	},
	is_video: function(index){
		let extension = Submission.get_type(index);
		return extension_to_video_map[extension];
	},
	get_average_color: function(index){
		return ("#" + submissions[index][4]);
	}
};

//
//    Visibility change
//
//Handles changes made when the page visibility changes.
//

let page_visibility = null;

(function(){
	//  Variables  //
	
	let hidden_property;
	let visibility_change_name;
	
	
	//  Functions  //
	
	let on_visibility_change = function(){
		if(document[hidden_property] === true){
			console_log("Page is now hidden.");
			automatic_timer.pause();
			animation.pause();
		} else {
			console_log("Page is now visible.");
			automatic_timer.unpause();
			animation.unpause();
		}
	};
	
	
	//  Setting Up  //
	
	if(typeof document.hidden !== "undefined"){
		// Opera 12.10 and Firefox 18 and later support 
		hidden_property = "hidden";
		visibility_change_name = "visibilitychange";
	} else if(typeof document.msHidden !== "undefined"){
		hidden_property = "msHidden";
		visibility_change_name = "msvisibilitychange";
	} else if(typeof document.webkitHidden !== "undefined"){
		hidden_property = "webkitHidden";
		visibility_change_name = "webkitvisibilitychange";
	}
	
	
	document.addEventListener(
		visibility_change_name,
		on_visibility_change,
		false
	);
	
	
	//  Return  //
	
	page_visibility = {
		get is_visible(){
			if(typeof document.visibilityState !== "undefined"){
				return (document.visibilityState === "visible")
			}
			
			return document.hidden;
		}
	};
	
})();
//
//    Animation Data
//
//Contains data about how to draw the germ and paint animations.
//

let eyes = [];

//The order is idle, idle blink, painting
eyes = [[23,114],[64,91],[223,102],[264,79],[423,93],[464,70],[623,90],[664,67],[823,88],[864,65],[1023,90],[1064,67],[1223,100],[1264,77],[1423,108],[1464,85],[1623,117],[1664,94],[1823,120],[1864,97],[2023,90],[2064,67],[2223,90],[2264,67],[2423,100],[2464,77],[2623,100],[2664,77],[2823,113],[2864,90],[3026,118],[3064,91],[3229,124],[3267,97],[3428,124],[3466,97],[3628,123],[3666,96],[3828,123],[3866,96],[4026,121],[4064,94],[4224,119],[4262,92],[4424,112],[4465,89],[4627,112],[4669,90],[6225,1531],[6261,1502],[1095,976],[1131,947],[2372,985],[2408,955],[3657,986],[3693,956],[5059,532],[5095,503],[5058,984],[5094,955],[3970,1695],[4006,1666],[841,1704],[877,1675],[1864,1706],[1900,1677],[2674,1708],[2710,1679],[6140,536],[6176,507],[5242,1633],[5278,1604],[6220,1097],[6256,1068],[421,531],[457,502],[1020,535],[1056,506],[1615,533],[1651,504],[2218,532],[2254,503],[2816,533],[2852,504],[3137,532],[3173,503],[3458,534],[3494,505],[3782,534],[3818,505],[4820,135],[4856,106],[5020,132],[5056,103],[5219,129],[5255,100],[5418,133],[5454,104],[5621,126],[5657,97]];


/*
//Calculates the angle of the eyes in every frame. Important in the creation of a sprite sheet
//with existing angles.
(function(){
    let angles = [];
    
	for(let i = 0;i < eyes.length;i += 2){
		let left_eye_x = eyes[i + 0][0];
		let left_eye_y = eyes[i + 0][1];
		let right_eye_x = eyes[i + 1][0];
		let right_eye_y = eyes[i + 1][1];
		
		let d_x = (right_eye_x - left_eye_x);
		let d_y = (right_eye_y - left_eye_y);
		
		angles.push(Math.atan(d_y / d_x) / (2 * Math.PI) * 360 + 29.2914);
	}
    
    return angles;
})();
*/



let sine_i = 0;
//The result is being rounded to the nearest whole number as OBS, unlike normal
//browsers, doesn't translate images to subpixel accuracy.
let get_sine_translate = function(i){
	let total_frames = 40;
	
	let translate = Math.round(
		- 10
		+ 6 * Math.sin(2 * Math.PI * ((sine_i + 10) / total_frames))
	);
	
	sine_i = ((sine_i + 1) % total_frames);
	
	return translate;
};


let hat_width = 150;
let hat_height = 150;

//These are the values of the indices:
//    0: width
//    1: height
//    2: map_x
//    3: map_y
//    4: offset_y
//    5: hat_id
//    6: hat_offset_x
//    7: hat_offset_y
//    8: hat_angle
let frame_sheet = [
	//Idle
	
	//0 - 9
	[200,300,0,0,100 + 0, 0],
	[200,300,200,0,100 + 12, 0],
	[200,300,400,0,100 + 21, 0],
	[200,300,600,0,100 + 24, 0],
	[200,300,800,0,100 + 26, 0],
	[200,300,1000,0,100 + 24, 0],
	[200,300,1200,0,100 + 14, 0],
	[200,300,1400,0,100 + 6, 0],
	[200,300,1600,0,100 - 3, 0],
	[200,300,1800,0,100 - 6, 0],
	
	
	//Idle blink
	
	//10 - 13
	[200,300,2000,0,100 + 24, 0],
	[200,300,2200,0,100 + 24, 0],
	[200,300,2400,0,100 + 14, 0],
	[200,300,2600,0,100 + 14, 0],
	
	
	//Painting
	
	//14 - 19
	[200,300,2800,0,100, 0],
	[200,300,3000,0,100, 1],
	[200,300,3200,0,100, 2],
	[200,300,3400,0,100, 3],
	[200,300,3600,0,100, 3],
	[200,300,3800,0,100, 3],
	
	//20 - 29
	[200,300,4000,0,100, 3],
	[200,300,4200,0,100, 3],
	[200,300,4400,0,100, 3],
	[200,300,4600,0,100, 0],
	[800,720,5600,1310,0, 0],
	[1280,720,0,750,0, 0],
	[1280,720,1280,750,0, 0],
	[1280,500,2560,750,0, 0],
	[1280,450,3960,300,0, 0],
	[1280,450,3960,750,0, 0],
	
	//30 - 39
	[1280,450,2872,1463,0, 0],
	[1024,600,0,1470,0, 0],
	[1024,600,1024,1470,0, 0],
	[770,600,2089,1470,0, 0],
	[1024,600,5300,300,0, 0],
	[1024,600,4400,1400,0, 0],
	[1024,500,5376,864,0, 0],
	[600,450,0,300,0, 0],
	[600,450,600,300,0, 0],
	[600,450,1200,300,0, 0],
	
	//40 - 49
	[600,450,1800,300,0, 0],
	[600,450,2400,300,0, 0],
	[320,450,3000,300,0, 0],
	[320,450,3320,300,0, 0],
	[320,450,3640,300,0, 0],
	[200,300,4800,0,100, 0],
	[200,300,5000,0,100, 0],
	[200,300,5200,0,100, 0],
	[200,300,5400,0,100, 0],
	[200,300,5600,0,100, 0]
];

let eye_data = [[23,114],[64,91],[223,102],[264,79],[423,93],[464,70],[623,90],[664,67],[823,88],[864,65],[1023,90],[1064,67],[1223,100],[1264,77],[1423,108],[1464,85],[1623,117],[1664,94],[1823,120],[1864,97],[2023,90],[2064,67],[2223,90],[2264,67],[2423,100],[2464,77],[2623,100],[2664,77],[2823,113],[2864,90],[3026,118],[3064,91],[3229,124],[3267,97],[3428,124],[3466,97],[3628,123],[3666,96],[3828,123],[3866,96],[4026,121],[4064,94],[4224,119],[4262,92],[4424,112],[4465,89],[4627,112],[4669,90],[6225,1531],[6261,1502],[1095,976],[1131,947],[2372,985],[2408,955],[3657,986],[3693,956],[5059,532],[5095,503],[5058,984],[5094,955],[3970,1695],[4006,1666],[841,1704],[877,1675],[1864,1706],[1900,1677],[2674,1708],[2710,1679],[6140,536],[6176,507],[5242,1633],[5278,1604],[6220,1097],[6256,1068],[421,531],[457,502],[1020,535],[1056,506],[1615,533],[1651,504],[2218,532],[2254,503],[2816,533],[2852,504],[3137,532],[3173,503],[3458,534],[3494,505],[3782,534],[3818,505],[4820,135],[4856,106],[5020,132],[5056,103],[5219,129],[5255,100],[5418,133],[5454,104],[5621,126],[5657,97]];

//frame_sheet
//    0: width
//    1: height
//    2: map_x
//    3: map_y
//    4: offset_y
//    5: hat_id
//    6: hat_offset_x
//    7: hat_offset_y
//    8: hat_angle
(function(){
	for(let i = 0;i < eyes.length;i += 2){
		let frame_data = frame_sheet[i / 2];
		
		let left_eye_x = eye_data[i + 0][0];
		let left_eye_y = eye_data[i + 0][1];
		let right_eye_x = eye_data[i + 1][0];
		let right_eye_y = eye_data[i + 1][1];
		
		
		//These are the relative position to the top left of the germ sprite
		//sheet.
		/*
		//Santa Hat
		let hat_top = (left_eye_y - 46);
		let hat_left = (left_eye_x - 78);
		*/
		//Artist Hat
		let hat_top = (left_eye_y - 108);
		let hat_left = (left_eye_x - 23);
		
		//These are relative to the germ sprite.
		let hat_offset_x = (
			hat_left - frame_data[2] + (1280 - frame_data[0])
		);
		let hat_offset_y = (
			hat_top - frame_data[3] + frame_data[4]
		);
		
		
		//Used to calculate the eye angle.
		let d_x = (right_eye_x - left_eye_x);
		let d_y = (right_eye_y - left_eye_y);
		
		//The angle is in degrees.
		let hat_angle = (
			Math.atan(d_y / d_x) / (2 * Math.PI) * 360
			+ 29.291437829015738
		);
		
		
		frame_data[6] = hat_offset_x;
		frame_data[7] = hat_offset_y;
		frame_data[8] = hat_angle;
	}
})();


let get_frame_info = function(frame_id, y_offset=0){
	let data = frame_sheet[frame_id].slice();
	let y_offset_index = 4;
	let hat_offset_y_index = 7;
	
	data[y_offset_index] += y_offset;
	data[hat_offset_y_index] += y_offset;
	
	return data;
};


//These are the values of the indices:
//    0: width
//    1: height
//    2: map_x
//    3: map_y
//    4: offset_y
//    5: hat_id
//    6: hat_offset_x
//    7: hat_offset_y
//    8: hat_angle
let map_data = {
	idle: [
		0,0,0,0,
		1,1,1,1,
		2,2,2,2,
		3,3,3,3,
		4,4,4,4,
		5,5,5,5,
		6,6,6,6,
		7,7,7,7,
		8,8,8,8,
		9,9,9,9
	],
	idle_blink: [
		0,0,0,0,
		1,1,1,1,
		2,2,2,2,
		3,3,3,3,
		4,4,4,4,
		
		10, 10, 11, 11,
		12, 12, 13, 13,
		
		7,7,7,7,
		8,8,8,8,
		9,9,9,9
	],
	painting: [
		get_frame_info(14),
		null,
		get_frame_info(15),
		null,
		get_frame_info(16),
		null,
		get_frame_info(17),
		null,
		get_frame_info(18),
		get_frame_info(19),
		null,
		get_frame_info(20),
		null,
		get_frame_info(21),
		null,
		get_frame_info(22),
		null,
		get_frame_info(23),
		null,
		get_frame_info(24),
		get_frame_info(25),
		null,
		get_frame_info(26),
		get_frame_info(27),
		get_frame_info(28),
		get_frame_info(29),
		null,
		get_frame_info(30),
		null,
		get_frame_info(31),
		get_frame_info(32),
		get_frame_info(33),
		get_frame_info(34),
		get_frame_info(35),
		get_frame_info(36),
		null,
		get_frame_info(37),
		get_frame_info(38),
		get_frame_info(39),
		get_frame_info(40),
		get_frame_info(41),
		get_frame_info(42),
		get_frame_info(43),
		get_frame_info(44),
		get_frame_info(45),
		null,
		get_frame_info(46),
		null,
		get_frame_info(47),
		null,
		get_frame_info(48),
		null,
		get_frame_info(49),
		null,
		get_frame_info(14),
		
		
		get_frame_info(1, -1),
			get_frame_info(1, -3),
			get_frame_info(1, -5),
			get_frame_info(1, -7),
		get_frame_info(2, -8),
			get_frame_info(2, -9),
			get_frame_info(2, -10),
			get_frame_info(2, -11)
	]
};

(function(){
	let idle = map_data.idle;
	let idle_blink = map_data.idle_blink;
	
	for(let i = 0;i < idle.length;i += 1){
		idle[i] = get_frame_info(idle[i], get_sine_translate());
	}
	for(let i = 0;i < idle_blink.length;i += 1){
		idle_blink[i] = get_frame_info(idle_blink[i], get_sine_translate());
	}
})();







let animation_data = {
	idle: null,
	idle_blink: null,
	painting: null,
};

let path_data = {
	paint_normal: null,
	paint_rat: null,
	clippath: null
};



path_data.paint_normal = ["","","","","","","","","","","","","","M1192 270 L1161 240 L1157 243 L1154 247 L1152 251 L1149 255 L1148 258 L1150 260 L1153 263 L1155 265 L1156 269 L1160 272 L1165 275 L1169 278 L1170 281 L1172 284 L1175 284 L1177 282 L1178 279 L1180 276 L1184 275 L1189 273 L1192 272 L1193 271 Z","M1161 240 L1157 243 L1154 247 L1152 252 L1149 254 L1148 258 L1155 265 L1156 269 L1168 278 L1171 281 L1169 294 L1174 303 L1176 303 L1180 295 L1177 283 L1177 280 L1181 276 L1192 272 L1193 271 Z","M1174 286 L1170 297 L1169 308 L1175 314 L1177 311 L1179 307 L1178 301 L1176 293 Z M1159 167 L1192 136 L1190 132 L1183 125 L1178 122 L1174 122 L1169 126 L1166 130 L1161 133 L1159 135 L1154 140 L1149 147 L1147 152 L1149 156 L1153 163 L1153 167 L1158 172 L1158 171 L1159 169 L1160 168 Z","M1159 167 L1192 136 L1190 132 L1183 125 L1178 122 L1174 122 L1169 126 L1166 130 L1161 133 L1159 135 L1154 140 L1149 147 L1147 152 L1149 156 L1153 163 L1153 167 L1158 172 L1158 171 L1159 169 L1160 168 Z M1174 300 L1170 310 L1171 319 L1175 320 L1177 317 L1178 314 L1177 309 Z","M1177 160 L1211 133 L1207 126 L1200 119 L1194 118 L1192 121 L1190 123 L1186 125 L1181 129 L1178 132 L1176 134 L1170 137 L1169 140 L1167 144 L1168 148 L1171 152 L1171 156 L1174 161 L1175 161 Z M1174 313 L1171 322 L1170 331 L1175 335 L1178 333 L1180 327 L1178 321 Z","M1177 160 L1211 133 L1207 126 L1200 119 L1194 118 L1192 121 L1190 123 L1186 125 L1181 129 L1178 132 L1176 134 L1170 137 L1169 140 L1167 144 L1168 148 L1171 152 L1171 156 L1174 161 L1175 161 Z M1173 330 L1170 338 L1171 345 L1177 346 L1179 341 L1177 337 Z","M1166 142 L1189 120 L1191 122 L1184 130 L1195 123 L1200 123 L1184 137 L1202 123 L1208 124 L1191 141 L1207 129 L1208 131 L1177 155 L1172 156 L1173 152 L1181 145 L1171 148 L1180 135 L1168 144 Z M1172 342 L1170 346 L1167 351 L1174 353 L1178 352 L1177 348 L1174 346 Z M520 440 L517 441 L516 444 L511 450 L510 451 L509 457 L510 462 L514 468 L525 485 L528 488 L532 489 L537 487 L541 483 L544 478 L539 469 L607 414 L537 466 L534 461 L621 399 L532 457 L522 440 Z","M1172 348 L1166 351 L1165 354 L1167 355 L1171 355 L1174 355 L1177 353 L1177 351 L1175 350 Z M73 665 L70 665 L61 669 L60 674 L66 676 L72 672 Z M61 696 L60 698 L62 700 L65 699 L66 696 Z M120 682 L96 646 L82 658 L80 660 L84 670 L87 675 L91 678 L93 682 L93 684 L90 688 L87 690 L85 694 L88 694 L93 693 L94 688 L95 686 L100 690 L103 693 L108 693 L124 686 L127 681 L120 683 Z","M1173 349 L1170 349 L1165 350 L1161 353 L1161 356 L1166 357 L1172 356 L1177 353 L1178 352 L1176 350 Z M96 645 L82 656 L81 661 L84 668 L90 675 L93 681 L98 686 L103 692 L105 694 L108 695 L111 695 L116 692 L118 688 L119 685 L121 682 L118 680 Z M42 684 L37 687 L36 692 L41 693 L42 692 L45 688 L46 682 Z M41 713 L40 716 L42 716 L43 714 L44 713 Z M80 698 L76 698 L73 701 L72 704 L73 704 L74 704 L76 704 L78 701 Z","M1173 350 L1168 349 L1164 351 L1162 355 L1164 358 L1168 358 L1172 356 L1174 353 L1174 352 Z M55 620 L22 591 L10 609 L15 613 L17 618 L21 621 L25 623 L30 626 L33 628 L37 632 L43 634 L48 635 L49 635 L51 632 L53 632 L55 631 L57 633 L58 634 L58 634 L60 630 L58 627 L57 623 Z M66 623 L146 709 L123 699 L93 663 L93 667 L78 650 Z M67 637 L92 667 L124 703 L135 712 L117 700 L83 666 L90 675 L86 673 L124 713 L113 707 L83 674 L74 660 L65 641 L69 644 Z M68 656 L66 650 L64 645 L64 650 Z M21 697 L16 701 L16 704 L20 704 L22 701 Z M53 716 L52 716 L50 718 L50 718 L53 718 L55 717 L55 714 Z","M1172 351 L1169 350 L1165 352 L1164 354 L1164 356 L1166 358 L1167 358 L1169 357 L1172 355 L1173 353 Z M47 448 L9 426 L3 443 L5 448 L20 455 L23 458 L27 462 L31 464 L37 466 L40 470 L42 472 L44 470 L44 466 L44 461 L45 456 Z","M1169 352 L1168 352 L1166 353 L1166 355 L1166 356 L1168 357 L1169 357 L1171 356 L1172 355 L1172 353 Z M36 225 L23 231 L18 235 L21 242 L24 245 L25 248 L26 256 L27 259 L30 263 L31 267 L36 273 L36 274 L39 274 L39 276 L39 278 L38 285 L37 289 L38 294 L43 296 L46 296 L44 287 L43 282 L42 277 L43 273 L47 271 L54 265 Z","M1169 353 L1167 354 L1167 355 L1169 356 L1171 356 L1171 354 Z M127 101 L109 95 L107 96 L103 100 L103 103 L103 107 L100 111 L98 115 L96 118 L93 123 L93 127 L91 131 L91 134 L95 139 L96 140 L96 145 L96 147 L99 150 L101 150 L103 149 L107 145 L108 143 L109 142 L110 142 Z M40 287 L38 293 L37 300 L40 305 L44 308 L45 305 L45 301 L45 296 L43 293 Z","M1170 354 L1170 354 L1169 355 L1169 355 L1169 353 Z M127 102 L106 96 L103 101 L104 106 L101 111 L97 118 L94 124 L94 129 L93 134 L96 139 L96 144 L97 147 L100 150 L104 148 L109 143 Z M40 322 L36 331 L36 340 L40 344 L42 342 L44 338 L44 334 L42 330 Z","M189 144 L228 123 L224 113 L218 108 L213 105 L210 106 L208 108 L204 111 L201 113 L198 114 L195 116 L192 119 L185 123 L183 124 L180 128 L181 131 L183 135 Z M38 398 L36 405 L36 412 L41 416 L44 411 L43 406 L42 401 Z","M189 144 L228 123 L225 116 L221 109 L220 106 L218 104 L216 104 L213 104 L209 108 L205 111 L201 113 L193 117 L190 119 L185 123 L182 126 L181 129 L183 133 L186 137 Z M40 467 L39 473 L37 480 L39 487 L42 488 L45 483 L43 478 L43 474 Z","M39 534 L38 543 L37 550 L41 553 L41 553 L43 548 L42 544 L42 541 Z M287 193 L290 174 L303 174 L314 175 L322 177 L327 179 L332 180 L334 182 L333 187 L332 194 L332 197 L332 200 L331 201 Z M362 271 L367 271 L381 295 L371 274 L375 272 L399 306 L380 271 L381 265 L396 288 L395 276 L408 295 L397 273 L418 306 L416 306 L419 313 L413 310 L401 293 L415 322 L461 416 L401 307 L407 321 L403 322 L396 312 L400 324 L441 397 L420 371 L399 328 L393 326 L379 300 Z","M39 605 L37 608 L36 616 L37 621 L39 621 L40 617 L41 613 L40 611 Z M371 398 L379 399 L385 401 L391 405 L399 405 L401 406 L405 411 L409 413 L413 413 L416 401 L417 394 L412 398 L409 392 L406 390 L401 389 L396 387 L393 386 L391 384 L389 385 L386 386 L383 386 L381 382 L380 381 L376 384 L375 389 Z","M36 677 L33 687 L35 693 L38 692 L39 689 L37 684 Z M548 495 L542 497 L535 499 L541 503 L543 504 L538 509 L539 511 L540 513 L542 517 L543 519 L541 524 L541 525 L545 533 L545 535 L547 536 L553 533 L554 533 L549 528 L548 527 L551 520 L554 519 L548 516 L547 513 L548 511 L551 509 L547 505 L549 501 L549 497 L546 498 Z M471 550 L471 554 L470 565 L472 573 L472 573 L475 565 L474 559 Z M507 560 L508 570 L514 580 L519 583 L517 576 L513 567 Z M490 552 L489 555 L493 557 L494 553 Z M490 581 L491 597 L494 606 L497 607 L496 593 Z M516 596 L521 606 L525 609 L520 599 Z","M475 623 L474 629 L474 641 L477 648 L479 643 L478 635 Z M507 628 L507 631 L511 634 L511 630 Z M539 636 L539 642 L545 653 L551 659 L551 654 L547 644 Z M546 682 L549 694 L554 698 L554 698 L551 690 Z M505 681 L507 688 L510 700 L513 701 L512 690 L510 685 Z M592 462 L588 464 L585 468 L589 472 L593 473 L593 476 L593 477 L596 479 L598 480 L600 484 L600 488 L605 489 L609 493 L610 496 L614 493 L616 491 L610 486 L609 486 L604 480 L603 476 L599 477 L597 470 L597 467 Z","M477 686 L476 698 L479 712 L481 711 L482 698 Z M521 676 L518 678 L522 682 L523 682 Z M566 689 L571 698 L579 706 L584 707 L579 698 L573 691 Z M560 714 L561 718 L563 719 L563 717 L562 713 Z M521 717 L518 718 L519 719 L521 719 Z M548 266 L545 270 L543 274 L548 275 L549 278 L551 281 L556 282 L556 283 L558 287 L559 290 L562 291 L566 293 L569 296 L570 296 L572 294 L573 293 L568 289 L565 284 L564 281 L560 278 L554 274 L552 273 L551 268 Z M600 396 L573 369 L576 378 L560 363 L578 391 L570 385 L582 408 L581 398 L597 413 L576 382 L595 399 L588 390 Z","M532 713 L531 717 L534 718 L533 714 Z M577 117 L565 118 L565 121 L569 127 L570 133 L570 140 L572 146 L574 148 L576 149 L577 144 L578 138 L579 133 L579 125 L580 118 Z","M577 116 L566 117 L565 121 L568 123 L565 127 L567 133 L569 139 L571 147 L571 147 L575 144 L577 136 L577 127 L578 125 L580 124 L579 118 L579 114 Z","M712 98 L709 92 L710 80 L712 74 L714 68 L716 64 L719 64 L722 66 L722 69 L720 77 L716 96 Z","M756 76 L762 66 L766 60 L774 53 L778 49 L783 50 L786 52 L783 56 L772 65 L766 72 L763 76 L759 80 Z","M840 98 L849 97 L856 96 L862 99 L870 100 L876 99 L879 102 L880 106 L880 106 L867 108 L856 106 L840 104 L840 104 Z","M879 184 L884 180 L890 181 L900 184 L910 186 L917 190 L922 193 L922 195 L920 198 L912 198 L904 195 L889 189 L887 189 L884 188 Z","M914 363 L923 364 L925 374 L921 387 L920 395 L919 401 L915 398 L916 391 L917 385 L915 380 L913 380 L911 373 Z M925 273 L888 338 L887 334 L891 323 L886 327 L886 321 L879 328 L885 316 L895 306 L907 291 L919 275 L916 284 Z M915 267 L893 299 L889 311 L913 277 Z M909 268 L892 289 L882 301 L889 296 Z","M986 187 L981 191 L981 194 L987 196 L988 197 L991 205 L993 207 L998 212 L1002 216 L1005 220 L1005 213 L999 205 L994 199 L993 195 Z M895 445 L892 452 L895 458 L897 457 L898 449 Z M926 435 L928 446 L933 449 L936 446 L934 440 L928 432 Z M925 475 L924 484 L930 490 L932 489 L931 481 L927 471 Z M911 458 L911 462 L913 463 L914 460 L914 459 L912 457 Z M896 486 L895 497 L899 504 L901 501 L901 492 L897 484 Z M949 473 L953 484 L958 488 L957 482 L954 476 L950 471 Z","M1058 108 L1097 89 L1079 102 L1066 108 L1045 123 Z M897 512 L895 518 L896 524 L900 524 L902 522 L900 515 Z M920 530 L920 536 L923 536 L923 532 L921 530 Z M899 556 L897 565 L898 572 L900 572 L903 568 L902 559 Z M944 551 L944 557 L951 566 L953 565 L951 555 L949 551 L946 548 Z M957 515 L959 525 L967 532 L969 529 L969 524 L965 518 L959 514 Z M988 562 L990 574 L997 584 L1001 583 L997 575 L991 563 Z M1138 83 L1145 80 L1150 74 L1156 70 L1160 70 L1167 68 L1167 68 L1167 72 L1159 76 L1151 81 L1144 84 L1139 85 L1138 85 L1136 84 Z","M904 597 L901 604 L905 611 L910 610 L910 604 L907 598 Z M907 647 L907 654 L909 661 L913 659 L913 653 L911 648 L909 644 Z M936 619 L935 624 L937 625 L939 624 L939 622 L938 620 Z M966 643 L967 650 L970 658 L973 656 L973 652 L970 646 L968 642 Z M992 601 L993 606 L997 614 L1001 614 L1003 610 L999 603 L996 599 L993 598 Z M1014 637 L1014 644 L1019 656 L1023 659 L1025 655 L1023 648 L1018 638 L1015 636 Z M1184 59 L1190 59 L1194 54 L1197 52 L1203 52 L1206 52 L1209 55 L1213 56 L1217 56 L1218 58 L1217 59 L1210 60 L1203 61 L1195 63 L1190 63 L1185 62 L1182 60 Z","M914 694 L912 701 L914 710 L919 710 L920 707 L919 701 L916 695 Z M947 710 L946 713 L949 715 L951 712 L949 710 L948 709 Z M1021 685 L1022 694 L1025 699 L1029 701 L1030 699 L1029 692 L1026 688 L1022 684 Z M1043 714 L1044 720 L1048 720 L1050 720 L1047 713 L1044 712 Z M1220 41 L1226 40 L1230 40 L1236 38 L1243 38 L1248 39 L1249 43 L1250 44 L1252 46 L1246 48 L1243 48 L1239 48 L1231 47 L1223 44 L1217 42 Z","M1257 23 L1261 27 L1265 33 L1272 40 L1277 41 L1279 40 L1277 35 L1275 31 L1269 27 L1265 26 L1260 23 L1258 22 Z","M1280 13 L1277 12 L1277 16 L1279 19 L1280 21 Z", ""];



path_data.paint_rat = path_data.paint_normal.slice(0, 42);
path_data.paint_rat.push("M1058 108 L1097 89 L1079 102 L1066 108 L1045 123 Z M1134 87 L1144 81 L1146 76 L1147 75 L1148 74 L1150 72 L1153 72 L1155 72 L1156 73 L1157 72 L1158 70 L1157 68 L1159 69 L1161 69 L1162 69 L1163 70 L1165 71 L1167 70 L1166 69 L1168 69 L1167 71 L1167 71 L1165 72 L1163 73 L1162 74 L1161 74 L1160 74 L1158 74 L1158 77 L1158 77 L1159 77 L1159 78 L1158 78 L1157 78 L1156 78 L1152 80 L1152 81 L1150 82 L1148 83 L1147 83 L1146 82 Z M897 512 L895 518 L896 524 L900 524 L902 522 L900 515 Z M920 530 L920 536 L923 536 L923 532 L921 530 Z M899 556 L897 565 L898 572 L900 572 L903 568 L902 559 Z M944 551 L944 557 L951 566 L953 565 L951 555 L949 551 L946 548 Z M957 515 L959 525 L967 532 L969 529 L969 524 L965 518 L959 514 Z M988 562 L990 574 L997 584 L1001 583 L997 575 L991 563 Z","M1179 70 L1186 65 L1187 61 L1190 58 L1192 56 L1195 56 L1198 57 L1201 59 L1202 58 L1203 55 L1203 53 L1205 54 L1207 55 L1210 55  L1212 57 L1214 57 L1214 56 L1216 56 L1216 57 L1215 58 L1215 59 L1212 61 L1208 62 L1205 62 L1204 64 L1205 65 L1207 65 L1207 66 L1204 67 L1202 66 L1198 68 L1199 69 L1196 71 L1190 72 L1188 71 L1187 69 L1174 74 Z M904 597 L901 604 L905 611 L910 610 L910 604 L907 598 Z M907 647 L907 654 L909 661 L913 659 L913 653 L911 648 L909 644 Z M936 619 L935 624 L937 625 L939 624 L939 622 L938 620 Z M966 643 L967 650 L970 658 L973 656 L973 652 L970 646 L968 642 Z M992 601 L993 606 L997 614 L1001 614 L1003 610 L999 603 L996 599 L993 598 Z M1014 637 L1014 644 L1019 656 L1023 659 L1025 655 L1023 648 L1018 638 L1015 636 Z","M1216 59 L1238 44 L1239 38 L1242 31 L1247 25 L1252 25 L1263 26 L1264 23 L1265 17 L1265 12 L1269 15 L1272 15 L1275 15 L1277 15 L1280 16 L1280 29 L1279 31 L1276 32 L1273 33 L1271 33 L1269 36 L1271 38 L1273 39 L1275 39 L1277 39 L1278 40 L1277 41 L1274 43 L1271 44 L1268 43 L1267 42 L1265 42 L1261 45 L1257 50 L1258 52 L1259 53 L1257 55 L1253 57 L1251 58 L1246 59 L1242 57 L1240 53 L1212 63 Z M914 694 L912 701 L914 710 L919 710 L920 707 L919 701 L916 695 Z M947 710 L946 713 L949 715 L951 712 L949 710 L948 709 Z M1021 685 L1022 694 L1025 699 L1029 701 L1030 699 L1029 692 L1026 688 L1022 684 Z M1043 714 L1044 720 L1048 720 L1050 720 L1047 713 L1044 712 Z","M1256 40 L1275 18 L1274 11 L1278 3 L1280 0 L1280 22 L1278 22 Z","M1275 21 L1280 10 L1280 18 Z", "");



path_data.clippath = ["","","","","","","","","","","","","","","","","","","","","M110 720 L126 716 L140 710 L153 703 L162 697 L171 687 L179 676 L188 657 L190 646 L191 631 L191 621 L187 609 L182 600 L174 595 L161 590 L145 588 L130 588 L118 591 L102 595 L90 600 L75 606 L65 612 L53 621 L41 630 L33 638 L25 649 L20 660 L17 674 L17 687 L20 696 L25 705 L31 711 L39 716 L46 720","M165 720 L181 711 L197 699 L207 688 L215 677 L220 667 L226 654 L231 637 L235 622 L236 613 L236 600 L234 586 L230 572 L223 561 L211 553 L203 550 L192 548 L178 547 L155 548 L127 550 L112 552 L91 555 L72 559 L55 563 L38 567 L18 574 L7 578 L0 582 L0 720","M175 720 L187 715 L200 706 L208 699 L213 691 L219 679 L226 664 L230 650 L232 639 L235 627 L236 614 L236 603 L235 591 L234 583 L230 572 L225 565 L218 557 L207 552 L197 549 L180 548 L160 548 L146 548 L135 549 L117 551 L102 552 L93 553 L78 550 L69 543 L65 540 L58 537 L51 536 L38 534 L28 534 L16 536 L5 538 L0 540 L0 720","M196 720 L201 717 L206 713 L213 704 L220 693 L225 680 L229 666 L232 653 L234 636 L235 624 L236 611 L236 600 L235 590 L234 582 L231 572 L227 566 L222 560 L214 555 L208 552 L199 549 L190 548 L175 548 L158 548 L147 547 L136 544 L124 540 L114 535 L105 527 L98 517 L92 505 L87 490 L82 470 L79 455 L76 441 L73 429 L71 418 L66 405 L59 395 L47 388 L39 385 L29 383 L18 383 L7 384 L0 385 L0 720","M213 720 L219 712 L225 700 L228 689 L231 676 L233 663 L234 648 L235 634 L235 616 L235 596 L234 589 L234 584 L232 577 L230 571 L226 566 L220 559 L213 554 L204 550 L196 549 L183 548 L164 548 L152 547 L138 544 L130 543 L118 537 L112 533 L106 527 L99 518 L97 514 L93 500 L90 486 L87 468 L85 451 L84 436 L82 421 L81 404 L80 388 L79 378 L80 366 L80 349 L80 336 L81 323 L82 306 L84 291 L86 277 L90 261 L93 248 L96 237 L97 219 L95 207 L93 199 L91 193 L88 189 L83 185 L76 182 L69 180 L61 180 L51 182 L43 184 L35 187 L25 191 L16 197 L8 202 L2 206 L0 208 L0 720","M222 720 L228 701 L232 677 L234 656 L235 635 L235 616 L235 599 L234 587 L232 576 L228 568 L222 560 L210 554 L196 550 L178 548 L158 547 L137 544 L126 541 L114 535 L104 524 L96 509 L91 489 L88 473 L85 449 L83 425 L81 405 L80 383 L81 358 L82 334 L85 305 L90 279 L99 249 L110 230 L121 218 L135 204 L146 193 L157 184 L166 174 L173 164 L179 155 L183 142 L185 131 L187 121 L186 108 L182 95 L174 79 L164 66 L149 58 L133 55 L114 54 L97 58 L77 65 L62 73 L44 83 L28 93 L13 103 L2 110 L0 111 L0 720","M228 720 L231 700 L234 671 L235 653 L235 626 L235 604 L234 586 L231 575 L225 563 L218 558 L207 553 L192 549 L176 548 L159 547 L146 545 L132 542 L121 538 L111 531 L102 520 L96 509 L92 492 L87 466 L84 439 L83 414 L81 383 L82 354 L86 317 L92 290 L102 256 L110 238 L120 225 L133 213 L147 202 L163 190 L178 172 L186 159 L193 144 L198 131 L200 119 L201 106 L199 91 L195 73 L190 62 L183 52 L173 41 L162 33 L147 27 L129 25 L109 29 L91 34 L73 43 L53 54 L37 64 L19 75 L6 85 L0 89 L0 720","M232 720 L235 687 L236 659 L236 639 L236 614 L235 591 L233 581 L229 571 L225 563 L213 555 L200 551 L189 549 L166 547 L147 545 L133 542 L119 537 L107 527 L100 516 L94 503 L89 478 L85 447 L83 421 L82 396 L82 371 L86 336 L91 311 L98 279 L103 263 L110 247 L118 235 L126 227 L137 219 L152 209 L167 202 L182 195 L199 189 L215 183 L227 176 L239 166 L247 159 L252 151 L255 142 L257 134 L258 122 L259 109 L258 93 L254 76 L248 60 L242 47 L236 36 L229 28 L216 18 L202 10 L188 5 L175 2 L161 0 L122 0 L107 2 L92 5 L78 10 L62 17 L48 23 L34 29 L23 35 L11 41 L0 46 L0 720","M235 720 L237 679 L237 653 L237 621 L236 601 L235 588 L231 573 L225 563 L214 555 L200 551 L184 549 L169 547 L147 545 L136 543 L126 539 L116 534 L106 525 L100 514 L94 500 L90 481 L86 450 L84 426 L83 402 L84 371 L89 341 L95 310 L101 289 L108 270 L116 252 L124 241 L134 232 L149 223 L169 214 L183 208 L210 199 L234 191 L245 184 L254 176 L262 168 L268 154 L272 134 L274 118 L275 102 L276 82 L275 66 L273 52 L268 40 L260 22 L251 11 L241 3 L236 0 L51 0 L29 8 L18 13 L6 18 L0 21 L0 720","M238 720 L240 669 L239 641 L238 615 L235 589 L229 569 L224 563 L214 555 L197 550 L175 548 L151 546 L136 543 L119 535 L109 528 L103 519 L95 502 L91 484 L87 459 L85 436 L83 411 L84 388 L88 363 L92 343 L96 323 L103 297 L113 274 L124 256 L137 245 L156 236 L178 230 L207 225 L228 224 L249 229 L268 238 L282 246 L297 251 L314 250 L326 248 L340 241 L349 232 L357 222 L361 210 L365 188 L367 165 L367 147 L364 118 L357 93 L350 69 L341 48 L330 31 L317 17 L308 9 L295 0 L4 0 L0 3 L0 720","M239 720 L240 682 L240 656 L240 627 L238 608 L235 587 L229 570 L222 562 L210 554 L195 550 L165 547 L145 545 L129 539 L114 531 L104 519 L95 501 L90 473 L85 439 L83 409 L89 372 L95 342 L105 312 L115 293 L127 280 L147 269 L161 265 L178 263 L190 263 L203 265 L220 271 L231 279 L242 294 L256 317 L264 334 L270 355 L275 375 L283 395 L290 409 L301 424 L308 433 L321 444 L329 452 L342 460 L359 464 L381 465 L404 462 L422 454 L435 445 L444 432 L450 416 L453 400 L455 381 L456 356 L456 329 L455 302 L451 267 L449 230 L444 178 L439 152 L431 118 L420 81 L411 54 L402 33 L395 17 L385 4 L380 0 L0 0 L0 720","M241 720 L241 678 L240 646 L240 623 L238 604 L236 587 L229 571 L221 561 L210 554 L193 550 L168 547 L145 545 L129 539 L115 531 L106 521 L98 506 L93 490 L89 467 L86 439 L85 409 L91 375 L100 346 L113 321 L124 307 L134 300 L146 296 L164 294 L183 295 L195 300 L204 307 L214 318 L222 331 L228 343 L237 361 L243 379 L250 396 L260 435 L269 464 L278 486 L292 508 L305 525 L318 540 L331 550 L352 560 L381 571 L411 577 L445 580 L486 583 L511 584 L549 579 L575 572 L587 564 L596 551 L601 537 L602 518 L601 502 L595 480 L589 465 L579 452 L562 429 L546 410 L532 393 L517 370 L503 342 L491 315 L479 281 L469 248 L459 208 L453 175 L446 140 L438 108 L428 74 L416 41 L405 18 L395 0 L0 0 L0 720","M243 720 L243 694 L243 670 L241 642 L240 617 L238 604 L236 590 L233 579 L230 573 L225 566 L220 560 L215 557 L208 553 L193 550 L176 547 L159 546 L142 543 L135 540 L126 535 L116 530 L110 525 L104 516 L100 508 L97 500 L93 490 L91 480 L90 469 L89 458 L88 447 L88 432 L88 419 L89 407 L91 397 L95 385 L100 376 L106 366 L115 358 L123 352 L133 348 L144 345 L156 343 L165 343 L177 346 L190 349 L199 354 L210 363 L216 369 L223 378 L231 395 L236 409 L242 425 L248 447 L254 467 L260 487 L266 506 L270 522 L273 536 L277 550 L280 558 L285 567 L291 578 L297 586 L306 600 L316 610 L326 620 L338 629 L347 636 L356 641 L369 647 L385 652 L401 657 L414 660 L441 664 L468 668 L493 669 L515 668 L534 666 L559 661 L580 655 L596 649 L612 643 L623 634 L634 623 L642 612 L652 598 L659 580 L664 565 L670 547 L675 528 L679 513 L682 499 L684 486 L684 475 L683 464 L681 453 L677 445 L672 437 L660 423 L648 412 L638 404 L630 399 L621 394 L606 389 L586 384 L569 376 L555 368 L540 358 L528 347 L519 337 L511 327 L502 316 L495 307 L487 290 L481 275 L476 257 L469 236 L460 208 L454 181 L449 159 L445 139 L440 116 L433 91 L426 67 L416 41 L406 19 L395 0 L0 0 L0 720","M244 720 L244 690 L242 660 L241 638 L240 619 L238 600 L235 586 L231 574 L226 566 L219 559 L210 554 L198 550 L178 548 L157 546 L141 543 L129 537 L120 530 L111 523 L105 513 L100 498 L96 484 L93 472 L92 460 L92 448 L93 433 L95 419 L101 408 L107 402 L117 394 L127 390 L137 389 L148 389 L155 390 L170 395 L181 400 L192 407 L204 416 L212 424 L218 435 L223 451 L229 472 L232 485 L235 509 L238 540 L240 558 L244 580 L250 606 L255 626 L259 639 L267 655 L275 670 L280 679 L287 686 L296 692 L305 697 L318 702 L334 708 L349 712 L372 715 L393 718 L410 720 L628 720 L641 713 L648 705 L654 696 L659 683 L664 669 L671 646 L678 623 L684 596 L689 569 L694 545 L697 527 L699 507 L700 489 L700 473 L698 452 L695 436 L691 419 L685 401 L676 380 L669 364 L663 351 L658 338 L653 321 L648 302 L644 280 L641 260 L640 247 L640 232 L639 221 L636 203 L633 189 L628 180 L621 172 L613 167 L604 162 L592 159 L581 157 L567 156 L551 156 L536 158 L523 163 L512 169 L503 176 L492 184 L480 193 L471 202 L464 209 L460 213 L454 179 L447 148 L442 126 L436 102 L430 80 L425 64 L418 48 L410 28 L403 13 L395 0 L0 0 L0 720","M244 720 L244 681 L241 647 L239 613 L244 639 L249 661 L255 677 L261 691 L268 702 L274 712 L280 717 L285 720 L665 720 L675 688 L683 659 L689 636 L695 607 L699 583 L702 556 L704 515 L705 494 L704 465 L702 444 L697 421 L691 399 L685 385 L674 361 L667 344 L661 328 L654 306 L650 287 L646 268 L643 239 L642 222 L642 206 L643 193 L646 175 L649 155 L653 140 L657 108 L658 93 L656 82 L653 71 L648 60 L644 51 L637 43 L630 36 L623 33 L611 29 L600 27 L589 26 L576 27 L562 31 L547 35 L533 41 L522 47 L509 56 L498 64 L482 76 L472 87 L461 97 L449 108 L440 118 L436 100 L429 79 L424 61 L416 43 L410 29 L404 16 L399 6 L395 0 L0 0 L0 720 M217 558 L208 553 L195 549 L174 548 L159 546 L145 544 L135 540 L128 536 L118 529 L110 521 L105 513 L100 497 L96 484 L94 473 L93 463 L94 453 L96 443 L101 435 L110 429 L121 424 L131 422 L141 422 L156 424 L164 428 L172 433 L180 442 L187 450 L195 461 L201 473 L205 486 L208 497 L213 517 L215 528 L217 539 L218 548 L218 555","M244 720 L244 701 L244 683 L243 663 L247 688 L251 703 L257 714 L261 719 L262 720 L671 720 L677 700 L680 687 L685 667 L690 648 L694 629 L697 611 L701 588 L703 571 L704 550 L705 526 L705 504 L704 467 L702 448 L700 433 L693 406 L686 388 L679 372 L669 348 L660 326 L654 305 L649 281 L645 259 L643 239 L642 216 L644 199 L646 188 L649 173 L652 158 L658 136 L661 122 L663 107 L669 91 L673 72 L673 59 L669 43 L664 28 L655 16 L646 8 L635 4 L620 2 L602 2 L584 3 L565 6 L546 13 L522 23 L503 31 L488 38 L475 46 L461 55 L447 65 L434 74 L429 78 L424 60 L416 44 L409 28 L403 15 L395 0 L0 0 L0 720 M183 548 L171 547 L155 546 L145 544 L133 539 L123 533 L115 525 L110 520 L105 511 L101 501 L99 494 L97 482 L99 470 L104 461 L111 454 L124 451 L134 452 L146 455 L155 461 L166 472 L174 482 L179 494 L182 507 L183 520 L184 530 L184 538 L183 548","M245 720 L244 703 L247 712 L249 718 L251 720 L676 720 L681 706 L685 692 L689 675 L694 655 L697 636 L700 616 L702 601 L703 578 L704 561 L704 538 L705 516 L705 489 L704 464 L702 444 L694 411 L682 377 L673 356 L665 338 L659 322 L652 296 L648 275 L645 257 L644 244 L643 234 L644 221 L649 209 L656 201 L664 193 L676 185 L686 180 L698 174 L708 168 L722 160 L736 152 L746 145 L755 136 L760 128 L765 118 L769 103 L770 93 L769 79 L766 65 L762 53 L757 42 L749 31 L740 21 L731 13 L723 7 L716 3 L710 0 L518 0 L493 9 L480 15 L464 23 L446 32 L434 39 L422 46 L418 48 L410 31 L404 17 L399 7 L395 0 L0 0 L0 720 M168 546 L153 545 L142 543 L133 539 L124 533 L117 527 L110 520 L105 510 L101 502 L99 493 L99 482 L102 475 L112 470 L124 470 L133 474 L141 480 L149 489 L156 499 L161 511 L165 521 L167 530 L168 537 L168 543","M682 720 L686 702 L691 683 L695 664 L697 650 L699 633 L702 608 L703 590 L704 554 L705 527 L705 502 L704 475 L703 458 L701 442 L697 425 L693 410 L686 389 L679 369 L670 350 L663 333 L657 313 L652 294 L649 280 L647 267 L646 250 L646 239 L648 227 L651 220 L655 212 L662 205 L670 198 L680 191 L691 185 L707 179 L722 173 L741 166 L756 158 L769 149 L780 140 L791 131 L804 112 L812 93 L813 79 L811 60 L807 44 L801 31 L794 20 L787 11 L780 4 L775 0 L467 0 L447 8 L433 15 L421 22 L409 29 L405 19 L400 9 L395 0 L0 0 L0 720 M151 545 L141 542 L133 539 L124 533 L117 527 L110 520 L107 514 L103 506 L101 499 L101 492 L104 487 L110 485 L116 485 L121 487 L126 490 L132 496 L137 501 L140 506 L143 513 L145 519 L147 526 L149 532 L150 536 L151 543","M688 720 L692 700 L696 680 L699 660 L700 647 L702 620 L703 602 L704 572 L704 546 L705 524 L705 504 L704 480 L704 465 L702 450 L697 425 L692 407 L686 387 L680 371 L672 354 L665 337 L661 324 L656 309 L652 293 L650 279 L650 269 L651 256 L653 246 L656 237 L662 229 L672 222 L681 217 L695 212 L715 205 L732 201 L754 196 L776 193 L806 189 L827 186 L851 183 L871 178 L885 170 L894 161 L903 150 L911 139 L915 129 L919 117 L921 105 L921 93 L920 79 L915 62 L909 49 L901 34 L891 21 L880 11 L870 3 L864 0 L429 0 L413 6 L401 11 L395 0 L0 0 L0 720 M133 539 L127 536 L120 530 L112 523 L108 517 L106 511 L106 505 L110 501 L114 500 L120 502 L125 507 L131 514 L133 521 L134 527 L134 535","M691 720 L694 708 L696 694 L699 678 L700 663 L701 643 L702 624 L703 598 L704 576 L704 549 L704 529 L705 507 L705 493 L704 476 L703 459 L701 444 L698 427 L692 408 L687 391 L681 373 L675 360 L669 348 L664 333 L659 318 L655 304 L652 291 L651 280 L651 267 L653 256 L656 248 L662 240 L671 234 L680 228 L694 223 L712 218 L728 215 L743 214 L760 213 L777 214 L795 218 L814 224 L829 229 L841 234 L856 239 L867 241 L884 244 L898 245 L908 244 L916 242 L923 239 L931 234 L937 226 L943 217 L946 209 L950 199 L952 189 L952 178 L951 163 L950 149 L949 133 L947 118 L945 101 L941 86 L937 72 L933 60 L928 44 L920 26 L911 11 L904 3 L901 0 L403 0 L396 2 L395 0 L0 0 L0 720 M124 533 L119 529 L113 523 L111 519 L112 514 L115 515 L120 518 L122 523 L123 527 L124 530","M694 720 L697 697 L699 679 L701 653 L702 628 L703 592 L704 565 L704 542 L705 518 L705 497 L704 478 L702 455 L700 438 L697 423 L691 402 L686 387 L681 373 L675 360 L668 346 L664 331 L661 317 L660 303 L662 289 L666 277 L672 265 L683 255 L696 248 L711 243 L723 242 L739 242 L755 244 L770 247 L783 251 L796 256 L808 264 L818 275 L825 285 L832 298 L838 315 L841 331 L843 346 L845 361 L846 371 L850 391 L856 406 L864 418 L876 429 L889 438 L904 442 L920 444 L937 444 L952 442 L965 438 L974 433 L981 426 L988 418 L995 406 L1000 391 L1004 375 L1002 369 L1004 355 L1004 341 L1004 324 L1002 303 L1000 286 L998 267 L995 251 L992 233 L988 211 L984 188 L979 168 L974 151 L968 132 L962 113 L955 94 L947 74 L940 60 L932 44 L924 31 L917 21 L910 9 L902 0 L0 0 L0 720","M696 720 L700 681 L702 642 L703 606 L704 571 L705 528 L705 500 L703 464 L701 442 L697 421 L692 403 L685 384 L679 369 L671 352 L668 341 L665 321 L665 307 L668 296 L676 286 L685 282 L698 279 L716 279 L732 283 L748 290 L758 300 L768 314 L778 329 L786 349 L791 360 L797 376 L801 393 L805 408 L810 425 L816 444 L826 461 L838 475 L848 485 L859 493 L874 499 L891 505 L903 508 L917 509 L933 508 L943 506 L954 503 L963 500 L974 493 L983 486 L988 481 992 475 L1000 463 L1004 453 L1009 438 L1012 423 L1015 399 L1015 379 L1015 361 L1015 346 L1015 327 L1017 309 L1022 294 L1029 277 L1040 252 L1051 228 L1058 207 L1063 191 L1063 176 L1060 157 L1050 139 L1037 129 L1025 125 L1013 122 L1000 121 L987 122 L975 125 L967 128 L961 108 L953 89 L944 67 L934 48 L925 33 L915 17 L909 8 L902 0 L0 0 L0 720","M697 720 L701 668 L704 607 L705 565 L705 523 L703 467 L702 448 L698 428 L694 408 L689 393 L682 376 L678 365 L671 352 L668 337 L668 324 L671 314 L681 305 L693 302 L705 303 L717 308 L731 317 L743 328 L753 340 L760 351 L766 365 L772 379 L777 396 L783 413 L789 430 L795 448 L801 466 L809 484 L819 500 L825 510 L837 523 L850 532 L863 540 L888 547 L912 550 L934 550 L950 547 L966 543 L978 538 L989 531 L997 526 L1002 519 L1008 509 L1014 499 L1020 486 L1025 468 L1031 448 L1035 425 L1038 406 L1040 376 L1040 360 L1041 343 L1042 325 1044 308 L1046 292 L1050 275 L1054 261 L1058 249 L1062 234 L1068 221 L1072 210 L1077 202 L1084 194 L1095 179 L1108 33 L1084 31 L1071 32 L1053 34 L1039 37 L1023 41 L1013 45 L1003 50 L988 60 L973 70 L961 80 L953 87 L946 70 L937 53 L927 37 L918 22 L909 9 L903 0 L0 0 L0 720","M699 720 L701 679 L703 642 L704 603 L705 568 L705 527 L704 502 L704 478 L703 458 L700 435 L695 413 L690 396 L684 382 L679 370 L674 358 L672 351 L672 341 L673 330 L676 324 L681 320 L689 319 L700 323 L709 328 L716 335 L723 343 L732 355 L738 368 L746 381 L752 396 L760 413 L766 426 L773 442 L778 456 L783 472 L791 490 L798 508 L806 521 L816 533 L826 545 L839 555 L851 565 L865 572 L881 577 L900 580 L916 581 L934 581 L950 579 L964 575 L977 569 L984 565 L994 557 L1003 548 L1012 539 L1018 532 L1025 524 L1033 509 L1040 491 L1045 470 L1050 446 L1055 418 L1059 385 L1062 360 L1064 331 L1067 306 L1072 280 L1082 241 L1102 191 L1094 13 L1082 9 L1071 6 L1057 5 L1042 5 L1027 8 L1014 11 L1001 17 L987 23 L976 30 L964 38 L953 45 L945 51 L938 55 L927 36 L916 20 L903 0 L0 0 L0 720","M701 720 L703 672 L704 623 L704 584 L705 544 L704 512 L704 475 L702 447 L699 432 L696 416 L691 400 L685 385 L681 373 L678 363 L679 355 L680 350 L683 347 L689 346 L694 348 L698 352 L704 359 L708 366 L712 374 L717 384 L723 397 L731 412 L738 426 L744 442 L748 455 L753 468 L759 485 L764 500 L773 520 L780 536 L792 551 L806 566 L822 578 L835 589 L854 598 L871 602 L888 605 L912 607 L937 608 L969 603 L987 598 L1009 586 L1023 575 L1034 563 L1044 544 L1053 524 L1061 501 L1066 474 L1071 454 L1075 430 L1078 410 L1084 388 L1083 0 L978 0 L967 6 L960 10 L953 15 L946 20 L935 28 L926 34 L913 15 L903 0 L0 0 L0 720","M701 720 L703 683 L704 649 L705 615 L705 583 L705 538 L704 499 L703 474 L702 453 L700 436 L697 420 L692 401 L687 389 L686 384 L687 379 L690 378 L694 380 L698 388 L706 403 L712 416 L718 429 L723 442 L728 457 L733 473 L738 491 L742 504 L746 517 L751 529 L759 545 L768 560 L778 573 L788 586 L798 597 L813 607 L831 617 L848 625 L872 633 L894 637 L922 637 L945 635 L968 632 L990 626 L1009 617 L1022 608 L1036 595 L1045 582 L1057 565 L1065 547 L1073 528 L1078 511 L1086 489 L1084 0 L940 0 L923 10 L913 16 L903 0 L0 0 L0 720","M701 720 L703 685 L704 638 L705 591 L705 552 L704 518 L704 488 L702 459 L701 442 L699 429 L704 444 L710 459 L717 483 L724 504 L732 526 L742 549 L754 575 L765 593 L776 608 L791 623 L804 635 L822 647 L841 655 L867 661 L893 665 L921 664 L949 663 L970 661 L991 656 L1014 647 L1032 637 L1044 627 L1057 613 L1068 595 L1077 580 L1089 556 L1086 0 L912 0 L905 3 L903 0 L0 0 L0 720","M701 720 L703 683 L704 632 L705 587 L705 556 L704 528 L704 501 L712 527 L717 545 L724 568 L732 586 L741 605 L756 628 L769 645 L785 662 L798 674 L815 684 L845 694 L875 698 L908 701 L946 700 L977 696 L1004 689 L1025 680 L1045 667 L1061 653 L1071 639 L1081 614 L1088 0 L0 0 L0 720","M701 720 L702 695 L703 662 L704 631 L705 597 L705 561 L713 588 L723 615 L733 636 L747 658 L760 673 L778 692 L797 705 L815 713 L832 719 L837 720 L990 720 L1013 712 L1035 702 L1055 689 L1072 675 L1084 657 L1087 0 L0 0 L0 720","M701 720 L702 691 L704 658 L705 617 L712 640 L719 657 L729 672 L742 689 L754 704 L765 712 L774 718 L779 720 L1045 720 L1056 715 L1067 709 L1078 701 L1087 689 L1086 0 L0 0 L0 720","M701 720 L702 701 L703 680 L704 665 L712 685 L722 700 L733 712 L740 718 L744 720 L1075 720 L1088 712 L1088 0 L0 0 L0 720","M701 720 L702 707 L703 695 L711 710 L714 715 L718 719 L719 720 L1086 720 L1090 0 L0 0 L0 720","M701 720 L702 713 L706 720 L1086 720 L1089 0 L0 0 L0 720","M1080 720 L1080 0 L0 0 L0 720"];

//
//    Animation
//
//Handles the germ animation. While this is drawing the idle animation, the
//painting animation is rendered by the image transition code.
//

let animation = null;

(function(){
	//  Variables  //
	
	let is_running = false;
	let is_paused = false;
	
	//This is not the exact fps due to the millisecond precision of setInterval.
	let fps = 15;
	
	let chance_blink = [2, 3];
	let chance_rat = [2, 4];
	let is_rat_clip = false;
	let steps_to_blink = -1;
	let steps_to_rat = -1;
	
	
	let should_paint = false;
	let painting_promise = null;
	let painting_callback = null;
	let idle_frame_end = 39;
	let idle_frame_start = 12;
	
	
	let interval_id = undefined;
	
	
	let img_map = null;
	let animation_germ_node = document.querySelector("#animation_germ_node");
	let animation_paint_node = document.querySelector("#animation_paint_node");
	let transition_path_node = document.querySelector("#transition_path_node");
	let text_container = document.querySelector(".text_container");
	
	let animation_paint_can = document.querySelector("#animation_paint_can");
	
	
	//let map_url = "./images/animation/animation_map_v4.png";
	let map_url = "./images/animation/animation_map_hatless_v1.png";
	
	if(animation_germ_node !== null){
		animation_germ_node.style.backgroundImage = `url("${map_url}")`;
	}
	if(animation_paint_can !== null){
		animation_paint_can.style.backgroundImage = `url("${map_url}")`;
	}
	
	
	//  Functions  //
	
	let frame_number = undefined;
	let animation_type = undefined;
	let map_array = undefined;
	
	let draw_idle = function(){
		if(should_paint === true
		&& frame_number === idle_frame_end){
			draw_frame = draw_painting;
			set_animation("painting");
			draw_painting();
			return;
		}
		if(frame_number === 0){
			steps_to_blink -= 1;
			
			if(steps_to_blink < 0){
				steps_to_blink = get_steps_to_event(...chance_blink);
			}
			
			if(steps_to_blink === 0){
				map_array = map_data["idle_blink"];
			} else {
				map_array = map_data["idle"];
			}
		}
		
		let data = map_array[frame_number];
		
		if(data === null){
			data = map_array[frame_number - 1];
		}
		
		
		animation_germ_node.style.width = (data[0] + "px");
		animation_germ_node.style.height = (data[1] + "px");
		animation_germ_node.style.backgroundPositionX = (-data[2] + "px");
		animation_germ_node.style.backgroundPositionY = (-data[3] + "px");
		//animation_germ_node.style.top = (data[4] + "px");
		animation_germ_node.style.transform = ("translateY(" + data[4] + "px)");
		
		
		//top in pixel
		//left in pixel
		//angle in dregrees
		hat.set_position(
			data[6],
			data[7],
			data[8]
		);
		
		
		frame_number = ((frame_number + 1) % map_array.length);
	};
	
	let draw_painting = function(){
		if(frame_number === 0){
			steps_to_rat -= 1;
			
			if(steps_to_rat < 0){
				steps_to_rat = get_steps_to_event(...chance_rat);
			}
			
			if(steps_to_rat === 0){
				is_rat_clip = true;
			} else {
				is_rat_clip = false;
			}
		}
		if(frame_number === 5){
			hide_image_text();
		}
		if(frame_number === 40){
			show_image_text();
		}
		if(frame_number === 55){
			animation_paint_can.style.display = "block";
		}
		
		//Handle switching between placeholder and video.
		if(frame_number === 18
		&& transition_object_current.is_video){
			let is_child = (transition_object_current.img.parentElement === transition_parent_current);
			
			if(is_child){
				transition_parent_current.removeChild(
					transition_object_current.img
				);
				transition_parent_current.appendChild(
					transition_object_current.placeholder_img
				);
			}
		}
		if(frame_number === path_data.clippath.length
		&& transition_object_next.is_video){
			let is_child = (transition_object_next.placeholder_img.parentElement === transition_parent_next);
			
			if(is_child){
				transition_parent_next.removeChild(
					transition_object_next.placeholder_img
				);
				transition_parent_next.appendChild(
					transition_object_next.img
				);
			}
		}
		
		
		let data = map_array[frame_number];
		
		if(data === null){
			data = map_array[frame_number - 1];
		}
		
		
		animation_germ_node.style.width = (data[0] + "px");
		animation_germ_node.style.height = (data[1] + "px");
		animation_germ_node.style.backgroundPositionX = (-data[2] + "px");
		animation_germ_node.style.backgroundPositionY = (-data[3] + "px");
		//animation_germ_node.style.top = (data[4] + "px");
		animation_germ_node.style.transform = ("translateY(" + data[4] + "px)");
		
		
		//top in pixel
		//left in pixel
		//angle in dregrees
		hat.set_position(
			data[6],
			data[7],
			data[8]
		);
		
		
		if(frame_number < path_data.paint_normal.length){
			if(is_rat_clip === true){
				animation_paint_node.setAttribute(
					"d",
					path_data.paint_rat[frame_number]
				);
			} else {
				animation_paint_node.setAttribute(
					"d",
					path_data.paint_normal[frame_number]
				);
			}
		}
		if(frame_number < path_data.clippath.length){
			transition_path_node.setAttribute(
				"d",
				path_data.clippath[frame_number]
			);
		}
		
		
		frame_number += 1;
		
		if(frame_number >= map_array.length){
			should_paint = false;
			
			draw_frame = draw_idle;
			set_animation("idle");
			frame_number = idle_frame_start;
			
			if(typeof painting_callback === "function"){
				painting_callback();
			}
			painting_callback = null;
			painting_promise = null;
		}
	};
	
	let draw_frame = draw_idle;
	
	
	let interval_function = function(){
		draw_frame();
	};
	
	let set_interval = function(){
		interval_id = setInterval(
			interval_function,
			(1000 / fps)
		);
	};
	
	
	let set_animation = function(type){
		frame_number = 0;
		animation_type = type;
		map_array = map_data[type];
		
		if(type.includes("idle")){
			animation_paint_can.style.display = "block";
		} else {
			animation_paint_can.style.display = "none";
		}
	};
	
	let unset_animation = function(type){
		animation_type = undefined;
		draw_frame = draw_idle;
		
		animation_paint_node.setAttribute("d", "");
		transition_path_node.setAttribute("d", "");
	};
	
	//Takes a small and an equal or larger natural number and returns a random
	//integer between min and max inclusive. If the input doesn't match these
	//requirements the output may have an unexpected range.
	let get_steps_to_event = function(min, max){
		return (Math.floor((max - min + 1) * Math.random()) + min);
	};
	
	
	//  Methods  //
	
	let load = function(){
		if(img_map === null){
			return;
		}
		
		return new Promise(function(resolve, reject){
			if(animation_germ_node === null){
				reject();
				return;
			}
			
			try {
				img_map = document.createElement("img");
				img_map.src = map_url;
				
				img_map.onload = resolve;
				img_map.onerror = reject;
			} catch(error){
				console.error(error);
				reject();
			}
		});
	};
	
	
	let start = function(){
		if(is_running === true){
			return;
		}
		
		clearInterval(interval_id);
		
		is_running = true;
		is_paused = false;
		
		set_animation("idle");
		
		if(page_visibility.is_visible !== true){
			stop();
		} else {
			set_interval();
			interval_function();
		}
	};
	
	let stop = function(){
		if(is_running === false){
			return;
		}
		
		clearInterval(interval_id);
		
		is_running = false;
		is_paused = false;
		
		unset_animation();
	};
	
	let pause = function(){
		if(is_running !== true
		|| pause === true){
			return;
		}
		
		clearInterval(interval_id);
		is_paused = true;
	};
	
	let unpause = function(){
		if(is_paused !== true){
			return;
		}
		if(menu.is_open === true){
			return;
		}
		if(page_visibility.is_visible !== true){
			return;
		}
		
		is_paused = false;
		
		set_interval();
		interval_function();
	};
	
	
	let schedule_painting = function(){
		if(should_paint === true){
			return painting_promise;
		}
		should_paint = true;
		
		painting_promise = new Promise(function(resolve, reject){
			painting_callback = resolve;
		});
		
		return painting_promise;
	};
	
	
	//  Return  //
	
	animation = ({
		load: load,
		
		start: start,
		stop: stop,
		pause: pause,
		unpause: unpause,
		
		schedule_painting: schedule_painting
	});
	
})();

//
//    Automatic Timer
//
//Handles switching the image after the set amount of time runs out.
//
//These are the uses of the timer:
//    - When an image is fully visible the timer is reset.
//    - When the tab becomes hidden the timer is paused and when it becomes
//      visible it is unpaused.
//    - When the menu is opened the timer is canceled. When the menu closes the
//      timer is either reset immediately or after the image is fully visible.
//

let automatic_timer = null;

(function(){
	//  Variables  //
	
	let timer_id = undefined;
	let is_running = false;
	let is_paused = false;
	
	let start_time = undefined;
	let duration_at_start = undefined;
	let pause_time_remaining = undefined;
	
	const timer_duration_default_seconds = 15;
	
	
	//  Functions  //
	
	let get_timer_duration = function(){
		try {
			return (settings.get("time_per_image") * 1000);
		} catch(error){
			console.error(error);
			return (timer_duration_default_seconds * 1000);
		}
	};
	
	let set_next_image = function(){
		console_log("called set_next_image", get_time());
		image_viewer.next_image();
	};
	
	let timer_callback = function(){
		console_log("called timer_callback", get_time());
		if(is_paused === true
		|| is_running === false){
			return;
		}
		
		is_paused = false;
		is_running = false;
		
		set_next_image();
	};
	
	
	//  Methods  //
	
	let reset_timer = function(){
		console_log("Resetting timer");
		is_paused = false;
		is_running = true;
		
		clearTimeout(timer_id);
		
		start_time = get_time();
		duration_at_start = get_timer_duration();
		timer_id = setTimeout(timer_callback, duration_at_start);
		pause_time_remaining = undefined;
		
		console_log("Resetting", {
			time_remaining: duration_at_start,
			time_now: start_time
		});
		
		adjust_paint_transition_duration();
		
		if(page_visibility.is_visible !== true){
			pause_timer();
		}
	};
	
	let cancel_timer = function(){
		clearTimeout(timer_id);
		
		timer_id = undefined;
		is_running = false;
		is_paused = false;
		
		start_time = undefined;
		duration_at_start = undefined;
		pause_time_remaining = undefined;
		console_log("The timer has been canceled.");
	};
	
	let pause_timer = function(){
		console_log("Pausing?");
		if(is_paused === true
		|| is_running !== true){
			return;
		}
		
		is_paused = true;
		
		let time_now = get_time();
		clearTimeout(timer_id);
		timer_id = undefined;
		
		let time_elapsed = (time_now - start_time);
		pause_time_remaining = (duration_at_start - time_elapsed);
		
		start_time = undefined;
		duration_at_start = undefined;
		
		console_log("Pausing", {
			time_remaining: pause_time_remaining,
			time_now: time_now
		});
	};
	
	let unpause_timer = function(){
		console_log("Unpausing?");
		if(is_paused !== true){
			return;
		}
		if(page_visibility.is_visible !== true){
			return;
		}
		
		is_paused = false;
		
		start_time = get_time();
		timer_id = setTimeout(timer_callback, pause_time_remaining);
		duration_at_start = pause_time_remaining;
		pause_time_remaining = undefined;
		
		console_log("Unpausing", {
			time_remaining: duration_at_start,
			time_now: start_time
		});
	};
	
	
	//  Return  //
	
	automatic_timer = ({
		reset: reset_timer,
		cancel: cancel_timer,
		pause: pause_timer,
		unpause: unpause_timer,
		
		get time_remaining(){
			if(is_running !== true){
				return settings.get("time_per_image");
			}
			
			if(is_paused === true){
				return pause_time_remaining;
			}
			
			return (duration_at_start - (get_time() - start_time));
		}
	});
})();

//
//    Hat Artist
//
//Handles rendering of the artist hat animation.
//

let hat = null;

(function(){
	//  Variables  //
	
	let hat_node = document.querySelector("#hat_layer");
	
	let hat_area = document.querySelector("#hat_area");
	let hat_peak = document.querySelector("#hat_peak");
	
	let pos_x = undefined;
	let pos_y = undefined;
	let angle = undefined;
	
	let offset_x = undefined;
	let offset_y = undefined;
	
	let style_x = undefined;
	let style_y = undefined;
	let style_angle = undefined;
	
	
	//  Functions  //
	
	let set_style = function(){
		let new_x = Math.round(pos_x);
		let new_y = Math.round(pos_y);
		
		style_x = new_x;
		hat_node.style.left = (style_x + "px");
		
		
		style_y = new_y;
		hat_node.style.top = (style_y + "px");
		
		
		style_angle = angle;
		hat_node.style.transform = ("rotate(" + style_angle + "deg)");
	};
	
	
	//  Methods  //
	
	let set_position = function(new_x, new_y, new_angle){
		if(pos_x === undefined){
			pos_x = new_x;
			pos_y = new_y;
			angle = new_angle;
			
			offset_x = 0;
			offset_y = 0;
			
			set_style();
			return;
		}
		
		
		if(new_angle !== angle){
			angle = new_angle;
		}
		
		if(new_x !== pos_x){
			pos_x = new_x;
		}
		if(new_y !== pos_y){
			pos_y = new_y;
		}
		
		set_style();
	};
	
	let reset_position = function(){
		pos_x = undefined;
		pos_y = undefined;
		angle = undefined;
		
		offset_x = undefined;
		offset_y = undefined;
	};
	
	
	//  Return  //
	
	hat = ({
		set_position: set_position,
		reset_position: reset_position
	});
	
})();

//
//    Image Viewer
//
//Handles preloading and switching the images.
//

let image_viewer = null;

(function(){
	//  Variables  //
	
	let image_container = document.querySelector("#image_area");
	let has_loaded = false;
	
	let is_rerun = false;
	
	let current_id = undefined;
	let current_index = undefined;
	let rerun_id = undefined;
	let rerun_index = undefined;
	
	let set_first_color = false;
	
	
	//A boolean indicating if we are currently transitioning the image. It's
	//used to prevent closing the menu without setting an image from resetting
	//the automatic timer while the image is changing.
	let is_transitioning = true;
	
	//A boolean indicating if the current image should be replaced by the next
	//image when it loads instead of waiting on the automatic timer. This is
	//used for when the image hasn't loaded by the time the timer ran out.
	let waiting_for_next_to_load = true;
	
	
	//Keeps track of the data of the currently shown image and the next shown
	//image. The next image to show is always first set in the variable next and
	//replaces the current one during the transition.
	//
	//These are the properties:
	//    index: [Number or undefined]
	//        The images index in the submission array or undefined if it's not
	//        set.
	//    id: [String or undefined]
	//        The ID of the image or undefined if it's not set.
	//    img: ["img" node, "video" node or null]
	//        An "img" or "video "HTML node used to load and display the image
	//        or video, or null if it's not set.
	//    is_loaded: [Boolean or undefined]
	//        A boolean indicating the image's loading status or undefined if
	//        the image is not set. If the image is set then false means the
	//        image is loading and true means the image is ready to use. There
	//        is no state for a loading error as in that case the next image
	//        will be loaded instead.
	//    is_rerun: [Boolean]
	//        A boolean indicating if the image is shown due to a rerun. If the
	//        next image is a rerun but the current one is not we know we are
	//        starting one.
	//    is_video: [Boolean]
	//        A boolean indicating if the file is an img or video node.
	//
	//    (video only)
	//
	//    video_loaded: [Boolean]
	//        A boolean indicating if the video is done loading.
	//    placeholder_loaded: [Boolean]
	//        A boolean indicating if the placeholder image is done loading.
	//    placeholder_img: ["img" node]
	//        The "img" node for the video placeholder.
	let current = {
		index: undefined,
		id: undefined,
		img: null,
		is_loaded: undefined,
		is_rerun: false,
		is_video: false
	};
	let next = {
		index: undefined,
		id: undefined,
		img: null,
		is_loaded: undefined,
		is_rerun: false,
		is_video: false
	};
	
	
	//Used to keep track of the created object URLs so that we can revoke them
	//and clear up memory.
	let created_object_urls = new Set();
	
	
	//  Functions  //
	
	let clear_unused_object_urls = function(){
		for(let url of created_object_urls){
			let is_used = false;
			
			if(is_object(current.img)
			&& current.img.src === url){
				is_used = true;
			}
			if(is_object(next.img)
			&& next.img.src === url){
				is_used = true;
			}
			
			if(is_used !== true){
				URL.revokeObjectURL(url);
				created_object_urls.delete(url);
			}
		}
	};
	
	let get_object_url = function(blob){
		clear_unused_object_urls();
		
		let object_url = URL.createObjectURL(blob);
		
		created_object_urls.add(object_url);
		
		return object_url;
	};
	
	
	let get_index_by_id = function(id){
		for(let i = 0;i < submissions.length;i += 1){
			if(Submission.get_id(i) === id){
				return i;
			}
		}
		
		return -1;
	};
	
	
	let get_image_url = function(index){
		let type = Submission.get_type(index);
		let id = Submission.get_id(index);
		
		return (`./images/gallery_resized/${id}_resized.${type}`);
	};
	
	let get_placeholder_url = function(index){
		let type = "png";
		let id = Submission.get_id(index);
		
		return (`./images/gallery_resized/${id}_placeholder.${type}`);
	};
	
	//Returns an "img" or "video" element.
	let get_image_node = function(object){
		let index = object.index;
		let url = get_image_url(index);
		
		if(object.is_video){
			let video = document.createElement("video");
			
			//The URL will be set at a later point.
			video.muted = true;
			video.autoplay = true;
			video.loop = true;
			
			prefetch_video(index, video, url);
			
			return video;
		} else {
			let img = document.createElement("img");
			
			img.addEventListener("load", img_on_load, false);
			img.addEventListener("error", img_on_error, false);
			
			img.src = url;
			
			return img;
		}
	};
	
	let get_placeholder_node = function(object){
		let index = object.index;
		let url = get_placeholder_url(index);
		
		let img = document.createElement("img");
		
		img.addEventListener("load", placeholder_on_load, false);
		img.addEventListener("error", placeholder_on_error, false);
		
		img.src = url;
		
		return img;
	};
	
	//Fills in the given object with more properties based on the file type and
	//returns it.
	let get_image_object = function(object){
		//  Set Properties  //
		
		object.is_video = Submission.is_video(object.index);
		
		if(object.is_video){
			object.video_loaded = false;
			object.placeholder_loaded = false;
		}
		
		//  Create Nodes  //
		
		object.img = get_image_node(object);
		
		if(object.is_video){
			object.placeholder_img = get_placeholder_node(object);
		}
		
		if(set_first_color === false){
			set_paint_color(object.index);
		}
		
		return object;
	};
	
	
	
	let img_on_load = function(){
		//Ignore if we aren't the next image.
		if(next.img !== this){
			return;
		}
		
		console_log("Next image loaded");
		
		next.is_loaded = true;
		
		//This has to come before checking for transitioning or the transition
		//would block changing the paint color from the default value for the
		//first image to show if the loading was slow enough to wait for the
		//image.
		if(is_transitioning !== true
		|| set_first_color === false){
			set_paint_color(next.index);
		}
		
		if(waiting_for_next_to_load === true
		&& is_loading === false){
			transition_to_next_image();
		}
	};
	
	let img_on_error = function(){
		//Ignore if we aren't the next image.
		if(next.img !== this){
			return;
		}
		
		console_log("Next image failed to load");
		
		next = create_next_next_object();
	};
	
	
	let prefetch_video = async function(index, video_node, url){
		let on_video_error = function(){
			console_log("Next video failed to load");
			
			next = create_next_next_object();
		};
		
		//The allowed content types includes the value null because some hosts
		//may not set the content type for all files.
		let allowed_types = [
			null,
			"video/mp4",
			"video/webm"
		];
		
		try {
			let response = await fetch(url);
			let content_type = response.headers.get("content-type");
			
			if(response.status < 200
			|| response.status >= 300){
				throw "Error fetching video data.";
			}
			if(!allowed_types.includes(content_type)){
				throw "Wrong content type of video.";
			}
			
			let blob = await response.blob();
			
			//If there is an error creating a blob from the response the size is
			//0 and the type is "". The type may be an empty string even if the
			//blob is valid if the content type couldn't be determined.
			if(blob.size === 0
			&& blob.type === ""){
				throw "Unable to create blob from fetched video data.";
			}
			
			//Ignore if we aren't the next image.
			if(next.img !== video_node){
				return;
			}
			
			
			let object_url = get_object_url(blob);
			video_node.src = object_url;
			
			
			
			console_log("Next video loaded");
			
			next.video_loaded = true;
			
			if(next.placeholder_loaded !== true){
				return;
			}
			next.is_loaded = true;
			
			
			//This has to come before checking for transitioning or the transition
			//would block changing the paint color from the default value for the
			//first image to show if the loading was slow enough to wait for the
			//image.
			if(is_transitioning !== true
			|| set_first_color === false){
				set_paint_color(next.index);
			}
			
			if(waiting_for_next_to_load === true
			&& is_loading === false){
				transition_to_next_image();
			}
		} catch(error){
			console.error(error);
			on_video_error();
		}
	};
	
	
	let placeholder_on_load = function(){
		//Ignore if we aren't the next image.
		if(next.placeholder_img !== this){
			return;
		}
		
		console_log("Next placeholder image loaded");
		
		next.placeholder_loaded = true;
		
		if(next.video_loaded !== true){
			return;
		}
		next.is_loaded = true;
		
		
		//This has to come before checking for transitioning or the transition
		//would block changing the paint color from the default value for the
		//first image to show if the loading was slow enough to wait for the
		//image.
		if(is_transitioning !== true
		|| set_first_color === false){
			set_paint_color(next.index);
		}
		
		if(waiting_for_next_to_load === true
		&& is_loading === false){
			transition_to_next_image();
		}
	};
	
	let placeholder_on_error = function(){
		//Ignore if we aren't the next image.
		if(next.placeholder_img !== this){
			return;
		}
		
		console_log("Next placeholder image failed to load");
		
		next = create_next_next_object();
	};
	
	
	
	
	let create_object_from_index = function(index){
		return get_image_object({
			index: index,
			id: Submission.get_id(index),
			is_loaded: false,
			is_rerun: false
		});
	};
	
	//Only called at the start of the page to load the first image.
	let create_current_object = function(){
		if(is_rerun === true){
			return get_image_object({
				index: rerun_index,
				id: rerun_id,
				is_loaded: false,
				is_rerun: true
			});
		} else {
			return get_image_object({
				index: current_index,
				id: current_id,
				is_loaded: false,
				is_rerun: false
			});
		}
	};
	
	let create_next_object = function(){
		if(current.index === undefined){
			return create_current_object();
		}
		
		if(current.is_rerun === true){
			let next_index = ((current.index + 1) % submissions.length);
			
			return get_image_object({
				index: next_index,
				id: Submission.get_id(next_index),
				is_loaded: false,
				is_rerun: true
			});
		} else {
			if((current.index + 1) >= submissions.length){
				//We are switching from a non-rerun to a rerun so use the rerun
				//index.
				let next_index = rerun_index;
				
				//If the rerun index is the same as the current index skip it so
				//that we don't transition from the last image to the same image
				//again.
				if(next_index === current.index){
					next_index = ((next_index + 1) % submissions.length);
				}
				
				return get_image_object({
					index: next_index,
					id: Submission.get_id(next_index),
					is_loaded: false,
					is_rerun: true
				});
			} else {
				let next_index = ((current.index + 1) % submissions.length);
				
				return get_image_object({
					index: next_index,
					id: Submission.get_id(next_index),
					is_loaded: false,
					is_rerun: false
				});
			}
		}
	};
	
	let create_next_next_object = function(){
		if(next.index === undefined){
			return create_next_object();
		}
		
		if(next.is_rerun === true){
			let next_next_index = ((next.index + 1) % submissions.length);
			
			return get_image_object({
				index: next_next_index,
				id: Submission.get_id(next_next_index),
				is_loaded: false,
				is_rerun: true
			});
		} else {
			if((next.index + 1) >= submissions.length){
				//We are switching from a non-rerun to a rerun so use the rerun
				//index.
				let next_next_index = rerun_index;
				
				//If the rerun index is the same as the current index skip it so
				//that we don't transition from the last image to the same image
				//again.
				if(next_next_index === current.index){
					next_next_index = ((next_next_index + 1) % submissions.length);
				}
				
				return get_image_object({
					index: next_next_index,
					id: Submission.get_id(next_next_index),
					is_loaded: false,
					is_rerun: true
				});
			} else {
				let next_next_index = ((next.index + 1) % submissions.length);
				
				return get_image_object({
					index: next_next_index,
					id: Submission.get_id(next_next_index),
					is_loaded: false,
					is_rerun: false
				});
			}
		}
	};
	
	
	
	let transition_to_next_image = async function(){
		console_log("Transitioning to next image");
		
		if(next.index === undefined){
			console_log("Starting to load the next image :/");
			next = create_next_object();
			return;
		}
		
		if(next.is_loaded === false){
			console_log("Waiting for the next image to finish loading.");
			waiting_for_next_to_load = true;
			return;
		}
		
		waiting_for_next_to_load = false;
		automatic_timer.cancel();
		set_first_color = true;
		
		
		let object_current = current;
		let object_next = next;
		
		current = next;
		next = create_next_object();
		
		save_last_data();
		
		
		is_transitioning = true;
		await transition.run(
			object_current,
			object_next
		);
		is_transitioning = false;
		
		set_paint_color(next.index);
		
		console_log("Transition finished");
		automatic_timer.reset();
		clear_unused_object_urls();
	};
	
	
	
	let save_last_data = async function(){
		is_rerun = current.is_rerun;
		
		if(current.is_rerun === true){
			rerun_id = current.id;
			rerun_index = current.index;
		} else {
			current_id = current.id;
			current_index = current.index;
		}
		
		let data = {
			current_id: current_id,
			is_rerun: is_rerun,
			rerun_id: rerun_id
		};
		
		await set_last_file(data);
	};
	
	
	//  Methods  //
	
	let load = async function(){
		if(has_loaded === true){
			return;
		}
		has_loaded = true;
		
		try {
			let string = await get_last_file();
			
			if(string.length === 0){
				throw "Last file data doesn't exist.";
			};
			let data = JSON.parse(string);
			
			if(typeof data !== "object"){
				throw "Loaded last file data is not an object.";
			}
			
			
			current_index = get_index_by_id(data["current_id"]);
			if(current_index >= 0){
				current_id = data["current_id"];
			} else {
				current_index = 0;
				current_id = Submission.get_id(current_index);
			}
			
			is_rerun = data["is_rerun"];
			if(is_rerun !== true){
				is_rerun = false;
			}
			
			rerun_index = get_index_by_id(data["rerun_id"]);
			if(rerun_index >= 0){
				rerun_id = data["rerun_id"];
			} else {
				rerun_index = 0;
				rerun_id = Submission.get_id(rerun_index);
			}
			
			
			//Disable rerun if the current index is not the last one and set the
			//image to view next to the next one.
			if(is_rerun === true
			&& current_index < (submissions.length - 1)){
				is_rerun = false;
				current_index += 1;
				current_id = Submission.get_id(current_index);
			}
		} catch(error){
			console.error(error);
			
			current_index = 0;
			current_id = Submission.get_id(current_index);
			is_rerun = false;
			rerun_index = 0;
			rerun_id = Submission.get_id(rerun_index);
			
			console_log("Error loading next data, using default values instead.");
		}
		
		console_log("Loaded image viewer");
		
		next = create_current_object();
	};
	
	
	
	
	//Used when the user selects an image. The automatic timer uses next_image
	//isntead. The difference is that this takes an argument about which image
	//should be the next and it doesn't create reruns.
	let set_image = function(index){
		//Ignore if it's an invalid image index.
		if(typeof index !== "number"
		|| Number.isNaN(index)
		|| index < 0
		|| index >= submissions.length
		|| (index % 1) !== 0){
			console_log("Got an invalid image index:", index);
			automatic_timer.reset();
			return;
		}
		
		automatic_timer.cancel();
		
		
		if(current.index === index){
			current.is_rerun = false;
			save_last_data();
			automatic_timer.reset();
			
			//Set the next object to not be a rerun as well.
			next.is_rerun = false;
			
			return;
		}
		
		if(next.index === index){
			if(next.is_loaded === false){
				waiting_for_next_to_load = true;
				next.is_rerun = false;
				return;
			}
			
			next.is_rerun = false;
			transition_to_next_image();
			return;
		}
		
		next = create_object_from_index(index);
		waiting_for_next_to_load = true;
		set_paint_color(index);
		clear_unused_object_urls();
	};
	
	//Used by the automatic timer to transition to the next image.
	let next_image = function(){
		automatic_timer.cancel();
		
		transition_to_next_image();
	};
	
	
	//  Return  //
	
	image_viewer = ({
		load: load,
		
		get is_transitioning(){
			return is_transitioning;
		},
		get current_index(){
			return current_index;
		},
		get has_set_first_color(){
			return set_first_color;
		},
		
		set_image: set_image,
		next_image: next_image
	});
	
})();

//
//    Set Paint Color
//
//Takes an image index and sets all paints to the image's average color.
//

let set_paint_color = null;
let adjust_paint_transition_duration = null;

(function(){
	//  Variables  //
	
	let set_color_index = NaN;
	let was_called_once = false;
	
	let paint_can = document.querySelector("#paintcan_svg > path");
	let paint_brush = document.querySelector("#animation_paint_node");
	
	
	//  Functions  //
	
	let get_fill_color = function(r, g, b){
		return (`rgb(${r}, ${g}, ${b})`);
	};
	
	let get_stroke_color = function(r, g, b){
		let factor = 0.6667;
		
		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);
		
		return (`rgb(${r}, ${g}, ${b})`);
	};
	
	
	//  Return  //
	
	set_paint_color = function(index){
		if(index === set_color_index){
			return;
		}
		set_color_index = index;
		
		
		let hex = Submission.get_average_color(index);
		
		let [r, g, b] = [0, 0, 0];
		let rgb = hex_to_rgb(hex);
		
		if(rgb !== null){
			[r, g, b] = rgb;
		}
		
		
		let transition_duration;
		
		if(image_viewer.has_set_first_color === true){
			transition_duration = Math.max(
				0.5,
				(automatic_timer.time_remaining / 1000)
			);
		} else {
			if(was_called_once === false){
				transition_duration = 0;
			} else {
				transition_duration = 0.5;
			}
		}
		was_called_once = true;
		
		
		let fill_color = get_fill_color(r, g, b);
		let stroke_color = get_stroke_color(r, g, b);
		
		if(paint_can !== null){
			paint_can.style.transitionDuration = (transition_duration + "s");
			paint_can.style.fill = fill_color;
		}
		if(paint_brush !== null){
			paint_brush.style.fill = fill_color;
			paint_brush.style.stroke = stroke_color;
		}
	};
	
	
	adjust_paint_transition_duration = function(){
		paint_can.style.transitionDuration = (
			settings.get("time_per_image") + "s"
		);
	};
	
})();

//
//    Transition
//
//Handles drawing transitions between images.
//

let transition = null;

let transition_parent_current = null;
let transition_parent_next = null;

let transition_object_current = null;
let transition_object_next = null;

let new_text_user = "";
let new_text_description = "";

let hide_image_text = null;
let show_image_text = null;


(function(){
	//  Variables  //
	
	//An ID used to detect if a transition has been overwritten. This prevents
	//cleaning up the same transition twice which would remove both the current
	//and next image.
	let transition_id = 0;
	
	let is_running = false;
	
	let image_container = document.querySelector("#image_area");
	let transition_path_node = document.querySelector("#transition_path_node");
	
	let text_container = document.querySelector(".text_container");
	let text_user = document.querySelector(".text_user");
	let text_description = document.querySelector(".text_description");
	
	
	//  Functions  //
	
	let create_parent_element = function(object){
		let div = document.createElement("div");
		
		if(object.is_video){
			div.appendChild(object.placeholder_img);
			object.img.currentTime = 0;
		} else {
			div.appendChild(object.img);
		}
		
		div.style.backgroundColor = get_background_color(object);
		div.style.clipPath = "url(#transition_clippath)";
		transition_path_node.setAttribute("d", "");
		
		return div;
	};
	
	let get_background_color = function(object){
		let hex;
		
		//Either uses the specific color we set for the image or the image's
		//average color.
		if(typeof forced_background_color === "object"
		&& hasOwnProperty(forced_background_color, object.id)){
			hex = ("#" + forced_background_color[object.id]);
		} else {
			hex = Submission.get_average_color(object.index);
		}
		
		let [r, g, b] = [0, 0, 0];
		let rgb = hex_to_rgb(hex);
		
		if(rgb !== null){
			[r, g, b] = rgb;
		}
		
		
		let factor = 1;
		
		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);
		
		return (`rgb(${r}, ${g}, ${b})`);
	};
	
	let switch_elements = function(){
		if(transition_parent_current !== null
		&& transition_parent_current.parentElement === image_container){
			image_container.removeChild(transition_parent_current);
		}
		
		if(transition_parent_next !== null){
			transition_parent_next.style.clipPath = null;
		}
		
		
		transition_parent_current = transition_parent_next;
		transition_parent_next = null;
	};
	
	
	//  Methods  //
	
	//Creates a transition and returns a promise which resolves when the
	//transition finishes or gets canceled. The promise will not reject under
	//normal circumstances.
	let run_transition = async function(current, next){
		if(is_running === true){
			cancel_transition();
		}
		is_running = true;
		transition_id += 1;
		let current_transition_id = transition_id;
		
		console_log("Starting transition.");
		
		
		transition_object_current = current;
		transition_object_next = next;
		
		new_text_user = Submission.get_user(next.index);
		new_text_description = Submission.get_description(next.index);
		
		
		//  Prepare Images  //
		
		transition_parent_next = create_parent_element(next);
		image_container.appendChild(transition_parent_next);
		
		
		//  Run Transition  //
		
		await animation.schedule_painting();
		
		if(current_transition_id !== transition_id){
			return;
		}
		
		
		//  Clean Up Transition  //
		
		switch_elements();
		is_running = false;
		
		console_log("Finished transition.");
	};
	
	
	let cancel_transition = function(){
		transition_id += 1;
		
		animation.stop();
		animation.start();
		
		switch_elements();
		is_running = false;
	};
	
	
	//  Return  //
	
	transition = ({
		run: run_transition,
		cancel: cancel_transition
	});
	
	
	hide_image_text = function(){
		text_container.style.opacity = 0;
	};
	
	show_image_text = function(){
		//  Fill User And Description  //
		
		text_user.innerText = new_text_user;
		
		
		text_description.innerHTML = "";
		
		let description_object = get_formatting_object(new_text_description);
		let description_source_node = description_object.node;
		
		if(description_source_node !== text_description){
			while(description_source_node.hasChildNodes()){
				text_description.appendChild(description_source_node.childNodes[0]);
			}
		}
		
		
		//  Adjust Description Font Size  //
		
		text_description.style.fontSize = "1.1rem";
		
		let bounding_data;
		
		let container_data = text_container.getBoundingClientRect();
		
		for(let i = 0;i < 7;i += 1){
			bounding_data = text_description.getBoundingClientRect();
			
			if(bounding_data.bottom > container_data.bottom){
				text_description.style.fontSize = (((11 - i) / 10) + "rem");
			} else {
				break;
			}
		}
		
		text_container.style.opacity = 1;
	};
	
})();

//
//    Menu
//
//Handles opening and closing the menu as well as the save form.
//

let menu = null;

(function(){
	//  Variables  //
	
	let is_build = false;
	let is_open = false;
	
	let menu_container = document.querySelector("#menu_container");
	let settings_container = document.querySelector(".settings_container");
	let thumbnail_container = document.querySelector(".thumbnail_container");
	
	let form_node = null;
	let time_per_image_input = null;
	let settings_submit = null;
	
	
	//  Functions  //
	
	let build_settings = function(){
		form_node = document.createElement("form");
		form_node.onsubmit = onsubmit;
		
		time_per_image_input = document.createElement("input");
		time_per_image_input.type = "number";
		time_per_image_input.value = settings.get("time_per_image");
		time_per_image_input.min = time_per_image_min;
		time_per_image_input.max = time_per_image_max;
		
		settings_submit = document.createElement("input");
		settings_submit.type = "submit";
		settings_submit.value = "Save & Close";
		
		
		settings_container.appendChild(form_node);
		form_node.appendChild(document.createTextNode("Seconds per image: "));
		form_node.appendChild(time_per_image_input);
		form_node.appendChild(document.createElement("br"));
		form_node.appendChild(settings_submit);
	};
	
	//Returns a boolean indicating if saving settings was successful. It may
	//stop execution with an alert box before returning.
	let save_settings = function(){
		let time_per_image = time_per_image_input.value;
		let current_time_per_image = settings.get("time_per_image");
		
		//If the field is empty ignore changes and reset to the current setting.
		if(time_per_image.length === 0){
			time_per_image_input.value = current_time_per_image;
			return true;
		}
		
		
		time_per_image = Number(time_per_image);
		
		//No changes were made.
		if(time_per_image === current_time_per_image){
			return true;
		}
		
		//The new value is invalid.
		if(Number.isNaN(time_per_image)
		|| time_per_image < time_per_image_min
		|| time_per_image > time_per_image_max){
			alert(`The setting \"Timer per image\" has to be a number between ${time_per_image_min} and ${time_per_image_max} or be left empty.`);
			return false;
		}
		
		//The new value is valid.
		settings.set("time_per_image", time_per_image);
		settings.save();
		
		return true;
	};
	
	let onsubmit = function(event){
		event.preventDefault();
		
		menu.close();
	};
	
	
	//  Methods  //
	
	let open = function(){
		if(settings.has_loaded !== true){
			return;
		}
		if(is_open === true){
			return;
		}
		is_open = true;
		
		menu_container.style.display = "block";
		automatic_timer.cancel();
		animation.pause();
		
		if(is_build !== true){
			is_build = true;
			
			build_settings();
			build_thumbnail_gallery(thumbnail_container);
		}
		
		focus_last_viewed_thumbnail();
	};
	
	//The returned boolean indicates if the menu is closed. If there was an
	//error with the settings and therefore the menu can't be closed it returns
	//false, otherwise true.
	let close = function(){
		if(settings.has_loaded !== true){
			return true;
		}
		if(is_open === false){
			return true;
		}
		if(save_settings() !== true){
			return false;
		}
		
		is_open = false;
		
		menu_container.style.display = null;
		
		if(!image_viewer.is_transitioning){
			automatic_timer.reset();
		}
		
		animation.unpause();
		
		return true;
	};
	
	
	//  Return  //
	
	menu = ({
		open: open,
		close: close,
		
		get is_open(){
			return is_open;
		}
	});
	
	
	document.querySelector("#menu_button_area").onclick = menu.open;
})();

//
//    Thumbnail Gallery
//
//Handles everything related to the submission thumbnail gallery which gives an
//overview of all available images and the position of the last viewed image.
//

let build_thumbnail_gallery = null;
let focus_last_viewed_thumbnail = null;

(function(){
	//  Variables  //
	
	let thumbnail_parent = null;
	let is_build = false;
	
	let observer = null;
	
	let submission_nodes = [];
	let thumbnail_queue = [];
	let loading_thumbnails = 0;
	let max_loading_thumbnails = 6;
	
	
	//  Queue  //
	
	//These are the possible data-status values:
	//    null
	//        Not queued for loading yet.
	//    "queued"
	//        The image is queued to be loaded.
	//    "loading"
	//        The image is currently loading.
	//    "loaded"
	//        The image has successfully loaded.
	//    "error"
	//        Some error occured while loading the image.
	
	
	let queue_thumbnail = function(node){
		node.setAttribute("data-status", "queued");
		thumbnail_queue.push(node);
		
		load_next_thumbnail();
	};
	
	let unqueue_thumbnail = function(node){
		node.removeAttribute("data-status");
		
		let index = thumbnail_queue.indexOf(node);
		
		if(index >= 0){
			thumbnail_queue.splice(index, 1);
		}
	};
	
	let load_next_thumbnail = function(){
		while(loading_thumbnails < max_loading_thumbnails){
			if(thumbnail_queue.length === 0){
				break;
			}
			
			let next_thumbnail = thumbnail_queue.shift();
			load_thumbnail(next_thumbnail);
			
			loading_thumbnails += 1;
		}
	};
	
	let load_thumbnail = function(node){
		node.setAttribute("data-status", "loading");
		observer.unobserve(node);
		
		let img = document.createElement("img");
		node.appendChild(img);
		
		img.src = node.getAttribute("data-src");
		img.addEventListener("load", thumbnail_on_load);
		img.addEventListener("error", thumbnail_on_error);
	};
	
	
	let thumbnail_on_load = function(event){
		loading_thumbnails -= 1;
		
		let node = this.parentElement;
		node.setAttribute("data-status", "loaded");
		node.style.backgroundColor = null;
		
		load_next_thumbnail();
	};
	
	let thumbnail_on_error = function(event){
		loading_thumbnails -= 1;
		
		let node = this.parentElement;
		node.setAttribute("data-status", "error");
		
		load_next_thumbnail();
	};
	
	
	let thumbnail_on_click = function(event){
		if(menu.close()){
			let index = Number(this.getAttribute("data-index"));
			image_viewer.set_image(index);
		}
	};
	
	
	//  Intersection Handler  //
	
	let on_intersection_event = function(entries, observer){
		for(let entry of entries){
			let target = entry.target;
			
			if(entry.isIntersecting){
				if(target.getAttribute("data-status") === null){
					queue_thumbnail(target);
				}
			} else {
				if(target.getAttribute("data-status") === "queued"){
					unqueue_thumbnail(target);
				}
			}
		}
	};
	
	
	//  Scrolling To Last Viewed  //
	
	//This scrolls the thumbnail container such that the last viewed image is
	//in the center of the screen. In case that the last viewed image is taller
	//than its container it scrolls to the top of the image
	focus_last_viewed_thumbnail = function(){
		let marked_node = thumbnail_parent.querySelector(".last_viewed");
		
		if(marked_node !== null){
			marked_node.classList.remove("last_viewed");
		}
		
		
		let current_index = image_viewer.current_index;
		let last_viewed_node = thumbnail_parent.querySelector(
			`[data-index="${current_index}"]`
		);
		
		if(last_viewed_node === null){
			return;
		}
		
		last_viewed_node.classList.add("last_viewed");
		
		
		let parent_data = thumbnail_parent.getBoundingClientRect();
		let child_data = last_viewed_node.getBoundingClientRect();
		
		let offset = (child_data.top - parent_data.top);
		let centering_offset = 0;
		
		if(child_data.height < parent_data.height){
			centering_offset = (
				-((parent_data.height - child_data.height) / 2)
			);
		}
		
		thumbnail_parent.scrollTop += (offset + centering_offset);
	};
	
	
	//  Return  //
	
	build_thumbnail_gallery = function(node){
		if(node === null){
			return;
		}
		if(is_build === true){
			return;
		}
		is_build = true;
		
		
		thumbnail_parent = node;
		
		observer = new IntersectionObserver(
			on_intersection_event,
			{
				root: null,
				rootMargin: "128px",
				threshold: 0.0
			}
		);
		
		for(let i = 0;i < submissions.length;i += 1){
			let submission_id = Submission.get_id(i);
			
			let src = `./images/thumbnails/${submission_id}_thumbnail.jpg`;
			let div = document.createElement("div");
			div.setAttribute("data-src", src);
			div.setAttribute("data-index", i);
			div.style.backgroundColor = Submission.get_average_color(i);
			div.onclick = thumbnail_on_click;
			
			thumbnail_parent.appendChild(div);
			observer.observe(div);
			submission_nodes.push(div);
		}
	};
})();

//
//    Main
//
//
//

let set_loading_error = function(){
	let error_text = document.querySelector("#error_text");
	
	if(error_text !== null){
		error_text.style.display = "flex";
	}
};

let close_loading_screen = function(){
	let theater_curtain = document.querySelector("#theater_curtain");
	
	if(theater_curtain !== null){
		theater_curtain.classList.add("closed");
	}
};


let is_loading = true;

let main = async function(){
	try {
		//Show an error specifically for submissions if either the submissions
		//didn't load or there are too few to be valid.
		if(typeof submissions !== "object"
		|| !Array.isArray(submissions)
		|| submissions.length < 5){
			let error_text_node = document.querySelector("#error_text");
			
			if(error_text_node !== null){
				error_text_node.innerText = "There was an error loading the submissions. If reloading doesn't help then I messed up :(";
			}
			
			set_loading_error();
			return;
		}
		
		await settings.load();
		await image_viewer.load();
		await animation.load();
		
		animation.start();
		
		close_loading_screen();
		
		
		await sleep(1000);
		is_loading = false;
		image_viewer.next_image();
		
	} catch(error){
		console.error(error);
		set_loading_error();
	}
};

requestAnimationFrame(main);
