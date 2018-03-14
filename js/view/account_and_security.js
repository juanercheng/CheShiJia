// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.formSwitch();
            },
            formSwitch: function () {
                //表格切换
                $('.checkBoxBtn span').click(function () {
                    $(this).addClass('changePassword').siblings('span').removeClass('changePassword');
                    $('.formSwitchBox').eq($(this).index()).show().siblings('.formSwitchBox').hide();
                    // console.log($(this).text())
                    if($(this).text()==='修改密码'){
                        $('.changText').text('修改密码')
                    }else {
                        $('.changText').text('修改手机号')
                    }
                });
                //修改密码----获取验证码接口

                $('.codeOne').click(function () {
                    var mobile = $('.mobile').val();
                    if(mobile==""){
                        layer.alert("请输入手机号码！");
                        return;
                    }
                    if($(this).attr("data-type")=="true"){
                    
                        var json={ "mobile": mobile, "type": 2}
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
                                        // layer.alert("验证码发送成功！");

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
                                                $('.codeOne').attr('data-type', 'true');
                                                $('.codeOne').css({
                                                    "backgroundColor":"#dc2726",
                                                    "cursor":"pointer",
                                                    "font-size":"10px",
                                                    "text-align":"center",
                                                    "border":"gray",
                                                    "color":"white",
                                                });
                                                $('.codeOne').html('获取验证码');
                                            } else {
                                                t--;
                                                $('.codeOne').attr('data-type', 'false');
                                                $('.codeOne').css({
                                                    "backgroundColor":"gray",
                                                    "cursor":"auto",
                                                });
                                                $('.codeOne').html(t + 's后重新发送...');
                                            }
                                        }, 1000);
                                        // $('.codeOne').attr("data-type","false")
                                        return;
                                    }else{
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
                $page.methods.changePass();
                //修改手机号码提交----获取验证码接口；
                $('.codeTwo').click(function () {
                    var newMobile = $('.newMobile').val();
                    if(newMobile.trim()==""){
                        layer.alert("请输入新手机号码！");
                        return;
                    }
                    if($(this).attr("data-type")=="true"){
                        var json={ "mobile": newMobile, "type": 1}
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
                                    if (Response.rspCode == "1001") {
                                        layer.alert(Response.rspDesc);
                                    }else {
                                        // layer.alert("验证码发送成功！");

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
                                                $('.codeTwo').attr('data-type', 'true');
                                                $('.codeTwo').css({
                                                    "backgroundColor":"#dc2726",
                                                    "cursor":"pointer",
                                                    "font-size":"10px",
                                                    "text-align":"center",
                                                    "border":"gray",
                                                    "color":"white",

                                                });
                                                $('.codeTwo').html('获取验证码');
                                            } else {
                                                t--;
                                                $('.codeTwo').attr('data-type', 'false');
                                                $('.codeTwo').css({
                                                    "backgroundColor":"gray",
                                                    "cursor":"auto",
                                                });
                                                $('.codeTwo').html(t + 's后重新发送...');
                                            }
                                        }, 1000);
                                        // $('.codeTwo').attr("data-type", "false")
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
                $page.methods.changeMobile();
            },
            changePass: function () {
                //修改密码提交；
                $('.changPasswordBtn').click(function () {
                    //修改密码接口
                    var mobile = $('.mobile').val();
                    var code = $('.code').val();
                    var newPassword = $('.newPassword').val();
                    if(mobile.trim()==""){
                        layer.alert("请输入手机号码！");
                        return;
                    }else if(code.trim()=="") {
                        layer.alert("请输入验证码！");
                        return;
                    }if(newPassword.trim()=="") {
                        layer.alert("请输入新密码！");
                        return;
                    }
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "account/updPwd", //绝对路径
                        data: {
                            token: sessionStorage.getItem('token'), pwd: newPassword, mobile: mobile, code: code,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            // console.log(Response);
                            if (Response.rspCode == "0000") {
                                layer.alert("修改密码成功！");
                                $('.codeOne').attr("data-type","true")
                                window.location.href = "main_personal_center_home.html";
                            } else {
                                $('.codeOne').attr("data-type","true")
                                layer.alert(Response.rspDesc);
                            }
                        },
                        error: function () {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                });
            },
            changeMobile: function () {
                //修改手机号码提交；
                $('.changMobileBtn').click(function () {
                    //修改手机号码接口
                    var newMobile = $('.newMobile').val();
                    var newCode = $('.newCode').val();
                    var password = $('.password').val();
                    if(newMobile.trim()==""){
                        layer.alert("请输入新手机号码！");
                        return;
                    }else if(newCode.trim()=="") {
                        layer.alert("请输入验证码！");
                        return;
                    }if(password.trim()=="") {
                        layer.alert("请输入登录密码！");
                        return;
                    }else{
                        $.ajax({
                            type: "POST", //提交方式
                            url: root_path + "account/updMobile", //绝对路径
                            data: {
                                token: sessionStorage.getItem('token'), pwd: password, newmobile: newMobile, code: newCode,
                            }, //数据，这里使用的是Json格式进行传输
                            dataType: 'json',
                            success: function (Response) {
                                // console.log(Response);
                                if (Response.rspCode == "0000") {
                                    layer.alert("修改手机号码成功！");
                                    $('.codeTwo').attr("data-type","true")
                                    window.location.href = "main_personal_center_home.html";
                                } else {
                                    $('.codeTwo').attr("data-type","true")
                                    layer.alert(Response.rspDesc);
                                }
                            },
                            error: function() {
                                layer.alert("服务器异常，请稍后处理！");
                            }
                        });
                    }
                });
            }
        };
        return $page.methods;
    };
})(jQuery);