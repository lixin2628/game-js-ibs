/*
* 
* JS 全屏 
  //FullScreen()  |  FullScreen(true);
  
**/

/*
first 只执行一次
*/
function FullScreen(first){
	document.body.addEventListener("mousedown",full);
	document.body.addEventListener('touchstart',full)
	function full(){
 		 var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
        if(first){
        	document.body.removeEventListener("mousedown",full);
			document.body.removeEventListener('touchstart',full)
        }
	}
}

/*
退出全屏
*/
function ExitFullScreen(){
	var de = document;
    	if (de.exitFullscreen) {
         de.exitFullscreen();
     	} else if (de.mozCancelFullScreen) {
         de.mozCancelFullScreen();
     	} else if (de.webkitCancelFullScreen) {
         de.webkitCancelFullScreen();
     }
}