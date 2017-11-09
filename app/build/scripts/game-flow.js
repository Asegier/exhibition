var processing = false;

var gameInit = function(){
	if(getCookie("play") == 1 && getCookie("qrcode")){
    	$(".questions").removeClass("active");
		$(".activity-game-thanks").addClass("active");
		$(".activity-game-thanks-qr").attr("src", "../data/qrimg.php?code="+getCookie("qrcode")+"");
    }else{
		gameStartNext();
		endGame();
	}
}
var gameStartNext = function(){
	$(".activity").on("click", ".game-next", function(){
		consoleThis("gameStart", "game btn clicked");
		var index = $( ".game-next").index(this);
		gameQuestionsNext(index, );
	})
}
var gameQuestionsNext = function(index) {
	consoleThis("gameQuestionsNext index", index);
	$(".questions").removeClass("active");
	$(".questions").eq(index+1).addClass("active");
	getRangeValue(index, );
}

var getRangeValue = function(index){
		// consoleThis("SCORE", score);
	//IE
	// $(".activity-game-circle-range").on('change','#input-range-1', function() {
	// 	var value = $("#input-range-1").val();
	// 	changeCirclePos(value);
	// 	consoleThis("get range value", value);
	// });
	var id = "#input-range"+index;
	$(".activity-game-circle-range").on('input', id, function() {
		var value = $(id).val();
		var index = $(".input-range").index(this);
		changeCirclePos(value, index);
		// calculateScore(index, value, score);9
		console.log("get range value index", value+ " & " +index);
	});
};

var changeCirclePos = function(value, index){
	$(".activity-game-circle-innerwrapper").eq(index).css("left", value+"%")
}

var endGame = function() {
	var final = []
	// var total = 0;
	$(".activity").on("click", ".end-game", function(){
		// consoleThis(obj)
		$('.input-range').each(function(){
			if(this.value<50){
				// consoleThis(this.value+" value smaller than 50")
				final.push(0)
				return;
			}else{
				// total = total +1
				final.push(1)
			}
		    consoleThis(final);
		});
		showAns(final);
	})
}

var showAns = function (final){
	var finalStr = final.toString();
	console.log(finalStr)
	$("#qaresult").val(finalStr);
	$(".questions").removeClass("active");
	$(".activity-game-ans").addClass("active");

	var createContent = function(final){
		// for(var i = 0; i < ansData.length; i++){
		var finalStr = final.toString();
		if (finalStr == "1,1,1"){
			var obj = ansData[0];
		} else if (finalStr == "0,1,0" || finalStr == "1,1,0") {
			var obj = ansData[1];
		} else if (finalStr == "1,0,0" || finalStr == "0,0,0") {
			var obj = ansData[2];
		} else if (finalStr == "1,0,1" || finalStr == "0,1,1" || finalStr == "0,0,1"){
			var obj = ansData[3];
		}

			var path = obj.path;
			var description = obj.description;
			var header = obj.header;
			var caption = obj.caption;
			insertData(header, description, path, caption);
		// }
	}
	var insertData = function(header, description, path, caption){
		var template = '<div class="col-xs-12 activity-game-ans-header">\
							<img src="../images/header-line.jpg" alt="" class="activity-game-header-line">\
							<h3>'+
								header+
							'</h3>\
							<img src="../images/header-line.jpg" alt="" class="activity-game-header-line">\
						</div>\
						<div class="col-xs-12 text-left">\
							<p class="activity-game-ans-description">'+
								description+
							'</p>\
						</div>\
						<div class="col-xs-12">\
							<div class="activity-black-box-btn thanks-qr">\
								换领限定礼品<span><img src="../images/icon-right-arrow-white.png" alt=""></span>\
							</div>\
						</div>\
						<div class="col-xs-12 activity-game-ans-sub-head">\
							<h4>让一双鞋子，道出属于你的故事。</h4>\
							<h4>与你个性相连的鞋子是：</h4>\
						</div>\
						<div class="col-xs-12">\
							<img src=' + path + ' alt="" class="product-img">\
							<p class="text-left activity-game-ans-caption">'+
								caption+
							'</p>\
						</div>';
		$(".activity-game-ans").append(template);

	}
	createContent(final);
	redeemBtn();
}
var redeemBtn = function(){
	$(".activity").on("click", ".thanks-qr", function(){
		//$(".activity-game-ans").removeClass("active");
		//$(".activity-game-thanks").addClass("active");
		consoleThis("clicked");
		if(processing == false){
			processing = true;

			//$("#form").submit();
			$.ajax({
	           type: "POST",
	           url: "../data/submit_game.php",
	           data: {
	           		qaresult: $("#qaresult").val(),
	           		lang: "sc"
	           },
	           success: function(data)
	           {
	           		var jsondata = $.parseJSON(data);
	           		processing = false;
	               	if(jsondata.result == 1){
	               		$(".activity-game-ans").removeClass("active");
						$(".activity-game-thanks").addClass("active");
						$(".activity-game-thanks-qr").attr("src", "../data/qrimg.php?code="+getCookie("qrcode")+"");
						setCookie("play", 1, 365);
						setCookie("qrcode", jsondata.code, 365);
	               	}else{
						alert("系统繁忙 请稍后重试");
	               	}
	           }
	         });

		}
	return false;

	})
}
// showAns(1);

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;";//secure
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
