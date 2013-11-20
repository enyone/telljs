telljs
======

TellStick Web GUI and REST API with NodeJS

TellStick: http://www.telldus.se/products/tellstick

Installation
------
Run commands:

```
git clone https://github.com/enyone/telljs.git
cd telljs
npm install
```

Starting server
------
Run commands:
```
node tell
```


Starting as daemon
------
Run commands:
```
npm install -g forever
forever start tell.js
```

Using GUI
------
Navigate to: http://your-ip:8080/


Using API
------
Get all devicecs: http://your-ip:8080/devices

Get all sensors: http://your-ip:8080/sensors

Set device ON: http://your-ip:8080/device/on/1 (where 1 is device id)

Set device OFF: http://your-ip:8080/device/off/1 (where 1 is device id)

