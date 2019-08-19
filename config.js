/*
 * Samsung2mqtt configuration
 */

module.exports = {
  // List of TV's to be controlled
  tvs: [
    {
      id: 'DEFAULT',        // DEVICE_ID used in MQTT topic
      ip: '192.168.12.237', // IP address of TV
      model: 'UN60F8000',   // Model name of TV
      keys: {
        // This object contins your custom key mappings, each key's value is a 2D array to allow
        // for multiple keypresses i.e. macros. The inner array can contian up to 3 elements:
        // A string for key name, an optional integer for delay (in milliseconds), and optional
        // integer to set multiple repeats.
        // e.g. NAME: [['KEY_NAME', 1000, 2], ['KEY_NAME2', 500, 2], ['KEY_NAME3']]
        BACK: [['KEY_BACK']],
        LEFT: [['KEY_LEFT']],
        RIGHT: [['KEY_RIGHT']],
        DOWN: [['KEY_DOWN']],
        UP: [['KEY_UP']],
        SELECT: [['KEY_ENTER']],
        PLAY_PAUSE: [['KEY_PLAY']],
        INFO: [['KEY_INFO']],
      },
    },
  ],

  // Information about the virtual "remote"
  remote: {
    ip: '192.168.12.1',          // IP address of the device connecting to the TV
    mac: '36-58-d1-4e-65-48',    // MAC of the device connecting to TV (used for access control confirmation)
    name: 'Samsung2mqtt Remote', // Shown for access control confirmation and in General -> Wireless Remote Control
    app: 'samsung2mqtt',         // Name of app
  },

  // MQTT settings
  mqtt: {
    host: 'mqtt://192.168.12.1:1883',
    topic: 'samsung2mqtt',
  },
};

