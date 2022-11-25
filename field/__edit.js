//if(typeof($LIB)=='undefined'){$LIB={}}
//

/*--------------------
ナンプレ



--------------------*/

(function(){
	var $={};
	////////////////////
	//デバッグモード（edit）
	$.set = function(user){
		//フィールドセット
		$LIB.game.view.area();
		//イベントセット
		$LIB.game.event.set();
		//aria設定
		$LIB.game.edit_mode.set();
	};
	////////////////////
	//編集モード
	$.edit_mode={
		set:function(){
			
			$LIB.event.add(window,"mousemove",$LIB.event.mouse.proc);
			
			//img作成
			var game = document.getElementById("game");
			var field = document.getElementById("field");
			var img=document.createElement("img");
			img.src="img/debug/waku_red.png?"+(+new Date());
			img.id="cursor";
			img.style.setProperty("position","absolute",null);
			img.style.setProperty("z-index","10000000",null);
			img.style.setProperty("top", 0+"px",null);
			img.style.setProperty("left",0+"px",null);
			
			img.onmousedown=function(){return false};
			img.onmousemove=function(){return false};
			
//			game.appendChild(img);
			field.appendChild(img);
			
			$LIB.event.add(window,"mousemove",$LIB.game.edit_mode.mousemove);
			
		},
		mousemove:function(){
//			var game = document.getElementById("game");
			var field = document.getElementById("field");
			
			var x = $LIB.event.mouse.pos.x - $LIB.trans.pos(field).x;
			var y = $LIB.event.mouse.pos.y - $LIB.trans.pos(field).y;
			
			var img = document.getElementById("cursor");
			
			//座標判別
			var cell = $LIB.game.edit_mode.pos2cell(x,y);
//			var pos  = $LIB.game.view.cell2pos(cell);
			
			//座標
			var pos={
				x:cell.x*$LIB.game.data.size.x +((cell.y%2)?($LIB.game.data.size.x/2)*-1:0),
				y:cell.y*($LIB.game.data.size.y/2)
			};
			
			//移動処理
			img.style.setProperty("top", pos.y+"px",null);
			img.style.setProperty("left",pos.x+"px",null);
			
			//デバッグエリアに表示
			document.getElementById("debug").value = x+"/"+y;
			//マウス座標
//			document.getElementById("debug").value = $LIB.event.mouse.pos.x+"/"+$LIB.event.mouse.pos.y;
			//cellアドレス
//			document.getElementById("debug").value = cell.x+"/"+cell.y;
			
			
		},
		//座標からhexマスのアドレスを取得
		pos2cell:function(x,y){
			var cell ={
				x:parseInt(x/$LIB.game.data.size.x,10),
				y:parseInt(y/($LIB.game.data.size.y/2),10)
			};
			
			return cell;
		},
		
		set2:function(){
			var field = document.getElementById("field");
			if(field==null){return}
			
			var img = document.createElement("img");
			img.src="img/spacer.png";
			img.usemap="#field2";
			img.border="a";
			img.style.setProperty("position","absolute",null);
			img.style.setProperty("top" ,"0",null);
			img.style.setProperty("left","0",null);
			img.style.setProperty("width" ,field.offsetWidth +"px",null);
			img.style.setProperty("height",field.offsetHeight+"px",null);
			img.style.setProperty("border","3px solid red",null);
			img.style.setProperty("z-index","10000000",null);
		}
	};
	
	////////////////////
	if(typeof(window.$LIB)=='undefined'){window.$LIB={}}
	if(typeof(window.$LIB.game)=='undefined'){window.$LIB.game={}}
	$LIB.game = $;
	return $;
})();

