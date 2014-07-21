# sense.js

an HTML5 interaction library for mobile browsers

Overview
--------

HTML5 offers a lot of awesome access to hardware data. Sense.js is a library that
abstracts away the math and gives developers and designers easy access to some
common non-touch gesture interactions with simple javascript callbacks.

### Disclaimer
This was made as a part of GreylockU's Hackfest, and will likely see changes to make
things better/add more gestures :)

Pull requests and feature suggestions are welcome!

Demo
------
You can find a demo at http://sense-js.jit.su/

#### Orientation
A ball rolls around based on your screen position!

#### Flick
Flick your phone to the right or left to slide a color.

#### Flip
Flip your phone face down and face up, and a new color appears!

#### Color Fling
Open this page on multiple devices. Selecting a color and flicking it
'flicks' that color to all other devices.

#### Scroll
sense.js enabled scroll based on screen tilt


Quickstart
----------

Download sense.js, and refer to it in an html file, and initialize it!

```html
<script src="path/to/sense.js"></script>
<script>
    var sense = sense.init();
    
    sense.flick(function(data){
        // Your callback code here!
    });
</script>
```

Documentation
-------------

### sense.orientation([options], callback)

Orientation fires continuously, and emits alpha, beta, and gamma data from the device.

Options       | Description                              | Default
------------- | -----------------------------------------|-----------
alphaThreshold| (number) Threshold for changes in delta  | 0
betaThreshold | (number) Threshold for changes in beta   | 0
gammaThreshold| (number) Threshold for changes in gamma  | 0
radians       | (boolean) True to emit values in radians | false


Data          | Description                               
------------- | -----------------------------------------
alpha         | (number) degree/radian value for direction the device is pointed 
beta          | (number) degree/radian value for device's front-back tilt
gamma         | (number) degree/radian value for device's left-right tilt  

Sample Usage:
```javascript
sense.orientation(function(data){
    console.log(data)
});
```

### sense.flick([options], callback)

Flick events fire when the device is rotated quickly left-to-right or right-to-left.

Options       | Description                                                                             | Default
------------- | ----------------------------------------------------------------------------------------|-----------
interval      | (number) the duration in milliseconds to watch for a flick event                        | 150
sensitivity   | (number) multiplier to adjust amount of acceleration required. lower = more sensitive   | 1 

Data          | Description                               
------------- | -----------------------------------------
direction     | (String) 'left' or 'right' depending on the flick direction
magnitude     | (number) the magnitude of the acceleration on flick


Sample Usage:
```javascript
sense.flick(function(data){
    slidePage(data.direction)
});
```

### sense.fling([options], callback)

Fling events fire when the device is rotated quickly in the front-to-back direction, as if
being thrown overhand (with the device facing towards you).

Options       | Description                                                                             | Default
------------- | ----------------------------------------------------------------------------------------|-----------
interval      | (number) the duration in milliseconds to watch for a flick event                        | 150
sensitivity   | (number) multiplier to adjust amount of acceleration required. lower = more sensitive   | 1 

Data          | Description                               
------------- | -----------------------------------------
magnitude     | (number) the magnitude of the acceleration on flick


Sample Usage:
```javascript
sense.fling(function(data){
    sendFile();
});
```

### sense.flip([options], callback)

Flip events fire when the phone is quickly flipped from face-up to face-down to face-up position.

Options         | Description                                                            | Default
-------------   | -----------------------------------------------------------------------|-----------
gestureDuration | (number) timespan in milliseconds that the flip event can occur over   | 150

Data          | Description                               
------------- | -----------------------------------------
gamma         | (number) the final gamma value after the flip


Sample Usage:
```javascript
sense.flip(function(data){
    showRandomNumber();
});
```

### sense.addTiltScroll([options])

This one line allows the user to observe the tilt of the user's phone to scroll on a page.

Options             | Description | Default
--------------------| ------------|------------
maxHorizontalAngle  | (number)    | 80
maxHorizontalOffset | (number)    | 100
maxHorizontalSpeed  | (number)    | 15 
maxVerticalAngle    | (number)    | 40
maxVerticalOffset   | (number)    | 100
maxVerticalSpeed    | (number)    | 15 

Sample Usage:
```javascript
sense.addTiltScroll();
```

### Debugging

We can initialize Sense with a debug flag!

```javascript
var sense = sense.init({debug: true});
```

The debugger will include a fixed div in the bottom right corner that displays
data when events fire. This is particularly useful when debugging on mobile, as you can't
use debugger or console.log :(


To start the demo site:

```sh
$ npm install
$ npm start
```


