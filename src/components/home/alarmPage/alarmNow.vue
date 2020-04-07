<template>
  <div class="alarmnow">
    <el-table 
      v-loading="loadingFlag" 
      :max-height="max_table_height" 
      element-loading-text="拼命加载中" 
      element-loading-spinner="el-icon-loading" 
      element-loading-background="rgba(0, 0, 0, 0.8)" 
      :data="alarmTableData" 
      border 
      style="width: 100%"
    >
      <el-table-column prop="index" label="编号" header-align="center" width="100px"></el-table-column>
      <el-table-column prop="deviceName" label="设备名称" header-align="center"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center"></el-table-column>
      <el-table-column prop="content" label="信息" header-align="center"></el-table-column>
      <el-table-column prop="value" label="数值" header-align="center"></el-table-column>
      <el-table-column prop="time" label="时间" header-align="center"></el-table-column>
      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-info" v-show="operation" @click="confirmClick(scope.$index, scope.row)">确认</el-button>
        </template>
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
      operation: true,               // 操作确认按键显示标志位
      loadingFlag: false,             // 加载图标标志位
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
    // 获取当前未处理的报警信息
    this.backGetUndealTrigger()
    // 设置定时器，定时获取未处理的报警信息
    this.bjtimer = setInterval(function () {
      // 获取当前未处理的报警信息
      this.backGetUndealTrigger()
    }.bind(this), 3000)
  },
  destroyed () {
    // 清除定时器---定时获取未处理的报警信息 
    if (this.bjtimer) {
      // 如果定时器在运行则关闭
      clearInterval(this.bjtimer)
    }
  },
  computed: {
    alarmRefersh () {
      return this.$store.state.deviceAlarmAlaRefresh
    }
  },
  watch: {
    // 设备列表刷新
    alarmRefersh: function (val) {
      if (val) {
        console.log('AlarmAlaRefresh')
        // 查询当前报警记录
        this.backGetUndealTrigger()
        // 全局节点列表刷新标志位置false，已刷新
        this.$store.commit('setdeviceAlarmAlaRefresh', false)
      }
    }
  },
  methods: {
    // 确认收到消息按键方法（确认之后下次就看不到这条报警信息了）
    confirmClick (index, row) {
      console.log('确认当前报警信息按键')
      console.log(index)
      console.log(row)
      this.param.id = row.id
      console.log(this.param.id)
      this.backComfirmTrigger()
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // 获取当前未处理的报警信息
    backGetUndealTrigger: function () {
      console.log(this.param)
      back.getUndealTrigger(this.param).then(function (response) {
        console.log('显示当前未处理报警信息')
        console.log(response)
        var alarmData = []
        if (response.data !== undefined) {
          // this.alarmTableData = response.data
          // for (let i = 0; i < response.data.length; i++) {
          //   this.alarmTableData[i].index = (i + 1)
          // }
          
          for (var i = 0; i < response.data.length; i++) {
            var deviceAlarm = response.data[i]

            for (var j = 0; j < deviceAlarm.warnDataEty.length; j++) {
              var alarmDataObj = deviceAlarm.warnDataEty[j]
              alarmDataObj.deviceName = deviceAlarm.name ? deviceAlarm.name : '未知设备'
              var alarmDataLength = alarmData.length
              alarmData[alarmData.length] = alarmDataObj
              alarmData[alarmDataLength].index = alarmDataLength + 1
            }
          }
        } else {
          if (response.errno !== 0) {
            this.notificationInfo('提示：', response.error)
          } else {
            
          }
        }
        this.alarmTableData = alarmData
      }.bind(this))
    },
    // 确认当前报警
    backComfirmTrigger: function () {
      console.log(this.param)
      back.comfirmTrigger(this.param).then(function (response) {
        console.log('确认当前报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 刷新当前未处理的报警信息列表
        this.backGetUndealTrigger()
      }.bind(this))
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement                                   // vue动态创建dom
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

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
