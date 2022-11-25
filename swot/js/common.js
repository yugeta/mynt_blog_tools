;(function(){
  var $$ = function(){
    $$LIB.prototype.setEvent(window, "load", $$.prototype.start);
  };

  $$.prototype.start = function(){
    var side_menu = document.getElementById("side-menu");
    if(side_menu !== null){
      var side_menus = document.getElementsByClassName("side-menu");
      for(var i=0; i<side_menus.length; i++){
        if(side_menus[i].getAttribute("data-nav")!=="1"){continue;}
        side_menu.innerHTML += side_menus[i].innerHTML;
      }
    }
  };

  var $$LIB = function(){};
  $$LIB.prototype.setEvent = function(target, mode, func){
		//other Browser
		if (typeof target.addEventListener !== "undefined"){
      target.addEventListener(mode, func, false);
    }
    else if(typeof target.attachEvent !== "undefined"){
      target.attachEvent('on' + mode, function(){func.call(target , window.event)});
    }
		// else{
    //   console.log(target);
    //   console.log("[warning] "+target);
    // }
	};

  new $$;
})();
