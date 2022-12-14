(function(){
	var port = "3334";
	var $$   = {};
	$$.start = function(){
		var btn = document.getElementById("btn");
		btn.onclick = function(){
			var url = document.getElementById("url");
			$$.access(url.value,[]);
		};
	};

	$$.access = function(targetUrl,listUrl){
		if(!targetUrl){return}
		document.getElementById("access").innerHTML  = targetUrl;
		document.getElementById("url-loading").style.setProperty("display","inline","");
		var location_hrefs = location.href.split("/");
		var nodeAccess = "http://"+location_hrefs[2]+":"+port+"/"+"?url="+escape(targetUrl);
		var dir = $$.LIB.dirname(location_hrefs.join("/"));
		$$.ajax.set({
			url    : nodeAccess,
			method : "post",
			async  : true,
			query  : {
				url : escape(targetUrl),
				dir : dir
			},
			option : {
				listMax   : document.form1.max.value,
				listUrl   : listUrl,
				startTime : (+new Date())
			},
			onSuccess:$$.collbackSuccess
		});
	};
	$$.collbackSuccess = function(res){
		var json = JSON.parse(res);
		var urls = $$.urlsNarrow(json.urls,this.query.url,this.option.listUrl,this.option.listMax);
		document.getElementById("counts").innerHTML  = urls.length+"("+json.counts+")";
		document.getElementById("preview").innerHTML = urls.join("<br>\n");
		document.getElementById("url-loading").style.setProperty("display","none","");
		document.getElementById("times").innerHTML = ((+new Date()) - this.option.startTime)/1000;
	};
	//first-time
	$$.urlsNarrow = function(urls,condition,listUrl,listMax){
		var condition_url = $$.urlEscape($$.delPort(condition));
		var reg = new RegExp("^"+condition_url,"i");
		for(var i=0;i<urls.length;i++){
			if(listMax > 0 && listUrl.length >= listMax){continue}
			var currentUrl = $$.delPort(urls[i]);
			//domain-hieraruky-check
			if(!currentUrl.match(reg)){continue}
			//unique-check
			if(listUrl.length && listUrl.indexOf(urls[i])!=-1){continue}
			listUrl.push(urls[i]);
		}
		return listUrl;
	};
	$$.delPort = function(url){
		url = unescape(url);
		var newUrl = url;
		if(newUrl.match(/^http:/i)){
			newUrl = url.replace("http:","");
		}
		else if(newUrl.match(/^https:/i)){
			newUrl = url.replace("https:","");
		}
		return newUrl;
	};
	$$.urlEscape = function(url){
		url = url.replace(/\//g,"\\/");
		url = url.replace(/\./g,"\\.");
		url = url.replace(/\[/g,"\\[");
		url = url.replace(/\]/g,"\\]");
		url = url.replace(/\$/g,"\\$");
		url = url.replace(/\^/g,"\\^");
		url = url.replace(/\-/g,"\\-");
		url = url.replace(/\{/g,"\\{");
		url = url.replace(/\}/g,"\\}");
		url = url.replace(/\(/g,"\\(");
		url = url.replace(/\)/g,"\\)");
		return url;
	};
	$$.LIB = {
		basename:function(path){
			return path.replace(/\//g,'/').replace( /.*\//, '');
		},
		dirname:function(path){
			return path.replace(/\//g,'/').replace(/\/[^/]*$/, '');
		}
	};

	$$.ajax = {
		xmlObj:function(f){
			var r=null;
			try{r=new XMLHttpRequest()}
			catch(e){
				try{r=new ActiveXObject("Msxml2.XMLHTTP")}
				catch(e){
					try{r=new ActiveXObject("Microsoft.XMLHTTP")}
					catch(e){return null}
				}
			}
			return r;
		},
		/**
		 * XMLHttpRequest????????????????????????
		 */
		set:function(option){
			if(!option){return}

			$$.ajax.httpoj = $$.ajax.createHttpRequest();
			if(!$$.ajax.httpoj){return;}
			$$.ajax.httpoj.open(option.method , option.url , option.async);
			$$.ajax.httpoj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			//????????????????????????????????????;
			$$.ajax.httpoj.onreadystatechange = function(){
				//readyState??????4???????????????;
				if (this.readyState==4){
					option.onSuccess(this.responseText);
				}
			};

			//query??????:querys
			var data = [];
			if(typeof(option.query)!="undefined"){
				for(var i in option.query){
					data.push(i+"="+encodeURIComponent(option.query[i]));
				}
			}
			if(typeof(option.querys)!="undefined"){
				for(var i=0;i<option.querys.length;i++){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
			}
			//send ????????????
			if(data.length){
				$$.ajax.httpoj.send(data.join("&"));
			}
			else{
				$$.ajax.httpoj.send();
			}
		},
		createHttpRequest:function(){
			//Win ie???
			if(window.ActiveXObject){
				//MSXML2?????????
				try {return new ActiveXObject("Msxml2.XMLHTTP")}
				catch(e){
					//???MSXML???
					try{return new ActiveXObject("Microsoft.XMLHTTP")}
					catch(e2){return null}
				}
			}
			//Win ie?????????XMLHttpRequest???????????????????????????????????????
			else if(window.XMLHttpRequest){return new XMLHttpRequest()}
			else{return null}
		}
	};

	// $$.start();
	switch(document.readyState){
		case 'complete': 
			$$.start()
			break
		default: 
			window.addEventListener('load' , $$.start); 
			break
	}
})();