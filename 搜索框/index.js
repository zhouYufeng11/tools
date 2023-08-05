
(function(doc) {
	var oSearchBox = null,
				oInput = null,
				oBtn = null,
				oList = null,
				template = '',
				itemHeight = 50;

	var init = ( options ) => {
		oSearchBox = options.searchBox;
		oInput = options.input;
		oBtn = options.button;
		oList = options.list;
		template = options.template;
		itemHeight = options.height;

		bindEvent();
	};

	var bindEvent = () => {
		oInput && listenEvent(oInput, 'input', debounce(handleInput, 500)); //	停止输入 500 ms 后发送请求
		oBtn && listenEvent(oBtn, 'click', handleButton);
		oList && listenEvent(oList, 'click', handleList);
	}

	/*
		事件处理函数
				handleList：监听点击搜索框的事件
				handleButton：监听点击搜索按钮事件
				handleInput：监听输入框输入事件
	*/

	//	监听点击搜索框的事件
	function handleList( ev ) {
		var ev = ev || window.event,
				tar = ev.target || ev.srcElement;

		if(this.handleList) {
			this.handleList( ev );
		}
	}

	//	监听点击搜索按钮事件
	function handleButton( ev ) {
		var ev = ev || window.event,
				tar = ev.target || ev.srcElement;

		if(this.handleButton) {
			this.handleButton( ev );
		}
	}

	//	监听输入框输入
	function handleInput(ev) {
		var ev = ev || window.event,
				tar = ev.target || ev.srcElement;

		if(this.handleInput) {
			this.handleInput( ev, vm );	
		}
	}



	/*
		数据监听代理
				vm： 数据监听对象
				filterData： 数据源
				updateList：当监听的数据发生改变的时候，更新列表
				show：根据数组的长度合理的显示列表
	*/

	//	发送 ajax 请求, 成功之后显示元素，并根据元素的长度而变化当前的容器的长度
	const vm = { filterData: [] };
	let filterData = [];

	Object.defineProperty(vm, 'filterData', {
		get() {
			return filterData;
		},
		set(newValue) {
			filterData = newValue;
			updateList();
			show();
		}
	})

	//	更新视图
	function updateList() {
		let html = '';

		vm.filterData.forEach(item => {
			html += replaceTpl(item, template);
		})

		oList.innerHTML = html;
	}

	//	根据 count 来计算需要滚动的距离
	function show() {
		const len = vm.filterData.length;

		if(len > 0) {
			oList.style.visibility = 'visible';
			oList.style.height = len * itemHeight + 'px';
		} else {
			oList.style.visibility = '';
			oList.style.height = 0;
		}
	}

	window.$searchBox = init;
})(document);




/*
	utils 合集
			clearSpace：删除输入框中所有的空格
			debounce：函数防抖
			replaceTpl：模板字符串替换
			listenEvent：事件监听兼容性处理
*/

//	去除所有的空格，因为匹配空格是没有用的
function clearSpace(str) {
	return str.replace(/\s+/g, '');
}

//	防抖函数
function debounce(func, wait) {
	var t = null;

	return function() {
		//	记录数据
		var that = this,
				args = arguments;

		if(t) clearTimeout(t);

		// 重新开始新的 定时器
		t = setTimeout(function() {
			func.apply(that, args);
			clearTimeout(t);
			t = null;
		}, wait);
	}

}

//	模板字符串替换
function replaceTpl(data, tpl) {
	if(typeof data !== 'object' && data !== null) return tpl.replace(/\{\{(.*?)\}\}/g, data);
	//	处理对象或者数组的情况
}

//	监听事件的兼容性适配
function listenEvent(target, event, callback) {
	if( window.addEventListener ) {
		target.addEventListener(event, callback, false);
	} else if(target.attachEvent) {
		target.attachEvent('on' + event, callback.bind(target));
	} else {
		target.onclick = callback;
	}
}