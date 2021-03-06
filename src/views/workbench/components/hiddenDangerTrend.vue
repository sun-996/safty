<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

import { getAllCount } from '@/api/workbench/chart'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '600px'
    }
  },
  data() {
    return {
      chart: null,
      legendData: ['检查次数', '隐患个数', '趋势'],
      checkQuantitys: [],
      dangerQuantitys: [],
      checkDates: [],
      min: 0,
      max: 0
    }
  },
  mounted() {
    this.fetchList()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    fetchList() {
      getAllCount().then((res) => {
        const data = res.data.obj

        data.forEach(item => {
          // 检查次数数组
          this.checkQuantitys.push(item.checkQuantity)

          // 隐患数量数组
          this.dangerQuantitys.push(item.dangerQuantity)

          // 时间数组
          this.checkDates.push(item.checkDate + '月')
        })
        const checkMin = Math.min(...this.checkQuantitys)
        const checkMax = Math.max(...this.checkQuantitys)
        const dangerMin = Math.min(...this.dangerQuantitys)
        const dangerMax = Math.max(...this.dangerQuantitys)
        this.max = Math.max(checkMax, dangerMax)

        this.initChart() // 初始化图表
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '隐患数量趋势'
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.legendData
        },
        grid: {
          top: 80
        },
        xAxis: [
          {
            type: 'category',
            data: this.checkDates,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '检查次数',
            min: this.min,
            max: this.checkMax,
            axisLabel: {
              formatter: '{value} 次'
            }
          },
          {
            type: 'value',
            name: '隐患个数',
            min: this.min,
            max: this.dangerMax,
            axisLabel: {
              formatter: '{value} 个'
            }
          }
        ],
        series: [
          {
            name: '检查次数',
            type: 'bar',
            data: this.checkQuantitys
          },
          {
            name: '隐患个数',
            type: 'bar',
            data: this.dangerQuantitys
          },
          {
            name: '趋势',
            type: 'line',
            yAxisIndex: 1,
            data: this.dangerQuantitys
          }
        ]

      })
    }
  }
}
</script>
