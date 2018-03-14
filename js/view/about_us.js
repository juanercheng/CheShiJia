$(function(){
	/*点击导航栏*/
	$(".pesonalCenterHomeL1 h3").click(function(){
		$(this).addClass("likeName").parent().siblings().find("h3").removeClass("likeName");
		$(this).index();
		$(this).find("span").addClass("stateN").parent().parent().siblings().find("span").addClass("stateM").removeClass("stateN");
		$(this).find("span img").attr("src","imgs/state.png").parent().parent().parent().siblings().find("span img").attr("src","imgs/statam.png");
	});

    $.ajax({
        type: "POST", //提交方式
        url: root_path + "information/getAboutUs", //绝对路径
        dataType: 'json',
        success: function (Response) {
            if (Response.rspCode == "0000") {
                $(".content").html(Response.data.content)
            }
            else{
                layer.alert(Response.rspDesc);
            }
        }
    })
    
    
    
    
    
    
})
