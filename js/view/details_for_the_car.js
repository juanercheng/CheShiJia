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
                    url: root_path + "market/getSearchCarDetail", //绝对路径
                    data: {
                        token: sessionStorage.getItem("token"),
                        id: imgId,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            console.log("详细信息")
                            console.log(Response.data);

                            var data=Response.data;
                            switch (data.feerule) {
                                case "优惠":
                                    var rulePriceTotal=Number(data.guideprice);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal-rulePriceTotal1).toFixed(2);
                                    break
                                case "下点":
                                    var rulePriceTotal=Number(data.guideprice);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=((rulePriceTotal*(1-(rulePriceTotal1*0.01))).toFixed(2));
                                    break
                                case "直接报价":
                                    var rulePriceTotal=Number(data.guideprice);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal1).toFixed(2);

                                    break
                                case "电议":
                                    var ruleStr = "";
                                    var priceTotal="0.00";

                                    break
                                case "加":
                                            var rulePriceTotal=Number(data.guideprice);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal+rulePriceTotal1).toFixed(2);

                                    break
                                default:
                                    break
                            }



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
                            var productT = "<div class='info findCarDetial'>" +
                                "<p>寻车详情</p>" +
                                "<div class='infoCar'>" +
                                "<p>" + data.name + "</p>" +
                                "<p class='shortInfo'>" +
                                "<span>" + data.specifications + "/" + data.carstatusname + "</span>" +
                                "<em></em>" +
                                "<span>" + data.color1 + "/" + data.color2 + "</span>" +
                                "</p>" +
                                "<p class='requireInfo'>" +
                                "</p>" +
                                "<p>提车时间：<em>" + data.getcartime+ "</em></p>" +
                                "<p>上牌地点：<em>" +data.licensearea + "</em></p>" +
                                "<p>提车区域：<em>" +data.addressto + "</em></p>" +
                                "<p>期望成交价：<em style='font-size: 17px'>" + priceTotal + "万</em></p>" +
                                    // style='font-weight: bold'
                                "<p>发布时间：<em>" + Year + "-" + Month + "-" + Day + "</em></p>" +
                                "<p>备注：<em >" + data.remark + "</em></p>" +
                                "</div>" +
                                "</div>" +
                                "<div class='info memberDetial'>" +
                                "<p>供应商信息</p>" +
                                "<div class='memberInfo'>" +
                                "<p>联系人：<em>" + data.membername + "</em></p>" +
                                "<p>公司名称：<em>" + data.companyName + "</em></p>" +
                                "<p>联系电话：<em>" + data.membermobile + "</em></p>" +
                                "</div>" +
                                "</div>";
                            $('.informationBox').append(productT);
                            //汽车要求(requirement)
                            var requirList = data.requirementname.split(",");
                            console.log(requirList);
                            for (var j = 0; j < requirList.length; j++) {
                                if (requirList != "" ) {
                                    var requirStr = "<span>" + requirList[j] + "</span>";
                                  var t=  $('.requireInfo').append(requirStr);
                                  console.log(t);
                                }
                            }
                            $(".compile").click(function () {
                                window.location.href = "main_find_car_want.html?id=" + data.id;
                            })
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            }
        };
        return $page.methods;
    };
})(jQuery);


    
    
    
    
    
    
    
    
    