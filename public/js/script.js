(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	function _readOnlyError(name){throw new Error("\""+name+"\" is read-only")}var apple=[1,2,3,4];var lemon=[5,6,7];var oragen=[].concat(apple,lemon);oragen=(_readOnlyError("oragen"),oragen+oragen);

})));
