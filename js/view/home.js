// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.LoadJump($(".AllContent"));
                this.LoadContent($('.nBList'));
                this.hotBrandAjax();
                this.CarMarketAjax();
                this.SearchCarAjax();
            },
            LoadJump: function (al) {
                al.load("indexContent.html", function (responseTxt, statusTxt, xhr) {
                    if (statusTxt == "success") {
                        $page.methods.hotBrandAjax();
                        $page.methods.CarMarketAjax();
                        $page.methods.SearchCarAjax();
                        //alert("外部内容加载成功！");
                        $('.jumpTwo').click(function () {
                            $('.nBList').removeClass("nBListSelect");
                            $('.nBList:nth-child(2)').addClass("nBListSelect");
                            $(".AllContent").load("main_ultra_low_purchase.html");
                        });
                        $('.jumpThree').click(function () {
                            $('.nBList').removeClass("nBListSelect");
                            $('.nBList:nth-child(3)').addClass("nBListSelect");
                            $(".AllContent").load("main_find_car.html");
                        });

                    }
                    if (statusTxt == "error") {
                        layer.alert("Error: " + xhr.status + ": " + xhr.statusText);
                    }
                });
                $('.AboutUs').click(function () {
                    $(".AllContent").load("about_us.html");
                    $('.nBList').removeClass("nBListSelect");
                });
            },
            LoadContent: function (ql) {
                ql.click(function () {
                    if ($(this).index() == "0") {
                        $(".AllContent").load("index.html");
                    } else if ($(this).index() == "1") {
                        $(".AllContent").load("main_ultra_low_purchase.html");
                    } else if ($(this).index() == "2") {
                        $(".AllContent").load("main_find_car.html", function (responseTxt, statusTxt, xhr) {
                            if (statusTxt == "success") {
                                $page.methods.SearchCarAjax();
                                $('.findCarBtn').click(function () {
                                    $(".AllContent").load("main_find_car_want.html");
                                    $('.nBList').removeClass("nBListSelect");
                                });
                            }
                        });
                        //我要寻车页面
                    } else if ($(this).index() == "3") {
                        $(".AllContent").load("main_release_options.html");
                    } else if ($(this).index() == "4") {
                        $(".AllContent").load("main_personal_center_home.html");
                    }
                    $(this).siblings().removeClass("nBListSelect");
                    $(this).addClass("nBListSelect");
                });

            },
            //热门推荐渲染
            hotBrandAjax: function () {
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getCarHot", //绝对路径
                    data: {
                        /*page:1,row:1,*/
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        //console.log(Response);
                        if (Response.rspCode == "0000") {
                            $('.hotCar').html("");
                            for (var i = 0; i < Response.data.priceList.length; i++) {
                                var data = Response.data.priceList[i];
                                var time = data.time;
                                var Year = new Date(time).getFullYear();
                                var Month = new Date(time).getMonth();
                                var Day = new Date(time).getDay();

                                var LiContent = "<li>\
                                                <img id=" + data.id + ' src=' + data.img + ">\
                                                <div class='informationCar'>\
                                                    <p class='model'>" + data.name + "</p>\
                                                    <p class='dateColor'><span>" + data.color1 + '/' + data.color2 + "</span>\
                                                                         <span>" + Year + "-" + Month + "-" + Day + '</span></p>\
                                                    <p class="address">' + data.addressfrom + "---" + data.addressto + '</p>\
                                                    <span class="price"><em>' + data.price + "</em>万</span>\
                                                    <span class='lowPrice'><em>" + data.guideprice1 + '</em>万/<em>' + data.cardiscount + "</em></span>\
                                                </div>\
                                            </li>";
                                $('.hotCar').append(LiContent);

                            }
                            $page.methods.productDetails($('.hotCar li'));
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }

                });
            },
            CarMarketAjax: function () {
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getCarMarket", //绝对路径
                    data: {
                        page: 1, row: 3,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        // console.log(Response);
                        if (Response.rspCode == "0000") {
                            $('.CarMarket').html("");
                            for (var i = 0; i < Response.data.priceList.length; i++) {
                                var data = Response.data.priceList[i];
                                var time = data.time;
                                var Year = new Date(time).getFullYear();
                                var Month = new Date(time).getMonth();
                                var Day = new Date(time).getDay();

                                var LiContent = "<li>\
                                                <img id=" + data.id + ' src=' + data.img + ">\
                                                <div class='informationCar'>\
                                                    <p class='model'>" + data.name + "</p>\
                                                    <p class='dateColor'><span>" + data.color1 + '/' + data.color2 + "</span>\
                                                                         <span>" + Year + "-" + Month + "-" + Day + '</span></p>\
                                                    <p class="address">' + data.addressfrom + "---" + data.addressto + '</p>\
                                                    <span class="price"><em>' + data.price + "</em>万</span>\
                                                    <span class='lowPrice'><em>" + data.guideprice1 + '</em>万/<em>' + data.cardiscount + "</em></span>\
                                                </div>\
                                            </li>";
                                $('.CarMarket').append(LiContent);
                            }
                            $page.methods.productDetails($('.CarMarket li'));
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }

                });

            },
            SearchCarAjax: function () {
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "market/getSearchCarList", //绝对路径
                    data: {
                        page: 1, row: 8,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        // console.log(Response);
                        if (Response.rspCode == "0000") {
                            $('.SearchCar').html("");
                            for (var i = 0; i < Response.data.searchList.length; i++) {
                                var data = Response.data.searchList[i];
                                var time = data.time;
                                var Year = new Date(time).getFullYear();
                                var Month = new Date(time).getMonth();
                                var Day = new Date(time).getDay();

                                var LiContent = "<li>\
                                                <img id=" + data.id + ' src="imgs/dazong_car.jpg">\
                                                <div class="informationCar">\
                                                     <p class="model">' + data.name + '</p>\
                                                     <p class="dateColor"><span>' + data.color1 + '/' + data.color2 + "</span>\
                                                          <span>" + data.time + '</span></p>\
                                                     <p class="address">' + data.licensearea + "</p>\
                                                </div>\
                                            </li>";
                                $('.SearchCar').append(LiContent);
                            }
                            $page.methods.productDetails($('.SearchCar li'));
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }

                });

            },
            productDetails: function (xl) {
                xl.click(function () {
                    var liId = $(this).find('img').attr('id');
                    // console.log(liId);
                    $(".AllContent").load("product_details.html");
                    $('.nBList').removeClass("nBListSelect");
                    $.ajax({
                        type: "POST", //提交方式  
                        url: root_path + "car/getCarDetail", //绝对路径  
                        data: {
                            id: liId,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            // console.log(Response);
                            sessionStorage.setItem('key1', Response);
                            if (Response.rspCode == "0000") {
                                $('.SearchCar').html("");
                            } else {
                                layer.alerts(Response.rspDesc);
                            }
                        },
                        error: function() {
                            layer.alert("服务器异常，请稍后处理！");
                        }

                    });
                });

            },
            aa: function () {


            }
        };
        return $page.methods;
    };
})(jQuery);
