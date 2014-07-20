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
          "<div id='sense-debugger' style='position:fixed; right:0; bottom:0; color: white; background: black; padding: 20px; font-size: 2em'>" +
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

  Sense.prototype.fling = function() {
    if (window.DeviceMotionEvent) {
      var THROW_ACCELERATION = 10;
      var defaults = {
            interval: 150,
            sensitivity: 1
          },
          args = getArgs(arguments, defaults),
          callback = args.callback,
          options = args.options;

      var throwing = false;

      window.addEventListener('devicemotion', function (eventData) {

        var acceleration = eventData.acceleration;

        if (acceleration.z > options.sensitivity * THROW_ACCELERATION) {
          if (!throwing){
            throwing = true;
            callback({
              a: acceleration.z,
              magnitude: Math.abs(acceleration.z)
            });
            setTimeout(function(){
              throwing = false;
            }, options.interval);
          }
        }
      })
    }
  };

  Sense.prototype.toss = function() {
    var intervalExpired = false;
    var z_accels = [];
    var x_accels = [];
    var y_accels = [];

    var Z_THRESHOLD = -1.5;
    var X_Y_THRESHOLD = 2;

    setInterval(function(){intervalExpired = true}, 250);

    if (window.DeviceMotionEvent) {
      var callback,
          options = {

          },
          args = getArgs(arguments, options);

      callback = args.callback;
      options = args.options;

      window.addEventListener('devicemotion', function (eventData) {
        var acceleration = eventData.acceleration;

        if (intervalExpired) {
          z_accels[z_accels.length] = Math.round(10*acceleration.z)/10;
          x_accels[x_accels.length] = Math.round(10*acceleration.x)/10;
          y_accels[y_accels.length] = Math.round(10*acceleration.y)/10;

          intervalExpired = false;
          var zMove = false;
          var xMove = true;
          var yMove = true;
          if (z_accels[z_accels.length-1] < Z_THRESHOLD || z_accels[z_accels.length-2] < Z_THRESHOLD) {
            zMove = true;
          }
          if (Math.abs(x_accels[x_accels.length-1]) > X_Y_THRESHOLD) {
            xMove = false;
          }
          if (Math.abs(y_accels[y_accels.length-1]) > X_Y_THRESHOLD) {
            yMove = false;
          }

          if (zMove && !xMove && !yMove) {
            document.getElementById("Toss").innerHTML = z_accels[z_accels.length - 1];
            document.getElementById("TossAngle").innerHTML = "TOSS";

          }
            callback({
              magnitude: z_accels[z_accels.length-1] > z_accels[z_accels.length-2] ? z_accels[z_accels.length-1] : z_accels[z_accels.length-2]
            });

        }
      });
    }
  };

  Sense.prototype.toss = function() {
    var intervalExpired = false;
    var z_accels = [];
    var x_accels = [];
    var y_accels = [];

    var Z_THRESHOLD = -1.5;
    var X_Y_THRESHOLD = 2;

    setInterval(function(){intervalExpired = true}, 250);

    if (window.DeviceMotionEvent) {
      var callback,
          options = {

          },
          args = getArgs(arguments, options);

      callback = args.callback;
      options = args.options;

      window.addEventListener('devicemotion', function (eventData) {
        var acceleration = eventData.acceleration;

        if (intervalExpired) {
          z_accels[z_accels.length] = Math.round(10*acceleration.z)/10;
          x_accels[x_accels.length] = Math.round(10*acceleration.x)/10;
          y_accels[y_accels.length] = Math.round(10*acceleration.y)/10;

          intervalExpired = false;
          var zMove = false;
          var xMove = true;
          var yMove = true;
          if (z_accels[z_accels.length-1] < Z_THRESHOLD || z_accels[z_accels.length-2] < Z_THRESHOLD) {
            zMove = true;
          }
          if (Math.abs(x_accels[x_accels.length-1]) > X_Y_THRESHOLD) {
            xMove = false;
          }
          if (Math.abs(y_accels[y_accels.length-1]) > X_Y_THRESHOLD) {
            yMove = false;
          }

          if (zMove && !xMove && !yMove) {
            document.getElementById("Toss").innerHTML = z_accels[z_accels.length - 1];
            document.getElementById("TossAngle").innerHTML = "TOSS";

          }
            callback({
              magnitude: z_accels[z_accels.length-1] > z_accels[z_accels.length-2] ? z_accels[z_accels.length-1] : z_accels[z_accels.length-2]
            });

        }
      });
    }
  };

  Sense.prototype.flip = function() {
    var gammas = [];
    if (window.DeviceOrientationEvent) {
      var callback,
          options = {
            gestureDuration: 250
          },
          args = getArgs(arguments, options),
          lastSample,
          intervalExpired = true;

      callback = args.callback;
      options = args.options;

      setInterval(function(){intervalExpired = true}, options.gestureDuration);

      window.addEventListener('deviceorientation', function(eventData){
        var final_gamma = 0
        var found = false;
        if(intervalExpired) {
          gammas[gammas.length] = eventData.gamma;
          for (var i=0; i < 5; i++) {
            if (Math.abs(gammas[gammas.length-1] - gammas[gammas.length-1-i]) > 160) {
              document.getElementById("Flip").innerHTML = "FLIP";
              found = true;
              final_gamma = gammas[gammas.length - 1];
              break;
            }
          }
          intervalExpired = false;
        }

        if (found) {
          var data = {
            magnitude: Math.round(final_gamma)
          };
          callback(data);
        }

      })
    }
  };

  window.sense = sense;

}(window, document));
