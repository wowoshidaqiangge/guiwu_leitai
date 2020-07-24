<!-- 远程控制页面 -->
<template>
  <el-container>
    <!-- 主要内容区域 -->
    <div class="main">
      <div class="select_device" v-if='nbsure'>
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
      
      </div>
      <!-- 表格信息区域 -->
      <el-row class="deviceTableDiv">
        <!-- 设备下的远程控制信息表格 -->
        <div v-if="nbsure">
          <el-table
            :data="remoteControlData"
            :max-height="max_table_height"
            size="medium"
            border
            class="deviceTable"
            :row-class-name="tableRowClassName"
            v-if="tableShow"
          >
            <el-table-column prop="name" width="200" label="设备名称" header-align="center"></el-table-column>
          
              <el-table-column v-for="(item, index) in tableCol" :key="index" :label='"控制"+item' header-align="center">
              <template slot-scope="scope">
                <div v-if="(scope.row.streams[index]&&scope.row.streams[index].dataType==0)">
                  <div class="tbcell_left">{{scope.row[`name${index}`]}}</div>：
                  <div class="tbcell_right"  >
                    <el-switch
                      v-model="scope.row['value' + index]"
                      @click.native="switchChange1($event, scope, index,scope.row['value' + index])"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value="1"
                      :disabled="scope.row.isOnline!==1"
                      inactive-value="0"
                    >
                    </el-switch>
                  </div>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if='!nbsure'>
          <el-table
            :data="remoteControlData"
            :max-height="max_table_height"
            size="medium"
            border
            class="deviceTable"
            :row-class-name="tableRowClassName"
            v-if="tableShow"
          >
            <el-table-column prop="name" width="200" label="设备名称" header-align="center"></el-table-column>
            <el-table-column v-for="(item, index) in tableCol" :key="index" :label='"控制"+item' header-align="center">
              <template slot-scope="scope">
                <div v-if="scope.row['jkd' + index].auth===1">
                  <div class="tbcell_left">{{scope.row['jkd' + index].name}}</div>：
                  <div class="tbcell_right">
                    <el-switch
                      v-model="scope.row['jkd' + index].value"
                      @click.native="switchChange($event, scope.$index, index)"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="1"
                      :inactive-value="0"
                      :disabled="scope.row.isOnline!==1"
                      >
                    </el-switch>
                  </div>
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
             
          </el-table>
        </div>
        
      </el-row>
    </div>
  </el-container>
</template>
<script>
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
      // 表格是否显示
      tableShow: false,
      max_table_height: null, // 表格高度
      // 设备列表数据
      deviceListInfo: [],
      // 监控点表格数据
      remoteControlData: [
      ],
      // 表格的列
      tableCol: [],
      // 当前权限
      auth: '',
      nbsure: false
    }
  },
  created () {
    // 后台请求参数param设置
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    
    // 获取当前权限
    this.auth = sessionGetStore('auth')
    // 表格数据初始化
    // this.remoteControlData = []
    // 表格的列
    var tableColArr = []
    for (var x = 0; x < 4; x++) {
      tableColArr[x] = x + 1
    }
    // 表格的列---更新
    this.tableCol = tableColArr
    this.max_table_height = document.documentElement.clientHeight - 195
  },
  mounted: async function () {
    let isnb = sessionGetStore('isnb')
    if (isnb === 'true') {
      console.log('11111')
      this.nbsure = true
      await this.getrelatioNbstreams()
      this.lxctimer = setInterval(this.getrelatioNbstreams.bind(this), 5000)
      // debugger
    } else {
      this.nbsure = false
      // 获取网关下监控点列表信息
      await this.backDevInfoQue()
      // 轮询查询---获取网关下监控点列表信息
      this.lxctimer = setInterval(this.backDevInfoQue.bind(this), 5000)
    }
  },
  beforeDestroy () {
    // 停止定时器
    window.clearInterval(this.timer)
    clearInterval(this.lxctimer)
  },
  methods: {
   
    getrelatioNbstreams: function () {
      // return new Promise(
      //   function (resolve, reject) {
          back.relatioNbstreams(this.param)
            .then(function (response) {
              if (response.errno !== 0) {
                this.notificationInfo('错误提示', response.error)
                reject()
              } else {
                // 遍历设备
                let arr = []
                let arr1 = []
                for (let a = 0; a < 12; a++) {
                  arr.push({prop: `value${a}`, num: a + 1})
                }
                response.data.map((item, index) => {
                  item.streams.map((v, m) => {
                    item[`name${m}`] = v.name
                  })
                  arr1.push(item)
                })
                // this.tableCol = arr
                this.sensorListData1 = arr1
                this.nbgetnbcurrent1()
              }
            }.bind(this))
        // }.bind(this))
    }, 
    nbgetnbcurrent1 () {
      return new Promise(
        function (resolve, reject) {
      
          back.getnbcurrent({groupUid: this.param.sn})
            .then(function (response) {
            
              let senlist = this.sensorListData1
              response.data.map((item, index) => {
                let a = senlist.filter(v => v.mac === item.mac)
                senlist.slice(index, 1)
                a[0].streams.map((it, num) => {
                  let issure1 =  item.datas.filter(v => v.streamId === it.streamId)
                  if (issure1.length > 0) {
                    a[0][`value${num}`] =  issure1[0].value
                  }
                })
              })
            
              this.remoteControlData = senlist
              this.tableShow = true
             
            }.bind(this))
        }.bind(this))
    },   
    /*
    //  ************  用户操作触发方法  ************
    */
    switchChange1 (newVal, scopeIndex, colIndex,val) {
      // newVal：新值, scopeIndex：行的序号, colIndex：列的序号
      // console.log(this.remoteControlData,scopeIndex)
      if (this.remoteControlData[scopeIndex.$index].isOnline !== 1) {
        return
      }
      // console.log(this.remoteControlData[scopeIndex.$index]['value' + colIndex],newVal, scopeIndex, colIndex)
      var paramObj = {
       
        mac: scopeIndex.row.mac, // 设备mac
        type: 2, // 数据流id
        controlBit: colIndex + 1, // 值
        value: val
      }
      this.remoteControlData[scopeIndex.$index]['value' + colIndex] = val==="0" ? "1":"0"
      clearInterval(this.lxctimer)
      // console.log(paramObj)
      back.nbcommand(paramObj).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.lxctimer = setInterval(this.backDevInfoQue.bind(this), 5000)
          this.notificationInfo('错误提示', response.error)
        } else {
          // 修改页面效果
          // this.$set(this.remoteControlData[scopeIndex], ['jkd' + colIndex].value, newVal)
          // 此方法只会改变值，页面不生效
          // this.remoteControlData[scopeIndex]['jkd' + colIndex].value = newVal
          
          this.notificationInfo('提示', '远程控制成功')
          this.lxctimer = setInterval(this.getrelatioNbstreams.bind(this), 5000)
        }
        // setTimeout(() =>  {
        //   this.getrelatioNbstreams()
        //   this.lxctimer = setInterval(this.getrelatioNbstreams.bind(this), 6000)
        // }, 8000);
      }.bind(this))
    },
    // 开关操作
    // 
    switchChange (newVal, scopeIndex, colIndex) {
      // newVal：新值, scopeIndex：行的序号, colIndex：列的序号
  
      if (this.remoteControlData[scopeIndex].isOnline !== 1) {
        return
      }
      // console.log(this.remoteControlData[scopeIndex]['jkd' + colIndex].value, scopeIndex, colIndex)
      var paramObj = {
        sn: sessionGetStore('deviceSNNow'), // 网关sn
        mac: this.remoteControlData[scopeIndex].mac, // 设备mac
        streamId: this.remoteControlData[scopeIndex].streams[colIndex].streamId, // 数据流id
        value: this.remoteControlData[scopeIndex]['jkd' + colIndex].value // 值
      }
      clearInterval(this.lxctimer)
      // console.log(paramObj)
      back.remoteControl(paramObj).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.lxctimer = setInterval(this.backDevInfoQue.bind(this), 5000)
          this.notificationInfo('错误提示', response.error)
        } else {
          // 修改页面效果
          // this.$set(this.remoteControlData[scopeIndex], ['jkd' + colIndex].value, newVal)
          // 此方法只会改变值，页面不生效
          // this.remoteControlData[scopeIndex]['jkd' + colIndex].value = newVal
          this.notificationInfo('提示', '远程控制成功')
          this.lxctimer = setInterval(this.backDevInfoQue.bind(this), 5000)
          // setTimeout(() =>  {
            // this.lxctimer = setInterval(this.backDevInfoQue.bind(this), 6000)
            // this.remoteControlData[scopeIndex]['jkd' + colIndex].value = !this.remoteControlData[scopeIndex]['jkd' + colIndex].value
          // }, 8000);
        }
      }.bind(this))
    },
    // 监控信息查询前置方法
    mointorInfoInit (item) {
      // 表格显示状态---隐藏
      // this.tableShow = false
      var datastreamId = []
      // var streamInfo = []
      // 遍历设备列表
      for (var i = 0; i < this.deviceListInfo.length; i++) {
        // 遍历监控点列表
        for (var j = 0; j < this.deviceListInfo[i].streams.length; j++) {
          datastreamId[datastreamId.length] = this.deviceListInfo[i].streams[j].streamId
          // streamInfo[streamInfo.length] = this.deviceListInfo[i].streams[j]
        }
      }
      this.param.datastreamId = datastreamId

      // console.log(this.param.datastreamId)

      if (this.param.datastreamId.length !== 0) {
        
      } else {
        this.notificationInfo('提示：', '没有相关类型设备数据')
        return
      }

      // 监控查询函数---初始查询
      this.monitorQueryFunc()
      // 清除轮询查询
      // clearInterval(this.lxctimer)
      // // 轮询查询---获取实时数据
      // this.lxctimer = setInterval(this.monitorQueryFunc.bind(this), 6000)
    },
    // 监控查询函数
    monitorQueryFunc () {
      this.querydataOnenet(this.typeSearchIndex, '监控点名称')
    },
    // 行类名---通过设置类名来设置样式
    tableRowClassName ({row, rowIndex}) {
     
      // console.log(row)
      if (row.isOnline === 1) {
        // 在线
        return ''
      } else {
        // 不在线
        return 'offlineClass '
      }
    },
    /*
    //  ************  API调用相关函数  ************
    */
    // ***************   back   **************
    // 后台查询网关下监控点列表信息
    backDevInfoQue: function () {
      return new Promise(
        function (resolve, reject) {
          back.relatioMonitorPoint(this.param)
            .then(function (response) {
              console.log('22222222222------------------')
              if (response.errno !== 0) {
                this.notificationInfo('错误提示', response.error)
                reject()
              } else {
                // var deviceListArr = []
                // // 遍历设备
                // for (let i = 0; i < response.data.length; i++) {
                //   if (response.data[i].type === 1) {
                //     // 设备是ispd设备
                //     let obj = {}
                //     obj.name = response.data[i].name
                //     obj.mac = response.data[i].mac
                //     var streamsArr = response.data[i].streams.slice(-4)
                //     obj.streams = streamsArr
                //     deviceListArr[deviceListArr.length] = obj
                //   }
                // }
                // // 设备列表数据---更新
                // this.deviceListInfo = deviceListArr
                var deviceListArr = []
                // 遍历设备
                for (let i = 0; i < response.data.length; i++) {
                  if (response.data[i].type === 1 || response.data[i].type === 3) {
                    // 设备是ispd设备
                    let obj = {}
                    obj.name = response.data[i].name
                    obj.mac = response.data[i].mac
                    obj.isOnline = response.data[i].isOnline
                    obj.isWarn = response.data[i].isWarn
                    var streamsArr = response.data[i].streams.slice(-4)
                    obj.streams = streamsArr
                    deviceListArr[deviceListArr.length] = obj
                  }
                }
                
                // 设备列表数据---更新
                this.deviceListInfo = deviceListArr
                // debugger
                // console.log(this.deviceListInfo)
                // 监控信息查询前置方法
                this.mointorInfoInit()
                resolve()
              }
            }.bind(this))
            .catch(function (error) {
              console.log(error)
              reject()
            })
        }.bind(this)
      )
    },
    // ******************   onenet   ****************************
    // 查询onenet上的最新监控点数据（只返回有数据的监控点的信息）
    querydataOnenet: function (deviceIndex, monitorPointName) {
      // 实际数据
      onenet.onenetLimitHisQue(this.param).then(
        function (response) {
          // 回调函数为空，重复发送一次
          if (response.errno === undefined) {
            // 查询onenet上的最新监控点数据
            this.querydataOnenet(deviceIndex, monitorPointName)
            return
          }
          if (response.errno !== 0) {
            this.notificationInfo('错误提示：', response.error)
            return
          }
          if (response.data.length === 0) {
            // 无数据
            return
          }
          if (response.data[0].current_value === undefined) {
            // 平台无数据
            return
          }
          // 遍历实时数据
          for (var j = 0; j < this.deviceListInfo.length; j++) {
            // 遍历设备列表
            for (let i = 0; i < response.data.length; i++) {
              // 遍历设备列表中每个设备的监控点信息
              for (var k = 0; k < this.deviceListInfo[j].streams.length; k++) {
                // 实时数据中的监控点id 与 某设备的某个监控点 相对应
                if (response.data[i].id === this.deviceListInfo[j].streams[k].streamId) {
                  this.deviceListInfo[j]['jkd' + k] = {
                    name: this.deviceListInfo[j].streams[k].name, // 监控点名称
                    auth: this.deviceListInfo[j].streams[k].auth, // 监控点是否显示
                    value: response.data[i].current_value !== undefined ? response.data[i].current_value : '空'  // 监控点数值
                  }
                }
              }
            }
          }
          this.remoteControlData = this.deviceListInfo
          // 表格显示状态---显示
          this.tableShow = true
          // console.log(this.remoteControlData)
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
} 
.deviceTable {
  .offlineClass {
    background-color: #999;
    td {
      div {
        color: #444;
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
