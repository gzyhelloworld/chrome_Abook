if(typeof localStorage.txt == 'undefined') {localStorage.txt = '[]';localStorage.time = (new Date()).getDate();}
if(typeof localStorage.strongtxt == 'undefined') localStorage.strongtxt = '[]';
if(localStorage.time != (new Date()).getDate()){localStorage.txt = '[]';localStorage.time = (new Date()).getDate();}
chrome.tabs.getSelected(null, function(tab){
document.getElementsByTagName('input')[0].value = tab.url; 
localStorage.url =  tab.url;
localStorage.title = tab.title;});

Vue.component('strongtxt',{
	template:'<p><a :href="item.url" target="_blank">{{item.title}}</a><i v-on:click="delthis(item.id)"></i></p>',
	props:['item'],
	methods:{
		delthis:function (index) {
			var arr = JSON.parse(localStorage.strongtxt);
			arr.splice(index,1);
			localStorage.strongtxt = JSON.stringify(arr);
			vm.strongtxts = arr;			
		}
	}
});
Vue.component('smalltxt',{
	template:'<p><a :href="item.url" target="_blank">{{item.title}}</a><i v-on:click="delthis(item.id)"></i></p>',
	props:['item'],
	methods:{
		delthis:function (index) {
			var arr = JSON.parse(localStorage.txt);
			arr.splice(index,1);
			localStorage.txt = JSON.stringify(arr);
			vm.txt = arr;			
		}
	}
});
var vm = new Vue({
	el:'#body',
	data:{
		check : false,
		redcolor : false,
		msg:'临时',
		txt:JSON.parse(localStorage.txt),
		strongtxts:JSON.parse(localStorage.strongtxt),
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
			var local = (vm.msg=='永久'?localStorage.strongtxt:localStorage.txt);
			if(local.indexOf(localStorage.url)<=0){
				var news = {url:localStorage.url,title:localStorage.title};
				var newarr = JSON.parse(local);
				newarr.push(news);
				if(vm.msg=='永久'){
					localStorage.strongtxt = JSON.stringify(newarr);
					vm.strongtxts = newarr;
				}else{
					localStorage.txt = JSON.stringify(newarr);
					vm.txt = newarr;
				}
			}
			this.choose = false;
		},
		change:function () {
			vm.msg = (vm.msg=="临时"?"永久":"临时");	
		},
	},
	computed:{
		nulltrue:function () {
			return this.strongtxts.length == 0 && this.txt.length == 0;
		}
	}
});
