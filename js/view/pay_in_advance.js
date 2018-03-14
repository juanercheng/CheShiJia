// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        //支付方式
        var payType;
        $page.methods = {

            init: function () {
                if (sessionStorage.getItem('token') == null) {
                    layer.open({
                        content: '请登录！',
                        yes: function(index, layero){
                            window.location.href = "log_in.html";
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                } else {
                    this.registerAccount();
                    //清空支付方式

                }
                ;
                //支付跳转
                // $page.methods.pay();
            },


            //购物清单
            registerAccount: function () {
                var imgId = GetQueryString('id');
                sessionStorage.setItem('carId',imgId);
                var payWay=GetQueryString('payType');


                var ints =1
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };

                //订单车型列表


                    $.ajax({
                        cache: "False",
                        type: "POST", //提交方式
                        url: root_path + "car/getCarDetail", //绝对路径
                        data: {
                            id: imgId,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {
                                $('.failureCar').html("");
                                var data = Response.data;
                                var adprice = data.adprice;
                                var carName=data.name;
                                var content=data.specifications+' '+data.starlevelname+' '+data.carstatus;
                                if (data.imagePath == "") {
                                    data.imagePath = "./imgs/sell.png";
                                }
                                var productT =
                                    "<div class='failureCarImg'>" +
                                    " <img src='" + data.imagePath + "'>" +
                                    "</div>"+
                                    "<div class='failureCarR'>" +
                                    "<p>" + data.name + "<span>" + data.price + "万</span></p>" +
                                    "<p>" +
                                    "<span>" + data.color1 + "/" + data.color2 + "</span>" +
                                    "<span>" + data.carstatus + "</span>" +
                                    "<span>" + data.addressto + "</span>" +
                                    "<span>x1</span>" +
                                    "</p>" +
                                    "</div>";
                                $('.failureCar').append(productT);
                                $('.paymentMoney em').html(data.adprice);
                                $(".paymentMethod p span").click(function () {
                                    $('.paymentMethod p span').css({
                                        "background": "white",
                                        "color": "black"
                                    });
                                    $(this).css({
                                        "background": "#dd2a26",
                                        "color": "white"
                                    })
                                })
                                $.ajax({
                                    type: "POST",
                                    catch: "false",
                                    dataType: "json",
                                    url: root_path + "payment/addTradeOnline",
                                    data: {
                                        token: sessionStorage.getItem("token"),
                                        type: payType,
                                        id: imgId,
                                        num: 1,
                                        money: adprice,
                                        // invoiceType: invoiceType,
                                    },
                                    dataType: "json",
                                    success: function (Response) {
                                        if (Response.rspCode == "0000") {
                                            // console.log(Response.data)
                                            var orderId = Response.data.id;

                                            //form表单数据
                                            $('#WIDout_trade_no').val(orderId);
                                            $('#WIDsubject').val(carName);
                                            $('#WIDtotal_amount').val(adprice);
                                            $('#WIDbody').val(content);

                                        }else {
                                            layer.alert(Response.rspDesc);
                                        }
                                    }
                                })


                                $page.methods.pay(adprice);
                            } else {
                                layer.alert(Response.rspDesc);
                            }
                        },
                        error: function () {
                            layer.alert("服务器异常，请稍后处理！");
                        }

                    });


                setTimeout(function () {
                    if(payWay){
                        if( sessionStorage.getItem('checkPay')==="2"){
                            $(".paymentMethod p .zfb").addClass('activeSpan')
                            payType = 2;
                        }else if(sessionStorage.getItem('checkPay')==='3') {
                            $(".paymentMethod p .wei").addClass('activeSpan')
                            payType = 3;
                        }else if(sessionStorage.getItem('checkPay')==='1'){
                            $(".paymentMethod p .yin").addClass('activeSpan')
                            payType = 1;
                        }else if(sessionStorage.getItem('checkPay')==='4'){
                            $(".paymentMethod p .xin").addClass('activeSpan')

                        }
                    }

                },200)
            },

            //支付跳转
            pay: function (adprice) {
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };
                var imgId = GetQueryString('id');
                var ints = 1;
                // console.log(ints)
                var index = 0;

                $(".paymentMethod p span").click(function () {
                    index = $(this).index();

                    switch (index) {
                        case 0:
                            payType = 2;
                            sessionStorage.setItem('checkPay',2)
                            $('#payType').val(2)
                            break;
                        case 2:
                            payType = 3;
                            sessionStorage.setItem('checkPay',3)
                            $('#payType').val(3)
                            break;
                        case 4:
                            payType = 1;
                            sessionStorage.setItem('checkPay',1)
                            $('#payType').val(1)
                            break;
                        case 6:
                            payType = 4;
                            sessionStorage.setItem('checkPay',4)
                            $('#payType').val(4)
                            break;
                        default:
                            break;
                    }

                });


                $(".paymentBtn button").click(function () {
                    if($('#payType').val()==='') {
                        layer.alert("请选择支付方式！");
                        return false;
                    }
                    //支付宝支付

                    if(payType===2){
                        $('form').attr({
                            'action':'http://114.215.84.189:8085/cheshijia/alipay/alipay.trade.page.pay.jsp',
                        });
                        $('#submit').click()
                    }else {
                        $('form').removeAttr('action')
                        $('form').removeAttr('name')
                        $('form').removeAttr('method')

                    }
                    //微信支付/银联支付：
                    if(payType === 3){
                            $.ajax({
                                type: "POST",
                                catch: "false",
                                dataType: "json",
                                url: root_path + "payment/addTradeOnline",
                                data: {
                                    token: sessionStorage.getItem("token"),
                                    type: payType,
                                    id: imgId,
                                    num: 1,
                                    money: adprice,
                                    // invoiceType: invoiceType,
                                },
                                dataType: "json",
                                success: function (Response) {
                                    if (Response.rspCode == "0000") {
                                        // console.log(Response.data)
                                        console.log(Response.data.id)
                                        var orderId = Response.data.id;
                                        sessionStorage.setItem('orderId',orderId);
                                        window.location.replace("pay_card.html?id="+imgId+"&payType=3"+"&orderId="+orderId);
                                    }else {
                                        layer.alert(Response.rspDesc);
                                    }
                                }
                            })


                        // window.location.herf = "pay_card.html?id="+imgId+"&payType="+payType+"&orderId="+orderId;
                    }
                    //线下支付：
                    if(payType === 1){
                        setTimeout(function () {
                            $.ajax({
                                type: "POST",
                                catch: "false",
                                dataType: "json",
                                url: root_path + "payment/addTradeOnline",
                                data: {
                                    token: sessionStorage.getItem("token"),
                                    type: payType,
                                    id: imgId,
                                    num: 1,
                                    money: adprice,
                                    // invoiceType: invoiceType,
                                },
                                dataType: "json",
                                success: function (Response) {
                                    if (Response.rspCode == "0000") {
                                        // console.log(Response.data)
                                        var orderId = Response.data.id;
                                        $.ajax({
                                            type: "POST", //提交方式
                                            url: root_path + "payment/addTradeOffline", //绝对路径
                                            data: {
                                                token: sessionStorage.getItem('token'),
                                                id: imgId,
                                                num: ints,
                                                money: adprice,
                                                code:orderId
                                                // invoiceType: invoiceType,//1公司 2个人
                                            }, //数据，这里使用的是Json格式进行传输
                                            dataType: 'json',
                                            success: function (Response) {
                                                // console.log(Response);
                                                if (Response.rspCode == "0000") {
                                                    //直接显示支付成功界面
                                                    window.location.href = "succeed.html?id="+imgId+"&state=1"+"&ints="+ints+"&orderId="+orderId;
                                                    // window.location.href = "pay_card.html?id="+imgId+"&ints="+ints+"&payType="+payType+"&orderId="+orderId;
                                                }else if(Response.rspCode === "1001"){
                                                    layer.open({

                                                        content: Response.rspDesc,
                                                        yes: function(index, layero){
                                                            window.location.href = "log_in.html";
                                                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                                                        }
                                                    });
                                                }else {

                                                    layer.alert(Response.rspDesc);
                                                }
                                            },
                                            error: function () {
                                                layer.alert("服务器异常，请稍后处理！");
                                            }
                                        });


                                    }else {
                                        layer.alert(Response.rspDesc);
                                    }
                                }
                            })

                        },200)

                    }
                    $(".detailInformation").click(function () {
                        // window.history.go(-1);
                        window.history.back(-1);

                    })  ;
                    $(".superLow").click(function () {
                        window.history.back(-2);
                    });

                });
            },

        };
        return $page.methods;
    };
})(jQuery);


    
    
    
    
    
    
    
    
    