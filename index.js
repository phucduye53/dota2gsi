var d2gsi = require('dota2-gsi');
var server = new d2gsi();

const options ={
    port: `${process.env.SERVERIP}`
}
const tmi = require('tmi.js');
require('dotenv').config();
// Define configuration options
const opts = {
	identity: {
		username: `${process.env.TWITCH_USERNAME}`,
		password: `${process.env.TWITCH_OAUTH}`
	},
	channels: [
		`${process.env.TWITCH_CHANNEL}`
	]
};

var roshTimeDed = 0

// Create a client with our options
const client = new tmi.client(opts);

client.connect().catch(console.error);

// We shall pass the parameters which shall be required
client.on('message', (channel, tags, message, self) => {
	// Lack of this statement or it's inverse (!self) will make it in active
	if (self) return;

	// Create up a switch statement with some possible commands and their outputs
	// The input shall be converted to lowercase form first
	// The outputs shall be in the chats

	switch (message.toLowerCase()) {
		case '!rosh':
			if (roshTimeDed === 0)
				client.say(channel, `@${tags.username}, rosh is not ded yet lil bro!`);
			else{
				client.say(channel, `@${tags.username}, quick FatCD rosh spawn at @${fancyTimeFormat(roshTimeDed + 480)} - @${fancyTimeFormat(roshTimeDed + 660)} !`);
			}
			break;


		default:

			break;
	}
});



server.events.on('newclient', function (dotaClient) {
	console.log("New client connection, IP address: " + dotaClient.ip);
	if (dotaClient.auth && dotaClient.auth.token) {
		console.log("Auth token: " + dotaClient.auth.token);
	} else {
		console.log("No Auth token");
	}

	dotaClient.on('map:clock_time', function (clock_time) {
		if (clock_time) console.log(dotaClient.gamestate);
	});
	dotaClient.on('map:roshan_state', function (roshan_state) {
		console.log(dotaClient.gamestate.map.roshan_state);
		if (roshan_state==='respawn_base') {
			roshTimeDed = dotaClient.gamestate.map.clock_time
		}else if (roshan_state === 'alive'){
			roshTimeDed = 0 
		}
	})

});

function fancyTimeFormat(duration) {
	// Hours, minutes and seconds
	const hrs = ~~(duration / 3600);
	const mins = ~~((duration % 3600) / 60);
	const secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	let ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;

	return ret;
}