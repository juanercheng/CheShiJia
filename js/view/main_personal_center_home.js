// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                if (sessionStorage.getItem('token') == null) {
                    layer.open({
                        content: "请登录",
                        yes: function(index, layero){
                            window.location.href = "log_in.html";
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }else{
                    this.HomeLoadJump();
                    $('.carBox').hlml("")
                }

            },
            HomeLoadJump: function (al) {
                //1.我的订单中点击查看跳转至订单详情；
                $('.myOrder button').click(function () {
                    window.location.href = "the_order_details.html";
                });
                //2.点击编辑到我的寻车编辑页面；
                //4.点击我的车源跳转至车源页面；
                $('.fourList button').click(function () {
                    window.location.href = "supply_the_details.html";
                });

                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "payment/getTradeList", //绝对路径
                    data: {
                        token: sessionStorage.getItem('token'),
                        type: 4,//全部订单
                        page:1,
                        rows:3
                    },
                    dataType: 'json',
                    success: function (Response) {
                        console.log(Response)
                        if (Response.rspCode == "0000") {
                            $('.carBox1').html('');
                            for (var i = 0; i < Response.data.tradeList.length; i++) {
                                var data = Response.data.tradeList[i];

                                data.detail.img=data.detail.img?data.detail.img:'imgs/moren.png'
                                var LiContent1='<li class="LIST-LI ">'
                                    +'<div class="Img">'
                                    +	'<img src="' + data.detail.img +'">'
                                    +'</div>'
                                    +'<div class="Information">'
                                    +	'<h2>'+data.detail.name+'</h2>'
                                    +	'<span>实付：<i>'+data.detail.pricereal+'</i>元</span>'
                                    +	'<h5>数量：'+data.detail.num+'</h5>'
                                    +'</div>'
                                    +'<div class="Check">'
                                    +	'<a href="###" class="lookOver"  uid=' + data.id + '>查看</a>'
                                    +'</div>'
                                    +'</li>'
                                $('.carBox1').append(LiContent1);
                            }
                            ;
                            //点击查看订单，跳转至订单详情页面；
                            $('.lookOver').click(function () {
                                var uid = $(this).attr('uid');
                                window.location.href = "the_order_details.html?id=" + uid;
                            });
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
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }

                });
                //我的寻车接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "market/getMySearchCarList", //绝对路径
                    data: {
                    	token: sessionStorage.getItem('token'),
                    	page:1,
                    	rows:3,
                    
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                    	//console.log(Response)
                        if (Response.rspCode == "0000") {
                       //   console.log(Response);
                            $('.carBoxOne').html('');
                            for (var i = 0; i < Response.data.searchList.length; i++) {
                                var data = Response.data.searchList[i];
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
                                var LiContent3='<li class="LIST-LI ">'
							        			+'<div class="Img">'
							        			+'<img  src=" '+ data.img +' " >'
							        			+'</div>'
							        			+'<div class="Information">'
							        			+	'<h2>'+data.name+'</h2>'
							        			+	'<span>' + Year + '-' + Month + '-' + Day + '</span>'
							        			+	'<h5>'+ data.color1 + '/' + data.color2 +'</h5>'
							        			+'</div>'
							        			+'<div class="Check">'
							        			+	'<a href="###" style="cursor: pointer" uid='+data.id+' class="compile">查看</a>'
							        			+'</div>'
							        		    +'</li>'
                                $('.carBoxOne').append(LiContent3);
                            }
                            ;
                            $page.methods.bianji();
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                    	layer.alert("服务器异常，请稍后处理！");
                    }
                    

                });
                //售车记录接口；
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "payment/getTradeSaleList", //绝对路径
                    data: {
                    	token: sessionStorage.getItem('token'),
                    	page:1,
                    	rows:3,
                    
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.carBoxTwo').html('');
                            for (var i = 0; i < Response.data.saleList.length; i++) {
                            	
                                var data = Response.data.saleList[i];
                                //订单状态
                                if(data.status==1){
                                    data.status="未付款"
                                }else if(data.status==2){
                                    data.status="付款成功未确认收货"
                                }else if(data.status==3){
                                    data.status="付款失败"
                                }else if(data.status==4){
                                    data.status="已确认收货未评价"
                                }else if(data.status==5){
                                    data.status="已评价"
                                }
                                //交易时间
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
                                //已完成情况的订单
                                data.img=data.img?data.img:'imgs/sell.png'

                                var LiContent3='<li class="LIST-LI ">'
								        			+'<div class="Img">'
								        			+	'<img src="'+data.img+'">'
								        			+'</div>'
								        			+'<div class="Information">'
								        			+	'<h2>'+ data.name +'</h2>'
								        			+	'<span>交易时间：'+Year + '-' + Month + '-' + Day +'</span>'
								        			+	'<h5>销售状态：'+data.status+'</h5>'
								        			+'</div>'
								        			+'<div class="Check">'
								        			+	'<b>'+data.guideprice+'万</b>'
								        			+'</div>'
								        		+'</li>' 
                                $('.carBoxTwo').append(LiContent3);
                            }
                            ;
                        } else {
                         //   layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
                
                //我的车源接口；
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "market/getSaleCarList", //绝对路径
                    data: {token: sessionStorage.getItem('token'),}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {

                        if (Response.rspCode == "0000") {
                            //console.log(1);
                            //console.log(Response);
                            $('.carBoxThree').html('');
                            for (var i = 0; i < Response.data.saleList.length; i++) {
                                var data = Response.data.saleList[i];
                                if(data.img==""){
                                    data.img = "imgs/528.jpg";
                                }
                                var LiContent3 = "<li data-id = "+ data.id +'>\
                                                                        <img class="carImg" src=' + data.img + '>\
                                                                        <div class="describeR">\
                                                                            <p>' + data.name + '</p>\
                                                                            <p>' + data.price + "<em>万</em></p>\
                                                                            <p>颜色：  " + data.color1 + '/' + data.color2 + '</p>\
                                                                            <p>库存：  ' + data.stock + "</p>\
                                                                        </div>\
                                                                        <button class='lookOverTwo' uid=" + data.id + ">查看</button>\
                                                                    </li>\
                                                                    <li></li>";
                                $('.carBoxThree').append(LiContent3);
                            }
                            ;
                            $(".lookOverTwo").click(function(){
                                var id = $(this).attr("uid");
                                window.location.href="supply_the_details.html?id="+id
                            })
                        } else {
                            //console.log(Response.rspDesc);
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },
            bianji: function () {
                $('.compile').click(function () {
                    var uid = $(this).attr('uid');
                    window.location.href = "Car_Locating_detail.html?id=" + uid;
                });
            }
        };
        return $page.methods;
    };
    

})(jQuery);
window.onload=function(){
    var height = $(".pesonalCenterHomeR").height();
    $(".pesonalCenterHomeL").css({
        "min-height":height+"px",
    });

};