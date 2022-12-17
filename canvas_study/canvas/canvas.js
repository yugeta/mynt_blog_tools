(function(){
	var $$={};

	$$.set = function(){

	};

	/**
	 * option = { parentElement , id , width , height }
	 */
	$$.getCanvas = function(option){

		var canvas = document.createElement('canvas');
		if(typeof(option.id)!="undefined"){
			canvas.id = option.id;
		}

		if(typeof(option.width) =="undefined"){option.width =400}
		if(typeof(option.height)=="undefined"){option.height=400}

		canvas.width  = option.width;
		canvas.height = option.height;

		if(typeof(option.parentElement)=="undefined"){option.parentElement = document.body}

		option.parentElement.appendChild(canvas);

		return canvas;
	};

	window.$$CANVAS = $$;
	return $$;
})();
