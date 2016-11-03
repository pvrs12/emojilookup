console.log("loaded");

function is_emoji(code){
	return code >= 55296 && code < 57344;
}

function get_combine_code(code1, code2){
	var codeHi = code1 - 55296;
	var codeLo = code2 - 56320;
	var resCode = codeHi << 10;
	resCode |= codeLo;
	resCode += 65536;
	return resCode;
}

function get_name(code){
	request = new XMLHttpRequest({mozSystem: true});
	request.open('GET', 'http://www.fileformat.info/info/unicode/char/'+code+'/index.json');
	request.send();
	request.addEventListener("readystatechange", function(){
		if(request.readyState === XMLHttpRequest.DONE) {
			alert(request.responseText);
		}
	});
}

window.addEventListener("mouseup", function(){
	text = window.getSelection().toString();
	if(text !== ""){
		for(var i=0; i<text.length; ++i){
			var code = text.charCodeAt(i);
			if(is_emoji(code)){
				++i;
				var code2 = text.charCodeAt(i);
				var resCode = get_combine_code(code, code2);
				console.log('emojicode = '+resCode.toString(16));
				get_name(resCode);
			}
		}
	}
});

