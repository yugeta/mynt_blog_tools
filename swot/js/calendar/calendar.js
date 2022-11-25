;(function(){
  var $$ = function(){
    $$LIB.prototype.setEvent(window, "load", $$.prototype.start);
  };


  $$.prototype.start = function(){
    if(document.querySelector($$CALENDAR.prototype.option.table) === null){return;}

    var d = $$.prototype.getUrlDate();
    var data = (d === null)?{}:{date:{year:d.y,month:d.m,day:d.d}};
    new $$CALENDAR(data);
  };
  $$.prototype.getUrlDate = function(){
    var url = $$LIB.prototype.urlinfo();
    if(typeof url.query.date !== "undefined"){
      return {
        y:url.query.date.substr(0,4),
        m:url.query.date.substr(4,2),
        d:url.query.date.substr(6,2)
      };
    }
    else{
      return null;
    }
  };


  $$CALENDAR = function(option){
    this.setOption(option);
    this.option.calendar = document.querySelector(this.option.table);
    this.setYM(this.option.date);
    this.setDate();
    this.setEvent();
  };

  $$CALENDAR.prototype.option = {
    // custom
    date_disable:null,  // [null : all-date , after : before disable , before : after disable]

    calendar : null,
    table : ".calendar-table",
    year  : ".calendar-year",
    month : ".calendar-month",
    head  : ".calendar-head",
    title : ".calendar-title",
    week  : ".calendar-week",
    body  : ".calendar-body",
    prev  : ".calendar-table .calendar-title .prev",
    next  : ".calendar-table .calendar-title .next",
    date  : {
      year  : null,
      month : null,
      day   : null
    },
    click : function(){},
    $EOL:0
  };

  $$CALENDAR.prototype.setOption = function(option){
    for(var i in option){
      this.option[i] = option[i];
    }
  };

  $$CALENDAR.prototype.setYM = function(date){

    // alert(year+"/"+month);
    var d = new Date();
    date.year  = (date.year  === null)?d.getFullYear():date.year;
    date.month = (date.month === null)?d.getMonth()+1 :date.month;
    date.day   = (date.day   === null)?d.getDate()    :date.day;

    // this.option.date = {year:year.textContent , month:month.textContent , day:d.getDate()};

    this.option.calendar.querySelector(this.option.year).innerHTML  = date.year;
    this.option.calendar.querySelector(this.option.month).innerHTML = date.month;

    return this.option.date;
  };
  $$CALENDAR.prototype.getYM = function(){
    var y = $$CALENDAR.prototype.option.calendar.querySelector($$CALENDAR.prototype.option.year).textContent;
    var m = $$CALENDAR.prototype.option.calendar.querySelector($$CALENDAR.prototype.option.month).textContent;
    return {year:Number(y) , month:Number(m)};
  };

  $$CALENDAR.prototype.setDate = function(){
    var d = new Date();
    var year  = this.option.date.year;
    var month = this.option.date.month;
    var day   = this.option.date.day;

    var startDay  = new Date(year, month-1, 1).getDay();// その月の最初の日の曜日を取得
    var endDay    = new Date(year, month  , 0).getDay();// その月の最後の日の曜日を取得
    var endDate   = new Date(year, month  , 0).getDate();
    var textDate = 1; // 日付(これがカウントアップされます)
    var html =''; // テーブルのHTMLを格納する変数

    for (var row = 0; row < (endDate + startDay + (7-endDay-1))/7; row++){
      html += '<tr>';
      for (var col = 0; col < 7; col++) {
        if (row === 0 && col < startDay){
          html += "<td class='nil'>&nbsp;</td>";
        }
        else if (endDate < textDate) {
          html += "<td class='nil'>&nbsp;</td>";
        }
        else{
          var cls = (day == textDate)?"current":"date";
          // 当日より以後をDisable
          if($$CALENDAR.prototype.option.date_disable === "before"){
            cls = (new Date(year, month-1, textDate) > new Date(d.getFullYear(), d.getMonth(), d.getDate()))?"over":cls;
          }
          // 当日より以前をDisable
          else if($$CALENDAR.prototype.option.date_disable === "after"){
            cls = (new Date(year, month-1, textDate) < new Date(d.getFullYear(), d.getMonth(), d.getDate()))?"over":cls;
          }

          html += '<td class="'+cls+'">'+textDate+'</td>';
          textDate++;
        }
      }
      html += '</tr>';
    }
    this.option.calendar.querySelector(this.option.body).innerHTML = html;
  };

  $$CALENDAR.prototype.setEvent = function(){
    // month-move
    var prev = document.querySelector(this.option.prev);
    var next = document.querySelector(this.option.next);
    $$LIB.prototype.setEvent(prev, "click", $$CALENDAR.prototype.prevCalendar);
    $$LIB.prototype.setEvent(next, "click", $$CALENDAR.prototype.nextCalendar);
    // day-click
    var days = this.option.calendar.querySelectorAll(".date");
    for(var i=0; i<days.length; i++){
      $$LIB.prototype.setEvent(days[i], "click", $$CALENDAR.prototype.dayClick);
    }
  };

  $$CALENDAR.prototype.prevCalendar = function(){
    var d = $$CALENDAR.prototype.getYM();
    var y = d.year;
    var m = d.month-1;
    if(m <= 1){
      y -= 1;
      m  = 12;
    }
    new $$CALENDAR({date:{year:y,month:m,day:1}});
  };
  $$CALENDAR.prototype.nextCalendar = function(){
    var d = $$CALENDAR.prototype.getYM();
    var y = d.year;
    var m = d.month+1;
    if(m === 13){
      y += 1;
      m  = 1;
    }
    new $$CALENDAR({date:{year:y,month:m,day:1}});
  };

  $$CALENDAR.prototype.dayClick = function(e){
    var elm = e.target;
    var y = $$CALENDAR.prototype.option.date.year;
    var m = $$CALENDAR.prototype.numKeta($$CALENDAR.prototype.option.date.month);
    var d = $$CALENDAR.prototype.numKeta(elm.textContent);
    console.log(y+"/"+m+"/"+d);
    var url = $$LIB.prototype.urlinfo();
    var newQuery = [];
    for(var i in url.query){
      if(i === "date"){continue;}
      newQuery.push(i+"="+url.query[i]);
    }
    newQuery.push("date="+y+m+d);
    location.href = url.url+"?"+newQuery.join("&");
  }

  $$CALENDAR.prototype.numKeta = function(num){
    num = Number(num);
    if(num < 10){
      return "0" + num.toString();
    }
    else{
      return num;
    }
  };


  /* Library */

  var $$LIB = function(){};

  $$LIB.prototype.urlinfo = function(uri){
		if(!uri){uri = location.href;}
		var data={};
		//URLとクエリ分離分解;
		var query=[];
		if(uri.indexOf("?")!=-1){query = uri.split("?")}
		else if(uri.indexOf(";")!=-1){query = uri.split(";")}
		else{
			query[0] = uri;
			query[1] = '';
		}
		//基本情報取得;
		var sp = query[0].split("/");
		var data={
			url:query[0],
			dir:$$LIB.prototype.pathinfo(uri).dirname,
			domain:sp[2],
			protocol:sp[0].replace(":",""),
			query:(query[1])?(function(q){
				var data=[];
				var sp = q.split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(query[1]):[],
		};
		return data;
	};

	$$LIB.prototype.pathinfo = function(p){
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

  //ハイフン区切りを大文字に変換する。
	$$LIB.prototype.camelize = function(v){
		if(typeof(v)!='string'){return}
		return v.replace(/-([a-z])/g , function(m){return m.charAt(1).toUpperCase();});
	};

  // URL切り替え処理 [key , value , flg(before,*after)]
  $$LIB.prototype.setUrl = function(key,val,flg){
    var urlinfo = $$LIB.prototype.urlinfo();
    var query = [];
    if(flg==="before"){
      query.push(key + "=" + val);
    }
    for(var i in urlinfo.query){
      if(i !== key){
        query.push(i + "=" + urlinfo.query[i]);
      }
    }
    if(flg!=="before"){
      query.push(key + "=" + val);
    }
    history.pushState(null,null,urlinfo.url+"?"+query.join("&"));
  };

  $$LIB.prototype.number_format = function(num){
    num = num.toString();
    var tmpStr = "";
    while (num != (tmpStr = num.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){num = tmpStr;}
    return num;
  };

  $$LIB.prototype.setEvent = function(target, mode, func){
		//other Browser
		if (typeof target.addEventListener !== "undefined"){
      target.addEventListener(mode, func, false);
    }
    else if(typeof target.attachEvent !== "undefined"){
      target.attachEvent('on' + mode, function(){func.call(target , window.event)});
    }
		else{
      console.log(target);
      console.log("[warning] "+target);
    }
	};

  window.$$CALENDAR = $$CALENDAR;
  new $$;
})();
