/**
 * Created by Administrator on 2017/8/21.
 */
(function($){
    $.page = function(){
        var $page = {};
        $page.methods = {
            init:function(){
                this.import();
            },
            import:function(){
                //返回上一层
                $('.detailCarresourse').click(function () {
                    // console.log(23);
                    window.history.back();
                });
                $(".releaseBtn").click(function(){
                    var importContent = $("textarea").val();
                    if(!importContent){
                        alert("请填写导入信息！");
                        return
                    }
                    //格式匹配：
                    var strs= new Array(); //定义一数组
                    var arr=[]
                    strs=importContent.split("；"); //字符分割
                    for (var i=0;i<strs.length ;i++ )
                    {
                        arr.push(strs[i]);
                    }
                    // console.log(arr)
                    var rec2=/^[0-9]+.?[0-9]*$/ //库存
                    var check;
                    for (var i in arr){
                        if(importContent.indexOf("/")!=-1){
                            check=arr[1].indexOf("/")!=-1&&arr[2].match(rec2)&&arr[3].indexOf("/")!=-1&&arr[4].indexOf("/")!=-1&&/\d/gi.test(arr[6])&&/\d/gi.test(arr[7])
                            if(check===false){
                                alert("请根据正确格式填写信息！");
                                return
                            }
                        }else {
                            alert("请根据正确格式填写信息！");

                            return
                        }

                    }

                    $.ajax({
                        type:"POST",
                        url:root_path+"market/addManyImport",
                        data:{
                            token:sessionStorage.getItem("token"),
                            importinfo:importContent
                        },
                        dataType:"json",
                        success:function(Response){
                            if(Response.rspCode=="0000"){
                                $('textarea').val("");
                                layer.open({
                                    content: Response.rspDesc,
                                    yes: function(index, layero){
                                        window.location.href="personal_home_my_options.html"
                                        layer.close(index);
                                    }
                                });
                            }else{
                                layer.alert(Response.rspDesc);
                            }
                        }
                    })
                })
            }

        }
        return $page.methods;
    }
})(jQuery);