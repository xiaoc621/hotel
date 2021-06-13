!<!--  -->
<template>
<div>
   <div class="main" ref="main"></div>
</div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
export default {
data() {
return {
     totalTypePrice:[]
}
},
//生命周期 - 创建完成（访问当前this实例）
 created() {
    
},
//生命周期 - 挂载完成（访问DOM元素）
async mounted() {
    let res = await this.$get('/RoomType/totalTypePrice')
    this.totalTypePrice = res
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main);
    // 绘制图表
    myChart.setOption({
    title: {
        text: '客房类型销售统计'
    },
    tooltip: {},
    xAxis: {
        data: this.totalTypePrice.map((r)=>r.roomtypeName)
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: this.totalTypePrice.map((r)=>r.totalMoney)
    }]
});
}
}
</script>
<style scoped>
.main{
    width: 1000px;
    height: 600px;
    border: 1px solid #ccc;
}
</style>