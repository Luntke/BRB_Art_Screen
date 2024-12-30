//Every element is an object with these properties:
//    user: [String]
//        The user name. Shouldn't be too long. Long words may be broken. The
//        font size is not adjusted.
//    id: [Number]
//        A natural number that is used to identify it. It shouldn't be reused
//        as that causes big caching issues. It can't be used multiple times.
//        Careful changing the ID of a submission or deleting a submission as it
//        is used to tell where we left off with showing submissions. When a
//        submission can't be found it resets to the first one. A file name for
//        a submission with ID 15 could be found as "15.png", "15.jpg" or
//        "15.gif".
//    description: [String]
//        The artist's description for the image. If the text is too long the
//        font size reduces up to some limitation. Keep in mind long text is
//        probably not shown long enough to be read. There is no special
//        formatting besides JSON itself and new lines "\n". There is no HTML
//        or emote support, however emoji will work based on browser and
//        platform used.
let submissions = [
	/*{
		user: "",
		id: 1,
		description: "jerma pog"
	}*/
];
/*
,
{
	user: "",
	id: ,
	description: ""
}
*/

let forced_background_color = {
	//"2": [54, 48, 83]
};


(function(){
	let name_changes = new Map();
	
	let add_name_change = function(discord_name, preferred_name){
		let discord_name_lower_case = discord_name.toLowerCase();
		
		if(name_changes.has(discord_name_lower_case)){
			console.log("There was an error with the name changes!", discord_name, preferred_name);
			alert("Requesting multiple name changes for the same discord name.");
			submissions = undefined;
			return;
		}
		
		name_changes.set(discord_name_lower_case, preferred_name);
	};
	
	
	//Their linked Twitch is "robolamp"
	add_name_change("Robo", "RoboLamp");
	//Their linked Steam account is "chinfrog".
	add_name_change("thisisyourlastdance", "chinfrog");
	
	
	
	let using_wrong_name = false;
	
	for(let submission of submissions){
		if(name_changes.has(submission.user.toLowerCase())){
			console.log(`Using wrong name in submission with ID ${submission.id}. Change the name from \"${submission.user}\" to \"${name_changes.get(submission.user.toLowerCase())}\".`);
			using_wrong_name = true;
		}
	}
	
	if(using_wrong_name){
		console.log("The submissions includes wrong names. You have to change it to the correct ones.");
		alert("The submissions includes wrong names. You have to change it to the correct ones.");
		submissions = undefined;
	}
})();

