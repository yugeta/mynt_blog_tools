if(typeof($LIB)=='undefined'){$LIB={}}

/**
* game ランドマーク
* ・クォータービュー
* ・
* 
**/

/*transformation*/
$LIB.game={
	//各種データ
	data:{
		user:"test",
		chara:"test",
		map:"test",
		story:"test",
		size:{x:64,y:32},
		
		step:4,//1歩の分割数
		once:400,//1歩にかかるの時間
//		chara_pos:{x:2,y:4},
		viewmode:"center",
//		next_pos:{x:0,y:1},
		$:0
	},
	//ページ読み込み時の初期処理
	set:function(story,user,chara,map){
		//
		if(typeof($LIB.chara)=="undefined"){
			$LIB.chara={};
		}
		if(typeof($LIB.story)=="undefined"){
			$LIB.story={};
		}
		if(typeof($LIB.map)=="undefined"){
			$LIB.map={};
		}
		if(typeof($LIB.user)=="undefined"){
			$LIB.user={};
		}
		
		//Story
		if(story){$LIB.game.data.story= story}
		//ユーザーID
		if(user){$LIB.game.data.user= user}
		//マイキャラ設置
		if(chara){$LIB.game.data.chara = chara}
		//マップ作成
		if(map){$LIB.game.data.map = map}
		
		//初期設定
		$LIB.event.add(window,"load",$LIB.game.init.query);
	},
	//初期化
	init:{
		//読み込み中画面(start)
		start:function(){
			var d = document.createElement("div");
			d.id  = "$LIB.game.loading";
			d.style.setProperty("background-color","black","important");
			d.style.setProperty("position","absolute","important");
			d.style.setProperty("top","0","important");
			d.style.setProperty("left","0","important");
			d.style.setProperty("z-index","100000000","important");
			
			var html = document.getElementsByTagName("html")[0];
			var size = {
				x:html.offsetWidth,
				y:html.offsetHeight
			};
			
			d.style.setProperty("width", size.x+"px","important");
			d.style.setProperty("height",size.y+"px","important");
			
//			alert(document.body);
			document.getElementsByTagName("body")[0].appendChild(d);
		},
		//読み込み中画面(end)
		end:function(){
			var e = document.getElementById("$LIB.game.loading");
			if(e==null){return}
			e.parentNode.removeChild(e);
		},
		img_load:function(){
			//土台セット
			if(document.getElementById("img_load")==null){
				var d1 = document.createElement("div");
				d1.id = "img_load";
				d1.style.setProperty("display","none",null);
				d1.style.setProperty("background-color","white",null);
				d1.style.setProperty("border","1px solid red",null);
				d1.style.setProperty("margin","20px",null);
				document.body.appendChild(d1);
			}
			
			//読み込み済み画像
			var img_loaded = document.getElementById("img_load").getElementsByTagName("img");
			
			//サブキャラ画像読み込み
			if(typeof($LIB.chara)!='undefined'){
				for(var i in $LIB.chara){
					if(typeof($LIB.chara[i].img)=='undefined'){continue}
					
					//読み込み済み画像チェック
					var flg=0;
					for(var j=0;j<img_loaded.length;j++){
						if(img_loaded.src == "chara/"+i+"/"+img[j]){
							flg++;
							break;
						}
					}
					if(flg){continue;}
					
					//画像読み込み
					var img = $LIB.chara[i].img;
					for(var j=0;j<img.length;j++){
						var d2= document.createElement("img");
						d2.src= "chara/"+i+"/"+img[j];
						document.getElementById("img_load").appendChild(d2);
						
					}
				}
			}
			
			//map
			if(typeof($LIB.map[$LIB.game.data.map].surface)!='undefined'){
				for(var i in $LIB.map[$LIB.game.data.map].surface){
					if(typeof($LIB.map[$LIB.game.data.map].surface[i].img)=='undefined'){continue}
					
					//読み込み済み画像チェック
					var flg=0;
					for(var j=0;j<img_loaded.length;j++){
						if(img_loaded.src == $LIB.map[$LIB.game.data.map].surface[i].img){
							flg++;
							break;
						}
					}
					if(flg){continue;}
					
					//画像読み込み
					var d2= document.createElement("img");
					d2.src= $LIB.map[$LIB.game.data.map].surface[i].img;
					document.getElementById("img_load").appendChild(d2);
				}
			}
		},
		//初期設定
		query:function(){
//			//読み込み中画面(start)
//			$LIB.game.init.start();
			
			//クエリ情報取得
			var q = $LIB.page.query();
			if(q){
				if(typeof(q.user)=='string'){
					$LIB.game.data.user = q.user;
				}
				if(typeof(q.chara)=='string'){
					$LIB.game.data.chara = q.chara;
				}
				if(typeof(q.map)=='string'){
					$LIB.game.data.map = q.map;
				}
				if(typeof(q.map)=='string'){
					$LIB.game.data.story = q.story;
				}
			}
			
			//イベントセット
			$LIB.game.event.set();
			
			//next
			$LIB.game.init.story();
			
		},
		//storyセット
		story:function(){
			var story = $LIB.game.data.story;
			//データ存在確認
			if(typeof($LIB.story[story])!='undefined'){
				//初期値セット
				if(typeof($LIB.story[story].map)!='undefined'){
					$LIB.game.data.map = $LIB.story[story].map;
				}
				if(typeof($LIB.story[story].chara)!='undefined' && typeof($LIB.story[story].chara.type)!='undefined'){
					$LIB.game.data.chara = $LIB.story[story].chara.type;
				}
				//next
				$LIB.game.init.map();
			}
			else{
				var story_ajax = $LIB.ajax.load("story/"+ story +".json?tmp="+(+new Date()) , "get");
				
				story_ajax.onreadystatechange = function(){
					var story = $LIB.game.data.story;
					//readyState値は4で受信完了;
					if (this.readyState==4){
						if(!this.responseText){return}
						// console.log(this.responseText)
						//コールバック
						// eval("$LIB.story['"+story+"']="+this.responseText+";");
						$LIB.story[story] = JSON.parse(this.responseText)

						//初期値セット
						if(typeof($LIB.story[story].map)!='undefined'){
							$LIB.game.data.map = $LIB.story[story].map;
						}
						if(typeof($LIB.story[story].chara)!='undefined' && typeof($LIB.story[story].chara.type)!='undefined'){
							$LIB.game.data.chara = $LIB.story[story].chara.type;
						}
						
						//next
						$LIB.game.init.map();
					}
				};
				story_ajax.send();
			}
			
		},
		//mapセット
		map:function(){
			//データ存在確認
			if(typeof($LIB.map[$LIB.game.data.map])!='undefined'){
				//next
				$LIB.game.init.chara();
			}
			else{
				var map_ajax = $LIB.ajax.load("map/"+$LIB.game.data.map+"/ini.js?tmp="+(+new Date()) , "get");
				map_ajax.onreadystatechange = function(){
					//readyState値は4で受信完了;
					if (this.readyState==4){//alert(this.responseText);
						if(!this.responseText){return}
						//コールバック
						eval("$LIB.map['"+$LIB.game.data.map+"']="+this.responseText+";");
//						$LIB.game.map.set();
						
						//next
						$LIB.game.init.chara();
					}
				};
				map_ajax.send();
			}
		},
		
		//キャラクターセット
		chara:function(){
			//データ存在確認
			if(typeof($LIB.chara[$LIB.game.data.chara])!='undefined'){
				//next
				$LIB.game.init.finish();
			}
			else{
				var chr_ajax = $LIB.ajax.load("chara/"+$LIB.game.data.chara+"/ini.js?tmp="+(+new Date()),"get");
				chr_ajax.onreadystatechange = function(){
					//readyState値は4で受信完了;
					if (this.readyState==4){
						//コールバック
						eval("$LIB.chara['"+$LIB.game.data.chara+"']="+this.responseText+";");
						
						//next
						$LIB.game.init.finish();
					}
				};
				chr_ajax.send();
			}
		},
		
		//最終セット
		finish:function(){
			
			//mapセット
			$LIB.game.map.set();
			
			//サブキャラセット
			$LIB.game.story.subchara();
			
			//キャラセット
			$LIB.game.chara.set();
			
			//画像のキャッシュ読み込み
			$LIB.game.init.img_load();
			
			//サブキャラ移動開始
			setTimeout($LIB.game.subchara.interval,2000);
			
			//読み込み中画面(start)
			$LIB.game.init.end();
		}
		
	},
	//シナリオスタート
	story:{
		set:function(){
			
			
			this.subchara();
			
		},
		
		//ステージ表示情報の削除
		del:function(){
			var game = document.getElementById("game");
			var field = document.getElementById("field");
//			e.innerHTML = "";
			game.removeChild(field);
			
			var field_new = document.createElement("div");
			field_new.id = "field";
			game.appendChild(field_new);
		},
		
		//マップ配置サブキャラ
		subchara:function(){
			if(typeof($LIB.story[$LIB.game.data.story].subchara)=='undefined'){return}
			var chr_ajax=[];
			var num=0;
			for(var i in $LIB.story[$LIB.game.data.story].subchara){
				//キャラデータ読み込み
				if(typeof($LIB.chara[$LIB.story[$LIB.game.data.story].subchara[i].type])=='undefined'){
					chr_ajax[num] = $LIB.ajax.load("chara/"+$LIB.story[$LIB.game.data.story].subchara[i].type+"/ini.js?tmp="+(+new Date()),"get");
					chr_ajax[num].onreadystatechange = function(){
						//readyState値は4で受信完了;
						if (this.readyState==4){
							//コールバック
							eval("$LIB.chara['"+$LIB.story[$LIB.game.data.story].subchara[i].type+"']="+this.responseText+";");
							$LIB.game.chara.view("subchara_"+i,$LIB.story[$LIB.game.data.story].subchara[i].pos,$LIB.story[$LIB.game.data.story].subchara[i].type, $LIB.story[$LIB.game.data.story].subchara[i].course);
						}
					};
					chr_ajax[num].send();
					num++;
				}
				else{
					$LIB.game.chara.view("subchara_"+i,$LIB.story[$LIB.game.data.story].subchara[i].pos,$LIB.story[$LIB.game.data.story].subchara[i].type, $LIB.story[$LIB.game.data.story].subchara[i].course);
				}
			}
		}
	},
	//表示処理
	map:{
		set:function(){
			//初期設定
			var game = document.getElementById("game");
			var field = document.getElementById("field");
			var map = $LIB.map[$LIB.game.data.map].data;
			
			$LIB.game.data.size = $LIB.map[$LIB.game.data.map].size;
			
			if(!map || !map.length ){return}
			
			//背景色設定
			if($LIB.map[$LIB.game.data.map].bgcolor){
				game.style.setProperty("background-color",$LIB.map[$LIB.game.data.map].bgcolor,null);
			}
			if($LIB.map[$LIB.game.data.map].bgimage){
				game.style.setProperty("background-image","url("+$LIB.map[$LIB.game.data.map].bgimage+")",null);
			}
			
			//マップマトリクスデータ
			var map_width=0;
			for(var i=0;i<map.length;i++){
				if(map[i] && typeof(map[i])=="string"){
					map[i] = map[i].split(",");
				}
				//最長length判定
				if(map_width<map[i].length){
					map_width = map[i].length;
				}
			}
			
			//html作成
			var html='';
			for(var y=0;y<map.length + map_width;y++){
				
				//余白処理
				var land = map.length;
				
				if(y<land){
					land = y;
				}
				else if(y > map_width){
					land = map.length + map_width - y;
				}
				
				var yohaku = (y < map.length)?map.length - y : map_width-(map_width - (y - map.length));
				
				var rows_style="z-index:"+$LIB.game.map.z(y,1)+";";
				rows_style+="left:"+(yohaku*$LIB.game.data.size.x/2)+"px;";
				
				html+= "<div class='rows' style='"+rows_style+"'>";
				
				for(var x=0;x<map.length + map_width;x++){
					
					//x軸の座標
					var pos_x = x * $LIB.game.data.size.x;
					
					var img="";
					var style="";
					var bg="bg0";
					
					//マップ画像データ
					if(x >= land){continue}
					
					var img_addr = {
						h:(y<map.length)?y-x-1:y-x-(y-map.length)-1,
						w:(y<map.length)?x:x+(y-map.length)
					};
					
					if(typeof(map[img_addr.h])!="undefined"
					&& typeof(map[img_addr.h][img_addr.w])!="undefined"
					&& map[img_addr.h][img_addr.w]!=0
					&& typeof($LIB.map[$LIB.game.data.map].surface[map[img_addr.h][img_addr.w]])!="undefined"
					&& typeof($LIB.map[$LIB.game.data.map].surface[map[img_addr.h][img_addr.w]].img)!="undefined"){
						img = "<img src='"+$LIB.map[$LIB.game.data.map].surface[map[img_addr.h][img_addr.w]].img+"' />";
					}
					
					if(map[img_addr.h][img_addr.w]){
						html+= "<div class='cols "+bg+"' style='left:"+pos_x+"px;' map_type='"+map[img_addr.h][img_addr.w]+"' id='map_id_"+img_addr.w+"_"+img_addr.h+"'>"+img+"</div>";
					}
				}
				html+= "</div>";
			}
			field.innerHTML = html;
		},
		
		z:function(y,add){
			if(!add){add=0;}
			
			return (y*10 +add);
		}
	},
	
	//キャラクター
	chara:{
		data:{},
		set:function(){
			
			//初期位置データ確認
//			if(typeof($LIB.map)=='undefined'){$LIB.map={}}
			if(typeof($LIB.story[$LIB.game.data.story].chara.pos)=='undefined'){$LIB.story[$LIB.game.data.story].chara.pos={x:0,y:0}}
			
			$LIB.game.chara.view("chara_"+$LIB.game.data.user , $LIB.story[$LIB.game.data.story].chara.pos , $LIB.game.data.chara , $LIB.story[$LIB.game.data.story].chara.course);
			
		},
		
		//mapアドレスから座標を取得
		map2pos:function(map){
			if(!map){return}
			if(typeof(map.x)=="undefined" || typeof(map.y)=="undefined"){
				a;ert(map.x+"/"+map.y);
			}
			
			var game= document.getElementById("game");
			var e = document.getElementById("map_id_"+map.x+"_"+map.y);
			
			var pos = $LIB.trans.pos(e);
			
			pos.x -= game.offsetLeft;
			pos.y -= game.offsetTop;
			
			return pos;
			
		},
		
		//mapアドレスからzを取得
		map2z:function(map){
			if(!map){return}
			var e = document.getElementById("map_id_"+map.x+"_"+map.y);
			
			return e.parentNode.style.zIndex;
		},
		
		//キャラクター表示（初期表示）
		view:function(id,chr_pos,chara,course){
			//方向
			if(!course){
				course = 3;
			}
			
			//初回キャラ作成
			if(document.getElementById(id)==null){this.make(id,chr_pos,chara)}
			
			//キャラelm
			var chr = document.getElementById(id);
			
			//mapアドレスから座標を取得
			var pos = $LIB.game.chara.map2pos(chr.pos);
			
			//mapアドレスからzを取得
			var z   = $LIB.game.chara.map2z(chr.pos);
			
			//座標
			chr.style.setProperty
			("left", pos.x+"px" , null);
			chr.style.setProperty("top" , pos.y+"px" , null);
			chr.style.setProperty("width"  , $LIB.game.data.size.x +"px" , null);
			chr.style.setProperty("height" , $LIB.game.data.size.y +"px" , null);
			chr.style.setProperty("z-index", (z+5) ,null);
			
			chr.course = course;//方向
//			chr.map_flg = chara;
			chr.innerHTML = "<img id='"+id+"' class='chara' src='"+"chara/"+chara+"/"+$LIB.chara[chara].img[$LIB.chara[chara].anm[course][0]]+"'>";
			
			//map中央処理
			$LIB.game.chara.center();
		},
		make:function(id,chr_pos,chara){
			var field = document.getElementById("field");
			var div = document.createElement("div");
			div.id  = id;
			div.chara = chara;
			div.className = "chara";
			
			//座標保持用
			div.pos ={
				x:chr_pos.x,
				y:chr_pos.y
			};
			/*
			var map = document.getElementById("map_id_"+div.pos.x+"_"+div.pos.y);
			if(map!=null){
				map.map_flg=chara;
			}
			*/
			//移動防止フラグ
			var sp = id.split("_");
			document.getElementById("map_id_"+div.pos.x+"_"+div.pos.y).map_flg=sp[1];
			
			field.appendChild(div);
		},
		//キャラ移動処理
		move:function(e){//alert(e.keyCode);
			var id = "chara_"+$LIB.game.data.user;
			var chr = document.getElementById(id);
			if(chr==null){return}
			if(chr.move_flg){return}
			
			var chara = chr.chara;
			
			//↑up-right
			if(e.keyCode==38 || e.id=="pad_1"){
				chr.move_flg = 1;
			}
			//←up-left
			else if(e.keyCode==37 || e.id=="pad_4"){
				chr.move_flg = 4;
			}
			//→down-right
			else if(e.keyCode==39 || e.id=="pad_2"){
				chr.move_flg = 2;
			}
			//↓down-left
			else if(e.keyCode==40 || e.id=="pad_3"){
				chr.move_flg = 3;
			}
			//space
			else if(e.keyCode==32){
				$LIB.game.message.view("space");
			}
			/*
			//next_stage
			if(typeof($LIB.story.next_stage)=="object"){
				for(var i in $LIB.story.next_stage){
					if($LIB.story.next_stage[i].x==chr.pos.x && $LIB.story.next_stage[i].y==chr.pos.y){
						alert(i);
					}
				}
			}
			*/
			//
			if(chr.move_flg){
				chr.course = chr.move_flg;
				
				var next = $LIB.game.chara.course(chr.move_flg);
				
				chr.next = {
					x:chr.pos.x + next.x,
					y:chr.pos.y + next.y
				}
				
				//枠外判定 or 障害物（コリジョン）判定
				if($LIB.game.chara.move_check(id,$LIB.game.data.user, chr.next.x, chr.next.y)){
					chr.getElementsByTagName("img")[0].src= "chara/"+$LIB.game.data.chara+"/"+$LIB.chara[chara].img[$LIB.chara[chara].anm[chr.move_flg][0]];
//					chr.course = chr.move_flg;//方向メモリ
					chr.move_flg = 0;
					delete chr.next;
				}
				//移動処理
				else if(chr.move_flg){
					//message削除
					$LIB.game.message.del();
					//map-flg
					document.getElementById("map_id_"+chr.pos.x+"_"+chr.pos.y).map_flg=0;
					document.getElementById("map_id_"+chr.next.x+"_"+chr.next.y).map_flg=$LIB.game.data.user;
					//
					setTimeout("$LIB.game.chara.moving(0,'"+id+"','"+$LIB.game.data.chara+"')",0);
					
					
				}
			}
		},
		//方向に応じて、XY座標を計算
		course:function(course){
			
			var next ={x:0,y:0};
			
			if(course==1){
				next.y = -1;
			}
			else if(course==4){
				next.x = -1;
			}
			else if(course==2){
				next.x = 1;
			}
			else if(course==3){
				next.y = 1;
			}
			return next;
		},
		move_check:function(my_id,chara,x,y){
			/*
			if(typeof(x)=='undefined' || typeof(y)=='undefined'){
				return true;
			}
			*/
			
			//自キャラ判定
			var my_chara = false;
			if(my_id.match(/^chara_/)){
				my_chara = true;
			}
			
			//map無
			if(document.getElementById("map_id_"+x+"_"+y)==null){
				return true;
			}
			//画像（建物）有
			else if(!document.getElementById("map_id_"+x+"_"+y).getElementsByTagName("img").length){
				return true;
			}
			//通行フラグが立っている場合は、通行不可
			else if($LIB.map[$LIB.game.data.map].surface[$LIB.map[$LIB.game.data.map].data[y][x]].pass){
				return true;
			}
			//キャラ通しの衝突
			var chr = document.getElementById(my_id);
			var map = document.getElementById("map_id_"+chr.next.x+"_"+chr.next.y);
			if(map!=null && map.map_flg){//alert(my_id);
				return true;
			}
			
		},
		moving:function(step,id,chara){
			
			var path = "chara/"+chara+"/";
			
			var chr = document.getElementById(id);
			if(chr==null){return}
			
			//フラグチェック
			if(chr.move_flg<=0 || chr.move_flg>4){return}
			chr.course = chr.move_flg;
			
			//ステップ数追加
			if(typeof(step)=='undefined' || !step || step<0 || step=='undefined'){step=0}
			step++;
			
			var game_pos = $LIB.trans.pos(document.getElementById("game"));
			var field_pos= $LIB.trans.pos(document.getElementById("field"));
			var add_pos = {
				x:game_pos.x-field_pos.x,
				y:game_pos.y-field_pos.y
				
			};
			
			//元座標取得
			if(!chr.pos){return}
			var pos1 = $LIB.game.chara.map2pos(chr.pos);
			
			//next座標取得
			if(!chr.next){return}
			var pos2 = $LIB.game.chara.map2pos(chr.next);
			
			//z
			var z = $LIB.game.chara.map2z(chr.next);
			
			//中間座標取得
			var pos0 = {
				x:pos1.x+((pos2.x-pos1.x)/$LIB.game.data.step*step),
				y:pos1.y+((pos2.y-pos1.y)/$LIB.game.data.step*step)
			};
			pos0.x += add_pos.x;
			pos0.y += add_pos.y;
			
			//キャラ移動
			chr.style.setProperty("left", pos0.x+"px" , null);
			chr.style.setProperty("top" , pos0.y+"px" , null);
			//下方向（座標のプラス方向）の場合は最初にz値を操作する
			if(chr.pos.x < chr.next.x || chr.pos.y < chr.next.y){
				chr.style.setProperty("z-index", z   , null);
			}
			
			//map中央処理
			$LIB.game.chara.center();
			
			//次処理
			if(step < $LIB.game.data.step){
				//歩きアニメ
				var step_num = step%$LIB.chara[chara].anm[chr.move_flg].length;
				var img = path+$LIB.chara[chara].img[$LIB.chara[chara].anm[chr.move_flg][step_num]];
				chr.getElementsByTagName("img")[0].src= img;
				
				setTimeout("$LIB.game.chara.moving("+step+",'"+id+"','"+chara+"')",($LIB.game.data.once/$LIB.game.data.step));
			}
			//処理終了
			else{
				//z
				chr.style.setProperty("z-index", z   , null);
				//img
				var img = path+$LIB.chara[chara].img[$LIB.chara[chara].anm[chr.move_flg][0]];
				chr.getElementsByTagName("img")[0].src= img;
				//flg-stop
				chr.move_flg = 0;
				chr.pos = chr.next;
				delete chr.next;
				
				//next_stage
				var story = $LIB.game.data.story;
				if(typeof($LIB.story[story].next_stage)!="undefined" && id.match(/^chara_/)){
					for(var i in $LIB.story[story].next_stage){
						if($LIB.story[story].next_stage[i].x==chr.pos.x && $LIB.story[story].next_stage[i].y==chr.pos.y){
							//現在の画面を削除
							$LIB.game.story.del();
							//新ステージ構築
							$LIB.game.data.story = i;
//							setTimeout($LIB.game.init.story,1000);
							$LIB.game.init.story();
						}
					}
				}
			}
			
		},
		center:function(){
			var chr = document.getElementById("chara_"+$LIB.game.data.user);
			var game = document.getElementById("game");
			var field = document.getElementById("field");
			
			if(chr==null || game==null || field==null){return}
			
			var chr_pos = $LIB.trans.pos(chr)
			var field_pos = $LIB.trans.pos(field);
			var game_size = $LIB.trans.size(game);
			
			var x = (game_size.x/2)-(chr_pos.x-field_pos.x)-($LIB.game.data.size.x/2);
			var y = (game_size.y/2)-(chr_pos.y-field_pos.y)-($LIB.game.data.size.y/2);
			
			field.style.setProperty("left", x+"px",null);
			field.style.setProperty("top",  y+"px",null);
		}
	},
	
	//タッチイベント
	event:{
		set:function(){
			var field = document.getElementById("field");
			var game = document.getElementById("game");
			if(field==null){return}
			
			//タッチイベントの存在確認
			if($LIB.event.device.check()=='smartphone'){
				/*
				//キャラの移動（キーパット）
				$LIB.event.add(window,"touchstart",	$LIB.game.event.cursor.down);
				$LIB.event.add(window,"touchmove",	$LIB.game.event.cursor.move);
				$LIB.event.add(window,"touchend",	$LIB.game.event.cursor.up);
				*/
			}
			//pc
			else{
				//キャラの移動（カーソル）
				
				$LIB.event.add(window,"keydown",	$LIB.game.chara.move);
				/*
				$LIB.event.add(window,"mousedown",	$LIB.game.event.cursor.down);
				$LIB.event.add(window,"mousemove",	$LIB.game.event.cursor.move);
				$LIB.event.add(window,"mouseup",	$LIB.game.event.cursor.up);
				*/
				$LIB.event.add(document.getElementById("cursor_key_pad"),"mousedown",	$LIB.game.event.cursor.pad_push);
				$LIB.event.add(document.getElementById("cursor_key_pad"),"mousemove",	$LIB.game.event.cursor.pad_move);
				$LIB.event.add(document.getElementById("cursor_key_pad"),"mouseup",		$LIB.game.event.cursor.pad_end);
				
			}
		},
		cursor:{
			data:{touch_flg:0},
			pad_push:function(e){
				$LIB.game.event.cursor.data.touch_flg=1;
				$LIB.game.event.cursor.pad_move(e);
			},
			pad_move:function(e){
				if(!$LIB.game.event.cursor.data.touch_flg){return}
				
				$LIB.event.mouse.proc(e);
//				alert($LIB.event.mouse.pos.x+"/"+$LIB.event.mouse.pos.y);
				var pad = $LIB.trans.pos(e.target);
				
//				alert($LIB.event.mouse.pos.x +"/"+ pad.x +"/"+ $LIB.event.mouse.pos.y +"/"+ pad.y);
//				alert($LIB.event.mouse.pos.x - pad.x +"/"+ ($LIB.event.mouse.pos.y - pad.y));
				
				
			},
			pad_end:function(e){
				$LIB.game.event.cursor.data.touch_flg=0;
			},
			
			push:function(){
				
				if($LIB.game.event.cursor.flg){
					$LIB.game.chara.move($LIB.game.event.cursor.flg);
					
					setTimeout($LIB.game.event.cursor.push,$LIB.game.data.once*0.5);
				}
				
			},
			
			down:function(event){				
				var e = event.target;
				
				if(!e.id
				|| (e.id!="pad_1" && e.id!="pad_2" && e.id!="pad_3" && e.id!="pad_4")
				){return}
				
				$LIB.game.event.cursor.flg=e;
				$LIB.game.event.cursor.push();
			},
			move:function(event){
				if(!$LIB.game.event.cursor.flg){return}
				
				var e = event.target;
				
				if(!e.id
				|| (e.id!="pad_1" && e.id!="pad_2" && e.id!="pad_3" && e.id!="pad_4")
				){return}
				
				
				
				$LIB.game.event.cursor.flg=e;
				
			},
			up:function(event){
				if($LIB.game.event.cursor.flg){
					delete $LIB.game.event.cursor.flg;
				}
			}
		},
		/*
		down:function(event){
			var e = event.target;
			var field = document.getElementById("field");
			
			//タッチ座標
			$LIB.game.event.field = $LIB.trans.pos(field);
			
			$LIB.game.event.pos = {x:event.pageX,y:event.pageY};
			$LIB.game.event.flg = true;
			
		},
		move:function(event){
			var e = event.target;
			var field = document.getElementById("field");
			
			//タッチ座標
			touch_pos = {x:event.pageX,y:event.pageY};
			game_pos = $LIB.trans.pos(document.getElementById("game"));
			
			//画面移動
			if($LIB.game.event.flg){
				//座標取得
				var x = $LIB.game.event.field.x + (touch_pos.x - $LIB.game.event.pos.x) - game_pos.x;
				var y = $LIB.game.event.field.y + (touch_pos.y - $LIB.game.event.pos.y) - game_pos.y;
				
				field.style.left = x+"px";
				field.style.top = y+"px";
			}
			
		},
		up:function(event){
			delete $LIB.game.event.pos;
			delete $LIB.game.event.field;
			$LIB.game.event.flg = false;
			
			document.getElementById("debug").value ="";
			
		}
		*/
	},
	//データオートセーブ
	save:function(){
		/*
		//game-id
		var game = document.getElementById("game");
		var data = game.getElementsByTagName("td");
		
		//データ作成
		var val=[];
		for(var i=0;i<data.length;i++){
			//既存値
			if(data[i].getAttribute("game_num")==null){
				val[val.length] = "";
			}
			//入力値
			else{
				val[val.length] = data[i].innerHTML;
			}
		}
		
		//データ保存
		$LIB.data.save("game.nample.data", $LIB.game.nample.data.game_data, val.join(","));
		*/
	},
	
	//メッセージ表示
	message:{
		id:'$LIB.game.message',
		check:function(x,y,course){
			
			var message="";
			var story = $LIB.game.data.story;
			var map   = $LIB.game.data.map
			
			if(typeof($LIB.story[story].message)=='undefined'){return message;}
			
			//メッセージ確認
			var course = $LIB.game.chara.course(course);
			var pos = {
				x:x + course.x,
				y:y + course.y
			};
			map_cell = document.getElementById("map_id_"+pos.x+"_"+pos.y);
//			var flg=0;
//			var html="";
			//debug
//			html += "course:"+chr.course+"<br>";
//			html += "x:"+chr.pos.x+" y:"+chr.pos.y+"<br>";
//			html += "x:"+pos.x+" y:"+pos.y+"<br>";
			
			//map
			if(!message && typeof($LIB.map[map].data[pos.y])!='undefined' && typeof($LIB.map[map].data[pos.y][pos.x])!='undefined'){
				var map2 = $LIB.map[map].data[pos.y][pos.x];
				if($LIB.map[map].surface[map2].message && typeof($LIB.story[story].message[$LIB.map[map].surface[map2].message])!='undefined'){
					message = $LIB.story[story].message[$LIB.map[map].surface[map2].message];
				}
			}
			
			//chara
//			alert(map_cell.map_flg);
			if(!message && map_cell!=null && map_cell.map_flg && $LIB.story[$LIB.game.data.story].subchara[map_cell.map_flg] && $LIB.story[$LIB.game.data.story].subchara[map_cell.map_flg].message){
				
				message = $LIB.story[$LIB.game.data.story].message[$LIB.story[$LIB.game.data.story].subchara[map_cell.map_flg].message];
				//flg
				$LIB.game.data.message = map_cell.map_flg;
				//course
				var sc1 = document.getElementById("subchara_"+map_cell.map_flg);
				if(sc1!=null){
					var sc2 = sc1.getElementsByTagName("img")
					if(sc2.length){
						var type = $LIB.story[$LIB.game.data.story].subchara[map_cell.map_flg].type;
						//方向確定
						var num = $LIB.game.message.course({x:x,y:y} , {x:pos.x,y:pos.y});
						//画像変更（振り向き）
						sc2[0].src = "chara/"+type+"/"+$LIB.chara[type].img[$LIB.chara[type].anm[num][0]];
					}
				}
			}
			
			return message;
			
		},
		//振り向き用
		course:function(chara,subchara){
			//右上
			if(chara.x==subchara.x && chara.y+1==subchara.y){return 1}
			//右下
			if(chara.x-1==subchara.x && chara.y==subchara.y){return 2}
			//左下
			if(chara.x==subchara.x && chara.y-1==subchara.y){return 3}
			//左上
			if(chara.x+1==subchara.x && chara.y==subchara.y){return 4}
			return 1;
		},
		view:function(){
			
			if($LIB.game.message.anm_flg==1){
				return;
			}
			
			if(document.getElementById($LIB.game.message.id)!=null){
				$LIB.game.message.del();
			}
			
			var chr = document.getElementById("chara_"+$LIB.game.data.chara);
			var message = $LIB.game.message.check(chr.pos.x , chr.pos.y , chr.course);
			if(!message){return}
			
			var margin = 8;
			var border = 6;
			var size ={
				x:document.body.offsetWidth,
				y:document.body.offsetHeight
			};
			
			var d=document.createElement("div");
			d.id=$LIB.game.message.id;
			d.className = "message";
			d.style.setProperty("margin",margin+"px","important");
			d.style.setProperty("border",border+"px double #888","important");
			d.style.setProperty("width",size.x - (margin*2)-(border*2) +"px","important");
			
			var html = "";
			html += "<div class='message_value' id='"+d.id+".value'></div>";
			
			d.innerHTML=html;
			if(chr){
				document.body.appendChild(d);
			}
			if($LIB.game.message.anm_flg!=1){
				$LIB.game.message.anm_flg=1;
//				$LIB.game.message.anm(0,message);
				setTimeout("$LIB.game.message.anm(0,'"+message+"')",300);
			}
		},
		//文字表示アニメ
		anm:function(step,message){
			var e = document.getElementById($LIB.game.message.id+".value");
			if(e==null){return}
			
			step++;
			var val = message.substr(0,step);
			//br処理
			if(val.match(/<$/)){
				var reg = new RegExp("^"+val+"br>");
				if(message.match(reg)){
					step+=3;
					var val = message.substr(0,step);
				}
			}
			
			e.innerHTML = val;
			
			
			if(message.length > step){
				setTimeout("$LIB.game.message.anm("+step+",'"+message+"')" ,100);
			}
			else{
				$LIB.game.message.anm_flg=0;
			}
		},
		//フキダシ削除
		del:function(){
			if(typeof($LIB.game.data.message)!="undefined"){
				delete $LIB.game.data.message;
			}
			
			var e = document.getElementById($LIB.game.message.id);
			
			if(e!=null){
				e.parentNode.removeChild(e);
			}
			$LIB.game.message.anm_flg=0;
			
		}
	},
	
	//サブキャラの動作
	subchara:{
		interval:function(){
			if(typeof($LIB.map)=='undefined' || typeof($LIB.story[$LIB.game.data.story].subchara)=='undefined'){return}
			
			for(var i in $LIB.story[$LIB.game.data.story].subchara){
				if(i==$LIB.game.data.message){continue}
				
				var id = "subchara_"+i;
				var e = document.getElementById(id);
				var sub = $LIB.story[$LIB.game.data.story].subchara[i];
				
				if(e==null){continue}
				if(e.move_flg){continue}
				
				//進行ロジックチェック
				var move = "random";
				if(typeof(sub.move)!="undefined"){
					move = sub.move;
				}
				
//				alert(i+"/"+move);
				
				
//				if(typeof(e.next)!='undefined'){alert(e.next.x+"/"+e.next.y);continue}
				
	//			if(Math.random()>0.05){continue}
	//			e.move_flg = parseInt(Math.random()*3)+1;
				
				//通常 random
				if(move=="random"){
					if(Math.random()>0.15){continue}
					e.move_flg = parseInt(Math.random()*3)+1;
				}
				//指定間移動（２点）
				else if(move=="trans"){
					
					//移動positionリスト作成(初回のみ)
					if(typeof(sub.trans_list)=="undefined"){
						sub.trans_list=[];
						for(var pos in sub.trans){
							sub.trans_list.push(sub.trans[pos]);
						}
						sub.trans_list.push(e.pos);
					}
					//移動後処理
					else if(sub.trans_list.length && sub.trans_list[0].x == e.pos.x && sub.trans_list[0].y == e.pos.y){
						//先頭データを最後に移動
						sub.trans_list.push(sub.trans_list[0]);
						sub.trans_list.shift();
					}
					//現在位置から次位置の方向取得
					e.move_flg = $LIB.game.move.course(e.pos , sub.trans_list[0]);
					
					/*
					if(!e.pos_list){
						e.pos_list=[e.pos];
						for(var pos in sub.trans){
							e.pos_list[e.pos_list.length] = sub.trans[pos];
						}
					}
					*/
					
//					//現在positionフラグ
//					if(!e.trans_flg){
//						e.trans_flg="go";
//					}
					
					/*
					//２点間補正※
					var course = $LIB.game.between(e.pos , sub.trans['0']);
					
					
					//方向決定
					if(e.pos.y == sub.trans[0].y){
						e.move_flg = 1;
					}
					else{
						e.move_flg = 3;
					}
					*/
//					e.trans_flg= "";
					
				}
				
				if(typeof(e.move_flg)=="undefined"){continue}
				
				
				var next = $LIB.game.chara.course(e.move_flg);
				e.course = e.move_flg;
				e.next = {
					x:e.pos.x + next.x,
					y:e.pos.y + next.y
				};
				
//				alert(id+"/"+i);
//				setTimeout("$LIB.game.chara.moving(0,'"+id+"','"+i+"');", 1000);
				if($LIB.game.chara.move_check(id,e.chara, e.next.x, e.next.y) && typeof($LIB.chara[e.chara].anm[e.move_flg])!='undefined'){
					
//					alert(e.chara+"/"+e.move_flg);
					var img_num = $LIB.chara[e.chara].anm[e.move_flg][0];
					e.getElementsByTagName("img")[0].src= "chara/"+e.chara+"/"+$LIB.chara[e.chara].img[img_num];
					e.move_flg = 0;
					delete e.next;
					
				}
				else{
					//map-flg
					document.getElementById("map_id_"+e.pos.x+"_"+e.pos.y).map_flg=0;
					document.getElementById("map_id_"+e.next.x+"_"+e.next.y).map_flg=i;
					//
					setTimeout("$LIB.game.chara.moving(0,'"+id+"','"+e.chara+"');", 0);
				}
				
			}
			setTimeout($LIB.game.subchara.interval,$LIB.game.data.once *2);
		}
	},
	//始点から終点に向かう際の次の一歩の方向を返す（コース、距離、パターン）
	between:function(pos1,pos2){
//		alert(pos1.x+"/"+pos1.y+" : "+pos2.x+"/"+pos2.y);
		
		//pos1の周辺チェック
		var pos = [];
//		var y = [pos1.y];
		
		//最短距離
//		var x = pos2.x - pos1.x;
//		var y = pos2.y - pos1.y;
		
		
		// X
		var x = pos1.x;
		for(var i=0;i<Math.abs(pos2.x - pos1.x);i++){
			//→方向
			if(pos2.x - pos1.x>0){
				x=pos1.x+(i+1);
			}
			//←方向
			else{
				x=pos1.x-(i+1);
			}
			pos[pos.length] = {x:x,y:pos1.y};
			
		}
		//Y
		var y = pos1.y;
		for(var j=0;j<Math.abs(pos2.y - pos1.y);j++){
			//↓方向
			if(pos2.y - pos1.y>0){
				y=pos1.y+(j+1);
			}
			//↑方向
			else{
				y=pos1.y-(j+1);
			}
			pos[pos.length] = {x:x,y:y};
		}
		
		alert(pos.join(","));
		
		return pos;
		
		//右周り
		
		
		//左回り
		
		
		
	},
	
	//move
	move:{
		//始点と終点から方向を取得
		course:function(pos1,pos2){
			//↑
			if(pos1.y > pos2.y){
				return 1;
			}
			//↓
			else if(pos1.y < pos2.y){
				return 3;
			}
			//→
			else if(pos1.x < pos2.x){
				return 2;
			}
			//←
			else if(pos1.x > pos2.x){
				return 4;
			}
		}
	},
	
	$:0
};





/*
//URL分解
$LIB.game.data.href  = location.href.split("?");
$LIB.game.data.query = {};
if($LIB.game.data.href.length>1){
	var query = $LIB.game.data.href[1].split("&");
	for(var i=0;i<query.length;i++){
		var sp = query[i].split("=");
		$LIB.game.data.query[sp[0]]=sp[1];
	}
	
}
//起動コマンド※クエリがない場合
if($LIB.game.data.href.length==1){
	$LIB.game.set("test");
}

//EDITモード
else if($LIB.game.data.query['mode']=="edit"){
//	$LIB.game.edit();
	$LIB.event.add(window,"load",$LIB.game.edit);
}
*/
