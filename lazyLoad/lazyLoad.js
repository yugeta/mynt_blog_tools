/**
 * LazyLoad
 **/

 (function(){
 	var $$={};

	//page-load-start
	$$.start=function(){
		$$.LIB.eventAdd(document,"DOMContentLoaded",$$.store);
		$$.LIB.eventAdd(window,"scroll",$$.areaLoad);
		setTimeout($$.areaLoad,1000);
	};

	//It sets loading-gif-animation for all images.
	$$.store=function(){
		var imgs = document.getElementsByTagName("img");
		for(var i=0;i<imgs.length;i++){
			imgs[i].setAttribute("data-img-src",imgs[i].src);
			//loading-image
			imgs[i].src = "http://31.media.tumblr.com/6121c420e052ff53782d40806f0dc7d4/tumblr_nh1mchoRUh1sqqx06o1_500.gif";
		}
	};

	//It load inner-area-images.
	$$.areaLoad=function(){
		var win = $$.LIB.getBrowser();
		var imgs = document.getElementsByTagName("img");
		for(var i=0;i<imgs.length;i++){
			var attr = imgs[i].getAttribute("data-img-src");
			if(!attr){continue}
			//check position

			var pos  = $$.LIB.pos(imgs[i]);
			var size = $$.LIB.size(imgs[i]);
			//console.log(win.size.y+"/"+(win.scroll.y + win.size.y *2) +">="+ (pos.y + size.y));
			//console.log(pos.y+"/"+size.y+"/"+(win.scroll.y + win.size.y *2) +">="+ (pos.y + size.y));
			if(win.scroll.x + win.size.x *2 >= pos.x + size.x
			&& win.scroll.x - win.size.x <= pos.x
			&& win.scroll.y + win.size.y *2 >= pos.y + size.y
			&& win.scroll.y - win.size.y <= pos.y
			){
				//set image.
				imgs[i].src = attr;
				imgs[i].setAttribute("data-img-src","");
			}
		}
	};

	$$.LIB={
		//event-library [$$.eventAdd(window,"load",$$.set);]
		eventAdd:function(t, m, f){
			//other Browser
			if (t.addEventListener){t.addEventListener(m, f, false);}
			//IE
			else{
				if(m=='load'){
					var d = document.body;
					if(typeof(d)!='undefined'){d = window;}
					if((typeof(onload)!='undefined' && typeof(d.onload)!='undefined' && onload == d.onload) || typeof(eval(onload))=='object'){
						t.attachEvent('on' + m, function() { f.call(t , window.event); });
					}
					else{f.call(t, window.event)}
				}
				else{t.attachEvent('on' + m, function() { f.call(t , window.event); });}
			}
		},
		pos:function(e,t){
			//エレメント確認処理
			if(!e){return;}

			//途中指定のエレメントチェック（指定がない場合はbody）
			if(typeof(t)=='undefined' || t==null){
				t = document.body;
			}

			//デフォルト座標
			var pos={x:0,y:0};
			do{
				//指定エレメントでストップする。
				if(e == t){break}
				//対象エレメントが存在しない場合はその辞典で終了
				if(typeof(e)=='undefined' || e==null){return pos;}

				//座標を足し込む
				pos.x += e.offsetLeft;
				pos.y += e.offsetTop;
			}

			//上位エレメントを参照する
			while(e = e.offsetParent);

			//最終座標を返す
			return pos;
		},
		size:function(e){
			return{
				x:e.offsetWidth,
				y:e.offsetHeight
			};
		},
		getBrowser:function(){
			var scroll={x:0,y:0};
			if(navigator.userAgent.indexOf("safari")!=-1){
					scroll.x = window.scrollX,
					scroll.y = window.scrollY
			}
			else if(window.pageXOffset!=undefined){
					scroll.x = window.pageXOffset,
					scroll.y = window.pageYOffset
			}
			else if(document.compatMode=='BackCompat'){
					scroll.x = document.body.scrollLeft,
					scroll.y = document.body.scrollTop
			}
			else{
					scroll.x = document.documentElement.scrollLeft,
					scroll.y = document.documentElement.scrollTop
			}
			return {
				all:{
					x:document.body.offsetWidth,
					y:document.body.offsetHeight
				},
				size:{
					x:window.innerWidth,
					y:window.innerHeight
				},
				scroll:scroll
			};
		}
	};

	$$.start();
	window.$$lazyLoad = $$;
	return $$;
 })();
