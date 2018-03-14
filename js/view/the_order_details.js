// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.LoadContent();
            },
            LoadContent: function () {
                var Id = GetQueryString('id');
                // console.log(Id)
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };
                $.ajax({
                    cache: "False",
                    type: "POST", //提交方式
                    url: root_path + "payment/getTradeDetail", //绝对路径
                    data: {
                        token: sessionStorage.getItem('token'),
                        id: Id,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                    	// console.log(Response)
                        $('.orderBox').html('');
                        if (Response.rspCode == "0000") {
                            //console.log(Response);
                            //$('.succeedCarR').html("");
                            var data = Response.data;
                            //console.log(data)
                            //取到的毫秒转化为年月日
                            var time = data.time;
                            var Year = new Date(time).getFullYear();
                            var Month = new Date(time).getMonth() + 1;
                            var Day = new Date(time).getDate();
                            if (Month < 10) {
                                Month = '0' + Month;
                                //Month < 10 ? '0' + Month; Month
                            }
                            if (Day < 10) {
                                Day = '0' + Day;
                            }
                            //判断状态   1:未付款,2:待收货,3:付款失败（不显示）,4:已确认收货未评价,5:已评价
                            var temp= data.status;
                                	var strb;
                                	var b,c;
                                	if(temp==1 || temp==2 ){
                                		strb="未完成";
                                		b="none";
                                		c="block";	
                                	}else if(temp==4){
                                		strb="已完成";
                                		b="block";
                                		c="none";
                                	}else if(temp==5){
                                        strb="已完成";
                                        b="none";
                                        c="none";
                                    };
                                	//去掉显示中的指导价
                                     //    var carInformation= data.detailList[0].name;
                                     //    carInformation=carInformation.split(" ");
                                     //    var lenth=carInformation.length;
                                     //    carInformation=carInformation.slice(0,lenth-1);
                                     //    carInformation       = carInformation.join(" ")
                                      data.detailList[0].img=data.detailList[0].img?data.detailList[0].img:'imgs/sell.png'
                                     var productT ='<p>车辆信息：<span>' +data.detailList[0].name+'</span></p>'+
                                '<p>数量：<span>' +data.detailList[0].num + ' '+ "辆"+'</span></p>'+
                                '<p>实付：<span class="money">￥'  + data.detailList[0].pricereal+''+"元"+'</span></p>'+
                                '<p>订单编号：<span>' + data.id + '</span></p>'
                                +'<p>付款时间：<span>'+ Year + '-' + Month + '-' + Day + '</span></p>'
                                +'<p>订单状态：<span class="State'+data.orderstatus+'">' + strb+ '<span></p>'
                                         //去掉订单中的指导价
                                // +'<p>指导价：<span class="money">￥' + data.detailList[0].guideprice + ''+ "万"+'</span></p>'
                                +'<p>收件人：<span>' + data.receiver + '</span></p>'
                                +'<p>联系电话：<span>' + data.mobile + '</span></p>'
                                +'<button uid='+ data.id +' style="display:'+b+';" class="commentNews">评价</button>'
                                +'<button uid='+ data.id +' style="display:'+c+';"class="ConfirmGoods">确认收货</button>'
                            $('.orderBox').append(productT);

                        } else {
                             layer.alert(Response.rspDesc);
                        }
                        $page.methods.clickBtn();
                    },
                    error: function() {
                         layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },
            clickBtn: function () {
                //付款；
                $('.payFor').click(function () {
                    var uid = $(this).attr('uid');
                    var num = $(this).siblings('.orderBox').find('.num').html();
                    //alert(uid+'----'+num);
                    window.location.href = "pay_in_advance.html?id=" + uid + '&ints=' + num;
                });
                //点击确认收货；
                $('.ConfirmGoods').click(function () {
                    var uid = $(this).attr('uid');
                    $.ajax({
                        cache: "False",
                        type: "POST", //提交方式
                        url: root_path + "payment/confirmTrade", //绝对路径
                        data: {
                            token: sessionStorage.getItem('token'),
                            id: uid,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {
                                //console.log(Response);
                                var data = Response.data;
                            } else {
                                 layer.alert(Response.rspDesc);
                            }
                            window.location.href = "my_order.html";
                        },
                        error: function() {
                             layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                });
                //评价；
                $('.commentNews').click(function () {
                    var uid = $(this).attr('uid');
                    var num = $(this).siblings('.orderBox').find('.num').html();
                    console.log(uid);
                    window.location.href = "comment.html?id=" + uid + '&ints=' + num;
                });
            }
        };
        return $page.methods;
    };
})(jQuery);