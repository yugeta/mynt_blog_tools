<html>
<head>
	<title>getInfomation</title>
	<style>
		h2{
			color:red;
		}
		h3{
			color:blue;
		}
	</style>
</head>
<body>

<h1>getInfomation</h1>

<hr>

<h2>PHP-Info ver2</h2>

<blockquote>

<h3>IP-Address</h3>
<?php echo $_SERVER['SERVER_ADDR']; ?>

<h3>Date</h3>
<?php echo date("Y")."/".date("m")."/".date("d")." ".date("H").":".date("i").":".date("s") ?>

<h3>URL</h3>
<?php
//通常のhttp処理
if($_SERVER['SERVER_PORT']==80){
	$site = 'http://'.$_SERVER['HTTP_HOST'];
}
//httpsページ処理
else if($_SERVER['SERVER_PORT']==443){
	$site = 'https://'.$_SERVER['HTTP_HOST'];
}
//その他ペート処理
else{
	$site = 'http://'.$_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'];
}
$site.= $_SERVER['SCRIPT_NAME'].(($_SERVER['QUERY_STRING'])?"?".$_SERVER['QUERY_STRING']:"");
//表示
echo $site;
?>

<h3>User-Agent</h3>
<?php echo $_SERVER['HTTP_USER_AGENT'] ;?>

<h3>Cookie</h3>
<?php
$data="";
foreach($COOKIE as $key=>$val){
	$data .= $key."=".$val."<br>"."¥n";
}
echo $data;
?>

<h3>Port</h3>
<?php echo $_SERVER['REMOTE_PORT'] ?>

<h3>Http-Accept</h3>
<?php echo $_SERVER['HTTP_ACCEPT_ENCODING'] ?>

<h3>Http-Accept-Encoding</h3>
<?php echo $_SERVER['HTTP_ACCEPT'] ?>

<h3>GATEWAY_INTERFACE</h3>
<?php echo $_SERVER['GATEWAY_INTERFACE'] ?>

<h3>SERVER_PROTOCOL</h3>
<?php echo $_SERVER['SERVER_PROTOCOL'] ?>

<!--
<h3>HOST-Name</h3>
<?php echo $_SERVER['SERVER_PROTOCOL'] ?>
-->

</blockquote>

<hr>

<h2>JavaScript-Info</h2>
<blockquote>

	<h3>Browser</h3>
	<script>
		var d = new Date();
		document.write("<div><b>Date:</b> "+d+"</div>");
		document.write("<div><b>Code:</b> "+navigator.appCodeName+"</div>");
		document.write("<div><b>Name:</b> "+navigator.appName+"</div>");
		document.write("<div><b>Ver.:</b> "+navigator.appVersion+"</div>");
		document.write("<div><b>Cookie-ON:</b> "+navigator.cookieEnabled+"</div>");
		document.write("<div><b>Java-ON:</b> "+navigator.javaEnabled()+"</div>");
		document.write("<div><b>UserAgent:</b> "+navigator.userAgent+"</div>");
		document.write("<div><b>Plugins:</b> "+navigator.plugins+"</div>");
		document.write("<div><b>Display:</b> "+screen.width+" x "+screen.height+"</div>");
		document.write("<div><b>Display2:</b> "+screen.availWidth+" x "+screen.availHeight+"</div>");
		document.write("<div><b>Browser:</b> "+document.documentElement.clientWidth+" x "+document.documentElement.clientHeight+"</div>");
	</script>
	
	<h3>OS</h3>
	<script>
		document.write("<div><b>Platform:</b> "+navigator.platform+"</div>");
		document.write("<div><b>Language:</b> "+((typeof navigator.language)?navigator.language:navigator.browserLanguage)+"</div>");
	</script>
	
	<h3>Network</h3>
	<script>
		document.write("<div><b>Enabled:</b> "+navigator.taintEnabled()+"</div>");
		document.write("<div><b>Online:</b> "+navigator.onLine+"</div>");
	</script>
	
	<h3>URL</h3>
	<script>
		document.write("<div><b>Enabled:</b> "+location.href+"</div>");
	</script>
	
	<h3>Geo</h3>
	<script>
		document.write("<div><b>Enabled:</b> "+((typeof navigator.geolocation)?"true":"false")+"</div>");
		if(typeof navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				var html="";
				html+="<div><b>TimeStamp:</b> "+position.timestamp+"</div>";
				html+="<div><b>緯度 Latitude:</b> "+position.coords.latitude+"</div>";
				html+="<div><b>経度 Longitude:</b> "+position.coords.longitude+"</div>";
				html+="<div><b>座標誤差:</b> "+position.coords.accuracy+"</div>";
				html+="<div><b>高度:</b> "+position.coords.altitudeAccuracy+"</div>";
				html+="<div><b>方角:</b> "+position.coords.heading+"</div>";
				html+="<div><b>速度:</b> "+position.coords.speed+"</div>";
				document.getElementById("geo").innerHTML = html;
			});
			
		}
	</script>
	<div id="geo">...取得中...</div>
	
	<h3>Cookie</h3>
	<script>document.write(document.cookie);</script>

	<h3>Storage</h3>
	<script>
		var ls = "";
		for(var i in localStorage){
			ls += i+"="+localStorage[i]+"<br>";
		}
		document.write(ls);
	</script>

	

</blockquote>
</body>
</html>