<template>
  <el-container>
    <div class="alarmregister">
      <!-- 触发器列表 -->
      <el-main class="alarmregistermain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="alarmTableData"
          border
          style="width: 100%"
          :max-height="max_table_height">
          <el-table-column prop="number" label="序号" header-align="center" width="100px"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" header-align="center" min-width="10%"></el-table-column>
          <el-table-column prop="streamName" label="监控点名称" header-align="center" min-width="20%"></el-table-column>
          <el-table-column prop="name" label="触发器名称" header-align="center" min-width="10%"></el-table-column>
          <el-table-column prop="factor" label="触发条件" header-align="center" min-width="20%"></el-table-column>
          <el-table-column prop="content" label="报警内容" header-align="center" min-width="20%"></el-table-column>
          <el-table-column label="操作" header-align="center" min-width="10%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-delete" v-show="(param.auth <= shareAdminAuth)" @click="registerDeleteBt(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 添加触发器按钮 -->
      <div class="addregister">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" v-show="(param.auth <= shareAdminAuth)" @click="registerAddInitBt">添加触发器</el-button>
      </div>
      <!-- 添加触发器弹窗 -->
      <el-dialog title="添加触发器" width="430px" top="50px" :visible.sync="dialogFormVisible" center>
        <el-form class="form_box" v-for='(item, index) in formArr' :key="index" :model="item" :inline="true">
          <el-form-item label="触发器名称" :label-width="formLabelWidth">
            <el-input v-model="item.name" placeholder="请输入触发器名称"></el-input>
          </el-form-item>
          <el-form-item label="报警类型" :label-width="formLabelWidth">
            <el-cascader
              :options="monitorTypeOption"
              v-model="item.currentMonitorType"
              @change="monitorChange($event, index)">
              <!-- :show-all-levels="false" -->
            </el-cascader>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-select v-model="item.type" placeholder="请选择类型">
              <el-option v-for="(childItem, childIndex) in item.typeAllOption" :key="childIndex" :label="childItem.label" :value="childItem.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数值" :label-width="formLabelWidth">
            <el-input-number v-model="item.threshold" :disabled="!item.thresholdOption.input" :controls="item.thresholdOption.input" controls-position="right" :min="0" :max="65535"></el-input-number>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="item.content" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn_box">
          <div @click="addAlarmForm" class="btnAddForm">+</div>
        </div>
        <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
        <div slot="footer" class="dialog-footer">
          <el-button class="btn_cancel_dialog" @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="registerAddOrEdit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
// 引入模块报警配置文件
import modularAlarm from '@/libs/config/modularAlarm.js'

export default {
  name: 'alarmRegisterDiv',
  // VUE内部数据
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'auth': 2,                      // 权限
        'name': '',                     // 触发器名称,不超过16字符
        'streamId': '',                 // 当前数据流ID号
        'type': '',                     // 触发类型，>等
        'threshold': '',                // 触发阈值，最长10位小数
        'content': '',                  // 报警内容，50字符以内
        'triggerId': '',                 // 触发器ID号，删除时用
        'warnType': ''                  // 报警类型。
      },
      // 触发器列表信息
      alarmTableData: [{
        number: 1,  // 编号 自行从1开始填充
        selectMonitor: [],
        name: '嘻嘻嘻',               // 触发器名称
        type: '>',                   // 类型
        threshold: 40,               // 触发阈值
        factor: '>40',        // 在展示触发器列表中使用，是触发类型+触发阈值的字符串。如：>40
        content: '哈哈哈',           // 描述
        hideMessage: '否',          // 是否隐藏
        triggerId: '',              // 触发器ID号，删除时用
        streamName: '',
        streamId: ''
        // streamUid: ''
      }],
      // 监控选择项---报警类型选择项（包含监控点）
      monitorTypeOption: [],
      // 设备及监控点信息
      monitorDatas: [],
      // 存储表单信息
      formArr: [
        {
          // 其它
          currentMonitorType: '', // 当前触发器选择的报警类型选择
          selecteLabel: '', // 当前触发器选择的报警类型label
          // 当前触发器选择了监控选项后，对应的类型（type）、数值（threshold）的可能
          typeAllOption: [
            // {
            //   label: '>',
            //   value: '>'
            // },
            // {
            //   label: '<',
            //   value: '<'
            // },
            // {
            //   label: '=',
            //   value: '=='
            // }
          ],
          thresholdOption: {
            input: false,
            value: ''
          },

          // 表单相关
          triggerId: '',      // 触发器ID号，删除时用
          mac: '',            // 设备mac
          name: '',           // 触发器名称---1
          streamName: '',     // 监控点名称---2
          streamId: '',       // 数据流id---2
          warnType: '',        // 报警类型---2
          type: '',          // 触发类型---3
          threshold: '',      // 报警阈值---4
          content: ''         // 报警内容---5
        }
      ],
      // 新增触发器默认内容---空白
      blankAlarm: {
        // 其它
        currentMonitorType: '', // 当前触发器选择的报警类型选择
        selecteLabel: '', // 当前触发器选择的报警类型label
        // 当前触发器选择了监控选项后，对应的类型（type）、数值（threshold）的可能
        typeAllOption: [
          // {
          //   label: '>',
          //   value: '>'
          // },
          // {
          //   label: '<',
          //   value: '<'
          // },
          // {
          //   label: '=',
          //   value: '=='
          // }
        ],
        thresholdOption: {
          input: false,
          value: ''
        },

        // 表单相关
        triggerId: '',      // 触发器ID号，删除时用
        mac: '',            // 设备mac
        name: '',           // 触发器名称---1
        streamName: '',     // 监控点名称---2
        streamId: '',       // 数据流id---2
        warnType: '',        // 报警类型---2
        type: '',          // 触发类型---3
        threshold: '',      // 报警阈值---4
        content: ''         // 报警内容---5
      },
      ownerAuth: 1,                         // 拥有者权限
      shareAdminAuth: 2,                    // 分享者管理员权限
      shareOperateAuth: 3,                  // 分享者操作工权限
      shareNoteAuth: 4,                     // 分享者记录员权限
      dialogFormVisible: false,
      formLabelWidth: '120px',
      formAddOrModify: 0,                   // 0-add,1-modify
      loadingFlag: false,
      operationName: '',
      max_table_height: null // 表格高度
    }
  },
  //
  // ***************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    // 修改表格最大高度
    this.max_table_height = document.documentElement.clientHeight - 195
  },
  // 生命周期，安装期
  mounted: async function () {
    try {
      this.alarmTableData = []  // 初始化表格内容
      // 获取网关下设备列表信息
      await this.backDevInfoQue()
      // // 用户设备权限查询
      // this.backUserDevAuthQue()
      // 查询当前的报警登记记录
      this.backTriQueryList()
      // // 查询后台的所有监控点信息（重新渲染组件时操作）
      // this.backMonitorQueryAll()
    } catch (err) {
      console.log(err)
    }
  },
  //
  // *********************方法函数***********************
  //
  methods: {
    // 触发器添加 初始化(若没有初始化，则第一次输入的值会残留，导致下次打开时会有之前的值)
    registerAddInitBt: function () {
      // 初始化表单
      this.formArr = [
        {
          // 其它
          currentMonitorType: '', // 当前触发器选择的报警类型选择
          selecteLabel: '', // 当前触发器选择的报警类型label
          // 当前触发器选择了监控选项后，对应的类型（type）、数值（threshold）的可能
          typeAllOption: [
            // {
            //   label: '>',
            //   value: '>'
            // },
            // {
            //   label: '<',
            //   value: '<'
            // },
            // {
            //   label: '=',
            //   value: '=='
            // }
          ],
          thresholdOption: {
            input: false,
            value: ''
          },

          // 表单相关
          triggerId: '',      // 触发器ID号，删除时用
          name: '',           // 触发器名称---1
          streamName: '',     // 监控点名称---2
          streamId: '',       // 数据流id---2
          warnType: '',        // 报警类型---2
          type: '',          // 触发类型---3
          threshold: '',      // 报警阈值---4
          content: ''         // 报警内容---5
        }
      ]
      // 添加触发器---修改相关标记
      this.formAddOrModify = 0
      this.operationName = '添加触发器'
      // 显示弹窗
      this.dialogFormVisible = true
    },
    // 触发器添加1个表单项
    addAlarmForm () {
      // 添加1个空白的触发器项
      // this.formArr[this.formArr.length] = $.extend(true, {}, this.blankAlarm)
      var obj = JSON.parse(JSON.stringify(this.blankAlarm))
      this.$set(this.formArr, this.formArr.length, obj)
      console.log(this.formArr)
    },
    // 点击dialog弹窗的确定，触发器添加/编辑
    registerAddOrEdit: function () {
      var triggerEtyList = []
      for (var i = 0; i < this.formArr.length; i++) {
        // 表单验证
        if (this.formArr[i].name === '') {
          this.notificationInfo('错误提示', '请填写触发器名称')
          return
        }
        if (this.formArr[i].warnType === '') {
          this.notificationInfo('错误提示', '请选择报警类型')
          return
        }
        if (this.formArr[i].content === '') {
          this.notificationInfo('错误提示', '请填写描述')
          return
        }
        let triNameReg = /^[0-9a-zA-Z_]{1,20}$/
        if (!triNameReg.test(this.formArr[i].name)) {
          this.notificationInfo('错误提示', '触发器名称只能包含数字、字母、下划线')
          return
        }
        // 表单对象
        triggerEtyList[i] = {
          mac: this.formArr[i].mac,            // 设备mac
          name: this.formArr[i].name,           // 触发器名称
          streamName: this.formArr[i].streamName,     // 监控点名称
          streamId: this.formArr[i].streamId,       // 数据流id
          warnType: this.formArr[i].warnType,        // 报警类型
          type: this.formArr[i].type,          // 触发类型
          threshold: this.formArr[i].threshold,      // 报警阈值
          content: this.formArr[i].content         // 报警内容
        }
      }
      this.param.triggerEtyList = triggerEtyList
      if (this.formAddOrModify === 1) {
        // 修改
        // this.param.triggerId = this.alarmTableData[this.form.index].triggerId
      } else if (this.formAddOrModify === 0) {
        // 添加
        // this.param.triggerId = '000'
        this.param.triggerId = ''
      }
      console.log(this.formArr)
      console.log(this.param)
      this.loadingFlag = true
      if (this.formAddOrModify === 0) {
        this.backTriAdd()
      } else if (this.formAddOrModify === 1) {
        this.backTriUpdate()
      }
      this.dialogFormVisible = false
    },
    // 触发器删除
    registerDeleteBt: function (index, row) {
      // console.log(index, row)
      this.param.triggerId = this.alarmTableData[index].triggerId // 要给后台一个triggerId标识号才知道删除的是具体哪一个触发器
      this.backTriDel(index)
    },
    // 返回的Cascader修改value后对应的label
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    // 监控点选择
    monitorChange: function (value, index) {
      console.log(value)
      console.log(index)
      
      this.formArr[index].selecteLabel = this.getCascaderObj(this.formArr[index].currentMonitorType, this.monitorTypeOption)
      console.log(this.formArr[index].selecteLabel)
      for (var i = 0; i < this.monitorTypeOption.length; i++) {
        if (value[0] === this.monitorTypeOption[i].mac) {
          for (var j = 0; j < this.monitorTypeOption[i].children.length; j++) {
            if (value[1] === this.monitorTypeOption[i].children[j].value) {
              // 设备名称
              this.formArr[index].mac = this.monitorTypeOption[i].mac
              // 监控点（数据流）名字
              this.formArr[index].streamName = this.formArr[index].selecteLabel[0].label + ' ' + this.monitorTypeOption[i].children[j].streamName
              console.log(this.formArr[index].streamName)
              // 监控点（数据流）id
              this.formArr[index].streamId = this.monitorTypeOption[i].children[j].streamId
              console.log(this.formArr[index].streamId)
              // 报警类型
              this.formArr[index].warnType = this.monitorTypeOption[i].children[j].warnType
              console.log(this.formArr[index].warnType)
              
              // var alarmType = this.monitorTypeOption[i].children[j].alarmType
              // this.formArr[index].typeAllOption = []
              // for (var k = 0; k < alarmType.length; k++) {
              //   var obj = {}
              //   obj.label = alarmType[k].label
              //   obj.value = alarmType[k].value
              //   // this.formArr[index].typeAllOption.push(alarmType[k]) 
              //   // this.$set(this.formArr[index].typeAllOption, k, obj)
              // }
              // 根据配置修改类型（type）、数值（threshold）的可能
              // 修改类型（type）的可能
              this.formArr[index].typeAllOption = this.monitorTypeOption[i].children[j].alarmType
              // type默认值
              this.formArr[index].type = this.formArr[index].typeAllOption[0].value
              // 修改数值（threshold）的可能
              this.formArr[index].thresholdOption = this.monitorTypeOption[i].children[j].alarmThreshold
              // threshold默认值
              this.formArr[index].threshold = this.formArr[index].thresholdOption.value
              console.log(this.formArr)
            }
          }
        }
      }
    },
    /*
    **  API调用相关函数
    */
    // 查询后台的所有监控点信息（重新渲染组件时操作）

    // 后台查询网关下设备监控点列表信息
    backDevInfoQue: function () {
      return new Promise(function (resolve, reject) {
        back.relatioMonitorPoint(this.param).then(function (response) {
          console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            reject()
          } else {
            // 设备及监控点信息
            var monitorDataList = []
            // 监控选择项
            let monitorTypeList = []
            for (let i = 0; i < response.data.length; i++) {
              // 设备及监控点信息
              monitorDataList[i] = response.data[i]
              var monitorTypeObj = {
                label: response.data[i].name,
                value: response.data[i].mac,
                mac: response.data[i].mac,
                installTime: response.data[i].installTime,
                station: response.data[i].station,
                type: response.data[i].type,
                children: {}
              }
              // 判断设备类型
              if (response.data[i].type === 1) {
                // ispd
                monitorTypeObj.children = modularAlarm['ispd']
              } else if (response.data[i].type === 2) {
                // cj485
                monitorTypeObj.children = modularAlarm['cj485']
              }
              monitorTypeList.push(monitorTypeObj)
              resolve()
            }
            // 设备及监控点信息---更新
            this.monitorDatas = monitorDataList
            console.log(this.monitorDatas)
            console.log(monitorTypeList)
            // var ccc = []
            // for (var g = 0; g < monitorTypeList.length; g++) {
            //   ccc.push(monitorTypeList[i])
            // }
            let arr = JSON.parse(JSON.stringify(monitorTypeList))
            // 完善监控选择项
            for (let a = 0; a < arr.length; a++) {
              for (let b = 0; b < arr[a].children.length; b++) {
                // 为监控选择项中的每个报警，设置value（因为Cascader 级联选择器需要）,值为index
                // arr[a].children[b].value = arr[a].children[b].index
                arr[a].children[b].value = a + '-' + b
                // 为监控选择项中的每个报警，补充对应的数据流id和数据流名称
                let streamIdIndex = arr[a].children[b].streamIdIndex
                // console.log(streamIdIndex)
                // console.log((a + '-' + b))
                // console.log(this.monitorDatas[a].streams[streamIdIndex].streamId)
                // console.log(this.monitorDatas[a].streams[streamIdIndex].name + (a + '-' + b))
                // console.log((a + '-' + b))
                arr[a].children[b].streamId = this.monitorDatas[a].streams[streamIdIndex].streamId
                // arr[a].children[b].streamName = this.monitorDatas[a].streams[streamIdIndex].name + (a + '-' + b)
                arr[a].children[b].streamName = this.monitorDatas[a].streams[streamIdIndex].name
              }
            }
            console.log(arr)
            // 监控选择项---更新
            this.monitorTypeOption = arr
            console.log(this.monitorTypeOption)
            // 监控选择项---更新
            // monitorTypeOption
          }
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 用户设备权限查询

    // 查询当前的报警登记记录
    backTriQueryList: function () {
      back.trListQue(this.param).then(function (response) {
        // console.log('trListQue')
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let triggerData = []
        if (response.data !== undefined) {
          for (let i = 0; i < response.data.length; i++) {
            var deviceTrigger = response.data[i]

            for (var j = 0; j < deviceTrigger.triggerEtyList.length; j++) {
              let obj = {}
              obj.deviceName = deviceTrigger.name ? deviceTrigger.name : '未知设备'
              obj.name = deviceTrigger.triggerEtyList[j].name
              obj.streamName = deviceTrigger.triggerEtyList[j].streamName
              obj.warnType = deviceTrigger.triggerEtyList[j].warnType
              obj.streamId = deviceTrigger.triggerEtyList[j].streamId
              obj.type = deviceTrigger.triggerEtyList[j].type
              obj.threshold = deviceTrigger.triggerEtyList[j].threshold
              obj.factor = deviceTrigger.triggerEtyList[j].type + deviceTrigger.triggerEtyList[j].threshold
              obj.content = deviceTrigger.triggerEtyList[j].content
              obj.triggerId = deviceTrigger.triggerEtyList[j].triggerId
              
              var triggerDataLength = triggerData.length
              triggerData[triggerData.length] = obj
              triggerData[triggerDataLength].number = triggerDataLength + 1
            }
          }
        }
        this.alarmTableData = triggerData
        // console.log(this.alarmTableData)
      }.bind(this))
    },
    // 添加触发器API
    backTriAdd: function () {
      console.log('添加tri param')
      console.log(this.param)
      back.addTrigger(this.param).then(function (response) {
        console.log(response)
        if (response.errno < 1) {
          this.notificationInfo('提示：', '添加成功')
        } else {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 查询当前的报警登记记录
        this.backTriQueryList()
        this.loadingFlag = false
      }.bind(this))
    },
    // 更新触发器API
    backTriUpdate: function () {
      console.log('更新tri param')
      console.log(this.param)
      back.trUpdate(this.param).then(function (response) {
        console.log(response)
        if (response.errno < 1) {
          this.notificationInfo('提示：', '更新成功')
        } else {
          this.$notify.error({
            title: '添加失败，错误提示：',
            message: `${response.error}`
          })
        }
        // 查询当前的报警登记记录
        this.backTriQueryList()
        this.loadingFlag = false
      }.bind(this))
    },
    // 删除触发器API
    backTriDel: function (index) {
      console.log('删除tri param')
      console.log(this.param)
      back.trDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno < 1) {
          this.alarmTableData.splice(index, 1)
          this.notificationInfo('提示：', '删除成功')
        } else {
          this.notificationInfo('删除失败，错误提示', response.error)
        }
        // 查询当前的报警登记记录
        this.backTriQueryList()
      }.bind(this))
    },
    /*
    //  辅助函数
    */
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.alarmregister{
  padding: 0;
  bottom: 0;
  width: 100%;
  /* overflow: hidden; */
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.alarmregistermain{
  padding: 0;
  overflow-x: hidden;
  height: 70%;
}
.el-main{
  padding: 0;
  flex: 1;
  padding-top: 30px;
}
.el-footer {
  bottom:0px;
  left: 0px;
  background-color: #FFFFFF;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.addregister {
  position: absolute;
  top: -40px;
  right: 0;
  text-align: left;
}
/* 无效 */
.el-dialog__header {
  text-align: center;
  color: white;
  background-color: #409EFF;
}
.btn_cancel_dialog{
  margin-right: 30px;
  background: #1C363F;
  color: #08C9DA;
  border: 1px solid #08C9DA;
}
</style>
<style lang="scss">
/* 解决element-ui的表格设置固定栏后，边框线消失的bug */
.alarmregistermain .el-table__row td:not(.is-hidden):nth-child(1){
  bottom:-1px;
}
.alarmregistermain .el-table__row td:not(.is-hidden):nth-child(2){
  bottom:-1px;
}
.alarmregistermain .el-table__row td:not(.is-hidden):nth-child(3){
  bottom:-1px;
}

.alarmregister {
    .form_box {
      border: 1px solid #08C9DA;
      padding: 20px 0px 0px 0px;
      margin-bottom: 10px;
    }
    .btn_box {
      text-align: center;
      .btnAddForm {
        display: inline-block;
        border: 2px solid #08C9DA;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 20px;
        color: #08C9DA;
      }
    }
    
}

</style>
