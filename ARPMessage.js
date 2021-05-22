const OP_NAMES = {"0001": "Request", "0002": "Reply"};

module.exports = class ARPMessage
{
	
//So this becomes ARP:
//14,15		00 01 [HTYPE]  (1= ethernet)
//16,17		08 00 [PTYPE]  (0800 = IPV4)
//18		06    [HW ADDR LEN]
//19		04 	  [PROTOCOL ADDR LEN]
//20,21		00 01 [OPERATION]
//22-27		52 54 00 12 34 56 [SENDER ADDR]
//28-31		c0 a8 01 63 	  [SENDER PROTOCOL ADDR] (IP addr)
//32-37		00 00 00 00 00 00 [TARGET ADDR]
//38-41		c0 a8 01 05 	  [TARGET PROCOLOL ADDR] (IP addr)
//			00 00 00 00 00 00 00 00 (unused)
	
	hType;
	pType;
	addrLengths;
	operation;
	sender;
	target;
	
	
	constructor(buffer)
	{
		//start at byte 14 (zero based)
		this.hType = buffer.AsHexString(14, 2);
		this.pType = {
			id : buffer.AsHexString(16, 2),
			name : buffer.AsFrameTypeName(16)
		};
		this.addrLengths = {
			MAC :  buffer.AsHexByte(18),
			IP : buffer.AsHexByte(19)		
		};
		
		this.operation = {
			id: buffer.AsHexString(20, 2),
			name: OP_NAMES[buffer.AsHexString(20, 2)] ?? "unrecognized"
		}
		;
		this.sender = {
			MAC: buffer.AsMACAddress(22),
			IP: buffer.AsIP4Address(28)		
		};
		
		this.target = {
			MAC: buffer.AsMACAddress(32),
			IP: buffer.AsIP4Address(38)		
		};
	}
	
	ConvertToReply(foundMac, requestedIP, buffer)
	{
		this.operation = 
		{
			id: 0x0002,
			name: OP_NAMES["0002"]
		}
		
		this.target = this.sender;
				
		this.sender = 
		{
			MAC: foundMac,
			IP: requestedIP
		};
		buffer.SetNumber(20, 2, this.operation.id);
		buffer.SetMac(22, this.sender.MAC);
		buffer.SetIP(28, this.sender.IP);
		buffer.SetMac(32, this.target.MAC);
		buffer.SetIP(38, this.target.IP);
	}
}