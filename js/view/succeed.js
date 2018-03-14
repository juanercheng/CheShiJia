// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.registerAccount();
            },
            registerAccount: function () {
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };
                var imgId = GetQueryString('id');
                var ints = GetQueryString('ints');
                var state = GetQueryString('state');
                var orderId=GetQueryString('orderId');
                //首先判断是支付成功还是支付失败
                if(state=="1"){
                    //成功
                    $(".success").show();
                    $(".defeat").hide();
                }else{
                    //失败
                    $(".success").hide();
                    $(".defeat").show();
                }

                //车型详情接口
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
                            // console.log(Response);
                            $('.succeedCarR').html("")
                            var data = Response.data;
                            sessionStorage.setItem('orderId',data.servertime);
                            data.imagePath=data.imagePath?data.imagePath:'imgs/moren.png'
                            var productT = " <img src='" + data.imagePath + "'>" +
                                "<div class='failureCarR'>" +
                                "<p>" + data.name + "<span>" + data.price + "万</span></p>" +
                                "<p>" +
                                "<span>" + data.color1 + "/" + data.color2 + "</span>" +
                                "<span>" + data.carstatus + "</span>" +
                                "<span>" + data.addressto + "</span>" +
                                "<span>x" + ints + "</span>" +
                                "</p>" +
                                "</div>";
                            $('.succeedCarR').append(productT);
                        } else {
                             layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                         layer.alert("服务器异常，请稍后处理！");
                    }
                });
                //继续逛逛，跳转至首页；
                $('.continueBtn').click(function () {
                    window.location.href = "index.html";
                });
                //点击查看订单按钮，个人中心我的订单；
                $('.checkBtn').click(function () {

                    window.location.href = "the_order_details.html?id="+orderId;
                });
                //重新支付；
                $('.payAgain').click(function () {
                    window.location.href = "pay_in_advance.html?id"+imgId+"&ints="+ints;
                });
            }
        };
        return $page.methods;
    };
})(jQuery);


    
    
    
    
    
    
    
    
    