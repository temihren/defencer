import Ably from 'ably';
import axios from 'axios';

import conf from '../config';

const init = () => {
	const canvasElement = document.createElement('canvas');
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight + 1;

	document.body.append(canvasElement);
	
	return canvasElement;
};

export const canvas = init();
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

let channel: Ably.RealtimeChannel | undefined;

async function publishSubscribe() {

	// Connect to Ably with your API key
	const ably = new Ably.Realtime("QkkECg.htzwfA:-JKnynbGVgeOl69GksRHI568lB1RQzX0CQ9_TExQbm0")
	ably.connection.once("connected", () => {
		console.log("welcome");
	})

	// Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
	channel = ably.channels.get("get-started")

	// Close the connection to Ably after a 5 second delay
//   setTimeout(async () => {
//     ably.connection.close();
//       await ably.connection.once("closed", function () {
//         console.log("Closed the connection to Ably.")
//       });
//   }, 5000);
}

await publishSubscribe();

await channel.subscribe("player_connected", (message) => {
	console.log("Message received: " + message.data)
});

const notifyOthers = async (message: string) => {
	await channel.publish("player_connected", message);
}

const myPlayer = localStorage.getItem('me');

axios.get(`${conf.url}/getPlayers/`).then((res) => {
	console.log(res.data);

	let params: {params: {player: string}} | undefined = undefined;

	if (myPlayer) params = {params: {player: myPlayer}};
	axios.get(`${conf.url}/login`, params).then((resp) => {
		console.log(resp.data);
		
		localStorage.setItem('me', resp.data);

		notifyOthers(resp.data);
	});
	
});
