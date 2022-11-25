;(function($w,$d){
  var $$ = function(){
    $$.prototype.setEvent($w,"DOMContentLoaded",$$.prototype.set);
  };

  $$.prototype.set = function(){

    // set-id
    document.forms["data-title"]["id"].value = (+ new Date());

    // input-event
    var fm = document.forms["data-swot"];
    var ev = "keyup";
    $$.prototype.setEvent(fm["strengths"]     , ev , $$.prototype.eventInput);
    $$.prototype.setEvent(fm["weaknesses"]    , ev , $$.prototype.eventInput);
    $$.prototype.setEvent(fm["opportunities"] , ev , $$.prototype.eventInput);
    $$.prototype.setEvent(fm["threats"]       , ev , $$.prototype.eventInput);

    // data-save
    document.getElementById("save").onclick = $$.prototype.dataSave;

    // data-clear
    document.getElementById("clear").onclick = $$.prototype.dataClear;

    // data-select
    $$.prototype.setDataSelect();
    document.forms["data-title"]["data-select"].onchange = $$.prototype.dataChange;
  };

  $$.prototype.eventInput = function(event){
    var elm = event.target;
    var name = elm.name;
    $$.prototype.setSwotContents(name , elm.value);
  };
  $$.prototype.setSwotContents = function(name,value){
    var target = document.querySelector("table.cross-swot th."+name+" div.swot-contents");
    if(target !== null){
      value = value.replace(/\n/g,"<br>");
      target.innerHTML = value;
    }
  };

  // Save
	$$.prototype.dataSave = function(){
    var f_title = document.forms["data-title"];
    var f_swot  = document.forms["data-swot"];
    var f_cross = document.forms["data-cross-swot"];
    var data_save = {};
    var data_value = {
      "title":f_title["swot-title"].value,
      "swot":{
        "s":f_swot["strengths"].value,
        "w":f_swot["weaknesses"].value,
        "o":f_swot["opportunities"].value,
        "t":f_swot["threats"].value
      },
      "cross":{
        "o_s":f_cross["o_s"].value,
        "o_w":f_cross["o_w"].value,
        "t_s":f_cross["t_s"].value,
        "t_w":f_cross["t_w"].value
      }
    };
    var data_storage = localStorage.getItem("swot");
    if(data_storage !== null){
      data_save = JSON.parse(data_storage);
    }
    data_save[f_title["id"].value] = data_value;

    // 空欄登録の場合、セータ削除
    if(f_title["swot-title"].value === ""
    && f_swot["strengths"].value === ""
    && f_swot["weaknesses"].value === ""
    && f_swot["opportunities"].value === ""
    && f_swot["threats"].value === ""
    && f_cross["o_s"].value === ""
    && f_cross["o_w"].value === ""
    && f_cross["t_s"].value === ""
    && f_cross["t_w"].value === ""){
      $$.prototype.removeStorageId(f_title["id"].value);
    }
    // 通常登録
    else{
      localStorage.setItem("swot" , JSON.stringify(data_save));

      $$.prototype.formAddSelect(f_title["data-select"] , f_title["id"].value , f_title["swot-title"].value);
      f_title["data-select"].value = f_title["id"].value;
    }
	};
  $$.prototype.setDataSelect = function(){
    var elm = document.forms["data-title"]["data-select"];
    var data_storage = localStorage.getItem("swot");
    if(data_storage === null){return;}
    var data = JSON.parse(data_storage);
    for(var i in data){
      $$.prototype.formAddSelect(elm , i , data[i]["title"]);
    }
  };
  $$.prototype.dataChange = function(event){
    var elm = event.target;
    var id  = elm.value;
    if(!id){
      $$.prototype.clearInputData();
      return;
    }
    var data_storage = localStorage.getItem("swot");
    if(data_storage === null){return;}
    var data = JSON.parse(data_storage);
    if(typeof data[id] === "undefined"){return;}
    $$.prototype.setInputData(data,id);
  };
  $$.prototype.setInputData = function(data,id){
    var f_title = document.forms["data-title"];
    f_title["id"].value = id;
    f_title["swot-title"].value = data[id]["title"];

    var f_swot  = document.forms["data-swot"];
    f_swot["strengths"].value     = data[id]["swot"]["s"];
    f_swot["weaknesses"].value    = data[id]["swot"]["w"];
    f_swot["opportunities"].value = data[id]["swot"]["o"];
    f_swot["threats"].value       = data[id]["swot"]["t"];

    $$.prototype.setSwotContents("strengths"     , data[id]["swot"]["s"]);
    $$.prototype.setSwotContents("weaknesses"    , data[id]["swot"]["w"]);
    $$.prototype.setSwotContents("opportunities" , data[id]["swot"]["o"]);
    $$.prototype.setSwotContents("threats"       , data[id]["swot"]["t"]);

    var f_cross = document.forms["data-cross-swot"];
    f_cross["o_s"].value = data[id]["cross"]["o_s"];
    f_cross["o_w"].value = data[id]["cross"]["o_w"];
    f_cross["t_s"].value = data[id]["cross"]["t_s"];
    f_cross["t_w"].value = data[id]["cross"]["t_w"];
  };
  $$.prototype.clearInputData = function(){
    var f_title = document.forms["data-title"];
    f_title["id"].value = (+new Date());
    f_title["swot-title"].value = "";

    var f_swot  = document.forms["data-swot"];
    f_swot["strengths"].value     = "";
    f_swot["weaknesses"].value    = "";
    f_swot["opportunities"].value = "";
    f_swot["threats"].value       = "";

    $$.prototype.setSwotContents("strengths"     , "");
    $$.prototype.setSwotContents("weaknesses"    , "");
    $$.prototype.setSwotContents("opportunities" , "");
    $$.prototype.setSwotContents("threats"       , "");

    var f_cross = document.forms["data-cross-swot"];
    f_cross["o_s"].value = "";
    f_cross["o_w"].value = "";
    f_cross["t_s"].value = "";
    f_cross["t_w"].value = "";
  };

  $$.prototype.dataClear = function(){
    if(!confirm("入力されているデータをクリアします。（保存されているデータは消えません）※空欄で保存すると、登録データが削除されます。")){return;}

    var f_title = document.forms["data-title"];
    // f_title["id"].value = (+new Date());
    f_title["swot-title"].value = "";

    var f_swot  = document.forms["data-swot"];
    f_swot["strengths"].value     = "";
    f_swot["weaknesses"].value    = "";
    f_swot["opportunities"].value = "";
    f_swot["threats"].value       = "";

    $$.prototype.setSwotContents("strengths"     , "");
    $$.prototype.setSwotContents("weaknesses"    , "");
    $$.prototype.setSwotContents("opportunities" , "");
    $$.prototype.setSwotContents("threats"       , "");

    var f_cross = document.forms["data-cross-swot"];
    f_cross["o_s"].value = "";
    f_cross["o_w"].value = "";
    f_cross["t_s"].value = "";
    f_cross["t_w"].value = "";

    alert("まだ保存されたデータは削除されていません。\n削除する場合は、このまま「"+ document.getElementById("save").textContent +"」を押してください。\n");
  };

  $$.prototype.removeStorageId = function(id){
    if(!id){return;}
    var data_storage = localStorage.getItem("swot");
    if(data_storage === null){return;}
    var json = JSON.parse(data_storage);
    if(typeof json[id] === "undefined"){return;}
    var txt = json[id]["title"];
    delete json[id];
    localStorage.setItem("swot" , JSON.stringify(json));
    // id-select項目の削除
    $$.prototype.formDelSelect(document.forms["data-title"]["data-select"] , id , txt);
  };


  $$.prototype.setEvent = function(target, mode, func){
		if (typeof target.addEventListener !== "undefined"){
      target.addEventListener(mode, func, false);
    }
    else if(typeof target.attachEvent !== "undefined"){
      target.attachEvent('on' + mode, function(){func.call(target , $w.event)});
    }
	};
  //select項目操作;
	$$.prototype.formAddSelect = function(e, val , txt , title){
		if(typeof(e)=='undefined' || e==null || !e){return}
		var num = e.length;
		//txt,val 設定;
		e.options[num] = new Option(txt , val);
		//title値;
		if(title){
			e.options[num].title = title;
		}
	};
  $$.prototype.formDelSelect = function(e, val , txt){
    if(typeof e === 'undefined' || e===null || !e){return}
    for(var i=e.options.length-1; i>=0; i--){
      if(e.options[i].value === val){
        e.removeChild(e.options[i]);
        alert("「"+txt+"」を削除しました。");
        break;
      }
    }
  };

  new $$;
})(window , document);
