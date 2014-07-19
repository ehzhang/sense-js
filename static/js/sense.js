(function(window){
  'use strict';


  var sense = {
    foo: "hello",
    bar: function(){
      console.log("BAR");
    }
  };

  console.log("We have sense!");

  window.sense = sense

}(window));
