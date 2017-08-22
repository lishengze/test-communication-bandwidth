var io       						= require('socket.io-client');
var events   						= require("./events.js");
var path    						= require('path');
var fs       						= require('fs');
var SysUserApiStruct    = require("./SysUserApiStruct.js");

var EVENTS   = new events.EVENTS();
var isHttps  = true;
var isLocal  = false;
var userSocket;
var userServer;
var userInfo;

var localUrl;
var serverUrl;
var port;
var curUrl;
var rootSocket;

var connectServer = function (reqData) {
  if (true === isHttps) {
  	localUrl   = 'https://localhost';
  	serverUrl  = 'https://172.1.128.169';
    // serverUrl  = 'https://192.168.159.128';
  	port       = 8000;
    if (true === isLocal) {
      curUrl = localUrl;
    } else {
      curUrl = serverUrl;
    }
  	curUrl     += ':' + port.toString();
  	rootSocket = io.connect(curUrl,{secure:true});
  } else {
  	localUrl   = 'http://localhost';
    serverUrl  = 'http://172.1.128.169';
    // serverUrl  = 'http://192.168.159.128';
    if (true === isLocal) {
      curUrl = localUrl;
    } else {
      curUrl = serverUrl;
    }
  	rootSocket = io.connect(curUrl);
  }
};

connectServer({});

userInfo                = {};
userInfo.UserID         = "admin"
userInfo.Password       = "admin"
userInfo.VersionID      = "2.0.0.0"
loginReqField           = {}
loginReqField.reqObject = userInfo
loginReqField.RequestId = 1



var rspUserLoginCallNumb  = 1;
var rspMonitorObjCallNumb = 0;
var rtnObjectAttrCallNumb = 0;

var g_output_info = "";
var g_RtnObjectAttrTopic_spi_callbackNumb = 0;
var g_startTime = 0;
var g_endTime = 0;

var g_sec_array     = [5,30,60,60,60,60];
var g_min_array     = [1,1, 1, 5, 30,60];
var g_startTimeIndex= 5;
var g_endTimeIndex  = 6;
var g_testTimeIndex = g_startTimeIndex;
var g_sec           = g_sec_array[g_testTimeIndex];
var g_min           = g_min_array[g_testTimeIndex];
var g_stopusec      = g_sec * g_min * 1000;


var g_reqNumb = 0;
var g_reqTimeNumb = 5;
var g_rtn_over = false;

var g_rtnDataSizeSum   = 3000000;
var g_rtnDataSizeArray = [50, 100, 500, 1000, 5000, 10000, 50000, 100000];
var g_rtnDataSizeIndex = 0;
var g_testDataSizeNumb = 8;
var g_rtnDataSize;
var g_rtnDataSizeNumb;
var g_rtnDataSizeWithHead;
var g_rtnSendNumber;
var g_timeInterval;
var g_rtnDataNumbOneSec;
var g_rtnCalbkValue;

var g_sec_rtnSendNumber;
var g_sec_rtnSendFreq;
var g_rtn_callback_onesec;

var g_isRealTime;

var g_testResultFileName;

var g_curDate = "";
var g_stop = false;
var g_isFirst = true;
var g_isTestFirst = true;

var g_testStartTime;

var g_rtnDataSize;
var g_firstValue = "";

var g_isTestRtn = true;
var g_isTestRsp = false;

var g_testResultFileName = path.join (__dirname, './testResult/test-com-redhat-socketio-all-4.txt');

var GetCurrTime = function() {
myDate = new Date()
return myDate;
}

var setValue = function (dataNumber)
{
	var tmp = "";
	for (var i = 0; i< dataNumber; ++i)
	{
			tmp += 'a';
	}
	return tmp;
}

var SetReqTimePara = function() 
{
		if (g_reqNumb === g_reqTimeNumb)
		{
				g_testTimeIndex++;

				if (g_testTimeIndex >= g_endTimeIndex)
				{
					if (g_rtnDataSizeIndex >= g_testDataSizeNumb)
					{
						userSocket.emit('Test_End', {});
						process.exit(0);
					}		
					else 
					{
						g_testTimeIndex = g_startTimeIndex;
						var requestObj = SetReqDataSizePara();
       			userSocket.emit('Set_Request_Params', requestObj);
						return;
					}			
 	
				}
				else {
					g_sec = g_sec_array[g_testTimeIndex];
					g_min = g_min_array[g_testTimeIndex];
					g_stopusec = g_sec * g_min * 1000;

					g_output_info = "\n----------- Reset Test Time! ----------" + '\n';
					g_output_info += "g_sec: " + g_sec + "    ";
					g_output_info += "g_min: " + g_min + '\n';
					g_output_info += "g_testTimeIndex:  " + g_testTimeIndex + '\n';

					fs.appendFileSync(g_testResultFileName, g_output_info);       
					console.log (g_output_info); 
				}

				g_reqNumb = 0;
		}

		g_isFirst = true;
		g_rtn_over = false;
		g_RtnObjectAttrTopic_spi_callbackNumb = 0;

		
		{
			// g_curDate = GetCurrTime();
			// g_startTime = g_curDate.getTime();
			// g_output_info = '\n' + 'StartTime:     ' + g_curDate + '\n';
			// fs.appendFileSync (g_testResultFileName,  g_output_info);
			// console.log (g_output_info);
		}
}

var SetReqDataSizePara = function ()
{
	g_rtnDataSize         = g_rtnDataSizeArray[g_rtnDataSizeIndex++];
	g_rtnDataSizeNumb     = g_rtnDataSize - 31;
	g_rtnDataSizeWithHead = g_rtnDataSize < 1000 ? g_rtnDataSize+150: g_rtnDataSize;
	g_rtnSendNumber       = Math.ceil(g_rtnDataSizeSum / g_rtnDataSizeWithHead);
	g_timeInterval        = 1*1000;
	g_rtnDataNumbOneSec   = g_rtnSendNumber *(1000/g_timeInterval);
	g_rtnCalbkValue       = setValue(g_rtnDataSizeNumb);

	var tmp = {};
	tmp.g_isTestRtn = g_isTestRtn;
	tmp.g_isTestRsp = g_isTestRsp;
	tmp.g_rtnDataSize = g_rtnDataSize;
	tmp.g_rtnDataSizeNumb = g_rtnDataSizeNumb;
	tmp.g_rtnSendNumber = g_rtnSendNumber;
	tmp.g_timeInterval = g_timeInterval;
	tmp.g_rtnDataNumbOneSec = g_rtnDataNumbOneSec;
	tmp.g_rtnCalbkValue = g_rtnCalbkValue;

	return tmp;
}

rootSocket.on(EVENTS.SocketIONewUserReady, function(CurUserSocketioId){

    console.log("Client: CurUserSocketioId " + CurUserSocketioId + " ready!");
  	userSocket = io.connect(curUrl + '/' + CurUserSocketioId);

    userSocket.on(EVENTS.SocketIONewUserConnectComplete, function(data){
       console.log("Client: " + CurUserSocketioId + "  connect completed!");

			 var requestObj = SetReqDataSizePara();
       userSocket.emit('Set_Request_Params', requestObj);
	  });

		userSocket.on('Set_Request_Params_Done', function()
		{{}
			if (true === g_isTestRtn)
			{
				g_isFirst = true;
				g_rtn_over = false;
				g_RtnObjectAttrTopic_spi_callbackNumb = 0;
				g_reqNumb = 0

				g_output_info = "\n++++++++++++++++++++++++++++++ Set Request Params! ++++++++++++++++++++++++++++++" + '\n';
				g_output_info += "g_rtnDataSize: "   + g_rtnDataSize + "\n";
				g_output_info += "g_rtnSendNumber: " + g_rtnSendNumber + '\n';
				g_output_info += "g_rtnDataSizeIndex:  " + g_rtnDataSizeIndex + '\n';

				fs.appendFileSync(g_testResultFileName, g_output_info);       
				console.log (g_output_info); 

				userSocket.emit(EVENTS.ReqQrySubscriberTopic, {});
			}

			if (true === g_isTestRsp)
			{
				 userSocket.emit(EVENTS.ReqQryMonitorObjectTopic, {});
			}


		});

    userSocket.on(EVENTS.RtnObjectAttrTopic, function(callbackData)
		{		
				if (g_rtn_over === true) return

				g_curDate = GetCurrTime();
				if (true === g_isFirst) 
				{
					g_startTime = g_curDate.getTime();

					if (true === g_isTestFirst) {
						g_testStartTime = g_startTime;
						g_isTestFirst = false;
					}
					
					g_output_info = '\n' + 'StartTime:     ' + g_curDate + '\n';
					fs.appendFileSync (g_testResultFileName, g_output_info);
					console.log (g_output_info);
					g_isFirst = false;
				}		

				{
					// if (callbackData === g_firstValue) {
					// 		testNumber++;
					// 		if (testNumber === g_rtn_callback_onesec) {
					// 				g_output_info =  'Get all the data sended in the first second cost ' + (g_curDate.getTime() - g_testStartTime) + ' ms\n';
					// 				fs.appendFileSync (g_testResultFileName, g_output_info + '\n');
					// 				console.log (g_output_info);
					// 		}
					// }
				}

				++g_RtnObjectAttrTopic_spi_callbackNumb;
			
				if ((g_curDate.getTime() - g_startTime) > g_stopusec)
				{
					// console.log (g_RtnObjectAttrTopic_spi_callbackNumb + ' ' + g_rtnDataSize);

					g_output_info =  'TestTime :     ' + g_stopusec/1000 + 's\n'
					g_output_info += 'SumCallbkNumb: ' + g_RtnObjectAttrTopic_spi_callbackNumb + '\n'
					g_output_info += 'AveCallbkNumb: ' + g_RtnObjectAttrTopic_spi_callbackNumb / (g_stopusec/1000) + '\n'
					g_output_info += 'BandWidth:     ' + g_RtnObjectAttrTopic_spi_callbackNumb * g_rtnDataSize / g_stopusec * 1000 / 1024/1024 + 'M/s\n'
					g_output_info += 'g_reqNumb:     ' + g_reqNumb++ + '\n';
					g_output_info += 'EndTime:       ' + g_curDate + '\n';

					fs.appendFileSync (g_testResultFileName, g_output_info + '\n');
					console.log (g_output_info);
					g_rtn_over = true;
					SetReqTimePara();
				}
    });

		userSocket.on('Set_Request_Params_Done-test', function(testObject){

				g_isTestRtn = testObject.g_isTestRtn;
				g_isTestRsp = testObject.g_isTestRsp;

				if (true === g_isTestRtn) 
				{
					g_sec_rtnSendNumber   = testObject.g_rtnSendNumber;
					g_sec_rtnSendFreq     = testObject.g_rtnSendFreq;
					g_isRealTime          = testObject.g_isRealTime;
					g_rtnDataSize         = testObject.g_rtnDataSize;
					g_firstValue          = testObject.g_firstValue;

					if (true === g_isRealTime) {
						var messageProp = "-realTime";
					} else {
						var messageProp = "-nonrealTime";
					}
					g_rtn_callback_onesec = g_sec_rtnSendNumber * g_sec_rtnSendFreq;
					g_testResultFileName = path.join (__dirname, './testResult/test-com-redhat-socketio-'
																			+ g_rtn_callback_onesec + messageProp + '-' + g_rtnDataSize+'-' +'.txt');

					var reqQrySubscriberData = new SysUserApiStruct.CShfeFtdcReqQrySubscriberField();
					reqQrySubscriberData.ObjectID  = "TMS.PuDian.app.sysprobe.1.CPUUsage";
					reqQrySubscriberData.ObjectNum = -1;
					reqQrySubscriberData.KeepAlive = 1;
					var reqQrySubscriberField = {}
					reqQrySubscriberField.reqObject  = reqQrySubscriberData;
					reqQrySubscriberField.RequestId  = 1;
					reqQrySubscriberField.rtnMessage = reqQrySubscriberData.ObjectID;

					userSocket.emit(EVENTS.ReqQrySubscriberTopic, reqQrySubscriberField);

					g_output_info = '\n*******************  Test Start *****************' + '\n'
												+ 'g_sec: ' + g_sec + '		g_min: ' + g_min + '\n'
												+ "g_rtn_callback_onesec: " + g_rtn_callback_onesec + "\n\n";                  

					fs.appendFileSync (g_testResultFileName, g_output_info);
					console.log (g_output_info);
				}

				if (true === g_isTestRsp)
				{
					var reqMonitorObjectTopicData = new SysUserApiStruct.CShfeFtdcReqQryMonitorObjectField()
					ReqQryMonitorObjectTopicField = {}
					ReqQryMonitorObjectTopicField.reqObject  = reqMonitorObjectTopicData
					ReqQryMonitorObjectTopicField.RequestId  = 1
					ReqQryMonitorObjectTopicField.rspMessage =  EVENTS.RspQryMonitorObjectTopic + ReqQryMonitorObjectTopicField.RequestId

					
					var g_time = 30;
					// for (var i = 0; i < 300 * g_time; ++i) {
					//     userSocket.emit(EVENTS.ReqQryMonitorObjectTopic, ReqQryMonitorObjectTopicField);
					// }
					
					// userApi.emitter.emit(EVENTS.ReqQrySubscriberTopic, reqQrySubscriberField);
					// userSocket.emit(EVENTS.ReqQrySysUserLoginTopic, reqField);
				}


		});
});

rootSocket.on('connect', function(errorObj){
  console.log ("rootSocket connect!");
  rootSocket.emit(EVENTS.SocketIONewUserCome, userInfo);
});

rootSocket.on('error', function(error){
  console.log ('error: ');
  console.log (error);
  console.log ("rootSocket error");
});

rootSocket.on('disconnect', function(){
  console.log ("rootSocket disconnect");
});

rootSocket.on('reconnect', function(Number){
  console.log('rootSocket reconnect, number: ' + Number);
});

rootSocket.on('reconnect_attempt', function(){
  console.log('rootSocket reconnect_attempt!');
});

rootSocket.on('reconnecting', function(Number){
  console.log('rootSocket reconnecting, number: ' + Number);
});

rootSocket.on('reconnect_error', function(Object){
  console.log('Object: ');
  console.log(Object);
  console.log('rootSocket reconnect_error!');
});

rootSocket.on('reconnect_failed', function(){
  console.log('rootSocket reconnect_failed!');
});

		// userSocket.on('AveSendNumberInOneSecond', function(callbackData){
		// 		g_output_info =  'AveSendNumberInOneSecond:  ' + callbackData;
		// 		fs.appendFileSync (g_testResultFileName, g_output_info + '\n');
		// 		console.log (g_output_info);
		// });