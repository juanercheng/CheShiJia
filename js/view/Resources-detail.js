
(function ($) {	
	
    $.page = function () {
        var $page = {};
        var imgId='';
        $page.methods = {
            init: function () {
				imgId = GetQueryString('id');
                //获取URL地址参数（中文除外）
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };
                this.getCarAjax();
                this.GetParamFMarketList();
            },

            //汽车详情
            GetParamFMarketList: function(){
                $.ajax({
                    type:"POST",//提交方式
                    url:root_path+"market/getSaleCarDetail",//绝对路径
                    data:{
                        token: sessionStorage.getItem("token"),
                        id: imgId ,
                    },
                    dataType:"json",
                    success:function(Response){
                        console.log(Response.data)
                        if(Response.rspCode == "0000"){
                            var data=Response.data;
                            $(".orderBox").html("");
                            //取到的毫秒转化为年月日
                            var time = data.time;
                            switch (data.feerule) {
                                case "优惠":

                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);
                                    var rulePriceTotal=(rulePrice-rulePrice1).toFixed(2);
                                    break;
                                case "下点":

                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);

                                    var rulePriceTotal=((rulePrice*(1-(rulePrice1*0.01))).toFixed(2));

                                    break;
                                case "直接报价":

                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);
                                    rulePrice=rulePrice1;
                                    var rulePriceTotal=(rulePrice).toFixed(2);

                                    break;
                                case "电议":
                                    var ruleStr =  "电议";
                                    var ruleStr1 = "电议";
                                    var rulePriceTotal= "电议";

                                    break;
                                case "加":

                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);
                                    var rulePriceTotal=(rulePrice1+rulePrice).toFixed(2);


                                    break;
                                case "2186":

                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);
                                    var rulePriceTotal=((rulePrice*(1-(rulePrice1*0.01))).toFixed(2));
                                    break;
                                case "2187":

                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);
                                    var rulePriceTotal=((rulePrice-rulePrice1).toFixed(2));

                                    break;
                                case "2188":

                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);
                                    var rulePriceTotal=(rulePrice1+rulePrice).toFixed(2);
                                    break;
                                case "2189":
                             ;
                                    var rulePrice1=Number(data.feevalue);
                                    var rulePrice=Number(data.guideprice1);
                                    rulePrice=rulePrice1;
                                    var rulePriceTotal=((rulePrice).toFixed(2));
                                    break;
                                case " ":
                                    // var ruleStr =  "电议";
                                    // var ruleStr1 = "电议";
                                    // var rulePriceTotal= "电议";
                                    // $('.orderPrice em:eq(1)').remove();

                                    break;
                                default:
                                    break;
                            }
                            var Year = new Date(time).getFullYear();
                            var Month = new Date(time).getMonth() + 1;
                            var Day = new Date(time).getDate();
                            if (Month < 10) {
                                Month = '0' + Month;
                            }
                            if (Day < 10) {
                                Day = '0' + Day;
                            }
                            data.remark=data.remark?data.remark:'无'
                            var surface='<p>车辆型号<span>' + data.name + '</span></p>'
                                +'<p>发布时间<span>' + Year + '-' + Month + '-' + Day + '</span></p>'
                                +'<p>外观/内饰颜色<span>' +data.color1+'/'+data.color2+ '<span></p>'
                                +'<p>库存数量<span>' + data.stock + '</span></p>'
                                +'<p>销售区域<span>' + data.addressto + '</span></p>'
                                +'<p>车辆价格<span>' + data.price + '万'+'</span></p>'
                                // +'<p>期望成交价<span>'+rulePriceTotal+'<em class="wan">'+'万'+'</em>'+'（指导价：<b class="pricel">'+data.guideprice1+'万</b>）</></p>'
                                +'<p>备注<span>'+ data.remark +'</span></p>'
                                +'<p>联系方式<span>' + data.membermobile + '</span></p>'
                            $(".orderBox").append(surface);
                            if(rulePriceTotal=="电议"||rulePriceTotal==""||rulePriceTotal==undefined){
                                $(".wan").remove();

                            }


                            //已读标记
                            $.ajax({
                                type: "POST",//提交方式
                                url: root_path + "recommend/updRecomRead",//绝对路径
                                data: {
                                    token: sessionStorage.getItem("token"),
                                    id: imgId,
                                    type:2
                                },
                                dataType: "json",
                                success: function (Response) {
                                    // console.log(Response)
                                }
                            })
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
                    error:function(){
                        layer.alert("服务器异常，请稍后处理！");
                    }

                })
            },

            //资源匹配寻车
            getCarAjax:function(){
                $.ajax({
                    cache: "False",
                    type: "POST", //提交方式
                    url: root_path + "recommend/getParamFMarketList",
                    data: {
                        token: sessionStorage.getItem("token"),
                        id: imgId ,
                        page: 1,
                        rows: 3,
                    },
                    dataType:'json',
                    success : function(Response){
                        if(Response.rspCode == "0000"){
                            var data = Response.data.mainList;
                            // console.log(data)

                            for(var i=0;i<data.length;i++){
                                $common.methods.initModel(data,i);
                                var area = data[i].region;
                                var require = data[i].requirement;
                                data[i].companyName = data[i].companyname;
                                $common.methods.model(data,i,".hotCar",area,require);
                            };

                            $('.recommendT li').click(function () {
                                var carId = $(this).attr('id');
                                window.location.href = "details_for_the_car.html?id=" + carId;
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
                    error:function(){
                        layer.alert("服务器异常，请稍后处理！");
                    }
                })

            }
        };

        return $page.methods;
    };
})(jQuery);


