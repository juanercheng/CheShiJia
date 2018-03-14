// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        var imgId='';
        var addresstoidLength=0;
        var regionidLength=0;
        var color1Length,color2Length;
        $page.methods = {

            init: function () {
                this.standard();
                if (sessionStorage.getItem('token') == null) {
                    $(".mask-alert>div").html('请登录！');
                    $(".mask-alert").show();
                    window.location.href = "log_in.html";
                } else {
                    var grade = sessionStorage.getItem('grade');
                    if(grade=="未认证"){
                        layer.confirm("发布寻车资源需要进行身份认证，确认继续？",function(index){
                            window.location.href = "authentication.html?authNum=2";
                        },function(){
                            window.location.href = "main_ultra_low_purchase.html";
                        });
                    }
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

                var token = sessionStorage.getItem('token');//token
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
                        // //选取规格时间调用；
                        // $page.methods.clickCarId();
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
                        //选取规格时间调用；
                        $page.methods.clickCarId();
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //提车区域接口
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "common/getCarRegionInfo", //绝对路径
                    data: {}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.getCarArea').html("");
                            for (var i = 0; i < Response.data.length; i++) {
                                var data = Response.data[i];
                                var LiContent = "<span id='" + data.id + "'>" + data.name + "</span>";
                                $('.getCarArea').append(LiContent);
                                sessionStorage.setItem('getAreaId', '');
                            }
                            //点击提车区域，选择参数
                            var regionArr = [];
                            $(".getCarArea span").click(function () {
                                if ($(this).is(".chooseRequire")) {
                                    $(this).removeClass("chooseRequire");
                                    var index = regionArr.indexOf($(this).attr("id"));
                                    regionArr.splice(index, 1);
                                } else {
                                    $(this).addClass("chooseRequire");
                                    regionArr.push($(this).attr("id"));
                                    if($(this).attr("id")==2409){
                                        $(this).siblings().removeClass("chooseRequire");
                                        regionArr = [$(this).attr("id")];
                                    }else{
                                        $(this).siblings("[id=2409]").removeClass("chooseRequire");
                                        var index = regionArr.indexOf( $(this).siblings("[id=2409]").attr("id"));
                                        if(index!= -1){
                                            regionArr.splice(index, 1);
                                        }
                                        var length=regionidLength+ regionArr.length
                                        if(length==Response.data.length-1){
                                            setTimeout(function () {
                                                $(".getCarArea span").removeClass("chooseRequire");
                                            },200);
                                            setTimeout(function () {
                                                $(".getCarArea #2409").addClass("chooseRequire");
                                            },400);
                                            regionArr = ["2409"];
                                            regionidLength=0;
                                        }
                                    }
                                }
                                var regionStr = regionArr.join();
                                sessionStorage.setItem('getAreaId', regionStr);

                            })
                        } else {
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //销售区域接口
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
                                sessionStorage.setItem('saleAreaId', '');
                            }
                            //点击销售区域，选择参数
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
                                        var length=addresstoidLength+ regionArr.length;
                                        if(length==Response.data.length-1){
                                            setTimeout(function () {
                                                $(".regionArea span").removeClass("chooseRequire");
                                            },200)
                                            setTimeout(function () {
                                                $(".regionArea #4").addClass("chooseRequire");
                                            },400)
                                            regionArr = ["4"];
                                            addresstoidLength=0
                                        }

                                    }
                                }

                                var regionStr = regionArr.join();
                                sessionStorage.setItem('saleAreaId', regionStr);
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
                                sessionStorage.setItem('carStatusId', '');
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
                                var LiContent = "<span id='" + data.id+ "'>" + data.name + "</span>";
                                $('.expect .getCar').append(LiContent);
                                // $(".getCar span:first-child").addClass("chooseRequire");
                                $(".expect em").text("点");
                                sessionStorage.setItem('carRuleId','');
                                }
                            //点击价格规则,选择参数
                            $(".expect .getCar span").click(function () {

                                if ($(this).attr("id") == "2186") {

                                    $(".expect em").text("点");
                                    $(".expect .priceNum").attr('placeholder','请输入优惠点数')
                                } else if($(this).attr("id") == "2187"){
                                    $(".expect em").text("万");
                                    var guideprice=sessionStorage.getItem('guideprice')
                                    guideprice=guideprice?guideprice:''
                                    var text='请输入期望成交价格';

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
                                // $(".requireSpan span:first-child").addClass("chooseRequire");
                                sessionStorage.setItem('carRequireId', '');
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
                                if($('.shuru1').val()==""){
                                    text1 = text1  + $('.shuru1').val();
                                }else{

                                    text1 = text1 + ',' + $('.shuru1').val();

                                }
                                sessionStorage.setItem('carColor1',text1);
                                $(".carColor_input1").val(text1);
                            }else {
                                sessionStorage.setItem('carColor1',$('.shuru1').val());
                                $(".carColor_input1").val($('.shuru1').val());
                            }
                            if(color2Length!=0){
                                if($('.shuru').val()==""){

                                    text2=text2+$('.shuru').val();
                                }else{
                                    text2=text2+","+$('.shuru').val()
                                }

                                $(".carColor_input2").val(text2);
                                sessionStorage.setItem('carColor2',text2);
                            }else {
                                sessionStorage.setItem('carColor2',$('.shuru').val());
                                $(".carColor_input2").val($('.shuru').val());
                            }

                        });

                        //取消弹窗
                        $(".colorBtn1").click(function() {
                            $('.carColor_choose').hide();

                             $(".outColorUl1 input:checkbox[name='message']:checked").removeAttr("checked","checked");

                            $('.shuru1').val("");
                            $('.shuru').val("");


                        });
                    }
                });

                $('input,textarea').click(function () {
                    $(this).css({color: '#333'});
                });
                $page.methods.hotBrandAjax();
            },
           
            //修改“我的资源”
            modified: function () {
                if(imgId){
                    $('.edit').show()
                    $('.add').hide()
                    $.ajax({
                        cache: "False",
                        type: "POST", //提交方式
                        url: root_path + "market/getSaleCarDetail", //绝对路径
                        data: {
                            token: sessionStorage.getItem("token"),
                            id: imgId,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {
                                var _obj=Response.data;
                                // console.log(_obj.regionid)
                                // console.log(_obj.addresstoid)
                                // console.log(_obj.requirement)

                                if(_obj.addresstoid==='4'){
                                    addresstoidLength=0;
                                }else {
                                    addresstoidLength=_obj.addresstoid.split(",").length; //销售区域
                                }
                                if(_obj.regionid==='2409'){
                                    regionidLength=0
                                }else {
                                    regionidLength=_obj.regionid.split(",").length;//提车区域
                                }
                                sessionStorage.setItem('guideprice',_obj.guideprice1);
                                sessionStorage.setItem('carStandId', _obj.specificationsid); //规格id
                                sessionStorage.setItem('carXingUid', _obj.carid); //车型id
                                sessionStorage.setItem('getAreaId', _obj.regionid); //提车区域id
                                sessionStorage.setItem('saleAreaId', _obj.addresstoid);   //销售区域id
                                sessionStorage.setItem('carStatusId', _obj.carstatus); //状态id
                                sessionStorage.setItem('carRequireId', _obj.requirement);  //特殊要求id
                                if(_obj.carid){
                                    sessionStorage.setItem('colorData', 1);  //特殊要求id
                                }
                                sessionStorage.setItem('carColor1',_obj.color1)
                                sessionStorage.setItem('carColor2',_obj.color2)
                                if(_obj.color1||_obj.color2){
                                    $('.carColor_text ').hide();
                                    // $('.carColor_text ').text('请选择').css('color','rgb(51, 51, 51)');
                                    $('.carColor_input1').show();
                                    $('.carColor_input2').show();
                                    $(".carColor_input1").val(_obj.color1) ;
                                    $(".carColor_input2").val(_obj.color2) ;
                                }
                                $(".carColor .carColor_text").text(_obj.color1).css({color: '#333'});
                                $(".stock").val(_obj.stock).css({color: '#333'});
                                $(".registratAddress").val(_obj.licensearea).css({color: '#333'});
                                $(".priceNum").val(_obj.feevalue).css({color: '#333'});
                                $(".payMoney").val(_obj.adprice).css({color: '#333'}); //定金
                                $("textarea").val(_obj.remark).css({color: '#333'});
                                $(".primary").text(_obj.name).css({color: '#333'});
                                //车辆状态
                                //期望成交价
                                if(_obj.feerule==="2186"){
                                    setTimeout(function () {
                                        $(".expect .getCar  span:first-child").addClass("chooseRequire");
                                        $(".expect em").text("点");  },300);

                                    sessionStorage.setItem('carRuleId',2186);
                                }else if(_obj.feerule==="2187"){
                                    setTimeout(function () {
                                        $(".expect .getCar span:nth-child(2)").addClass("chooseRequire");
                                        $(".expect em").text("点");
                                        $(".expect .getCar  span:first-child").removeClass("chooseRequire");
                                        },300);

                                    $(".expect em").text("万");
                                    sessionStorage.setItem('carRuleId',2187);
                                }else if(_obj.feerule==="2188"){
                                    setTimeout(function () {
                                        $(".expect .getCar  span:nth-of-type(3)").addClass("chooseRequire");
                                        $(".expect .getCar  span:first-child").removeClass("chooseRequire");
                                    },300)

                                    $(".expect em").text("万");
                                    sessionStorage.setItem('carRuleId',2188);
                                }else if(_obj.feerule==="2189"){
                                    setTimeout(function () {
                                        $(".expect .getCar  span:last-child").addClass("chooseRequire");
                                        $(".expect .getCar  span:first-child").removeClass("chooseRequire");
                                    },300)

                                    $(".expect em").text("万");
                                    sessionStorage.setItem('carRuleId',2189);
                                }
                                setTimeout(function () {
                                    addClass(_obj.regionid,$('.getCarArea  span'),2409) //提车区域
                                    addClass(_obj.addresstoid,$('.regionArea  span'),4) //销售区域
                                    addClass(_obj.requirement,$('.requireSpan  span'),'')//特殊要求
                                    addClass(_obj.carstatusid,$('.carStatus  span'),'')//提车区域

                                },300);

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
                                                    var LiContent11;
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

                                                //颜色提交

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
            },
            //选择汽车规格，品牌，车系，车型
            clickCarId: function () {
                $('.carStandard').click(function () {
                    //取消事件冒泡
                    event.stopPropagation();
                    $('.intDispalynArea').hide();
                    $('.intDispalynStatus').hide();
                    $('.intDispalynone').slideToggle(100);
                    $('.guiGe em').click(function () {
                        event.stopPropagation();
                        $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                        var carStandId = $(this).attr('id');
                        $('.gGB').find('i').remove();
                        sessionStorage.setItem('carStandId', carStandId);
                    });
                    $('.pinPai em').click(function () {
                        event.stopPropagation();
                        $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                        var carNameUid = $(this).attr('uid');
                        $('.pPB').find('i').remove();
                        $page.methods.cheXi(carNameUid);
                    });
                    $(document).click(function (event) { $('.intDispalynone').slideUp(100) });

                });
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
                        var cheXingpeizhi = $(this).text();
                        var guideprice=$(this).attr("guidePrice");

                        sessionStorage.setItem('guideprice', guideprice);
                        $(".primary").text(guiGe + ' ' + pinPai + ' ' + cheXing + ' ' + cheXingpeizhi)
                        $('.intDispalynone').slideUp(100);
                        getColor()
                    }).append(html.join(""));
                }
                //外观内饰颜色接口
                function getColor() {
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "car/getCarColourInfo", //绝对路径
                        data: {   //16419
                            carid:sessionStorage.getItem('carXingUid'),
                            colourType:''
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {

                            if (Response.rspCode == "0000") {
                                $('.intDispalynColor').html("");
                                var length=Response.data.length;
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
                                $('.cXB').find('i').remove();
                                for (var i = 0; i < Response.data[Index - 1].seriesList.length; i++) {
                                    var data1 = Response.data[Index - 1].seriesList[i];
                                    var spanContent = "<em class='carsModel' uid=" + data1.id + '>' + data1.name + '</em>';
                                    $('.cheXing').append(spanContent);
                                }
                                $('.cheXing em').click(function () {
                                    event.stopPropagation();
                                    $(this).addClass('checkAddCss').siblings().removeClass('checkAddCss');
                                    var carXingUid = $(this).attr('uid');
                                    $('.cXB').find('i').remove();
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
            //发布车源接口
            hotBrandAjax: function () {
                //点击提交后，调用发布车源接口
                $('.confirmReleaseBtn').click(function () {
                    var Id = imgId; //修改寻车信息需要传入
                    var token = sessionStorage.getItem('token');//token   
                    var carStandId = sessionStorage.getItem('carStandId');//规格id
                    var carXingUid = sessionStorage.getItem('carXingUid');//车型uid
                    var getAreaId = sessionStorage.getItem('getAreaId');//提车区域id
                    var saleAreaId = sessionStorage.getItem('saleAreaId');//销售区域id
                    var carStatusId = sessionStorage.getItem('carStatusId');//车辆状态id
                    var carRuleId = sessionStorage.getItem('carRuleId'); //价格规则id carRequireId
                    var carRequireId = sessionStorage.getItem('carRequireId'); //特殊要求
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
                    var price = parseFloat($('.priceNum').val()).toFixed(2);
                    var adprice = $('.payMoney').val();
                    var stock = $('.stock').val();
                    var remark = $("textarea").val();
                    var dd = price.split(".");
                    var decreasePrice=price-guideprice;


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
                    if (!stock) {
                        alert("请输入库存数量！");
                        return
                    }else if(stock > 99999999|| stock==0){
                        alert("库存数量应在1-99999999之间！");
                        return
                    }
                    if(!getAreaId){
                        alert("请选择提车区域！");
                        return
                    }
                    if(!saleAreaId){
                        alert("请选择销售区域！");
                        return
                    }
                    if(!carStatusId){
                        alert("请选择车辆状态！");
                        return
                    }

                    if(carRuleId){
                        var rec=/^-?\d+\.?\d{0,2}$/;   //两位小数
                        if (carRuleId==2186) {
                            if(price>=0){
                                guideprice=guideprice*(1-price*0.01);
                            }
                            if(!price){
                                alert('请输入优惠点数！');
                                $(".priceNum").focus();
                                return;
                            }else if (rec.test(price)===false||(price < 0.01 || price > 99.99)) {
                                alert('优惠点数应是0.01-99.99两位小数！');
                                $(".priceNum").focus();
                                return;
                            }
                        }else if(carRuleId==2187){
                            if(price>=0){
                                guideprice==(guideprice-price);

                            }if(!price){
                                alert('请输入优惠金额！');
                                $(".priceNum").focus();
                                return;
                            }else if (rec.test(price)===false||price < 0.01 || price > 99999999.99) {
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
                        }else if(carRuleId==2188){
                            guideprice==(guideprice+price);


                        }else if(carRuleId==2189){
                            guideprice==price;


                        }
                    }

                    if(!adprice){
                        alert('请输入定金！');
                        $(".priceNum").focus();
                        return;
                    }else if (adprice < 0.01 || adprice > 9999.99) {
                        alert('定金应为0.01-9999.99的两位小数！');
                        $(".priceNum").focus();
                        return;
                    }
                    if(Id){
                        var token = sessionStorage.getItem('token');//token

                        $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "market/updSaleCar", //绝对路径
                        data: {
                            id:Id,
                            token: token,
                            specificationsid: carStandId,//汽车规格id
                            carid: carXingUid,//车型id
                            color1: color1,
                            color2: color2,
                            carstatus: carStatusId,
                            addressto: saleAreaId,
                            price: price,
                            adprice: adprice,//支付定金
                            feerule:carRuleId,
                            feevalue:price,
                            stock: stock,//库存
                            remark:remark,
                            regionid:getAreaId,
                            requirement:carRequireId
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {
                                sessionStorage.removeItem("carAreaId")
                                sessionStorage.removeItem("carStandId")
                                sessionStorage.removeItem("carXingUid")
                                sessionStorage.removeItem("carStatusId")
                                sessionStorage.removeItem("carRuleId")
                                sessionStorage.removeItem("getAreaId")
                                sessionStorage.removeItem("carRequireId")
                                sessionStorage.removeItem("saleAreaId")
                                sessionStorage.removeItem("car_detail")
                                sessionStorage.removeItem("carColor")
                                layer.open({
                                    content: '更新成功！',
                                    yes: function(index, layero){
                                        window.location.href="personal_home_my_options.html"
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
                    }else{
                        var price = $('.priceNum').val();

                        $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "market/addSaleCar", //绝对路径
                        data: {
                            token: token,
                            specificationsid: carStandId,//汽车规格id
                            carid: carXingUid,//车型id
                            color1: color1,
                            color2: color2,
                            carstatus: carStatusId,
                            addressto: saleAreaId,
                            price: guideprice,
                            adprice: adprice,//支付定金
                            feerule:carRuleId,
                            feevalue:price,
                            stock: stock,//库存
                            remark:remark,
                            regionid:getAreaId,
                            requirement:carRequireId
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {
                                sessionStorage.removeItem("carAreaId")
                                sessionStorage.removeItem("carStandId")
                                sessionStorage.removeItem("carXingUid")
                                sessionStorage.removeItem("carStatusId")
                                sessionStorage.removeItem("carRuleId")
                                sessionStorage.removeItem("getAreaId")
                                sessionStorage.removeItem("carRequireId")
                                sessionStorage.removeItem("saleAreaId")
                                sessionStorage.removeItem("car_detail")
                                sessionStorage.removeItem("carColor")
                                window.location.href="personal_home_my_options.html"
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
        $(".personalCenter1").click(function () {

            window.history.go(-1);
        });
        $(".mySourse").click(function () {
            window.history.go(-2);
        });

        return $page.methods;

};

})(jQuery);
    
    
    
    
    