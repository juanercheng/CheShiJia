// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.LoadContent();
            },
            LoadContent: function () {
                $('label').removeAttr('class');
                
                
                //全选/全不选
                $('.totalSelect label').click(function () {
                    if ($(this).hasClass('checked')) {
                        $(this).removeAttr('class');
                        $('.checkT label').removeAttr('class');
                    } else {
                        $(this).attr('class', 'checked');
                        $('.checkT label').attr('class', 'checked');
                    }
                });
                
                //售车记录接口；
                $.ajax({
                    type: "POST", //提交方式
                    url: root_path + "payment/getTradeSaleList", //绝对路径
                    data: {token: sessionStorage.getItem('token'),}, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        // console.log(Response);
                        if (Response.rspCode == "0000") {
                            var data = Response.data.saleList;
                            var aa = Response.data.page.total;
                            console.log(Response.data.saleList);
                            var nums = 5; //每页出现的数量  由原来的3 改为5
                            var pages = Math.ceil(aa / nums);
                            var thisDate = function (curr) {

                                var str = '', last = curr * nums - 1;
                                if (last >= data.length) {
                                    last = data.length - 1;
                                } else {
                                    last = last
                                };

                                for (var i = (curr * nums - nums); i <= last; i++) {
                                    //订单状态
                                    if(data[i].status==1){
                                        data[i].status="未付款"
                                    }else if(data[i].status==2){
                                        data[i].status="付款成功未确认收货"
                                    }else if(data[i].status==3){
                                        data[i].status="付款失败"
                                    }else if(data[i].status==4){
                                        data[i].status="已确认收货未评价"
                                    }else if(data[i].status==5){
                                        data[i].status="已评价"
                                    }
                                    //交易时间
                                    var time = data[i].time;
                                    var Year = new Date(time).getFullYear();
                                    var Month = new Date(time).getMonth() + 1;
                                    var Day = new Date(time).getDate();
                                    if (Month < 10) {
                                        Month = '0' + Month;
                                    }
                                    if (Day < 10) {
                                        Day = '0' + Day;
                                    }
                                    str += '<li uid=' + data[i].id + ' class="clearfix">\
                                            <div class="carImg pull-left"><img class="" src='+ data[i].img + '></div>\
                                            <div class="describeR pull-left">\
                                                <p>'+data[i].name+'</p>\
                                                <p>交易时间：' + Year + '-' + Month + '-' + Day + '</p>\
                                                <p>销售状态：'+ data[i].status+'</p>\
                                            </div>\
                                            <p class="price1">'+data[i].guideprice+'<em>万</em></p>\
                                        </li>'
                                        // 全选单选
                                        //<input type="checkbox" id="nba" name="sport" value="nba" style="">\
                                        //<label name="nba" class="checked allBox" for="nba">&nbsp;&nbsp;&nbsp;</label><span></span>\
                                }
                                return str;
                            };

                            //调用分页
                            laypage({
                                cont: $('.jumpPage'), //容器。值支持id名、原生dom对象，jquery对象,
                                pages: pages, //总页数
                                skip: true, //是否开启跳页
                                skin: '#e44523',
                                groups: 5,//可视页数,
                                first:1,//将首页显示为数字1。若不显示，设置false即可
                                last: pages,//将尾页显示为总页数。若不显示，设置false即可
                                prev: '<', //若不显示，设置false即可
                                next: '>', //若不显示，设置false即可
                                jump: function (obj, first) {
                                    $('.checkT').html(thisDate(obj.curr));
                                    $page.methods.pageEvent();
                                }//连续显示分页数
                            });
                        } else {
                        	$(".carInformation").html("")
                            layer.alert(Response.rspDesc);
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },
            pageEvent: function(){
            	$('label').removeAttr('class');
            	$('.checkT').on("click","label",function () {
                    if ($(this).hasClass('checked')) {
                        $(this).removeAttr('class');
                    } else {
                        $(this).attr('class', 'checked');
                    }
                    var radioId = $(this).attr('name');
                    $('input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
                });
                //删除
               
                $('.delete').click(function () {
                	//alert(1)
                    var check = $('.checkT .checked').length;
                    
                    if(check <= 0){
                    	layer.alert("您还没有选择哦！");
                    	return;
                    }else{
                 	var id="";
                    	$(".checkT").find(".checked").each(function(){
                    		id+=$(this).attr("data-id")+",";	           		
                    	})
                    	//console.log(id.split(",")[0]);
						


                    	
                    }
                    
                });
                
            	
            	
            }
            
            
        };
        return $page.methods;
    };
})(jQuery);

