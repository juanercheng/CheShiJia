// JavaScript Document
function setCookie(name,value,hours,path){
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + hours*3600000);
    path = path == "" ? "" : ";path=" + path;
    _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
}
//获取cookie值    方法
function getCookieValue(name){
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败
        var start = pos + name.length;                  //cookie值开始的位置
        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie
        var value = allcookies.substring(start,end);  //提取cookie的值
        return unescape(value);                           //对它解码
    }
    else return "";                                             //搜索失败，返回空字符串
}

var time = 0;

$(document).ready(function(){
    //获取Cookie保存的用户名和密码

    var username = getCookieValue("cookUser");
    var password = getCookieValue("cookPass");

    if (username !='' && password !='' ) {
        $('.name').val(username);
        $(".password").val(password);

        $("input[type=checkbox]").next("span").attr("class","click_ok")


    }else{
        $("input[type=checkbox]").next("span").attr("class","click_no")
    }

});
(function($) {

    $.page=function(){
        var $page={};
        $page.methods={
            init:function(){
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userName");
                this.registerAccount();
            },

            //登录信息获取；
             registerAccount:function(){
                 $("[type=checkbox]").click(function(){
                     if($(this).next("span").attr("class")=="click_no"){
                         $(this).next("span").attr("class","click_ok")
                         time = 60 * 60 * 60;
                     }else if($(this).next("span").attr("class")=="click_ok"){
                         $(this).next("span").attr("class","click_no")
                     }
                 });

                 //点击登录接口
                 $('.logInBtn').click(function(){
                     var name=$('.name').val();
                     var password=$('.password').val();
                     if(name.trim()==""){
                         layer.alert("请输入用户名！");
                         return;
                     }
                     if(password.trim()==""){
                         layer.alert("请输入密码！");
                         return;
                     }

                     if($("input[type=checkbox]").prop("checked")){
                         // sessionStorage.userNum = name;
                         setCookie('cookUser', name, time, '/');//set 获取用户名和密码 传给cookie
                         setCookie('cookPass', password, time, '/');
                     }
                     
                     //"登录按钮"状态改变
                     $('.logInBtn').css('background',"rgb(190,39,38)").text("正在登录");

                     $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "account/login", //绝对路径
                        data: {acc:name,pwd:password,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType:'json',
                        success: function(Response) {
                                 if(Response.rspCode=="0000") {
                                     sessionStorage.setItem('token',Response.data.token);
                                     sessionStorage.setItem('userName',Response.data.name);
                                     sessionStorage.setItem("grade",Response.data.grade);
                                     //登录成功后跳转至首页页面
                                     window.location="index.html";
                                 } else {
                                     layer.alert(Response.rspDesc);
                                 }
                            $('.logInBtn').css('background',"rgb(220,39,38)").text("登录");
                        },
                         error: function() {
                             layer.alert("服务器异常，请稍后处理！");
                             $('.logInBtn').css('background',"rgb(220,39,38)").text("登录");
                         }
                    });
                 
                 });
                 //点击忘记密码
                 $('.forgetPassword').click(function(){
                      window.location="register_forget.html";
                 });
            }
        };
        return $page.methods;
    };
})(jQuery);


    
    
    
    
    
    
    
    
    