const mqtt = require('mqtt');
const samsung = require('./samsung');
const config = require('./config');

const makeTopic = (...parts) => [config.mqtt.topic, ...parts].join('/');

const connect = () => {
  console.log('Connected to MQTT server');
  client.publish(makeTopic('connected'), 'true');
  client.subscribe(makeTopic('+', 'auth'));
  client.subscribe(makeTopic('+', 'push'));
  /*
  // Request device authorization on startup
  config.tvs.forEach(tv => {
    client.publish(makeTopic(tv.id, 'auth'));
  });
  */
};

const handleMessage = (topic, message) => {
  const [base, deviceId, command] = topic.split('/');
  if (base !== config.mqtt.topic) return;

  const tv = config.tvs.find(tv => tv.id === deviceId);
  if (!tv) {
    console.log('Error: Specified device not found in config: ' + deviceId);
    return;
  }

  switch (command) {
    case 'auth':
      samsung.auth(config.remote, tv);
      break;
    case 'push':
      const key = message.toString();
      const keys = tv.keys[key];
      if (!keys) {
        console.log('Error: Invalid key specified: ' + key);
        return;
      }
      const throttledPress = (idx, n) => {
        const [k, delay = 200, repeats = 0] = keys[idx];
        samsung.push(k, tv);
        if (repeats > n) {
          setTimeout(throttledPress, delay, idx, n+1);
        } else if (idx < keys.length - 1) {
          setTimeout(throttledPress, delay, idx+1, 0);
        }
      };
      throttledPress(0, 0);
      break;
    default:
      console.log('Error: Unknown command specified: ' + command);
  }
};

const cleanup = () => {
  console.log('Shutting down...');
  client.publish(makeTopic('connected'), 'false')
  client.end(null, null, () => {
    process.exit(0);
  });
};

console.log('Connecting to MQTT server at ' + config.mqtt.host);
const client = mqtt.connect(config.mqtt.host);
client.on('connect', connect);
client.on('message', handleMessage);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

