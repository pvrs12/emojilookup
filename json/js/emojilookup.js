console.log("loaded");
emoji_ranges = [
	[ 9228, 10175 ],
	[ 127744, 128591 ],
	[ 128640, 128767 ], 
	[ 129280, 129535 ]
];
emoji_popup_list = [
];

var cursorX;
var cursorY;

function is_emoji(code){
	for(i = 0; i< emoji_ranges.length;++i){
		if(emoji_ranges[i][0] <= code && code <= emoji_ranges[i][1]){
			return [true, code];
		}
	}
	return [false, code];
}

function escape_string(s){
	return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function get_name(code){
	var request = new XMLHttpRequest();
	var address = 'https://www.fileformat.info/info/unicode/char/'+code.toString(16)+'/index.json'
	request.open('GET', address, true);
	request.send();
	request.onreadystatechange = function() {
		if(request.readyState === 4){
			if(request.status === 200){
				var res = JSON.parse(request.responseText);
				emoji_popup_list.push([String.fromCodePoint(code), escape_string(res['name'])]);
				update_popup();
			} else {
				console.log('Error! Status: '+reqeust.status);
			}
		}
	}
}

function hide_popup(){
	console.log('removing popup');
	var element = document.getElementById('emojiDiv');
	if(element){
		element.parentElement.removeChild(element);
	}
}

function create_popup(){
	console.log('adding popup');
	var popup = document.createElement("div");
	popup.setAttribute("style", "left: " + cursorX + "px;"+
											"top: "+cursorY+"px;"+
											"position: absolute;"+
											"max-height: 100px;"+
											"overflow-y: auto;"+
											"z-index: 1;"+
											"background-color: #cfebfc;"+
											"color: #4c5143;"+
											"border-style: solid;"+
											"border-color: #4c5143;"+
											"border-width: 2px;"+
											"border-radius: 5px;"+
											"font-size: 12px;");
	popup.setAttribute("id", "emojiDiv");

	document.body.appendChild(popup);
}

function update_popup(){
	if(!document.getElementById("emojiDiv")){
		create_popup();
	}
	var popup = document.getElementById("emojiDiv");
	while(popup.firstChild) {
		popup.removeChild(popup.firstChild);
	}
	var table = document.createElement("table");
	emoji_popup_list.sort(function(a, b){
		return a[1] > b[1];
	});
	var filtered = emoji_popup_list.filter(function(item, pos, ary) {
		return !pos || item[1] != ary[pos - 1][1];
	});
	for(i=0; i<filtered.length; ++i){
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		td1.setAttribute("style","padding-right:10px;"+
											"padding-left:5px;"
										);
		td1.innerHTML = filtered[i][0];
		td2.setAttribute("style","padding-right:5px;");
		td2.innerHTML = filtered[i][1];

		tr.appendChild(td1);
		tr.appendChild(td2);
		table.appendChild(tr);
	}
	popup.appendChild(table);
}

function async(f, cb, args){
	setTimeout(function() {
		cb(f(args));
	}, 0);
}

window.onmousemove = function(e){
	cursorX = e.pageX;
	cursorY = e.pageY;
}

window.addEventListener('mouseup', function(){
	text = window.getSelection().toString();
	
	hide_popup();
	if(text !== ''){
		emoji_popup_list = [];
		for(i=0; i<text.length; ++i){
			codepoint = text.codePointAt(i);
			async(is_emoji, function(res){
				if(res[0]) {
					get_name(res[1]);
					
				}
			}, codepoint);
		}
	}
});

