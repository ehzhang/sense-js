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
          .innerText = JSON.stringify(data, undefined, 2);
    }
  };

  var withinThreshold = function(a, b, threshold){
    return b < a + threshold && b > a - threshold
  };

  /**
   * Orientation ([options], callback)
   * - Options:
   *    alphaThreshold (number)
   *    betaThreshold (number)
   *    gammaThreshold (number)
   *    radians (boolean)
   *
   * - Data:
   *    alpha (num)
   *    beta (num)
   *    gamma (num)
   */
  Sense.prototype.orientation = function() {
    if (window.DeviceOrientationEvent) {
      var defaults = {
            alphaThreshold: 1,
            betaThreshold: 1,
            gammaThreshold: 1,
            radians: false
          },
          args = getArgs(arguments, defaults),
          callback = args.callback,
          options = args.options;


      var prevData = {
        alpha: 0,
        beta: 0,
        gamma: 0
      };

      window.addEventListener('deviceorientation', function (eventData) {

        var data = {
          alpha: eventData.alpha,
          beta: eventData.beta,
          gamma: eventData.gamma
        };

        callback(data)

      })

    }
  };

  /*
    Tilt function!
   */
  Sense.prototype.tilt = function() {
    if (window.DeviceOrientationEvent) {
      var callback,
          options = {
            threshold: 25,
            direction: "both",
            gestureDuration: 300
          },
          args = getArgs(arguments, options),
          lastSample,
          intervalExpired = true;

      callback = args.callback;
      options = args.options;

      setInterval(function(){intervalExpired = true}, options.gestureDuration)

      window.addEventListener('deviceorientation', function(eventData){
        // Here, you take the eventData and the options that you have and
        // process the data, and then feed it to the callback
        if(intervalExpired) {
          lastSample = eventData.gamma;
          intervalExpired = false;
        }
        var delta = lastSample - eventData.gamma;

        if(delta > options.threshold) {
          lastSample = eventData.gamma;
          var data = {
            direction: "LEFT",
            magnitude: Math.round(delta)

          };
          callback(data);
        }

        if(delta < -options.threshold) {
          lastSample = eventData.gamma;
          var data = {
            direction: "RIGHT",
            magnitude: Math.round(-delta)
          };
          callback(data);
        }

      })
    }
  };

  /**
   * Flick ([options], callback)
   * - Options:
   *    interval (int)
   *    sensitivity
   *
   * - Data:
   *    direction String 'left', 'right'
   *    magnitude (float)
   */
  Sense.prototype.flick = function() {
    if (window.DeviceMotionEvent) {
      var FLICK_ACCELERATION = 15;
      var defaults = {
            interval: 150,
            sensitivity: 1
          },
          args = getArgs(arguments, defaults),
          callback = args.callback,
          options = args.options;

      var flicking = false;

      window.addEventListener('devicemotion', function (eventData) {

        var acceleration = eventData.acceleration;

        if (Math.abs(acceleration.x) > options.sensitivity * FLICK_ACCELERATION) {
          if (!flicking){
            flicking = true;
            callback({
              direction: acceleration.x > 0 ? 'left' : 'right',
              magnitude: Math.abs(acceleration.x)
            });
            setTimeout(function(){
              flicking = false;
            }, options.interval);
          }
        }
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

    setInterval(function(){intervalExpired = true}, 250);

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
        info = xyz.replace("Z", Math.round(10*acceleration.z)/10);

        var data = {
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
          if (z_accels[z_accels.length-1] < -1.5 || z_accels[z_accels.length-2] < -1.5 || z_accels[z_accels.length-3] < -1.5 || z_accels[z_accels.length-4] < -1.5) {
            zMove = true;
          }
          if (x_accels[x_accels.length-1] > -2 && x_accels[x_accels.length-1] < 2) {
            xMove = false;
          }
          if (y_accels[y_accels.length-1] > -2 && y_accels[y_accels.length-1] < 2) {
            yMove = false;
          }

          if (zMove && !xMove && !yMove) {
            document.getElementById("Toss").innerHTML = z_accels[z_accels.length - 1];
            document.getElementById("TossAngle").innerHTML = "TOSS";
          }
          callback(z_accels);
        }
      });
    }
  };

  window.sense = sense;

}(window, document));
