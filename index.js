const mqtt = require('mqtt');
const SamsungRemote = require('samsung-remote');
const config = require('./config');

let remotes;
let activeRemote;
let client;

const makeTopic = (...parts) => [config.mqtt.topic, ...parts].join('/');

const publishStatus = (dev, status) => {
  if (dev === activeRemote) {
    client.publish(makeTopic('tv', 'ACTIVE', 'status'), status);
  }
  client.publish(makeTopic('tv', dev, 'status'), status);
};

const connect = () => {
  console.log('Connected to MQTT server');

  client.publish(makeTopic('connected'), 'true');

  config.tvs.forEach(tv => {
    const dev = tv.id;
    remotes[dev] = new SamsungRemote({
      ip: tv.ip
    });

    if (dev === activeRemote) {
      client.publish(makeTopic('active'), dev);
    }

    remotes[dev].isAlive(err => {
      const isAlive = !err ? 'true' : 'false';
      publishStatus(dev, isAlive);
    });
  });

  client.subscribe(makeTopic('active', 'set'));
  client.subscribe(makeTopic('tv', '+', 'status', 'set'));
  client.subscribe(makeTopic('tv', '+', 'send'));
};

const handleMessage = (topic, message) => {
  const [base, subj, device, command, ...rest] = topic.split('/');
  const payload = message && message.toString();

  switch (subj) {
    case 'active':
      switch (device) {
        case 'set':
          activeRemote = payload;
          console.log('Setting active remote to ' + activeRemote);
          client.publish(makeTopic('device'), activeRemote);
          break;
        default:
      }
      break;
    case 'tv':
      const dev = device === 'ACTIVE' ? activeRemote : device;
      const tv = config.tvs.find(tv => tv.id === dev);

      if (!tv) {
        console.log('Error: Specified TV, ' + dev + ' not found in config');
        return;
      }

      switch (command) {
        case 'send':
          const key = tv.keys[payload];
          if (!key) {
            console.log('Error: Invalid key, ' + payload + ', for TV ' + dev);
            return;
          }
          console.log('Sending key ' + key + ' to TV ' + dev);
          remotes[dev].send(key, err => {
            if (err) {
              console.log('Warning: TV ' + dev + ' is offline');
            }
            publishStatus(dev, err ? 'false' : 'true');
          });
          break;
        case 'status':
          if (rest.length > 0 && rest[0] === 'set') {
            console.log('Setting status for TV ' + dev + ' to ' + payload);
            remotes[tv.id].send(payload === 'true' ? 'KEY_POWERON' : 'KEY_POWEROFF', err => {
              const isAlive = !err && payload === 'true' ? 'true' : 'false';
              publishStatus(dev, isAlive);
            });
          }
          break;
        default:
      }
      break;
    default:
  }
};

const tearDown = () => {
  console.log('Shutting down...');
  client.publish(makeTopic('connected'), 'false')
  client.end(null, null, () => {
    process.exit(0);
  });
};

const startup = () => {
  if (!config.tvs || config.tvs.length === 0) {
    console.log('Error: Please define at least one TV');
  }

  remotes = {};
  activeRemote = config.tvs[0].id;

  console.log('Connecting to MQTT server at ' + config.mqtt.host);

  client = mqtt.connect(config.mqtt.host);
  client.on('connect', connect);
  client.on('message', handleMessage);

  process.on('SIGINT', tearDown);
  process.on('SIGTERM', tearDown);
}

startup();

