/**
 * Created by Administrator on 2017/8/22.
 */
// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                //1为寻车 2为资源(标题文字区分)
                var authNum = GetQueryString('authNum');
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };
                if(authNum=="1"){
                    $(".detailTitle span:first-child").text("我要寻车");
                }else if(authNum=="2"){
                    $(".detailTitle span:first-child").text("发布车源");
                }
                sessionStorage.removeItem("img1");
                sessionStorage.removeItem("img2");
                sessionStorage.removeItem("img3");
                //获取图片信息；
                this.upLoadImg();
                this.personSubmit();
            },
            upLoadImg: function () {
                var token = sessionStorage.getItem('token');//token

                //change事件触发条件1.失去焦点 2.内容改变
                //上传身份证正面图片；
                $('#carIdImg').change(function () {
                    var img_src = $(this).next();
                    picture(img_src, $("#frmCarId"),"img1");
                });
                //上传身份证反面图片；
                $('#carIdImgT').change(function () {
                    var img_src = $(this).next();
                    picture(img_src, $("#car_reverse"),"img2");
                });
                //上传营业执照图片
                $('#fileImg').change(function () {
                    var img_src = $(this).next();
                    picture(img_src, $("#business_license"),"img3");
                    return;
                });
                function picture(picurl, _form,img_num) {
                    _form.ajaxSubmit({
                        type: "POST", //提交方式
                        url: root_path + "common/uploadImage?token=" + sessionStorage.getItem("token") + "&type=" + 2,
                        data: {}, //数据，这里使用的是Json格式进行传输
                        success: function (Response) {
                            var Response = $.parseJSON(Response);
                            console.log(Response)
                            if (Response.rspCode == "0000") {
                                var data = Response.data;
                                picurl[0].src = data.pathurl;
                                sessionStorage.setItem(img_num, data.pathid);
                            } else {
                                layer.alert(Response.rspDesc);
                            }
                        },
                        error: function() {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                }
            },
            personSubmit: function () {
                //商家认证信息提交
                $('.personBtn').click(function () {
                    var img1 = sessionStorage.getItem('img1');
                    var img2 = sessionStorage.getItem('img2');
                    var img3 = sessionStorage.getItem('img3');
                    if(img1==null){
                        layer.alert("请上传身份证正面照片！");
                        return;
                    }
                    if(img2==null){
                        layer.alert("请上传身份证反面照片！");
                        return;
                    }
                    if(img3==null){
                        layer.alert("请上传营业执照！");
                        return;
                    }
                    //img1.营业执照  img4.身份证正面 img5：身份证反面
                    //认证接口
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "account/applyCert",
                        data: {
                            token: sessionStorage.getItem("token"),
                            img4: sessionStorage.getItem('img1'),
                            img5: sessionStorage.getItem('img2'),
                            img1: sessionStorage.getItem('img3'),
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            // console.log(Response);
                            if (Response.rspCode == "0000") {
                                sessionStorage.removeItem("img1");
                                sessionStorage.removeItem("img2");
                                sessionStorage.removeItem("img3");
                                window.location.href = "main_personal_center_home.html";
                                layer.alert("已提交申请！");
                            } else {
                                layer.alert(Response.rspDesc);
                            }
                        },
                        error: function() {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                });
            },
        };
        return $page.methods;
    };
})(jQuery);




