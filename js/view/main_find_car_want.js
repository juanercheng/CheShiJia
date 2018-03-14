// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        var imgId='';
        var regionidLength=0;
        var color1Length,color2Length;
        $page.methods = {
            init: function () {
                if (sessionStorage.getItem('token') == null) {
                    $(".mask-alert>div").html('请登录！');
                    $(".mask-alert").show();
                    window.location.href = "log_in.html";
                } else {
                    var grade = sessionStorage.getItem('grade');
                    if(grade=="未认证"){
                        layer.confirm("发布寻车资源需要进行身份认证，确认继续？",function(index){
                            window.location.href = "authentication.html?authNum=1";
                        },function(){
                            window.location.href = "main_find_car.html";
                        });
                    }
                    //获取规格等信息；
                    this.standard();
                }
                sessionStorage.setItem('colorData',null);
            },

            standard: function () {
                imgId = GetQueryString('id');
                if (imgId!='') {
                    $page.methods.modified();
                }
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };


                //汽车规格接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "common/getCarSpecifications", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            for (var i = 0; i < Response.data.length; i++) {
                                var data = Response.data[i];
                                var LiContent = "<em id=" + data.id + '>' + data.name + "</em>";
                                $('.guiGe').append(LiContent).attr("data-id", data.id);
                            }
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                        //选取规格时间调用；
                        $page.methods.clickCarId();
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //汽车品牌接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getBrand", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            for (var i = 0; i < Response.data.brandList.length; i++) {
                                var data = Response.data.brandList[i];
                                var spanContent = "<em class='brandOne' uid=" + data.id + '  initia=' + data.letter + ">" + data.name + '</em>';
                                $('.pinPai').append(spanContent);
                            }
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //提车时间接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "common/getGetCarTime", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.intDispalynTime').html("");
                            for (var i = 0; i < Response.data.length; i++) {
                                var data = Response.data[i];
                                var LiContent = "<li id=" + data.id + '>' + data.name + "</li>";
                                $('.intDispalynTime').append(LiContent);
                            }
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //销售区域接口（界面显示提车区域）
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "common/getSaleArea", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.regionArea').html("");
                            for (var i = 0; i < Response.data.length; i++) {
                                var data = Response.data[i];
                                var LiContent = "<span id='" + data.id + "'>" + data.name + "</span>";
                                $('.regionArea').append(LiContent);
                                sessionStorage.setItem('carAreaId','');
                            }
                            //点击提车区域，选择参数
                            var regionArr = [];
                            $(".regionArea span").click(function () {
                                if ($(this).is(".chooseRequire")) {
                                    $(this).removeClass("chooseRequire");
                                    var index = regionArr.indexOf($(this).attr("id"));
                                    regionArr.splice(index, 1);
                                } else {
                                    $(this).addClass("chooseRequire");
                                    regionArr.push($(this).attr("id"));
                                    if($(this).attr("id")==4){
                                        $(this).siblings().removeClass("chooseRequire");
                                        regionArr = [$(this).attr("id")];
                                    }else{
                                        $(this).siblings("[id=4]").removeClass("chooseRequire");
                                        var index = regionArr.indexOf( $(this).siblings("[id=4]").attr("id"));
                                        if(index!= -1){
                                            regionArr.splice(index, 1);
                                        }
                                        var length=regionidLength+ regionArr.length
                                        if(length==Response.data.length-1){
                                            $(this).addClass("chooseRequire");
                                            setTimeout(function () {
                                                $(".regionArea span").removeClass("chooseRequire");
                                            },300)
                                            setTimeout(function () {
                                                $(".regionArea #4").addClass("chooseRequire");
                                            },400)
                                            regionArr = ["4"];
                                            regionidLength=0;
                                        }
                                    }
                                }
                                var regionStr = regionArr.join();
                                sessionStorage.setItem('carAreaId', regionStr);
                            })
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //车辆状态接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "common/getCarStatus", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.carStatus').html("");
                            for (var i = 0; i < Response.data.length; i++) {
                                var data = Response.data[i];
                                var LiContent = "<span id='" + data.id + "'>" + data.name + "</span>";
                                $('.carStatus').append(LiContent);
                                sessionStorage.setItem('carStatusId','');
                            }
                            //点击车辆状态,选择参数
                            $(".carStatus span").click(function () {
                                if(imgId){
                                    $(".carStatus span").css({
                                        "background": "white",
                                        "color": "#d43712",
                                    });
                                    $(this).css({
                                        "background": "#d43712",
                                        "color": "white",
                                    });
                                    $(this).siblings().removeClass("chooseRequire");
                                }else {
                                    $(".carStatus span").css({
                                        "background": "white",
                                        "color": "#d43712",
                                    });
                                    $(this).css({
                                        "background": "#d43712",
                                        "color": "white",
                                    });
                                }

                                sessionStorage.setItem('carStatusId', $(this).attr("id"));
                            });
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //价格规则接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "common/getCarFeeRule", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.expect .getcar').html("");
                            for (var i = 0; i < Response.data.length; i++) {
                                var data = Response.data[i];
                                if(data.id=="2187"){
                                    data.name="优惠金额"
                                }
                                var LiContent = "<span id='" + data.id + "'>" + data.name + "</span>";
                                $('.expect .getCar').append(LiContent);
                                sessionStorage.setItem('carRuleId', '');
                            }


                      //      console.log(Response)
                            //点击价格规则,选择参数
                            $(".expect .getCar span").click(function () {
                                if ($(this).attr("id") == "2186") {
                                    $(".expect em").text("点");
                                    $(".expect .priceNum").attr('placeholder','请输入优惠点数')
                                } else if($(this).attr("id") == "2187"){
                                    $(".expect em").text("万");
                                    var guideprice=sessionStorage.getItem('guideprice')
                                    guideprice=guideprice?guideprice:''
                                    var text='请输入期望成交价格(指导价：'+guideprice+')';
                                    $(".expect .priceNum").attr('placeholder',text)
                                }
                                else {
                                    $(".expect em").text("万");
                                    $(".expect .priceNum").attr('placeholder','请输入期望成交价格')
                                }

                                if ($(this).is(".chooseRequire")) {
                                    $(this).removeClass("chooseRequire");
                                    sessionStorage.removeItem('carRuleId');
                                } else {
                                    $(this).addClass("chooseRequire");
                                    $(this).siblings().removeClass("chooseRequire");
                                    sessionStorage.setItem('carRuleId', $(this).attr("id"));
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

                //特殊要求接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "common/getCarRequirementInfo", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.requireSpan').html("");
                            for (var i = 0; i < Response.data.length; i++) {
                                var data = Response.data[i];
                                var LiContent = "<span id='" + data.id + "'>" + data.name + "</span>";
                                $('.requireSpan').append(LiContent);
                                sessionStorage.setItem('carRequireId','');
                            }
                            //点击特殊要求，选择参数
                            var requireArr = [];
                            $(".requireSpan span").click(function () {
                                if ($(this).is(".chooseRequire")) {
                                    $(this).removeClass("chooseRequire");
                                    var index = requireArr.indexOf($(this).attr("id"));
                                    requireArr.splice(index, 1);
                                } else {
                                    $(this).addClass("chooseRequire");
                                    requireArr.push($(this).attr("id"));
                                }
                                var requireStr = requireArr.join();
                                sessionStorage.setItem('carRequireId', requireStr);
                            })
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //点击提车时间，选择参数
                $('.carTime').click(function () {
                    //取消事件冒泡
                    event.stopPropagation();
                    $(".intDispalynone").hide()
                    $(".intDispalynColor").hide()
                    $('.intDispalynTime').slideToggle(100);
                    $('.intDispalynTime li').click(function () {
                        var liHtml = $(this).html();
                        sessionStorage.setItem('carTimeId', $(this).attr('id'));
                        $('.carTime_text').html(liHtml).css({color: '#333'});
                        $('.intDispalynTime').slideUp(100);
                    });
                    $(document).click(function (event) { $('.intDispalynTime').slideUp(100) });
                });

                $('.carColor_text').click(function () {
                    if(sessionStorage.getItem('colorData')==='0'){
                        layer.alert("暂无可选颜色,请输入您期望的颜色！");
                        $(".carColor_choose").hide();
                        $('.carColor_text ').hide()

                        $(".carColor_input1").show();
                        $(".carColor_input2").show();
                        sessionStorage.setItem('carColor1',$(".carColor_input1").val());
                        sessionStorage.setItem('carColor2',$(".carColor_input2").val());
                    }else if(sessionStorage.getItem('colorData')=='null'){
                        alert("请先选择车型！");
                    }else{
                        //隐藏车辆信息
                        $(".intDispalynone").hide();
                        $(".carColor_choose").show();
                        $(".carColor_input1").hide();
                        $(".carColor_input2").hide();
                        //弹框选择颜色：
                        $(".colorBtn").click(function() {
                            var text1 = $(".outColorUl1 input:checkbox[name='message']:checked").map(function(index,elem) {
                                return $(elem).val();
                            }).get().join(',');
                            var text2 = $(".outColorUl2 input:checkbox[name='message']:checked").map(function(index,elem) {
                                return $(elem).val();
                            }).get().join(',');
                            //判断颜色选择
                            if(color1Length==0){
                                if($('.shuru1').val()==""){
                                    layer.alert("请输入外观颜色");
                                    return
                                }
                            }else{
                                if(text1==""&&$('.shuru1').val()==""){
                                    layer.alert("请选择或输入外观颜色");
                                    return
                                }
                            }
                            if(color2Length==0){
                                if($('.shuru').val()=="") {
                                    layer.alert("请输入内饰颜色");
                                    return
                                }
                            }else{
                                if(text2==""&&$('.shuru').val()=="") {
                                    layer.alert("请选择或输入内饰颜色");
                                    return
                                }
                            }
                            $(".carColor_text").hide();
                            $(".carColor_input1").show();
                            $(".carColor_input2").show();
                            $('.carColor_choose').hide();
                            if(color1Length!=0){
                                text1 = text1 + ',' + $('.shuru1').val();
                                sessionStorage.setItem('carColor1',text1);
                                $(".carColor_input1").val(text1);
                            }else {
                                sessionStorage.setItem('carColor1',$('.shuru1').val());
                                $(".carColor_input1").val($('.shuru1').val());
                            }
                            if(color2Length!=0){
                                text2=text2+','+$('.shuru').val();
                                $(".carColor_input2").val(text2);
                                sessionStorage.setItem('carColor2',text2);
                            }else {
                                sessionStorage.setItem('carColor2',$('.shuru').val());
                                $(".carColor_input2").val($('.shuru').val());
                            }

                        });

                        $(".colorBtn1").click(function() {
                            $('.carColor_choose').hide();
                        });

                    }
                });

                $('input,textarea').click(function () {
                    $(this).css({color: '#333'});
                });
                $page.methods.hotBrandAjax();
            },

            //修改“我要寻车”
            modified: function () {
                if(imgId){
                    $('.edit').show()
                    $(".add").hide()
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
                                var _obj=Response.data;
                                console.log(_obj);
                                if(_obj.addresstoid==='4'){
                                    regionidLength=0;
                                }else {
                                    regionidLength=_obj.addresstoid.split(",").length; //销售区域
                                }
                                sessionStorage.setItem('guideprice',_obj.guideprice);
                                sessionStorage.setItem('carStandId', _obj.specificationsid); //规格id
                                sessionStorage.setItem('carXingUid', _obj.carid); //车型id
                                sessionStorage.setItem('carTimeId', _obj.getcartimeid); //提车时间id
                                sessionStorage.setItem('carAreaId', _obj.addresstoid);   //期望区域id
                                sessionStorage.setItem('carStatusId', _obj.carstatus); //状态id
                                sessionStorage.setItem('carRequireId', _obj.requirement);  //特殊要求id
                                if(_obj.carid){
                                    sessionStorage.setItem('colorData', 1);  //特殊要求id
                                }
                                sessionStorage.setItem('carColor1',_obj.color1)
                                sessionStorage.setItem('carColor2',_obj.color2)
                                if(_obj.color1||_obj.color2){
                                    $('.carColor_text ').hide();
                                    // $('.carColor_text ').text('请选择').css('color','#999');
                                    $('.carColor_input1').show();
                                    $('.carColor_input2').show();
                                    $(".carColor_input1").val(_obj.color1) ;
                                    $(".carColor_input2").val(_obj.color2) ;
                                }
                                if(_obj.feevalue=="NaN"){
                                    _obj.feevalue="";
                                }
                                $(".carTime_text").text(_obj.getcartime).css({color: '#333'});
                                $(".registratAddress").val(_obj.licensearea).css({color: '#333'});
                                $(".priceNum").val(_obj.feevalue).css({color: '#333'});
                                $("textarea").val(_obj.remark).css({color: '#333'});
                                $(".primary").text(_obj.name).css({color: '#333'});

                                //车辆状态
                                if(_obj.carstatus===9){
                                    setTimeout(function () {
                                        $(".carStatus span:first-child").addClass("chooseRequire");

                                    },200)
                                }else if(_obj.carstatus===10){
                                    setTimeout(function () {
                                        $(".carStatus span:nth-child(2)").addClass("chooseRequire");
                                        $(".carStatus span:first-child").removeClass("chooseRequire");

                                    },200)
                                }else if(_obj.carstatus===2185){
                                    setTimeout(function () {
                                        $(".carStatus span:last-child").addClass("chooseRequire");
                                        $(".carStatus span:first-child").removeClass("chooseRequire");


                                    },200)
                                }

                                //期望成交价
                                if(_obj.feerule==="下点"){
                                    setTimeout(function () {
                                        $(".expect .priceCar  span:first-child").addClass("chooseRequire");

                                    },200)
                                    $(".expect em").text("点");
                                    sessionStorage.setItem('carRuleId',2186);
                                }else if(_obj.feerule==="优惠"){
                                    setTimeout(function () {
                                        $(".expect .priceCar  span:nth-child(2)").addClass("chooseRequire");
                                        $(".expect .priceCar  span:first-child").removeClass("chooseRequire");
                                    },200)

                                    $(".expect em").text("万");
                                    sessionStorage.setItem('carRuleId',2187);
                                }else if(_obj.feerule==="加"){
                                    setTimeout(function () {
                                        $(".expect .priceCar  span:nth-child(3)").addClass("chooseRequire");
                                        $(".expect .priceCar  span:first-child").removeClass("chooseRequire");
                                    },200)

                                    $(".expect em").text("万");
                                    sessionStorage.setItem('carRuleId',2188);
                                }else if(_obj.feerule==="直接报价"){
                                    setTimeout(function () {
                                        $(".expect .priceCar  span:last-child").addClass("chooseRequire");
                                        $(".expect .priceCar  span:first-child").removeClass("chooseRequire");
                                    },200)

                                    $(".expect em").text("万");
                                    sessionStorage.setItem('carRuleId',2189);
                                }
                                setTimeout(function () {
                                    addClass(_obj.addresstoid,$('.regionArea  span'),4)
                                    addClass(_obj.requirement,$('.requireSpan  span'),'')
                                },200)


                                //颜色
                                $.ajax({
                                    type: "POST", //提交方式
                                    url: root_path + "car/getCarColourInfo", //绝对路径
                                    data: {   //16419
                                        carid:Response.data.carid,
                                        colourType:''
                                    }, //数据，这里使用的是Json格式进行传输
                                    dataType: 'json',
                                    success: function (Response) {
                                        if (Response.rspCode == "0000") {
                                            $('.intDispalynColor').html("");
                                            var length=Response.data.length
                                            sessionStorage.setItem('colorData',length);
                                            //外观内饰颜色
                                            if(length>0){

                                                $('.carColor_input').click(function () {
                                                    $(".carColor_choose").show();
                                                });

                                                //弹出颜色框
                                                var arr1=[],arr2=[];
                                                for (var i = 0; i < Response.data.length; i++) {
                                                    var data = Response.data[i];
                                                    if(data.type==="1"){
                                                        arr1.push(Response.data[i])
                                                    }else if(data.type==="0") {
                                                        arr2.push(Response.data[i])
                                                    }
                                                }
                                                color1Length=arr1.length;
                                                color2Length=arr2.length;

                                                //外观
                                                if(color1Length!=0){
                                                    var LiContent1;
                                                    for (var j in arr1){
                                                        LiContent1 = "<li id=" + arr1[j].colourId + " >"
                                                            +"<label class='checkbox'>"
                                                            +"<input class='outCheckbox' name='message' type='checkbox' value="+arr1[j].color+" />"
                                                            + arr1[j].color + "</label>"
                                                            +"</li>";
                                                        $('.outColorUl1').append(LiContent1);
                                                    }
                                                }

                                                //内饰
                                                if(color2Length!=0){
                                                    var LiContent2;
                                                    for (var j in arr2){
                                                        LiContent2 = "<li id=" + arr2[j].colourId + " >"
                                                            +"<label class='checkbox'>"
                                                            +"<input class='outCheckbox' name='message' type='checkbox' value="+arr2[j].color+" />"
                                                            + arr2[j].color + "</label>"
                                                            +"</li>";
                                                        $('.outColorUl2').append(LiContent2);
                                                    }
                                                }

                                                $(".colorBtn").click(function() {
                                                    //判断颜色选择
                                                    var text1 = $(".outColorUl1 input:checkbox[name='message']:checked").map(function(index,elem) {
                                                        return $(elem).val();
                                                    }).get().join(',');
                                                    var text2 = $(".outColorUl2 input:checkbox[name='message']:checked").map(function(index,elem) {
                                                        return $(elem).val();
                                                    }).get().join(',');

                                                    if(color1Length==0){
                                                        if($('.shuru1').val()==""){
                                                            layer.alert("请输入外观颜色");
                                                            return
                                                        }
                                                    }else{
                                                        if(text1==""&&$('.shuru1').val()==""){
                                                            layer.alert("请选择或输入外观颜色");
                                                            return
                                                        }
                                                    }
                                                    if(color2Length==0){
                                                        if($('.shuru').val()=="") {
                                                            layer.alert("请输入内饰颜色");
                                                            return
                                                        }
                                                    }else{
                                                        if(text2==""&&$('.shuru').val()=="") {
                                                            layer.alert("请选择或输入内饰颜色");
                                                            return
                                                        }
                                                    }

                                                    if(color1Length!=0){
                                                        text1 = text1 + ',' + $('.shuru1').val();
                                                        sessionStorage.setItem('carColor1',text1);
                                                        $(".carColor_input1").val(text1);
                                                    }else {
                                                        sessionStorage.setItem('carColor1',$('.shuru1').val());
                                                        $(".carColor_input1").val($('.shuru1').val());
                                                    }
                                                    if(color2Length!=0){
                                                        text2=text2+','+$('.shuru').val();
                                                        $(".carColor_input2").val(text2);
                                                        sessionStorage.setItem('carColor2',text2);
                                                    }else {
                                                        sessionStorage.setItem('carColor2',$('.shuru').val());
                                                        $(".carColor_input2").val($('.shuru').val());
                                                    }

                                                    $(".carColor_text").hide();
                                                    $(".carColor_input1").show();
                                                    $(".carColor_input2").show();
                                                    $('.carColor_choose').hide();
                                                });

                                                $(".colorBtn1").click(function() {
                                                    $('.carColor_choose').hide();
                                                });
                                            }else if(length===0){
                                                $('.carColor_input').unbind("click")
                                            }
                                        }
                                    }
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
                //编辑显示选中的内容
                function addClass(arr,span,ids){
                    var strs= new Array(); 
                    strs=arr.split(",");  
                    for (i=0;i<strs.length ;i++ ) 
                        { 
                            span.map(function(){
                                if($(this).attr('id')==strs[i]){
                                    $(this).addClass("chooseRequire");
                                }
                                if(ids){
                                    if(span.length==strs.length+1){
                                        $(this).siblings("[id=ids]").addClass("chooseRequire");
                                    }
                                 }
                              })
                        } 
                }
                //我要寻车返回
                $('.edit .personalcenter').click(function () {
                    window.history.go(-2);
                })
                $('.edit .myCar_find').click(function () {
                    window.history.go(-1);
                })

            },
            //选择汽车规格，品牌，车系，车型,选择参数
            clickCarId: function () {
                $('.carStandard').click(function () {
                    //取消事件冒泡
                    event.stopPropagation();
                    $('.intDispalynone').slideToggle(100);
                    $(".intDispalynTime").hide()
                    $(".intDispalynColor").hide()
                    $('.guiGe em').click(function () {
                        event.stopPropagation();
                        $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                        var carStandId = $(this).attr('id');
                        sessionStorage.setItem('carStandId', carStandId);
                    });
                    $('.pinPai em').click(function () {
                        event.stopPropagation();
                        $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                        var carNameUid = $(this).attr('uid');
                        $page.methods.cheXi(carNameUid);
                    });
                });
                $(document).click(function (event) { $('.intDispalynone').slideUp(100) });
            },


            //根据选择的品牌获取id后选择车系；
            cheXi: function (uid) {
                //汽车车系接口
                $('.Years em').remove();
                $('.cheXingPeiZhi em').remove();

                function renderYear(data, Index, carXingUid) {
                    var html = [], data1 = data[Index].seriesList;
                    for (var i = 0, l = data1.length; i < l; i++) {
                        if (data1[i].id == carXingUid) {
                            var years = data1[i].yearList;
                            for (var j = 0, l = years.length; j < l; j++) {
                                html.push("<em class='carsModel' index='" + j + "'>" + years[j].year + '</em>');
                            }
                            $('.Years em').remove();
                            $('.cheXingPeiZhi em').remove();

                            $('.Years').off().on("click", "em", function () {
                                event.stopPropagation();
                                $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                                renderModelList(years, $(this).attr("index"));
                            }).append(html.join(""));
                            break;
                        }
                    }
                }

                function renderModelList(data, index) {
                    var html = [], data1 = data[index].modelList;
                    for (var j = 0, l = data1.length; j < l; j++) {
                        html.push("<em uid='" + data1[j].id + "' class='carsModel' guidePrice="+data1[j].guideprice+">" + data1[j].name + '</em>');
                    }
                    $('.cheXingPeiZhi em').remove();
                    $('.cheXingPeiZhi').append(html.join(""))
                        .off().on("click", "em", function () {
                        event.stopPropagation();
                        $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                        sessionStorage.setItem('carXingUid', $(this).attr("uid"));
                        var guiGe = $(".guiGe>.checkAddCss").text();
                        var pinPai = $(".pinPai>.checkAddCss").text();
                        var cheXing = $(".cheXing>.checkAddCss").text();
                        var cheId = $(".cheXing>.checkAddCss").attr("uid");
                        var guideprice=$(this).attr("guidePrice");
                        sessionStorage.setItem('carXing', cheId);
                        sessionStorage.setItem('guideprice', guideprice);
                        var cheXingpeizhi = $(this).text();
                        $(".primary").text(guiGe + ' ' + pinPai + ' ' + cheXing + ' ' + cheXingpeizhi)
                        $('.intDispalynone').slideUp(100);
                        getColor()
                    });
                }
                //外观内饰颜色接口
                function getColor() {
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "car/getCarColourInfo", //绝对路径
                        data: {
                            carid:sessionStorage.getItem('carXingUid'),
                            colourType:''
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                        //    console.log(Response);
                            if (Response.rspCode == "0000") {
                                $('.intDispalynColor').html("");
                                var length=Response.data.length
                                sessionStorage.setItem('colorData',length);
                                //外观内饰颜色
                                if(length>0){
                                    $(".intDispalynone").hide();
                                    $('.carColor_text ').text('请选择').css('color','#999');
                                    $('.carColor_text ').show();
                                    $('.carColor_text ').val('');
                                    $(".carColor_input1").hide();
                                    $(".carColor_input2").hide();
                                    $('.carColor_input').click(function () {
                                        $(".carColor_choose").show();
                                    })
                                    //弹出颜色框
                                    var arr1=[],arr2=[];
                                    for (var i = 0; i < Response.data.length; i++) {
                                        var data = Response.data[i];
                                        if(data.type==="1"){
                                            arr1.push(Response.data[i])
                                        }else if(data.type==="0") {
                                            arr2.push(Response.data[i])
                                        }
                                    }
                                    color1Length=arr1.length;
                                    color2Length=arr2.length;

                                    //外观
                                    if(color1Length!=0){
                                        var LiContent1;
                                        for (var j in arr1){
                                            LiContent1 = "<li id=" + arr1[j].colourId + " >"
                                                +"<label class='checkbox'>"
                                                +"<input class='outCheckbox' name='message' type='checkbox' value="+arr1[j].color+" />"
                                                + arr1[j].color + "</label>"
                                                +"</li>";
                                            $('.outColorUl1').append(LiContent1);
                                        }
                                    }

                                    //内饰
                                    if(color2Length!=0){
                                        var LiContent2;
                                        for (var j in arr2){
                                            LiContent2 = "<li id=" + arr2[j].colourId + " >"
                                                +"<label class='checkbox'>"
                                                +"<input class='outCheckbox' name='message' type='checkbox' value="+arr2[j].color+" />"
                                                + arr2[j].color + "</label>"
                                                +"</li>";
                                            $('.outColorUl2').append(LiContent2);
                                        }
                                    }
                                }else if(length===0){
                                    $('.carColor_input').unbind("click")
                                    $('.carColor_text').hide();
                                    $(".carColor_input1").show();
                                    $(".carColor_input2").show();
                                    $(".carColor_input1").val('');
                                    $(".carColor_input2").val('');
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
                var resultData;
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "car/getSeries", //绝对路径
                    data: {
                        id: uid,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            resultData = Response.data;
                            $('.cheXi em').remove();
                            $('.cheXing em').remove();
                            for (var u = 0; u < Response.data.length; u++) {
                                var data = Response.data[u];
                                var spanContent = "<em class='carsOne'>" + data.type + '</em>';
                                $('.cheXi').append(spanContent);
                                //车型
                                for (var i = 0; i < Response.data[u].seriesList.length; i++) {
                                    var data1 = Response.data[u].seriesList[i];
                                    var spanContent = "<em class='carsModel' uid=" + data.id + '>' + data1.name + '</em>';
                                    $('.cheXing').append(spanContent);
                                }
                            };
                            //点击车系选择车型，进行循环；
                            $('.cheXi em').click(function () {
                                event.stopPropagation();
                                $('.cheXing em').remove();
                                $('.Years em').remove();
                                $('.cheXingPeiZhi em').remove();

                                $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                                var Index = $(this).index();
                                for (var i = 0; i < Response.data[Index - 1].seriesList.length; i++) {
                                    var data1 = Response.data[Index - 1].seriesList[i];
                                    var spanContent = "<em class='carsModel' uid=" + data1.id + '>' + data1.name + '</em>';
                                    $('.cheXing').append(spanContent);
                                }
                                $('.cheXing em').click(function () {
                                    event.stopPropagation();
                                    $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                                    var carXingUid = $(this).attr('uid');
                                    renderYear(resultData, Index - 1, carXingUid);
                                });
                            });
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },

            //寻车接口（修改 新增）
            hotBrandAjax: function (url) {

                //点击提交后，调我要寻车接口；
                $('.findCarBtn').click(function () {
                    //获取URL地址参数
                    function GetQueryString(name) {
                        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                        var r = window.location.search.substr(1).match(reg);
                        if (r != null) return unescape(r[2]);
                        return null;
                    };
                    var Id = GetQueryString('id'); //修改寻车信息需要传入
                    var token = sessionStorage.getItem('token');//token
                    var carStandId = sessionStorage.getItem('carStandId');//规格id
                    var carXingUid = sessionStorage.getItem('carXingUid');//车型uid
                    var carTimeId = sessionStorage.getItem('carTimeId');//提车时间id
                    var carAreaId = sessionStorage.getItem('carAreaId');//期望区域id
                    var carStatusId = sessionStorage.getItem('carStatusId');//状态id
                    var guideprice=sessionStorage.getItem('guideprice');
                    var  guideprice = parseFloat(guideprice).toFixed(2);

                    var color1,color2;
                    if(sessionStorage.getItem('colorData')==='0'){
                        color1= $('.carColor_input1').val();
                        color2= $('.carColor_input2').val();
                    }else {
                        color1= sessionStorage.getItem('carColor1');  //颜色
                        color2= sessionStorage.getItem('carColor2');  //颜色
                    }
                    var registratAddress = $('.registratAddress').val(); //上牌地点
                    var carRequireId = sessionStorage.getItem('carRequireId'); //特殊要求id
                    var carRuleId = sessionStorage.getItem('carRuleId'); //价格规则id
                    var price = parseFloat($('.priceNum').val()).toFixed(2);
                    var remark = $("textarea").val(); //备注
                    var decreasePrice=price-guideprice;
                    //价格规则
                    var carRuleStr = "";
                    switch (carRuleId){
                        case "2186":
                            carRuleStr = "下点";
                            break;
                        case "2187":
                            carRuleStr = "优惠";
                            break;
                        case "2188":
                            carRuleStr = "加";
                            break;
                        case "2189":
                            carRuleStr = "直接报价";
                            break;
                        default:
                            break
                    }

                    if ($(".primary>i").text() != "") {
                        alert("请选择车辆信息！");
                        return
                    }
                    // if (!color1) {
                    //     alert('请选择/输入外观颜色！');
                    //     return
                    // }
                    // if (!color2) {
                    //     alert('请选择/输入内饰颜色！');
                    //     return
                    // }
                    if ($(".carTime_text").text() == "请选择提车时间") {
                        alert('请选择提车时间！')
                        return;
                    }
                    if ($('.registratAddress').val() == "") {
                        alert('请输入上牌地址！')
                        return;
                    }
                    if(!carAreaId){
                        alert("请选择提车区域！");
                        return
                    }
                    if(!carStatusId){
                        alert("请选择车辆状态！");
                        return
                    }
                    if(carRuleId){
                        var rec=/^-?\d+\.?\d{0,2}$/;   //两位小数
                        if (carRuleId==2186) {
                            if(!price){
                                alert('请输入优惠点数！');
                                $(".priceNum").focus();
                                return;
                            }else if (price < 0.01 || price > 99.99||rec.test(price)===false) {
                                alert('优惠点数应是0.01-99.99两位小数！');
                                $(".priceNum").focus();
                                return;
                            }
                        }else if(carRuleId==2187){
                            if(!price){
                                alert('请输入优惠金额！');
                                $(".priceNum").focus();
                                return;
                            }else if (price < 0.01 || price > 99999999.99||rec.test(price)===false) {
                                alert('优惠金额应是0.01-99999999.99的两位小数！');
                                $(".priceNum").focus();
                                return;
                            }else if(decreasePrice>=0){
                                alert('优惠金额应小于指导价！');
                                $(".priceNum").focus();
                                return;
                            }
                        } else if(carRuleId==2188||carRuleId==2189){
                            if(!price){
                                alert('优惠金额应是0.01-99999999.99的两位小数！');
                            } else if (price <= 0 || price > 99999999.99||rec.test(price)===false) {
                                alert('优惠金额应是0.01-99999999.99的两位小数！');
                                $(".priceNum").focus();
                                return;
                            }
                        }
                    }


                    if(Id){
                        var token = sessionStorage.getItem('token');//token
                        $.ajax({
                            type: "POST", //提交方式
                            url: root_path + 'market/updSearchCar', //绝对路径
                            data: {
                                token: token,
                                id:Id,
                                specificationsid: carStandId,//汽车规格id
                                carid: carXingUid,//车型id
                                color1: color1,
                                color2: color2,
                                getcartime: carTimeId,
                                addressto: carAreaId,
                                licensearea: registratAddress,
                                feerule:carRuleStr,
                                feevalue:price,
                                carstatus:carStatusId,
                                requirement:carRequireId,
                                remark: remark,
                            }, //数据，这里使用的是Json格式进行传输
                                 dataType: 'json',
                            success: function (Response) {
                                // console.log(Response)
                                // var Response = $.parseJSON(Response);
                                layer.alert(Response.rspDesc);
                                if (Response.rspCode == "0000") {
                                    // layer.alert(Response.rspDesc);
                                    sessionStorage.removeItem("carAreaId")
                                    sessionStorage.removeItem("carStandId")
                                    sessionStorage.removeItem("carTimeId")
                                    sessionStorage.removeItem("carXingUid")
                                    sessionStorage.removeItem("carStatusId")
                                    sessionStorage.removeItem("carRequireId")
                                    sessionStorage.removeItem("carRuleId")
                                    sessionStorage.removeItem("carColorId")
                                    sessionStorage.removeItem("car_detail")
                                    layer.open({
                                        content: '更新成功！',
                                        yes: function(index, layero){
                                            window.location.href = "car_information_two.html";
                                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                                        }
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
                            error: function () {
                                layer.alert("服务器异常，请稍后处理！");
                            }
                        });
                    }else {
                        $('.edit').hide()
                        $.ajax({
                            type: "POST", //提交方式
                            url: root_path + 'market/addSearchCar', //绝对路径
                            data: {
                                token: token,
                                specificationsid: carStandId,//汽车规格id
                                carid: carXingUid,//车型id
                                color1: color1,
                                color2: color2,
                                getcartime: carTimeId,
                                addressto: carAreaId,
                                licensearea: registratAddress,
                                feerule:carRuleStr,
                                feevalue:price,
                                carstatus:carStatusId,
                                requirement:carRequireId,
                                remark: remark,
                            }, //数据，这里使用的是Json格式进行传输

                            success: function (Response) {
                                var Response = $.parseJSON(Response);
                                layer.alert(Response.rspDesc);
                                if (Response.rspCode == "0000") {
                                    layer.alert(Response.rspDesc);
                                    sessionStorage.removeItem("carAreaId")
                                    sessionStorage.removeItem("carStandId")
                                    sessionStorage.removeItem("carTimeId")
                                    sessionStorage.removeItem("carXingUid")
                                    sessionStorage.removeItem("carStatusId")
                                    sessionStorage.removeItem("carRequireId")
                                    sessionStorage.removeItem("carRuleId")
                                    sessionStorage.removeItem("carColorId")
                                    sessionStorage.removeItem("car_detail")
                                    window.location.href = "main_find_car.html";
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
                            error: function () {
                                layer.alert("服务器异常，请稍后处理！");
                            }
                        });
                    }

                });
            }
        };
        return $page.methods;
    };
})(jQuery);

    
    
    
