// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                //获取规格等信息；
                this.personSubmit();
                this.upLoadImg();
                this.personInfo();
            },
            upLoadImg: function () {
                var token = sessionStorage.getItem('token');//token
                //上传图片；
                $('.addImgClick').click(function () {
                    $('#fileImg').click();
                });

                $('#fileImg').change(function () {
                    var imgSrc = $('#fileImg').val();
                    $("#frm").ajaxSubmit({
                        type: "POST", //提交方式  
                        url: root_path + "common/uploadImage?token=" + sessionStorage.getItem("token") + "&type=" + 1,
                        data: {
                            token: sessionStorage.getItem("token"), type: 1,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'file',
                        dataType: 'text',
                        success: function (Response) {
                            var Response = $.parseJSON(Response);
                            if (Response.rspCode == "0000") {
                                var data = Response.data;
                                $('.personImgBox').html('');
                                $('.personImgBox').append('<img class="personImg" src='+data.pathurl+'>');
                            } else {
                                layer.alert(Response.rspDesc);
                            }
                            $page.methods.personSubmit(data.pathid);
                        },
                        error: function() {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                });
            },
            personInfo:function () {
                //查询会员资料接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "account/getMember", //绝对路径
                    data: {
                        token: sessionStorage.getItem("token")
                    },
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            console.log(Response);
                            $('.userName').val(Response.data.name);
                            $('.corporate').val(Response.data.companyName);
                            $('.personImgBox img').attr('src',Response.data.photourl)
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },
            personSubmit: function (xl) {
                //个人信息提交
                $('.upBtn').click(function () {
                	//陈甲佳2017-8-17
                    var name = $('.userName').val();
                    //2017-8-17陈甲佳
                    var Cpyname=$(".corporate").val();
                    if(!name){
                        alert('姓名不能为空！');
                        return
                    }
                    if(!Cpyname){
                        alert('公司名称不能为空！');
                        return
                    }
                    //修改会员资料接口
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "account/updMember", //绝对路径
                        data: {
                            token: sessionStorage.getItem("token"), name: name, pathid: xl,companyName:Cpyname,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {
                                console.log(Response);
                                var data = Response.data;
                                console.log(data.photourl)
                                $(".personImg").attr("src", data.photourl)
                                $('.personName').html(data.name);
                                $('.resultText').html(data.grade);
                                sessionStorage.setItem('grade', data.grade);
                                sessionStorage.setItem('name', data.name);
                                //成功后跳转至个人中心页面；
                                window.location.href = "main_personal_center_home.html";
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
    
    
    
    
    