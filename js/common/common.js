// var root_path = "http://zl0318.6655.la:14335/";
// var root_path = "http://223.202.123.125:8080/cheshijia/api/";
// var root_path = "http://121.196.194.52:8081/cheshijia/api/";

// var root_path = "http://114.215.84.189:8085/cheshijia/api/";
var root_path = "http://www.icarspace.cn/cheshijia/api/";
// JavaScript Document
(function ($) {
    $.common = function () {
        var $common = {}, subIndex = secIndex = -1;
        $common.methods = {
            init: function () {
                $common.isFile = false;
                $common.page = null;
                //加载页面上所有的data-htmlfile
                $common.loadHtml.setup(function () {
                    $common.methods.run();
                });
            },
            run: function () {
                try {
                    $common.page = new $.page();
                    $common.page.init();
                } catch (e) {
                };//异步执行每个view页面的入口
                this.event();
            },

            event: function () {
                //每个页面引入header和footer部分；
                $("header").load("page_header.html", function (responseTxt, statusTxt, xhr) {
                    if (statusTxt == "success") {
                        $(".logoLeft").click(function () {
                            window.location.href = "index.html";
                        });
                        if (sessionStorage.getItem("token") == null) {
                            $(".rightInfo>.location").css('margin-right', "0px");
                            $(".login_no").show();
                            $(".login_ok").hide();
                            $(".personInformation").removeAttr("href");
                            $(".personInformation").click(function () {
                                layer.open({
                                    content: '请登录！',
                                    yes: function(index, layero){
                                        window.location.href = "log_in.html";
                                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    }

                                })
                            })
                        } else {
                            $(".rightInfo>.location").css('margin-right', "65px");
                            $(".login_no").hide();
                            $(".login_ok").show();
                        }
                        //已登录用户点击头像
                        $(document).click(function (e) {
                            var target = $(e.target);
                            if (target[0].className == "img_list") {
                                $(".dropDown").show();
                            } else {
                                $(".dropDown").hide();
                            }
                        });
                        //用户登出事件
                        $(".login_out").click(function(){
                            $.ajax({
                                type:"POST",
                                url:root_path+"account/logout",
                                dataType:"json",
                                data:{
                                    token:sessionStorage.getItem("token")
                                },
                                success:function(Response){
                                    sessionStorage.removeItem("grade");
                                    sessionStorage.removeItem("listTypt");

                                    sessionStorage.removeItem('token' );
                                    sessionStorage.removeItem('userName' );
                                    sessionStorage.removeItem('resource')
                                    sessionStorage.removeItem('findCar')
                                    window.location = "log_in.html";
                                }
                            })
                        });

                        //logo点击事件:
                        $('.logoLeft').click(function () {
                            window.location.href = "index.html";
                        });
                        $('.telephoneHotline_right span').html(sessionStorage.getItem('userName'));
                        if (sessionStorage.getItem('userName') == null) {//alert(1111);
                            $('.telephoneHotline_right span').html('请登录');
                            $('.telephoneHotline_right span').click(function () {
                                window.location.href = "log_in.html";
                            });
                        } else {
                            $('.telephoneHotline_right span').click(function () {
                                window.location.href = "main_personal_center_home.html"
                            });
                        }
                        // $common.methods.search();
                        $common.methods.personal_information()
                    }
                    if (statusTxt == "error") {
                        layer.alert("Error: " + xhr.status + ": " + xhr.statusText)
                    }
                });
                $("footer").load("page_footer.html", function (responseTxt, statusTxt, xhr) {
                    if (statusTxt == "success") {//alert("外部内容加载成功！");
                        $('.AboutUs').click(function () {
                            window.location = "about_us.html";
                        });
                    }
                    if (statusTxt == "error") {
                        layer.alert("Error: " + xhr.status + ": " + xhr.statusText)
                    }
                });
                //加载personal公共部分的列表
                $(".pesonalCenterHomeL").load("com_personal.html", function (responseTxt, statusTxt, xhr) {
                    if(window.location.pathname.search("Resources")==-1){
                        if(window.location.pathname.search("My-match")==-1){
                            sessionStorage.setItem('MachActive01',false);
                            sessionStorage.setItem('MachActive02',false);
                            sessionStorage.setItem('listTypt',2)
                        }
                    }
                    if (statusTxt == "success") {
                        $common.methods.personal_information()
                        $.ajax({
                            type: "POST", //提交方式
                            url: root_path + "account/getCert", //绝对路径
                            data: {
                                token: sessionStorage.getItem("token"),
                            }, //数据，这里使用的是Json格式进行传输
                            dataType: 'json',
                            success: function (Response) {
                                if (Response.rspCode == "0000") {
                                    var data = Response.data;
                                    $('.resultText').html(data.status);
                                    if (data.status == "已通过认证") {
                                        $(".personBtn").hide();
                                        if (data.img4 != "") {
                                            $(".carIdBtn").attr("src", data.img4)
                                        }
                                        if (data.img5 != "") {
                                            $(".carIdBtnT").attr("src", data.img5)
                                        }
                                        if (data.img1 != "") {
                                            $(".addImgClick").attr("src", data.img1)
                                        }
                                        if (data.img2 != "") {
                                            $(".addImgClickTwo").attr("src", data.img2)
                                        }
                                        if (data.img4 != "") {
                                            $(".addImgClickThree").attr("src", data.img3)
                                        }
                                        if (data.idcard != "") {
                                            $(".idCard").val(data.img3)
                                        }
                                        if (data.idcard != "") {
                                            $(".idCard").val(data.img3)
                                        } else {
                                            $(".idCard").attr("placeholder", "");
                                            $(".idCard").attr("disabled", "disabled");
                                        }
                                        if (data.idcardlicenceorg != "") {
                                            $(".idlicenceorg").val(data.idcardlicenceorg)
                                        } else {
                                            $(".idlicenceorg").attr("placeholder", "");
                                            $(".idlicenceorg").attr("disabled", "disabled");
                                        }
                                        if (data.idcardvalidity != "") {
                                            $(".idvalidity").val(data.idcardvalidity)
                                        } else {
                                            $(".idvalidity").attr("placeholder", "");
                                            $(".idvalidity").attr("disabled", "disabled");
                                        }
                                    } else {
                                        $(".personBtn").show();
                                    }
                                }
                                //成功后跳转至个人中心页面；
                                //window.location.href="main_personal_center_home.html";
                            },
                            error: function () {
                                //alert("error");
                            }

                        });
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
                                    $('#resource').text(Response.data.mainList.length);
                                    if(Response.data.mainList.length!=0){
                                        $('.resoure').show()
                                    }else {
                                        $('.resoure').hide()
                                    }
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
                                    $('#findCar').text(Response.data.mainList.length);
                                    if(Response.data.mainList.length!=0){
                                        $('.findCar').show()
                                    }else {
                                        $('.findCar').hide()
                                    }
                                }
                            }
                        });
                        var num=parseInt(sessionStorage.getItem('resource'))+parseInt(sessionStorage.getItem('findCar'));
                        if(num){
                            $('#totleNum').text(num);
                            $('.totleNum').show()
                        }else {
                            $('.totleNum').hide()
                        }

                        //我的匹配菜单选中效果
                        if(sessionStorage.getItem('listTypt')==2){
                            $(".Mach").hide();
                        }else {
                            $(".Mach").show();
                        }
                        //给标题添加点击事件
                        $(".MachFirst").click(function () {
                            if($('.Mach').css('display') == 'none'){
                                $(this).next().slideDown().parent().siblings().children(".Mach").slideUp();
                                sessionStorage.setItem('listTypt',1);
                            }
                            else{
                                $(this).next().slideUp().parent().siblings().children(".Mach").slideDown();
                                sessionStorage.setItem('listTypt',2)
                            }
                        });
                        //点击其他菜单去掉选中效果
                        $('.orderList').click(function () {
                            sessionStorage.setItem('MachActive01',false);
                            sessionStorage.setItem('MachActive02',false);
                            sessionStorage.setItem('listTypt',2)
                        });
                        $('.Mach01').click(function(){
                            sessionStorage.setItem('MachActive01',true);
                            sessionStorage.setItem('MachActive02',false);
                        });
                        $('.Mach02').click(function(){
                            sessionStorage.setItem('MachActive01',false);
                            sessionStorage.setItem('MachActive02',true)
                        });
                        if(sessionStorage.getItem('MachActive01')==='true'){
                            $('.Mach01 a').addClass('matchActive')
                        }else if(sessionStorage.getItem('MachActive02')==='true'){
                            $('.Mach02 a').addClass('matchActive')
                        }
                    }
                    if (statusTxt == "error") {
                        //alert("Error: " + xhr.status + ": " + xhr.statusText);
                    }
                });
                //点击关于我们跳转到关于我们页面；
                $('.aboutUs').click(function () {
                    window.location = "about_us.html";
                });
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };


            },
            personal_information: function () {

                //如果有个人信息修改是else，如果没有是注册时的用户名；
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "account/getMember", //绝对路径
                    data: {
                        token: sessionStorage.getItem("token"),
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (user) {
                      //  console.log(user)
                        if (user.rspCode == "0000") {
                            sessionStorage.setItem('userImg',user.data.photourl);
                            user.data.photourl=user.data.photourl?user.data.photourl:'imgs/personM.png'
                            $('.personalCertificate img').attr("src",user.data.photourl);
                            $('.personName').html(user.data.name);
                            var data = user.data;
                            if (data.name == "") {
                                $(".dropDown p span:nth-of-type(1)").text(data.mobile);
                                $(".dropDown p span:nth-of-type(2)").text(data.grade);
                            } else {
                                $(".dropDown p span:nth-of-type(1)").text(data.name);
                                $(".dropDown p span:nth-of-type(2)").text(data.grade);
                            }
                            if (data.photourl != "") {
                                $(".dropDown p img").attr("src", data.photourl);
                                $(".login_ok>img").attr("src", data.photourl);
                            }
                        }
                    },
                    error: function () {
                        //alert("error");
                    }

                });
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "information/getMessageNoReadCount", //绝对路径
                    data: {
                        token: sessionStorage.getItem("token"),
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (user) {
                        // debugger
                        var messageNoReadCount=user.data.messageNoReadCount;
                        sessionStorage.setItem('messageNoReadCount',messageNoReadCount)
                        if (messageNoReadCount) {
                            $(".dropDown a span em").text(messageNoReadCount);
                        } else {
                            $(".dropDown a span").text('');
                        }
                    },
                    error: function () {
                        //alert("error");
                    }

                });

            },

            //初始化车源信息（测试使用）
            // 参数1：响应数据(data)   参数2：循环遍历的当前数据(i)
            initModel: function (data, i) {
                if(data[i].img==""){
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
                //请求过来的测试数据有的字段为空，这里先使用固定值
                // data[i].tel ='17800000000';
            },


            //每个页面显示的车源信息
            /*
            参数1：响应数据(data)
            参数2：循环遍历的当前数据(i)
            参数3: 父级(parentObj)
            参数4：区域(area)
            参数5：要求(require)
            */
            model: function (data, i, parentObj, area, require) {
                //优惠规则值
                data[i].guideprice1 = parseFloat(data[i].guideprice1);
                data[i].feevalue = parseFloat(data[i].feevalue);
                switch (data[i].feerule) {
                    case "优惠":
                        var ruleStr = "直降" + (data[i].feevalue).toFixed(2) + "万";
                        var ruleStr1 = "优惠金额";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);
                        var rulePriceTotal=(rulePrice-rulePrice1).toFixed(2);
                        break;
                    case "下点":
                        var ruleStr = "下" + (data[i].feevalue).toFixed(2) + "点";
                        var ruleStr1 = "优惠点数";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);

                        var rulePriceTotal=((rulePrice*(1-(rulePrice1*0.01))).toFixed(2));

                        break;
                    case "直接报价":
                        var ruleStr = "直接报价" + (data[i].feevalue).toFixed(2) + "万";
                        var ruleStr1 = "直接报价";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);
                        rulePrice=rulePrice1;
                        var rulePriceTotal=(rulePrice).toFixed(2);

                        break;
                    case "电议":
                        var ruleStr =  "电议";
                        var ruleStr1 = "电议";
                        var rulePriceTotal= "";


                        break;
                    case "加":
                        var ruleStr = "加" + (data[i].feevalue).toFixed(2) + "万";
                        var ruleStr1 = "加价金额";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);
                        var rulePriceTotal=(rulePrice1+rulePrice).toFixed(2);


                        break;
                    case "2186":
                        var ruleStr = "下" + (data[i].feevalue).toFixed(2) + "点";
                        var ruleStr1 = "优惠点数";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);
                        var rulePriceTotal=((rulePrice*(1-(rulePrice1*0.01))).toFixed(2));
                        break;
                    case "2187":
                        var ruleStr = "直降" + (data[i].feevalue).toFixed(2) + "万";
                        var ruleStr1 = "优惠金额";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);
                        var rulePriceTotal=((rulePrice-rulePrice1).toFixed(2));

                        break;
                    case "2188":
                        var ruleStr ="加" + (data[i].feevalue).toFixed(2) + "万";
                        var ruleStr1 = "加价金额";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);
                        var rulePriceTotal=(rulePrice1+rulePrice).toFixed(2);
                        break;
                    case "2189":
                        var ruleStr = "直接报价" + (data[i].feevalue).toFixed(2) + "万";
                        var ruleStr1 = "直接报价";
                        var rulePrice1=Number(data[i].feevalue);
                        var rulePrice=Number(data[i].guideprice1);
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
                    "<span class='orderPrice   price price"+i+"'><em>" + rulePriceTotal + "</em><em>万</em></span>" +
                    "<span class='lowPrice'><em class='guidedata.cardiscount'>" + ruleStr + "</em></span>" +
                    "</p>" +
                    "<p class='primaryPrice clearfix'>" +
                    "<span>" +ruleStr1+ "</span>" +
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
                $(parentObj).append(listModel);
                if(rulePriceTotal=="0.00"||rulePriceTotal == ""||rulePriceTotal == "undefined"){
                    $(parentObj+" .price"+i).html("<em>电议</em>");
                }

                if (window.sessionStorage.getItem("token") == null) {
                    $('.notLogin').show();
                    $('.carBottom').hide();
                    $('.primaryPrice').hide()
                    $('.primaryPriceNodata').show()
                } else {
                    $('.notLogin').hide();
                    $('.carBottom').show();
                    $('.primaryPrice').show()
                    $('.primaryPriceNodata').hide()
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
                    $(parentObj).find('.star' + i).append(starOn);
                }
                for (var a = 0; a < 5 - starNum; a++) {
                    var starOff = "<img src='./imgs/star_off.png'>"
                    $(parentObj).find('.star' + i).append(starOff);
                }
                //汽车要求(requirement)
                var requirList = require.split(",");
                for (var j = 0; j < requirList.length; j++) {
                    if (requirList!="" && j < 3) {
                        var requirStr = "<span>" + requirList[j] + "</span>";
                        $(parentObj).find('.shopInfo' + i).append(requirStr);
                    }
                }

            },
        }
        /*************************************加载外部html**********************/
        $common.loadHtml = {
            setup: function (callback) {
                this.callback = callback || null;
                this.total = $("[data-htmlfile]").size();
                if (this.total == 0) {
                    if (callback) callback();
                    return;
                }
                this.count = 0;
                this.run();
            },
            run: function () {
                $("[data-htmlfile]").each(function (index, element) {
                    $common.loadHtml.load($(this), $(this).attr("data-htmlfile"), function () {
                        $common.loadHtml.count++;
                        if ($common.loadHtml.count == $common.loadHtml.total) {
                            if ($common.loadHtml.callback) $common.loadHtml.callback();
                        }
                        ;
                    });
                });
            },
            load: function (el, url, callback) {
                $.ajax({
                    url: url, data: null, type: "GET", dataType: "html", success: function (data) {
                        $common.isFile = true;
                        el.replaceWith(data);
                        if (callback) callback();
                    }, error: function () {
                        if (callback) callback();
                    }
                });
            }
        };
        /****************************获取url信息***************************************/
        $common.getUrlParam = function (name, decodeFN) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) {
                if (decodeFN) {
                    return decodeFN(r[2]);
                }
                return unescape(r[2]);
            }
            return null; //返回参数值
        };
        /**************************************开发**************************/

        $common.dev = {
            //根据key值返回对应弹层的url地址（string类型），key和返回值对应数据可参考catch里面信息
            getPopUrl: function (key) {
                try {
                    return getPopUrl(key);
                } catch (e) {
                    //购物车
                    if (key == "popTest")return "compments/pop_test.html";
                    if (key == "registerSuccess")return "compments/popup_register_success.html";
                }
                ;
            },
            //根据key值返回对应ajax请求的url地址（object类型，包含有url，type，及后端需要的字段），key和返回值对应数据可参考catch里面信息
            getAjaxUrl: function (key) {
                try {
                    return getAjaxUrl(key);
                } catch (e) {
                    if (key == "myOrderList")return {
                        url: root_path + "car/getBrand",
                        type: "post",
                        dataType: 'json',
                        data: {}
                    };
                }
                ;
            },
            //加载更多模块初始化数据
            getListData: function (key, data, isUpdata) {
                //将数据提交到页面入口js中
                $common.page.loadData(key, data, isUpdata);
            },
            setObjData: function (key) {

            }
        };
        /***************加载更多数据********************/
        $common.loadingMore = {
            run: function (el) {
                var key = $(el).attr("data-key");
                //获取ajax-url
                var obj = $common.dev.getAjaxUrl(key);
                //请求ajax
                new $.setAjax({
                    url: obj.url, data: obj.data, type: obj.type, dataType: "json",
                    success: function (data) {
                        $common.dev.getListData(key, data);
                    }, error: function () {
                    }
                });
            }
        };
        //获取URL地址参数

        return $common;
    }
})(jQuery);
var $common = null;
jQuery(function () {
    $common = new jQuery.common();
    $common.methods.init();
});

function formatDate(now) {
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var date=now.getDate();
    return year+"-"+month+"-"+date;
}
//弹框
function alert(e){
    $("body").append('<div class="mask"></div><div id="msg"><div id="msg_top">信息<span class="msg_close">×</span></div><div id="msg_cont">'+e+'</div><div class="msg_close" id="msg_clear">确定</div></div> ');
    $('.mask').css({
        'position':'fixed',
        'top':'0',
        'width':'100%',
        'height':'100%',
        'background':'black',
        'opacity':'0.3',
        'left':'0'
    }),
    $(".msg_close").click(function (){
        $("#msg").remove();
        $('.mask').remove()
    });
}
//cokkie
//hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。
