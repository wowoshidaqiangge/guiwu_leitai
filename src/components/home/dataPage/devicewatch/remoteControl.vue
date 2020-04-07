<!-- 远程控制页面 -->
<template>
  <el-container>
    <!-- 主要内容区域 -->
    <div class="main">
      <!-- 表格信息区域 -->
      <el-row class="deviceTableDiv">
        <!-- 设备下的远程控制信息表格 -->
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
                    @change="switchChange($event, scope.$index, index)"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="scope.row.online!==1"
                    >
                  </el-switch>
                </div>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
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
        // {
        //   name: '设备1',
        //   jkd0: {
        //     name: '远程控制1-1',
        //     auth: 1,
        //     status: 1
        //   },
        //   jkd1: {
        //     name: '远程控制1-2',
        //     auth: 1,
        //     status: 0
        //   },
        //   jkd2: {
        //     name: '远程控制1-3',
        //     auth: 1,
        //     status: 1
        //   },
        //   jkd3: {
        //     name: '远程控制1-4',
        //     auth: 1,
        //     status: 1
        //   }
        // },
        // {
        //   name: '设备2',
        //   jkd0: {
        //     name: '远程控制2-1',
        //     auth: 0,
        //     status: 1
        //   },
        //   jkd1: {
        //     name: '远程控制2-2',
        //     auth: 1,
        //     status: 0
        //   },
        //   jkd2: {
        //     name: '远程控制2-3',
        //     auth: 1,
        //     status: 1
        //   },
        //   jkd3: {
        //     name: '远程控制2-4',
        //     auth: 0,
        //     status: 0
        //   }
        // },
        // {
        //   name: '设备3',
        //   jkd0: {
        //     name: '远程控制3-1',
        //     auth: 1,
        //     status: 1
        //   },
        //   jkd1: {
        //     name: '远程控制3-2',
        //     auth: 1,
        //     status: 1
        //   },
        //   jkd2: {
        //     name: '远程控制3-3',
        //     auth: 1,
        //     status: 1
        //   },
        //   jkd3: {
        //     name: '远程控制3-4',
        //     auth: 1,
        //     status: 1
        //   }
        // }
      ],
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
    // 获取网关下监控点列表信息
    await this.backDevInfoQue()
    // 轮询查询---获取网关下监控点列表信息
    this.lxctimer = setInterval(this.backDevInfoQue.bind(this), 4000)
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
    // 开关操作
    switchChange (newVal, scopeIndex, colIndex) {
      // newVal：新值, scopeIndex：行的序号, colIndex：列的序号
      console.log(newVal)
      console.log(scopeIndex)
      console.log(colIndex)
      // console.log(this.remoteControlData)
      var paramObj = {
        sn: sessionGetStore('deviceSNNow'), // 网关sn
        mac: this.remoteControlData[scopeIndex].mac, // 设备mac
        streamId: this.remoteControlData[scopeIndex].streams[colIndex].streamId, // 数据流id
        value: newVal // 值
      }
      // console.log(paramObj)
      back.remoteControl(paramObj).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 修改页面效果
          this.$set(this.remoteControlData[scopeIndex], ['jkd' + colIndex].value, newVal)
          // 此方法只会改变值，页面不生效
          // this.remoteControlData[scopeIndex]['jkd' + colIndex].value = newVal
          this.notificationInfo('提示', '远程控制成功')
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
      if (row.online === 1) {
        // 在线
        return ''
      } else if (rowIndex === 0) {
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
                  if (response.data[i].type === 1) {
                    // 设备是ispd设备
                    let obj = {}
                    obj.name = response.data[i].name
                    obj.mac = response.data[i].mac
                    obj.online = response.data[i].isOnline
                    obj.isWarn = response.data[i].isWarn
                    var streamsArr = response.data[i].streams.slice(-4)
                    obj.streams = streamsArr
                    deviceListArr[deviceListArr.length] = obj
                  }
                }
                // 设备列表数据---更新
                this.deviceListInfo = deviceListArr
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
          console.log(this.remoteControlData)
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
