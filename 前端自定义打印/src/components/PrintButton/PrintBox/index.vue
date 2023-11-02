<script>
    import { listInPatientMeal } from "@/api/his/InPatientMeal";
    import { inPatientSettlement } from "@/api/his/InPatient"; 
    export default {
        name: 'PrintButton',
        data() {
            return {
            }
        },
        methods: {
            opListInPatientMeal(form) { //  获取用户订餐列表
                return listInPatientMeal(form)
                    .then( res => {
                        if( res.code === 200 ) {
                            return res.rows;
                        } else {
                            return []
                        }
                    })
                    .catch( err => console.log(err) );
            },
            opInPatientSettlement(form) {
                return inPatientSettlement(form)
                    .then( res => {
                        if( res.code === 200 ) {
                            return res.data;
                        } else {
                            return {}
                        }
                    })
                    .catch( err => console.log(err) );
            },
            async printClick(payload) {
                const rows = await this.opListInPatientMeal({ visitId: payload.visitId, pageNum: 1, pageSize: 10000 });
                const settle = await this.opInPatientSettlement({ sourcePatientId: payload.sourcePatientId, visitId: payload.visitId });

                if(rows && settle) {    //  当两个数据都存在，才进行后续的打印操作
                    //  对象合并
                    Object.assign(settle, payload);

                    const data = JSON.stringify({
                        title: '伙食清单',
                        baseMessage: settle,
                        headers: [  //  表头
                            '序号', '时间', '早饭', '午饭', '晚饭'
                        ],
                        rows
                    });

                    const printIframeWrap = this.$refs['printIframeWrap'];
                    printIframeWrap.style.width = window.innerWidth + 'px';
                    printIframeWrap.style.height = window.innerWidth + 'px';

                    //  创建 iframe 元素
                    const oIframe = document.createElement('iframe');
                    oIframe.src = '/printPage/index.html';
                    oIframe.width = '100%';
                    oIframe.height = '100%';

                    printIframeWrap.appendChild(oIframe);

                    //  获取 iframe 的 window 对象
                    const iframeContentWindow = oIframe.contentWindow;
                    iframeContentWindow.name = data;

                    iframeContentWindow.onload = function() {
                        let t = setTimeout(() => {
                            iframeContentWindow.print();   //   打印
                            clearTimeout(t);
                        }, 1000);
                    }

                    //  监听打印成功
                    iframeContentWindow.onafterprint = function() {
                        // this.$mod
                        iframeContentWindow.close();
                        oIframe.remove();
                    };

                }                
            } 
        }
    }
</script>

<template>
    <div class="print-wrap">
        <div ref="printIframeWrap" class="print-iframe-wrap"></div>
    </div>
</template>

<style lang="scss" scoped>
    .print-wrap {
        display: inline-block;
        .print-iframe-wrap {
            display: none;
        }
    }
</style>