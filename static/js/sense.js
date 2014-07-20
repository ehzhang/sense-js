(function(window, document){
  'use strict';

  var _instance,
      config;

  var sense = {
    get: function() {
      return _instance;
    },
    init: function(options){
      return _instance || new Sense(options)
    }
  };

  /**
   * Constructor
   */
  function Sense(options){
    _instance = this;
    config = options || {debug: false};

    if (config.debug) {
      initDebuggingWindow();
    }

  }

  /**
   * Given arguments and default options, return an object containing options and the callback
   * @param args: Array of arguments
   * @param defaultOptions: Object containing default options
   * @returns {{options: *, callback: *}}
   */
  var getArgs = function (args, defaultOptions) {
    var callback;
    if (args.length === 1){
      // We only have the callback, so use default options
      callback = args[0];
      return {
        options: defaultOptions,
        callback: function(data){
          updateDebugger(data);
          callback(data);
        }
        };
    }

    if (args.length === 2){
      // We have both the callback and an arguments hash
      callback = args[1];
      return {
        options: arguments[0],
        callback: function(data){
          updateDebugger(data);
          callback(data);
        }
      }
    }
  };

  /**
   * Show a debugger with data on the
   * @param data
   */
  var initDebuggingWindow = function(){
    if (config.debug){
      var el = document.createElement('div');
      el.innerHTML = "" +
          "<div id='sense-debugger' style='position:fixed; right:0; bottom:0; background: yellow; padding: 20px; font-size: 2em'>" +
          "</div>";
      window.onload = function(){
        document.body.appendChild(el);
      }
    }
  };

  /**
   * Update the debugger div
   * @param data: JSON
   */
  var updateDebugger = function(data){
    if (config.debug){
      document.getElementById('sense-debugger')
          .innerText = JSON.stringify(data);
    }
  };


  /*
    Tilt function!
   */
  Sense.prototype.tilt = function() {
    if (window.DeviceOrientationEvent) {
      var callback,
          options = {
            // Default Options
          },
          args = getArgs(arguments, options);

      callback = args.callback;
      options = args.options;

      window.addEventListener('deviceorientation', function (eventData) {

        // Here, you take the eventData and the options that you have and
        // process the data, and then feed it to the callback

        var data = {
          direction: eventData.beta < 0 ? "UP" : "DOWN"
        };

        callback(data);
      })
    }
  };

Sense.prototype.toss = function() {
  var intervalExpired = false;
  var z_accels = ["0"];
  var x_accels = ["0"];
  var y_accels = ["0"];

  var z_thetas = ["0"];
  var x_thetas = ["0"];
  var y_thetas = ["0"];

  var zTheta = false;
  var xTheta = true;
  var yTheta = true;

  setInterval(function(){intervalExpired = true}, 250)

if (window.DeviceOrientationEvent) {
      var callback,
          options = {
            // Default Options
          },
          args = getArgs(arguments, options);

      callback = args.callback;
      options = args.options;

      window.addEventListener('deviceorientation', function (eventData) {

        // Here, you take the eventData and the options that you have and
        // process the data, and then feed it to the callback
      if (intervalExpired) {
          z_thetas[z_thetas.length] = eventData.beta;
          x_thetas[x_thetas.length] = eventData.gamma;
          y_thetas[y_thetas.length] = eventData.alpha;

          intervalExpired = false;

          if (z_thetas[z_thetas.length-1] > 10) {
            zTheta = true;
            document.getElementById("TossAngle").innerHTML = "TOSSANGLE";
          }

        }

      })
    }

  if (window.DeviceMotionEvent) {
    var callback,
        options = {

        },
        args = getArgs(arguments, options);

      callback = args.callback;
      options = args.options;

      window.addEventListener('devicemotion', function (eventData) {
        var info, xyz = "[Z]";
        var acceleration = eventData.acceleration;
        //info = xyz.replace("X", Math.round(10*acceleration.x)/10);
        //info = info.replace("Y", Math.round(10*acceleration.y)/10);
        info = xyz.replace("Z", Math.round(10*acceleration.z)/10);

        var data = {
          //x: Math.round(100*acceleration.x)/100
          //y: Math.round(100*acceleration.y)/100
          z: Math.round(100*acceleration.z)/100
        };

        if (intervalExpired) {
          z_accels[z_accels.length] = Math.round(10*acceleration.z)/10;
          x_accels[x_accels.length] = Math.round(10*acceleration.x)/10;
          y_accels[y_accels.length] = Math.round(10*acceleration.y)/10;

          intervalExpired = false;
          var zMove = false;
          var xMove = true;
          var yMove = true;
          if (z_accels[z_accels.length-1] < -2) {
            zMove = true;
          }
          if (x_accels[x_accels.length-1] > -1 && x_accels[x_accels.length-1] < 1) {
            xMove = false;
          }
          if (y_accels[y_accels.length-1] > -1 && y_accels[y_accels.length-1] < 1) {
            yMove = false;
          }

          if (zMove && !xMove && !yMove) {
            document.getElementById("Toss").innerHTML = "TOSS";
          }
          callback(z_accels);
        }
        //callback(info);
      });
    }

  }

  window.sense = sense;

}(window, document));
