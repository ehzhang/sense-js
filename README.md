sense.js
========

an HTML5 interaction library for mobile browsers

Overview
--------

HTML5 offers a lot of awesome access to hardware data. Sense.js is a library that
abstracts away the math and gives developers and designers easy access to some
common gesture interactions with simple javascript callbacks.

Quickstart
----------

Download sense.js, and refer to it in an html file, and initialize it!

```html
<script src="path/to/sense.js"></script>
<script>
    var sense = sense.init();
    
    sense.flick(function(data){
        // Your callback code here!
    }
</script>
```

Documentation
-------------

### sense.orientation([options], callback)

Orientation fires continuously, and emits alpha, beta, and gamma data.

Options       | Description                              | Default
------------- | -----------------------------------------|-----------
alphaThreshold| (number) Threshold for changes in delta  | 1
betaThreshold | (number) Threshold for changes in beta   | 1 
gammaThreshold| (number) Threshold for changes in gamma  | 1
radians       | (boolean) True to emit values in radians | false


Data          | Description                               
------------- | -----------------------------------------
alpha         | (number) degree/radian value for direction the device is pointed 
beta          | (number) degree/radian value for device's front-back tilt
gamma         | (number) degree/radian value for device's left-right tilt  


### sense.tilt([options], callback)


Options       | Description                              | Default
------------- | -----------------------------------------|-----------
alphaThreshold| (number) Threshold for changes in delta  | 1
betaThreshold | (number) Threshold for changes in beta   | 1 
gammaThreshold| (number) Threshold for changes in gamma  | 1
radians       | (boolean) True to emit values in radians | false


Data          | Description                               
------------- | -----------------------------------------
alpha         | (number) degree/radian value for direction the device is pointed 
beta          | (number) degree/radian value for device's front-back tilt
gamma         | (number) degree/radian value for device's left-right tilt  

### Debugging

We can initialize Sense with a debug flag!

```javascript
    var sense = sense.init({debug: true});
```

The debugger will include a fixed div in the bottom right corner that emits
data upon events.


To start the demo site:

```sh
$ npm install
$ npm start
```


