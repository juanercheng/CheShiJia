// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        var display=0;
        $page.methods = {
            init: function () {
                this.AutomobileBrandAjax();  //分类菜单
                this.SwiperAnimate();        //顶部轮播图
                this.ResoruceAjax();         //资源匹配
                this.hotBrandAjax();         //热门推荐
                this.CarMarketAjax();        //经销商资源
                this.SearchCarAjax();        //寻车资源
                this.PersonNum();
            },


            //汽车品牌接口；
            AutomobileBrandAjax: function () {
                //搜索框提交
                $('.findNow').click(function () {
                    search()
                });
                $('.findInfo').on('keypress',function(event){
                    if(event.keyCode === 13) {search()
                    }
                });
                function search() {
                    var keyword = $(".findCar input").val();
                    if (keyword.trim() == "") {
                        layer.alert("搜索内容不能为空！");
                        return false;
                    }
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "market/getMainList", //绝对路径
                        data: {
                            keywords: keyword,
                            token: window.sessionStorage.getItem('token'),
                            type:1//全查
                        }, //数据，这里使用的是Json格式进行传输
                        success: function (data) {

                            var data = $.parseJSON(data);
                            var list = data.data.mainList;
                            if (list.length <= 0) {
                                layer.alert("抱歉，没找到您搜索的内容!");
                            } else {
                                window.location.href = "main_ultra_low_purchase.html?keyword=" + keyword;
                            }
                        }
                    })
                };
                $(".release").hide();
                //相关搜索  手动搜索汽车信息
                $('.findInfo').bind('input propertychange', function() {
                    // alert("13");
                    var key = $(".findCar input").val();
                    // console.log(key);
                    var key =key.trim();
                    if(key==""){
                        $(".release").hide();
                        $("#release").empty();//清除上一次添加的文本内容
                    }else if(key!=""){



                        $.ajax({

                            type: "POST", //提交方式
                            url: root_path + "market/getMainList", //绝对路径
                            data: {
                                keywords: key,
                                token: window.sessionStorage.getItem('token'),
                                type:1//全查
                            }, //数据，这里使用的是Json格式进行传输
                            success: function (data) {
                                $("#release").empty();
                                var data = $.parseJSON(data);
                                var list =data.data.mainList;

                                for(var i=0;i<list.length;i++){
                                    var t=list[i].name;//获取相关搜索名
                                    $("#release").append("<li>"+list[i].name+"</li>");
                                    $("#release li").click(function () {
                                        var litext= $(this).text().split(' ');
                                        var getKeyworld = litext.slice(0,1);
                                        $('.findCar .findInfo').val(getKeyworld);
                                        search()
                                    })
                                }
                                $(".release").show();

                            }
                        })

                    }
                });
                //获取分类字段
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getBrand", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    success: function (Response) {
                        var Response = $.parseJSON(Response);
                        if (Response.rspCode == "0000") {
                            $('.sectionOneLeftUl').html("");
                            for (var i = 0; i < Response.data.brandList.length; i++) {
                                var data = Response.data.brandList[i];
                                var spanContent = "<li class='brandOne' uid=" + data.id + '  initia=' + data.letter + ">" + data.name + '</li>';
                                $('.sectionOneLeftUl_1').append(spanContent);
                                $('.sectionOneLeftUl_2').append(spanContent);
                            }
                            //点击买车的汽车品牌事件；
                            $(".sectionOneLeftUl_1>li").click(function () {
                                $(this).css("color", "#dc2827");
                                //车名；
                                var keyword = $(this).text();
                                if (keyword != "") {
                                    $.ajax({
                                        type: "POST", //提交方式
                                        url: root_path + "market/getMainList", //绝对路径
                                        data: {
                                            keywords: keyword,
                                            token: window.sessionStorage.getItem('token'),
                                            type:1
                                        }, //数据，这里使用的是Json格式进行传输
                                        success: function (data) {
                                            var data = $.parseJSON(data);
                                            var list = data.data.mainList;
                                            if (list.length <= 0) {
                                                layer.alert('抱歉，没找到您搜索的内容！', function(index){
                                                    $(".sectionOneLeftUl_1>li").css("color", "#fff");
                                                    layer.close(index);
                                                });
                                            } else {
                                                //跳转至超低购页面;
                                                window.location.href = "main_ultra_low_purchase.html?keyword=" + keyword;
                                            }
                                        },
                                        error: function () {
                                            layer.alert("服务器异常，请稍后处理！");
                                        }
                                    })
                                } else {
                                    layer.alert("请输入你要搜索的汽车品牌或车型！");
                                    return;
                                }
                            })
                            $(".sectionOneLeftUl_2>li").click(function () {
                                $(this).css("color", "#dc2827");
                                //车名；
                                var Carname = $(this).text();
                                if (Carname != "") {
                                    $.ajax({
                                        type: "POST", //提交方式
                                        url: root_path + "market/getMainList", //绝对路径
                                        data: {
                                            keywords: Carname,
                                            token: window.sessionStorage.getItem('token'),
                                            type:2
                                        }, //数据，这里使用的是Json格式进行传输
                                        success: function (data) {
                                            var data = $.parseJSON(data);
                                            var list = data.data.mainList;
                                            if (list.length <= 0) {
                                                layer.alert('抱歉，没找到您搜索的内容！', function(index){
                                                    $(".sectionOneLeftUl_2>li").css("color", "#fff");
                                                    layer.close(index);
                                                });
                                            } else {
                                                //跳转至寻车页面;
                                                window.location.href = "main_find_car.html?Carname=" + Carname;
                                            }
                                        },
                                        error: function () {
                                            layer.alert("服务器异常，请稍后处理！");
                                        }
                                    })
                                } else {
                                    layer.alert("请输入你要搜索的汽车品牌或车型！");
                                    return;
                                }
                            })
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }

                });
            },

            //焦点图
            SwiperAnimate: function () {
                $.ajax({
                    cache: "False",
                    type: "POST", //提交方式
                    url: root_path + "information/getAdvertisement", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {

                        if (Response.rspCode == "0000") {
                            for (var i = 0; i < Response.data.rollingAdList.length; i++) {
                                var data = Response.data.rollingAdList[i];
                                var LiContent = "<div class='swiper-slide' >\
                                        <a href=" + 'product_details.html?id=' + data.carid + " target='_blank'><img id=" + data.carid + ' src=' + data.path + " ></a>\
                                        <p class='swipeText'></p>\
                                    </div>"
                                $('.mobile .swiper-wrapper').append(LiContent);
                            }
                            var swiper = new Swiper('.mobile', {
                                pagination: '.mobile-pagination',
                                loop: true,
                                paginationClickable: true,
                                spaceBetween: 0,
                                centeredSlides: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: false,
                                onSlideChangeEnd: function (swiper) {
                                    _index = swiper.activeIndex;
                                    $(".mobile_link").eq(_index).addClass("cur").siblings().removeClass("cur");
                                }
                            });
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！")
                    }
                })
            },


            // 资源匹配接口
            ResoruceAjax: function () {
                if (window.sessionStorage.getItem('token')) {
                    $.ajax({
                        cache: "False",
                        type: "POST", //提交方式
                        //资源匹配接口
                        url: root_path + "recommend/getRecomMarketList", //绝对路径
                        data: {
                            token: window.sessionStorage.getItem("token"), page: 1, rows: 10,
                        },
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {

                                // var data = Response.data.priceList;
                                var data = Response.data.mainList;
                                if (data.length > 0) {
                                    var str = "<div class='headlineOne'>" +
                                        "<span class='imgLeftO'>资源匹配</span>" +
                                        "<span class='titleLine'></span>" +
                                        "<a class='jumpTwo' href='Resources.html'>更多</a>" +
                                        "</div>" +
                                        "<ul class='recommendT resource'>" +
                                        "<li class='scrollCar'>" +
                                        "<div class='swiper-container liScroll liScrollOne '>" +
                                        "<div class='swiper-wrapper'>" +
                                        "</div>" +
                                        "<div class='swiper-pagination page1'></div>" +
                                        "</div>" +
                                        "</li>" +
                                        "</ul>"
                                    $(".newSource").append(str);
                                    for (var i = 0; i < data.length; i++) {
                                        $common.methods.initModel(data, i);
                                        //自定义车型
                                        if(data[i].customcar != "") {
                                            var str = JSON.parse(data[i].customcar);
                                            data[i].color1 = str[1];
                                            data[i].color2 = str[2];
                                        }
                                        //优惠规则值
                                        data[i].guideprice1 = parseFloat(data[i].guideprice1);
                                        data[i].feevalue = parseFloat(data[i].feevalue);
                                        switch (data[i].feerule) {
                                            case "优惠":
                                                var ruleStr = "直降" + data[i].feevalue + "万";
                                                break
                                            case "下点":
                                                var ruleStr = "下" + data[i].feevalue + "点";
                                                break
                                            case "直接报价":
                                                var ruleStr = "";
                                                break
                                            case "电议":
                                                var ruleStr = "";
                                                break
                                            case "加":
                                                var ruleStr = "加" + data[i].feevalue + "万";
                                                break
                                            default:
                                                break
                                        }
                                        if (i < 4) {
                                            var listScroll = "<div id='" + data[i].id + "' class='swiper-slide scrollInfo'>" +
                                                "<img id='" + data[i].id + "' src='" + data[i].img + "'>" +
                                                "<p class='model'>" + data[i].name + "</p>" +
                                                "<p class='carInfo'>" +
                                                "<span>" + data[i].color1 + "/" + data[i].color2 + "</span>" +
                                                "<span>" + data[i].specifications+"/" + data[i].carstatus + "</span>" +
                                                "</p>" +
                                                "<p class='shopInfo shopInfo" + i + "'>" +
                                                "</p>" +
                                                "<p class='priceInfo'>" +
                                                "<span class='price price" + i + "'>" + data[i].price + "万</span>" +
                                                "<span class='lowPrice'><em class='guidedata.cardiscount'>" + (data[i].guideprice1).toFixed(2) + "万</em></span>" +
                                                "</p>" +
                                                "</div>"
                                            $('.resource .liScrollOne .swiper-wrapper').append(listScroll);
                                            if (data[i].price == "0.00") {
                                                $(".resource .price" + i).text("电议");
                                            }
                                            var requirList = data[i].requirement.split(",");
                                            for (var j = 0; j < requirList.length; j++) {
                                                if (requirList != "" && j < 4) {
                                                    var requirStr = "<span>" + requirList[j] + "</span>";
                                                    $('.resource').find('.shopInfo' + i).append(requirStr);
                                                }
                                            }
                                        } else {
                                            var area = data[i].region;
                                            var require = data[i].requirement;
                                            $common.methods.model(data, i, ".resource", area, require);
                                            var resultStr = "<p class='result'><a href='#'>50个匹配结果</a></p>"
                                            $('.resource li').eq(i - 2).append(resultStr);
                                        }
                                    }
                                    var mySwiper = new Swiper('.liScrollOne', {
                                        // autoplay:2500,
                                        loop: true,
                                        pagination: '.page1',
                                        paginationClickable: true,
                                        spaceBetween: 0,
                                        centeredSlides: true,
                                        autoplayDisableOnInteraction: false,
                                        autoplay: 2500,

                                    })
                                }
                                //跳转到当前汽车详情页面；
                                // $page.methods.productDetails();
                                //资源匹配(跳转匹配页面)
                                $('.recommendT li:not(.scrollCar)').click(function () {
                                    var carId = $(this).attr('id');
                                    window.location.href = "Resources-detail.html?id=" + carId;
                                });
                                //匹配小轮播图（跳匹配页面）
                                $('.resource .scrollInfo').click(function () {

                                    var carId = $(this).attr('id');
                                    window.location.href = "Resources-detail.html?id=" + carId;
                                });
                            } else {
                                // layer.alert(Response.rspDesc);
                            }
                        },
                        error: function () {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    })
                }
            }
            ,
            //热门推荐渲染
            hotBrandAjax: function () {
                $.ajax({
                    cache: "False",
                    type: "POST", //提交方式
                    url: root_path + "information/getMarketInfo",
                    data: {},
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            var data = Response.data;
                            $('.hotCar').html("");
                            if(data.length<0){
                                $('.hotJump').hide()
                            }else {
                                $('.hotJump').show()
                            }
                            for (var i = 0; i < data.length; i++) {
                                data[i].img=data[i].img?data[i].img:"./imgs/sell.png"
                                var imgList = "<li class='hotImg' id=" + data[i].id + ">" +
                                    "<div class='ImgBox'>" +
                                    "<img src=" + data[i].img + ">" +
                                    "</div>"+
                                    "</li>";

                                $('.hotCar').append(imgList);
                                $('.hotCar li').click(function () {
                                    var carId = $(this).attr('id');
                                    window.location.href = "product_details.html?id=" + carId;
                                });
                            }
                        } else {

                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }

                });
            }
            ,
            //经销商资源
            CarMarketAjax: function () {
                $.ajax({
                    cache: "false",
                    type: "POST", //提交方式
                    url: root_path + "market/getMainList", //绝对路径
                    data: {
                        page: 1, rows: 9,
                        type:1,
                        token: window.sessionStorage.getItem('token'),
                    },
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            var data = Response.data.mainList;
                            //创建列表轮播图框架
                            var liScrollContent = "<li class='scrollCar'>" +
                                "<div class='swiper-container liScroll liScrollTwo'>" +
                                "<div class='swiper-wrapper'>" +
                                "</div>" +
                                "<div class='swiper-pagination page2'></div>" +
                                "</div>" +
                                "</li>"
                            $('.CarMarket').append(liScrollContent);
                            for (var i = 0; i < data.length; i++) {
                                $common.methods.initModel(data, i);
                                if (i < 3) {
                                    //自定义车型
                                    if(data[i].customcar != "") {
                                        var str = JSON.parse(data[i].customcar);
                                        data[i].color1 = str[1];
                                        data[i].color2 = str[2];
                                    }
                                    //优惠规则值
                                    data[i].guideprice1 = parseFloat(data[i].guideprice1);
                                    data[i].feevalue = parseFloat(data[i].feevalue);
                                    switch (data[i].feerule) {
                                        case "优惠":
                                            var ruleStr = "直降" + data[i].feevalue + "万";
                                            var ruleStr1="优惠金额";
                                            break;
                                        case "下点":
                                            var ruleStr = "下" + data[i].feevalue + "点";
                                            var ruleStr1="优惠点数";

                                            break;
                                        case "直接报价":
                                            var ruleStr = "";
                                            var ruleStr1="直接报价";

                                            break;
                                        case "电议":
                                            var ruleStr = "";
                                            var ruleStr1="电议";

                                            break;
                                        case "加":
                                            var ruleStr = "加" + data[i].feevalue + "万";
                                            var ruleStr1="加价金额";

                                            break;
                                        default:
                                            break
                                    }
                                    var listScroll = "<div id='" + data[i].id + "'  class='swiper-slide scrollInfo'>" +
                                        "<img id=" + data[i].id + " src=" + data[i].img + ">" +
                                        "<p class='model'>" + data[i].name + "</p>" +
                                        "<p class='carInfo'>" +
                                        "<span>" + data[i].color1 + "/" + data[i].color2 + "</span>" +
                                        "<span>" + data[i].specifications+"/" + data[i].carstatus + "</span>" +
                                        "</p>" +
                                        "<p class='shopInfo shopInfo" + i + "'>" +
                                        "</p>" +
                                        "<p class='priceInfo'>" +
                                        "<span class='price price" + i + "'>" + data[i].price + "万</span>" +
                                        "</p>" +
                                        "</div>"
                                    $('.CarMarket .liScrollTwo .swiper-wrapper').append(listScroll);
                                    if (data[i].price == "0.00"||data[i].price == "") {
                                        $(".CarMarket .price" + i).text("电议");
                                    }
                                    //显示特殊要求
                                    var requirList = data[i].requirement.split(",");
                                    for (var j = 0; j < requirList.length; j++) {
                                        if (requirList != "" && j < 3) {
                                            var requirStr = "<span>" + requirList[j] + "</span>";
                                            $('.CarMarket').find('.shopInfo' + i).append(requirStr);
                                        }
                                    }
                                } else {
                                    var area = data[i].region;
                                    var require = data[i].requirement;
                                    data[i].img=data[i].img?data[i].img:'imgs/moren.png';
                                    $common.methods.model(data, i, ".CarMarket", area, require);
                                }
                            }
                            var mySwiper = new Swiper('.liScrollTwo', {
                                loop: true,
                                pagination: '.page2',
                                paginationClickable: true,
                                spaceBetween: 0,
                                centeredSlides: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: false,
                            });
                            //跳转到当前汽车详情页面；
                            // $page.methods.productDetails();
                            //经销商资源（跳超低购详情页面）
                            $('.CarMarket li:not(.scrollCar)').click(function () {
                                // alert("经销商资源" + $(this).attr('id'));
                                var carId = $(this).attr('id');
                                window.location.href = "product_details.html?id=" + carId;
                            });
                            //经销商小轮播图（跳超低购详情页面）
                            $('.CarMarket .scrollInfo').click(function () {
                                // alert("经销商轮播图" + $(this).attr('id'));
                                var carId = $(this).attr('id');
                                window.location.href = "product_details.html?id=" + carId;
                            });
                        }else if(Response.rspCode == "1001"){
                            display=1
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
                })
            }
            ,
            //寻车资源
            SearchCarAjax: function () {
                $.ajax({
                    cache: "False",
                    type: "POST", //提交方式
                    url: root_path + "market/getSearchCarList", //绝对路径
                    data: {
                        page: 1, rows: 8,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {

                        if (Response.rspCode == "0000") {
                            var data = Response.data.searchList;
                            $('.SearchCar').html("");
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].img == "") {
                                    data[i].img = "./imgs/sell.png";
                                }
                                //取到的毫秒转化为年月日
                                var time = data[i].time;
                                data[i].year = new Date(time).getFullYear();
                                data[i].month = new Date(time).getMonth() + 1;
                                data[i].day = new Date(time).getDate();
                                if (data[i].month < 10) {
                                    data[i].month = '0' + data[i].month;
                                }
                                if (data[i].day < 10) {
                                    data[i].day = '0' + data[i].day;
                                }
                                //自定义车型
                                if(data[i].customcar != "") {
                                    var str = JSON.parse(data[i].customcar);
                                    data[i].color1 = str[1];
                                    data[i].color2 = str[2];
                                }

                                //优惠规则值
                                data[i].guideprice = parseFloat(data[i].guideprice);
                                data[i].feevalue = parseFloat(data[i].feevalue);
                                switch (data[i].feerule) {
                                    case "优惠":
                                        var ruleStr = "直降" + (data[i].feevalue).toFixed(2) + "万";
                                        var ruleStr1="优惠金额";
                                        var rulePriceTotal=Number(data[i].guideprice);
                                        var rulePriceTotal1=Number(data[i].feevalue);
                                        var priceTotal=(rulePriceTotal-rulePriceTotal1).toFixed(2);
                                        break
                                    case "下点":
                                        var ruleStr = "下" + (data[i].feevalue).toFixed(2) + "点";
                                        var ruleStr1="优惠点数";
                                        var rulePriceTotal=Number(data[i].guideprice);
                                        var rulePriceTotal1=Number(data[i].feevalue);
                                        var priceTotal=((rulePriceTotal*(1-(rulePriceTotal1*0.01))).toFixed(2));
                                        break
                                    case "直接报价":
                                        var ruleStr = "";
                                        var ruleStr1="直接报价";
                                        var rulePriceTotal=Number(data[i].guideprice);
                                        var rulePriceTotal1=Number(data[i].feevalue);
                                        var priceTotal=(rulePriceTotal1).toFixed(2);

                                        break
                                    case "电议":
                                        var ruleStr = "";
                                        var ruleStr1="电议";
                                        var rulePriceTotal=Number(data[i].guideprice);
                                        var priceTotal=(rulePriceTotal).toFixed(2);
                                        break
                                    case "加":
                                        var ruleStr = "加" + (data[i].feevalue).toFixed(2) + "万";
                                        var ruleStr1="加价金额";
                                        var rulePriceTotal=Number(data[i].guideprice);
                                        var rulePriceTotal1=Number(data[i].feevalue);
                                        var priceTotal=(rulePriceTotal+rulePriceTotal1).toFixed(2);

                                        break
                                    default:
                                        break
                                }

                                if (i <= 0) {
                                    var firstStr = "<li id='" + data[i].id + "' class='firstLi' >" +
                                        "<div class='informationCar oneImg clearfix'>" +
                                        "<p class='model'>" + data[i].name + "</p>" +
                                        "<div class='carInfo clearfix '>" +
                                        "<img src='" + data[i].img + "'>" +
                                        "<div>" +
                                        "<p class='address'>" + data[i].licensearea + "-" + data[i].addressto + "</p>" +
                                        "<span>" + data[i].color1 + "/" + data[i].color2 + "</span>" +
                                        "<span>" + data[i].specifications+"/" + data[i].carstatus + "</span>" +
                                        "<p class='call" + i + " call'>" + priceTotal + "<em>万</em></p>" +
                                        "</div>" +
                                        "</div>" +
                                        "<p class='shopInfo shopInfo" + i + "'>" +
                                        "</p>" +
                                        "<a class='detail' href='details_for_the_car.html?id=" + data[i].id + "'>了解详情</a>" +
                                        "</div>" +
                                        "</li>";
                                    $('.SearchCar').append(firstStr);
                                    if ((data[i].feerule==undefined)||(data[i].guideprice == "0.00")||(data[i].feevalue=="电议")||(data[i].feerule=="")) {
                                        $(".SearchCar .call" + i).text("电议");
                                    }
                                    var requirList = data[i].requirement.split(",");
                                    for (var j = 0; j < requirList.length; j++) {
                                        if (requirList != "" && j < 4) {
                                            var requirStr = "<span>" + requirList[j] + "</span>";
                                            $('.SearchCar').find('.shopInfo' + i).append(requirStr);
                                        }
                                    }
                                } else {
                                    data[i].img=data[i].img?data[i].img:'imgs/moren.png';

                                    var otherStr = "<li id='" + data[i].id + "' class='othersLi' >" +
                                        "<div class='informationCar informationCar1'>" +
                                        "<div class='carInfo clearfix  pictureLogo'>" +
                                        "<img src='" + data[i].img + "'>" +
                                        "<div>" +
                                        "<p class='model'>" + data[i].name + "</p>" +
                                        "<span>" + data[i].year + "-" + data[i].month + "-" + data[i].day + "</span>" +
                                        "<span class='address'>" + data[i].licensearea + "-" + data[i].addressto + "</span>" +
                                        "<span>" + data[i].color1 + "/" + data[i].color2 + "</span>" +
                                        "<span>" + data[i].specifications+"/" + data[i].carstatus + "</span>" +
                                        "</div>" +
                                        "</div>" +
                                        "<p class='shopInfo shopinfo   shopInfo" + i + "'>" +
                                        "<p class='priceInfo clearfix'>" +
                                        "<span class='price price" + i + "'><em>" + priceTotal + "</em>万</span>" +
                                        "<span class='lowPrice'><em class='guidedata.cardiscount'>" + ruleStr +  "</em></span>" +
                                        "</p>" +
                                        "<p class='primaryPrice clearfix primaryprice'>" +
                                        "<span>" +  ruleStr1+"</span>" +//删除data[i].feerule +；
                                        "<span>" + (data[i].guideprice).toFixed(2) + "万/</span>" +
                                        "</p>" +
                                        "<div class='clearfix   nodata' style='height: 34px'></div>"+
                                        "<div class='notLogin'>" +
                                        "<span title='请先登录'></span>" +
                                        "<span></span>" +
                                        "<span title='请先登录'></span>" +
                                        "</div>" +
                                        "<div class='carBottom clearfix'>" +
                                        "<div>" +
                                        "<p>" + data[i].companyName + "</p>" +
                                        "<p class='star star" + i + "'>" +
                                        "</p>" +
                                        "</div>" +
                                        "<div>" +
                                        "<p>联系方式</p>" +
                                        "<p>" + data[i].membermobile + "</p>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>" +
                                        "</li>";
                                    $('.SearchCar').append(otherStr);

                                    if (data[i].guideprice == "0.00"||data[i].feerule== "电议") {
                                        $(".SearchCar .price" + i).html("<em>电议</em>");
                                    }
                                    if (window.sessionStorage.getItem("token") == null||display===1) {
                                        $('.notLogin').show();
                                        $('.carBottom').hide();
                                        $('.primaryPrice').hide()
                                        $('.nodata').show()
                                    } else {
                                        $('.notLogin').hide();
                                        $('.carBottom').show();
                                        $('.primaryPrice').show()
                                        $('.nodata').show()
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
                                    //    汽车要求(requirement)
                                    var requirList = data[i].requirement.split(",");
                                    for (var j = 0; j < requirList.length; j++) {
                                        if (requirList != "" && j < 3) {
                                            var requirStr = "<span>" + requirList[j] + "</span>";
                                            $('.SearchCar').find('.shopInfo' + i).append(requirStr);
                                        }
                                    }
                                }
                            }
                            //跳转到当前汽车详情页面；;
                            // $page.methods.productDetails();
                            //寻车资源（跳寻车详情页面）
                            $('.SearchCar li').click(function () {
                                // alert("寻车资源" + $(this).attr('id'));
                                var carId = $(this).attr('id');
                                window.location.href = "details_for_the_car.html?id=" + carId;
                            });
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }

                });
            }
            ,
            //点击当前图片，获取数据
            productDetails: function () {
                //热门推荐（跳超低购详情页面）
                $('.hotCar li').click(function () {
                    alert("热门推荐" + $(this).attr('id'));
                    // var carId = $(this).attr('id');
                    // window.location.href = "product_details.html?id=" + carId;
                });
                //经销商资源（跳超低购详情页面）
                $('.CarMarket li:not(.scrollCar)').click(function () {
                    alert("经销商资源" + $(this).attr('id'));
                    // var carId = $(this).attr('id');
                    // window.location.href = "product_details.html?id=" + carId;
                });
                //寻车资源（跳寻车详情页面）
                $('.SearchCar li').click(function () {
                    alert("寻车资源" + $(this).attr('id'));
                    // var carId = $(this).attr('id');
                    // window.location.href = "details_for_the_car.html?id=" + carId;
                });
                //经销商小轮播图（跳超低购详情页面）
                $('.CarMarket .scrollInfo').click(function () {
                    alert("经销商轮播图" + $(this).attr('id'));
                    // var carId = $(this).attr('id');
                    // window.location.href = "product_details.html?id=" + carId;
                });
                //匹配小轮播图（跳匹配页面）
                $('.resource .scrollInfo').click(function () {
                    alert("匹配轮播图" + $(this).attr('id'));
                    // var carId = $(this).attr('id');
                    // window.location.href = "product_details.html?id=" + carId;
                });
                //资源匹配(跳转匹配页面)
                $('.section_resource li:not(.scrollCar)').click(function () {
                    alert($("资源匹配" + this).attr('id'));
                    // var carId = $(this).attr('id');
                    // window.location.href = "details_for_the_car.html?id=" + carId;
                });
            },

            //个人中心角标提前加载
            PersonNum:function () {
                $.ajax({
                    type:"POST",//提交方式
                    url:root_path+"recommend/getRecomMarketList",//绝对路径
                    data:{
                        token: sessionStorage.getItem("token"),
                        page:1,
                        rows:12//数据，这里使用的是Json格式进行传输
                    },
                    dataType:"json",
                    success:function(Response){
                        if(Response.rspCode == "0000"){
                            sessionStorage.setItem('resource',Response.data.mainList.length);
                        }
                    }
                });
                $.ajax({
                    type:"POST",//提交方式
                    url:root_path+"recommend/getRecomParamList",//绝对路径
                    data:{
                        token: sessionStorage.getItem("token"),
                        page:1,
                        rows:12//数据，这里使用的是Json格式进行传输
                    },
                    dataType:"json",
                    success:function(Response){
                        if(Response.rspCode == "0000"){
                            sessionStorage.setItem('findCar',Response.data.mainList.length);
                        }
                    }
                });
            }
        };
        return $page.methods;
    };

})(jQuery);




    
    
    
    
    
    
    
    
    