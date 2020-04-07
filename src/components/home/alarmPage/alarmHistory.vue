<template>
  <div class="alarmhistory">
    <div class="top_search">
      <el-button class="exportBtn" type="primary" size="small" v-if="exportBtnShow" @click="exportFunc">导出</el-button>
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        class="time_select_div"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timeChange"
        >
      </el-date-picker>
      <el-button class="searchBtn" type="primary" size="small" @click="queryHistoryBt">查询</el-button>
    </div>
    <el-table class="table_bjls" :max-height="max_table_height" :data="tableDataHistory" border style="width: 100%">
      <el-table-column prop="index" label="序号" header-align="center" width="100px"></el-table-column>
      <el-table-column prop="deviceName" label="设备名称" header-align="center"></el-table-column>
      <el-table-column prop="name" label="触发器名称" header-align="center"></el-table-column>
      <el-table-column prop="content" label="信息" header-align="center"></el-table-column>
      <el-table-column prop="value" label="数值" header-align="center"></el-table-column>
      <el-table-column prop="time" label="时间" header-align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'alarmHistoryDiv',
  // VUE内部数据
  data () {
    return {
      // 参数，用于API请求
      param: {
        'sn': 'fdfd',
        'apiKey': '',                         // apikey值
        'productId': '',                      // 当前产品ID号
        'deviceId': '',                       // 当前设备ID号
        'datastream_id': '',
        'startTime': '',
        'endTime': '',
        'sort': 'DESC'                        // 值为DESC|ASC时间排序方式，DESC:倒序，ASC升序，默认升序
      },
      tableDataHistory: [{
        number: '',
        name: '',
        info: '',
        status: '',
        value: '',
        time: ''
      }],
      time: [],
      // valueStart: '',                            // 选择时间实时双向绑定数据源
      // valueEnd: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()        // 禁用时间状态，不可以选择未来时间，后界限为当前时间
        }
      },
      valuetime: '',                                // [new Date(), new Date()]
      testVal: 'dukun',
      max_table_height: null, // 表格高度
      isFirstGetData: true, // 是否是第1次访问数据接口
      exportBtnShow: true, // 导出表格是否显示
      excelDataStr: '',    // excel表格数据存储，通过string字符串来存储
      isExport: false // 是否是导出表格
      // valueStart: '', // 开始时间
      // valueEnd: '' // 结束时间
    }
  },
  //
  // ***************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    
    // 修改表格最大高度
    this.max_table_height = document.documentElement.clientHeight - 195

    // // 测试数据
    // this.time = ['2019-05-12 16:00:00', '2019-06-10 22:18:44']
  },
  // 生命周期，安装期
  mounted: function () {
    // back.devInfoQue(this.param).then(function (response) {
    //   console.log(response)
    //   this.param.apiKey = response.data[0].apiKey
    //   this.param.deviceId = response.data[0].deviceId
    // }.bind(this))
    // 清空数据
    this.tableDataHistory = []                          // 页面表格显示'暂无数据'
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 时间发生变化
    timeChange (value) {
      console.log(value)
    },
    // 历史数据查询按键对应的方法
    queryHistoryBt: function () {
      console.log(this.time)
      this.param.startTime = this.time[0]
      this.param.endTime = this.time[1]
      // this.param.startTime = '2019-03-01 00:00:00'
      // this.param.endTime = '2019-05-31 00:00:00'
      // 后台查询历史报警数据
      this.backQueryHistory()
      // } catch (error) {
      //   console.log(error)
      // }
    },
    // 导出表格
    exportFunc () {
      this.param.startTime = this.time[0]
      this.param.endTime = this.time[1]
      console.log('导出表格')
      // ...下载数据...只允许下载一个月数据
      let dataLimit = 30 * 24 * 60 * 60 * 1000
      if (new Date(this.param.endTime).getTime() - new Date(this.param.startTime).getTime() >= dataLimit) {
        this.notificationInfo('提示：', '最多只允许下载30天数据')
        return
      }
      // 是导出表格
      this.isExport = true
      // 后台查询历史报警数据
      this.backQueryHistory()
    },
    // 支持大批量数据导出，目前测试15万行 30列通过，导出时间约为6秒
    toLargerCSV: function (param) {
      // CSV格式可以自己设定，适用MySQL导入或者excel打开。
      // 由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值” 
      var strTest = '行号,时间，ch1,ch2,ch3,ch4\n'
      let arrTest = [
        {ch1: 1, ch2: 2, ch3: 3, ch4: 4, time: '2019-05-01 03:06:43'},
        {ch1: 1, ch2: 2, ch3: 3, ch4: 4, time: '2019-05-01 03:06:43'},
        {ch1: 1, ch2: 2, ch3: 3, ch4: 4, time: '2019-05-01 03:06:43'},
        {ch1: 1, ch2: 2, ch3: 3, ch4: 4, time: '2019-05-01 03:06:43'}
      ]
      for (let i = 0; i < 4; i++) {
        // strTest += i.toString() + ',1234567890123456789\t,张三李四王五赵六,bbbb,\n'
        strTest += i.toString() + ',' + arrTest[i].time.replace(' ', 'T').toString() + ',' + arrTest[i].ch1.toString() + ',' +  arrTest[i].ch2.toString() + ',' + arrTest[i].ch3.toString() + ',' + arrTest[i].ch4.toString() + ',\n' 
      }
      let blob
      console.log('查询结束时间：' + new Date())
      if (param === 'downTest') {
        blob = new Blob([strTest], {type: 'text/plain;charset=utf-8'})
      } else {
        blob = new Blob([this.excelDataStr], {type: 'text/plain;charset=utf-8'})
      }
      // 解决中文乱码问题
      blob =  new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type})  
      let objectUrl = window.URL.createObjectURL(blob)
      var link = document.createElement('a')
      link.href = objectUrl
      link.download = '历史报警.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      // 每一次下载表格之后，对this.excelDataStr / this.isExport复位操作

      // 查到传感器名称之后，excel表格初始化
      var excelTitleStr = '序号' + ',' + '设备名称' + ',' + '触发器名称' + ',' + '信息' + ',' + '数值' + ',' + '时间'
      excelTitleStr += '\n'
      this.excelDataStr = excelTitleStr

      // 将是否是导出表格重置
      this.isExport = false
    },
    /*
    **  **********  API调用相关函数  ************
    */
    // 后台查询历史报警数据
    backQueryHistory: function () {
      back.getHisTrigger(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 1) {
          this.notificationInfo('错误提示：', response.error)
          return
        }
        var alarmData = []
        if (response.data !== undefined) {
          for (let i = 0; i < response.data.length; i++) {
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
          this.notificationInfo('提示：', response.error)
        }
        if (this.isExport === true) {
          // 查到传感器名称之后，excel表格初始化
          var excelTitleStr = '序号' + ',' + '设备名称' + ',' + '触发器名称' + ',' + '信息' + ',' + '数值' + ',' + '时间'
          excelTitleStr += '\n'
          this.excelDataStr = excelTitleStr

          for (let i = 0; i < alarmData.length; i++) {
            this.excelDataStr += (i + 1).toString()
            this.excelDataStr += ',' + alarmData[i].deviceName
            this.excelDataStr += ',' + alarmData[i].name.toString()
            this.excelDataStr += ',' + alarmData[i].content.toString()
            this.excelDataStr += ',' + alarmData[i].value.toString()
            this.excelDataStr += ',' + alarmData[i].time.replace(' ', 'T')
            this.excelDataStr +=  ',\n'
          }
          // 导出表格
          this.toLargerCSV()
        } else {
          // 查询数据
          this.tableDataHistory = alarmData
        }
        // 导出按钮显示
        // this.exportBtnShow = true
        // this.$nextTick(function () {
        //   // 判断是不是第1次获取数据
        //   if (this.isFirstGetData === true) {
        //   // 修改表格最大高度
        //     this.max_table_height = document.documentElement.clientHeight - 195
        //     document.querySelector('.is-scrolling-none').style.maxHeight = ''
        //     console.log(this.max_table_height)
        //     // 修改 是否是第1次访问数据接口
        //     this.isFirstGetData = false
        //   }
        // })
      }.bind(this))
    },
    /*
    //  ************  辅助函数  ************
    */
    // 开始时间选择改变，获取时间信息  （只要是改变都是通过@change事件来写的）
    getStartTime: function (datetime) {
      this.valueStart = datetime
      console.log(this.valueStart)
    },
    // 结束时间选择改变，获取时间信息
    getEndTime: function (datetime) {
      this.valueEnd = datetime
      console.log(this.valueEnd)
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
.alarmhistory{
  padding: 0;
  bottom: 0;
  width: 100%;
  position: relative;
}
.alarmhistory .top_search{
  position: absolute;
  top: -40px;
  right: 0;
}
.alarmhistory .time_select_div{
  width: 316px;
  background-color: #083948;
  border-color: transparent!important;
  margin-left: 15px;
  margin-right: 15px;
  font-size: 12px;
}
.el-range-editor .el-range-input{
  background-color: #083948;
  color: #fff;
  font-size: 12px;
} 
.el-date-editor .el-range-separator{
  color: #fff;
}
.table_bjls{
  margin-top: 30px;
}
.alarmhistory .searchBtn, .alarmhistory .exportBtn{
  font-size: 12px;
  /* padding: 7px 5px; */
}
/* 解决element-ui的表格设置固定栏后，边框线消失的bug */
.table_bjls .el-table__row td:not(.is-hidden):nth-child(1){
  bottom:-1px;
}
.table_bjls .el-table__row td:not(.is-hidden):nth-child(2){
  bottom:-1px;
}
.table_bjls .el-table__row td:not(.is-hidden):nth-child(3){
  bottom:-1px;
}
</style>
