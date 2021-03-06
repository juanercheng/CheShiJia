// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.registerAccount();
            },
            //接口加密：
            // getMessage:function(){
            //     $.ajax({
            //         type: "POST", //提交方式
            //         url: root_path + "g", //绝对路径
            //         data: {
            //             key: name, pwd: password, mobile: mobile, code: authCode,
            //         }, //数据，这里使用的是Json格式进行传输
            //         dataType: 'json',
            //         success: function (Response) {
            //             $('.getCode').attr("data-type","true");
            //             console.log(Response);
            //             // if (Response.rspCode == "0000") {
            //             //     $('.registerBtn').css("backgroundColor","rgb(190,39,38").text("注册成功");
            //             //     //注册成功后跳转至登录页面
            //             //     window.location = "log_in.html";
            //             // } else {
            //             //     layer.alert(Response.rspDesc);
            //             // }
            //         },
            //         error: function() {
            //             layer.alert("服务器异常，请稍后处理！");
            //         }
            //     });
            // },
            //注册信息获取；
            registerAccount: function () {
                $(".agreement>span:first").click(function(){
                   if($(this).attr("class")=="written_consent_ok"){
                       $(this).attr("class","written_consent_no")
                   }else if($(this).attr("class")=="written_consent_no"){
                        $(this).attr("class","written_consent_ok")
                    }
                });

                //获取验证码
                $('.getCode').click(function () {
                    var name = $('.name').val();
                    var mobile = $('.mobile').val();
                    if(name.trim()==""){
                         layer.alert("请输入用户名！");
                        return;
                    }
                    if(mobile.trim()==""){
                         layer.alert("请输入手机号！");
                        return;
                    }
                    var mobile_reg = new RegExp(/^1[3-9]\d{9}$/);
                    if(!mobile_reg.test(mobile)){
                         layer.alert("手机号输入不正确！");
                        return;
                    }
                    if($(this).attr("data-type")=="true"){
                        var json={ "mobile": mobile, "type": 1}
                        $.ajax({
                            type: "POST", //提交方式
                            url: root_path + "account/getMobileEncryption", //绝对路径
                            data: {
                                key: JSON.stringify(json)
                            }, //数据，这里使用的是Json格式进行传输
                            dataType: 'json',
                            success: function (Response) {
                               $.ajax({
                                type: "POST", //提交方式
                                url: root_path + "account/getMobileCode", //绝对路径
                                data: {
                                    key: Response.data.info,
                                }, //数据，这里使用的是Json格式进行传输
                                dataType: 'json',
                                success: function (Response) {
                                    // console.log(Response);
                                    if (Response.rspCode == "0000") {
                                        var t = 0,
                                            n = 0;
                                        var time = setInterval(function() {
                                            if(t == 0) {
                                                if(n == 1) {
                                                    // 终止循环
                                                    clearInterval(time);
                                                }
                                                t = 60;
                                                // 这个N是循环开关
                                                n = 1;
                                                $('.getCode').attr('data-type', 'true');
                                                $('.getCode').css({
                                                    "backgroundColor":"#dc2726",
                                                    "cursor":"pointer",

                                                });
                                                $('.getCode').html('获取验证码');
                                            } else {
                                                t--;
                                                $('.getCode').attr('data-type', 'false');
                                                $('.getCode').css({
                                                    "backgroundColor":"gray",
                                                    "cursor":"auto",
                                                    "line-height": "0",
                                                    "font-size":"10px",
                                                    "text-align":"center",
                                                });
                                                $('.getCode').html(t + 's后重新发送...');
                                            }
                                        }, 1000);
                                    } else {
                                        layer.alert(Response.rspDesc);
                                    }
                                },
                                error: function () {
                                    layer.alert("服务器异常，请稍后处理！");
                                }
                            });
                            },
                            error: function () {
                                // console.log(data)
                            }
                        });
                       
                    }


                });
                //点击提交注册接口
                $('.registerBtn').click(function () {
                    var name = $('.name').val();//sessionStorage.setItem('userName',name);
                    var mobile = $('.mobile').val();
                    var authCode = $('.authCode').val();
                    var password = $('.password').val();
                    //alert(name+password+mobile+authCode);
                    if(name.trim()==""){
                         layer.alert("请输入用户名！");
                        return;
                    }
                    if(mobile.trim()==""){
                         layer.alert("请输入手机号！")
                        return;
                    }
                    var mobile_reg = new RegExp(/^1[3-9]\d{9}$/);
                    if(!mobile_reg.test(mobile)){
                         layer.alert("手机号输入不正确！");
                        return;
                    }
                    if(authCode.trim()==""){
                         layer.alert("请输入验证码！");
                        return;
                    }
                    if(password.trim()==""){
                         layer.alert("请填写密码！");
                        return;
                    }
                    if( $(".agreement>span:first").attr("class")=="written_consent_no"){
                         layer.alert("请勾选同意书！");
                        return;
                    }
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "account/register", //绝对路径
                        data: {
                            acc: name, pwd: password, mobile: mobile, code: authCode,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            $('.getCode').attr("data-type","true");
                            console.log(Response);
                            if (Response.rspCode == "0000") {
                                $('.registerBtn').css("backgroundColor","rgb(190,39,38").text("注册成功");
                                //注册成功后跳转至登录页面
                                window.location = "log_in.html";
                            } else {
                                 layer.alert(Response.rspDesc);
                            }
                        },
                        error: function() {
                             layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                });
            }
        };
        return $page.methods;
    };
})(jQuery);


    
    
    
    
    
    
    
    
    