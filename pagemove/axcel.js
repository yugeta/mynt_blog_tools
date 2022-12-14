/**
* Title     : LinkSourceGetter
* Auther  : yugeta@showcase-tv.com
* Date     : 2017.03.30
* Version : 1.0 / Body-change (2017.03.30)
* Version : 1.1 / history-back , page-title (2017.07.13)
*/
;(function(){
	
	/**
	* start
	*/
	var $$ = function(){
		// Debug-Message--
		console.log("WPA-LinkSourceGetter : Start ");
		
		if(window.flgLinkSourceGetter == "set"){
			console.log("WPA-LinkSourceGetter : set-over");
			return;
		}
		
		//$$.dom.__construct();
		this.setMutationObserver();
		
		// page load-status check
		if(document.readyState === "complete"){
			this.setPageLoaded();
		}
		else{
			this.setEvent(window , "DOMContentLoaded" , $$.prototype.setPageLoaded);
		}
		
		// URL History proc
// 		history.popState(null, null, null);
// 		history.pushState(null, null, null);
		this.setEvent(window , "popstate" , $$.prototype.setHistoryBack);
// 		this.setEvent(window , "pushstate" , $$.prototype.setHistoryBack);
	};
	
	$$.prototype.urls = [];
	
	/**
	* loaded
	*/
	 $$.prototype.setPageLoaded = function(){
	 	var links = document.links;
	 	for(var i=0; i<links.length; i++){
	 		$$.prototype.setLinkTags(links[i]);
	 	}
	 	
	 	// flg-set
	 	window.flgLinkSourceGetter = "set";
	 	
	 	// URL-cache
	 	if($$.prototype.urls.length === 0 || $$.prototype.urls.indexOf(location.href) === -1){
	 		$$.prototype.urls.push(location.href);
	 	}
	 };
	
	/**
	* DOM-event-proccess
	*/
	$$.prototype.setMutationObserver = function(){
		var target = document.getElementsByTagName("html");
		if(!target.length){return}
		var mo = new MutationObserver(function(mutationRecords){
			for(var i=0; i<mutationRecords.length; i++){
				for(var j=0; j<mutationRecords[i].addedNodes.length; j++){
					// Image-Tag-Proc
					$$.prototype.setLinkTags(mutationRecords[i].addedNodes[j]);
				}
			}
		});
		// Event-Set
		mo.observe(target[0] , {childList:true , subtree:true});
	};
	
	/**
	* set-link-tags
	*/
	$$.prototype.setLinkTags = function(elm){
		
		// checc-elm
		if(!elm || elm.nodeType != 1){return}
		
		// check-flg
		if(elm.getAttribute("data-link-flg") == "set"){return}
		
		// check-tag
		if(elm.tagName != "A"){return}
		
		// check-href
		if(!elm.href){return}
		
		// domain-check
		var hrefs = elm.href.split("/");
		if(hrefs.length < 2){return}
		if(hrefs[2] != location.host){return}
		
		// set-onclick
		elm.onclick = $$.prototype.procLinkClick;
		
		// set-flg
		elm.setAttribute("data-link-flg","set");
	};
	
	/**
	* proc-link-click
	*/
	$$.prototype.procLinkClick = function(){
		var ajax = new $$ajax;
		ajax.set({
			url:this.href,
			method:"GET",
			async:"true",
			onSuccess:$$.prototype.setSourceChange
		});
		return false;
	};
	
	/**
	* getLinkSource
	*/
	$$.prototype.setSourceChange = function(res){
		// System
		console.log("WPA-LinkSourceGetter : [click] : " + this.url);

		// SetDOM
		var dom = document.createElement("html");
		dom.innerHTML = res;
		
		// contents????????????
		var elms = dom.getElementsByTagName("*");
		var contents=null;
		for(var i=0; i<elms.length; i++){
			if(elms[i].getAttribute("id") === "contents"){
				contents = elms[i];
				break;
			}
		}
		if(contents === null){
			location.href = this.url;
			return;
		}
		
		// Address-URL change
		history.pushState(null,null,this.url);
		
		/**
		* head???body????????????????????????????????????script????????????
		*/
		var rootNode = document.getElementsByTagName("html")[0];
		var domHTML = dom.getElementsByTagName("html")[0];
		var domHead = dom.getElementsByTagName("head")[0];
		var domBody = dom.getElementsByTagName("body")[0];
		var docHead = document.getElementsByTagName("head")[0];
		var docBody = document.getElementsByTagName("body")[0];
		
// 		// Body????????????
// 		rootNode.replaceChild(domBody , docBody);
		
		// Contents????????????
		document.getElementById("contents").innerHTML = contents.innerHTML;
		
		// Title????????????
		document.title = dom.getElementsByTagName("title")[0].textContent;

		//???????????????top
		window.scrollTo(0,0);

		// ????????????????????????????????????????????????????????????
		$$.prototype.setPageLoaded();
	};
	
	/**
	* Ajax
	* $$.prototype.ajax.set({
	* url:"",					// "http://***"
	* method:"POST",	// POST or GET
	* async:true,			// true or false
	* data:{},				// Object
	* query:{},				// Object
	* querys:[]				// Array
	* });
	*/
	var $$ajax = function(){};
	$$ajax.prototype.dataOption = {
		url:"",
		query:{},				// same-key Nothing
		querys:[],			// same-key OK
		data:{},				// ETC-data event?????????
		async:"true",		// [trye:????????? false:??????]
		method:"POST",	// [POST / GET]
		type:"application/x-www-form-urlencoded", // [text/javascript]...
		onSuccess:function(res){},
		onError:function(res){}
	};
	$$ajax.prototype.option = {};
	$$ajax.prototype.createHttpRequest = function(){
		//Win ie???
		if(window.ActiveXObject){
			//MSXML2?????????;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//???MSXML???;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie?????????XMLHttpRequest???????????????????????????????????????;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
	};
	// XMLHttpRequest????????????????????????
	$$ajax.prototype.set = function(options){
		if(!options){return}
		var ajax = new $$ajax;
		var httpoj = $$ajax.prototype.createHttpRequest();
		if(!httpoj){return;}
		// open ????????????;
		var option = ajax.setOption(options);
		// ??????
		httpoj.open( option.method , option.url , option.async );
		// type
		httpoj.setRequestHeader('Content-Type', option.type);
		// onload-check
		httpoj.onreadystatechange = function(){
			//readyState??????4???????????????;
			if (this.readyState==4){
				//??????????????????
				option.onSuccess(this.responseText);
			}
		};
		//query??????
		var data = ajax.setQuery(option);
		//send ????????????
		if(data.length){
			httpoj.send(data.join("&"));
		}
		else{
			httpoj.send();
		}
	};
	$$ajax.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	$$ajax.prototype.setQuery = function(option){
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
	};
	
	/**
	* ???????????????????????????????????????????????????
	* Event-Set
	* param @ target : Target-element
	* param @ mode : mode ["onload"->"load" , "onclick"->"click"]
	* param @ func : function
	**/
	$$.prototype.setEvent = function(target, mode, func){
		//other Browser
		if (target.addEventListener){target.addEventListener(mode, func, false)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
	};
	
	/**
	* History.back??????
	*/
	$$.prototype.setHistoryBack = function(){
		// ????????????URL????????????????????????????????????
		if($$.prototype.urls.indexOf(location.href) !== -1){
			$$.prototype.setHrefSource(location.href);
		}
	};
	$$.prototype.setHrefSource = function(url){
		if(!url){return}
		var ajax = new $$ajax;
		ajax.set({
			url:url,
			method:"GET",
			async:"true",
 			onSuccess:function(res){
 				// SetDOM
				var dom = document.createElement("html");
				dom.innerHTML = res;
				
				// contents????????????
				var elms = dom.getElementsByTagName("*");
				var contents=null;
				for(var i=0; i<elms.length; i++){
					if(elms[i].getAttribute("id") === "contents"){
						contents = elms[i];
						break;
					}
				}
				if(contents === null){
					location.href = this.url;
					return;
				}
				
				/**
				* head???body????????????????????????????????????script????????????
				*/
				var rootNode = document.getElementsByTagName("html")[0];
				var domHTML = dom.getElementsByTagName("html")[0];
				var domHead = dom.getElementsByTagName("head")[0];
				var domBody = dom.getElementsByTagName("body")[0];
				var docHead = document.getElementsByTagName("head")[0];
				var docBody = document.getElementsByTagName("body")[0];
				
// 				// Body????????????
// 				rootNode.replaceChild(domBody , docBody);
				
				// Contents????????????
				document.getElementById("contents").innerHTML = contents.innerHTML;
				
				// ??????Script??????
				
				
				// Title????????????
				document.title = dom.getElementsByTagName("title")[0].textContent;
				
				//???????????????top
				window.scrollTo(0,0);
		
				// ????????????????????????????????????????????????????????????
				$$.prototype.setPageLoaded();
				
				// 
				console.log("WPA-LinkSourceGetter : [history] : " + this.url);
 			}
		});
	};
		
	new $$();
	
	window.LinkSourceGetter = $$;
})();