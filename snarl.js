const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const PacketBuffer = require('./PacketBuffer.js');
const Frame = require('./Frame.js');
const Host = require('./Host.js');
const config = require('./config.json');

const host = new Host();

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (buffer, rinfo) => {
  console.log(`received frame:`);
  console.log(buffer);
  const packetBuffer = new PacketBuffer(buffer);
  const frame = new Frame(packetBuffer);
  console.log(frame);
  host.OnFrameReceived(frame, packetBuffer);
  
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(config.udpsockets.in);
