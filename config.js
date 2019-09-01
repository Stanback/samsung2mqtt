/*
 * Samsung2mqtt configuration
 */

module.exports = {
  tvs: [
    {
      id: 'A',
      ip: '192.168.12.237',
      keys: {
        BACK: 'KEY_EXIT',
        LEFT: 'KEY_LEFT',
        RIGHT: 'KEY_RIGHT',
        DOWN: 'KEY_DOWN',
        UP: 'KEY_UP',
        SELECT: 'KEY_ENTER',
        PLAY_PAUSE: 'KEY_PLAY',
        INFO: 'KEY_MENU',
      },
    },
    {
      id: 'B',
      ip: '192.168.12.237',
      keys: {
        BACK: 'KEY_EXIT',
        LEFT: 'KEY_ESAVING',
        RIGHT: 'KEY_SOURCE',
        DOWN: 'KEY_VOLDOWN',
        UP: 'KEY_VOLUP',
        SELECT: 'KEY_ENTER',
        PLAY_PAUSE: 'KEY_PAUSE',
        INFO: 'KEY_TOOLS',
      },
    },
  ],

  mqtt: {
    host: 'mqtt://192.168.12.1:1883',
    topic: 'samsung2mqtt',
  },
};

