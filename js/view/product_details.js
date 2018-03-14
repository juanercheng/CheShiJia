// JavaScript Document
(function ($) {
    $.page = function () {
        var $page = {};
        $page.methods = {
            init: function () {
                this.SetProductDetails();
                this.getCarAjax();

            },
            SetProductDetails: function () {
                var imgId = GetQueryString('id');
                //获取URL地址参数（中文除外）
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };

                //车型详情接口
                $.ajax({
                    cache: "False",
                    type: "POST", //提交方式
                    url: root_path + "car/getCarDetail", //绝对路径
                    data: {
                        id: imgId,
                    }, //数据，这里使用的是Json格式进行传输
                    dataType: 'json',
                    success: function (Response) {
                        if (Response.rspCode == "0000") {
                            $('.productDetailsTop').html("");
                            var data = Response.data;
                            console.log(data)
                            if(data.img==""){
                                data.img = "imgs/528.jpg";
                            }
                            //优惠规则值
                            data.guideprice1 = parseFloat(data.guideprice1);
                            data.feevalue = parseFloat(data.feevalue);
                            console.log("现在");
                            console.log(data.feerule);
                            switch (data.feerule) {
                                case "优惠":
                                    var ruleStr = "直降" + data.feevalue + "万";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal-rulePriceTotal1).toFixed(2);
                                    break;
                                case "下点":
                                    var ruleStr = "下" + data.feevalue + "点";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=((rulePriceTotal*(1-(rulePriceTotal1*0.01))).toFixed(2));
                                    break;
                                case "直接报价":
                                    var ruleStr = "直接报价";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal1).toFixed(2);
                                    break;
                                case "电议":
                                    var ruleStr = "电议";
                                    var priceTotal=Number(data.guideprice1);
                                    break;
                                case "加":
                                    var ruleStr = "加" + data.feevalue + "万";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal+rulePriceTotal1).toFixed(2);
                                    break;
                                case "2186":
                                    var ruleStr = "下" + (data.feevalue).toFixed(2) + "点";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=((rulePriceTotal*(1-(rulePriceTotal1*0.01))).toFixed(2));
                                    break;
                                case "2187":
                                    var ruleStr = "直降" + (data.feevalue).toFixed(2) + "万";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal-rulePriceTotal1).toFixed(2);
                                    break;
                                case "2188":
                                    var ruleStr = "加" + data.feevalue + "万";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal+rulePriceTotal1).toFixed(2);
                                    break;
                                case "2189":
                                    var ruleStr = "直接报价";
                                    var rulePriceTotal=Number(data.guideprice1);
                                    var rulePriceTotal1=Number(data.feevalue);
                                    var priceTotal=(rulePriceTotal1).toFixed(2);
                                    break;
                                case " ":
                                    var ruleStr = " ";
                                    break;
                                default:
                                    break
                            }
                            var productT = "<div class='_img_car' >"+"<img class='' src='"+data.imagePath+"'>"+"</div>"+
                                "<div class='pDInformation'>"+
                                "<h2>"+data.name+"</h2>"+
                                "<p>"+
                                "<span class='carPrice'>"+priceTotal+"万</span>"+
                                "<em class='guideprice'>"+(data.guideprice1).toFixed(2)+"</em>万/<em>"+ruleStr+"</em>"+
                                "</p>"+
                                "<div class='carInfo'>"+
                                "</div>"+
                                "<p class='carNum'>库存数量："+data.stock+"辆"+
                                "</p>"+
                                "<p>外观/内饰颜色："+data.color1+"/"+data.color2+"</p>"+
                                "<p>车辆状态："+data.carstatus+"</p>"+
                                "<div class='drop dropOne'>"+
                                "<span>销售区域："+data.addressto+"</span>"+
                                "</div>"+
                                "<div class='drop dropTwo'>"+
                                "<span>提车区域："+data.region+"</span>"+
                                "</div>"+
                                "<p>"+
                                "<button class='nowAsk'>立即询价" +
                                "<div class='contact'>"+
                                "<p>联系人：<em>"+data.membername+"</em></p>"+
                                "<p>联系电话：<em>"+data.membermobile+"</em></p>"+
                                 "<img src='./imgs/delete.png'>"+
                                "</div>"+
                                "</button>"+
                                "<button class='buyBtn'>支付定金</button>"+
                                "</p>"+
                                "</div>";

                            $('.productDetailsTop').append(productT);
                            if(data.price=="0.00"){
                                $(".carPrice").text("电议");
                            }
                            if(data.stock==0){
                                $(".carNum").html("数量：0 辆（库存<a class='amount'>"+data.stock+"</a>辆）");
                            }
                            // if(data.guideprice2!=data.guideprice1){
                            //     $(".guideprice").html(data.guideprice1+"-"+data.guideprice2)
                            // }
                            var requirList = data.requirement.split(",");
                            for(var j = 0; j<requirList.length;j++){
                                if(requirList != ""){
                                    var requirStr = "<span>"+requirList[j]+"</span>";
                                    $('.productDetailsTop .carInfo').append(requirStr);
                                }
                            }
                            //定金支付点击事件
                            $(".buyBtn").click(function(){
                                if(sessionStorage.getItem('token')){
                                    if(data.stock!=0){
                                        window.location.href = "pay_in_advance.html?id="+imgId;
                                    }else{
                                        layer.alert("库存不足！");
                                    }
                                }else{
                                    window.location.href = "log_in.html";
                                }
                            });


                            //立即询价点击事件
                            $(".nowAsk").click(function(e){
                                $(this).addClass("chooseThis")
                                $(".contact").show();
                                var target = $(e.target);
                                if(target.is(".contact img")){
                                    $(".contact").hide();
                                    $(".nowAsk").removeClass("chooseThis");
                                }
                            });
                        } else {
                            // layer.alert(Response.rspDesc);//去掉该车型不存在提示
                        }
                    },
                    error: function() {
                        layer.alert("服务器异常，请稍后处理！");
                    }
                });
            },

            getCarAjax:function(){
              if(window.sessionStorage.getItem("token")){
                  var imgId = GetQueryString('id');
                  //获取URL地址参数（中文除外）
                  function GetQueryString(name) {
                      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                      var r = window.location.search.substr(1).match(reg);
                      if (r != null) return unescape(r[2]);
                      return null;
                  };

                  //推荐车源接口
                  $.ajax({
                      cache: "False",
                      type: "POST", //提交方式
                      url: root_path + "market/getMainList",
                      data: {
                          token:sessionStorage.getItem("token"),
                          page: 1,
                          rows: 4,
                          type:1
                      },
                      dataType: 'json',
                      success:function(Response){
                          if(Response.rspCode == "0000"){
                              var data = Response.data.mainList;
                              for(var i = 0;i<data.length;i++){
                                  $common.methods.initModel(data,i);
                                  var area = data[i].region;
                                  var require = data[i].requirement;
                                  data[i].companyName = data[i].companyname;
                                  $common.methods.model(data,i,".carList",area,require);
                              }
                              $('.carList li').click(function () {
                                  var carId = $(this).attr('id');
                                  window.location.href = "product_details.html?id=" + carId;
                              });
                          }else{
                              layer.alert(Response.rspDesc);
s
                          }
                      },
                      error:function(){
                          layer.alert("服务器异常，请稍后处理！");
                      }
                  });
              }else{
                  $('.recommend').html("");
              }
            },


        };
        return $page.methods;
    };
})(jQuery);



