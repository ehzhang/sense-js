(function(window){
  'use strict';

  var sense = {
    debug: false
  };

  /**
   * Given arguments and default options, return an object containing options and the callback
   * @param args: Array of arguments
   * @param defaultOptions: Object containing default options
   * @returns {{options: *, callback: *}}
   */
  var getArgs = function (args, defaultOptions) {
    if (args.length === 1){
      // We only have the callback, so use default options
      return {
        options: defaultOptions,
        callback: args[0]
        };
    }

    if (args.length === 2){
      // We have both the callback and an arguments hash
      return {
        options: arguments[0],
        callback: args[1]
      }
    }
  };

  if (window.DeviceOrientationEvent){

    /*
      Tilt function!
     */
    sense.tilt = function() {
      var callback,
          options = {
            // Default Options
          },
          args = getArgs(arguments, options);

      callback = args.callback;
      options = args.options;

      window.addEventListener('deviceorientation', function(eventData){

        // Here, you take the eventData and the options that you have and
        // process the data, and then feed it to the callback

        var data = {
          direction: eventData.beta < 0 ? "UP" : "DOWN"
          };

        callback(data);

      })
    }



  } else {
    // Sense is not available on this device.
    console.log("Sense is not available on this device.");
  }

  window.sense = sense;

}(window));
