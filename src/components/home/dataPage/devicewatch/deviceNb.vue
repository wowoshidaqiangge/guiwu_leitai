<!-- 数据监测页面 -->
<template>
  <el-container>
    <!-- 主要内容区域 -->
    <div class="main">
      <!-- 选择设备区域 -->
      <div class="select_device">
      </div>
      <!-- 表格信息区域 -->
      <!-- <el-row class="deviceTableDiv" v-if="moniterDataShow"> -->
       
        <el-row class="deviceTableDiv" v-loading="loading">
        <!-- 设备下的监控点信息表格 -->
        <el-table
          :data="sensorListData"
          border
          class="deviceTable"
          row-key="mac"
          align="left"
          :max-height="max_table_height"
          :row-class-name="tableRowClassName"
          size="medium">
          <!-- <el-table-column v-for="(item, index) in col"
            :key="`col_${index}`"
            :prop="dropCol[index].prop"
            :label="item.label"> 
          </el-table-column> -->
          <el-table-column prop="name" width="100" label="设备名称" header-align="center"></el-table-column>
          <el-table-column v-for="(item, index) in tableCol" :key="index" :label="'传感器'+item.num"  header-align="center">
             <template slot-scope="scope">
              <div v-if="scope.row.streams[index]&&scope.row.streams[index].auth != undefined &&scope.row.streams[index].auth===1">
                <div class="tbcell_left">{{scope.row[`name${index}`]}}</div>：
                 <div class="tbcell_right tbcell_right1" v-if='scope.row.streams[index].isWarnSet===1'>{{scope.row[`value${index}`]}}</div>
                <div class="tbcell_right tbcell_right2" v-else-if='scope.row.streams[index].dataType===0&&scope.row[`value${index}`] === 1'>{{scope.row[`value${index}`]}}</div>
                <div class="tbcell_right" v-else>{{scope.row[`value${index}`]}}</div>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            header-align="center">
            <template slot-scope="scope">
              <el-button @click="clickdevice(scope.row, 1)" type="text" size="small">查询状态</el-button>
              <el-button @click="clickdevice(scope.row, 0)" type="text" size="small">计数清零</el-button>
              <!-- <el-button @click="clickdevice(scope.row, 2)" type="text" size="small">远控清零</el-button> -->
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
     col: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      dropCol: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      tableData: [
        {
          id: '1',
          date: '2016-05-01',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 101 弄'
        },
        {
          id: '2',
          date: '2016-05-02',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 102 弄'
        },
        {
          id: '3',
          date: '2016-05-03',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 103 弄'
        },
        {
          id: '4',
          date: '2016-05-04',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 104 弄'
        }
      ],
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
      mac: '',
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
      sensorListData1:[],
      // 表格的列
      tableCol: [],
      // 当前权限
      auth: ''
    }
  },
  created () {
   
    // 后台请求参数param设置
    // this.param.userId = sessionGetStore('userId')
    // this.param.Authorization = sessionGetStore('Authorization')
    // console.log(this.param.Authorization)
    // this.mac = sessionGetStore('nbmac')
    if (sessionGetStore('onenb') === 'false') {
      this.param.sn = sessionGetStore('groupid')
    } else {
      this.param.sn = sessionGetStore('nbmac')
    }
    this.param.groupUid = sessionGetStore('groupid')
    // this.param.apiKey = sessionGetStore('apikeyNow')
    // this.param.deviceId = sessionGetStore('deviceIdNow')
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
      console.log(this.deviceTypeSelected)
      this.typeSelectedIndex = this.deviceTypeSelected - 1
      // console.log(this.typeSelectedIndex)
    }
  
  },
  mounted: async function () {
    // this.$bus.$off('isnb').$on('isnb', target => {
    //   this.backDevInfoQue()
    // })
    // 获取网关下监控点列表信息
    await this.backDevInfoQue()
    await this.rowDrop()
    // await this.nbgetnbcurrent()
    // onenet查询当前网关是否在线，若离线则不查询监控点数据
    // this.queryDevStateOnenet()
  },
  beforeDestroy () {
    // 停止定时器
    window.clearInterval(this.lxctimer)
    clearInterval(this.lxctimer)
    console.log(this.lxctimer)
     
  },
  methods: {
    //行拖拽
    rowDrop() {
      if (sessionGetStore('onenb') !== 'false') {
        return
      }
      const el = document.querySelector('.el-table__body-wrapper tbody')
      console.log(el)
      const _this = this
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        // handle: ".drag-item", // 指定推拽列
        setData: function (dataTransfer) {
          dataTransfer.setData("Text", "")
        },
        onEnd: evt => {
          this.$nextTick(() => {
          	// 实现推拽的代码，先在原数组中删除当前推拽的对象，然后在将它添加到对应的位置
          	// targetObj当前推拽的对象，evt.oldIndex推拽对象原来的下标，evt.newIndex推拽对象要推拽到的下标
            let targetObj = _this.sensorListData.splice(evt.oldIndex, 1)[0]
            console.log(targetObj)
            _this.sensorListData.splice(evt.newIndex, 0, targetObj)
            let paramObj = {}
            paramObj.mac = targetObj.mac
            paramObj.isNb = 1
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
    clickdevice (row, id) {
      console.log(row)
      var paramObj = {
        mac: row.mac, // 设备mac
        type: id,  // 数据流id
        controlBit: 0
      }
      // console.log(paramObj)
      back.nbcommand(paramObj).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.notificationInfo('提示', '远程控制成功')
        }
        this.mointorPointQueBt()
      }.bind(this))
    },
    // 获取数据列表
    nbgetnbcurrent () {
      return new Promise(
        function (resolve, reject) {
          console.log('定时器')
          back.getnbcurrent({groupUid: this.param.groupUid})
            .then(function (response) {
              let senlist = this.sensorListData1
              if (this.sensorListData1.length === 0) {
                 this.sensorListData = []
                return
              }
              response.data.map((item, index) => {
                // debugger
                let a = senlist.filter(v => v.mac === item.mac)
                senlist.slice(index, 1)
                if (a.length!== 0) {
                  a[0].streams.map((it, num) => {
                    let issure1 =  item.datas.filter(v => v.streamId === it.streamId)
                    if (issure1.length > 0) {
                      a[0][`value${num}`] =  issure1[0].value
                    }
                    if (it.coefficient !== undefined) {
                      a[0][`value${num}`] =  a[0][`value${num}`] * it.coefficient
                    }
                  })
                }
              })              
              // console.log(senlist)
              this.sensorListData = senlist
              // let arr = []
              // let arr1 = []
              // let obj = {}
              // a[0].streams.map((item, index) => {
              //   let issure1 =  response.data.filter(v => v.streamId === item.streamId)
              //   arr.push({prop: `value${index}`, label: item.name, num: index + 1})
              //   obj[`value${index}`] =  issure1[0].value
              //   obj[`name${index}`] = item.name
              // })
              // this.sensorListData.push(obj)
              // this.tableCol = arr
              // console.log(a, obj, arr)
              // this.typeDeviceList.map((item, index) => {
              //   obj.title = item.name
              //   item.streams.map((v, m) => {
              //     let issure1 =  response.data.filter(v => v.streamId === item.streamId)
              //     arr.push({prop: `value${index}`, label: item.name, num: index + 1})
              //     obj[`value${index}`] =  issure1[0].value
              //     obj[`name${index}`] = item.name
              //   })
              // })
            }.bind(this))
        }.bind(this))
    },
    /*
    //  ************  用户操作触发方法  ************
    */
 
    // 按键事件方法，监控信息查询
    mointorPointQueBt (item) {
   
      // 监控查询函数---初始查询
      this.backDevInfoQue()
      this.nbgetnbcurrent()
      this.notificationInfo('提示', '刷新成功')
      // // 清除轮询查询
      // clearInterval(this.lxctimer)
      // // 轮询查询
      // this.lxctimer = setInterval(this.nbgetnbcurrent.bind(this), 5000)
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
   
      return className
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
    // 后台查询网关下监控点列表信息
    backDevInfoQue: function () {
      return new Promise(
        function (resolve, reject) {
          // var url = window.location.href
          // console.log(url)
          if (sessionGetStore('onenb') === 'false') {
            this.param.sn = sessionGetStore('groupid')
          } else {
            this.param.sn = sessionGetStore('nbmac')
          }
          back.relatioNbstreams({sn: this.param.sn})
            .then(function (response) {
              if (response.errno !== 0) {
                this.notificationInfo('错误提示', response.error)
                reject()
              } else {
                if (response.data.length === 0) {
                  this.tableCol = []
                  this.sensorListData = []
                  return
                }
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
                this.tableCol = arr
                this.sensorListData1 = arr1
                this.nbgetnbcurrent()
                resolve()
                if (this.lxctimer) {
                  clearInterval(this.lxctimer)
                }
                console.log(this.lxctimer)
                // 轮询查询
                this.lxctimer = setInterval(this.nbgetnbcurrent.bind(this), 5000)
              }
            }.bind(this))
            .catch(function (error) {
              console.log(error)
              reject()
            })
        }.bind(this)
      )
    },
    // 拖拽换行
    gototableSort: function (paramObj) {
      // console.log('查询设备的状态:1在线0离线')
      // console.log(this.param)
      back.gotableSort(paramObj).then(
        function (response) {
          console.log(response)
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
  .el-table__row {
    height: 100px;
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
