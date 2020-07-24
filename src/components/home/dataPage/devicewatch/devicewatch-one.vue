<!-- 数据监测页面 -->
<template>
  <el-container>
    <!-- 主要内容区域 -->
    <div class="main">
      <!-- 选择设备区域 -->
      <div class="select_device">
        <!-- <span>设备类型选择：</span>
        <el-select
          v-model="deviceTypeSelected"
          size="small"
          placeholder="请选择"
          @change="deviceTypeChange"
        >
          <el-option
            v-for="(item, index) in deviceTypeObj"
            :key="index"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select> -->
        <el-button
          type="primary"
          
          style="margin-left:20px;"
          size="small"
          @click="mointorPointQueBt()"
        >刷新</el-button>
      </div>
      <!-- 表格信息区域 -->
      <!-- <el-row class="deviceTableDiv" v-if="moniterDataShow"> -->
        <el-row class="deviceTableDiv" v-loading="loading">
        <!-- 设备下的监控点信息表格 -->
        <el-table
          :data="sensorListData"
          :max-height="max_table_height"
          row-key="mac"
          size="medium"
          border
          class="deviceTable"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="belong" width="120" label="所属点" header-align="center"></el-table-column>
          <el-table-column prop="type" width="100" label="设备类型" header-align="center"></el-table-column>
          <el-table-column prop="name" width="100" label="设备名称" header-align="center"></el-table-column>
          <el-table-column v-for="(item, index) in tableCol" :key="index" :label='"传感器"+item' header-align="center">
            <template slot-scope="scope">
              <!-- <div v-if="scope.row['jkd' + index] !== undefined  && scope.row['jkd' + index].auth===1">
                <div class="tbcell_left">{{scope.row['jkd' + index].name}}</div>：
                <div class="tbcell_right tbcell_right1" v-if='scope.row.streams[index].isWarnSet===1&& scope.row.streams[index].dataType===1'>{{scope.row['jkd' + index].value}}</div>
                <div v-if="scope.row.streams[index].coefficient !== undefined ">
                  <div class="tbcell_right tbcell_right2" v-if='scope.row.streams[index].dataType===0&&scope.row.streams[index].isWarnSet===0'>{{scope.row['jkd' + index].value *scope.row.streams[index].coefficient }}</div>
                  <div class="tbcell_right" v-if='scope.row.streams[index].dataType===1&&scope.row.streams[index].isWarnSet===0'>{{scope.row['jkd' + index].value * scope.row.streams[index].coefficient}}</div>
                </div>
                <div v-else>
                  <div class="tbcell_right tbcell_right2" v-if='scope.row.streams[index].dataType===0&&scope.row.streams[index].isWarnSet===0'>{{scope.row['jkd' + index].value}}</div>
                  <div class="tbcell_right" v-if='scope.row.streams[index].dataType===1&&scope.row.streams[index].isWarnSet===0'>{{scope.row['jkd' + index].value}}</div>
                </div>
              </div>
              <div v-else> -</div> -->
              
              <div v-if="scope.row['jkd' + index] !== undefined  && scope.row['jkd' + index].auth===1">
                <div class="tbcell_left">{{scope.row['jkd' + index].name}}</div>：
                <div class="tbcell_right tbcell_right1" v-if='scope.row.streams[index].isWarnSet===1'>{{scope.row[`jkd${index}`].value}}</div>
                <div class="tbcell_right tbcell_right2" v-else-if='scope.row.streams[index].dataType===0 && scope.row[`jkd${index}`].value === 1'>{{scope.row[`jkd${index}`].value}}</div>
                <div class="tbcell_right" v-else>{{scope.row['jkd' + index].value}}</div>
              </div>
              <div v-else> -</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </el-container>
</template>
<script>
import Sortable from 'sortablejs'
import { back, onenet } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      lxctimer: null,
      param: {
        userId: '',
        sn: '',
        Authorization: '',
        apiKey: '',
        deviceId: '',
        limit: 3,
        start: '2018-12-01T00:00:00',
        // 数据流id数组
        datastreamId: []
      },
      loading: false,
      max_table_height: null, // 表格高度
      typeSelectedIndex: 0, // 当前选择的设备类型的索引
      typeSearchIndex: 0, // 当前搜索的设备类型的索引
      deviceTypeSelected: null, // 当前选择的设备类型
      // 全部类型设备的基本信息
      deviceTypeArr: [],
      deviceTypeObj: [],
      // 设备存储列表
      // deviceList: [],
      // 不同设备类型下的设备
      typeDeviceList: [],
      // 不同设备类型下的设备数据流信息
      // deviceTypeDatastream: [],
      // 不同设备类型下的设备数据流Id
      deviceTypeDatastreamId: [],
      // 不同设备类型下的数据流个数
      deviceTypeStreamLength: [],
      moniterDataShow: false, // 监控点表格显示标志位
      // 监控点表格数据
      sensorListData: [],
      // 表格的列
      tableCol: [],
      // 当前权限
      auth: ''
    }
  },
  created () {
    // 后台请求参数param设置
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // console.log(this.param.Authorization)
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    // 获取设备类型代表数字配置
    var deviceTypeArr = JSON.parse(sessionGetStore('deviceTypeArr'))
    this.deviceTypeArr = deviceTypeArr.slice(1)
    var deviceTypeObj = JSON.parse(sessionGetStore('deviceTypeObj'))
    this.deviceTypeObj = deviceTypeObj.slice(1)
    for (var i = 0; i < this.deviceTypeObj.length; i++) {
      this.deviceTypeStreamLength[i] = this.deviceTypeObj[i].streamNameList.length
    }
    // console.log(this.deviceTypeArr)
    // console.log(this.deviceTypeObj)
    
    // 获取当前权限
    this.auth = sessionGetStore('auth')
    // 表格数据初始化
    this.sensorListData = []
    
    // 修改表格最大高度
    this.max_table_height = document.documentElement.clientHeight - 195
  },
  watch: {
    deviceTypeSelected () {
      // console.log(this.deviceTypeSelected)
      this.typeSelectedIndex = this.deviceTypeSelected - 1
      // console.log(this.typeSelectedIndex)
    }
  },
  mounted: async function () {
    // 获取网关下监控点列表信息
    await this.backDevInfoQue()
    // onenet查询当前网关是否在线，若离线则不查询监控点数据
    this.queryDevStateOnenet()
    this.rowDrop()
  },
  beforeDestroy () {
    // 停止定时器
    window.clearInterval(this.timer)
    clearInterval(this.lxctimer)
  },
  methods: {
    /*
    //  ************  用户操作触发方法  ************
    */
    //行拖拽
    rowDrop() {
      if (sessionGetStore('onenb') === 'true') {
        console.log(sessionGetStore('onenb'))
        return
      }
      const el = document.querySelector('.deviceTable .el-table__body-wrapper > table > tbody')
      const _this = this
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        // handle: ".drag-item", // 指定推拽列
        setData: function (dataTransfer) {
          dataTransfer.setData("Text", "")
        },
        onEnd: evt => {
          this.$nextTick(() => {
            console.log(evt)
            console.log(evt.newIndex)
          	// 实现推拽的代码，先在原数组中删除当前推拽的对象，然后在将它添加到对应的位置
          	// targetObj当前推拽的对象，evt.oldIndex推拽对象原来的下标，evt.newIndex推拽对象要推拽到的下标
            let targetObj = this.sensorListData.splice(evt.oldIndex, 1)[0]
            _this.sensorListData.splice(evt.newIndex, 0, targetObj)
            let paramObj = {}
            paramObj.mac = targetObj.mac
            paramObj.isNb = 0
            if (_this.sensorListData[evt.newIndex-1]) {
              paramObj.prev = _this.sensorListData[evt.newIndex-1].pos
            }
            if (_this.sensorListData[evt.newIndex+1]) {
              paramObj.next = _this.sensorListData[evt.newIndex+1].pos
            }
            _this.gototableSort(paramObj)
          })
        }
      })
    },
    // 选择设备发生变化
    deviceTypeChange (value) {
      // 清除轮询查询
      clearInterval(this.lxctimer)
    },
    // 按键事件方法，监控信息查询
    mointorPointQueBt (item) {
      // 表格显示状态---隐藏
      // this.moniterDataShow = false
      // // 清空参数
      // this.param.datastreamId = []
      // // console.log('监控查询')
      // // 后台查询该设备下监控点数据流信息
      // // this.typeSelectedIndex = this.deviceTypeSelected - 1 // 选中设备类型的序号
      // // 设置数据流参数，以及数据流个数
      // this.typeSearchIndex = this.typeSelectedIndex
      // this.param.datastreamId = this.deviceTypeDatastreamId[this.typeSearchIndex]
      // // console.log(this.deviceTypeDatastreamId)
      // console.log(this.typeSearchIndex)
      // // console.log(this.param.datastreamId)
      
      // // 监控点个数
      // var colNum = this.deviceTypeStreamLength[this.typeSearchIndex]
      // // console.log(this.deviceTypeStreamLength)
      // // console.log(colNum)
      // // 表格的列
      // var tableColArr = []
      // for (var x = 0; x < colNum; x++) {
      //   tableColArr[x] = x + 1
      // }
      // // 表格的列---更新
      // this.tableCol = tableColArr
      // if (this.param.datastreamId.length !== 0) {
        
      // } else {
      //   this.notificationInfo('提示：', '没有相关类型设备数据')
      //   // return
      // }

      // 监控查询函数---初始查询
      this.monitorQueryFunc()
      this.notificationInfo('提示', '刷新成功')
      // 清除轮询查询
      // clearInterval(this.lxctimer)
      // 轮询查询
      // this.lxctimer = setInterval(this.monitorQueryFunc.bind(this), 5000)
    },
    // 监控查询函数
    monitorQueryFunc () {
      this.querydataOnenet(this.typeSearchIndex, '监控点名称')
    },
    // 行类名---通过设置类名来设置样式
    tableRowClassName ({row, rowIndex}) {
      // console.log(row)
      let className = ''
      if (row.isOnline === 0) {
        // 不在线
        className += 'offlineClass'
      }
      // if (row.isWarn === 1) {
      //   // 含有报警
      //   className += 'alarmClass '
      // }
      return className
    },
    /*
    //  ************  API调用相关函数  ************
    */
    // ***************   back   **************
    // 拖拽换行
    gototableSort: function (paramObj) {
      // console.log('查询设备的状态:1在线0离线')
      // console.log(this.param)
      back.gotableSort(paramObj).then(
        function (response) {
          console.log(response)
          this.backDevInfoQue()
        }.bind(this)
      )
    },
    // 后台查询网关下监控点列表信息
    backDevInfoQue: function () {
      return new Promise(
        function (resolve, reject) {
          back.relatioMonitorPoint(this.param)
            .then(function (response) {
              // 根据从缓存中取得的设备类型代表数字配置，为 不同设备类型下的设备数据流Id 和 不同设备类型下的设备 初始赋值
              var dtArr1 = []
              var dtArr2 = []
              var dtArr3 = []
              for (var i = 0; i < this.deviceTypeArr.length; i++) {
                dtArr1[i] = []
                dtArr2[i] = []
                dtArr3[i] = []
              }
              // 不同设备类型下的设备
              let arr = []
              let typeDeviceList = dtArr1
              // 不同设备类型下的设备数据流Id
              let deviceTypeDatastreamId = dtArr3
              // console.log(deviceTypeDatastreamId)
              if (response.errno !== 0) {
                this.notificationInfo('错误提示', response.error)
                reject()
              } else {
                // 遍历设备
                for (let i = 0; i < response.data.length; i++) {
                  let obj = {}
                  obj.name = response.data[i].name
                  obj.installTime = response.data[i].installTime
                  obj.mac = response.data[i].mac
                  obj.online = response.data[i].isOnline
                  obj.isWarn = response.data[i].isWarn
                  obj.station = response.data[i].station
                  obj.type = response.data[i].type
                  obj.streams = response.data[i].streams
                  // 遍历监控点
                  for (let j = 0; j < response.data[i].streams.length; j++) {
                    // 不同类型的设备
                    arr.push(response.data[i].streams[j].streamId)
                    deviceTypeDatastreamId[obj.type - 1][deviceTypeDatastreamId[obj.type - 1].length] = response.data[i].streams[j].streamId
                  }
                  // 不同类型的设备
                  typeDeviceList[obj.type - 1][typeDeviceList[obj.type - 1].length] = obj
                }
               
                resolve()
              }
              
              // this.deviceList = deviceList
              this.typeDeviceList = response.data
              // this.sensorListData = response.data
              // 监控点个数
              var colNum = this.deviceTypeStreamLength[this.typeSearchIndex]
              // console.log(this.deviceTypeStreamLength)
              // console.log(colNum)
              // 表格的列
              var tableColArr = []
              for (var x = 0; x < colNum; x++) {
                tableColArr[x] = x + 1
              }
              // 表格的列---更新
            
              this.tableCol = tableColArr
              // this.deviceTypeDatastream = deviceTypeDatastream
              // this.deviceTypeDatastreamId = deviceTypeDatastreamId
              this.param.datastreamId = arr
              this.monitorQueryFunc()
              clearInterval(this.lxctimer)
              // 轮询查询
              this.lxctimer = setInterval(this.monitorQueryFunc.bind(this), 5000)
            }.bind(this))
            .catch(function (error) {
              console.log(error)
              reject()
            })
        }.bind(this)
      )
    },
    // ******************   onenet   ****************************
    // 查询设备的状态:1在线0离线，决定是否显示监控点数据，及是否查询监控点，以节省带宽
    queryDevStateOnenet: function () {
      // console.log('查询设备的状态:1在线0离线')
      // console.log(this.param)
      onenet.onenetDevSingleQue(this.param).then(
        function (response) {
          // console.log(response)
          if (!response.data.online) {
            this.param.online = 0
            // this.moniterDataShow = false
          } else {
            this.param.online = 1
          }
        }.bind(this)
      )
    },
    // 查询onenet上的最新监控点数据（只返回有数据的监控点的信息）
    querydataOnenet: function (deviceIndex, monitorPointName) {
      // 实际数据
      // this.loading = true
      onenet.onenetLimitHisQue(this.param).then(
        function (response) {
          // this.loading = false
          // 回调函数为空，重复发送一次
          if (response.errno === undefined) {
            // 查询onenet上的最新监控点数据
            this.querydataOnenet(deviceIndex, monitorPointName)
            return
          }
          if (response.errno !== 0) {
            // this.notificationInfo('错误提示：', response.error)
            this.sensorListData = []
            // 表格显示状态---显示
            this.moniterDataShow = true
            return
          }
          if (response.data.length === 0) {
            // 无数据
            return
          }
          // 目标类型的设备列表
          var targetDevieType = this.typeDeviceList
          let arr = []
          console.log(targetDevieType)
          // 遍历目标类型的设备列表
          for (var j = 0; j < targetDevieType.length; j++) {
            let obj = targetDevieType[j]
            if (obj.type === 1 || obj.type === 'ISPD') {
              obj.type = 'ISPD' 
            } else {
              obj.type = 'CJ485'
            }
            // 遍历目标类型的设备列表中每个设备的监控点信息
            for (var k = 0; k < obj.streams.length; k++) {
              // 遍历实时数据
              for (let i = 0; i < response.data.length; i++) {
                // 实时数据中的监控点id 与 某设备的某个监控点 相对应
                if (response.data[i].id === obj.streams[k].streamId) {
                  obj['jkd' + k] = {
                    name: obj.streams[k].name, // 监控点名称
                    auth: obj.streams[k].auth // 监控点是否显示
                    // value: response.data[i].current_value !== undefined ? response.data[i].current_value : '空'  // 监控点数值
                  }
                  // console.log(response.data[i].current_value, obj.streams[k].streamId, obj.streams[k])
                  if (response.data[i].current_value !== undefined) {
                   
                    // 判断当前搜索的设备类型的索引
                    // if (this.typeSearchIndex === 1) {
                      // 是cj485
                      // 判断是不是
                      if (i % 9 === 6 || i % 9 === 8) {
                        // 是 接地电阻阻值或者雷击峰值
                        if (isNaN(parseFloat(response.data[i].current_value)) === false) {
                          // 是数字
                          obj['jkd' + k].value = response.data[i].current_value / 10  // 监控点数值
                        } else {
                          // 不是数字
                          obj['jkd' + k].value = response.data[i].current_value  // 监控点数值
                        }
                      } else {
                        // 不是 接地电阻阻值或者雷击峰值
                        obj['jkd' + k].value = response.data[i].current_value  // 监控点数值
                      }
                      if (obj.streams[k].coefficient !== undefined) {
                        obj['jkd' + k].value = obj.streams[k].coefficient *  obj['jkd' + k].value 
                      }
                  } else {
                    obj['jkd' + k].value = '空'  // 监控点数值
                  }
                }
              }
            }
            arr.push(obj)
          }
          
          this.sensorListData = arr
          console.log(this.sensorListData)
          // 表格显示状态---显示
          this.moniterDataShow = true
        }.bind(this)
      )
    },
    /*
    //  ************  辅助方法函数  ************
    */

    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', { style: 'color: teal' }, `${messagePara}`)
      })
    }
   
  }
}
</script>
<style scoped>
.main {
  width: 100%;
  text-align: left;
  position: relative;
}
.select_device {
  position: absolute;
  right: 0;
  top: -40px;
  z-index: 2;
  color: #fff;
}
.select_device .el-button--primary {
  color: #05494f;
  font-size: 14px;
}

.deviceInfoDiv .styleLeft {
  margin-left: 20px;
}
.el-table >>> .theone {
  color: #dc143c;
}
.el-table >>> .thetwo {
  color: #00ffff;
}
.el-table >>> .thethree {
  color: #00008b;
}
.el-table >>> .thefour {
  color: #008b8b;
}
.deviceTableDiv {
  margin-top: 30px;
}
.deviceTable {
  width: 100%;
}
</style>
<style lang="scss">
.deviceTableDiv .deviceTable td,
.deviceTableDiv .deviceTable th {
  height: 40px;
}
.deviceTable td .el-button--medium {
  padding: 0 20px;
}
.select_device .el-select .el-input__inner {
  background-color: #073846;
  border-color: transparent !important;
  color: #fff;
}
.deviceTableDiv .deviceTable {
  .tbcell_left {
    display: inline-block;
  }
  .tbcell_right {
    display: inline-block;
 
  }
  .tbcell_right1 {
   
    color:red
  }
  .tbcell_right2{
    color:rgb(34, 177, 70)
  }
}

.deviceTable {
  .offlineClass {
    background-color: #999;
    td {
      div {
        color: #444!important;
      }
    }
  }
  .alarmClass {
    td {
      div {
        color: red;
      }
    }
  }
}
</style>
