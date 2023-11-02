<script>
    import PrintBox from './PrintBox';
    export default {
        name: 'PrintButton',
        components: {
            PrintBox
        },
        props: {
            payload: {
                text: '打印',
                message: {}
            }
        },
        data() {
            return {
            }
        },
        methods: {
            printClick() {
                this.$refs['printBox'].printClick(this.payload.message);
            }
        }
    }
</script>

<template>
    <div class="print-wrap">
        <el-button @click.prevent="printClick">{{ payload.text }}</el-button>
        <PrintBox ref="printBox"></PrintBox>
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