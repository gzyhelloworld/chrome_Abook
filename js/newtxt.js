if(typeof localStorage.txt == 'undefined') {localStorage.txt = '[]';}
var time = (new Date()).getDate();
if(typeof localStorage.time == 'undefined' || localStorage.time != time){
	localStorage.time = time;
	var arr = JSON.parse(localStorage.txt);
	for(var a=0;a<arr.length;a++){
		if(arr[a].day!=9) arr[a].day--;
	if(arr[a].day == 0){
		arr.splice(a,1);
	}
	}
	localStorage.txt = JSON.stringify(arr);
}
chrome.tabs.getSelected(null, function(tab){
document.getElementsByTagName('input')[0].value = tab.url; 
localStorage.url =  tab.url;
localStorage.title = tab.title;});
var smalltxt =  Vue.extend({
	template:'<p><a :href="item.url" target="_blank">{{item.title}}</a><i v-on:click="delthis(index)"></i><strong v-on:click="addday(index)">{{item.day}}</strong><i @click="upthis(index)"></i></p>',
	props:['item','index'],
	methods:{
		delthis:function (index) {
			var arr = JSON.parse(localStorage.txt);
			arr.splice(index,1);
			vm.txt = arr;			
		},
		addday:function (index) {
			var arr = JSON.parse(localStorage.txt);
			var num = arr[index].day;			
			num++;
			arr[index].day =  (num>9?9:num);
			vm.txt = arr;						
		},
		upthis:function (index) {
			var arr = JSON.parse(localStorage.txt);
			if(index != 0 ){
				arr[index] = arr.splice(index-1, 1, arr[index])[0];
			}
			vm.txt = arr;
		}
	},
});
var vm = new Vue({
	el:'#body',
    components: {
      smalltxt: smalltxt,
    },	
	data:{
		msg:'blue',
		check : false,
		redcolor : false,
		daycolor:["#aaa","#0f0","#00f","#f00","#ff0","#0ff","#f0f","#fcd","#cdf"],
		txt:JSON.parse(localStorage.txt),
	},
	methods:{
		addurl:function () {
			var html,_this=this;
			var url = document.getElementsByTagName('input')[0].value;
			var url;
			if(url != localStorage.url){
			url = url.replace('http://','');
			url = url.replace('https://','');
			url = "http://"+url;
			this.check = true;
			this.httpRequest(url, function(result){console.log('sss');
			    html = result.split('<title')[1];
			    html = html.split('>')[1].replace('</title','');
			    localStorage.title = html;
			    localStorage.url = url;
			    _this.check = false;
			    _this.addtxt();	 
			});}
			else {_this.addtxt();}			
		},
		httpRequest:function (url,callback) {
		    var xhr = new XMLHttpRequest();
		    xhr.open("GET", url, true);
		    xhr.onreadystatechange = function() {
		        if (xhr.readyState == 4) {
		        	if (xhr.status==200){
		            callback(xhr.responseText);
		        }else{
		        	vm.check = false;
		        	vm.redcolor = true;
		        }
		        }        
		    }
		    xhr.send();			
		},
		addtxt:function () {			
			if(localStorage.txt.indexOf(localStorage.url)<=0){
				var news = {url:localStorage.url,title:localStorage.title,day:1};
				var newarr = JSON.parse(localStorage.txt);
				newarr.push(news);
				vm.txt = newarr;			
			}
		}
	},
	computed:{
		nulltrue:function () {
			return this.txt.length == 0;
		}
	},
	watch:{
		txt:function (val) {
			localStorage.txt = JSON.stringify(val);
		}
	}
});
