class Print {
    constructor(option) {
        this.option = option; //   接收配置项
        this.oPrintWrap = document.getElementsByClassName('print-wrap')[0]; //  打印最外层大小 - 用于调整纸张大小
        this.init();
    }

    init() {
        this.createElement()
        this.bindEvent();
    }

    create(btn) {
        btn.addEventListener('click', function(ev) { 
            window.print();
         }, false) 
    }

    bindEvent() {

    }

    createElement() {   // 创建自定义元素表格
        const { title, headers, baseMessage, rows } = this.option;
        //  创建文档碎片
        const oFrag = document.createDocumentFragment();  
        // 创建标题
        const oTitle = this.renderTitle( title );
        // 创建基本信息
        const oBaseMessage = this.renderBaseMesage( baseMessage );  
        
        //  将元素添加到 frag 上面
        oFrag.appendChild(oTitle); //   将标题添加到页面上
        oFrag.appendChild(oBaseMessage); // 将基本信息添加到页面上

        //  根据数据的条数，显示出合适的长度，进行分页
       let count = 0;   //  用来截取计数的
       let step = 34;
       const rowsLen = rows.length;
       const total = Math.ceil(rowsLen / step);
       let page = 1;

       // 首页
       const oElem = this.renderElement( title, headers, rows.slice(count, count += 30), page, total );
       oFrag.appendChild(oElem);

       //   循环追加
       while( count <= rowsLen ) {
            const oElem = this.renderElement( title, headers, rows.slice(count, count += step), ++page, total );
            oFrag.appendChild(oElem);
       }

        this.oPrintWrap.appendChild(oFrag);
    }

    //  渲染标题
    renderTitle(title) {
        //  创建标题
        const oTitle = document.createElement('div');
        oTitle.className = 'print-title';
        //  将需要的内容渲染到页面上
        oTitle.innerHTML = title;
        return oTitle;
    }

    //  渲染基本信息
    renderBaseMesage(baseMessage) {
        const oBaseMessage = document.createElement('div');
        oBaseMessage.className = 'print-base-message';
        oBaseMessage.innerHTML = customBaseMessageTemplate(baseMessage);
        return oBaseMessage;
    }

    renderElement( title, headers, data, page, total ) {   // 渲染，处理每页显示的多少
        //  创建文档碎片
        const oFrag = document.createDocumentFragment();  
         //  创建表格
         const oTableBody = document.createElement('div');
         oTableBody.className = 'print-table-body';
         oTableBody.innerHTML = customTableTemplate(headers, data);
         //  创建页码
         const oPageCode = document.createElement('div');
         oPageCode.className = 'print-page-code';
         oPageCode.innerHTML = customPageCode(page, total);
         //  创建分页符
         const oSplit = document.createElement('div');
         oSplit.style.pageBreakAfter = 'always';
        
         // 将元素添加到元素上
         oFrag.appendChild( oTableBody ); // 将表格添加到页面上
         oFrag.appendChild( oPageCode ); // 将页码添加到页面上
         oFrag.appendChild( oSplit );    // 进行页面分割     
         return oFrag;
    }
}

//  自定义页码
function customPageCode(page, total) {
    return `${page} / ${total}`;
}

//  创建自定义基本信息模版
function customBaseMessageTemplate( data ) {
    let str = '';
    str += `<div class="print-base-flex">
        <div>病人姓名: ${ data.name }</div>
        <div>身份证号: ${ data.idCard }</div>
        <div>患者档案号: ${ data.sourcePatientId }</div>
    </div>
    <div class="print-base-flex">
        <div>住院流水号: ${ data.visitId }</div>
        <div>住院科室名称: ${ data.visitDeptName }</div>
        <div>住院号: ${ data.hospizationId }</div>
    </div>
    <div class="print-base-flex">
        <div>床位号: ${ data.sickbedId }</div>
        <div>住院时间: ${ data.admissionDatetime }</div>
        <div>出院时间: ${ data.dischargeDatetime }</div>
    </div>`;

    return str;
}

//  创建自定义表单模版 table
function customTableTemplate( headers, data ) {
    let str = '';
   str += `<table class="table11_3">
        <tr>
            ${ 
                (() => {
                    return headers.reduce((prev, s) => {   
                       return prev += `<th>${ s }</th>`
                    }, '')
                })()
             }
        </tr>
        ${
            (() => {
                return data.reduce((prev, s, i) => {
                    return prev +=  `<tr>
                        <td>${ i + 1 }</td>
                        <td>${ s.dishDate }</td>
                        <td>${ s.morningDishName }</td>
                        <td>${ s.moonDishName }</td>
                        <td>${ s.dinnerDishName }</td>
                    </tr>`;
                }, '')
            })()
        }
    </table>`;

    return str;
}

const print = new Print(JSON.parse(window.name));
