!(function(){

	var $$={};

	/**
	* Library ---------------------
	*/
	/**
	* Event-Set
	* param @ t : Target-element
	* param @ m : mode ["onload"->"load" , "onclick"->"click"]
	* param @ f : function
	**/
	$$.eventAdd=function(t, m, f){
		//other Browser
		if (t.addEventListener){t.addEventListener(m, f, false)}
		//IE
		else{
			if(m=='load'){
				var body = document.body;
				if(typeof(body)!='undefined'){body = w;}
				if((typeof(onload)!='undefined' && typeof(body.onload)!='undefined' && onload == body.onload) || typeof(eval(onload))=='object'){
					t.attachEvent('on' + m, function() { f.call(t , window.event); });
				}
				else{f.call(t, w.event)}
			}
			else{t.attachEvent('on' + m, function() { f.call(t , window.event); })}
		}
	};
	/**
	* Get URL-property
	* return @ [url , domain , querys{}];
	**/
	$$.urlProperty=function(url){
		if(!url){url=location.href}

		var res = {};
		var urls = url.split("?");
		res.url = urls[0];
		res.domain = urls[0].split("/")[2];
		res.querys={};
		if(urls[1]){
			var querys = urls[1].split("&");
			for(var i=0;i<querys.length;i++){
				var keyValue = querys[i].split("=");
				if(keyValue.length!=2||keyValue[0]===""){continue}
				res.querys[keyValue[0]] = keyValue[1];
			}
		}
		return res;
	};

	/**
	 * Ajax
	 * $$.ajax.set({
	 * url:"**",
	 * method:"POST",
	 * async:true,
	 * query:{},
	 * querys:[],
	 * onSuccess:function(){}
	 * });
	 **/
	$$.ajax = {
		createHttpRequest:function(){
			//Win ie用
			if(window.ActiveXObject){
				//MSXML2以降用;
				try{return new ActiveXObject("Msxml2.XMLHTTP")}
				catch(e){
					//旧MSXML用;
					try{return new ActiveXObject("Microsoft.XMLHTTP")}
					catch(e2){return null}
				}
			}
			//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
			else if(window.XMLHttpRequest){return new XMLHttpRequest()}
			else{return null}
		},
		//XMLHttpRequestオブジェクト生成
		set:function(options){
			if(!options){return}
			var httpoj = new $$.ajax.createHttpRequest();
			if(!httpoj){return;}
			//open メソッド;
			option = $$.ajax.setOption(options);
			httpoj.open( option.method , option.url , option.async );
			//type
			//httpoj.setRequestHeader('Content-Type', option.type);
			if(typeof option.type != "undefined"){
				httpoj.setRequestHeader('Content-Type', option.type);
			}
			else{
				httpoj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
			//onload-check
			// httpoj.onreadystatechange = this.readystate(httpoj,option);
			httpoj.onreadystatechange = function(){
				//readyState値は4で受信完了;
				if (httpoj.readyState==4){
					//コールバック
					option.onSuccess(httpoj.responseText);
				}
			};
			//query整形
			var data = $$.ajax.setQuery(option);
			//send メソッド
			if(data.length){
				httpoj.send(data.join("&"));
			}
			else{
				httpoj.send();
			}
		},
		dataOption:{
			url:"",
			query:{},				// same-key Nothing
			querys:[],			// same-key OK
			data:{},				// ETC-data event受渡用
			async:"true",		// [trye:非同期 false:同期]
			method:"POST",	// [POST / GET]
			type:"application/x-www-form-urlencoded", // [text/javascript]...
			//call-back
			onSuccess:function(res){console.log("Success:"+res)},
			onError:function(res){console.log("Error:"+res)}
		},
		setOption:function(options){
			var option = {};
			for(var i in $$.ajax.dataOption){
				if(typeof options[i] != "undefined"){
					option[i] = options[i];
				}
				else{
					option[i] = $$.ajax.dataOption[i];
				}
			}
			return option;
		},
		setQuery:function(option){
			var data = [];
			if(typeof option.query != "undefined"){
				for(var i in option.query){
					data.push(i+"="+encodeURIComponent(option.query[i]));
				}
			}
			if(typeof option.querys != "undefined"){
				for(var i=0;i<option.querys.length;i++){
					if(typeof option.querys[i] == "Array"){
						data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
					}
					else{
						var sp = option.querys[i].split("=");
						data.push(sp[0]+"="+encodeURIComponent(sp[1]));
					}
				}
			}
			return data;
		},
		_:0
	};
	//path-info Ex):p=location.href
	$$.pathinfo = function(p){
		var basename="",
		    dirname=[],
				filename=[],
				ext="";
		var p2 = p.split("?");
		var urls = p2[0].split("/");
		for(var i=0; i<urls.length-1; i++){
			dirname.push(urls[i]);
		}
		basename = urls[urls.length-1];
		var basenames = basename.split(".");
		for(var i=0;i<basenames.length-1;i++){
			filename.push(basenames[i]);
		}
		ext = basenames[basenames.length-1];
		return {
			"hostname":urls[2],
			"basename":basename,
			"dirname":dirname.join("/"),
			"filename":filename.join("."),
			"extension":ext,
			"query":(p2[1])?p2[1]:"",
			"path":p2[0]
		};
	};
	$$.urlinfo=function(uri){
		if(!uri){uri = location.href}

		var url = uri;

		//URLとクエリ分離分解;
		var query={};
		// set-query
		if(uri.indexOf("?")!=-1){
			var sp1 = uri.split("?");
			url = sp1[0];
			query = $$.getQuery(sp1[1],"&","=");
		}
		// semi-colon-split
		else if(uri.indexOf(";")!=-1){
			var sp = uri.split(";");
			url = sp[0];
			query = $$.getQuery(sp1[1],";","=");
		}

		//基本情報取得;
		var sp = url.split("/");
		var selfpath = "";
		for(var i=3;i<sp.length;i++){
			//selfpaths.push(sp[i]);
			selfpath += "/"+sp[i];
		}
		var data={
			url:url,
			dirname:this.pathinfo(url).dirname,
			domain:sp[2],
			protocol:sp[0].replace(":",""),
			selfpath:selfpath,
			query:query
		};
		return data;
	};
	// ex) $$.getQuery("a=1&b=2&c=3","&","=");
	$$.getQuery = function(data, splitValue, keyValueSplit){
		var query = {};
		var sp = data.split(splitValue);
		for(var i=0; i<sp.length; i++){
			var sp2 = sp[i].split(keyValueSplit);
			query[sp2[0]] = sp2[1];
		}
		return query;
	};
	//cookie
	$$.cookie = {
		//init-data
		options:{
			name : 'temporary_cookie',
			day  : 0,
			hour : 0,
			min  : 1,
			sec  : 0
		},
		//expires
		date : function(add) {
			if(!add){add = 0}
			var exp = new Date();
			if(add){
				exp.setTime(exp.getTime()+ add);
			}
			else{
				exp.setTime(exp.getTime()
						+ (this.options.day  * 1000 * 60 * 60 * 24)
						+ (this.options.hour * 1000 * 60 * 60)
						+ (this.options.min  * 1000 * 60)
						+ (this.options.sec  * 1000));
			}


			return exp.toGMTString();
		},
		//secure-check
		checkSecure : function() {
			if (location.href.match(/^https:/)) {return true}
			else {return false}
		},
		set : function(name, val, addTime) {
			if(!addTime){addTime = 3600;}
			if(!name){name = this.options.name}
			val = this.encode(val);

			if (this.checkSecure()) {
				document.cookie = name + "=" + val + ";expires=" + this.date(addTime) + ";secure";
			}
			else {
				document.cookie = name + "=" + val + ";expires=" + this.date(addTime);
			}
		},
		del : function(name){
			if(!name){name = this.options.name}
			var exp = new Date();
			exp.setTime(exp.getTime()-1);
			var d = exp.toGMTString();
			if (this.checkSecure()) {
				document.cookie = name + "='';expires=" + d + ";secure";
			}
			else {
				document.cookie = name + "='';expires=" + d;
			}
		},
		get : function(name){
			return this.val(name);
		},
		val : function(name) {
			var ck0 = document.cookie.split(" ").join("");
			var ck1 = ck0.split(";");
			for ( var i = 0; i < ck1.length; i++) {
				var ck2 = ck1[i].split("=");
				if (ck2[0] == name) {
					ck2[1] = this.encode(ck2[1]);
					return ck2[1];
				}
			}
			return '';
		},
		encode:function(val){
			if (!val) {return ""}
			val = val.split("¥r") .join("");
			val = val.split("¥n") .join("");
			val = val.split("<")  .join("-");
			val = val.split("%3c").join("-");
			val = val.split("%3C").join("-");
			val = val.split(">")  .join("-");
			val = val.split("%3e").join("-");
			val = val.split("%3E").join("-");
			return val;
		}
	};
	/**
	// set-value -> element [ex) $$.getElement("id","#sample")]
	// type @ [id , class , querySelector]
	// caution issue return multi-element
	**/
	$$.getElement = function(type , str , num){

		//single
		if(type == "id"){
			return document.getElementById(str);
		}

		//multi
		var elements;
		if(type == "class"){
			elements = document.getElementsByClassName(str);
		}
		else if(type == "name"){
			elements = document.getElementsByName(str);
		}
		else if(type == "querySelector"){
			elements = document.querySelector(str);
		}

		// return--
		if(num == "multi"){
			return elements;
		}
		else if(num == "first"){
			return elements[0];
		}
	};

	$$.getScriptTag = function(){
		var protechScript = document.getElementById("ProtechScript");
		if(protechScript == null){return null}
		return __PROTECH_COMMON.urlinfo(protechScript.src);
	};
	$$.getServiceData = function(service , srcInfo){
		if(typeof(__PROTECH_INFO)=="undeifned" || typeof(__PROTECH_INFO.services)=="undeifned"){return null}

		var data = null;

		for(var i=0; i<__PROTECH_INFO.services.length; i++){
			if(typeof __PROTECH_INFO.services[i] == "undefined"){continue}
			if(service && service != __PROTECH_INFO.services[i].api){continue}

			// solid-id
			if(typeof srcInfo.query.p != "undefined"){
				if(typeof __PROTECH_INFO.services[i].pid == "undefined"){continue}
				if(srcInfo.query.p == __PROTECH_INFO.services[i].pid){
					data = __PROTECH_INFO.services[i];
					break;
				}
				else{continue}
			}

			// url-match
			if(typeof __PROTECH_INFO.services[i]["url"] == "undefined"){continue}
			if(__PROTECH_INFO.services[i]["url"] == location.href){
				data = __PROTECH_INFO.services[i];
				break;
			}
		}
		return data;
	};

	/**
	* Servide Use Function
	**/
	$$.getCookie = function(name){
		if(!name
		|| typeof __PROTECH != "undefined"
		|| typeof __PROTECH.cookieName != "undefined"
		){name = __PROTECH.cookieName}
		var cookieData = $$.cookie.get(name);
		if(!cookieData){
			return {"pv":"","uu":"","su":""};
		}
		else{
			var sp = cookieData.split(".");
			return {"uu":sp[0],"su":sp[1],"pv":sp[2]};
		}
	}

	/**
	* Log write
	*/
	$$.logWrite = function(data){

		var uidCookie = $$.getCookie();
		var q = [
			'mode=' + 'log',
			'd='    + escape(__PROTECH[service].uKey),
			'pv='   + escape(uidCookie["pv"]),
			'su='   + escape(uidCookie["su"]),
			'uu='   + escape(uidCookie["uu"]),
			'data=' + escape(data)
		];
		var sc  = document.createElement('script');
		sc.src   = __PROTECH[service].scriptPath + 'load.php'+'?t='+ (+new Date()) + "&" +q.join("&");
		sc.type  = 'text/javascript';
		sc.async = true;
		document.body.appendChild(sc);
		console.log(sc.src);
	}

	/**
	* 62進数
	**/
	$$.hex62 = {
		chars:function(){
			var str = "";
			str += "0123456789";
			str += "abcdefghijklmnopqrstuvwxyz";
			str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			return str;
		},
		encode:function(num){
			var chars = this.chars();
			var cn = chars.length;
			var str = [];
			var a1 , a2;
			while (num != 0) {
				a1 = parseInt(num / cn);
				a2 = num - (a1 * cn);
				str.unshift(chars.substr(a2,1));
				num = a1;
			}
			var res = str.join("");
			res = (!res)?"0":res;
			return res;
		},
		decode:function(num){
			var chars = this.chars();
			var char2 = {};
			var cn = chars.length;
			for (var i=0; i< cn; i++) {
				char2[chars[i]] = i;
			}
			var str = 0;
			for (var i=0; i<num.toString().length; i++) {
				str += char2[num.substr((i+1)*-1, 1)] * Math.pow(cn, i);
			}

			return str;
		}
	};
	/**
	* 100進数
	**/
	$$.digit100 = {
		chars:function(){
			var str = "";
			str += "0123456789";
			str += "abcdefghijklmnopqrstuvwxyz";
			str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			// -+*/@_?,.;:^!#$%&'()[]{}<>=~|`¥
			//str += "!";
			return str;
		},
		encode:function(num){
			var chars = this.chars();
			var cn = chars.length;
			var str = [];
			var a1 , a2;
			while (num != 0) {
				a1 = parseInt(num / cn);
				a2 = num - (a1 * cn);
				str.unshift(chars.substr(a2,1));
				num = a1;
			}
			var res = str.join("");
			res = (!res)?"0":res;
			return res;
		},
		decode:function(num){
			var chars = this.chars();
			var char2 = {};
			var cn = chars.length;
			for (var i=0; i< cn; i++) {
				char2[chars[i]] = i;
			}
			var str = 0;
			for (var i=0; i<num.toString().length; i++) {
				str += char2[num.substr((i+1)*-1, 1)] * Math.pow(cn, i);
			}

			return str;
		}
	};

	// Transformation
	$$.getPos = function(elm){
		//エレメント確認処理
		if(!elm){return;}

		//途中指定のエレメントチェック（指定がない場合はbody）
		var target = document.body;

		//デフォルト座標
		var pos={x:0,y:0};
		do{
			//指定エレメントでストップする。
			if(elm == target){break}

			//対象エレメントが存在しない場合はその辞典で終了
			if(typeof(elm)=='undefined' || elm==null){break}

			//座標を足し込む
			pos.x += elm.offsetLeft;
			pos.y += elm.offsetTop;
		}

		//上位エレメントを参照する
		while(elm = elm.offsetParent);

		//最終座標を返す
		return pos;
	};
	//targetの中心座標にelmの中心座標を移動する。
	$$.getPosCenter = function(elm,target){

		var pos1  = $$.getPos(target);
		var size1 = $$.getSize(target);
		var size2 = $$.getSize(elm);

		return {
			x:(pos1.x+(size1.x/2)-(size2.x/2)),
			y:(pos1.y+(size1.y/2)-(size2.y/2))
		};
	};

	$$.getSize = function(elm){
		//対象element
		if(typeof(elm)=='undefined'){
			if (navigator.userAgent.match("MSIE")&&document.compatMode!='BackCompat'){
				elm = document.documentElement;
			}
			else{
				elm = document.getElementsByTagName("body")[0];
			}
		}
		//サイズ取得;
		var size={
			x:elm.offsetWidth,
			y:elm.offsetHeight
		};

		//子階層依存※下に１つのみの子を持つ場合サイズチェックを行う;
		if(elm.childNodes.length==1 && elm.tagName=='A'){
			var chk ={
				x:elm.childNodes[0].offsetWidth,
				y:elm.childNodes[0].offsetHeight
			};
			if(chk.x > size.x){
				size.x = chk.x;
			}
			if(chk.y > size.y){
				size.y = chk.y;
			}
		}

		return size;
	};

	//Emveronment
	$$.getWindowSize = function(){
		var d={x:0,y:0};
		var e;

		if(window.innerWidth){
			document.x = window.innerWidth;
			document.y = window.innerHeight;
		}
		else if(navigator.userAgent.indexOf("MSIE")!=-1&&document.compatMode=='BackCompat'){
			document.x = document.body.clientWidth;
			document.y = document.body.clientHeight;
		}
		else{
			document.x = document.documentElement.clientWidth;
			document.y = document.documentElement.clientHeight;
		}
		return d;
	};

	//mouse
	$$.getMouse = {
		pos:{x:0,y:0},
		proc:function(e){
			//IE以外のブラウザ;
			if(e){
				this.pos={
					x:e.clientX,
					y:e.clientY
				};
			}
			//IE処理;
			else{
				this.pos={
					x:event.x,
					y:event.y
				};
			}
		}
	};


	window.$$LIB = $$;
})();
