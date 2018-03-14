// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
            	var market="";
                this.LoadContent(market);
                this.Select();
                this.Delete();
                this.Change();
                this.soldOut();
            },
            Change: function () {
            	//选项卡切换
            	   var market;
                   $('.myOrderClassify span').click(function () {
	            	$(this).addClass('selectedCss').siblings('span').removeClass("selectedCss");
	            	$('.checkT').eq($(this).index()).show().siblings('.checkT').hide();
	            	
                    if($(this).index()==0){
                        market="";
                        $(".calendar .batch2").hide()
                        $(".calendar .batch1").hide()
	            	}else if($(this).index()==1){
                        market='1';
                        $(".calendar .batch2").show()
                        $(".calendar .batch1").hide()
	            	}else if($(this).index()==2){
                        market='0';
                        $(".calendar .batch1").show()
                        $(".calendar .batch2").hide()
	            	} 
	            	//调用接口
	            	$page.methods.LoadContent(market);
	            });  
            },
            //全选/全不选
            Select: function(){
            	$('label').removeAttr('class');
            	 
                $('.quanSlect').on("click","label",function () {
                	//console.log(1)
                    if ($(this).hasClass('checked')) {
                        $(this).removeAttr('class');
                        $('.checkT label').removeAttr('class');
                    } else {
                        $(this).attr('class', 'checked');
                        $('.checkT label').attr('class', 'checked');
                    }
                });
          
            },
            //点击删除
            Delete: function(){
            	$(".calendar .del").click(function(){
            		//console.log($(".checkT .checked").length)
            		if($(".checkT .checked").length<=0){
            			layer.alert("您还没有选择哦！");
            			return;
            		}else{
                        layer.confirm('你确定要删除吗?', function(index){
            	            	var id="";
            	            	$(".checkT").find(".checked").each(function(index){
            	            		id += $(this).attr("data-id")+","	
                        		});
                     	    	id=id.substring(0,id.length-1);
                                $.ajax({
                                    type: "POST", //提交方式
                                    url: root_path + "market/delMarketCar", //绝对路径
                                    data: {
                                       token: sessionStorage.getItem('token'),
                                       id:id,
                                    }, //数据，这里使用的是Json格式进行传输
                                    dataType: 'json',
                                    success: function (Response) {
                                	     console.log(Response);
                                          if (Response.rspCode == "0000") {
                                            layer.alert(Response.rspDesc)
                                            $(".checkT").find(".checked").each(function(index){
			            	        		$(this).parent("li").remove();	
			            	    	       })
                                         }
                                     },
                                    error: function() {
                                         layer.alert("服务器异常，请稍后处理！");
                                    }
                                 })
                            layer.close(index);
                        });
                    }
                })	
            },
            //点击批量上,下架
            soldOut:function(){
            	$(".calendar .batch").click(function(){
            		var status;
            			if($(this).index()==0){
            				status=1;
            			}else if($(this).index()==1){
            				status=0;
            			}
	            		if($(".checkT .checked").length<=0){
	            			layer.alert("您还没有选择哦！");
	            			return;
	            		};
	            		//获取选择的id
	            		var id="";
	            		$(".checkT").find(".checked").each(function(index){
	            			id += $(this).attr("data-id")+","	
	            		});
	            		id=id.substring(0,id.length-1);
            		//console.log(status)
            		$.ajax({
                        type: "POST", //提交方式
                        url: root_path + "market/updCarMarketStatus", //绝对路径
                        data: {
                            token: sessionStorage.getItem('token'),
                            type:2,
                            id:id,
                            status:status,
                        }, //数据，这里使用的是Json格式进行传输
                        dataType: 'json',
                        success: function (Response) {
                            if (Response.rspCode == "0000") {
                                if(status===1){
                                    layer.alert("上架成功")
                                }else if(status===0){
                                    layer.alert("下架成功")
                                }
                                $(".checkT").find(".checked").each(function(index){
                                    $(this).parent("li").remove();
                                })
                            }
                        },
                        error: function() {
                            layer.alert("服务器异常，请稍后处理！");
                        }
                    })	
            	})	
            },
            
            LoadContent: function (market) {
                //我的车源接口；
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "market/getSaleCarList", //绝对路径
                    data: {
                    	token: sessionStorage.getItem('token'),
                    	marketStatus :market,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            console.log(Response);
                           $('.personalOptions ul').html('');
                            paging();
                            function paging() {
                                var data = Response.data.saleList;


                                function compare(property){
                                    return function(a,b){
                                        var value1 = a[property];
                                        var value2 = b[property];
                                        return value2 - value1;
                                    }
                                }
                                data=data.sort(compare('time'))

                                var aa = Response.data.page.total;
                                var nums = 5; //每页出现的数量
                                var pages = Math.ceil(aa / nums);
                                var thisDate = function (curr) {
                                    var str = '',
                                       last = curr * nums - 1;
                                    if (last >= data.length) {
                                        last = data.length - 1;
                                    } else {
                                        last = last
                                    }
                                    ;
                                    for (var i = (curr * nums - nums); i <= last; i++) {
                                    	//console.log(i)
                                        if(data[i].img==""){
                                            data[i].img = "imgs/528.jpg";
                                        }
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
                                        var temp=data[i].marketstatus==0? "已下架" : "已上架";
                                        $('label').removeAttr('class');
                                        str+='<li data-id='+ data[i].id +'>'
                                            +	'<input type="checkbox" id="nba"  name="sport" value="nba" style="">'
                                            +    '<label name="nba" class="checked" for="nba" data-id='+data[i].id+'>&nbsp;&nbsp;&nbsp;</label>'
                                            +    '<span></span>'
                                            +    '<div  class="carImg">'
                                            +    '<img src= '+ data[i].img +' >'                                            
                                            +    '</div>'
                                            +    ' <div class="describeR">'
                                            +        '<p>'+ data[i].name + '</p>'
                                            +     '<p>'+data[i].year+'-'+data[i].month+'-'+data[i].day+'</p>'
                                            +        '<p class="personDown">外观/内饰颜色：' + data[i].color1 + "/" + data[i].color2 + '</p>'
                                            +     '</div>'
                                            +    '<span class="Hasbeen">编辑</span>'
                                            +'<span class="compile'+data[i].marketstatus+' status">'+temp+'</span>'

                                            + '</li>'
                                            +  '<p class="line"></p>'
                                    }
                                    return str;
                                };
                                //调用分页
                                laypage({
                                    cont: $('.jumpPage'), //容器。值支持id名、原生dom对象，jquery对象,
                                    pages: pages, //总页数
                                    skip: true, //是否开启跳页
                                    skin: '#e44523',
                                    groups: 5,
                                    first:1,//将首页显示为数字1。若不显示，设置false即可
	                                last: pages,//将尾页显示为总页数。若不显示，设置false即可
	                                prev: '<', //若不显示，设置false即可
	                                next: '>', //若不显示，设置false即可
                                    jump: function (obj, first) {
                                    	if(market==""){

                                    		$('.personalOptions .ALLcheck').html(thisDate(obj.curr));

                                    	}else if(market=='1'){

                                    		$('.personalOptions .upfinished').html(thisDate(obj.curr));

                                    	}else if(market=='0'){

                                    		$('.personalOptions .downfinished').html(thisDate(obj.curr));

                                    	}
                                        $('.quanSlect label').attr('class', '');
                                        $page.methods.pageEvent(); 
                                        $(".checkT>li .Hasbeen").click(function(){

                                            var id = $(this).parent().attr("data-id");

                                            window.location.href="main_release_options.html?id="+id
                                        })

                                    }//连续显示分页数
                                });
                            }
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
            },
            pageEvent:function(){
            	$('label').removeAttr('class');
            	$('.checkT li').on("click","label",function () {
                    if ($(this).hasClass('checked')) {
                        $(this).removeAttr('class');
                    } else {
                        $(this).attr('class', 'checked');
                    }
                });
            } 
            
        };
        return $page.methods;
    };
})(jQuery);













