$(function(){
	//文化列表
	$.ajax({
        type: "POST", //提交方式
        url: root_path + "information/getNews", //绝对路径
        dataType: 'json',
        success: function (Response) {
           
            var data=Response.data.newsList;
            if (Response.rspCode == "0000") {
                //$(".content").html(Response.data.content)
                console.log(Response);
                for(var i=0;i<data.length;i++){
                	
                    var oLi='<li url=' + data[i].url + '>'
                               +'<div class="Cultural-Img">'
                		       +'<img src="'+data[i].cover+'" >'                               
                               +'</div>'
                		       +'<div  class="classification">'
                			   +'<h1>'+data[i].source+ '</h1>'
                			   +'<h4>'+data[i].summary+'</h4>'
                			   +'<h3><img src="imgs/fengcai.png">'+data[i].infoType+'</h3>'
                		       +'</div>'
                	           + '</li>'
                	    $(".Cultural-list").append(oLi) ;
                };
                $(".Cultural-list li").click(function () {
                    var url = $(this).attr("url");
                    window.location.href ="Literary-grace.html?"+url;
                })
            }
            else{
                layer.alert(Response.rspDesc);
            }
        }
    })

	
})