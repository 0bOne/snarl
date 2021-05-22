const ARPMessage = require('./ARPMessage.js');

module.exports= class Frame
{
	dest;
	src;
	type;
	payload;
	
	constructor(buffer)
	{
		this.dest = buffer.AsMACAddress(0);
		this.src = buffer.AsMACAddress(6);
		
		this.type = {};
		this.type.id = buffer.AsHexString(12, 2);
		this.type.name = buffer.AsFrameTypeName(12);
		switch(this.type.name)
		{
			case "ARP":
				this.payload = new ARPMessage(buffer);
				break;
		}
	}
	
	ConvertToReply(myMac, buffer)
	{
		console.log("changing dest from " + this.dest + " to " + this.src);
		this.dest = this.src;
		console.log("changing src from " + this.src + " to " + myMac);
		this.src = myMac;
console.log("setting buffer to dest: " + this.dest);
		buffer.SetMac(0, this.dest);
console.log("setting buffer to src: " + this.src);
		buffer.SetMac(6, this.src);	
	}

}