if(typeof($NC)=='undefined'){$NC={}}

//--------------------------------------------------
// 
// 更新日:2011.4.25
// version:1.000.000
/*
$NC.$.pos(element , target)
	概要：対象項目の座標を取得
	[ e:element , t:target(特定項目内での座標取得も可※未記入OK) ]

$NC.$.size(element)
	概要：対象項目のサイズを取得
	[ e:element ]

$NC.$.id(id)
	概要：IDの取得(getElementById())
	[ id:ID値 ]

$NC.$.remove(element or ID)
	概要：対象のID値、または対象項目を削除する
	[ element(or id):文字列の場合はID値とする。項目の指定も可 ]

$NC.$.tag(tag , element)
	概要：DOM内のタグ一覧を取得(getElementsByTagName())
	[ tag:DIV等 e:基準となる項目※未記入可 ]

$NC.$.className(word , element)
	概要：特定のclass名を持つ項目一覧を取得(getElementsByClassName)
	[ word:対象文字列※正規表現可 element:※未記入可 ]

$NC.$.create(tag,attribute)
	概要：タグ項目を作成する
	[ tag:作成するタグ種別 , attribute:属性※連想配列にて記述 ]

$NC.$.query(url)
	概要：表示しているページのブラウザアドレスのURLクエリを連想配列で返します。
	[ url:未記入可 ]

$NC.$.domain(url)
	概要：表示しているページのブラウザアドレスのドメイン（サブドメイン）を返します。
	[ url:URL指定も可※未記入可 ]

$NC.$.dir(url)
	概要：表示しているページのブラウザアドレスのURLのアクセスファイルの値を返します。
	[ url:URL指定も可※未記入可 ]

$NC.$.document(element)
	概要：document.bodyサイズ（スクロール域も含めた）または、対象項目のサイズ
	[ element:対象項目※未記入可 ]
	
$NC.$.scroll(element)
	概要：スクロール値の取得
	[ element:対象項目※未記入可 ]
	
$NC.$.browser()
	概要：ブラウザの表示画面サイズ
	
$NC.$.addEvent(target , mode , function)
	概要：イベント情報の追記登録
	[ target:window,document mode:load,mousedown※onを抜かす function:実行関数 ]
	
$NC.$.mouse.x
$NC.$.mouse.y
	概要：マウスの座標が自動で格納される。
	
$NC.$.alpha(element , num(%))
	概要：対象項目の透明度を設定
	[ element:対象項目 num:%]
	
$NC.$.swf(wmode)
	概要：SWFファイルに自動でwmodeを設定する
	[ wmode:transparent※未記入可 , opaque ]
	
$NC.$.style(element , style)
	概要：対象項目のCSS値を取得
	[ element:対象項目 ]
	
$NC.$.camelize(prop)
	概要：style属性などの文字列整形を行う※例)「font-type」→「fontType」
	[ prop:文字列 ]
	
$NC.$.attribute
	$NC.$.attribute.focus(element)
		概要：対象項目の属性をハイライト表示する
		[ element:対象項目 style:属性]
	
$NC.$.unique
	概要：対象項目の「ページ内DOM構造ユニークID」を出力する（エンコード）
	[ element:対象項目 ]
	
$NC.$.link_kill
	概要：ページ内のリンクを遷移しないようにする
	
$NC.$.table_add
	概要：Table要素に行要素を追加する
	使用方法：[ table:table要素 html:HTML記述※tr含む]

NC.$.eval_play
	概要：文字列（関数名）から、実行を行う。※関数が存在しない場合は、未処理
	使用方法：[ str:文字列関数名 ]

$NC.$.select_add
	概要：select項目に値を追加する。
	使用方法：[ e , key , value ,title ]

$NC.$.count_value
	概要：文字列を指定文字数に丸めこむ
	使用方法：[ val:文字列 n:文字数 ]

//スタイルシート操作
$NC.$.read_stylesheet(css , selectorText , *styleName)
	概要：スタイルシートの値を読み出す
	使用方法：[ css:ファイル全体 selectorText:セレクタ名 styleName:スタイルシート名(*nullの場合は、全表記の返信) ]
$NC.$.write_stylesheet(cssRules , selectorText , styleName , value)
	概要：スタイルシートの値を書き込む※指定のセレクタが無い場合は新規追加する。
	使用方法：[ css:ファイル全体 selectorText:セレクタ名 styleName:スタイルシート名 value:書き込む値 ]

//rgb(***)→#*** rgb表記を#***の16進数表示に切り替える。※6ケタのみ対応、アルファチャンネルには未対応
$NC.$.rgb2bit16(rgba)


//$NC.$.hash_copy
//	概要：連想配列のコピー※多次元対応
//	使用方法：$HOGE = $NC.$.hash_copy("元データ（連想配列データ）");



*/

//--------------------------------------------------
$NC.$={
	//読み込み完了フラグ;
	load:'conplete',
	//element座標;
	pos:function(e , t){
		if(typeof(t)=='undefined' || t==null){
			t = document.body;
		}
		//座標算出;
		var pos={x:0,y:0};
		
		if(typeof(e)=='undefined' || e==null){return pos;}
		var flg=0;
		do{
			if(e == t){break}
			
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
			if(flg>10000){break}
			flg++;
		}
		while(e = e.offsetParent);
		
		return pos;
	},
	//表示elementサイズ(指定がない場合はwindow(body)サイズ);
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
	},
	//getElementById;
	id:function(id){
		if(!id){return}
		return document.getElementById(id);
	},
	//削除;
	remove:function(e){
		if(typeof(e)=='string'){
			e=$NC.$.id(e);
		}
		if(typeof(e)=='undefined' || e==null || !e){return}
		e.parentNode.removeChild(e);
	},
	//getElementsByTagName;
	tag:function(t,elm){
		if(!t){t="*"}
		var e = document;
		if(typeof(elm)!='undefined'){
			e = elm;
		}
		return e.getElementsByTagName(t);
	},
	//getElementsByClassName:classNameチェック※正規表現可能;
	className:function(w,e){
		if(typeof(w)=='undefined'){return}
		
		if(typeof(e)=='undefined'){
			e = document;
		}
		//検索対象一覧取得;
		var t = $NC.$.tag("*",e);
		var d=[];
		//正規表現可能;
		if(typeof(w)=='function'){
			//対象項目;
			for(var i=0;i<t.length;i++){
				if(!t[i].className){continue}
				var flg=0;
				//class分解;
				var s = t[i].className.split(" ");
				for(var j=0;j<s.length;j++){
					if(s[j].match(w)){flg++}
				}
				if(flg){
					d.push(t[i]);
				}
			}
		}
		//正規表現不可;
		else if(typeof(w)=='string'){
			//対象項目;
			for(var i=0;i<t.length;i++){
				if(!t[i].className){continue}
				var flg=0;
				//class分解;
				var s = t[i].className.split(" ");
				for(var j=0;j<s.length;j++){
					if(s[j]==w){flg++}
				}
				if(flg){
					d.push(t[i]);
				}
			}
		}
		return d;
	},
	create:function(t,a){//alert(t);
		if(!t){return}
		var elm = document.createElement(t);
		
		if(typeof(a)!='undefined'){
			for(var i in a){
				$NC.$proc.hash2attribute(elm,i,a[i]);
			}
		}
		return elm;
	},
	//URLから付随するデータを抽出するを連想配列で返す;
	url2data:function(u){
		if(!u){
			u = location.href;
		}
		
		var data={};
		
		//クエリ付き判定;
		//?分解;
		var u0=[];
		if(u.indexOf("?")!=-1){
			u0 = u.split("?");
		}
		else if(u.indexOf(";")!=-1){
			u0 = u.split(";");
		}
		else{
			u0[0] = u;
			u0[1] = '';
		}
		//基本情報取得;
		var u3 = u0[0].split("/");
		data.$={
			url:u0[0],
			dir:this.dir(u),
			query:u0[1],
			domain:u3[2],
			protocol:u3[0].replace(":","")
		};
		
		if(u0[1]){
			var u1 = u0[1].split("&");
			
			//ハッシュ処理;
			for(var i=0;i<u1.length;i++){
				var u2 = u1[i].split("=");
				if(!u2[0]){continue}
				data[u2[0]] = u2[1];
			}
		}
		
		return data;
	},
	//URLからクエリ値を連想配列で返す;
	query:function(u){
		if(!u){
			u = location.href;
		}
		var data={};
		
		//?分解;
		var u0=[];
		if(u.indexOf("?")!=-1){
			u0 = u.split("?");
		}
		else if(u.indexOf(";")!=-1){
			u0 = u.split(";");
		}
		else{
			u0[0] = u;
			u0[1] = '';
		}
		
		//基本情報取得;
		var u3 = u0[0].split("/");
		data.$={
			url:u0[0],
			dir:this.dir(u),
			query:u0[1],
			domain:u3[2],
			protocol:u3[0].replace(":","")
		};
		
		if(u0[1]){
			var u1 = u0[1].split("&");
			
			//ハッシュ処理;
			for(var i=0;i<u1.length;i++){
				var u2 = u1[i].split("=");
				if(!u2[0]){continue}
				data[u2[0]] = u2[1];
			}
		}
		
		return data;
	},
	domain:function(u){
		if(typeof(u)=='undefined' || !u){
			u = location.href;
		}
		//正常なURLかどうかチェック;
		if(!u.match(/:\/\//)){return}
		var a = u.split("/");
		return a[2];
	},
	dir:function(u){
		if(!u){
			u = location.href;
		}
		
		var u1 = u.split("?")[0].split("/");
		
		var url='';
		for(var i=0;i<u1.length-1;i++){
			url+=u1[i]+"/";
		}
		return url;
		
	},
	//
	document:function(e){
		//対象element;
		if(typeof(e)=='undefined'){
			if (navigator.userAgent.match("MSIE") && document.compatMode!='BackCompat'){
				e = document.documentElement;
			}
			else{
				e = document.getElementsByTagName("body")[0];
			}
		}
		//サイズ取得;
		var size={
			x : e.scrollWidth,
			y : e.scrollHeight
		};
		return size;
	},
	//スクロール値;
	scroll:function(e){
		//初期設定;
		var scroll={x:0,y:0};
		//ブラウザ判定処理;
		if(navigator.userAgent.indexOf("iPhone")!=-1 || navigator.userAgent.indexOf("iPad")!=-1){
			return {x:window.scrollX,y:window.scrollY};
		}
		else if(typeof(e)=='undefined' || e==null){
			if(document.compatMode=='BackCompat' || navigator.userAgent.indexOf("Safari")!=-1){
				e = document.getElementsByTagName("body")[0];
			}
			else{
				e = document.documentElement;
			}
		}
		//スクロール値;
		scroll={
			x:e.scrollLeft,
			y:e.scrollTop
		};
		return scroll;
	},
	//ブラウザ画面サイズ;
	browser:function(){
		var d={x:0,y:0};
		var e;
		if(window.innerWidth){
			d.x = window.innerWidth;
			d.y = window.innerHeight;
		}
		else if(navigator.userAgent.indexOf("MSIE")!=-1&&document.compatMode=='BackCompat'){
			d.x = document.body.clientWidth;
			d.y = document.body.clientHeight;
		}
		else{
			d.x = document.documentElement.clientWidth;
			d.y = document.documentElement.clientHeight;
		}
		return d;
	},
	addEvent:function(t, m, f){
		//other IE;
		if (t.addEventListener){
			t.addEventListener(m, f, false);
		}
		//IE;
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
	},
	//マウス座標※自動更新;
	mouse:{x:0,y:0},
	//elementの透明度設定;
	alpha:function(e , n){
		//IE
		if (navigator.userAgent.indexOf("MSIE")!=-1){
			if (n < 0){
				n = parseInt(parseFloat(RegExp.$1) + (n));
				if (n <= 0) {n = 0;} else if (n >= 100) {n = 100;}
			}
			e.style.filter = 'alpha(opacity='+n+')';
		}
		//FireFox;
		else if (navigator.userAgent.indexOf("Firefox")!=-1){
			if (n < 0){
				if (n <= 0) {n = 0;} else if (n >= 1) {n = 1;}
			}else{n = n/100;}
			e.style.opacity = n;
			
		}
		//Opera & Safari;
		else if ((navigator.userAgent.indexOf("Opera")!=-1)||(navigator.userAgent.indexOf("Safari")!=-1)){
			if (n < 0){
				if (n <= 0) {n = 0;} else if (n >= 1) {n = 1;}
			}else{n = n/100;}
			e.style.opacity = n;
		}
		//Netscape;
		else if (navigator.userAgent.indexOf("Netscape")!=-1){
			if (n < 0){
				if (n <= 0) {n = 0;} else if (n >= 1) {n = 1;}
			}else{n = n/100;}
			e.style.MozOpacity = n;
		}
		return e;
	},
	//sef-hack;
	swf:function(f){
		$NC.$proc.swf.set(f);
	},
	//style値を取得;
	style:function(e,s){
		if(!s){return}
		//対象項目チェック;
		if(typeof(e)=='undefined' || e==null || !e){
			e = document.body;
		}
		//属性チェック;
		var d='';
		if(typeof(e.currentStyle)!='undefined'){
			d = e.currentStyle[$NC.$.camelize(s)];
			if(d=='medium'){
				d = "0";
			}
		}
		else if(typeof(document.defaultView)!='undefined'){
			d = document.defaultView.getComputedStyle(e,'').getPropertyValue(s);
		}
		return d;
	},
	style_width:function(e){
		return e.offsetWidth + parseInt($NC.$.style(e,'margin-left'))+parseInt($NC.$.style(e,'margin-right'));
	},
	style_height:function(e){
		return e.offsetHeight + parseInt($NC.$.style(e,'margin-top'))+parseInt($NC.$.style(e,'margin-bottom'));
	},
	//camelize,capitalize;
	camelize:function(s){
		if(typeof(s)!='string'){return}
		return s.replace(/-([a-z])/g , function(m){return m.charAt(1).toUpperCase();});
	},
	//elementのDOM階層（対象elementの階層dom構造をユニーク値で返す）;
	//element → id(途中でIDがあれば、そこで止まる);
	unique:function(e){
		if(typeof(e)=='undefined' || e==null || !e){return}
		var dom = [];
		var f=0;
		do{
			if(e.id && e == document.getElementById(e.id)){
				dom[dom.length] = e.id;
				break;
			}
			else if(!e.parentNode){break}
			
			var num = 0;
			var cnt = 0;
			if(e.parentNode.childNodes.length){
				for(var i=0;i<e.parentNode.childNodes.length;i++){
					if(typeof(e.parentNode.childNodes[i].tagName)=='undefined'){continue}
					if(e.parentNode.childNodes[i].tagName != e.tagName){continue}
					
					if(e.parentNode.childNodes[i] == e){
						num=cnt;
						break;
					}
					
					cnt++;
				}
			}
			//小文字英数字で形成する。;
			dom[dom.length] = e.tagName.toLowerCase() + "["+num+"]";
			if(e == document.body){break}
			f++;
			if(f>10000){break}
		}
		while (e = e.parentNode);
		//rsort;
		var dom2 = [];
		for(var i=dom.length-1;i>=0;i--){
			dom2[dom2.length] = dom[i];
		}
		return dom2.join(".");
	},
	//element → id(document.bodyまでのフルパス);
	unique_full:function(e){
		if(typeof(e)=='undefined' || e==null || !e){return}
		var dom = [];
		var f=0;
		do{
			if(!e.parentNode){break}
			var num = 0;
			var cnt = 0;
			if(e.parentNode.childNodes.length){
				for(var i=0;i<e.parentNode.childNodes.length;i++){
					if(typeof(e.parentNode.childNodes[i].tagName)=='undefined'){continue}
					if(e.parentNode.childNodes[i].tagName != e.tagName){continue}
					
					if(e.parentNode.childNodes[i] == e){
						num=cnt;
						break;
					}
					if(e.parentNode.childNodes[i][j].id && !e.parentNode.childNodes[i][j].id.indexOf("$NC_iframe_%")){
						cnt++;
					}
				}
			}
			//小文字英数字で形成する。;
			dom[dom.length] = e.tagName.toLowerCase() + "["+num+"]";
			if(e == document.body){break}
			f++;
			if(f>10000){break}
		}
		while (e = e.parentNode);
		//rsort;
		var dom2 = [];
		for(var i=dom.length-1;i>=0;i--){
			dom2[dom2.length] = dom[i];
		}
		return dom2.join(".");
	},
	//id → element;
	unique_decode0:function(id){
		
		if(!id){return;}
		
		//単一IDの場合;
		if($NC.$.id(id)!=null){
			return $NC.$.id(id);
		}
		
		//element抽出処理
		var elm= document.body;
		var d1 = id.split(".");
		var flg=0;
		for(var i=0;i<d1.length;i++){
			
			if(d1[i].match(/^(.*?)\[(.*?)\]$/)){
				var tag = RegExp.$1;
				var num = RegExp.$2;
				var cnt = 0;
				if(tag=='' || num==''){
					alert("tag名が不整合です。 : "+d1[i]);
					return;
				}
				var e2 = elm.childNodes;
				//存在しないelement処理
				if(e2.length < num){return}
				
				for(var j=0;j<e2.length;j++){
					if(!e2[j].tagName || typeof(e2[j])=='undefined'){continue}
					if(e2[j].tagName != tag.toUpperCase()){continue}
					if(cnt == num){
						elm = e2[j];
						flg++;
					}
					cnt++;
				}
			}
			else if($NC.$.id(d1[i])!=null){
				elm = $NC.$.id(d1[i]);
				flg++;
			}
		}
		if(!flg){return}
		return elm;
	},
	unique_decode:function(id){
		
		if(!id || typeof(id)!='string'){return}
		
		//単一IDの場合;
		if($NC.$.id(id)!=null){
			return $NC.$.id(id);
		}
		
		//element抽出処理
		var elm= document.getElementsByTagName("html")[0];
		var d1 = id.split(".");
		var flg=0;
		for(var i=0;i<d1.length;i++){
			
			if(d1[i].match(/^(.*?)\[(.*?)\]$/)){
				var tag = RegExp.$1;
				var num = RegExp.$2;
				var cnt = 0;
				var flg2= 0;
				if(tag=='' || num==''){
					alert("tag名が不整合です。 : "+d1[i]);
					return;
				}
				var e2 = elm.childNodes;
				
				for(var j=0;j<e2.length;j++){
					if(!e2[j].tagName || typeof(e2[j])=='undefined'){continue}
					if(e2[j].tagName != tag.toUpperCase()){continue}
					if(cnt == num){
						elm = e2[j];
						flg2++;
						break;
					}
					cnt++;
				}
				//存在しないelement処理
				
				if(flg2==0){return}
				flg++;
			}
			else if($NC.$.id(d1[i])!=null){
				elm = $NC.$.id(d1[i]);
				flg++;
			}
			else if($NC.$.id(d1[i])==null){
				return;
			}
		}
		if(!flg){return}
		
		return elm;
	},
	unique_decode_2:function(id){
		
		if(!id || typeof(id)!='string'){return}
		
		//単一IDの場合;
		if($NC.$.id(id)!=null){
			return $NC.$.id(id);
		}
		
		//element抽出処理
		var elm= document.body;
		var d1 = id.split(".");
		var flg=0;
		for(var i=0;i<d1.length;i++){
			
			if(d1[i].match(/^(.*?)\[(.*?)\]$/)){
				var tag = RegExp.$1;
				var num = RegExp.$2;
				var cnt = 0;
				var flg2= 0;
				if(tag=='' || num==''){
					alert("tag名が不整合です。 : "+d1[i]);
					return;
				}
				var e2 = elm.childNodes;
				
				for(var j=0;j<e2.length;j++){
					if(!e2[j].tagName || typeof(e2[j])=='undefined'){continue}
					if(e2[j].tagName != tag.toUpperCase()){continue}
					if(cnt == num){
						elm = e2[j];
						flg2++;
						break;
					}
					cnt++;
				}
				flg++;
			}
			else if($NC.$.id(d1[i])!=null){
				elm = $NC.$.id(d1[i]);
				flg++;
			}
			else if($NC.$.id(d1[i])==null){
				return;
			}
		}
		if(!flg){return}
		
		return elm;
	},
	unique_decode_iframe:function(id){
		
		var iframe;
		
		if(!id){return}
		else if(id.indexOf("$NC_iframe")==-1){return}
		
		//iframe処理
		else if(id.match(/^\$NC\.iframe\[(.*?)\](.*)$/)){
			alert(RegExp.$1+"/"+RegExp.$2);return;
			if(!document.getElementsByTagName("frame").length || typeof(document.getElementsByTagName("frame")[RegExp.$2].contentWindow)=='undefined' || typeof(document.getElementsByTagName("frame")[RegExp.$2].contentWindow.document)=='undefined'){return}
			
			iframe = document.getElementsByTagName("frame")[RegExp.$2].contentWindow.document.body;
		}
		else{return}
		
		
		//element抽出処理
		var elm= iframe;
		var d1 = id.split(".");
		var flg=0;
		for(var i=1;i<d1.length;i++){
			if(d1[i].match(/^(.*?)\[(.*?)\]$/)){
				var tag = RegExp.$1;
				var num = RegExp.$2;
				var cnt = 0;
				if(tag=='' || num==''){
					alert("tag名が不整合です。 : "+d1[i]);
					return;
				}
				var e2 = elm.childNodes;
				for(var j=0;j<e2.length;j++){
					if(typeof(e2[j])=='undefined'){return}
					if(e2[j].tagName != tag.toUpperCase()){continue}
					if(cnt == num){
						elm = e2[j];
					}
					cnt++;
				}
				flg++;
			}
			else if($NC.$.id(d1[i])!=null){
				elm = $NC.$.id(d1[i]);
				flg++;
			}
		}
		if(!flg){return}
		return elm;
	},
	//uniqueIDでの削除;
	unique_remove:function(id){
		if(!id){return;}
		var e = $NC.$.unique_decode(id);
		if(typeof(e)=='undefined'){return}
		$NC.$.remove(e);
	},
	//ページ内のリンクを遷移しないようにする。（管理ページ用）;
	link_kill:function(){
		$NC.$.addEvent(window,"load",  function(){
			var l = document.getElementsByTagName("*");
			for(var i=0;i<l.length;i++){
//				l[i].onmousedown= function(){return false};
				l[i].onmouseup  = function(){return false};
				l[i].onclick    = function(){return false};
				l[i].onfocus    = function(){this.blur();return false};
			}
			var f = document.forms;
			for(var i=0;i<f.length;i++){
				f[i].onsubmit= function(){return false};
			}
		});
	},
	//Table要素に行要素を追加する;
	table_add:function(table,html){
		if(typeof(table)=='undefined' || table==null || !table){return;}
		if(!html){return}
		var d = document.createElement("div");
		d.innerHTML = "<table>"+html+"</table>";
		var tr = d.getElementsByTagName("tbody");
		for(var i=0;i<tr.length;i++){
			table.appendChild(tr[i]);
		}
	},
	//脆弱性文字列変換処理;
	xss:function(val){
		if(!val){return val;}
		val+="";
		val = val.split("\r").join("");
		val = val.split("\n").join("");
		val = val.split("<").join("-");
		val = val.split("%3c").join("-");
		val = val.split("%3C").join("-");
		val = val.split(">").join("-");
		val = val.split("%3e").join("-");
		val = val.split("%3E").join("-");
		return val;
	},
	value:{
		data:[
			["\r",	"%r%"],
			["\n",	"%n%"],
			[" ",	"%sp%"],
			["'",	"%qt%"],
			['"',	"%dqt%"],
			["<br>","%br%"],
			[]
		],
		encode:function(val){
			val = val.split("\r").join("%r%");
			val = val.split("\n").join("%n%");
			val = val.split(" ").join("%sp%");
			val = val.split("'").join("%qt%");
			val = val.split('"').join("%dqt%");
			val = val.split("<br>").join("%br%");
			return val;
		},
		decode:function(val){
			val = val.split("%r%").join("\r");
			val = val.split("%n%").join("\n");
			val = val.split("%sp%").join(" ");
			val = val.split("%qt%").join("'");
			val = val.split("%dqt%").join('"');
			val = val.split("%br%").join("<br>");
			return val;
		}
	},
	//JSファイル読み込み完了チェック※特定の関数が読み込まれているかどうかで判別;
	function_read_check:function(fn,next){
		if(!fn){return}
		if($NC.$proc.function_read_check.count > $NC.$proc.function_read_check.max){return}

		if(typeof(eval(fn))=='undefined'){
			//停止フラグカウント;
			$NC.$proc.function_read_check.count += $NC.$proc.function_read_check.add;
			//再チェック;
			setTimeout(function(){$NC.$.function_read_check(fn,next)},$NC.$proc.function_read_check.add);
		}
		else if(next){
			eval(next);
		}
	},
	function_read_check2:function(fn,next){
		if(!fn){return}
		if($NC.$proc.function_read_check.count > $NC.$proc.function_read_check.max){return}
		if(fn.indexOf(".")!=-1){
			var flg=0;
			var fns = fn.split(".");
			for(var i=0;i<fns.length;i++){
				var fn2=fns.splice(0,i).join(".");
				if(typeof(eval(fn2))=='undefined'){
					flg++;
				}
			}
			if(flg==fns.length && next){
				eval(next);
			}
			else{
				//停止フラグカウント;
				$NC.$proc.function_read_check.count += $NC.$proc.function_read_check.add;
				//再チェック;
				setTimeout(function(){$NC.$.function_read_check(fn,next)},$NC.$proc.function_read_check.add);
			}
		}
		else{
			if(typeof(eval(fn))=='undefined'){
				//停止フラグカウント;
				$NC.$proc.function_read_check.count += $NC.$proc.function_read_check.add;
				//再チェック;
				setTimeout(function(){$NC.$.function_read_check(fn,next)},$NC.$proc.function_read_check.add);
			}
			else if(next){
				eval(next);
			}
		}
	},
	//文字列から関数を実行;
	eval_play:function(str){
		if(!str){return}
		
		if(str.match(/(.*)\((.*)\)/)){
			var str1 = RegExp.$1;
			var str2 = RegExp.$2;
			//引数処理;
			var str3 = [str2];
			if(str2.indexOf(",")!=-1){
				str3 = str2.split(",");
			}
			for(var i=0;i<str3.length;i++){
				if(typeof(str3[i])=="string"){
					str3[i] = "'"+str3[i]+"'";
				}
			}
			str2 = str3.join(",");
			
			
			if(str.indexOf(".")!=-1){
				var fs = str1.split(".");
				
				var fnc=[];
				
				for(var i=0;i<fs.length;i++){
					fnc.push(fs[i]);
					
					if(typeof(eval(fnc.join(".")))=='undefined'){return}
					
				}
				eval(fnc.join(".")+"("+str2+")");
			}
			else{
				eval(str1+"("+str2+")");
			}
		}
		else{
			if(str.indexOf(".")!=-1){
				var fs = str.split(".");
				
				var fnc=[];
				
				for(var i=0;i<fs.length;i++){
					fnc.push(fs[i]);
					
					if(typeof(eval(fnc.join(".")))=='undefined'){return}
					
				}
				eval(fnc.join("."));
			}
			else{
				eval(str);
			}
		}
	},
	
	//任意文字数分のみ表示;
	count_value:function(val,n){
		if(!val){return '';}
		var val2=val.substr(0,n);
		if(val2.length < val.length){
			val2+= "<font style='color:red;'>...</forn>";//…
		}
		return val2;
	},
	//---------------
	//select項目操作;
	//---------------
	//
	select_add:function(e, key , value , title){
		if(typeof(e)=='undefined' || e==null || !e){return}
		
		var num = e.length;
		
		//key,value 設定;
		e.options[num] = new Option(value , key);
		
		//title値;
		if(title){
			e.options[num].title = title;
		}
	},
	//年月日時分秒の14桁を返す;
	ymdhis:function(){
		var date = new Date();
		var d={
			y:date.getFullYear(),
			m:date.getMonth()+1,
			d:date.getDate(),
			h:date.getHours(),
			i:date.getMinutes(),
			s:date.getSeconds()
		};
		for(var i in d){
			if(d[i] < 10){
				d[i] = "0"+String(d[i]);
			}
			else{
				d[i] = String(d[i]);
			}
		}
		return d.y + d.m + d.d + d.h + d.i + d.s;
	},
	//14桁のYMDHISデータを配列で返す
	datetime:function(d){
		if(!d){return}
		
		var dt={
			year:d.substring(0,4),
			month:d.substring(4,6),
			day:d.substring(6,8),
			hour:d.substring(8,10),
			min:d.substring(10,12),
			sec:d.substring(12,14)
		};
		
		return dt;
	},
	//compatmode判定を行い（ブラウザ別＆compatmode別）document.bodyの値を返す
	compat:function(e){
		//document判別（iframeにも対応）
		if(typeof(e)=='undefined'){
			e = document;
		}
		else{
			e = e.document;
		}
		
		//compatモード判別[CSS1Compat,BackCompat]
		
		//IE
		if(navigator.userAgent.indexOf("MSIE")!=-1){
			if(e.compatMode=="BackCompat"){
				return e.body;
			}
			else{
				return e.documentElement;
			}
		}
		//Firefox
		else if(navigator.userAgent.indexOf("Firefox")!=-1){
			if(e.compatMode=='CSS1Compat'){
				return e.documentElement;
			}
			else{
				return e.body;
			}
		}
		//webkit
		else{
			return e.body;
		}
		
	},
	
	//スタイルシートの値を読み出す
	read_stylesheet:function(css , selTxt , styleName){
		if(!css || !selTxt){return}
		
		if(styleName){
			for(var j=0;j<css.cssRules.length;j++){
				if(css.cssRules[j].selectorText==selTxt){
					return css.cssRules[j].style[styleName];
				}
			}
		}
		else{
			for(var j=0;j<css.cssRules.length;j++){
				if(css.cssRules[j].selectorText==selTxt){
					return css.cssRules[j].cssText;
				}
			}
		}
	},
	write_stylesheet:function(css , selTxt , styleName , value){
		if(!css || !selTxt || !styleName){return}
		
		//selectorTextの指定がある場合
		for(var j=0;j<css.cssRules.length;j++){
			if(css.cssRules[j].selectorText==selTxt){
				css.cssRules[j].style[styleName] = value;
				return true;
			}
		}
		
		//対象セレクタが無い場合
		css.addRule(selTxt , styleName+":"+value);
		
	},
	delete_stylesheet:function(css , selTxt , styleName){
		if(!css || !selTxt){return}
		if(!css.cssRules){return}
		
		//selectorTextの指定がある場合
		for(var j=css.cssRules.length-1;j>=0;j--){
			if(css.cssRules[j].selectorText && css.cssRules[j].selectorText.match(selTxt)){
			}
		}
	},
	
	
	//rgb→#**
	rgb2bit16:function(col){
		if(col.match(/rgb(.*?)\((.*)\)/)){
			var rgb = RegExp.$2.split(",");
			var val="#";
			for(var i=0;i<3;i++){
				var val2 = parseInt(rgb[i],10).toString(16);
				if(val2.length==1){
					val+="0"+val2;
				}
				else{
					val+= val2;
				}
			}
			col = val;
		}
		return col;
	},
	
	$:''
};
//内部処理一覧;
$NC.$proc={
	function_read_check:{
		add:10,
		count:0,
		max:5000
	},
	mouse:function(e){
		//IE以外のブラウザ;
		if(e){
			$NC.$.mouse.x = e.clientX;
			$NC.$.mouse.y = e.clientY;
		}
		//IE処理;
		else{
			$NC.$.mouse.x = event.x;
			$NC.$.mouse.y = event.y;
		}
	},
	//swf-hack（wmode=transparent）;
	swf:{
		set:function(wmode){
			//IE;
			if(navigator.userAgent.indexOf("MSIE")!=-1){
				this.proc.ie(wmode);
			}
			else if(navigator.userAgent.indexOf("Opera")!=-1){
				this.proc.op(wmode);
			}
			else if(navigator.userAgent.indexOf("Firefox")!=-1||navigator.userAgent.indexOf("Safari")!=-1||navigator.userAgent.indexOf("Chrome")!=-1){
				this.proc.ff(wmode);
			}
		},
		//除外判定;
		exclude:{
			jogai:[],
			chk:function(jogaiId){
				for(var i=0;i<this.jogai.length;i++){
					if(jogaiId == this.jogai[i]){return true;}
				}
				return false;
			}
		},
		proc:{
			ie:function(wmode){
				var object=document.getElementsByTagName("object");
				for(var obj in object){
					if(typeof(object[obj])!='object'){continue}
					var ch = object[obj].childNodes;
					var flg=0;
					for(var i=0;i<ch.length;i++){
						if(ch[i].tagName=='PARAM'){
							flg++;
							break;
						}
					}
					if(!flg){continue}
					
					var html = object[obj].outerHTML;
					if(!html){continue;}
					
					if(wmode){
						var wmode2 = "<PARAM NAME='WMODE' VALUE='OPAQUE'>";
					}
					else{
						var wmode2 = "<PARAM NAME='WMODE' VALUE='TRANSPARENT'>";
					}
					
					if(html.match(/<object(.*?)>(.*?)$/im)){
						html = "<object"+RegExp.$1+">"+wmode2+RegExp.$2;
					}
					var div = document.createElement("div");
					div.style.display="inline";
					div.innerHTML = html;
					object[obj].parentNode.replaceChild(div,object[obj]);
				}
				var embed=document.getElementsByTagName("embed");
				for(var emb in embed){
					if(typeof(embed[emb])!='object'){continue;}
					var html2 = embed[emb].outerHTML;
					if(!html2){continue;}
					
					if(wmode){
						var wmode2 = " WMODE='OPAQUE' ";
					}
					else{
						var wmode2 = " WMODE='TRANSPARENT' ";
					}
					
					if(html2.match(/<embed(.*?)>$/im)){
						html2 = "<embed"+RegExp.$1+wmode2+">";
					}
					var div2 = document.createElement("div");
					div2.style.display="inline";
					div2.innerHTML = html2;
					embed[emb].parentNode.replaceChild(div2,embed[emb]);
				}
			},
			ff:function(wmode){
				var object=document.getElementsByTagName("object");
				for(var obj in object){
					if(typeof(object[obj])!='function' || object[obj].innerHTML == undefined){continue;}
					pa = document.createElement('param');
					pa.name='wmode';
					if(wmode){
						pa.value='opaque';
					}
					else{
						pa.value='transparent';
					}
					object[obj].appendChild(pa);
				}
				var embed=document.getElementsByTagName("embed");
				if(embed.length){
					for(var i=0;i<embed.length;i++){
						if(typeof(embed[i])!='function'){continue;}
						//object-embed記述;
						if(embed[i].parentNode.tagName == 'OBJECT'){
							var html = embed[i].parentNode.innerHTML;
							if(html.match(/(.*?)<EMBED(.*?)>/im)){
								if(wmode){
									html = RegExp.$1+"<EMBED wmode='opaque'"+RegExp.$2+">";
								}
								else{
									html = RegExp.$1+"<EMBED wmode='transparent'"+RegExp.$2+">";
								}
							}
							embed[i].parentNode.innerHTML = html;
						}
						//embedのみ記述;
						else{
							var str="<embed ";
							for(var e in embed[i]){
								if(typeof(embed[i][e])!='string'){continue}
								str+= e + "='"+embed[i][e]+"' ";
							}
							if(wmode){
								str+="wmode='opaque'></embed>";
							}
							else{
								str+="wmode='transparent'></embed>";
							}
							var div = document.createElement("div");
							div.style.display="inline";
							div.innerHTML = str;
							embed[i].parentNode.replaceChild(div,embed[i]);
						}
					}
				}
			},
			op:function(wmode){
				var embed=document.getElementsByTagName("embed");
				if(embed.length){
					for(var i=0;i<embed.length;i++){
						if(typeof(embed[i])!='object'){continue;}
						//object-embed記述;
						if(embed[i].parentNode.tagName == 'OBJECT'){
							var html = embed[i].parentNode.innerHTML;
							if(html.match(/(.*?)<EMBED(.*?)>/im)){
								if(wmode){
									html = RegExp.$1+"<EMBED wmode='opaque'"+RegExp.$2+">";
								}
								else{
									html = RegExp.$1+"<EMBED wmode='transparent'"+RegExp.$2+">";
								}
							}
							embed[i].parentNode.innerHTML = html;
						}
						//embedのみ記述;
						else{
							var str="<embed ";
							for(var e in embed[i]){
								if(typeof(embed[i][e])!='string'){continue}
								str+= e + "='"+embed[i][e]+"' ";
							}
							if(wmode){
								str+="wmode='opaque'></embed>";
							}
							else{
								str+="wmode='transparent'></embed>";
							}
							var div = document.createElement("div");
							div.style.display="inline";
							div.innerHTML = str;
							embed[i].parentNode.replaceChild(div,embed[i]);
						}
					}
				}
			}
		}
	},
	hash2attribute:function(e,t,v){
		
		if(typeof(v)=='string'){
			e[t] = v;
		}
		else{
			for(var j in v){
				this.hash2attribute(e[t],j,v[j]);
			}
		}
		
	},
	
	
	
	$:''
};


//----------
// Ajax
//----------
$NC.$ajax={
	//データ送信;
	post:function(fm){
		
		if(typeof(fm)=='undefined' || !fm){return}
		
		$NC.$ajax.httpoj = $NC.$ajax.createHttpRequest();
		if(!$NC.$ajax.httpoj){return;}
		
		//open メソッド
		$NC.$ajax.httpoj.open('post', "test.php" , true );
		$NC.$ajax.httpoj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		
		//受信時に起動するイベント;
		$NC.$ajax.httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了
		    if ($NC.$ajax.httpoj.readyState==4){
				//コールバック
				var val = $NC.$ajax.httpoj.responseText;
//				fn(val);
				alert(val);
			}
		};
//		alert(fm.length);
		var data=[];
		for(var i=0;i<fm.length;i++){
			data[data.length] = fm[i].name+"="+encodeURIComponent(fm[i].value);
		}
		
		//send メソッド;
		$NC.$ajax.httpoj.send(data.join("&"));
	},
	
	xmlObj:function(f){
		var r=null;
		try{
			r=new XMLHttpRequest();
		}
		catch(e){
			try{
				r=new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e){
				try{
					r=new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(e){
					return null;
				}
			}
		}
		return r;
	},
	
	//XMLHttpRequestオブジェクト生成;
	set:function( data , method , fileName , async ){//alert(data);
		$NC.$ajax.httpoj = $NC.$ajax.createHttpRequest();
		if(!$NC.$ajax.httpoj){return;}
		//open メソッド;
		$NC.$ajax.httpoj.open( method , fileName , async );
		$NC.$ajax.httpoj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		//受信時に起動するイベント;
		$NC.$ajax.httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了;
		    if ($NC.$ajax.httpoj.readyState==4){
				//コールバック
				var val = $NC.$ajax.on_loaded($NC.$ajax.httpoj);
//				alert(val);
			}
		};
		//send メソッド
		$NC.$ajax.httpoj.send( data );
	},
	createHttpRequest:function(){//alert(1);
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
	//コールバック関数 ( 受信時に実行されます );
	on_loaded:function(oj){
		//レスポンスを取得;
		res  = oj.responseText;
		//ダイアログで表示;
		if(res && res.match(/^[a-z|$]/)){
			eval(res);
		}
	}
};

$NC.$smartphone={
	model:{
		
	},
	white_list:function(){
		
		//システムチェック（デバッグ用）
		if(location.href.indexOf("$NC.mode=preview")!=-1){return true}
		//基本チェック
		else if(navigator.userAgent.indexOf('Android')==-1 && navigator.userAgent.indexOf('iPhone')==-1){return}
		
		//iPhone
		if(navigator.userAgent.indexOf('iPhone')!=-1){return true}
		
		//Black list
		else if(navigator.userAgent.indexOf('Android')!=-1){
			//docomo Optimus chat LG Electronics Japan
			if(navigator.userAgent.indexOf('L-04C')!=-1){return;}
			//EMOBILE Pocket WiFi S ファーウェイ・ジャパン
			if(navigator.userAgent.indexOf('S31HW')!=-1){return;}
			//SoftBank Libero ZTE
			if(navigator.userAgent.indexOf('003Z')!=-1){return;}
			//EMOBILE HTC Aria HTC
			if(navigator.userAgent.indexOf('S31HT')!=-1){return;}
			//docomo HTC
			if(navigator.userAgent.indexOf('HT-03A')!=-1){return;}
			
			return true;
		}
	},
	//バナー
	banner:{
		data:{
			message:{
				flg:'',
				pc:'スマートフォンページへ',
				sp:'PCトップページへ'
			},
			id:'$NC.spc@banner',
			//デバイスの基本サイズ
			width:320,
			click_flg:0
		},
		set:function(inner,mode){
			if(!inner){return}
			if(!mode){mode="bottom"}
//			if(typeof(style)=='undefined'){style={};}
			
			this.data.message.msg=inner;
			this.data.message.flg="msg";
//			this.data.message.style = style;
			this.data.mode = mode;
			
			this.event();
			
			
			
			this.view();
			
		},
		event:function(){
	//		$NC.$.addEvent(document , "touchstart", $NC.$smartphone.banner.touch);
			$NC.$.addEvent(document , "touchmove" , $NC.$smartphone.banner.hidden);
	//		$NC.$.addEvent(window   , "scroll"    , $NC.$smartphone.banner.view);
			$NC.$.addEvent(document , "touchend"  , $NC.$smartphone.banner.view);
		},
		//画面の上下にスペースを作る
		margin:function(){
			if($NC.$.id($NC.$smartphone.banner.data.id)==null){return}
			
			var scroll=$NC.$.scroll();
			var size = $NC.$.browser();
			var doc  = $NC.$.document();
			var rate = size.x / $NC.$smartphone.banner.data.width;
//			alert(rate);
			
			if($NC.$.id($NC.$smartphone.banner.data.id+"_margin")!=null){
				//余白サイズ調整
				$NC.$.id($NC.$smartphone.banner.data.id+"_margin").style.height = $NC.$.id($NC.$smartphone.banner.data.id).offsetHeight *rate+"px";
			}
			else{
				var d = document.createElement("div");
				d.id = $NC.$smartphone.banner.data.id+"_margin";
				d.className="$NC.spc@system";
				d.style.height = $NC.$.id($NC.$smartphone.banner.data.id).offsetHeight *rate+"px";
				
				if($NC.$smartphone.banner.data.mode=='top'){
					document.body.insertBefore(d, document.body.childNodes[0]);
				}
				else if($NC.$smartphone.banner.data.mode=='bottom'){
					document.body.appendChild(d);
				}
			}
		},
		source:function(){
			this.hidden();
			var d = document.createElement("div");
			d.id = $NC.$smartphone.banner.data.id;
			d.className = "$NC.spc@system";
			d.style.position="absolute";
			d.style.backgroundColor="black";
			d.style.width =$NC.$smartphone.banner.data.width;
			d.style.paddingTop = d.style.paddingBottom = "8px";
			d.style.textAlign="center";
			d.style.color="white";
			d.style.zIndex=1000000;
			d.style.fontSize="20px";
			$NC.$.alpha(d,70);
			d.style.visibility="hidden";
			d.innerHTML=this.data.message[$NC.$smartphone.banner.data.message.flg];
			d.onclick=function(){$NC.$smartphone.banner.click()};
			document.body.appendChild(d);
			
			//画面比率計算(幅)
			var scroll=$NC.$.scroll();
			var size = $NC.$.browser();
			var doc  = $NC.$.document();
			var rate = size.x / $NC.$smartphone.banner.data.width;
			d.style.webkitTransform = "scale("+(rate)+")";
			
			//座標は中心点配置
			d.style.left= scroll.x -((d.offsetWidth - ($NC.$smartphone.banner.data.width*rate))/2)+"px";
			if($NC.$smartphone.banner.data.mode=='top'){
				d.style.top = scroll.y -((d.offsetHeight-(d.offsetHeight*rate))/2)+"px";
			}
			else if($NC.$smartphone.banner.data.mode=='bottom'){
				d.style.top = scroll.y + size.y - d.offsetHeight+((d.offsetHeight-(d.offsetHeight*rate))/2)+"px";
			}
			
			d.style.visibility="visible";
		},
		view:function(e){
			if($NC.$.id($NC.$smartphone.banner.data.id)!=null){
				$NC.$.id($NC.$smartphone.banner.data.id).style.backgroundColor="#000000";
				return;
			}
			var pos = $NC.$.scroll();
			
			if(typeof($NC.$smartphone.banner.data.pos)!='undefined' && $NC.$smartphone.banner.data.pos.x == pos.x && $NC.$smartphone.banner.data.pos.y == pos.y){
				delete $NC.$smartphone.banner.data.pos;
				$NC.$smartphone.banner.source();
				$NC.$smartphone.banner.margin();
				
				
				
			}
			else{
				$NC.$smartphone.banner.data.pos=$NC.$.scroll();
				setTimeout(function(){$NC.$smartphone.banner.view()},100);
			}
			
		},
		hidden:function(e){
			if($NC.$.id($NC.$smartphone.banner.data.id)==null){return}
			$NC.$.id($NC.$smartphone.banner.data.id).parentNode.removeChild($NC.$.id($NC.$smartphone.banner.data.id));
		},
		click:function(){
			if($NC.$smartphone.banner.data.message.flg=='pc'){
				var url =encodeURIComponent(location.href);
				var rev = "";
				if(typeof($NC_DATA.spc.sw)!='undefined' && $NC_DATA.spc.sw.link_url){
					rev = encodeURIComponent($NC_DATA.spc.sw.link_url);
				}
				else{
					rev = url;
				}
				location.href = $NC.$set.src.$.dir+"smartphone.php?mode=view&user="+$NC.$set.src.u+"&url="+url+"&rev="+rev;
				
			}
			else if($NC.$smartphone.banner.data.message.flg=='sp'){
				var q = $NC.$.query();
				//URL指定有り
				if(q.rev){
					location.href = decodeURIComponent(q.rev);
				}
				//URL指定無し
				else{
					location.href = decodeURIComponent(q.url);
				}
			}
		}
	}
};

//----------
//cookie処理
//----------
if(typeof($NC.$cookie)=='undefined'){$NC.$cookie={}}
//各種初期設定
$NC.$cookie.data={
	name:"NavicastApi",
	day:0,
	hour:6,
	min:0,
	sec:0
};
//日付算出（有効期限用）
$NC.$cookie.date=function(d,h,m,s){
	var exp=new Date();
	exp.setTime(exp.getTime()+(d*1000*60*60*24)+(h*1000*60*60)+(m*1000*60)+(s*1000));
	return exp.toGMTString();
};
//ssl判定
$NC.$cookie.secure=function(){
	if (location.href.match(/^https/)){
		return true;
	}
	else{
		return;
	}
};
//cookie書き込み
$NC.$cookie.write=function(nm , val ,d,h,m,s){
	//脆弱性処理
	val = $NC.$.xss(val);
	if(this.secure()){
		document.cookie = nm+"\="+val+";expires\="+this.date(d,h,m,s)+";path=/;secure";
	}
	else{
		document.cookie = nm+"\="+val+";expires\="+this.date(d,h,m,s)+";path=/;";
	}
};
//cookie読み込み
$NC.$cookie.read=function(nm){
	var ck0=document.cookie.split(" ").join("");
	var ck1=ck0.split(";");
	for(var i=0;i<ck1.length;i++){
		var ck2=ck1[i].split("=");
		if(ck2[0]==nm){
			//脆弱性処理
			ck2[1] = $NC.$.xss(ck2[1]);
			return ck2[1];
		}
	}
	return '';
};



//マウス座標取得用;
//$NC.$.addEvent(document,"mousemove",$NC.$proc.mouse);
