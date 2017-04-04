chrome.tabs.getSelected(null, function(tab){
  $('input').val(tab.url); 
  localStorage.url =  tab.url;
  localStorage.title = tab.title;
  });
if(!localStorage.txt) localStorage.txt = '[]';
	if(localStorage.txt!='[]'){
		if(localStorage.time == (new Date()).getDate())
			{show(localStorage.txt);}
		else
			{createtxt();}
	}
	else
	{createtxt();}
function createtxt() {
	localStorage.txt = '[]';
	localStorage.time = (new Date()).getDate();
	$('#text').addClass('null');
}
function show(arr) {
	$('#null').hide();
	$('#text').removeClass('null');
	$('#text').addClass('active');
	arr = JSON.parse(arr);
	for(a in arr){
		var txt = '<p><a href="'+arr[a].url+'" target="_blank">'+arr[a].title+'</a><i></i></p>';
		$('#text').append(txt);
	}
	$('#text p i').click(remove);
}
$('button').click(function () {
	var url = $('input')[0].value;
	if(localStorage.txt=='[]'){		
		$('#null').hide();
		$('#text').removeClass('null');
		$('#text').addClass('active');}
	if(url == localStorage.url){
		addtxt();
	
}else{
		checkurl(url);
	}
});
function remove() {
	var text = $(this.parentNode).find('a').attr('href');
	var arr = JSON.parse(localStorage.txt);
	$(this.parentNode).hide();
	for(a in arr){
		if(arr[a].url == text){
			arr.splice(a,1);
			break;
		}
	}
	localStorage.txt = JSON.stringify(arr);
	if(arr.length == 0){
		$('#null').show();
		$('#text').addClass('null');
		$('#text').removeClass('active');		
	}	
}
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        	if (xhr.status==200){
            callback(xhr.responseText);
        }else{
        	errorout();
        }
        }        
    }
    xhr.send();
}
function checkurl(url) {
var html;
url = url.replace('http://','');
url = url.replace('https://','');
url = "http://"+url;
$('#check').show();
httpRequest(url, function(result){
    html = result.split('<title')[1];
    html = html.split('>')[1].replace('</title','');
    localStorage.title = html;
    localStorage.url = url;
    $('#check').hide();
    addtxt();   
});
}
function errorout() {
	$('#check').hide();
	$('#input input').css('border-color','#fe2222');
}
function addtxt() {
		if(localStorage.txt.indexOf(localStorage.url)<=0){
		var txt = '<p><a href="'+localStorage.url+'" target="_blank">'+localStorage.title+'</a><i></i></p>';
		var news = {url:localStorage.url,title:localStorage.title};
		var newarr = JSON.parse(localStorage.txt);
		$('#text').append(txt);
		newarr.push(news);
		$('#text p:last-of-type i').click(remove);
		localStorage.txt =JSON.stringify(newarr);	}
}
$('#input input').focus(function () {
	$(this).css('border-color','#aaa');
});