const config = require('./config.json');
const dgram = require('dgram');


module.exports = class Host
{
	outSocket;
	config;
	client;
	
	constructor(outSocket)
	{
		this.outSocket = outSocket;
		this.config = config;
		this.client = dgram.createSocket('udp4');

	}
	
	OnFrameReceived(frame, buffer)
	{
		//TODO: organize protocols into a stack, including the bottom layer (DL?) that routes to ARP, IP, etc.
		console.log("host received a frame");
		let reply; 
		if (frame.type.name === "ARP")
		{
			console.log(buffer);
			reply = this.processARPMessage(frame.payload, buffer);
		}
		
		if (reply)
		{
			frame.ConvertToReply(config.me.MAC, buffer);
			console.log("sending reply: " );
			console.log(frame);
			
			setTimeout(this.sendBuffer.bind(this), 250, buffer);

		}
	}
	
	sendBuffer(buffer)
	{
		console.log("sending buffer:");
		console.log(buffer);
		this.client.send(buffer.buffer, this.config.udpsockets.out, '0.0.0.0');
	}
	
	processARPMessage(message, buffer)
	{
		//console.log("host received a frame. Op=" + message.operation.name);		
		if (message.operation.name === "Request")
		{
			//look in the cache and send the response if one exists
			let targetMAC = config.arpCache[message.target.IP]
			if (targetMAC)
			{
				console.log("ARP request target " + message.target.IP + " in cache as " + targetMAC + ". Replying...");
				message.ConvertToReply(targetMAC, message.target.IP, buffer);
				return message;
			}
			else
			{
				console.log("ARP request target " + message.target.IP + " not in cache. Not responding");
			}
		}
	}
	
	
}