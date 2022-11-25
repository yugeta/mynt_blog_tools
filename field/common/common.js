if(typeof($LIB)=='undefined'){$LIB={}}

/*--------------------
JavaScript Liblary



--------------------*/

/*transformation*/
$LIB.trans={
	pos:function(e,t){
		if(typeof(t)=='undefined' || t==null){
			t = document.body;
		}
		if(typeof(e)=='undefined' || e==null){
			e = document.body;
		}
		//座標算出;
		var pos={x:0,y:0};
		
		
//		var flg=0;
		do{
			if(e == t){break}
			if(typeof(e)=='undefined' || e==null){return pos;}
			
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
//			if(flg>10000){break}
//			flg++;
		}
		while(e = e.offsetParent);
		
		return pos;
	},
	size:function(e){
		//対象element
		if(typeof(e)=='undefined'){
			if (navigator.userAgent.match("MSIE")&&document.compatMode!='BackCompat'){
				e = document.documentElement;
			}
			else{
				e = document.getElementsByTagName("body")[0];
			}
		}
		//サイズ取得;
		var size={
			x:e.offsetWidth,
			y:e.offsetHeight
		};
		
		//子階層依存※下に１つのみの子を持つ場合サイズチェックを行う;
		if(e.childNodes.length==1 && e.tagName=='A'){
			var chk ={
				x:e.childNodes[0].offsetWidth,
				y:e.childNodes[0].offsetHeight
			};
			if(chk.x > size.x){
				size.x = chk.x;
			}
			if(chk.y > size.y){
				size.y = chk.y;
			}
		}
		
		return size;
	}
};

/*ajax*/
$LIB.ajax={
	//XMLHttpRequestオブジェクト生成;
	load:function(file , method){
		var ajax={};
		ajax.httpoj = $LIB.ajax.createHttpRequest();
		if(!ajax.httpoj){return}
		//open メソッド;
		ajax.httpoj.open( method || "POST" , file , false );
		ajax.httpoj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		
//		ajax.httpoj.send();
		
		return ajax.httpoj;
	},
	createHttpRequest:function(){
		//Win ie用
		if(window.ActiveXObject){
			try {
				//MSXML2以降用;
				return new ActiveXObject("Msxml2.XMLHTTP")
			}
			 catch(e){
				try {
					//旧MSXML用;
					return new ActiveXObject("Microsoft.XMLHTTP")
				}
				catch(e2){
					return null
				}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){
			return new XMLHttpRequest()
		}
		else{
			return null
		}
	},
	/*
	//コールバック関数 ( 受信時に実行されます );
	on_loaded:function(oj){
		//レスポンスを取得;
		res  = oj.responseText;
		//ダイアログで表示;
//		if(res && res.match(/^[a-z|$]/)){
		if(res){
			return res;
//			fn(res);
//			alert(res);
		}
	},
	*/
	$:0
};

/*Web-Storage (local-storage)*/
$LIB.webstorage={
	
};

/*イベント処理*/
$LIB.event={
	add:function(elm, mode, func){
		//other IE;
		if (elm.addEventListener){
			elm.addEventListener(mode, func, false);
		}
		//IE;
		else{
			if(m=='load'){
				var d = document.body;
				if(typeof(d)!='undefined'){d = window;}
				
				if((typeof(onload)!='undefined' && typeof(d.onload)!='undefined' && onload == d.onload) || typeof(eval(onload))=='object'){
					elm.attachEvent('on' + mode, function() { func.call(elm , window.event); });
				}
				else{
					func.call(t, window.event);
				}
			}
			else{
				elm.attachEvent('on' + mode, function() { func.call(elm , window.event); });
			}
		}
	},
	device:{
		check:function(){
			//スマートフォン
			if(typeof(window.ontouchstart)!='undefined'){
				return "smartphone";
			}
			//その他※PC
			else{
				return "pc";
			}
		}
	},
	mouse:{
		pos:{x:0,y:0},
		proc:function(e){
			//IE以外のブラウザ;
			if(e){
				$LIB.event.mouse.pos={
					x:e.clientX,
					y:e.clientY
				};
			}
			//IE処理;
			else{
				$LIB.event.mouse.pos={
					x:event.x,
					y:event.y
				};
			}
		}
	},
};
//$LIB.event.add(window,"mousemove",$LIB.event.mouse.proc);

/*page-control*/
$LIB.page={
	set:function(){
		
		//Aタグ処理
		$LIB.event.add(window, "load", $LIB.page.click);
		//スマホの場合に、上部バウンス禁止処理
		$LIB.event.add(window, "load", $LIB.page.bounce.set);
		//スクロール固定
//		$LIB.event.add(window, "load", $LIB.page.scroll_stop);
		
		//スクロール値リセット
		$LIB.event.add(window, "load", function(){setTimeout(function(){document.body.scrollTop=0},0)});
		
		//雑多処理
		$LIB.event.add(window, "load", $LIB.page.proc);
		
	},
	
	proc:function(){
		//ページサイズ処理
		/*
		var size = $LIB.trans.size(document.body);
		var y = size.y;
		*/
		/*
		var y = document.getElementsByTagName("body")[0].scrollHeight + 80;
		
//		alert(y);
		document.getElementsByTagName("html")[0].style.setProperty("height", y+"px");
		document.getElementsByTagName("body")[0].style.setProperty("height", y+"px");
		*/
		
	},
	
	//スクロール固定
	scroll_stop:function(event){
		if(!document.body.className.match("scroll_stop")){return}
		
		 event.preventDefault();
	},
	
	//バウンスコントロール
	bounce:{
		set:function(){
			//スクロール値リセット
//			document.body.scrollTop=0;
			
			//スクロール値操作
			window.scrollTo(0,0);
//			document.body.scrollTop=0;
			$LIB.event.add(document, "touchstart", $LIB.page.bounce.top);
			$LIB.event.add(document, "touchmove", $LIB.page.bounce.move);
			$LIB.event.add(document, "touchend", $LIB.page.bounce.end);
		},
		top:function(){
//			$LIB.page.scroll_stop(e);
			
//			e.preventDefault();
			
//			document.getElementById("test").value = document.body.scrollTop;
			if(document.body.scrollTop<=0){
				$LIB.page.bounce.count=20;
				document.body.scrollTop=0;
			}
			else{
				$LIB.page.bounce.count=0;
				return;
			}
//			return false;
		},
		move:function(event){
			if(document.body.getAttribute("data-transition")=='scroll_stop'){
				event.preventDefault();
			}
			
			$LIB.page.bounce.top();
		},
		/*
		start:function(){
//			$LIB.page.bounce.count=20;
		},
		*/
		end:function(){
//			if(document.body.scrollTop){return}
			if(!$LIB.page.bounce.count){return}
			
			$LIB.page.bounce.count--;
//			alert(document.body.scrollTop);
			/*
			if(document.getElementById("test")!=null){
				document.getElementById("test").value=(+new Date());
			}
			*/
			
			document.body.scrollTop=0;
			setTimeout($LIB.page.bounce.end,10);
//			setTimeout($LIB.page.bounce.top,500);
//			setTimeout($LIB.page.bounce.top,1000);
		}
	},
	click:function(){
		//id=page処理
		if(document.getElementById("page")!=null){
			$LIB.page.elm = document.getElementById("page");
		}
		else{
			$LIB.page.elm = document.body;
		}
		
		var a = document.getElementsByTagName("a");
		if(a.length){
			for(var i=0;i<a.length;i++){
				if(!a[i] || a[i].href.match('#')){continue}
				
				$LIB.page.next_prev(a[i]);
				/*
				var type ="";
				if(a[i].getAttribute('data-transition')=='prev'){
					a[i].onclick = function(){
						$LIB.page.url = this.href;
						$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_prev_out","");
						$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_nprev_in","");
						$LIB.page.elm.className += " page_move_slide_prev_out";
						
						setTimeout(function(){
							if(!$LIB.page.url){return}
							$LIB.page.elm.className = $LIB.page.elm.className.replace("page_move_slide_prev_out","page_move_slide_prev_in");
							location.href = $LIB.page.url;
							
						},500);
						return false;
					};
				}
				else{
					a[i].onclick = function(){
						$LIB.page.url = this.href;
						$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_next_in","");
						$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_next_out","");
						$LIB.page.elm.className += " page_move_slide_next_out";
						
						setTimeout(function(){
							if(!$LIB.page.url){return}
							$LIB.page.elm.className = $LIB.page.elm.className.replace("page_move_slide_next_out","page_move_slide_next_in");
							location.href = $LIB.page.url;
						},500);
						return false;
					};
				}
				*/
			}
		}
		
		var a2 = document.getElementsByTagName("input");
		if(a2.length){
			for(var i=0;i<a2.length;i++){
				$LIB.page.next_prev(a2[i]);
			}
		}
		
	},
	
	next_prev:function(e){
		var type ="";
		if(e.getAttribute('data-transition')=='prev'){
			e.onclick = function(){
				$LIB.page.url = e.getAttribute('href');
				$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_prev_out","");
				$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_nprev_in","");
				$LIB.page.elm.className += " page_move_slide_prev_out";
				
				setTimeout(function(){
					if(!$LIB.page.url){return}
					$LIB.page.elm.className = $LIB.page.elm.className.replace("page_move_slide_prev_out","page_move_slide_prev_in");
					location.href = $LIB.page.url;
					
				},500);
				return false;
			};
		}
		else{
			e.onclick = function(){
				$LIB.page.url = e.getAttribute('href');
				$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_next_in","");
				$LIB.page.elm.className = $LIB.page.elm.className.replace(" page_move_slide_next_out","");
				$LIB.page.elm.className += " page_move_slide_next_out";
				
				setTimeout(function(){
					if(!$LIB.page.url){return}
					$LIB.page.elm.className = $LIB.page.elm.className.replace("page_move_slide_next_out","page_move_slide_next_in");
					location.href = $LIB.page.url;
				},500);
				return false;
			};
		}
	},
	
	move:function(e){
		
	},
	query:function(uri){
		if(!uri){
			uri = location.href;
		}
		
		var a = uri.split("?");
		
		if(!a[1]){
			return;
		}
		
		var b = a[1].split("&");
		var q=[];
		for(var i=0;i<b.length;i++){
			var d = b[i].split("=");
			q[d[0]] = d[1];
		}
		
		return q;
	}
};

//保存データ
$LIB.data={
	data:{
		name:"GD",
		$:0
	},
	//web-storageが利用できるかどうかのチェック
	check:function(){
		if(localStorage){
			alert("WebStorageが利用できます。");
		}
		else{
			alert("WebStorageは利用できません。");
		}
	},
	load:function(game_name , mode){
		if(!game_name){return}
//		alert(game_name+"/"+mode);
		
//		return localStorage.getItem(game_name);
		
		//local-storage
		if(localStorage){
			var read = localStorage.getItem(game_name);//alert(read);
//			var read = $LIB.data.load(game_name);//alert(read);
			//内容をハッシュで返す
			if(mode=='hash'){
				var data={};
				
				if(read){
					var d1 = read.split("&");
					for(var i=0;i<d1.length;i++){
						var d2 = d1[i].split("=");
						if(d2.length!=2){continue}
						d2[1] = d2[1].split("&#61").join("=");
						d2[1] = d2[1].split("&#38").join("&");
//						d2[1] = d2[1].split("&#44").join(",");
						
						data[d2[0]] = d2[1];
					}
				}
				return data;
			}
			//内容全部stringで返す
			else{
				return read;
			}
		}
		//cookie
		else{
			
		}
		
		
	},
	
	//key , [vel1 , val1=val2]
	save:function(game_name, val1, val2){
		//local-storage
//		if(typeof(sessionStorage)!='undefined'){
		if(localStorage){
			if(typeof(val2)=='undefined'){
				localStorage.setItem(game_name , val1);
			}
			else{
				var data = $LIB.data.load(game_name,"hash");
				
				var flg=0;
				var val=[];
				for(var i in data){//alert(i+"/"+val1+"/"+game_name);
//					if(data[i]==''){continue}
					
					if(i==val1){//alert(i+"/"+game_name);
						val[val.length] = val1+"="+val2;
						flg++;
						continue;
					}
					
					//文字列置換
					data[i] = data[i].split("&").join("&#38;");
					data[i] = data[i].split("=").join("&#61;");
//					data[i] = data[i].split(",").join("&#44;");
					
					val[val.length] = i+"="+data[i];
//					flg++;
				}
				if(!flg){
					val[val.length] = val1+"="+val2;
				}
				
//				alert(val.join("&"));
				
				localStorage.setItem(game_name , val.join("&"));
			}
		}
		//cookie
		else{
			
		}
		
	},
	//localStorage数（該当ドメインに格納されているkeyの数）
	count:function(){
		return localStorage.length;
	},
	//localStorageに入っているkeyの一覧（配列）
	keys:function(){
		var keys=[];
		for(var i=0;i<localStorage.length;i++){
			keys[keys.length] = localStorage.key(i);
		}
		return keys;
	}
	
};


$LIB.page.set();

