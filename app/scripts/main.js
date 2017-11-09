//VARIABLES
var lang = window.location.pathname.split("/")[1];
var linkHeader = ["/"+lang+"/", "/"+lang+"/introduction.html", "/"+lang+"/event-details.html", "/"+lang+"/photos.html", "/"+lang+"/activity.html"];
//GLOBAL FUNCTION
var consoleThis = function(title, bacon){
	// console.log(title+": ", bacon)
};
//DOCUMENT READY
$( document ).ready(function() {
	init();
});
var init = function(){
    consoleThis( "init", "ready!" );
    headerActive();
    hamburgerOpen();
    timelineActive();
    timelineRedirect();
    getEndPath();
    mobileTimelineNav();
    checkEventTimeWidth();
    windowResized();
  	gameInit();
 //  	gameStartNext();
	// endGame();
}
var windowResized = function() {
	$( window ).resize(function() {
		checkEventTimeWidth();
	});
}
// Navbar Start, and inserting data
var headerActive = function() {
	var pathname = window.location.pathname;
	var index = linkHeader.indexOf(pathname);
	//account for index.html
	if(pathname==="/"+lang+"/index.html"){
		index = 0;
	}
	$(".navbar-nav.navbar-right li a").removeClass("active");
	$(".navbar-nav li a").eq(index).addClass("active");
	consoleThis("pathname", pathname)
	consoleThis("headerActive", linkHeader.indexOf(pathname));
	consoleThis("headerActive pathname", $(".navbar-nav li a").eq(index));

	//LOAD DYNAMIC DATA
	if(index === 1){
		createIntroData();
	}else if(index === 3){
		createPhotoData();
	}
}
// Mobile Navbar
var hamburgerOpen = function (){
	var hamburger = false; 
	$(".navbar").on("click", ".navbar-toggle", function(){
		consoleThis("hamburgerOpen", "clicked");
		if(!hamburger){
			$(".navbar-collapse").addClass("open");
			hamburger = true;
		}else{
			$(".navbar-collapse").removeClass("open");
			hamburger = false;
		};
	});
};
// Timeline, active class and show hide tabs 
var timelineActive = function(){
	$(".event-details, .main-menu").on("click", ".timeline-tab", function(){
		consoleThis("timelineActive", "timeline tab clicked");
		var index = $( ".timeline-tab" ).index(this);
		tabClicked(index);
	})
}
var timelineRedirect = function(){
	$(".main-menu").on("click", ".timeline-tab", function(){
		consoleThis("timelineRedirect", "main menu tineline clicked")
		var index = $( ".timeline-tab" ).index(this);
		var destinationRoot = "/"+lang+"/event-details.html?";
		window.location =  destinationRoot + index;
	})
}
var getEndPath = function(){
	var href = window.location.href;
	var hrefLast = href.slice(-1);
	if(!isNaN(hrefLast)){
		var num = parseInt(hrefLast);
		if (num >= 0 && num <=4) {
			tabClicked(num);
		}
	}
};
var mobileTimelineNav = function(){
	$(".event-details, .main-menu").on("click", ".timeline-next-tab", function(){
		consoleThis("mobileTimelineNav", "next tab btn clicked");
		var activeTab = $(".timeline-tab.active");
		var index = $(".timeline-tab").index(activeTab);
		if(index===4){
			tabClicked(0);
			consoleThis("Index of active tab 0", index);
		}else {
			tabClicked(index+1);
			consoleThis("Index of active tab", index);
		}
	})
	$(".event-details, .main-menu").on("click", ".timeline-back-tab", function(){
		consoleThis("mobileTimelineNav", "back tab btn clicked");
		var activeTab = $(".timeline-tab.active");
		var index = $(".timeline-tab").index(activeTab);
		if(index===0){
			tabClicked(4);
			consoleThis("Index of active tab 0", index);
		}else {
			tabClicked(index-1);
			consoleThis("Index of active tab", index);
		}
	})
};

var tabClicked = function(index){
	// consoleThis("Index: ", $( ".timeline-tab" ).index(track));
	$(".timeline-tab").removeClass("active");
	$(".timeline-item").removeClass("active");
	$(".timeline-tab").eq(index).addClass("active");
	$(".timeline-item").eq(index).addClass("active");
	displayTimelineContent(index);

}

var changeLang = function(newLang){
	window.location.href = window.location.href.replace("/"+lang+"/","/"+newLang+"/");
}

var displayTimelineContent = function(index){
	$(".tabs").removeClass("active");
	$(".tabs").eq(index).addClass("active");
}
// Inserting Data
var createIntroData = function(){
	var createContent = function() {
		for(var i = 0; i < introData.length; i++){
			var obj = introData[i];
			var path = obj.path;
			var description = obj[lang+"_description"];
			insertData(path, description);
		}
	}
	var insertData = function(path, description) {
		var template = '<div class="col-xs-12 col-sm-4">\
							<div class="thumbnail">\
						      <img src=' + 
						      path+
						      '>\
						      <div class="caption">\
						        <p>'+
						        description+
						        '</p>\
						      </div>\
						    </div>\
						</div>';
		$(".introduction-core").append(template);
	}
	createContent();
}
var createPhotoData = function(){
	
	var createContent = function() {
		for(var i = 0; i < photoData.length; i++){
			var obj = photoData[i];
			var arr = Object.keys(obj).map(function(e) {
			  return obj[e]
			});
			arr = arr[0];
			arr.forEach(function(element){
				var path = element;
				insertData(path, i);
			});
		}
	}
	var insertData = function(path, index) {
		var template = '<div class="col-xs-12 col-sm-4">\
							<div class="thumbnail">\
						      <img src='+
						      path+
						      '>\
						    </div>\
						</div>';
		$(".tabs").eq(index).append(template);
	}
	createContent();
}
// CSS with JS
var checkEventTimeWidth = function(){
	var width = $(".event-details-calendar-time").outerWidth();
	consoleThis("event width", width);
	if (width <= 193){
		$(".event-details-calendar-item").addClass("responsive");
	}else{
		$(".event-details-calendar-item").removeClass("responsive");
	}
}

