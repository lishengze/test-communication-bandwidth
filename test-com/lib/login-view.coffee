{View}           = require 'space-pen'
{TextEditorView} = require 'atom-space-pen-views'
SysUserApiStruct = require './SysUserApiStruct.js'
events           = require './events.js'
EVENTS           = new events.EVENTS()
reconnectLimits  = 10;
isFirstConnect   = true;
window.userApiStruct = SysUserApiStruct;
window.EVENTS    = EVENTS;
RequestIDFunc    = require './window-requestid.js'

failedLoginUserID = ""
bLoginFailed = false
LoginTimes = 1;

g_output_info = "";
g_RtnObjectAttrTopic_spi_callbackNumb = 0;
g_startTime = 0;
g_endTime = 0;

g_sec = 1
g_min = 1
g_timeInterval = g_sec * g_min * 1000;
test_numb = 7;
g_sec_array[] = [1,5,30,60,60,60,60];
g_min_array[] = [1,1,1, 1, 5, 30,60];

g_reqNumb = 1;
g_rtn_over = false; 
g_testTimeIndex = 0;

g_curDate = "";
g_stop = false;

fs           = require 'fs'
path         = require 'path'
testfileName = path.join __dirname, './test-communication.txt'

GetCurrTime = ->
  myDate = new Date()
  return myDate;

resetReqQrySubscriber = ->
    if g_reqNumb ===  6 
        g_testTimeIndex++;

        if (g_testTimeIndex >= test_numb) {
            exit(0);
        }

        console.log ("reset time!");
        g_sec = g_sec_array[g_testTimeIndex];
        g_min = g_min_array[g_testTimeIndex];
        console.log ("g_sec: " + g_sec);  
        console.log ("g_min: " + g_min); 

        g_stopusec = g_min * g_sec * 1000000;
        g_reqNumb = 1; 

    g_curDate = GetCurrTime();
    g_startTime = g_curDate.getTime();
    fs.appendFileSync(testfileName, '\n' + 'StartTime:    ' + g_curDate + '\n');

    g_rtn_over = false;
    g_RtnObjectAttrTopic_spi_callbackNumb = 0;  

module.exports =
class LoginView extends View
  @content: ->
    @div class: 'loginView', =>
      @div class: 'modal fade', outlet: "login", id:"loginModal", =>
        @div class: 'modal-dialog modal-sm', =>
          @div class: 'modal-content', =>
            @div class: 'modal-header', =>
              @button type: 'button', tabindex: '-1', class: 'icon icon-remove-close close ', 'data-dismiss': 'modal', 'aria-label': 'Close'
              @h4 class:'modal-title pull-left', '用户登录'
            @div class: 'modal-body', =>
              @form class: 'form-horizontal', role : 'form', =>
                @div class: 'form-group', =>
                  @span class: 'fa fa-user fa-3x col-lg-2'
                  @div class: 'col-lg-10', =>
                    @input class: 'form-control native-key-bindings ',disabled:'disabled',tabindex: '3',type: 'text', placeholder: '用户名', id:'inputText', outlet:'inputText'
                @div class: 'form-group', =>
                  @span class: 'fa fa-key fa-3x col-lg-2'
                  @div class: 'col-lg-10', =>
                    @input class: 'form-control native-key-bindings', disabled:'disabled',tabindex: '4',type: 'password', placeholder: '密码', id:'inputPassword', outlet:'inputPassword'
                @div class: 'form-group', =>
                  @span class: 'fa fa-server fa-3x col-lg-2'
                  @div class: 'col-lg-10', =>
                    @select class: 'form-control',outlet:'selectPort',disabled:'disabled', =>
                      @option '165'
                      @option '166'
                @div class: 'form-group', =>
                  @div class:'row', =>
                    @div class: 'pull-right col-lg-4', =>
                      @div class: 'checkbox', =>
                        @label '记住我', =>
                          @input type: 'checkbox', tabindex: '6'
                @div class: 'form-group', =>
                  @div class: 'col-md-12', =>
                    @p  class:'text-info', id:'connectinfo', outlet:'connectinfo', '正在连接服务器......'
            @div class: 'modal-footer',=>
                  @button type: 'button', id:'loginBtn', outlet:'loginBtn',  tabindex: '7',class: 'btn btn-primary btn-lg', disabled:'disabled','登录'
                  @button type: 'button', id:'logoutBtn', outlet:'logoutBtn', tabindex: '8',class: 'btn btn-primary btn-lg', 'data-dismiss':'modal','退出'
      @div class: 'modal fade', outlet: "connectError", =>
        @div class: 'modal-dialog modal-sm', =>
          @div class: 'modal-content', =>
            @div class: 'modal-body', =>
               @h3 class:'text-center text-danger', '服务器连接断开,无法连接。'
               @div class:'row', =>
                 @div class:'col-sm-8 col-sm-offset-4', =>
                   @button type: 'button', class:'btn-default btn-lg','data-dismiss':'modal', id:'connectErrorLogout', '退出程序'

  initialize: ->
    $('body').append(@login.parent())
    $(@login[0]).modal('backdrop': 'static', keyboard: false, show: true)

    @loginBtn.click(loginFunc)
    @logoutBtn.click(logoutFunc)

    $("#connectErrorLogout").click(logoutFunc)
    $(".loginView").keydown(enterFunc)

  enterFunc = (event) ->
      if event.keyCode == 13
        loginFunc();

  loginFunc = ->
        userID   = $("#inputText").val()
        password = $("#inputPassword").val()

        if userID == ""
          alert '用户名不可为空，请重新输入'
          return

        userinfo           = new userApiStruct.CShfeFtdcReqQrySysUserLoginField()
        userinfo.UserID    = userID
        userinfo.Password  = password
        userinfo.VersionID = "2.0.0.0"
        loginReqField           = {}
        loginReqField.reqObject = userinfo
        loginReqField.RequestId = ++window.ReqQrySysUserLoginTopicRequestID
        loginReqField.message   = EVENTS.RspQrySysUserLoginTopic + loginReqField.RequestId

        userApi.emitter.emit EVENTS.SocketIONewUserCome, loginReqField

        g_curDate = GetCurrTime();
        g_startTime = g_curDate.getTime();
        fs.appendFileSync(testfileName, '\n' + 'StartTime:    ' + g_curDate + '\n');

        console.log 'StartTime: ' + g_curDate

        userApi.emitter.on EVENTS.RtnObjectAttrTopic, (data) =>
          if g_rtn_over === false 
            return

          ++g_RtnObjectAttrTopic_spi_callbackNumb;

          g_curDate = GetCurrTime();
          if (g_curDate.getTime() - g_startTime) > g_timeInterval 
            g_output_info =  'time :        ' + g_timeInterval/1000 + 's\n'
            g_output_info += 'callbackNumb: ' + g_RtnObjectAttrTopic_spi_callbackNumb + '\n'
            g_output_info += 'AveCallbkNumb:' + g_RtnObjectAttrTopic_spi_callbackNumb / (g_timeInterval/1000) + '\n'
            g_output_info += 'data:         ' + g_RtnObjectAttrTopic_spi_callbackNumb * 432 + 'bytes\n'
            g_output_info += 'EndTime:      ' + g_curDate + '\n';

            fs.appendFileSync(testfileName, g_output_info + '\n');
            g_rtn_over = true;
            resetReqQrySubscriber();

  logoutFunc = ->
      atom.close()

  attached: ->
      connectServer(this)
      serverMsgFunc(this)

  connectServer = (_this)->
      clientMain     = require './client-main.js'
      window.userApi = clientMain

  serverMsgFunc = (_this)->
      userApi.emitter.on EVENTS.RootSocketConnect, (data)->
          # console.log EVENTS.RootSocketConnect
          _this.connectinfo.text('服务器连接成功')
          isFirstConnect = false
          _this.inputText.removeAttr("disabled")
          _this.inputPassword.removeAttr("disabled")
          _this.selectPort.removeAttr("disabled")
          _this.loginBtn.removeAttr("disabled")

      userApi.emitter.on EVENTS.RootSocketConnectError, (data) ->
          console.log EVENTS.RootSocketConnectError

      userApi.emitter.on EVENTS.RootSocketDisconnect, (data) ->
          console.log EVENTS.RootSocketDisconnect

      userApi.emitter.on EVENTS.RootSocketReconnect, (data) ->
          console.log EVENTS.RootSocketReconnect

      userApi.emitter.on EVENTS.RootSocketReconnectAttempt, (data) ->
          console.log EVENTS.RootSocketReconnectAttempt

      userApi.emitter.on EVENTS.RootSocketReconnecting, (Number) ->
          console.log EVENTS.RootSocketReconnecting
          console.log Number
          if Number > reconnectLimits
            # 确定链接失败.
            if isFirstConnect
                _this.connectinfo.attr 'class', 'text-success'
                _this.connectinfo.text '连接服务器失败, 正在重连......'
            else
                $(_this.connectError[0]).modal('backdrop': 'static', keyboard: false, show: true)  #服务器断开，弹出对话框.

      userApi.emitter.on EVENTS.RootSocketReconnectError, (data) ->
          console.log EVENTS.RootSocketReconnectError
          console.log data

      userApi.emitter.on EVENTS.RootSocketReconnectFailed, (data) ->
          console.log EVENTS.RootSocketReconnectFailed
          console.log data

      userApi.emitter.on EVENTS.RspQrySysUserLoginTopic, (data) ->
          console.log "login-view2: RspQrySysUserLoginTopic CallbackData"
          console.log data