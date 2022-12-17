/**
 * SiteMap
 **/

// Config-----
var flgTarget = "layer";//[ none , domain , layer ]
var urls = [];

// Init-----
var http = require('http');
var FS   = require('fs');
var QS   = require('querystring');

var saveDir  = "data/index/sitemap/";
var accessPort = 3334;

http.createServer(function(req,res){
	res.writeHead(200,{
		'Content-Type':'text/plain',
		'Access-Control-Allow-Origin':'*'
	});

	$$saveDir(saveDir);

	//PostString
	var postData='';
	req.on('data', function (data) {
		postData += unescape(data);
	});
	req.on('end',function(){
		var POST =  QS.parse(postData);
		$$SPK(POST,res);
	});

}).listen(accessPort);

console.log('Server running at http://***:'+accessPort+'/');


//-----
//Library
(function(){
	var SPK = require('spooky');
	var $$=function(data,res){
		var dt = (+new Date());

		var spooky = new SPK({
			casper:{
				logLevel:'debug',
				verbose:true,
				sslProtocol:'any'
			},
			child:{
				"ssl-protocol":"tlsv1",
				"ignore-ssl-errors":true
			}
		},function(){
			spooky.create({viewportSize:{width:data.width,height:data.height}});
			spooky.userAgent(data.ua);
			spooky.start(data.url);
			spooky.then([{url:data.url},function(data){
				var links = this.evaluate(function(url){
					var links = document.links;
					var lists = [url];
					for(var i=0;i<links.length;i++){
						//if(lists.length && lists.indexOf(links[i])!=-1){continue}
						lists.push(links[i].href);
					}
					return lists;
				}, url);
				this.emit("checkUrls",links);
			}]);
			spooky.run();

			spooky.on("checkUrls",function(links){
				if(links.length==0){return}
				var url = data.url;
				url = url.replace(/\//g,"\\/");
				url = url.replace(/\./g,"\\.");
				url = url.replace(/\:/g,"\\:");
				url = url.replace(/\-/g,"\\-");
				var reg = new RegExp("^"+url,"i");
				for(var i=0;i<links.length;i++){
					var href = links[i].split("#")[0];
					if(urls.length && urls.indexOf(href)!=-1){continue}
					//if(flgTarget=="layer" && !href.match(reg)){continue}
					urls.push(href);
				}
				var json = JSON.stringify({counts:urls.length,urls:urls});
				res.end(json);
				//res.end(urls.join("\n")+"\nurl-count:"+urls.length);
			});
		});
	};

	$$SPK = $$;
})();

// Save-Directory
(function(FS){
	var $$={};
	$$=function(path){
		var paths = path.split("/");
		var dir = "";
		for(var i=0;i<paths.length;i++){
			dir += paths[i]+"/";
			//check
			if(FS.existsSync(dir)){continue}
			//make
			FS.mkdirSync(dir,0755);
		}
	};
	$$saveDir = $$;
})(FS);