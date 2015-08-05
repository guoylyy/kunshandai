window.onload = function(){
	
	function linkToBrowserDownload() {
		alert('网站不支持IE浏览器8.0及更旧的版本，点击确定自动为你下载支持的浏览器');
		window.location = 'http://dlsw.baidu.com/sw-search-sp/soft/9d/14744/ChromeStandalone_44.0.2403.130_Setup.1438755492.exe'
    }

    if(navigator.userAgent.indexOf("MSIE")>0){   
      //IE 6, IE7, IE8
      if(navigator.userAgent.indexOf("MSIE 6.0")>0 
      	|| navigator.userAgent.indexOf("MSIE 7.0")>0 
      	|| (navigator.userAgent.indexOf("MSIE 9.0")>0 && !window.innerWidth)){   
        
        linkToBrowserDownload();   
      }   
      
    }   

    
} 

