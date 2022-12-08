!(function(){
	$$={};

	$$.data = {
		game:null,
		key :null
	};
	$$.datas = [];

	$$.targetElm = null;

	$$.__construct = function(){

		// numberplace
		$$.data.game = document.getElementById("game");
		if($$.data.game===null){return}

		var table  = $$.getNumberPlace();
		if(table.className !== "numberplace"){return}

		$$.setClassName(table);
		$$.setInputEvent(table);


		// key
		$$.data.key = document.getElementById("key");
		if(key===null){return}

		var keyTables = $$.data.key.getElementsByTagName("table");
		if(!keyTables.length){return}

		$$.setKeyEvent(keyTables[0]);

		// Button
		$$.setButtonLoad();
		$$.setButtonSave();
		$$.setButtonProgramSave();
		$$.setButtonProgramLoad();
		$$.setButtonClear();
		$$.setButtonFinish();
		$$.setButtonSolve();

		//load-sample
		$$.loadSample();
		//$$.getCache();
	};

	$$.setClassName = function(table){

		//cells
		var td = table.getElementsByTagName("td");

		// set-array
		for(var i=0; i<td.length; i++){
			td[i].setAttribute("data-num" , i);
			var classes = [];
			var row = parseInt(i/9 , 10);
			classes.push("row-" + row);
			var col = (i%9);
			classes.push("col-" + col);
			var box = Number(parseInt(i/27)*3 ,10) + Number(parseInt(parseInt(i%9 ,10)/3 ,10));
			classes.push("box-" + box);
			td[i].className = classes.join(" ");
			td[i].setAttribute("data-row" , row);
			td[i].setAttribute("data-col" , col);
			td[i].setAttribute("data-box" , box);
		}
	};



	// Button
	$$.setButtonClear = function(){
		var elm = document.getElementById("clear");
		if(elm===null){return}
		elm.onclick = function(){
			$$.clearPazzle();
		};
	};
	$$.setButtonLoad = function(){
		var elm = document.getElementById("load");
		if(elm===null){return}
		elm.onclick = function(){
			//$$.setLoad();
			$$.getCache();
		};
	};
	$$.setButtonSave = function(){
		var elm = document.getElementById("save");
		if(elm===null){return}
		elm.onclick = function(){
			$$.setSave();
		};
	};
	$$.setButtonProgramSave = function(){
		var elm = document.getElementById("programSave");
		if(elm===null){return}
		elm.onclick = function(){
			$$.setProgramSave();
		};
	};
	$$.setButtonProgramLoad = function(){
		var elm = document.getElementById("programLoad");
		if(elm===null){return}
		elm.onclick = function(){
			$$.setProgramLoad();
		};
	};



	$$.clearPazzle = function(){
		var table  = $$.getNumberPlace();
		var td     = table.getElementsByTagName("td");

		for(var i=0; i<td.length; i++){
			td[i].innerHTML = "";
			td[i].setAttribute("data-enable" , "");
		}
	};
	$$.setComplete = function(){
		var table  = $$.getNumberPlace();
		var td     = table.getElementsByTagName("td");

		for(var i=0; i<td.length; i++){
			td[i].setAttribute("data-enable" , "complete");
		}
	};




	$$.setSave = function(){
		var table  = $$.getNumberPlace();
		var td = table.getElementsByTagName("td");
		var data = [];
		var emptyFlg = 0;
		for(var i=0; i<td.length; i++){
			var num = td[i].innerHTML;
			if(num === ""){
				data[i] = "-";
			}
			else{
				data[i] = Number(num);
			}
			if(td[i].innerHTML!==""){emptyFlg++;}
		}

		if(emptyFlg > 0){
			var str = $$.getSave_arr2str(data);
			localStorage.setItem("numberplace", str);
		}
		else{
			localStorage.removeItem("numberplace");
		}
	};

	$$.setProgramSave = function(){
		var table  = $$.getNumberPlace();
		var td = table.getElementsByTagName("td");
		var data = [];
		var emptyFlg = 0;
		for(var i=0; i<td.length; i++){
			var num = td[i].innerHTML;
			if(num === ""){
				data[i] = "-";
			}
			else{
				data[i] = Number(num);
			}

			if(td[i].innerHTML!==""){emptyFlg++;}
		}

		if(emptyFlg > 0){
			var str = $$.getSave_arr2str(data);
			localStorage.setItem("numberplace_program", str);
		}
		else{
			localStorage.removeItem("numberplace_program");
		}
	};
	$$.setProgramLoad = function(){
		var table  = $$.getNumberPlace();
		var td = table.getElementsByTagName("td");
		var ls = localStorage.getItem("numberplace_program");
		if(!ls){return}
		var data = $$.getSave_str2arr(ls);
		for(var i=0; i<td.length; i++){
			//if(!data[i] || !data[i].match(/[1-9]/)){data[i] = ""}
			if(!data[i].toString().match(/[1-9]/)){data[i] = ""}
			td[i].innerHTML = data[i];
		}
	};


	$$.getCache = function(){
		var table  = $$.getNumberPlace();
		var td = table.getElementsByTagName("td");
		var ls = localStorage.getItem("numberplace");
		if(!ls){return}
		var data = $$.getSave_str2arr(ls);
		for(var i=0; i<td.length; i++){
			// if(data[i] === 0){data[i] = ""}
			// if(data[i] === "-"){data[i] = ""}
			if(!data[i].toString().match(/[1-9]/)){data[i] = ""}
			td[i].innerHTML = data[i];
		}
	};
	$$.getProgramData = function(){
		var ls = localStorage.getItem("numberplace_program");
		if(!ls){return ""}
		return $$.getSave_str2arr(ls);
	};

	/**
	* LocalStorage-Save Value
	* condition : Numeric (1-digit)
	*/
	$$.getSave_arr2str = function(arr){
		var str="";
		for(var i=0; i<arr.length; i++){
			str += arr[i].toString();
		}
		return str;
	};
	$$.getSave_str2arr = function(str){
		str = str.replace(/\"/g , '');
		var arr=[];
		for(var i=0; i<str.length; i++){
			arr.push(Number(str.charAt(i)));
		}
		return arr;
	};

	$$.loadSample = function(){
		$$LIB.ajax.set({
			url:"./data/sample.json",
			method:"GET",
			async:"true",
			//type:"text/javascript",
			//query:{},
			onSuccess:function(res){
				if(!res){return}
				var json = JSON.parse(res);
				var lists = document.getElementById("lists");
				for(var i=0; i<json.length; i++){
					var li = document.createElement("li");
					li.innerHTML = json[i].name;
					li.setAttribute("data-np" , json[i].data);
					li.onclick = $$.clickDataLists;
					lists.appendChild(li);
				}
			}
		});
	};
	$$.clickDataLists = function(event){
		var elm = event.target;
		var data = elm.getAttribute("data-np");
		if(!data){return}
		$$.setData_list2view(data);
	}

	$$.setData_list2view = function(data_np){
		if(!data_np){return}
		var table  = $$.getNumberPlace();
		var td = table.getElementsByTagName("td");
		var data = $$.getSave_str2arr(data_np);
		for(var i=0; i<td.length; i++){
			if(data[i].toString().match(/[1-9]/)){
				td[i].innerHTML = data[i];
				td[i].setAttribute("data-enable","false");
			}
			else{
				td[i].innerHTML = "";
				td[i].setAttribute("data-enable","true");
			}

		}
		// cache
		localStorage.setItem("numberplace_program" , data_np);
	};

	/**
	* Input
	*/
	$$.setInputEvent = function(table){
		var td = table.getElementsByTagName("td");
		for(var i=0; i<td.length; i++){
			td[i].onclick = $$.viewKeyElement;
		}
	};

	$$.viewKeyElement = function(event){
		var elm = event.target;
		if(elm.getAttribute("data-enable") === "false"){return}
		$$.setCellsColorOn(elm);
		$$.targetElm = elm;

		var key = document.getElementById("key");
		$$.setKeyPosition(key , elm);
	};
	$$.setKeyPosition = function(key , elm){

		var win = $$LIB.getWindowSize();
		var pos = $$LIB.getPos(elm);

		if(pos.x < win.x/2){
			key.style.setProperty("right","0","");
			key.style.setProperty("left","auto","");
		}
		else{
			key.style.setProperty("right","auto","");
			key.style.setProperty("left","16px","");
		}

		key.style.setProperty("display","block","");
	};

	$$.setKeyEvent = function(table){
		var td = table.getElementsByTagName("td");
		for(var i=0; i<td.length; i++){
			td[i].onclick = $$.clickKey;
		}
	};

	$$.clickKey = function(event){

		if($$.targetElm === null){return}
		//$$.cancelSolveError();
		$$.cancelPazzleCheck();

		var elm = event.target;
		var key = document.getElementById("key");
		key.style.setProperty("display","none","");
		$$.targetElm.innerHTML = elm.getAttribute("data-key");
		$$.setCellsColorOff($$.targetElm);
		$$.targetElm = null;
	};

	$$.setCellsColorOn = function(elm){
		if($$.targetElm !== null){
			$$.setCellsColorOff($$.targetElm);
		}

		// cross
		var row = elm.getAttribute("data-row");
		var rows = $$.data.game.getElementsByClassName("row-"+row);
		for(var i=0; i<rows.length; i++){
			if(rows[i].getAttribute("data-enable") === "false"){continue}
			if(rows[i] === elm){continue}
			rows[i].setAttribute("data-enable" , "active");
		}
		var col = elm.getAttribute("data-col");
		var cols = $$.data.game.getElementsByClassName("col-"+col);
		for(var i=0; i<cols.length; i++){
			if(cols[i].getAttribute("data-enable") === "false"){continue}
			if(cols[i] === elm){continue}
			cols[i].setAttribute("data-enable" , "active");
		}

		//target
		elm.setAttribute("data-enable" , "target");
	};
	$$.setCellsColorOff = function(elm){

		//cross + target
		var row = elm.getAttribute("data-row");
		var rows = $$.data.game.getElementsByClassName("row-"+row);
		for(var i=0; i<rows.length; i++){
			if(rows[i].getAttribute("data-enable") === "false"){continue}
			if(rows[i] === elm){continue}
			rows[i].setAttribute("data-enable" , "true");
		}
		var col = elm.getAttribute("data-col");
		var cols = $$.data.game.getElementsByClassName("col-"+col);
		for(var i=0; i<cols.length; i++){
			if(cols[i].getAttribute("data-enable") === "false"){continue}
			if(cols[i] === elm){continue}
			cols[i].setAttribute("data-enable" , "true");
		}
		//target
		elm.setAttribute("data-enable" , "true");
	};

	/**
	* Finish
	*/
	$$.setButtonFinish = function(){
		var elm = document.getElementById("finish");
		if(elm===null){return}
		elm.onclick = function(){
			if(!$$.checkPazzle()){
				$$.setComplete();
				//alert("complete");
			}
			else{
				//alert("not fix");
				//$$.checkSolve();
			}
		};
	};

	// return error-count
	$$.checkPazzle = function(){
		var table  = $$.getNumberPlace();

		//flg
		var flg = 0;

		for(var i=0; i<9; i++){
			//check-row
			var rows = table.getElementsByClassName("row-"+i);
			var arrRow = [];
			for(var j=0; j<rows.length; j++){
				if(rows[i].getAttribute("data-enable") === "false"){continue}
				var num = rows[j].innerHTML;
				if(num===""){
					flg++;
					continue;
				}
				if(arrRow.indexOf(num)!==-1){
					flg++;
				}
				arrRow.push(num);
			}
			//overlap
			arrRow = arrRow.filter(function (x, i, self) {
				return self.indexOf(x) === i && i !== self.lastIndexOf(x);
			});
			for(var j=0; j<rows.length; j++){
				var val = rows[j].innerHTML;
				if(val === ""){
					rows[j].setAttribute("data-enable" , "bad");
				}
				else if(arrRow.indexOf(val) != -1){
					rows[j].setAttribute("data-enable" , "bad");
				}
			}


			//check-col
			var cols = table.getElementsByClassName("col-"+i);
			var arrCol = [];
			for(var j=0; j<cols.length; j++){
				if(cols[i].getAttribute("data-enable") === "false"){continue}
				var num = cols[j].innerHTML;
				if(num===""){
					flg++;
					continue;
				}
				if(arrCol.indexOf(num)!==-1){
					flg++;
				}
				arrCol.push(num);
			}
			//overlap
			arrCol = arrCol.filter(function (x, i, self) {
				return self.indexOf(x) === i && i !== self.lastIndexOf(x);
			});
			for(var j=0; j<cols.length; j++){
				var val = cols[j].innerHTML;
				if(val === ""){
					cols[j].setAttribute("data-enable" , "bad");
				}
				else if(arrCol.indexOf(val) !== -1){
					cols[j].setAttribute("data-enable" , "bad");
				}
			}


			//check-box
			var boxs = table.getElementsByClassName("box-"+i);
			var arrBox = [];
			for(var j=0; j<boxs.length; j++){
				if(boxs[i].getAttribute("data-enable") === "false"){continue}
				var num = boxs[j].innerHTML;
				if(num===""){
					flg++;
					continue;
				}
				if(arrBox.indexOf(num)!==-1){
					flg++;
				}
				arrBox.push(num);
			}
			//overlap
			arrBox = arrBox.filter(function (x, i, self) {
				return self.indexOf(x) === i && i !== self.lastIndexOf(x);
			});
			for(var j=0; j<boxs.length; j++){
				var val = boxs[j].innerHTML;
				if(val === ""){
					boxs[j].setAttribute("data-enable" , "bad");
				}
				else if(arrBox.indexOf(val) !== -1){
					boxs[j].setAttribute("data-enable" , "bad");
				}
			}

		}

		return flg;
	};
	$$.clearEnable = function(){
		var table = $$.getNumberPlace();
		var td    = table.getElementsByTagName("td");
		for(var i=0; i<td.length; i++){
			if(td[i].getAttribute("data-enable") === "bad"){
				td[i].removeAttribute("data-enable");
			}
		}
	};
	$$.cancelPazzleCheck = function(){
		var table  = $$.getNumberPlace();
		var td     = table.getElementsByTagName("td");
		for(var i=0; i<td.length; i++){
			if(td[i].getAttribute("data-enable")!==null){
				td[i].removeAttribute("data-enable");
			}
		}
	};




	/**
	* Solve
	*/
	$$.setButtonSolve = function(){
		var elm = document.getElementById("solve");
		elm.onclick = $$.solve.action;
	};
	$$.solve = {
		action:function(){
			// Empty-Check
			if($$.solve.checkAllEmpty()===true){
				alert("All empty !!!");
				return false;
			}

			// First-set
			$$.solve.setDataTemp();

			// Loop-Check
			var cnt = 0;
			cnt += $$.solve.loop(1);
			//$$.solve.debugDataView();
			if(!$$.checkPazzle()){
				console.log("level1 :" + cnt );
				$$.setComplete();
				return;
			}

			// loop2
			cnt += $$.solve.loop2(1);
			if(!$$.checkPazzle()){
				console.log("level2 :" + cnt );
				$$.setComplete();
				return;
			}

		},

		// Inition-only
		setDataTemp:function(){
			var table  = $$.getNumberPlace();
			var td     = table.getElementsByTagName("td");

			// set 9.length
			for(var i=0; i<td.length; i++){
				if(td.innerHTML !== ""){
					td[i].setAttribute("data-temp","123456789");
				}
			}
			// temp-data-remove
			$$.solve.checkFirstAll();
		},
		checkAllEmpty:function(){
			var table  = $$.getNumberPlace();
			var td     = table.getElementsByTagName("td");
			var empty  = 0;
			for(var i=0; i<td.length; i++){
				if(td[i].innerHTML!==""){empty++}
			}
			if(empty===0){return true}else{return false}
		},
		loop:function(num){
			if(!num){num=0}
			while($$.solve.check()!==0){
				num++;
			}
			return num;
		},
		loop2:function(num){
			if(!num){num=0}
			while($$.solve.check2()!==0){
				num++;
			}
			//console.log(num);
			return num;
		},
		check:function(){
			$$.solve.checkFirstAll();
			$$.solve.checkUniqueGroupAll();

			$$.solve.setTitle_dataTemp();
			var cnt = $$.solve.checkUnique();

			// remove
			$$.solve.rmCellDataCheck("row");
			$$.solve.rmCellDataCheck("col");
			$$.solve.rmCellDataCheck("box");

			return cnt;
		},
		check2:function(){
			$$.clearEnable();
			$$.solve.checkSecond();
			$$.solve.checkUniqueGroupAll();
			//$$.selve.setDataTempAdjust();
			$$.solve.setTitle_dataTemp();
			var cnt = 0;
			cnt += $$.solve.checkUnique();
			// remove
			$$.solve.rmCellDataCheck("row");
			$$.solve.rmCellDataCheck("col");
			$$.solve.rmCellDataCheck("box");

			if(cnt === 0){
				cnt += $$.solve.check3();
				// remove
				$$.solve.rmCellDataCheck("row");
				$$.solve.rmCellDataCheck("col");
				$$.solve.rmCellDataCheck("box");
			}
			return cnt;
		},
		check3:function(){
			$$.clearEnable();
			$$.solve.checkThird();
			$$.solve.checkUniqueGroupAll();
			$$.solve.setTitle_dataTemp();
			var cnt = 0;
			cnt += $$.solve.checkUnique();
			// remove
			$$.solve.rmCellDataCheck("row");
			$$.solve.rmCellDataCheck("col");
			$$.solve.rmCellDataCheck("box");
			return cnt;
		},
		rmCellDataCheck:function(key){
			var table  = $$.getNumberPlace();

			// blocks
			for(var cellNum=0;cellNum<9;cellNum++){
				var cell = table.getElementsByClassName(key+"-"+cellNum);
				// get number
				var numbers = [];
				for(var j=0; j<cell.length; j++){
					var num = cell[j].innerHTML;
					if(num !== ""){
						numbers.push(num);
					}
				}
				// remove number to data-check
				for(var j=0; j<cell.length; j++){
					if(cell[j].getAttribute("data-temp") == null){continue}
					else if(cell[j].innerHTML != "" && cell[j].getAttribute("data-temp")!==null){
						cell[j].removeAttribute("data-temp");
						cell[j].removeAttribute("title");
					}
					else{
						var checkNum = cell[j].getAttribute("data-temp");
						for(var k=0; k<numbers.length; k++){
							checkNum = checkNum.replace(numbers[k] , "");
						}
						cell[j].setAttribute("data-temp" , checkNum);
						cell[j].setAttribute("title"     , checkNum);
					}
				}
			}
		},

		checkFirstAll:function(){
			$$.solve.checkFirst("row");
			$$.solve.checkFirst("col");
			$$.solve.checkFirst("box");
		},
		checkFirst:function(key){
			for(var i=0; i<9; i++){
				var tempValues = $$.solve.getGroupValues(key,i);
				$$.solve.setTemp(key,i,tempValues);
			}
		},
		// boxを基準にrowとcolの3blockずつのいらない数値削除
		checkSecond:function(){
			var table  = $$.getNumberPlace();
			var row = [
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""]];
			var col = [
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""]];
			var uniqueRow = [];
			var uniqueCol = [];
			//getTemp
			for(var i=0; i<9; i++){
				var cells = table.getElementsByClassName("box-"+i);
				for(var j=0; j<cells.length; j++){
					var temp = cells[j].getAttribute("data-temp");
					temp = (temp === null)?"":temp;
					//console.log(i+"="+(parseInt(j/3,10))+"/"+(j%3));
					row[i][(parseInt(j/3,10))] += temp;
					col[i][j%3] += temp;
				}
			}
			//Unique-str
			for(var i=0; i<9; i++){
				for(var j=0; j<3; j++){
					row[i][j] = $$.getStrUnique(row[i][j]);
					col[i][j] = $$.getStrUnique(col[i][j]);
				}
			}
			//Unique-block
			for(var i=0; i<9; i++){
				uniqueRow[i] = $$.getArrayUnique(row[i]);
				uniqueCol[i] = $$.getArrayUnique(col[i]);
			}
		},
		//box単位の不要数値検出
		checkThird:function(){
			var table  = $$.getNumberPlace();
			var row = [
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""]];
			var col = [
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""],
				["","",""],["","",""],["","",""]];
			var uniqueRow = [];
			var uniqueCol = [];
			//getTemp
			for(var i=0; i<9; i++){
				var cells = table.getElementsByClassName("box-"+i);
				for(var j=0; j<cells.length; j++){
					var temp = cells[j].getAttribute("data-temp");
					temp = (temp === null)?"":temp;
					row[i][(parseInt(j/3,10))] += temp;
					col[i][j%3] += temp;
				}
			}
			//Unique-str
			for(var i=0; i<9; i++){
				for(var j=0; j<3; j++){
					row[i][j] = $$.getStrUnique(row[i][j]);
					col[i][j] = $$.getStrUnique(col[i][j]);
				}
			}
			//Unique-block
			for(var i=0; i<9; i++){
				uniqueRow[i] = $$.getArrayUnique(row[i]);
				uniqueCol[i] = $$.getArrayUnique(col[i]);
			}
			// console.log("row2 : "+JSON.stringify(uniqueRow));
			// console.log("col2 : "+JSON.stringify(uniqueCol));

			//Delete-other-block
			for(var x=0; x<9; x++){
				for(var y=0; y<3; y++){
					$$.solve.removeDataTempRow(uniqueRow[x][y],x,y);
					$$.solve.removeDataTempCol(uniqueCol[x][y],x,y);
				}
			}
		},
		// Box -> row|col
		removeDataTempRow:function(str,x,y){
			if(str===""){return}
			var table = $$.getNumberPlace();
			var cells = table.getElementsByClassName("row"+"-"+ (parseInt(x/3,10) *3 +y));
			var from  = (x%3*3);
			var to    = (x%3*3)+3;
			for(var i=0; i<cells.length; i++){
				if(from<=i && i<to){continue}
				$$.solve.setSharpen(cells[i],str);
			}
			// Multi Cells Check
			if(str.length>1){
				var blankCellsCount = $$.solve.getBlankCellsCountRow(x,y);
				if(blankCellsCount === str.length){
					$$.solve.removeDataTempMultiRow(x,y,str);
				}
			}
		},
		// [x:box y:box-line]
		removeDataTempCol:function(str,x,y){
			if(str===""){return}
			var table = $$.getNumberPlace();
			var cells = table.getElementsByClassName("col"+"-"+ (x%3*3 +y));
			var from  = (parseInt(x/3,10)*3);
			var to    = (parseInt(x/3,10)*3)+3;
			for(var i=0; i<cells.length; i++){
				if(from<=i && i<to){continue}
				$$.solve.setSharpen(cells[i],str);
			}
			// Multi Cells Check
			if(str.length>1){
				var blankCellsCount = $$.solve.getBlankCellsCountCol(x,y);
				if(blankCellsCount === str.length){
					$$.solve.removeDataTempMultiCol(x,y,str);
				}
			}
		},

		getBlankCellsCountRow:function(x,y){
			var num1 = (parseInt(x/3,10) *3 +y);
			var from = (x%3*3);
			var to   = (x%3*3)+3;
			var table = $$.getNumberPlace();
			var cells = table.getElementsByClassName("row"+"-"+ num1);
			var cnt   = 0;
			for(var i=0; i<cells.length; i++){
				if(from<=i && i<to){
					if(cells[i].innerHTML === ""){cnt++}
				}
			}
			return cnt;
		},

		getBlankCellsCountCol:function(x,y){
			var num1 = (x%3*3+y);
			var from = (parseInt(x/3,10)*3);
			var to   = (parseInt(x/3,10)*3)+3;
			var table = $$.getNumberPlace();
			var cells = table.getElementsByClassName("col"+"-"+ num1);
			var cnt   = 0;
			for(var i=0; i<cells.length; i++){
				if(from<=i && i<to){
					if(cells[i].innerHTML === ""){cnt++}
				}
			}
			return cnt;
		},

		removeDataTempMultiRow:function(x,y,str){
			var table = $$.getNumberPlace();
			var cells = table.getElementsByClassName("box"+"-"+x);
			for(var i=0; i<cells.length; i++){
				if(parseInt(i/3,10)==y){
					$$.solve.setExclusion(cells[i],str);
				}
				else{
					$$.solve.setSharpen(cells[i],str);
				}
			}
		},

		removeDataTempMultiCol:function(x,y,str){
			var table = $$.getNumberPlace();
			var cells = table.getElementsByClassName("box"+"-"+x);
			for(var i=0; i<cells.length; i++){
				if((i%3)==y){
					$$.solve.setExclusion(cells[i],str);
				}
				else{
					$$.solve.setSharpen(cells[i],str);
				}
			}
		},


		checkUniqueGroupAll:function(){
			$$.solve.checkUniqueGroup("row");
			$$.solve.checkUniqueGroup("col");
			$$.solve.checkUniqueGroup("box");
		},
		checkUniqueGroup:function(key){
			if(!key){return}
			var table = $$.getNumberPlace();
			// block別に処理
			for(var cnt=0; cnt<9; cnt++){
				var cells  = table.getElementsByClassName(key+"-"+cnt);
				// Search for single numerical value.(単一数字を探す)
				for(var num=1; num<=9; num++){
					var flg = 0;
					var elm = null;
					var targetValue = "";
					for(var i=0; i<cells.length; i++){
						if(cells[i].innerHTML!==""){continue}
						var tempValue = cells[i].getAttribute("data-temp");
						if(tempValue===null){continue}
						if(tempValue.indexOf(num)!==-1){
							flg++;
							elm = cells[i];
							targetValue = num;
						}
					}
					if(flg!==1 || elm===null || targetValue===""){continue}
					for(var i=0; i<cells.length; i++){
						if(cells[i].innerHTML!==""){continue}
						var tempValue = cells[i].getAttribute("data-temp");
						if(tempValue===null){continue}
						//対象elm
						if(cells[i]===elm){
							cells[i].setAttribute("data-temp" , targetValue);
						}
						//周辺elm(row/col/box)
						else{
							var newValue = tempValue.replace(targetValue,"");
							cells[i].setAttribute("data-temp" , newValue);
						}
					}
				}
			}
		},
		checkUnique:function(){
			var cnt   = 0;
			var table = $$.getNumberPlace();
			var td    = table.getElementsByTagName("td");
			for(var i=0; i<td.length; i++){
				if(td[i].innerHTML!==""){continue}
				var temp = td[i].getAttribute("data-temp");
				if(temp === null){continue}
				if(temp && temp.length === 1){
					td[i].innerHTML = temp;
					td[i].removeAttribute("data-temp");
					td[i].removeAttribute("title");
					//console.log(temp+"/"+td[i].className);
					cnt++;
				}
			}
			return cnt;
		},
		getGroupValues:function(key,num){
			var table  = $$.getNumberPlace();
			var cells  = table.getElementsByClassName(key+"-"+num);
			var values = "";
			for(var i=0; i<cells.length; i++){
				var str = cells[i].innerHTML;
				if(!str){continue}
				values += str;
			}
			values = $$.getStrUnique(values);
			return values;
		},
		setTemp:function(key,num,values){
			var table  = $$.getNumberPlace();
			var cells  = table.getElementsByClassName(key+"-"+num);
			for(var i=0; i<cells.length; i++){
				var str = cells[i].innerHTML;
				if(str){
					$$.solve.removeElementTempData(cells[i]);
				}
				else{
					$$.solve.setSharpen(cells[i],values);
				}
			}
		},
		removeElementTempData:function(elm){
			elm.removeAttribute("data-temp");
		},
		setSharpen:function(elm,delValue){
			if(elm.innerHTML!==""){return}
			var currentValue = elm.getAttribute("data-temp");
			if(currentValue===null){return}
			var newValue = "";
			for(var i=0; i<currentValue.length; i++){
				var char = currentValue.charAt(i);
				if(delValue.indexOf(char)!==-1){continue}
				newValue += char;
			}
			newValue = $$.getStrUnique(newValue);
			//console.log(newValue+"/"+currentValue+"/"+delValue);
			elm.setAttribute("data-temp" , newValue);
		},
		setExclusion:function(elm,leaveValue){
			elm.setAttribute("data-temp" , leaveValue);
		},
		setTitle_dataTemp:function(){
			var table  = $$.getNumberPlace();
			var td = table.getElementsByTagName("td");
			for(var i=0;i<td.length; i++){
				var temp = td[i].getAttribute("data-temp");
				temp = (temp == null)?"":temp;
				td[i].title = temp;
			}
		},
		debugDataView:function(){
			var table  = $$.getNumberPlace();
			var td = table.getElementsByTagName("td");
			var arr=[];
			for(var i=0;i<td.length; i++){
				var temp = td[i].getAttribute("data-temp");
				temp = (temp == null)?"":temp;
				arr[i] = i+":"+temp;
			}
			console.log(JSON.stringify(arr));
		}
	};

	/**
	* Common
	*/
	$$.getNumberPlace = function(){
		var tables = $$.data.game.getElementsByTagName("table");
		return tables[0];
	};
	$$.getData = function(){
		var table  = $$.getNumberPlace();
		var td = table.getElementsByTagName("td");
		var data = [];
		for(var i=0; i<td.length; i++){
			var num = td[i].innerHTML;
			if(num === ""){
				data[i] = "-";
			}
			else{
				data[i] = Number(num);
			}
		}
		return $$.getSave_arr2str(data);
	};
	$$.getStrUnique = function(str){
		if(str==="" || str===null || str==="undefined" || typeof str !== "string"){return ""}
		var newStr=[];
		for(var i=0; i<str.length; i++){
			var char = str.charAt(i);
			if(newStr.indexOf(char)===-1){
				newStr.push(char);
			}
		}
		//sort
		newStr = newStr.sort(function(a,b){
			if( a < b ) return -1;
			if( a > b ) return 1;
			return 0;
		});
		return newStr.join("");
	};
	$$.getArrayUnique = function(arr){
		var unique = [];
		for(var i=0; i<arr.length; i++){
			unique[i] = "";
			if(arr[i]===""){continue}
			// currentStr
			var currentStr = arr[i];
			var otherStr   = (function(arr,num){
				var str = "";
				for(var i=0; i<arr.length; i++){
					if(num == i){continue}
					str += arr[i];
				}
				return str;
			})(arr,i);

			for(var j=0; j<currentStr.length; j++){
				//var flg = 0;
				var char = currentStr.charAt(j);
				if(otherStr.indexOf(char)==-1){
					unique[i] += char;
				}
			}
		}
		return unique;
	};

	$$.getRowStr = function(lineNumber){//console.log(lineNumber);
		var table = $$.getNumberPlace();
		var rows  = table.getElementsByClassName("row-"+lineNumber);
		var data  = "";
		for(var i=0; i<rows.length; i++){
			var str = rows[i].innerHTML;
			if(str!==""){data += str;}
		}
		return data;
	};


	$$LIB.eventAdd(window , "load" , $$.__construct);
})();
