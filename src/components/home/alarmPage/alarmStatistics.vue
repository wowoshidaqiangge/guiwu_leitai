<template>
  <div class="alarmnow">
    <el-table 
      element-loading-text="拼命加载中" 
      element-loading-spinner="el-icon-loading" 
      element-loading-background="rgba(0, 0, 0, 0.8)" 
      :data="alarmTableData"
      :max-height="max_table_height" 
      border 
      style="width: 100%"
    >
      <el-table-column prop="deviceName" label="设备名称" header-align="center"></el-table-column>
      <el-table-column v-for="(item, index) in tableCol" :key="index" :prop="item.prop" :label='item.label' header-align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  name: 'alarmNowDiv',
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'auth': 2,              // 权限
        'apiKey': '',           // apikey值
        'deviceId': '',         // 当前设备ID号
        'time': '',
        'id': ''                // 报警数据ID   
      },
      // 报警信息列表
      alarmTableData: [{
        id: '',               // 报警数据的ID
        name: '',             // 触发器名称
        content: '',          // 报警内容
        // state: '正常', // OK
        value: '',           // 报警数值
        time: ''             // 报警时间
      }],
      // 列名称
      tableCol: [
        {
          label: '雷击报警',
          prop: 'warnType1'
        },
        {
          label: '空开报警',
          prop: 'warnType2'
        },
        {
          label: '接地报警',
          prop: 'warnType3'
        },
        {
          label: 'SPD失效报警',
          prop: 'warnType4'
        },
        {
          label: '可燃气体报警',
          prop: 'warnType5'
        },
        {
          label: '水位报警',
          prop: 'warnType6'
        },
        {
          label: '烟感报警',
          prop: 'warnType7'
        },
        {
          label: '联动报警',
          prop: 'warnType8'
        },
        {
          label: '温湿度报警',
          prop: 'warnType9'
        },
        {
          label: '电压值超上限报警',
          prop: 'warnType10'
        },
        {
          label: '电压值超下限报警',
          prop: 'warnType11'
        },
        {
          label: '电流值超上限报警',
          prop: 'warnType12'
        },
        {
          label: '雷击峰值超上限报警',
          prop: 'warnType13'
        },
        {
          label: '接地电阻阻值超上限报警',
          prop: 'warnType14'
        },
      ],
      bjtimer: null, // 定时器查询当前报警
      max_table_height: null // 表格高度
    }
  },
  created: function () {
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    // 表格数据初始化
    this.alarmTableData = []
    // 修改表格最大高度
    this.max_table_height = document.documentElement.clientHeight - 195
  },
  mounted: function () {
    // 获取报警统计信息
    this.getAlarmStatistics()
    // 设置定时器
    this.bjtimer = setInterval(function () {
      // 获取报警统计信息
      this.getAlarmStatistics()
    }.bind(this), 3000)
  },
  destroyed () {
    // 清除定时器 
    if (this.bjtimer) {
      // 如果定时器在运行则关闭
      clearInterval(this.bjtimer)
    }
  },
  methods: {
    /*
    **  ******************  API调用相关函数  ******************
    */
    // 获取报警统计信息
    getAlarmStatistics: function () {
      console.log(this.param)
      back.alarmStatistics(this.param).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        if (response.data !== undefined) {
          var alarmDataList = []
          for (let i = 0; i < response.data.length; i++) {
            var obj = {
              deviceName: response.data[i].name,
              warnType1: '-',
              warnType2: '-',
              warnType3: '-',
              warnType4: '-',
              warnType5: '-',
              warnType6: '-',
              warnType7: '-',
              warnType8: '-',
              warnType9: '-',
              warnType10: '-',
              warnType11: '-',
              warnType12: '-',
              warnType13: '-',
              warnType14: '-'
            }
            var warnList = response.data[i].warnNumberList
            for (let j = 0; j < warnList.length; j++) {
              obj['warnType' + warnList[j].warnType] = warnList[j].number
            }
            alarmDataList[i] = obj
          }
          this.alarmTableData = alarmDataList
        }
      }.bind(this))
    }
  }  
}
</script>

<style lang="scss" scoped>
  .alarmnow {
    .tbcell_left {
      display: inline-block;
    }
    .tbcell_right {
      display: inline-block;
    }
  } 
</style>

<style>
.alarmnow {
  padding: 0;
  bottom: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 30px;
}
/* 解决element-ui的表格设置固定栏后，边框线消失的bug */
.alarmnow .el-table__row td:not(.is-hidden):nth-child(1){
  bottom:-1px;
}
</style>
