// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        var url;
        //配置方法
        $page.methods = {
            //初始化(先判断url是否有参数)
            init: function () {

                //通过URL地址参数区分路由
                url = decodeURI(window.location.href).split("?")[1];
                if (url&&url!='type') {
                    var urlParams = url.split("=")[1];
                    $('.CarMarket1').show();
                    $('.jumpPage2').show();
                    //隐藏非搜索进入的数据
                    $('.filtrate').hide();
                    $('.result').hide();
                    $('.recommendT1').hide();
                    $('.jumpPage').hide();
                    $('.CarMarket').hide();
                    $('.jumpPage1').hide();
                    //搜索汽车
                    this.carsearch(urlParams);

                } else if(url==='type') {
                    $('.jumpPage1').show();
                    $('.CarMarket').show();
                    //隐藏非搜索进入的数据
                    $('.filtrate').hide();
                    $('.result').hide();
                    $('.recommendT1').hide();
                    $('.jumpPage').hide();
                    $('.jumpPage2').hide();
                    $('.CarMarket1').hide();

                    this.CarMarketAjax();
                }else {
                    $('.jumpPage').show();
                    $('.recommendT1').show();

                    $('.CarMarket').hide();
                    $('.jumpPage1').hide();
                    $('.CarMarket1').hide();
                    $('.jumpPage2').hide();
                    //搜索汽车
                    this.AutomobileBrandAjax();
                }
                this.reset();
            },


            //品牌接口
            AutomobileBrandAjax: function (urlParams) {
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getBrand", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    success: function (Response) {
                        var Response = $.parseJSON(Response);
                        if (Response.rspCode == "0000") {
                            $('.trademarkText').html("");
                            $('.result>button').css("color","#000");
                            for (var i = 0; i < Response.data.brandList.length; i++) {
                                var data = Response.data.brandList[i];
                                // console.log(data.id)
                                var spanContent = "<span class='brandOne' uid=" + data.id + '  initia=' + data.letter + ">" + data.name + '</span>';
                                $('.trademarkText').append(spanContent);
                                $(".brandOne:first").attr("class", "brandOne addSpanCss");
                                //隐藏数据
                                $('.CarMarket').hide();
                                $('.jumpPage1').hide();
                                $('.CarMarket1').hide();
                                $('.jumpPage2').hide();

                                //tab切换数据
                                $('.recommendT1').show();
                                $('.jumpPage').show();
                                var brandOnes = $(".brandOne");
                                $('.twoWayTitle span').click(function () {
                                    $(this).addClass('twoWayCss').siblings().removeClass('twoWayCss');
                                    //字母筛选
                                    brandOnes.hide();
                                    $(".brandOne[initia='" + $(this).text() + "']").show();
                                    // $(".brandOne[initia='" + $(this).text() + "']:first").attr("class", "brandOne addSpanCss");
                                });
                            }

                            //品牌的下拉按钮
                            $('.showImg').click(function () {
                                $(this).hide();
                                $('.hideImg').show();
                                $('.downBox').show();
                                $('.trademarkText').removeClass('addcsstradema');
                            });
                            $('.hideImg').click(function () {
                                $(this).hide();
                                $('.showImg').show();
                                $('.downBox').hide();
                                $('.trademarkText').addClass('addcsstradema');
                            });
                            var spanUid = $(".trademarkText .addSpanCss").attr('uid');
                            // console.log(spanUid);
                            $page.methods.CarSeriesAjax(spanUid);
                            //品牌切换事件
                            $page.methods.brandCar();
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },


            //车系,车型接口
            CarSeriesAjax: function (pid) {
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getSeries", //绝对路径
                    data: {
                        id: pid,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        // console.log(Response);
                        if (Response.rspCode == "0000") {
                            var data = Response.data;
                            $('.carsText').html("");
                            //填充车系
                            for (var u = 0; u < Response.data.length; u++) {
                                var data = Response.data[u];
                                var spanContent = "<span class='carsOne'>" + data.type + '</span>';
                                $('.carsText').append(spanContent);
                                $(".carsOne:first").attr("class", "carsOne addSpanCss");
                                //清空车型列表
                                $('.carModelsText').html("");
                                //第一个车系的下标
                                var Index = $('.carsText .addSpanCss').index();
                                //车型
                                for (var i = 0; i < Response.data[Index].seriesList.length; i++) {
                                    var data1 = Response.data[Index].seriesList[i];
                                    var spanContent = "<span class='carsModel' uid=" + data1.id + '>' + data1.name + '</span>';
                                    $('.carModelsText').append(spanContent);
                                    $(".carsModel:first").attr("class", "carsModel carsModel addSpanCss");
                                }
                            }
                            //关联年份
                            var carXingUid = $(".carModelsText .addSpanCss").attr('uid');
                            $page.methods.renderYear(Response.data, Index, carXingUid);
                            //车型、车系切换事件
                            $page.methods.LoadContent($('.carsOne'), Response.data);
                        } else if(Response.rspCode == "1001"&&url){
                            layer.alert('暂时没有您要找的车型！');
                        }else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                    }
                });
            },


            //年份接口
            renderYear: function (data, Index, carXingUid) {
                if(data[Index].seriesList){
                    $(".num").text(0);
                    $('.recommendT').html("");
                    $(".list_no").show();
                }
                var html = [], data1 = data[Index].seriesList;
                for (var i = 0, l = data1.length; i < l; i++) {
                    if(data1[i].yearList ==""){
                        $(".num").text(0);
                        $('.recommendT').html("");
                        $(".list_no").show();
                    }
                    if (data1[i].id == carXingUid) {
                        var years = data1[i].yearList;
                        for (var j = 0, l = years.length; j < l; j++) {
                            html.push("<em class='carsModel' index='" + j + "'>" + years[j].year + '</em>');
                        }
                        $('.YearsText em').remove();
                        $('.cheXingPeiZhiText em').remove();
                        $('.YearsText').off().on("click", "em", function () {
                            $(this).addClass('addUnlimitedCss').siblings().removeClass('addUnlimitedCss');
                            //每点击年份一次清空车型配置数据
                            $('.cheXingPeiZhiText em').remove();
                            //当前选中的年份下标
                            var index = $('.YearsText .addUnlimitedCss').attr("index");
                            $page.methods.renderModelList(years, index);
                        }).append(html.join(""));
                        //默认选中第一个年份
                        $('.YearsText em:first').addClass("addUnlimitedCss");
                        //关联车型配置
                        var index = $('.YearsText .addUnlimitedCss').attr("index");
                        $page.methods.renderModelList(years, index);
                        break;
                    }
                }
            },


            //车型配置接口
            renderModelList: function (data, index) {
                if (data.length > 0) {
                    var html = [], data1 = data[index].modelList;
                    for (var j = 0, l = data1.length; j < l; j++) {
                        html.push("<em uid='" + data1[j].id + "' class='carsModel'>" + data1[j].name + '</em>');
                    }
                    $('.cheXingPeiZhiText em').remove();
                    $('.cheXingPeiZhiText').off().on("click", "em", function () {
                        $(this).addClass('addUnlimitedCss').siblings().removeClass('addUnlimitedCss');
                        //筛选条件
                        $page.methods.screen();
                        var cheXingPeiZhiid = $('.cheXingPeiZhiText .addUnlimitedCss').attr("uid");
                        //真实数据接口
                        $page.methods.loadImgList(cheXingPeiZhiid);
                    }).append(html.join(""));
                    $('.cheXingPeiZhiText em:first').addClass("addUnlimitedCss");
                    var cheXingPeiZhiid = $('.cheXingPeiZhiText .addUnlimitedCss').attr("uid");
                    //真实数据接口
                    $page.methods.loadImgList(cheXingPeiZhiid);
                }
                //筛选条件
                $page.methods.screen();
            },


            //根据车型的id加载汽车图片列表；
            loadImgList: function (imgId) {
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getCarList", //绝对路径
                    data: {
                        id: imgId, order: 1,
                        // id: 15501, order: 1,
                    }, //数据，这里使用的是Json格式进行传输
                    success: function (Response) {
                        var Response = $.parseJSON(Response)
                        if (Response.rspCode == "0000") {
                            $('.recommendT').html("");
                            var data = Response.data.priceList;
                            if (data.length <= 0) {
                                $(".num").text(0);
                                $(".recommendT").hide();
                                $(".list_no").show();
                            } else {
                                $(".recommendT").show();
                                $(".list_no").hide();
                                //显示找到的车辆数；
                                $(".num").text(data.length);
                            }
                            var aa = Response.data.page.total;
                            var nums = 16; //每页出现的数量
                            var pages = Math.ceil(aa / nums);

                            var thisDate = function (curr) {
                                //最后一页界限
                                last = curr * nums;
                                if (last >= data.length) {
                                    last = data.length;
                                }
                                for (var i = curr * nums - nums; i < last; i++) {
                                    $common.methods.initModel(data, i);
                                    var area = data[i].region;
                                    var require = data[i].requirementInfo;
                                    $common.methods.model(data, i, ".recommendT",area,require);
                                    $('.recommendT li').addClass('carList');
                                    //跳转详情页面
                                    $page.methods.details();
                                }
                            };
                            //调用分页插件
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
                                    $('.recommendT').html("");
                                    thisDate(obj.curr);
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
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },


            //切换品牌
            brandCar: function () {
                $('.brandOne').click(function () {
                    $(this).addClass('addSpanCss').siblings().removeClass('addSpanCss');
                    var spanUid = $(this).attr('uid');
                    //重新调用车型，车系接口
                    $page.methods.CarSeriesAjax(spanUid);
                });
            },


            //切换车型、车系
            LoadContent: function (xl, carList) {
                //车系的选择
                $('.carsOne').click(function () {
                    var Index = $(this).index();
                    $('.carModelsText').html('');
                    for (var i = 0; i < carList[Index].seriesList.length; i++) {
                        var data1 = carList[Index].seriesList[i];
                        var spanContent = "<span class='carsModel' uid=" + data1.id + '>' + data1.name + '</span>';
                        $('.carModelsText').append(spanContent);
                        $(".carModelsText .carsModel:first").attr("class", "carsModel addSpanCss");
                    }
                    $(this).addClass('addSpanCss').siblings().removeClass('addSpanCss');
                    carsModel();
                    //筛选条件
                    $page.methods.screen();
                });
                //车型的选择
                carsModel();
                function carsModel() {
                    var carXingUid = $('.carModelsText .addSpanCss').attr('uid');
                    var Index = $('.carsText .addSpanCss').index();
                    // debugger
                    $page.methods.renderYear(carList, Index, carXingUid);
                    $('.carModelsText .carsModel').click(function () {
                        $(this).addClass('addSpanCss').siblings().removeClass('addSpanCss');
                        var carXingUid = $(this).attr('uid');
                        var Index = $('.carsText .addSpanCss').index();
                        $page.methods.renderYear(carList, Index, carXingUid);
                    });
                }
            },


            //筛选条件变化
            screen: function () {
                $('.carName').html('');
                var arr1 = $('.addSpanCss');
                for (var a = 0; a < arr1.length; a++) {
                    var str1 = "<span>" + arr1[a].innerText + "</span>";
                    $('.carName').append(str1);
                }
                var arr2 = $('.addUnlimitedCss');
                for (var b = 0; b < arr2.length; b++) {
                    var str2 = "<span>" + arr2[b].innerText + "</span>";
                    $('.carName').append(str2);
                }
            },

            //数据点击跳转详情
            details: function () {
                $(".carList").click(function () {
                    window.location.href = "product_details.html?id=" + $(this).attr("id");
                })
            },

            //重置按钮的点击事件
            reset:function(){
                $(".result>button").click(function(){
                    $(this).css("color","#dc2827");
                    $page.methods.AutomobileBrandAjax();
                })
            },
            //首页点击更多进来显示：
            CarMarketAjax: function () {
                dataIndex();
                function dataIndex() {
                    $.ajax({
                        cache: "false",
                        type: "POST", //提交方式
                        url: root_path + "market/getMainList", //绝对路径
                        data: {
                            type:1,//type需要改
                            token: window.sessionStorage.getItem('token'),
                        },
                        dataType: 'json',
                        success: function (Response) {
                            // console.log(Response)
                            if (Response.rspCode == "0000") {
                                var data = Response.data.mainList;
                                var aa = Response.data.page.total;
                                var nums =8; //每页出现的数量
                                var pages = Math.ceil(aa / nums);
                                var thisDate = function (curr) {
                                    //最后一页界限
                                    last = curr * nums;
                                    if (last >= data.length) {
                                        last = data.length;
                                    }
                                    for (var i = curr * nums - nums; i < last; i++) {
                                        $common.methods.initModel(data, i);
                                        var area = data[i].region;
                                        var require = data[i].requirement;
                                        $common.methods.model(data, i, ".CarMarket",area,require);
                                    }
                                };
                                //调用分页插件
                                laypage({
                                    cont: $('.jumpPage1'), //容器。值支持id名、原生dom对象，jquery对象,
                                    pages: pages, //总页数
                                    skip: true, //是否开启跳页
                                    skin: '#e44523',//选中状态的背景色
                                    groups: 5,//可视页数
                                    first: 1, //将首页显示为数字1,。若不显示，设置false即可
                                    last: pages, //将尾页显示为总页数。若不显示，设置false即可
                                    prev: '<', //若不显示，设置false即可
                                    next: '>', //若不显示，设置false即可
                                    jump: function (obj, first) {
                                        $('.CarMarket').html("");
                                        thisDate(obj.curr);
                                        $('.CarMarket li ').click(function () {
                                            // 经销商资源进入的
                                            var carId = $(this).attr('id');
                                            window.location.href = "product_details.html?id=" + carId;
                                        });
                                    }
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
            },
            //首页搜索进入：
            carsearch:function (keyword) {
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "market/getMainList", //绝对路径
                    data: {
                        keywords: keyword,
                        token: window.sessionStorage.getItem('token'),
                        type:1
                    }, //数据，这里使用的是Json格式进行传输
                    success: function (data) {
                        var datas = $.parseJSON(data);

                        if (datas.rspCode == "0000") {
                            var data = datas.data.mainList;
                            var aa = datas.data.page.total;
                            var nums =8; //每页出现的数量
                            var pages = Math.ceil(aa / nums);
                            var thisDate = function (curr) {
                                //最后一页界限
                                last = curr * nums;
                                if (last >= data.length) {
                                    last = data.length;
                                }
                                for (var i = curr * nums - nums; i < last; i++) {
                                    $common.methods.initModel(data, i);
                                    var area = data[i].region;
                                    var require = data[i].requirement;
                                    $common.methods.model(data, i, ".CarMarket1",area,require);
                                }
                            };
                            //调用分页插件
                            laypage({
                                cont: $('.jumpPage2'), //容器。值支持id名、原生dom对象，jquery对象,
                                pages: pages, //总页数
                                skip: true, //是否开启跳页
                                skin: '#e44523',//选中状态的背景色
                                groups: 5,//可视页数
                                first: 1, //将首页显示为数字1,。若不显示，设置false即可
                                last: pages, //将尾页显示为总页数。若不显示，设置false即可
                                prev: '<', //若不显示，设置false即可
                                next: '>', //若不显示，设置false即可
                                jump: function (obj, first) {
                                    $('.CarMarket1').html("");
                                    thisDate(obj.curr);
                                    $('.CarMarket1 li ').click(function () {
                                        var carId = $(this).attr('id');
                                        window.location.href = "product_details.html?id=" + carId;
                                    });
                                }
                            });

                        }else if(datas.rspCode == "1001"){
                            layer.open({
                                content: data.rspDesc,
                                yes: function(index, layero){
                                    window.location.href = "log_in.html";
                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                }
                            });
                        }else {
                            layer.alert(datas);
                        }
                    }
                })
            }
        };

        return $page.methods;
    };
})(jQuery);






