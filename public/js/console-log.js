(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function ban(){console.log("banana");}

  console.log("Testing pls");var apple=function apple(){console.log("ANOTHER ONE");};apple();ban();

})));
