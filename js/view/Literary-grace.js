$(function(){
	var Url=window.location.search;
    var str=Url.substring(1);
    $(".myOrder").load(str)
});