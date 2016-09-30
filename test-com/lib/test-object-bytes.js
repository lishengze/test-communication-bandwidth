var path    						= require('path');
var fs       						= require('fs');
var SysUserApiStruct    = require("./SysUserApiStruct.js");

var testValue = "RtnObjectAttrTopic CallbackData";

var callbackData = {}
callbackData = new SysUserApiStruct.CShfeFtdcRtnObjectAttrField();
callbackData.ObjectID  = testValue;
callbackData.AttrType  = testValue;
callbackData.AttrValue = testValue;
callbackData.ValueType = testValue;
callbackData.MonDate   = testValue;
callbackData.MonTime   = testValue;

function getObjectBytes(Obj) {
	var bytesNumb = 0;
	for (pro in Obj) {
		console.log (pro);
		console.log (Obj.pro);
		if (typeof(Obj.pro ) === "string") {
			 bytesNumb += obj.pro.replace(/[^\x00-\xff]/gi, "--").length; 			
		}
	}

	return bytesNumb;
}

// console.log ('callbackData bytes: ' + getObjectBytes(callbackData));

function testBuffer() {
	// var str = '\u00bd + \u00bc = \u00be';
	var str = 5000;
	// console.log(str + ": " + str.length + " characters, " + Buffer.byteLength(str, 'utf8') + " bytes");

	console.log(Buffer.byteLength(str, 'utf8') + " bytes");

// ½ + ¼ = ¾: 9 characters, 12 bytes
}

function testReplace() {
	var str = testValue;
	// str = str.replace(/[^/x00-/xff]/g,"**");
	str = str.replace(/[^\x00-\xff]/gi, "--"); 
	console.log (str + ": " + str.length );
}


testReplace();
// testBuffer();