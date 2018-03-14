(function($){
    $.page=function(){
        var $page={};
        $page.methods={
            init:function(){
                this.GetParamFMarketList();
            },
            //我的匹配-寻车列表；
            GetParamFMarketList:function(){
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
                            console.log(Response)
                            $(".hotCar").html("");
                            var pages=Response.data.page.pages;
                            var thisData = function(){
                                var data=Response.data.mainList;
                                if(data.length===0){
                                    $(".noData").show();
                                }else{
                                    $(".noData").hide();
                                    for(var i=0;i< data.length;i++){
                                        $common.methods.initModel(data, i);
                                        var area = data[i].licensearea;
                                        var require=data[i].requirement;
                                        var specifications=data[i].specifications;
                                        // data[i].price = data[i].price;
                                        data[i].guideprice1 = data[i].guideprice2;
                                        $common.methods.model(data, i, ".recommendT",area,require);
                                    }
                                }
                            };
                            //调用分页
                            laypage({
                                cont:  $('.jumpPage'), //容器。值支持id名、原生dom对象，jquery对象,
                                pages: pages, //总页数
                                skip: true,//是否开启跳页
                                skin: '#e44523',//选中状态的背景色
                                groups: 5,//可视页数
                                first: 1, //将首页显示为数字1,。若不显示，设置false即可
                                last: pages, //将尾页显示为总页数。若不显示，设置false即可
                                prev: '<', //若不显示，设置false即可
                                next: '>', //若不显示，设置false即可
                                jump:function(obj, first){
                                    var curr = obj.curr;
                                    $('.recommendT').html("");
                                    if(curr==1){
                                        thisData (curr);
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
                                    $(".hotCar li").click(function(){
                                        var id = $(this).attr("id");
                                        window.location.href = "match-detail.html?id="+id;
                                    })
                                }//连续显示分页数  
                            });

                        }else{
                            layer.alert(Response.rspDesc);
                        }

                    },
                    error:function(){
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });

                //子页跳转请求
                function page(curr){
                    $.ajax({
                        type:"POST",//提交方式
                        url:root_path+"recommend/getRecomParamList",//绝对路径
                        data:{
                            token: sessionStorage.getItem("token"),
                            page:curr,
                            rows:12//数据，这里使用的是Json格式进行传输
                        },
                        dataType:"json",
                        success:function(Response){
                            console.log(Response)

                            if(Response.rspCode == "0000"){

                                var data=Response.data.mainList;
                                for(var i=0;i< data.length;i++){
                                    $common.methods.initModel(data, i);
                                    var area = data[i].licensearea;
                                    var require=data[i].requirement;
                                    data[i].price = data[i].expectprice;
                                    data[i].guideprice1 = data[i].guideprice;
                                    $common.methods.model(data, i, ".recommendT",area,require);
                                }

                            }else{

                            }
                        },
                        error: function() {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    });
                }
                //layer.alert(Response.rspDesc);
            }

        }

        return $page.methods;
    }

})(jQuery);





















