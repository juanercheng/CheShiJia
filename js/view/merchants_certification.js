// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                sessionStorage.removeItem("img1");
                sessionStorage.removeItem("img2");
                sessionStorage.removeItem("img3");
                sessionStorage.removeItem("img4");
                sessionStorage.removeItem("img5");
                //获取规格等信息；
                this.upLoadImg();
                this.personSubmit();
            },
            upLoadImg: function () {
                var token = sessionStorage.getItem('token');//token

                //上传身份证正面图片；
                $('#carIdImg').change(function () {
                    var img_src = $(this).next();
                    picture(img_src, $("#frmCarId"),"img1");
                });
                $('#carIdImgT').change(function () {
                    var img_src = $(this).next();
                    picture(img_src, $("#car_reverse"),"img2");
                });
                $('#fileImg').change(function () {
                    var img_src = $(this).next();
                    picture(img_src, $("#business_license"),"img3");
                    return;
                });
                // $('#fileImgTwo').change(function () {
                //     var img_src = $(this).next();
                //     picture(img_src, $("#revenue"),"img4");
                //     return;
                // });
                // $('#fileImgThree').change(function () {
                //     var img_src = $(this).next();
                //     picture(img_src, $("#enterprise"),"img5");
                //     return;
                // });
                function picture(picurl, _form,img_num) {
                    console.log(typeof($("#frmCarId")))
                    console.log(picurl)
                    _form.ajaxSubmit({
                        type: "POST", //提交方式
                        url: root_path + "common/uploadImage?token=" + sessionStorage.getItem("token") + "&type=" + 2,
                        data: {}, //数据，这里使用的是Json格式进行传输
                        dataType: 'file',
                        dataType: 'text',
                        success: function (Response) {
                            // console.log(Response)
                            var Response = $.parseJSON(Response);
                            // console.log(Response)
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
                   // var idcard = $('.idCard').val();//身份证号
                    var test = /^\d{18}|\d{17}X$/;
                    var idlicenceorg = $('.idlicenceorg').val();//发证机关
                    var idvalidity = $('.idvalidity').val();//有效期
                    var img4 = sessionStorage.getItem('img1');
                    var img5 = sessionStorage.getItem('img2');
                    var img6 = sessionStorage.getItem('img3');
                    console.log(img4+"---"+img5)
                    //console.log(idcard)
//                  if(idcard!=""){
//                      if(!/^\d{18}|\d{17}X$/.test(idcard)){
//                           layer.alert("请输入正确的身份证号！");
//                          return;
//                      }
//                  }
//                  if(idcard.trim()==""&&idlicenceorg.trim()==""&&idvalidity.trim() ==""||img4==null&&img5==null){
//                       layer.alert("请至少上传身份证正反面照片或者填写身份证信息！");
//                      return;
//                  }
					if(img4==null){
                       alert("请上传身份证正面照片！");
                      return;
                    }
                    if(img5==null){
                        alert("请上传身份证反面照片！");
                        return;
                    }
                    if(img6==null){
                        alert("请上传营业执照照片！");
                        return;
                    }
                    //认证接口
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "account/applyCert", //绝对路径
                        data: {
                            token: sessionStorage.getItem("token"),
                            img1: sessionStorage.getItem('img3'),
                            img2: sessionStorage.getItem('img4'),
                            img3: sessionStorage.getItem('img5'),
                            img4: img4,
                            img5: img5,
                            //idcard: idcard,
                            //idcardlicenceorg: idlicenceorg,
                            //idcardvalidity: idvalidity,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            // console.log(Response);
                            if (Response.rspCode == "0000") {
                                var data = Response.data;
                                //data.grade;
                                //data.mobile;
                                //data.name;
                                //data.photourl;
                                //data.token;
                                window.location.href = "main_personal_center_home.html";
                                 layer.alert("已提交申请！");
                            } else {
                                 layer.alert(Response.rspDesc);
                            }
                            //成功后跳转至个人中心页面；
                            $page.methods.certificatedInformation();
                        },
                        error: function() {
                             layer.alert("服务器异常，请稍后处理！")
                        }
                    });
                });
            },
        };
        return $page.methods;
    };
})(jQuery);
    
    
    
    
    