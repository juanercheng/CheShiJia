/**
 * Created by Administrator on 2017/8/3.
 */
(function($){
    $.page = function(){

        var $page = {};
        var payType = parseInt(GetQueryString('payType'));
        var imgId = GetQueryString('id');
        // var ints = GetQueryString('ints');
        var orderId = GetQueryString('orderId');
        //获取URL地址参数
        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        };
        $page.methods = {
            init:function(){
                this.getIndex();
                this.massageCode();
                this.dredgeAjax();
                this.wechatPay();
            },

            //页面显示和跳转
                getIndex:function(){
                $page.methods.getOrderAjax(orderId,imgId);
                //页面跳转显示
                $(".showIndex").hide();
                switch (payType){
                    // case 2:
                    //     $(".aliPay").show();
                    //     break;
                    case 3:
                     $(".wechatPay").show();
                        break;
                    // case 1:
                    //     $(".unionPay").show();
                    //     $(".payCard button").click(function(){
                    //         $(".showIndex").hide();
                    //         $(".addCard").show();
                    //     });
                    //     break;
                    default:
                        break;
                }
                //返回按钮
                $(".goBack").click(function(){
                    window.location.href = "pay_in_advance.html?id="+imgId;
                });

                //其他支付方式
                $(".payBtm p span").click(function(){
                   var dataId = parseInt($(this).attr("data-id"));
                    $(".showIndex").hide();
                    switch (dataId){
                        case 0:
                            $(".aliPay").show();
                            break;
                        case 1:
                            $(".wechatPay").show();
                            break;
                        case 2:
                            $(".unionPay").show();
                            $(".payCard button").click(function(){
                                $(".showIndex").hide();
                                $(".addCard").show();
                            })
                            break;
                        case 3:
                            $(".addCard").show();
                            break;
                        default:
                            break;
                    }
                });
            },
            //微信支付请求
            wechatPay:function (orderId,imgid) {

            },


            getOrderAjax:function(orderId,imgid){
                $.ajax({
                    url:root_path+"payment/getTradeDetail",
                    type:"POST",
                    dataType:"json",
                    data:{
                        token:sessionStorage.getItem("token"),
                        id:orderId
                    },
                    success:function(Response){
                        var totalprice = Response.data.totalprice;
                        $(".OrderId").text(orderId);
                        $(".orderPrice").text(totalprice);
                        for (var i in Response.data.detailList){
                            id=Response.data.detailList[0].id
                        }
                        //微信支付
                        $.ajax({
                            type: "POST", //提交方式
                            url: root_path + "payment/notifyWeixinPaymentPc", //绝对路径
                            data: {
                                token: sessionStorage.getItem('token'),
                                code: orderId,
                                id: imgId,
                                money: Response.data.totalprice,

                            }, //数据，这里使用的是Json格式进行传输
                            dataType: 'json',
                            success: function (Response) {
                               console.log(Response.data);
                                var codeurl=Response.data.code_url;
                                // console.log(codeurl);
                                var options={};
                                options.url=codeurl; //二维码的链接
                                options.dom="#code";//二维码生成的位置
                                options.image=$('#img-buffer');//图片id
                                options.render="image";//设置生成的二维码是canvas格式，也有image、div格式

                                xyqrcode(options);
                                function xyqrcode(options){
                                    var settings = {
                                        dom:'',
                                        render: 'canvas',   //生成二维码的格式还有image、div
                                        ecLevel:"H",
                                        text:"",
                                        background:"#ffffff",
                                        fill:"#333333", //二维码纹路的颜色
                                        fontcolor:"#ff9818",
                                        fontname:"Ubuntu",
                                        image:{},
                                        label:"",
                                        mPosX:0.5,   //图片在X轴的位置
                                        mPosY:0.5,    //图片在X轴的位置
                                        mSize:0.27,   //图片大小
                                        minVersion:10,
                                        mode:4,
                                        quiet:1,
                                        radius:1,
                                        size:400
                                    };
                                    if (options) {
                                        $.extend(settings, options);//options对象跟settings比较，相同的就替换，没有的就添加

                                    }


                                    // if(settings.dom.length==0){
                                    //     window.console.log("Error: dom empty!");
                                    //     return;
                                    // }
                                    // if(settings.url.length==0){
                                    //     window.console.log("Error: url empty!");
                                    //     return;
                                    // }
                                    settings.text=settings.url; //在qrcode生成二维码的地址是text。这里就把url赋值给text
                                    $(settings.dom).qrcode(settings);

                                };

                                //15分钟取消订单

                                var t = 0,
                                    n = 0;
                                var time = setInterval(function() {
                                    if(t == 0) {
                                        if(n == 1) {
                                            // 终止循环
                                            clearInterval(time);
                                            $('.payTime').remove();
                                            layer.open({
                                                content:"支付已超时，请重新下单！",
                                                yes: function(index, layero){
                                                    window.location.href="pay_in_advance.html?id="+imgId;
                                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                                }
                                            });
                                        }
                                        t = 900;
                                        // 这个N是循环开关
                                        n = 1;
                                    } else {
                                        t--;
                                        // $('.codeOne').attr('data-type', 'false');
                                        $('.payTime').html('('+t + 's'+')');
                                    }
                                }, 1000);





                            },
                            error: function () {
                                layer.alert("服务器异常，请稍后处理！");
                            }
                        });

                        //支付接口
                        $.ajax({
                            url:root_path+"payment/addTradeOnlinePayment",
                            type:"POST",
                            dataType:"json",
                            data:{
                                token:sessionStorage.getItem("token"),
                                code:orderId,
                                type:payType,
                                id:imgid,
                                money:totalprice
                            },
                            success:function(Response){
                                var data=Response;
                            }
                        })


                    }
                });


            },

            //"新卡支付"获取验证码(接口不存在)
            // massageCode:function(){
            //     $('.getCode').click(function () {
            //         var cardNum = $(".cardNum").val();
            //         var cardPwd = $(".cardPwd").val();
            //         var telNum = $(".telNum").val();
            //         if(cardNum.trim()==""){
            //             layer.alert("请输入银行卡号！");
            //             return;
            //         }
            //         if(cardPwd.trim()==""){
            //             layer.alert("请输入银行卡密码！");
            //             return;
            //         }
            //         if(telNum.trim()==""){
            //             layer.alert("请输入银行预留手机号！");
            //             return;
            //         }
            //         var mobile_reg = new RegExp(/^1[3-9]\d{9}$/);
            //         if(!mobile_reg.test(telNum)){
            //             layer.alert("手机号输入不正确！");
            //             return;
            //         }
            //         if($(this).attr("data-type")=="true"){
            //             $.ajax({
            //                 type: "POST", //提交方式
            //                 url: root_path + "account/getMobileCode", //绝对路径
            //                 data: {
            //                     mobile: telNum, type: 2,
            //                 }, //数据，这里使用的是Json格式进行传输
            //                 dataType: 'json',
            //                 success: function (Response) {
            //                     // console.log(Response);
            //                     if (Response.rspCode == "0000") {
            //                         var t = 0,
            //                             n = 0;
            //                         var time = setInterval(function() {
            //                             if(t == 0) {
            //                                 if(n == 1) {
            //                                     // 终止循环
            //                                     clearInterval(time);
            //                                 }
            //                                 t = 60;
            //                                 // 这个N是循环开关
            //                                 n = 1;
            //                                 $('.getCode').attr('data-type', 'true');
            //                                 $('.getCode').css({
            //                                     "backgroundColor":"white",
            //                                     "color":"#dc2827",
            //                                     "cursor":"pointer",
            //                                 });
            //                                 $('.getCode').html('获取验证码');
            //                             } else {
            //                                 t--;
            //                                 $('.getCode').attr('data-type', 'false');
            //                                 $('.getCode').css({
            //                                     "backgroundColor":"#dc2827",
            //                                     "color":"white",
            //                                     "cursor":"auto",
            //                                 });
            //                                 $('.getCode').html(t + 's后重新发送...');
            //                             }
            //                         }, 1000);
            //                     } else {
            //                         layer.alert(Response.rspDesc);
            //                     }
            //                 },
            //                 error: function () {
            //                     layer.alert("服务器异常，请稍后处理！");
            //                 }
            //             });
            //         }
            //     });
            // },

            //"开通并支付"按钮点击事件
            // dredgeAjax:function(){
            //   $(".dredge").click(function(){
            //       var cardNum = $(".cardNum").val();
            //       var cardPwd = $(".cardPwd").val();
            //       var telNum = $(".telNum").val();
            //       var codeNum = $(".codeNum").val();
            //       if(cardNum.trim()==""){
            //           layer.alert("请输入银行卡号！");
            //           return;
            //       }
            //       if(cardPwd.trim()==""){
            //           layer.alert("请输入银行卡密码！");
            //           return;
            //       }
            //       if(telNum.trim()==""){
            //           layer.alert("请输入银行预留手机号！");
            //           return;
            //       }
            //       var mobile_reg = new RegExp(/^1[3-9]\d{9}$/);
            //       if(!mobile_reg.test(telNum)){
            //           layer.alert("手机号输入不正确！");
            //           return;
            //       }
            //       if(codeNum.trim()==""){
            //           layer.alert("请输入验证码！");
            //           return;
            //       }
            //       if(!$(".checkbox_one").prop("checked")){
            //           layer.alert("请勾选同意书！");
            //           return;
            //       }
            //       console.log("条件符合，可开通");
            //       //记住卡号
            //       if($(".checkbox_two").prop("checked")){
            //
            //       }
            //       //执行开通支付功能
            //   })
            // },



        };
        //返回
        $('.detailTitle span:first-of-type').click(function () {
            window.location.href = "main_ultra_low_purchase.html";


        })
        $('.detailTitle span:nth-of-type(3)').click(function () {
          // window.location.herf="product_details.html?id="+imgId;
            window.history.back(-2);
        })
        $('.detailTitle span:nth-of-type(5)').click(function () {
            window.location.href = "pay_in_advance.html?id="+imgId+'&payType='+'type';


        })


        //银联用户协议链接
        $('.unionpayaGreement').click(function () {
            window.location.herf="unionagreement.html";
        });
        return $page.methods;
    }
})(jQuery)