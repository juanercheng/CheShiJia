// JavaScript Document
//create by chengjuan   2017-08-29
(function () {
    sessionStorage.setItem('type',2);
    newsData();
    var curr01,curr02;
    //type=2
    $('.myOrderClassify .personanews').click(function(){
        sessionStorage.setItem('type',2);
        $(this).addClass('selectedCss').siblings().removeClass('selectedCss');
        newsData();
        curr02=0;
        $(".list01").show();
        $(".list02").hide();
        $("#jumpPage02").hide();
        $("#jumpPage01").show();
    });

    function newsData() {
        var userImg = sessionStorage.getItem('userImg');
        var nextPage = curr01 || 0;
        $.ajax({
            type: "POST", //提交方式
            url: root_path + "information/getMessage", //绝对路径
            data: {
                token: sessionStorage.getItem("token"),
                type:sessionStorage.getItem('type'),
                page: nextPage,
                rows: 10
            }, //数据，这里使用的是Json格式进行传输
            dataType: 'json',
            success: function (Response) {
                // console.log(Response)
                if (Response.rspCode == "0000") {
                    $(".list01").html("");
                    var data=Response.data.messageList;
                    var pages=Response.data.page.pages;
                    var liContent='';
                    var readNum = 0;
                    //当列表数据为空的时候分页隐藏；
                    var list_num = data.length;
                    if (list_num === 0) {
                        $("#jumpPage01").hide();
                    } else {
                        $("#jumpPage01").show();
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].isread === 'F') {
                            readNum++;
                            liContent += "<li id=" + data[i].id + " tradeid=" + data[i].tradeid +" content="+data[i].content.replace(/<.*?>/ig,'')+" >" +
                                "<img src='imgs/newtil.png' class='newtil'>" +
                                "<div class='Li-img'>" +
                                "<img src=" + userImg + " class='hear'>" +
                                "</div>" +
                                "<div class='news-x'>" +
                                "<p class='call'>" + data[i].title + "</p>" +
                                "<p class='Prompt'>" + data[i].content.replace(/<.*?>/ig, "") + "</p>" +
                                "</div>" +
                                "<span class='data'>" + formatDate(new Date(data[i].time)) + "</span>" +
                                "</li>"
                        } else {
                            liContent += "<li id=" + data[i].id + " tradeid=" + data[i].tradeid +" content="+data[i].content.replace(/<.*?>/ig,'')+" >" +
                                "<div class='Li-img'>" +
                                "<img src=" + userImg + " class='hear'>" +
                                "</div>" +
                                "<div class='news-x'>" +
                                "<p class='call'>" + data[i].title + "</p>" +
                                "<p class='Prompt'>" + data[i].content.replace(/<.*?>/ig, "") + "</p>" +
                                "</div>" +
                                "<span class='data'>" + formatDate(new Date(data[i].time)) + "</span>" +
                                "</li>"
                        }
                    }
                    if (readNum === 0) {
                        $(".selectedCss .newtil").hide()
                    } else {
                        $(".selectedCss .newtil").show()
                    }
                    $('.list01').html(liContent);
                    //调用分页
                    laypage({
                        cont: 'jumpPage01',//分页容器的id
                        pages: pages, //总页数
                        skip: true,//是否开启跳页
                        skin: '#e44523',//选中状态的背景色
                        groups: 5,//可视页数
                        first: 0, //将首页显示为数字1,。若不显示，设置false即可
                        last: pages, //将尾页显示为总页数。若不显示，设置false即可
                        prev: '<', //若不显示，设置false即可
                        next: '>', //若不显示，设置false即可
                        curr:curr01  || 0,
                        jump: function (obj, first) {
                            curr01=obj.curr;
                            if (!first) {
                                newsData(obj.curr)
                            }
                            //点击消息弹框查看
                            $(".list01 li").click(function () {
                                var id = $(this).attr("id");
                                var tradeid = $(this).attr("tradeid");
                                var content=$(this).attr("content")
                                $.ajax({
                                    type: "POST", //提交方式
                                    url: root_path + "payment/getTradeDetail", //绝对路径
                                    data: {
                                        token: sessionStorage.getItem('token'),
                                        id: tradeid
                                    }, //数据，这里使用的是Json格式进行传输
                                    dataType: 'json',
                                    success: function (Response) {
                                        // console.log(Response.data);
                                        var date=Response.data.detailList;
                                        var con='',orderstatus='';
                                        for (var i in date){
                                            if(Response.data.status===1){
                                                orderstatus='未支付'
                                            }else if(Response.data.status===2){
                                                orderstatus='支付成功尚未确认收货'
                                            }else if(Response.data.status===3){
                                                orderstatus='支付失败'
                                            }else if(Response.data.status===4){
                                                orderstatus='已确认收货暂未评价'
                                            }else if(Response.data.status===5){
                                                orderstatus='已评价'
                                            }
                                            con ='<div class="orderBox order_detail">'
                                                +'<img src='+userImg+' >'
                                                +	'<div class="orderBoxText">'   
                                                +        '<h2 class="carname" style="font-weight: bold">' + date[0].name +'</h2>'
                                                +        '<div class="outofpocket">订单号： ' + tradeid + ' </div>'
                                                +        '<div class="outofpocket">订单状态： ' + orderstatus+ ' </div>'
                                                +        '<div class="outofpocket">实付：<b>' + date[0].price + '</b><em>元</em></div>'
                                                +        '<div class="outofpocket ">数量：<em>' + date[0].num + '辆</em></div>'
                                                +        '<div class=" outofpocket">提车区域：<em>' + date[0].region + '</em></div>'
                                                +        '<div class=" outofpocket">销售区域：<em>' + date[0].saleArea + '</em></div>'
                                                +    '</div>'
                                                +'</div>'
                                        }
                                        layer.open({
                                            type: 1,
                                            skin: 'layui-layer-rim', //加上边框
                                            area: ['600px', '350px'], //宽高
                                            title:'消息详情',
                                            content: con,
                                            cancel: function(index, layero){
                                                location.reload()
                                            }
                                        });
                                        $('.layui-layer-content').css({
                                            'clear': 'both',
                                        })
                                        $('.layui-layer-content .Li-img img').css({
                                            'width': '100px',
                                            'height': '100px',
                                            'float': 'left',
                                            'border-radius': '50%'
                                        })
                                        $('.layui-layer-content .news-x').css({
                                            'float': 'left',
                                            'margin-left': '20px',
                                            'width': '77%',
                                            'margin-bottom': '20px'
                                        })
                                        $('.layui-layer-content  .data').css({
                                            'float': 'right',
                                            'margin-right': '20px'
                                        });
                                        $.ajax({
                                            type: "POST", //提交方式
                                            url: root_path + "information/updMessageRead", //绝对路径
                                            data: {
                                                token: sessionStorage.getItem('token'),
                                                messageId: id
                                            }, //数据，这里使用的是Json格式进行传输
                                            dataType: 'json',
                                            success: function (Response) {
                                                // console.log(Response)
                                            },
                                            error: function () {
                                                layer.alert("服务器异常，请稍后处理！");
                                            }
                                        })
                                    },
                                    error: function () {
                                        layer.alert("服务器异常，请稍后处理！");
                                    }
                                });

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
    }

    //type=1
    $('.myOrderClassify .systemnews').click(function(){
        sessionStorage.setItem('type',1);
        $(this).addClass('selectedCss').siblings().removeClass('selectedCss');
        newsData02();
        curr01=0;
        $(".list02").show();
        $("#jumpPage02").show();
        $(".list01").hide();
        $("#jumpPage01").hide();
    });

    function newsData02() {
        var userImg = sessionStorage.getItem('userImg');
        var nextPage = curr02 || 0;
        $.ajax({
            type: "POST", //提交方式
            url: root_path + "information/getMessage", //绝对路径
            data: {
                token: sessionStorage.getItem("token"),
                type:sessionStorage.getItem('type'),
                page: nextPage,
                rows: 10
            }, //数据，这里使用的是Json格式进行传输
            dataType: 'json',
            success: function (Response) {
                if (Response.rspCode == "0000") {
                    $(".list02").html("");
                    var data=Response.data.messageList;
                    var pages=Response.data.page.pages;
                    var liContent='';
                    var readNum = 0;
                    //当列表数据为空的时候分页隐藏；
                    var list_num = data.length;
                    if (list_num === 0) {
                        $("#jumpPage02").hide();
                    } else {
                        $("#jumpPage02").show();
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].isread === 'F') {
                            readNum++;
                            liContent += "<li id=" + data[i].id + ">" +
                                "<img src='imgs/newtil.png' class='newtil'>" +
                                "<div class='Li-img'>" +
                                "<img src=" + userImg + " class='hear'>" +
                                "</div>" +
                                "<div class='news-x'>" +
                                "<p class='call'>" + data[i].title + "</p>" +
                                "<p class='Prompt'>" + data[i].content.replace(/<.*?>/ig, "") + "</p>" +
                                "</div>" +
                                "<span class='data'>" + formatDate(new Date(data[i].time)) + "</span>" +
                                "</li>"
                        } else {
                            liContent += "<li id=" + data[i].id + ">" +
                                "<div class='Li-img'>" +
                                "<img src=" + userImg + " class='hear'>" +
                                "</div>" +
                                "<div class='news-x'>" +
                                "<p class='call'>" + data[i].title + "</p>" +
                                "<p class='Prompt'>" + data[i].content.replace(/<.*?>/ig, "") + "</p>" +
                                "</div>" +
                                "<span class='data'>" + formatDate(new Date(data[i].time)) + "</span>" +
                                "</li>"
                        }
                    }
                    if (readNum === 0) {
                        $(".selectedCss .newtil").hide()
                    } else {
                        $(".selectedCss .newtil").show()
                    }
                    $('.list02').html(liContent);
                    //调用分页
                    laypage({
                        cont: 'jumpPage02',//分页容器的id
                        pages: pages, //总页数
                        skip: true,//是否开启跳页
                        skin: '#e44523',//选中状态的背景色
                        groups: 5,//可视页数
                        first: 1, //将首页显示为数字1,。若不显示，设置false即可
                        last: pages, //将尾页显示为总页数。若不显示，设置false即可
                        prev: '<', //若不显示，设置false即可
                        next: '>', //若不显示，设置false即可
                        curr:curr02  || 0,
                        jump: function (obj, first) {
                            curr02=obj.curr;
                            if (!first) {
                                newsData02(obj.curr)
                            }
                            //点击消息弹框查看
                            $(".list02 li").click(function () {
                                var id = $(this).attr("id");
                                var datas = $(this).context.innerHTML;
                                $.ajax({
                                    type: "POST", //提交方式
                                    url: root_path + "information/updMessageRead", //绝对路径
                                    data: {
                                        token: sessionStorage.getItem('token'),
                                        messageId: id
                                    }, //数据，这里使用的是Json格式进行传输
                                    dataType: 'json',
                                    success: function (Response) {
                                        layer.open({
                                            type: 1,
                                            skin: 'layui-layer-rim', //加上边框
                                            area: ['600px', '350px'], //宽高
                                            content: datas,
                                            cancel: function(index, layero){
                                                location.reload()
                                            }
                                        });
                                        $('.layui-layer-content').css({
                                            'padding': '30px',
                                            'clear': 'both',
                                        });
                                        $('.layui-layer-content .Li-img img').css({
                                            'width': '100px',
                                            'height': '100px',
                                            'float': 'left',
                                            'border-radius': '50%'
                                        });
                                        $('.layui-layer-content .news-x').css({
                                            'float': 'left',
                                            'margin-left': '20px',
                                            'width': '77%',
                                            'margin-bottom': '20px'
                                        });
                                        $('.layui-layer-content  .data').css({
                                            'float': 'right',
                                            'margin-right': '20px'
                                        })

                                    },
                                    error: function () {
                                        layer.alert("服务器异常，请稍后处理！");
                                    }
                                })
                            })
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
})(jQuery);

