<!--
 * @Author: your name
 * @Date: 2019-07-16 08:35:25
 * @LastEditTime: 2019-10-28 14:34:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \04_guiwuCode\03-雷泰\leitai4.0\src\components\home\setPage\deviceInfo.vue
 -->
<!-- 网关基本配置-网关基本信息页面 -->
<template>
  <div class="deviceSetInfo">
    <div class="deviceInfo_box">
      <div class="item_device_info">
        <div class="left_item_deviceInfo">
          <span class="sp_deviceInfo1">设备名：</span>
          <span class="sp_deviceInfo2">{{devInfo.name}}</span>
        </div>
        <div class="right_item_deviceInfo">
          <el-button type="text" icon="el-icon-edit-outline" @click="changeDeviceNameBt" v-show="devNameBtnShow">更改设备名</el-button>
        </div>
      </div>
      <div class="item_device_info">
        <div class="left_item_deviceInfo">
          <span class="sp_deviceInfo1">设备SN：</span>
          <span class="sp_deviceInfo2">{{devInfo.sn}}</span>
        </div>
        <div class="right_item_deviceInfo"></div>
      </div>
      <div class="item_device_info">
        <div class="left_item_deviceInfo">
          <span class="sp_deviceInfo1">设备ID：</span>
          <span class="sp_deviceInfo2">{{devInfo.deviceId}}</span>
        </div>
        <div class="right_item_deviceInfo"></div>
      </div>
      <!-- <div class="item_device_info">
        <div class="left_item_deviceInfo">
          <span class="sp_deviceInfo1">操作者：</span>
          <span class="sp_deviceInfo2">{{devInfo.operator}}</span>
        </div>
        <div class="right_item_deviceInfo">
          <el-button type="text" icon="el-icon-edit-outline" @click="changeDevicehandlers" v-show="operBtnShow">更改操作者</el-button>
        </div>
      </div>
      <div class="item_device_info">
        <div class="left_item_deviceInfo">
          <span class="sp_deviceInfo1">安装公司：</span>
          <span class="sp_deviceInfo2">{{devInfo.installCompany}}</span>
        </div>
        <div class="right_item_deviceInfo">
          <el-button type="text" icon="el-icon-edit-outline" @click="changeDeviceCompany" v-show="companyBtnShow">更改安装公司</el-button>
        </div>
      </div> -->
      <div class="item_device_info">
        <div class="left_item_deviceInfo">
          <span class="sp_deviceInfo1">安装时间：</span>
        </div>
        <div class="right_item_deviceInfo">
          <el-date-picker
            v-model="devInfo.installTime"
            align="right"
            :disabled="installTimeBtnShow"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            size="small"
            placeholder="选择日期"
            @change="changeInstallTime"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
      </div>
      <div class="item_device_info">
        <div class="left_item_deviceInfo">
          <span class="sp_deviceInfo1">高级功能：</span>
        </div>
        <div class="right_item_deviceInfo">
          <el-button type="danger" size="small" @click="delDeviceBt">删除设备</el-button>
        </div>
      </div>
    </div>
    <!--删除设备对话框-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      center>
      <span>确定删除该设备{{param.sn}}么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDeviceBt">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
// 引入路由
import Routers from '@/router'
export default {
  name: 'deviceInfo',
  data () {
    return {
      param: {
        'userId': '',
        'sn': '',
        'Authorization': ''
      },
      devInfo: {
        apiKey: '',
        sn: '',               // 当前设备SN
        name: '',             // 当前设备设备名
        deviceId: '',         // 当前设备设备ID
        operator: '',         // 当前设备操作者
        installCompany: '',   // 当前设备安装公司
        installTime: '',      // 当前设备安装时间
        location: {}          // 当前设备安装位置
      },
      dialogImageUrl: '',
      dialogVisible: false,
      // auth决定的操作权限按钮显示标志位
      devNameBtnShow: false, // 更改设备名按钮的显示状态
      installTimeBtnShow: true, // 安装时间修改是否禁用
      delBtnShow: false, // 是否可以删除设备
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      deleteDialogVisible: false,       // 删除设备对话框标志位
      deviceInfoLoading: null           // 设备操作loading标志位
    }
  },
  //
  // ***************生命周期*********************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    // 分组管理/设备添加/用户管理 按钮显示判断
    if (sessionGetStore('userId') === sessionGetStore('userIdMe')) {
      // 自己
      this.devNameBtnShow = true
      this.installTimeBtnShow = false
      this.delBtnShow = true
    } else {
      if (parseInt(sessionGetStore('authMe')) <= 1) {
        // 管理员或者超级管理员
        this.devNameBtnShow = true
        this.installTimeBtnShow = false
        this.delBtnShow = true
      } else {
        // 查看
        this.devNameBtnShow = false
        this.installTimeBtnShow = true
        this.delBtnShow = false
      }
    }
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 后台获取网关信息
    // debugger
    this.backGetNetInfo()
  },
  computed: {
  },
  methods: {
    // 修改设备名--弹出对话框
    changeDeviceNameBt: function () {
      this.$prompt('设备名', '更改设备名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.param.name = value
        // 设备信息修改
        this.backDeviceMod()
      }).catch(() => {
      })
    },
    // 修改操作者--弹出对话框
    changeDevicehandlers: function () {
      this.$prompt('操作者', '更改操作者', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.param.operator = value
        // 设备信息修改
        this.backDeviceMod()
      }).catch(() => {
      })
    },
    // 修改安装公司--弹出对话框
    changeDeviceCompany: function () {
      this.$prompt('安装公司', '更改安装公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.param.installCompany = value
        // 设备信息修改
        this.backDeviceMod()
      }).catch(() => {
      })
    },
    // 修改安装时间--弹出对话框
    changeInstallTime: function () {
      this.param.installTime = this.devInfo.installTime
      console.log(this.param.installTime)
      // 设备信息修改
      this.backDeviceMod()
    },
    /*
    **  ******************  照片相关方法函数  ******************
    */
    // 生成随机字符串
    randomString: function (len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    // 删除设备（打开对话框）
    delDeviceBt: function () {
      if (!this.delBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      this.deleteDialogVisible = true
      console.log('删除设备（打开对话框）')
    },
    // 设备删除（对话框确认）
    deleteDeviceBt: function () {
      // 开启loading
      this.deviceInfoLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      // back后台删除设备
      this.backDeleteNetgate()
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // ******************   back   ****************************
    //
    // 查询网关信息
    backGetNetInfo: function () {
      back.getNetInfo(this.param).then(function (response) {
        console.log('查询网关信息')
        // debugger
        console.log(response)
        let obj = {}
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return false
        } else {
          if (response.data.length !== 0) {
            obj.sn = response.data.sn
            obj.deviceId = response.data.deviceId
            obj.apiKey = response.data.apiKey
            obj.name = response.data.name
            obj.location = response.data.location
            obj.installTime = response.data.installTime
            obj.installCompany = response.data.installCompany
            obj.operator = response.data.operator
          }
        }
        this.devInfo = obj
        console.log(this.devInfo)
      }.bind(this))
    },
    // 修改网关信息
    backDeviceMod: function () {
      console.log('修改网关信息')
      console.log(this.param)
      back.devMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 全局节点列表刷新标志位置true，需要刷新
          this.$store.commit('setdeviceGroupRefresh', true)
          // 获取网关信息
          this.backGetNetInfo()
        }
      }.bind(this))
    },
    // 删除网关
    backDeleteNetgate: function () {
      console.log(this.param)
      back.deleteNetgate(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 关闭弹窗
          this.deleteDialogVisible = false
          // 关闭loading
          this.deviceInfoLoading.close()
          // 跳转到home页
          Routers.push({ path: '/home' })
        }
      }.bind(this))
    },
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
.deviceSetInfo {
  width: 100%;
  /* margin: 20px; */
  margin-top: 30px;
  background: url(/static/bg_echarts1.png) no-repeat;
  background-size: 100% 100%;
}
.deviceInfo_box{
  height: 100%;
  padding: 50px;
  box-sizing: border-box;
}
.item_device_info{
  float: left;
  width: 100%;
  box-sizing: border-box;
  padding-left: 100px;
  color: #fff;
  height: 50px;
  line-height: 50px;
}
.left_item_deviceInfo{
  float: left;
}
.sp_deviceInfo1{
  float: left;
}
.sp_deviceInfo2{
  float: left;
  margin-left: 5px;
}
.right_item_deviceInfo{
  float: left;
  margin-left: 20px;
}
</style>
