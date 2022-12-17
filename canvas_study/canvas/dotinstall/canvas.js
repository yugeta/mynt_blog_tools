// window.onload=function(){
// 	draw();
// };
//
// function draw(){
// 	var canvas = document.getElementById("mycanvas");
// 	if(!canvas || !canvas.getContext){return false;}
// 	var ctx = canvas.getContext("2d");
//
// 	//square
// 	ctx.strokeRect(100,10,50,50);
// 	ctx.fillRect(10,10,50,50);
// 	ctx.clearRect(15,15,20,20);
// }


//描画するcanvasタグを選択
var ctx = document.getElementById("mycanvas").getContext("2d");

//四角形の枠線描画
ctx.strokeRect(10,10,40,40);

//四角形の塗りつぶし描画
ctx.fillRect(60,10,40,40);

//四角形の透明エリアを描画（既に描画されている上に追記する）
ctx.fillRect(110,10,60,60);
ctx.clearRect(120,20,40,40);


//丸型の枠線描画
ctx.beginPath();
ctx.arc(30,130,20, 0/180*Math.PI , 360/180*Math.PI);
ctx.stroke();

//丸型の塗りつぶし描画
ctx.beginPath();
ctx.arc(80,130,20, 0/180*Math.PI , 360/180*Math.PI);
ctx.fill();
