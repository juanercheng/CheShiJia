// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.supplyTheDetails();
            },
            supplyTheDetails: function () {
                var imgId = GetQueryString('id');
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };
                //车型详情接口
                $.ajax({
                    cache: "False",
                    type: "POST", //提交方式
                    url: root_path + "market/getSaleCarDetail", //绝对路径
                    data: {
                        id: imgId,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            // console.log(Response);
                            $('.informationBox').html("");
                            var data = Response.data;
                            //取到的毫秒转化为年月日
                            var time = data.time;
                            var Year = new Date(time).getFullYear();
                            var Month = new Date(time).getMonth() + 1;
                            var Day = new Date(time).getDate();
                            if (Month < 10) {
                                Month = '0' + Month;
                            }
                            if (Day < 10) {
                                Day = '0' + Day;
                            }
                            var productT = '<div class="informationCar">\
                                                            <p class="model">' + data.name + '</p>\
                                                            <p class="dateColor"><span>' + data.color1 + "/" + data.color2 + '</span>\
                                                                                 <span>' + Year + "-" + Month + "-" + Day + '</span></p>\
                                                            <p class="address">卖' + data.addressto + '</p>\
                                                        </div>\
                                                        <div class="informationContent">\
                                                            <p>期望区域：<em>' + data.addressto + '</em></p>\
                                                            <p>提车时间：<em>' + data.carstatus + '</em></p>\
                                                            <p>期望成交价：<span>电议</span>（指导价' + data.price + '万）</p>\
                                                            <p class="tel">联系电话：<em style="color: orange;">400-886-8196</em></p>\
                                                            <p>备注：' + data.remark + '</p>\
                                                        </div>';
                            $('.informationBox').append(productT);
                        } else {
                             layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                         layer.alert("服务器异常，请稍后处理！");
                    }
                });
            }
        };
        return $page.methods;
    };
})(jQuery);


    
    
    
    
    
    
    
    
    