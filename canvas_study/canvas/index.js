(function(){
	var $$={};

	$$.set = function(){
		var canvas = $$CANVAS.getCanvas({parentElement:document.getElementById("canvas"),id:"test"});

		if(canvas.getContext){

			$$.graph.view({
				id:"test",
				data:[
					{name:"aaa",value:100},
					{name:"bbb",value:300},
					{name:"ccc",value:210},
					{name:"ddd",value:500},
					{name:"eee",value:280}
				]
			});
			/*
			var context = canvas.getContext('2d');
			//左から20上から40の位置に、幅50高さ100の四角形を描く
			context.fillRect(20,40,50,100);
			//色を指定する
			context.strokeStyle = 'rgb(00,00,255)'; //枠線の色は青
			context.fillStyle   = 'rgb(255,00,00)'; //塗りつぶしの色は赤
			//左から200上から80の位置に、幅100高さ50の四角の枠線を描く
			context.strokeRect(200,80,100,50);
			//左から150上から75の位置に、半径60の半円を反時計回り（左回り）で描く
			context.arc(150,75,60,Math.PI*1,Math.PI*2,true);
			context.fill();
			*/
		}

	};

	$$.graph = {
		option:{
			id:null,
			class:null,
			attribute:null,

			data:[]
		},
		view:function(option){

			var elms = $$.graph.getElement(option);

		},
		getElement:function(option){
			var elms = [];
			//--id

			if(option.id){
				var elm = $$.graph.getElement_id(option.id);
				if(elm){elms.push(elm)}
			}
			//--class
			if(option.class){
				var classes = $$.graph.getElement_class(option.class);
				for(var i=0;i<classes.length;i++){
					elms.push(classes[i]);
				}
			}
			//--attribute[data-graph]
			if(option.attribute){
				var attributes = $$.graph.getElement_attribute(option.attribute);
				for(var i=0;i<attributes.length;i++){
					elms.push(attributes[i]);
				}
			}

			return elms;
		},
		getElement_id:function(id){
			if(!id){return}
			var elm = document.getElementById(id);
			if(elm==null){return}
			return elm;
		},
		getElement_class:function(className){
			if(!className){return}
			var elms = document.getElementsByClassName(className);
			if(!elms.length){return}
			return elms;
		},
		getElement_attribute:function(attribute){
			if(!attribute){return}
			var elms = document.body.getElementsByTagName("canvas");
			if(!elms.length){return}
			var atts = [];
			for(var i=0;i<elms.length;i++){
				if(elms[i].getAttribute("data-graph")==attribute){
					atts.push(elms[i]);
				}
			}
			return atts;
		},

		dataMerge:function(option){
			if(!option){return $$.graph.option}


			return option;
		}
	};


	//$$.eventAdd(window,"load",$$.set);
	$$.eventAdd=function(t, m, f){

		//other Browser
		if (t.addEventListener){
			t.addEventListener(m, f, false);
		}

		//IE
		else{
			if(m=='load'){
				var d = document.body;
				if(typeof(d)!='undefined'){d = window;}

				if((typeof(onload)!='undefined' && typeof(d.onload)!='undefined' && onload == d.onload) || typeof(eval(onload))=='object'){
					t.attachEvent('on' + m, function() { f.call(t , window.event); });
				}
				else{
					f.call(t, window.event);
				}
			}
			else{
				t.attachEvent('on' + m, function() { f.call(t , window.event); });
			}
		}
	};

	$$.eventAdd(window,"load",$$.set);
	return $$;
})();
