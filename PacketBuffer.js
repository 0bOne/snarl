module.exports = class PacketBuffer
{
	buffer;
	
	constructor(buffer)
	{
		this.buffer = buffer;
	}
	
	AsHexByte(offset)
	{
		return this.buffer[offset].toString(16).padStart(2, "0");
	}
	
	AsHexByteArray(offset, count)
	{
		let values = [];
		for (let i = 0; i < count; i++)
		{
			values.push(this.AsHexByte(offset + i));
		}
		return values;
	}
	
	AsDecimalArray(offset, count)
	{
		let values = [];
		for (let i = 0; i < count; i++)
		{
			values.push(this.buffer[offset + i]);
		}
		return values;		
	}
	
	AsDelimitedHex(offset, count, delimiter)
	{
		let values = this.AsHexByteArray(offset, count);	
		return values.join(delimiter);
	}
	
		AsDelimitedDecimal(offset, count, delimiter)
	{
		let values = this.AsDecimalArray(offset, count);	
		return values.join(delimiter);
	}
	
	AsHexString(offset, count)
	{
		return this.AsDelimitedHex(offset, count, "");					
	}
	
	AsMACAddress(offset)
	{
		return this.AsDelimitedHex(offset, 6, "-");
	}
	
	AsIP4Address(offset)
	{
		return this.AsDelimitedDecimal(offset, 4, ".");		
	}
	
	AsFrameTypeName(offset)
	{
		let retVal;
		
		const id = this.AsDelimitedHex(offset, 2, "");
		
		switch (id)
		{
			case "0806":
				retVal = "ARP";
				break;
			case "0800":
				retVal = "IPV4";
				break;
			case "86DD":
				retVal = "IPV6";
				break;
			default:
				retVal = "Unrecognized frame type";
				break;
		}	
		return retVal;
	}

	SetNumber(offset, byteCount, value)
	{
		//update the buffer's bytes at position 'offset' with little endian number, written to a maximum of 'byteCount' bytes)
		//this must be done in network byte order
		for (let pos = offset + (byteCount - 1); pos >= offset; pos--)
		{
			let newValue = Math.floor(value / 0x100);
			let byteValue = value - (newValue * 0x100);
			this.buffer[pos] = byteValue;
			//console.log("setting number " + pos + " to value " + byteValue);
			value = newValue;
		}	
		
	}
	
	SetMac(offset, delimitedMac)
	{
		//update the buffer with a colon-delimited hex-byte mac address string 
		let parts = delimitedMac.split("-");
		for (let i = 0; i < parts.length; i++)
		{
			let byteValue = parseInt(parts[i], 16);
			this.buffer[offset + i] = byteValue
		}
	}
	
	SetIP(offset, delimitedIP)
	{
		//update the buffer with a period-delimited decimal-byte IPv4 address string 
		let parts = delimitedIP.split(".");
		for (let i = 0; i < parts.length; i++)
		{
			let byteValue = parseInt(parts[i], 10);
			this.buffer[offset + i] = byteValue
		}
	}
}