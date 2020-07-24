<template>
  <div class="device">
    <!-- 当前网关 -->
    <div class="currentDevice">
      <div class="backSelf">
        <el-button type="primary" size="mini" class="btn_backSelf" icon="el-icon-circle-check-outline" @click="goPersonalBtn" v-if="backSelfBtn">回到自己</el-button>
      </div>
      <div class="deviceInfoBox">
        <div class="item_info">当前选择：{{gatewayInfo.gatewayName}}</div>
        <div class="item_info">所属分组：{{gatewayInfo.groupName}}</div>
      </div>
    </div>
    <!-- 顶部四个导航 -->
    <div class="device_header_title">
      <div class="device_ht_item" v-bind:class="{ current_item_dvh:index==current}" v-for="(item, index) in deviceToptitle" :key="index" @click="goNewpage(index,item.path,$event)">
        <svg class="icon_title" aria-hidden="true">
          <use :xlink:href="item.icon"></use>
        </svg>
        <span class="device_ht_text">{{item.title}}</span>
      </div>
    </div>
    <!-- 设备下对应信息内容 -->
    <el-container>
      <el-container class="devicemain">
        <div class="content">
          <div class="contentbox">
            <router-view></router-view>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import Routers from '@/router'
export default {
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'apiKey': '',
        'deviceId': '',
        'mac': '',
        'needSend': ''                       // 1表示客户修改了从站地址，0表示该参数没有修改
      },
      // 网关信息
      gatewayInfo: {
        gatewayName: '', // 网关名称
        groupName: '' // 分组名称
      },
      // 回到自己 按钮的显示状态
      backSelfBtn: false,
      alarmFlag: false,
      // 当前页面
      current: 0,
      // 顶部导航信息
      deviceToptitle: [
        {
          title: '数据监测',
          icon: '#icon-shuju',
          path: '/home/device/data'
        },
        {
          title: '报警记录',
          icon: '#icon-jingbao',
          path: '/home/device/alarm'
        },
        {
          title: '历史数据',
          icon: '#icon-jianchazhibiao',
          path: '/home/device/history'
        },
        {
          title: '网关基本配置',
          icon: '#icon-shezhi',
          path: '/home/device/set'
        }
      ]
    }
  },
  created () {
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    this.gatewayInfo.gatewayName =  sessionGetStore('gatewayName')
    this.gatewayInfo.groupName =  sessionGetStore('groupName')
    if (sessionGetStore('userId') !== sessionGetStore('userIdMe')) {
      // 回到自己按钮的显示状态
      this.backSelfBtn = true
    }
  },
  watch: {
    $route (to) {
      // console.log(to.path)
      if (to.path === '/home/device/data/deviceNb') {
        this.current = 0
      }
    }
  },
  mounted () {
   
    this.tabPaneSet()
    // 用户下网关列表信息获取
    // this.backDevInfoGet()
  },
  methods: {
    // 回到自己按钮
    goPersonalBtn: function () {
      console.log('回到自己按钮')
      sessionSetStore('name', sessionGetStore('nameMe'))
      sessionSetStore('userId', sessionGetStore('userIdMe'))
      sessionSetStore('auth', sessionGetStore('authMe'))
      sessionSetStore('deviceIdNow', '')
      Routers.push({ path: '/home' })
      // 回到自己按钮的显示状态
      this.backSelfBtn = false
      // 全局网关列表刷新标志位置true，需要刷新
      this.$store.commit('setdeviceGroupRefresh', true)
    },
    // 点击顶部四个按键跳转
    goNewpage (index, path, e) {
     
      if (index === 0) {
        let a = sessionGetStore('isnb')
       
        if (a === 'true') {
          Routers.push({ path: '/home/device/data/deviceNb' })
        } else {
          Routers.push({ path: path })
        }
      } else {
        Routers.push({ path: path })
      }
      
      // 修改当前的标题
      this.current = index
    },
    tabPaneSet: function () {
      // 获取当前页面的url地址
      let uri = window.location.href
      // console.log(uri)
      var arrUri = uri.split('/')
      // console.log(arrUri)
      if (arrUri[arrUri.length - 2] === 'data') {
        // 修改当前的标题
        this.current = 0
      } else if (arrUri[arrUri.length - 2] === 'alarm') {
        // 修改当前的标题
        this.current = 1
      } else if (arrUri[arrUri.length - 2] === 'history') {
        // 修改当前的标题
        this.current = 2
      } else if (arrUri[arrUri.length - 2] === 'set') {
        // 修改当前的标题
        this.current = 3
      }
      // if (this.alarmFlag) {
      //   document.getElementById('title2').style.backgroundColor = '#EE0000'
      // }
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // ******************   back   ****************************
    //
    // 用户下网关列表信息获取
    backDevInfoGet: function () {
      // console.log('用户下网关列表信息')
      // console.log(this.param)
      back.userDevQue(this.param).then(function (response) {
        // debugger
        console.log(response)
        console.log(this.param.sn)
        // this.apiResponses = response // 为啥把response存起来，其他请求参数会用到该数据
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        if (response.data && response.data.length > 0) {
          // 遍历分组
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].children && response.data[i].children.length > 0) {
              // 遍历网关
              for (let j = 0; j < response.data[i].children.length; j++) {
                if (response.data[i].children[j].sn === this.param.sn) {
                  // 网关信息
                  this.gatewayInfo = {
                    gatewayName: response.data[i].children[j].label, // 网关名称
                    groupName: response.data[i].label // 分组名称
                  }
                  return
                }
                if (response.data[i].children[j].children !==undefined) {
                  for (let m = 0; m <  response.data[i].children[j].children.length; m++) {
                    if (response.data[i].children[j].children[m].mac === this.param.sn) {
                      // 网关信息
                      this.gatewayInfo = {
                        gatewayName: response.data[i].children[j].children[m].label, // 网关名称
                        groupName: response.data[i].label // 分组名称
                      }
                      return
                    }
                    if (response.data[i].children[j].children[m].children !== undefined) {
                      for (let n = 0; n <  response.data[i].children[j].children[m].children.length; n++) {
                        if (response.data[i].children[j].children[m].children[n].mac === this.param.sn) {
                          // 网关信息
                          this.gatewayInfo = {
                            gatewayName: response.data[i].children[j].children[m].children[n].label, // 网关名称
                            groupName: response.data[i].label // 分组名称
                          }
                            return
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }.bind(this))
    }
  }
}
</script>

<style lang="scss">
.device {
  display: flex;
  flex-direction: column;
  min-height: 99vh;
  overflow: hidden;
  padding: 25px;
  box-sizing: border-box;
  position: relative;
  .currentDevice {
    position: absolute;
    top: 3px;
    left: 0px;
    width: 100%;
    .backSelf {
      position: absolute;
      right: 80px;
      top: 0px;
      .btn_backSelf {
        margin-top: 5px;
        background: url(/static/bg_device_title1.png);
        background-size: 100% 100%;
        color: #fff;
      }
    }
    .deviceInfoBox {
      display: inline-block;
      height: 36px;
      .item_info {
        float: left;
        margin: 0px 20px;
        color: #08C9DA;
        font-size: 16px;
        line-height: 36px;
      }
    }
  }
}
.device_header_title{
  padding-top: 15px;
  padding-bottom: 10px;
}
.device_header_title .device_ht_item{
  float: left;
  width: 160px;
  height: 45px;
  margin-right: 20px;
  background: url(/static/bg_device_title1.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.device_header_title .device_ht_item:last-child{
  width: 190px;
}
.device_header_title .icon_title {
  float: left;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 36px;
  margin-top: 6px;
  margin-left: 22px;
}
.device_header_title .device_ht_text{
  float: left;
  margin-left: 15px;
  font-size: 16px;
  line-height: 45px;
  font-weight: lighter;
}
.device_header_title .icon_title, .device_header_title .device_ht_text{
  color: #fff;
}
.device_header_title .current_item_dvh .icon_title, .device_header_title .current_item_dvh .device_ht_text{
  color: #08C9DA;
}
.firsttitle {
  /* height: 70px; */
  padding: 0;
}
.grid-four {
  height: 71px;
  background-color: #f8f8ff;
}
.grid-four-col {
  height: 71px;
  min-width: 70px;
  font-size: medium;
  cursor: pointer;
  white-space: nowrap;
}
#title1 {
  background-color: #409EFF;
}
/* #title2 {
  background-color: red;
}
#title3 {
  background-color: yellow;
}
#title4 {
  background-color: pink;
} */
.grid-content-set {
  padding: 10px;
}
.titlepic {
  height: 32px;
}
.titleicon {
  height: 28px;
  width: 28px;
}
.titlename {
  height: 17px;
  line-height: 17px;
}
.grid-text {
  height: 80px;
  font-size: 15px;
}
.devicemain {
  bottom: 0;
  /* background-color: #ffffff; */
  /* background-color: pink; */
}
.select {
  flex: 1 0 25%;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}
.selectitem {
  flex: 1 0 25%;
  align-self: center;
}
.content {
  flex: 1 0 75%;
  width: 100%;
}
.contentbox {
  height: 100%;
}
</style>
