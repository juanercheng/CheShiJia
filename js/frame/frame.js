(function($) {
    //radio
    $.radio=function(element,parameter){
        var $radio=$(element);
        $.data(element, "radio", $radio);
        $radio.methods = {
            init:function(){
                $radio.type=parameter.type||"li";
                if($radio.find($radio.type).size()<=0)$radio.type="p";
                if($radio.find($radio.type).size()<=0)$radio.type="span";
                $radio.content=$radio.find($radio.type);
                $radio.label=parameter.label||false;
                $radio.callback=parameter.callback||null;
                $radio.currentCallback=parameter.currentCallback||null;
				$radio.parentsEvent=$radio.hasClass("radioEvent");
                if(parameter.bionic) $radio.creat();
            }
        };
        $radio.creat=function(){
            $radio.content.each(function(index){
                if($(this).hasClass("radio-view")) return;
                var input=$(this).find("input");
                var parent=input.parent();
                $('<span class="radio-view"><em class="radio-view-em"></em></span>').appendTo(parent).append(input);
                input.change(function(){$radio.style();if($radio.callback)$radio.callbackValue();if($radio.currentCallback) $radio.currentCallback({$element:$(this),checked:$(this).prop("checked")});});
				if($radio.parentsEvent)$(this).click(function(e){if($(this).find("input").attr("type")=="radio"&&!$(this).find("input").attr("disabled"))$radio.replayCheck();$radio.styleLi($(this));}); else 
				$(this).find("em.radio-view-em").click(function(){if($(this).find("input").attr("type")=="radio"&&!$(this).find("input").attr("disabled"))$radio.replayCheck();$radio.styleLi($(this).parents(".radio-view"));});
                if($radio.label)$(this).find($radio.type).find("label").click(function(){$radio.style();});
                if($(this).find("input").attr("disabled"))$(this).find("em.radio-view-em").addClass("disabled");
            });
            $radio.style();
            if($radio.callback)$radio.callbackValue();
        };
        $radio.style=function(){
			$radio.find($radio.type).each(function(index){
				if($(this).find("input").prop("checked")){$(this).find("input").attr("checked","checked");$(this).find(".radio-view-em").addClass("cur");
				}else{$(this).find("input").removeAttr("checked");$(this).find(".radio-view-em").removeClass("cur");};
			});	
        };
		$radio.styleLi=function(el){
		    if(el.find("input").attr("disabled"))return false;
			if(el.find("input").is(":checked")){
				el.find("input").removeAttr("checked");el.find(".radio-view-em").removeClass("cur");
			}else{
				el.find("input").prop("checked","checked");el.find("input").attr("checked","checked");el.find(".radio-view-em").addClass("cur");
			}
			el.find("input").trigger("change");
        };
        $radio.replayCheck=function(){
            $radio.content.each(function(index) {
                   $(this).find("em").removeClass("cur");
                   $(this).find("input").removeAttr("checked");
             });
        },
        $radio.callbackValue=function(){
            var allchecked=[];
			var checked=[];
            $radio.content.each(function(index){
				allchecked.push({$element:$(this).find("input").get(0),index:index,value:$(this).find("input").val(),name:$(this).find("input").attr("name"),id:$(this).find("input").attr("id"),checked:$(this).find("input").is(":checked")});
                if($(this).find("input").prop("checked"))checked.push({$element:$(this).find("input").get(0),index:index,value:$(this).find("input").val(),name:$(this).find("input").attr("name"),id:$(this).find("input").attr("id"),checked:true});
            });
            $radio.callback(element,checked,allchecked);
        };
        $radio.methods.init();
    };
	//pupop
    $.popup = {
        show:function(parameter){
            new $.setAjax({
                url:parameter.url+"?r="+Math.random()*100000,
                success:function(data){if(parameter.complete) parameter.complete(data);$.popup.event(parameter);},
                error:function(){if(parameter.error) parameter.error();}    
            });
        },
        hide:function(parameter){
            if(parameter.closeComplete)parameter.closeComplete();
            if(parameter.el) $(parameter.el).hide();
        },
        remove:function(parameter){
            if(parameter.closeComplete)parameter.closeComplete();
            if(!parameter){$(".popup").remove(); return false;}
            if(parameter.el) $(parameter.el).remove();
        },
        event:function(parameter){
            if($(".closePop").size()>0)$(".closePop").click(function(){$.popup.click($(this),parameter);});
            if($(".popBg").size()>0)$(".popBg").click(function(){$.popup.click($(this),parameter);});
        },
        click:function(el,parameter){
            if(!parameter||!parameter.close){
                $.popup.hide({el:el.parents(".popup"),closeComplete:parameter.closeComplete});
            }else{
                $.popup.remove({el:el.parents(".popup"),closeComplete:parameter.closeComplete});
            }
        }
    };
    //select
    $.select=function(element,parameter){
        var $select=$(element);
        $select.methods={
            init:function(){
                if($select.children("select").size()<=0)return false;
                this.setVal();
                $select.methods.event();
            },
            event:function(){$select.children("select").change(function(){$select.methods.setVal();});},
            setVal:function(){$select.children(".selectVal").html($select.children("select").children(":selected").text());}
        };
        $.data(element, "select", $select.methods);
        $select.methods.init();
    };
   	//ajax
    $.setAjax=function(parameter){
        var type=parameter.type||"GET";
        var dataType=parameter.dataType||"html";
        var url=parameter.url||null;
        var data=parameter.data||null;
        var success=parameter.success||null;
        var error=parameter.error||null;
        if(!parameter.url||parameter.url==""){setTimeout(function(){if(success)success(parameter.test,parameter);},500);return false;}
        $.ajax({type:type,dataType:dataType,url:url,data:data,
           success:function(msg){if(success)success(msg,parameter);} ,
           error: function(msg){if(error)error(msg,parameter);}
        });
    };
    $.fn.select=function(options){var options = options || {};return this.each(function() {new $.select(this, options);});};
    $.fn.radio=function(options){var options = options || {};return this.each(function() {new $.radio(this, options);});};
 })(jQuery);