// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.LoadContent();
            },
            LoadContent: function () {
                var Id = GetQueryString('id');//订单编号；
                var carId;
                //获取URL地址参数
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                }

                //获取评价车辆详情信息；
                $.ajax({
                    type: "POST", //提交方式  
                    url: root_path + "payment/getTradeDetail", //绝对路径  
                    data: {
                        token: sessionStorage.getItem('token'),
                        id: Id,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.listLi').html('');
                           console.log(Response);
                            var data = Response.data;
                            carId=data.detailList[0].id
                            var content = '<li class="clearfix">\
                                                <div class="carImg pull-left"><img class="" uid=' + data.detailList[0].id + ' src=' + data.detailList[0].img + '></div>\
                                                <div class="describeR pull-left">\
                                                    <p>' + data.detailList[0].name + '</p>\
                                                    <p><span>实付：</span>' + data.detailList[0].pricereal + "<em>元</em></p>\
                                                    <p>数量：  " + data.detailList[0].num + '</p>\
                                                </div>\
                                            </li>';
                            $('.listLi').append(content);
                        } else {
                        	$(".myOrder").html("")
                            layer.alert(Response.rspDesc);
                        }

                    },
                    error: function () {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
                //单选；
                $('label').click(function () {
                    var radioId = $(this).attr('name');
                    console.log(radioId)
                    if(radioId=='nba1'){
                        $(this).addClass("gonds  checked").removeClass("Mreview")
                        $(".nba2").removeClass("gonds checked").addClass('Mreview')
                        $(".nba3").removeClass("gonds checked").addClass('Ncomment')
                     }else if(radioId=='nba2'){
                        $(this).addClass("gonds  checked").removeClass("Mreview")
                        $(".nba1").removeClass("gonds checked").addClass('Mreview')
                        $(".nba3").removeClass("gonds checked").addClass('Ncomment')
                    }else if(radioId=='nba3'){
                        // $(this).addClass("gonds  checked").removeClass("Ncomment")
                        // $(".nba1").removeClass("gonds checked").addClass('Mreview')
                        // $(".nba3").removeClass("gonds checked").addClass('Mreview')
                        $(this).addClass("gonds  checked").removeClass("Ncomment").siblings("label").removeClass("gonds checked").addClass('Mreview')                  
                    }
                    //  $('label').removeAttr('class') && $(this).attr('class', 'checked');
                 $('input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
                });
                $('.commentBtn').click(function () {

                    //评价接口；
                    var textareaT = $('textarea').val();
                    var checkT = $('.checked').html();
                    var checktype;
                    if (checkT == "好评") {
                        checktype = 1;
                    } else if (checkT == "中评") {
                        checktype = 2;
                    } else if (checkT == "差评") {
                        checktype = 3;
                    }
                    $.ajax({
                        type: "POST", //提交方式
                        url: root_path + "payment/addTradeComment", //绝对路径
                        data: {
                            token: sessionStorage.getItem('token'),
                            id: carId,
                            commenttype: checktype,
                            comment: textareaT,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {

                            if (Response.rspCode == "0000") {
                               // console.log(Response);
                                layer.open({
                                    content: '感谢您的评价！',
                                    yes: function(index, layero){
                                        window.location.href = "my_order.html";;
                                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    }
                                });

                            } else {
                            	$(".myOrder").html("")
                                layer.alert(Response.rspDesc);
                                // layer.alert("感谢您的评价！");//后台写
                            }
                            //window.location.href = "my_order.html";
                        },
                        error: function () {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    });

                });

            }
        };
        return $page.methods;
    };
})(jQuery);