# Samsung2Mqtt

Provides a simple gateway between MQTT and Samsung's network protocol for
controlling TV's built cira 2012-2016.

The socket code was ported to Javascript from the Python implementation in
this original Gist: https://gist.github.com/danielfaust/998441

Note: Samsung TV's built 2016 and after use a WebSocket service running on
port 8001, which is different from the older TV's, which expose a service on
port 55000. (If someone wants to implement support for the newer generation
of TV's, I would glady accept a pull request.)

## Configuring

The pertinent configuration is in `config.js` with comments describing the
different options. Key names seem to overlap with those from the
[LIRC](https://gist.github.com/unforgiven512/0c232f4112b63021a8e0df6eedfb2ff3) project.

## MQTT Topics

I recommend [Mosquitto](https://mosquitto.org/) MQTT server but anything should work.

Get the status of our service: `samsung2mqtt/connected`

Send authorization request to TV (should only need to be done once): `samsung2mqtt/[DEVICE_ID]/auth`

Send a key press by publishing the key ID to: `samsung2mqtt/[DEVICE_ID]/push`

## Why?

I'm combining this with [Homebridge](https://github.com/nfarina/homebridge) and
[homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing) to control
my TV using the iPhone.

Example Homebridge device configuration:

```
    "accessories": [
        {
            "accessory": "mqttthing",
            "type": "television",
            "name": "Samsung",
            "url": "mqtt://192.168.12.1",
            "caption": "Samsung TV",
            "topics": {
                "setActive":      "samsung2mqtt/connected",
                "getActive":      "samsung2mqtt/connected",
                "setRemoteKey":   "samsung2mqtt/DEFAULT/push"
            }
        }
    ],
```

Other MQTT-supporting IoT projects, such as
[Mozilla WebThings Gateway](https://github.com/mozilla-iot/gateway) can be used
for home automation tasks. For example, presence detection to turn the TV on
and off when you enter and leave a room.

