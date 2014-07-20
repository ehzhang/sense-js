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

  window.sense = sense;

}(window, document));
