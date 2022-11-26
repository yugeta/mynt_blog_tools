;(function(){
    var $$ = function(){
        var bg1 = document.querySelector(".bg1");
        if(bg1 !== null){
            $$.prototype.addBubble(bg1);
        }
        var bg2 = document.querySelector(".bg2");
        if(bg2 !== null){
            $$.prototype.addBubble(bg2);
        }
        var bg3 = document.querySelector(".bg3");
        if(bg3 !== null){
            $$.prototype.addBubble(bg3);
        }
        window.addEventListener("scroll", $$.prototype.scroll_1, false);
    };
    
    $$.prototype.addBubble = function(bg){
        var cnt = Math.floor( Math.random() * 10 );
        for(var i=0; i<cnt+10; i++){
            var div = document.createElement("div");
            div.className = "bubble";
            var x = Math.floor( Math.random() * 100 );
            var y = Math.floor( Math.random() * 100 );
            div.style.setProperty("left",x+"%","");
            div.style.setProperty("top",y+"%","");
            var w = Math.floor( Math.random() * 5 );
//             var h = Math.floor( Math.random() * 5 );
            div.style.setProperty("width",((w+5)*10)+"px","");
            div.style.setProperty("height",((w+5)*10)+"px","");
            bg.appendChild(div);
        }
    };
    
    $$.prototype.scroll_1 = function(){
        var bg1 = document.querySelector(".bg1");
        if(bg1 !== null){
            var top = document.body.scrollTop;
            bg1.style.setProperty("top", (top/2)+"px","");
        }
        var bg2 = document.querySelector(".bg2");
        if(bg2 !== null){
            var top = document.body.scrollTop;
            bg2.style.setProperty("top", (top/3)+"px","");
        }
    };
    
    window.addEventListener("DOMContentLoaded", $$, false);
})();