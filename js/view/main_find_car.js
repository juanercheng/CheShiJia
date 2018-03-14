// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        var urlParams;
        var url;
        $page.methods = {
            init: function () {
                this.SearchCarAjax();
            },
            //寻车列表渲染；
            SearchCarAjax: function () {
                $(".findCarBtn").click(function(){
                    sessionStorage.removeItem("carAreaId");
                    sessionStorage.removeItem("carStandId");
                    sessionStorage.removeItem("carTimeId");
                    sessionStorage.removeItem("carXingUid");
                    sessionStorage.removeItem("car_detail");
                });
                //获取URL地址参数
                GetQueryString()
                function GetQueryString() {
                    //通过URL地址参数区分路由
                    url = decodeURI(window.location.href).split("?")[1];
                    if (url) {
                        urlParams = url.split("=")[1];
                    } else {
                        //选择汽车
                        return null;
                    }
                };
                //获取寻车列表；
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "market/getSearchCarList", //绝对路径
                    data: {
                        carbrand:urlParams,
                        token:sessionStorage.getItem("token"),
                        page:1,
                        rows:16
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.SearchCar').html("");
                            var pages = Response.data.page.pages;
                            var thisDate = function(){
                                var data = Response.data.searchList;
                                for (var i = 0; i < data.length; i++) {
                                    $common.methods.initModel(data, i);
                                    var area = data[i].licensearea;
                                    var require = data[i].requirement;
                                    // if(data[i].expectprice){
                                    //     data[i].price = data[i].expectprice;
                                    // }else if(data[i].expectprice=='0.00'&&data[i].guideprice&&data[i].feevalue){
                                    //     data[i].price = parseFloat(data[i].guideprice)-parseFloat(data[i].feevalue);
                                    // }
                                    // data[i].price = data[i].expectprice;
                                    data[i].guideprice1 = parseFloat(data[i].guideprice);
                                    data[i].feevalue = parseFloat(data[i].feevalue);
                                    switch (data[i].feerule) {
                                        case "优惠":
                                            var ruleStr = "直降" + (data[i].feevalue).toFixed(2) + "万";
                                            var   ruleStr1="优惠金额";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=(rulePriceTotal-rulePriceTotal1).toFixed(2);
                                            break;
                                        case "下点":
                                            var ruleStr = "下" + (data[i].feevalue).toFixed(2) + "点";
                                            var   ruleStr1="优惠点数";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=((rulePriceTotal*(1-(rulePriceTotal1*0.01))).toFixed(2));

                                            break;
                                        case "直接报价":
                                            var ruleStr = "";
                                            var   ruleStr1="直接报价";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=(rulePriceTotal1).toFixed(2);

                                            break;
                                        case "电议":
                                            var ruleStr = "";
                                            var   ruleStr1="电议";

                                            break;
                                        case "加":
                                            var ruleStr = "加" + (data[i].feevalue).toFixed(2) + "万";
                                            var   ruleStr1="加价金额";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=(rulePriceTotal+rulePriceTotal1).toFixed(2);


                                            break;
                                        case "2186":
                                            var ruleStr = "直降" + (data[i].feevalue).toFixed(2) + "万";
                                            var   ruleStr1="优惠点数";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=((rulePriceTotal*(1-(rulePriceTotal1*0.01))).toFixed(2));

                                            break;
                                        case "2187":
                                            var ruleStr = "直降" + (data[i].feevalue).toFixed(2) + "万";
                                            var   ruleStr1="优惠金额";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=(rulePriceTotal-rulePriceTotal1).toFixed(2);
                                            break;
                                        case "2188":
                                            var ruleStr = "加" + (data[i].feevalue).toFixed(2) + "万";
                                            var   ruleStr1="加价金额";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=(rulePriceTotal+rulePriceTotal1).toFixed(2);
                                            break;
                                        case "2189":
                                            var ruleStr = "";
                                            var   ruleStr1="直接报价";
                                            var rulePriceTotal=Number(data[i].guideprice1);
                                            var rulePriceTotal1=Number(data[i].feevalue);
                                            var priceTotal=(rulePriceTotal1).toFixed(2);

                                            break;
                                        case " ":
                                            var ruleStr = " ";
                                            var   ruleStr1="";

                                            break;
                                        default:
                                            break;
                                    }


                                    var temp=data[i].companyName ? data[i].companyName : '';
                                    var listModel = "<li id=" + data[i].id + ">" +
                                        "<div class='informationCar'>" +
                                        "<p class='model'>" + data[i].name + "</p>" +
                                        "<div class='carInfo clearfix'>" +
                                        "<img src=" + data[i].img + ">" +
                                        "<div>" +
                                        "<span>" + data[i].year + "-" + data[i].month + "-" + data[i].day + "</span>" +
                                        "<p class='address'>" + area + "-" + data[i].addressto + "</p>" +
                                        "<span>" + data[i].color1 + "/" + data[i].color2 + "</span>" +
                                        "<span>" + data[i].specifications + "/" + data[i].carstatus + "</span>" +
                                        "</div>" +
                                        "</div>" +
                                        "<p class='shopInfo shopInfo" + i + "'>" +
                                        "</p>" +
                                        "<p class='priceInfo clearfix'>" +
                                        "<span class='price price"+i+"'><em>" + priceTotal + "</em>万</span>" +
                                        "<span class='lowPrice'><em class='guidedata.cardiscount'>" + ruleStr + "</em></span>" +
                                        "</p>" +
                                        "<p class='primaryPrice clearfix'>" +
                                        "<span>" +ruleStr1 + "</span>" +
                                        "<span class='span2'>" + (data[i].guideprice1).toFixed(2) + "万/</span>" +
                                        "</p>" +
                                        "<div class='clearfix primaryPriceNodata' style='height: 34px'></div>"+
                                        "<div class='notLogin'>" +
                                        "<span title='请先登录'></span>" +
                                        "<span></span>" +
                                        "<span title='请先登录'></span>" +
                                        "</div>" +
                                        "<div class='carBottom clearfix'>" +
                                        "<div>" +
                                        "<p>" + temp +"</p>" +
                                        "<p class='star" + i + "'>" +
                                        "</p>" +
                                        "</div>" +
                                        "<div>" +
                                        "<p>联系方式</p>" +
                                        "<p>" + data[i].membermobile + "</p>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>" +
                                        "</li>";
                                    $('.SearchCar').append(listModel);
                                    if(window.sessionStorage.getItem('token')==null){
                                        $('.primaryPrice').hide();
                                        $('.primaryPriceNodata').show();


                                    }else{
                                        $('.primaryPrice').show();
                                        $('.primaryPriceNodata').hide();

                                    }


                                    if(data[i].guideprice1=="0.00"||data[i].guideprice1 == ""){
                                        $(".SearchCar .price"+i).html("<em>电议</em>");
                                    }
                                    if(data[i].feerule== ""||data[i].feerule== "电议"){
                                        $(".SearchCar .price"+i).html("<em>电议</em>");
                                    }
                                    // if (data[i].expectprice == "0.00") {
                                    //     $(".SearchCar .price"+i).html("<em>电议</em>");
                                    // }

                                    if (window.sessionStorage.getItem("token") == null) {
                                        $('.notLogin').show();
                                        $('.carBottom').hide();
                                    }else {
                                        $('.notLogin').hide();
                                        $('.carBottom').show();
                                    }
                                    //星级评价
                                    var starNum = 0;
                                    switch (data[i].starlevelname) {
                                        case '一星':
                                            starNum = 1;
                                            break;
                                        case '二星':
                                            starNum = 2;
                                            break;
                                        case '三星':
                                            starNum = 3;
                                            break;
                                        case '四星':
                                            starNum = 4;
                                            break;
                                        case '五星':
                                            starNum = 5;
                                        default:
                                            break;
                                    }
                                    for (var a = 0; a < starNum; a++) {
                                        var starOn = "<img src='./imgs/star_on.png'>"
                                        $('.SearchCar').find('.star' + i).append(starOn);
                                    }
                                    for (var a = 0; a < 5 - starNum; a++) {
                                        var starOff = "<img src='./imgs/star_off.png'>"
                                        $('.SearchCar').find('.star' + i).append(starOff);
                                    }
                                    //汽车要求(requirement)
                                    var requirList = require.split(",");
                                    for (var j = 0; j < requirList.length; j++) {
                                        if (requirList!="" && j < 3) {
                                            var requirStr = "<span>" + requirList[j] + "</span>";
                                            $('.SearchCar').find('.shopInfo' + i).append(requirStr);
                                        }
                                    }

                                }
                            };
                            //调用分页
                            laypage({
                                cont: $('.jumpPage'), //容器。值支持id名、原生dom对象，jquery对象,
                                pages: pages, //总页数
                                skip: true, //是否开启跳页
                                skin: '#e44523',//选中状态的背景色
                                groups: 5,//可视页数
                                first: 1, //将首页显示为数字1,。若不显示，设置false即可
                                last: pages, //将尾页显示为总页数。若不显示，设置false即可
                                prev: '<', //若不显示，设置false即可
                                next: '>', //若不显示，设置false即可
                                jump: function (obj, first) {

                                    var curr = obj.curr;
                                    $('.recommendT').html("");
                                    if(curr==1){
                                        thisDate(curr);
                                    }else{
                                        page(curr);
                                    }
                                    $('.laypage_total label:first').text("跳转至");
                                    $('.laypage_total label:eq(1)').remove();
                                    //跳页输入框获取到焦点试按钮样式的初始化
                                    $(".laypage_skip").focus(function(){
                                        $('.laypage_btn').css({
                                            "background":"white",
                                            "color":"#666"
                                        });
                                    });
                                    //跳页按钮的样式变化
                                    $('.laypage_btn').click(function(){
                                        if($('.laypage_skip').val()>pages){
                                            $(this).css({
                                                "background":"#808080",
                                                "color":"white"
                                            });
                                        }else{
                                            $(this).css({
                                                "background":"#e44523",
                                                "color":"white"
                                            });
                                        }
                                    });
                                    $(".SearchCar li").click(function(){
                                        var id = $(this).attr("id");
                                        window.location.href = "details_for_the_car.html?id="+id;
                                    })
                                }
                            });
                        } else if(Response.rspCode === "1001"){
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

                //子页跳转请求
                function page(curr){
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "market/getSearchCarList", //绝对路径
                        data: {
                            token:sessionStorage.getItem("token"),
                            page:curr,
                            rows:16
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                        	//console.log(Response)
                            if (Response.rspCode == "0000") {
                                var data = Response.data.searchList;
                                for (var i = 0; i < data.length; i++) {
                                    $common.methods.initModel(data, i);
                                    var area = data[i].licensearea;
                                    var require = data[i].requirement;
                                    data[i].price = data[i].expectprice;
                                    data[i].guideprice1 = data[i].guideprice;
                                    $common.methods.model(data, i, ".recommendT",area,require);

                                    $(".SearchCar li").click(function(){
                                        var id = $(this).attr("id");
                                        window.location.href = "details_for_the_car.html?id="+id;
                                    })
                                }
                            } else {
                            }
                        },
                        error: function() {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                }
                // layer.alert(Response.rspDesc);
            }


        };
        return $page.methods;
    };
})(jQuery);



    
    
    
    
    
    
    
    
    