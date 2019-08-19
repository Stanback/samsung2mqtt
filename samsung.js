const net = require('net');

const chr = (i) => String.fromCharCode(i);
const b64 = (s) => Buffer.from(s).toString('base64');

const send = (pkt, tv) => {
  const socket = new net.Socket();
  socket.connect(55000, tv.ip, () => { socket.end(pkt); });
  socket.on('error', function(err) {
    console.error('Error connecting to TV ' + tv.id + ' at ' + tv.ip, err);
  });
};

const auth = (remote, tv) => {
  console.log('Authorizing remote with TV ' + tv.id + ' at ' + tv.ip);
  const msg = chr(0x64) + chr(0x00)
    + chr(b64(remote.ip).length) + chr(0x00) + b64(remote.ip)
    + chr(b64(remote.mac).length) + chr(0x00) + b64(remote.mac)
    + chr(b64(remote.name).length) + chr(0x00) + b64(remote.name);
  const pkt = chr(0x00)
    + chr(remote.app.length) + chr(0x00) + remote.app
    + chr(msg.length) + chr(0x00) + msg;
  send(pkt, tv);
};

const push = (key, tv) => {
  console.log('Sending press to TV ' + tv.id + ' for key ' + key);
  const msg = chr(0x00) + chr(0x00) + chr(0x00)
    + chr(b64(key).length) + chr(0x00) + b64(key);
  const pkt = chr(0x00)
    + chr(tv.model.length) + chr(0x00) + tv.model
    + chr(msg.length) + chr(0x00) + msg;
  send(pkt, tv);
};

module.exports = {
  auth,
  push
};

