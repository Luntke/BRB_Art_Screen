
/*


//These are the values of the indices:
//    0: width
//    1: height
//    2: map_x
//    3: map_y
//    4: offset_y


for(let type in animation_map_data){
	let array = animation_map_data[type];
	
	for(let i = 0;i < array.length;i += 1){
		if(array[i] === null){
			continue;
		}
		
		let data = array[i];
		
		array[i] = [
			data.width,
			data.height,
			data.map_x,
			data.map_y,
			data.offset_y
		];
	}
}
*/

let animation_map_data = {
	idle: [
		{
			id: 0,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 0,
			map_y: 0
		},
		null,
		{
			id: 1,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 200,
			map_y: 0
		},
		null,
		{
			id: 2,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 400,
			map_y: 0
		},
		null,
		{
			id: 3,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 600,
			map_y: 0
		},
		null,
		{
			id: 4,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 800,
			map_y: 0
		},
		null,
		{
			id: 5,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 1000,
			map_y: 0
		},
		null,
		{
			id: 6,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 1200,
			map_y: 0
		},
		null,
		{
			id: 7,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 1400,
			map_y: 0
		},
		null,
		{
			id: 8,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 1600,
			map_y: 0
		},
		null,
		{
			id: 9,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 1800,
			map_y: 0
		},
		null
	],
	
	
	idle_blink: [
		{
			id: 0,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 0,
			map_y: 0
		},
		null,
		{
			id: 1,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 200,
			map_y: 0
		},
		null,
		{
			id: 2,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 400,
			map_y: 0
		},
		null,
		{
			id: 3,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 600,
			map_y: 0
		},
		null,
		{
			id: 4,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 800,
			map_y: 0
		},
		null,
		{
			id: 5,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 2000,
			map_y: 0
		},
		null,
		{
			id: 6,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 2200,
			map_y: 0
		},
		null,
		{
			id: 7,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 2400,
			map_y: 0
		},
		null,
		{
			id: 8,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 2600,
			map_y: 0
		},
		null,
		{
			id: 9,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 1800,
			map_y: 0
		},
		null
	],
	
	
	painting: [
		{
			id: 0,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 2800,
			map_y: 0
		},
		null,
		{
			id: 2,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 3000,
			map_y: 0
		},
		null,
		{
			id: 4,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 3200,
			map_y: 0
		},
		null,
		{
			id: 6,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 3400,
			map_y: 0
		},
		null,
		{
			id: 8,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 3600,
			map_y: 0
		},
		{
			id: 9,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 3800,
			map_y: 0
		},
		null,
		{
			id: 11,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 4000,
			map_y: 0
		},
		null,
		{
			id: 13,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 4200,
			map_y: 0
		},
		null,
		{
			id: 15,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 4400,
			map_y: 0
		},
		null,
		{
			id: 17,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 4600,
			map_y: 0
		},
		null,
		{
			id: 19,
			width: 800,
			height: 720,
			offset_y: 0,
			map_x: 5600,
			map_y: 1310
		},
		{
			id: 20,
			width: 1280,
			height: 720,
			offset_y: 0,
			map_x: 0,
			map_y: 750
		},
		null,
		{
			id: 22,
			width: 1280,
			height: 720,
			offset_y: 0,
			map_x: 1280,
			map_y: 750
		},
		{
			id: 23,
			width: 1280,
			height: 500,
			offset_y: 0,
			map_x: 2560,
			map_y: 750
		},
		{
			id: 24,
			width: 1280,
			height: 450,
			offset_y: 0,
			map_x: 3960,
			map_y: 300
		},
		{
			id: 25,
			width: 1280,
			height: 450,
			offset_y: 0,
			map_x: 3960,
			map_y: 750
		},
		null,
		{
			id: 27,
			width: 1280,
			height: 450,
			offset_y: 0,
			map_x: 2872,
			map_y: 1463
		},
		null,
		{
			id: 29,
			width: 1024,
			height: 600,
			offset_y: 0,
			map_x: 0,
			map_y: 1470
		},
		{
			id: 30,
			width: 1024,
			height: 600,
			offset_y: 0,
			map_x: 1024,
			map_y: 1470
		},
		{
			id: 31,
			width: 770,
			height: 600,
			offset_y: 0,
			map_x: 2089,
			map_y: 1470
		},
		{
			id: 32,
			width: 1024,
			height: 600,
			offset_y: 0,
			map_x: 5300,
			map_y: 300
		},
		{
			id: 33,
			width: 1024,
			height: 600,
			offset_y: 0,
			map_x: 4400,
			map_y: 1400
		},
		{
			id: 34,
			width: 1024,
			height: 500,
			offset_y: 0,
			map_x: 5376,
			map_y: 864
		},
		null,
		{
			id: 36,
			width: 600,
			height: 450,
			offset_y: 0,
			map_x: 0,
			map_y: 300
		},
		{
			id: 37,
			width: 600,
			height: 450,
			offset_y: 0,
			map_x: 600,
			map_y: 300
		},
		{
			id: 38,
			width: 600,
			height: 450,
			offset_y: 0,
			map_x: 1200,
			map_y: 300
		},
		{
			id: 39,
			width: 600,
			height: 450,
			offset_y: 0,
			map_x: 1800,
			map_y: 300
		},
		{
			id: 40,
			width: 600,
			height: 450,
			offset_y: 0,
			map_x: 2400,
			map_y: 300
		},
		{
			id: 41,
			width: 320,
			height: 450,
			offset_y: 0,
			map_x: 3000,
			map_y: 300
		},
		{
			id: 42,
			width: 320,
			height: 450,
			offset_y: 0,
			map_x: 3320,
			map_y: 300
		},
		{
			id: 43,
			width: 320,
			height: 450,
			offset_y: 0,
			map_x: 3640,
			map_y: 300
		},
		{
			id: 44,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 4800,
			map_y: 0
		},
		null,
		{
			id: 46,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 5000,
			map_y: 0
		},
		null,
		{
			id: 48,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 5200,
			map_y: 0
		},
		null,
		{
			id: 50,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 5400,
			map_y: 0
		},
		null,
		{
			id: 52,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 5600,
			map_y: 0
		},
		null,
		{
			id: 54,
			width: 200,
			height: 300,
			offset_y: 100,
			map_x: 2800,
			map_y: 0
		}
	]
};






































