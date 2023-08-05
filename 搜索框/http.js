(function(window) {
	function _doAjax(options) {
		const xhr = window.XMLHttpRequest ? new XMLHttpRequest();

		//	配置初始化参数
		const type = option.type ? option.type.toUpperCase() : 'GET',
					url = options.url,
					async = option.async + '' == 'false' ? false : true,
					data = option.data || null,
					success = options.success || function() {},
					error = options.error || function() {};

		//	判断 url 是否存在
		if(!url) throw new Error('你还没有传入 url');

		//	判断传递的是get请求，还是post请求, 设置请求头
		(type == 'POST') && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		//	发送数据
		xhr.send(type == 'GET' ? null : formatData(data));

		//	监听当前响应的状态
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if( ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 ) {
					//	处理返回的数据不是 JSON 数据的情况
					try {
						success(JSON.parse(xhr.responseText));
					} catch(e) {
						success(xhr.responseText);
					}
				}
			}
		}

		return xhr;
	}

	const ajax = function(options) {
		const xhr = _doAjax(options);
		return {
			abort: function() {
				xhr.abort();	//	终止这个请求
			}
		}
	}	

	window.xhr = {
		ajax
	}



	//	utils
	function formatData(data) {	//	格式化数据
		if(!data) return null;

		let str = '';

		for(let key in data) {
			str += `${key}=${data[key]}&`;
		}

		return str.replace(/&$/, '');	//	去掉最后的一个 &
	}

})(window);