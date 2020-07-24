<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 08:35:25
 * @LastEditTime: 2019-08-23 09:29:28
 * @LastEditors: Please set LastEditors
 -->
<!-- 全局示意图页面 -->
<template>
  <!-- <div> -->
    <el-container class="layout_container">
      <!-- 顶部区域 -->
      <div class="layout_header">
        <div class="left_welcome">
          <span>欢迎您，</span>
          <span>{{userName}}~</span>
          <el-button type="primary" size="mini" class="logoutBtn" @click="tologinBt">退&nbsp;出</el-button>
        </div>
        <div class="center_title">
          <div class="c_t_top">
            <div class="c_t_top_img">
              <img :src="titlelogo" alt="">
            </div>
            <div class="c_t_top_text">
              <p @click="goHomePage">{{indextitle}}</p>
            </div>
          </div>
          <div class="c_t_botm">
            <img class="c_t_botm_img" src="/static/nav_top.png" alt="">
          </div>
        </div>
        <div class="right_time">{{nowTimeStr}}</div>
      </div>
      <!-- 主要区域 -->
      <div class="layout_main">
        <!-- 左边区域 -->
        <div class="layout_left">
          <!-- 有配置 -->
          <div v-if="isSetModule" class="itemBox_box">
            <div class="itemBox"
              v-for="(item, index) in leftLayoutDom"
              :key="index"
            >
              <div class="item_title">
                <div class="title_textc">{{item.title}}</div>
              </div>
              <div class="item_content">
                <div class="echartsDom" :id="'echartsDom'+(index+1)"></div>
              </div>
            </div>
          </div>
          <!-- 无配置 -->
          <div v-else class="itemBox_box">
            <div class="itemBox"
              v-for="(item, index) in leftLayoutDom"
              :key="index"
            >
              <div class="item_title">
                <div class="title_textc"></div>
              </div>
              <div class="item_content">
                <div class="textDom">{{item.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右边区域 -->
        <div class="layout_right">
          <!-- 有配置 -->
          <div v-if="isSetModule" class="itemBox_box">
            <div class="itemBox"
              v-for="(item, index) in rightLayoutDom"
              :key="index"
            >
              <div class="item_title">
                <div class="title_textc">{{item.title}}</div>
              </div>
              <div class="item_content">
                <div class="echartsDom" :id="'echartsDom'+(index+4)"></div>
              </div>
            </div>
          </div>
          <!-- 无配置 -->
          <div v-else class="itemBox_box">
            <div class="itemBox"
              v-for="(item, index) in leftLayoutDom"
              :key="index"
            >
              <div class="item_title">
                <div class="title_textc"></div>
              </div>
              <div class="item_content">
                <div class="textDom">{{item.title}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 中间区域 -->
        <div class="layout_center">
          <!-- 地图部分 -->
          <div class="mapbox">
            <!-- 地图容器 -->
            <div class="mapbox_main">
              <!-- 地图 -->
              <div id="allmap">
                <h3>地图显示</h3>
              </div>
              <!-- 选择主题 -->
              <el-select class="chose_mapstyle" @change="changeMapStyle" size="mini" v-model="currentMayStyle" placeholder="请选择">
                <el-option
                  v-for="(item, index) in mapStyleArr"
                  :key="index"
                  :label="item.title"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <!-- 设备信息浮层 -->
            <div id="devicepanel">
              <!-- 标题 -->
              <div id="titleandclose">
                <span id="paneltitle">设备信息</span>
                <span style="float: right; margin: 5px; cursor: default" v-on:click="closepanel">X</span>
              </div>
              <!-- 设备信息 -->
              <div id="deviceinfo"></div>
            </div>
          </div>
          <!-- 下方图表部分 -->
          <div class="botm_echarts">
            <!-- 有配置 -->
            <div v-if="isSetModule" class="itemBox_box">
              <div class="itemBox"
                v-for="(item, index) in centerBottomDom"
                :key="index"
              >
                <div class="item_title">
                  <div class="title_textc">{{item.title}}</div>
                </div>
                <div class="item_content">
                  <div class="echartsDom" :id="'echartsDom'+(index+7)"></div>
                </div>
              </div>
            </div>
            <!-- 无配置 -->
            <div v-else class="itemBox_box">
              <div class="itemBox"
                v-for="(item, index) in centerBottomDom"
                :key="index"
              >
                <div class="item_title">
                  <div class="title_textc"></div>
                </div>
                <div class="item_content">
                  <div class="textDom">{{item.title}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 报警处理容器 -->
      <div class="alarmContainer">
        <!-- 报警内容容器控制按钮 -->
        <el-button @click="openAlarmList" v-if="allAlarmInfo.length > 0" class="alarmListBox_btnkz" size="mini" type="danger">报警</el-button>
        <!-- 报警内容容器 -->
        <el-card class="alarmListBox" :body-style="alarmListBoxStyleObj" v-if="allAlarmInfo.length > 0 && alarmListBoxShow">
          <div slot="header" class="clearfix">
            <span style="font-size: 16px;font-weight: bold;">报警信息</span>
            <el-button @click="closeAlarmList" style="float: right; padding: 3px 0" type="text">关闭</el-button>
          </div>
          <div v-for="(gatewayItem, gatewayIndex) in allAlarmInfo" :key="gatewayIndex" class="gatewayItem_alarm clearfix">
            <div class="gateway_name">网关名称：{{gatewayItem.nname}}</div>
            <div class="gateway_alarm">
              <div class="item_alarm">
                <div class="alarm_deviceName">设备名称</div>
                <div class="alarm_alarmName">触发器名称</div>
                <div class="alarm_alarmContent">报警内容</div>
                <div class="alarm_ck" style="line-height: 30px;">操作</div>
              </div>
              <div v-for="(alarmItem, alarmIndex) in gatewayItem.warns" :key="alarmIndex" class="item_alarm">
                <div class="alarm_deviceName">{{alarmItem.dname}}</div>
                <div class="alarm_alarmName">{{alarmItem.tname}}</div>
                <div class="alarm_alarmContent">{{alarmItem.content}}</div>
                <el-button type="primary" class="alarm_ck" size="mini" @click="ckAlarm(gatewayIndex, alarmIndex)">解除</el-button>
              </div>
            </div>
          </div>
        </el-card>
        <!-- 报警弹窗容器 -->
        <el-dialog class="alarmTcBox" title="报警详细信息" :visible.sync="dialogVisibleAlarm" width="500px" center>
          <div class="mainContent clearfix">
            <div class="item_alarmTcBox">
              <div class="left">网关名称：</div>
              <div class="right">{{currentAlarmInfo.gatewayName}}</div>
            </div>
            <div class="item_alarmTcBox">
              <div class="left">设备名称：</div>
              <div class="right">{{currentAlarmInfo.dname}}</div>
            </div>
            <div class="item_alarmTcBox">
              <div class="left">触发器名称：</div>
              <div class="right">{{currentAlarmInfo.tname}}</div>
            </div>
            <div class="item_alarmTcBox">
              <div class="left">报警内容：</div>
              <div class="right">{{currentAlarmInfo.content}}</div>
            </div>
            <div class="item_alarmTcBox">
              <div class="left">报警值：</div>
              <div class="right">{{currentAlarmInfo.value}}</div>
            </div>
          </div>
          <div class="footerBtn">
            <el-button type="primary" @click="backComfirmTrigger">解除报警</el-button>
            <el-button type="primary" class="btn_cancel_setGroup"  @click="dialogVisibleAlarm = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-container>
  <!-- </div> -->
</template>

<script>
// 引入百度地图api
import BMap from 'BMap'
// 引入百度地图控件（左上、右下）
import BMAP_ANCHOR_BOTTOM_RIGHT from 'BMAP_ANCHOR_BOTTOM_RIGHT'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
import $ from 'jquery'
// 引入axios
// import axios from 'axios'
// 引入api
import { back, onenet } from 'api'
// 引入封装的工具类
import { sessionGetStore, sessionSetStore, sessionClearStore } from '@/components/config/Utils'
// 引入路由
import Routers from '@/router'
// 引入vue
import Vue from 'vue'
// 引入echarts
import echarts from 'echarts'
// 引入模块配置文件
import allModular from '@/libs/config/allModular.js'
// 引入WebSocket需要的插件
import Stomp from 'stompjs'
// 引入模块报警配置文件
import modularAlarm from '@/libs/config/modularAlarm.js'

export default {
  data () {
    return {
      titlelogo: '',
      indextitle: '',
      // 首页配置
      moduleList: [],
      // 空白配置
      blankModuleList: [
        {
          // 显示内容
          title: '未配置'
        },
        {
          // 显示内容
          title: '未配置'
        },
        {
          // 显示内容
          title: '未配置'
        },
        {
          // 显示内容
          title: '未配置'
        },
        {
          // 显示内容
          title: '未配置'
        },
        {
          // 显示内容
          title: '未配置'
        },
        {
          // 显示内容
          title: '未配置'
        },
        {
          // 显示内容
          title: '未配置'
        }
      ],
      // 是否配置的标志
      isSetModule: false,
      nowTimeStr: '', // 实时日期时间
      nowTimerObj: {}, // 实时日期时间的定时器
      // 参数，用于API请求
      param: {
        auth: '',
        mapStyle: '', // 地图主题风格
        'Authorization': '',
        'userId': 1000
      },
      device: [],     // 存放设备信息，并赋予title,devId,address等属性
      // 地图相关
      point: [],      // 存放标注点经纬度信息
      marker: [],     // 存放标注点对象
      map: null,
      // 地图主题样式数组
      mapStyleArr: [
        {
          title: '传统地图样式',
          key: 'normal'
        },
        {
          title: '清新蓝风格',
          key: 'light'
        },
        {
          title: '黑夜风格',
          key: 'dark'
        },
        {
          title: '红色警戒风格',
          key: 'redalert'
        },
        {
          title: '精简风格',
          key: 'googlelite'
        },
        {
          title: '自然绿风格',
          key: 'grassgreen'
        },
        {
          title: '午夜蓝风格',
          key: 'midnight'
        },
        {
          title: '浪漫粉风格',
          key: 'pink'
        },
        {
          title: '青春绿风格',
          key: 'darkgreen'
        },
        {
          title: '清新蓝绿风格',
          key: 'bluish'
        },
        {
          title: '高端灰风格',
          key: 'grayscale'
        },
        {
          title: '强边界风格',
          key: 'hardedge'
        }
      ],
      // 当前选择主题样式
      currentMayStyle: 'midnight',
      styleJson: [],  // 个性化地图的json样式代码
      overlapgroup: [],   // 将经纬度相同的点存放在一个组里
      pointsimplify: [],  // 存放删除了重复点的点数据
      apikey: [],         // 存放不重复的APIKEY值
      timerOnlineMap: 0,
      clickEvent: 0,      // 当前点击显示弹窗序号
      devpanelOnline: [],
      devicehtml: '',
      // 聚合数据展示区域相关
      statisticsCount: {
        deviceTotal: 150, // 设备总数统计
        deviceTodayNew: 13, // 今日新增设备
        cityTotal: 8, // 城市分布总数
        warnTotal: 232, // 故障次数累计
        lightningTotal: 63, // 雷击次数累计
        emptyTotal: 58, // 空开报警次数
        groundTotal: 72, // 接地报警次数
        spdTotal: 39 // spd失效报警次数
      },
      // 屏幕高度
      deviceHeight: 0,
      // 图表左上角右上下角高度（根据屏幕高度来决定）
      echartsGridHeight: 0,
      // 模块1相关
      echartsObj1: null, // echarts实例对象 
      echartsData1: null, // 数据
      // 模块2相关
      echartsObj2: null, // echarts实例对象 
      echartsData2: null, // 数据
      // 模块3相关
      echartsObj3: null, // echarts实例对象 
      echartsData3: null, // 数据
      // 模块4相关
      echartsObj4: null, // echarts实例对象 
      echartsData4: null, // 数据
      // 模块5相关
      echartsObj5: null, // echarts实例对象 
      echartsData5: null, // 数据
      // 模块6相关
      echartsObj6: null, // echarts实例对象 
      echartsData6: null, // 数据
      // 模块7相关
      echartsObj7: null, // echarts实例对象 
      echartsData7: null, // 数据
      // 模块8相关
      echartsObj8: null, // echarts实例对象 
      echartsData8: null, // 数据
      // 即时推送
      stompClient: null,
      // 所有设备（终端设备，非网关）
      allDeviceInfo: [],
      // 报警内容容器显示状态
      alarmListBoxShow: true,
      // 报警内容容器样式
      alarmListBoxStyleObj: {
        'padding': '0 20px 20px 20px',
        'max-height': document.documentElement.clientHeight / 2 + 'px',
        // 'max-height': '100px',
        'overflow-x': 'hidden',
        'overflow-y': 'auto'
      },
      // 所有报警数据
      allAlarmInfo: [],
      // 当前报警信息
      currentAlarmInfo: {

      },
      // 报警弹窗显示状态
      dialogVisibleAlarm: false
    }
  },
  watch: {
    // 屏幕高度
    deviceHeight () {
      // console.log('更新屏幕高度:' + this.deviceHeight)
      // 图表左上角右上下角高度---更新
      this.echartsGridHeight = this.deviceHeight / 100 * 3
      // console.log(this.echartsGridHeight)
    }
  },
  computed: {

    // 左上角用户名渲染前computed
    userName () {                                       // computed的proterty不能与data定义的变量重名
      var userName = sessionGetStore('name')          // 前期测试通过浏览器缓存数据，后期只需浏览器存userId调用用户信息API
      this.$store.commit('setUserName', userName)
      return this.$store.state.userName
    },
    // 页面左侧图表dom结构
    leftLayoutDom () {
      let arr1 = this.moduleList
      // let x1 = arr1.sort(function (a, b) {
      //   return a.num - b.num
      // })
      return arr1.slice(0, 3)
    },
    // 页面右侧图表dom结构
    rightLayoutDom () {
      let arr2 = this.moduleList
      // let x2 = arr2.sort(function (a, b) {
      //   return a.num - b.num
      // })
      return arr2.slice(3, 6)
    },
    // 页面地图下方图表dom结构
    centerBottomDom () {
      let arr3 = this.moduleList
      // let x2 = arr2.sort(function (a, b) {
      //   return a.num - b.num
      // })
      return arr3.slice(6, 8)
      // return arr3.slice(4, 6)
    }
  },
  created () {
    this.titlelogo = sessionGetStore('logo')
    this.indextitle = sessionGetStore('sysName')
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.auth = sessionGetStore('auth')
    var userId = sessionGetStore('userId')
    // 存储报警内容容器显示状态
    sessionSetStore('alarmBoxShow', true)
    // 获取用户的地图主题
    this.currentMayStyle = sessionGetStore('userMap')
    // 无法获取到用户Id，数据异常，退回到登陆界面
    if (!userId) {
      this.notificationInfo('提示', '用户数据过期，拿不到userId,请重新登陆')
      // this.$emit('transferuser', 'login')
      Routers.push({ path: '/login' })
      return
    }
    // 更新屏幕高度
    this.deviceHeight = document.documentElement.clientHeight

    // 获取全部类型设备的基本信息
    this.getDeviceAllTypeInfo()

    // 显示实时日期时间
    var _this = this
    this.nowTimerObj = window.setInterval(function () {
      // 创建当前系统时间的Date对象
      var dateObj = new Date()
      // 获取完整年份值
      var year = dateObj.getFullYear()
      // 获取月份
      var month = dateObj.getMonth() + 1
      // 获取月份中的日
      var date = dateObj.getDate()
      // 获取星期值
      var day = dateObj.getDay()
      var weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      // 根据星期值，从数组中获取对应的星期字符串
      var week = weeks[day]
      // 获取小时
      var hour = dateObj.getHours()
      // 获取分钟
      var minute = dateObj.getMinutes()
      // 获取秒钟
      var second = dateObj.getSeconds()
      // 如果月、日、时、分、秒的值小于10，在前面补0
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      _this.nowTimeStr = year + '年' + month + '月' + date + '日 ' + ' ' + week + ' ' + hour + ':' + minute + ':' + second
    }, 1000)
    // 查询全部设备当前报警
    this.getTriggerCurrentAllFunc()
  },
  mounted () {
    // 获取账号下全部设备信息
    this.getAllDeviceInfo()
    
    // 获取用户统计模块初始设置
    this.getIndexSettings()

    $(window).resize(function () {
      // 更新屏幕高度
      this.deviceHeight = document.documentElement.clientHeight
      // console.log('屏幕高度:' + this.deviceHeight)
    }.bind(this))

    // WebSocket相关
    if (this.stompClient == null) {
      // stomp接收消息方法
      this.stompLink()
    }
    // 初始化先隐藏设备信息面板
    $('#devicepanel').hide()
  },
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.timerOnlineMap)
    window.clearInterval(this.nowTimerObj)
    // WebSocket相关
    // this.stompClient = null
    this.stompClient.disconnect(function () {
      // console.log('断开')
    })
  },
  methods: {
    // 打开报警内容容器
    openAlarmList () {
      // 报警内容容器显示状态---显示
      this.alarmListBoxShow = true
      // 存储报警内容容器显示状态
      sessionSetStore('alarmBoxShow', this.alarmListBoxShow)
    },
    // 关闭报警内容容器
    closeAlarmList () {
      // 报警内容容器显示状态---隐藏
      this.alarmListBoxShow = false
      // 存储报警内容容器显示状态
      sessionSetStore('alarmBoxShow', this.alarmListBoxShow)
    },
    // 点击报警信息中的查看
    ckAlarm (gatewayIndex, alarmIndex) {
      // console.log(this.allAlarmInfo[gatewayIndex].warns[alarmIndex])
      // 报警弹窗显示状态---显示
      this.dialogVisibleAlarm = true
      // 当前报警信息
      this.currentAlarmInfo = JSON.parse(JSON.stringify(this.allAlarmInfo[gatewayIndex].warns[alarmIndex]))
      this.currentAlarmInfo.gatewayName = this.allAlarmInfo[gatewayIndex].nname
      this.currentAlarmInfo.gatewayIndex = gatewayIndex
      this.currentAlarmInfo.alarmIndex = alarmIndex
      this.currentAlarmInfo.triggerId = this.currentAlarmInfo.triggerMsg[0].triggerId // 触发器id
      this.currentAlarmInfo.idArry = this.currentAlarmInfo.triggerMsg[0].idArry // 当前触发器所有报警id
      this.currentAlarmInfo.value = this.currentAlarmInfo.triggerMsg[0].value // 最后触发时的值
      console.log(this.currentAlarmInfo)
    },
    // 查询全部设备当前报警
    getTriggerCurrentAllFunc: function () {
      let paramObj = {
        userId: this.param.userId,
        Authorization: this.param.Authorization
      }
      // console.log(paramObj)
      // 查询全部设备当前报警
      back.getTriggerCurrentAll(paramObj).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('提示：', response.error)
          return
        }
        // 所有报警数据---更新
        this.allAlarmInfo = response.data
        console.log(this.allAlarmInfo)
      }.bind(this))
    },
    // 确认当前报警
    backComfirmTrigger: function () {
      let paramObj = {
        idArry: this.currentAlarmInfo.idArry,
        userId: this.param.userId,
        Authorization: this.param.Authorization
      }
      console.log(paramObj)
      back.comfirmTriggerBatch(paramObj).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.notificationInfo('提示', '解除成功')
          // 报警弹窗显示状态---隐藏
          this.dialogVisibleAlarm = false
          // 当前所有报警信息---删掉目标项
          this.allAlarmInfo[this.currentAlarmInfo.gatewayIndex].warns.splice(this.currentAlarmInfo.alarmIndex, 1)

          // 判断是否还有报警信息
          let haveAlarm = 'noHave' // 默认没有
          // 遍历 当前所有报警信息的网关
          for (let i = 0; i < this.allAlarmInfo.length; i++) {
            // 判断报警的个数是否为0
            if (this.allAlarmInfo[i].warns.length > 0) {
              haveAlarm = 'have'
            }
          }
          // console.log(haveAlarm)
          if (haveAlarm === 'noHave') {
            // 没有报警信息了---隐藏报警弹窗和报警按钮（通过清空当前所有报警信息）
            this.allAlarmInfo = []
          }
          // 获取账号下全部设备信息
          this.getAllDeviceInfo()
          // 报警统计图相关---实时更新
          this.alarmStatisticsLiveupdate()
        }
      }.bind(this))
    },
    // 获取全部类型设备的基本信息
    getDeviceAllTypeInfo () {
      back.deviceAllTypeInfo().then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // console.log(response)
          var deviceTypeRes = response.data
          // 处理接口数据
          deviceTypeRes.sort(function (a, b) {
            return a.type - b.type
          })
          // 设备类型字符串数组
          var deviceTypeArr = ['全部类型']
          // 设备类型对象数组
          var deviceTypeObj = [{
            type: 0,
            name: '全部类型',
            streamNameList: []
          }]
          deviceTypeRes.sort(function (a, b) {
            return a.type - b.type
          })
          console.log(deviceTypeRes)
          // debugger
          for (var i = 0; i < deviceTypeRes.length; i++) {
            deviceTypeArr[i + 1] = deviceTypeRes[i].name
            deviceTypeObj[i + 1] = deviceTypeRes[i]
          }
          // console.log(deviceTypeArr)
          // console.log(deviceTypeObj)
          // 存储设备类型代表数字配置
          sessionSetStore('deviceTypeArr', JSON.stringify(deviceTypeArr))
          sessionSetStore('deviceTypeObj', JSON.stringify(deviceTypeObj))
        }
      }.bind(this))
    },
    // 获取用户统计模块初始设置
    getIndexSettings () {
      back.getIndexModule(this.param).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // console.log(response.data)
          // 按照number排序
          response.data.sort(function (a, b) {  
            return a.number - b.number  
          })
          if (response.data.length === 0) {
            // 未设置---显示未配置
            this.moduleList = this.blankModuleList
          } else {
            // 已设置---根据当前设置显示内容
            this.moduleList = response.data
            // 是否配置的标志---配置了
            this.isSetModule = true
            // 根据首页配置处理全部模块
            this.handleModularShow()
          }
        }
      }.bind(this))
    },
    // 重新计算Echarts图表
    echartsResize (echartsObj) {
      window.addEventListener('resize', function () {
        console.log('重新计算图表大小')
        echartsObj.resize() // 重新计算图表大小
      })
    },
    // 清除图表
    clearEcharts () {
      // 释放图表实例，释放后实例不再可用。
      this.echartsObj1.dispose()
      this.echartsObj2.dispose()
      this.echartsObj3.dispose()
      this.echartsObj4.dispose()
      this.echartsObj5.dispose()
      this.echartsObj6.dispose() 
      this.echartsObj7.dispose()
      this.echartsObj8.dispose()
    },
    // 绘制图表
    echartsDraw () {
      this.$nextTick(function () {
        this.echartsObj1(this.echartsData1)
        this.echartsObj2(this.echartsData2)
        this.echartsObj3(this.echartsData3)
        this.echartsObj4(this.echartsData4)
        this.echartsObj5(this.echartsData5)
        this.echartsObj6(this.echartsData6)
        this.echartsObj7(this.echartsData7)
        this.echartsObj8(this.echartsData8)
      })
    },
    // 根据首页配置处理全部模块
    handleModularShow () {
      // console.log(allModular)
      // 遍历每个模块配置
      for (var i = 0; i < this.moduleList.length; i++) {
        // 查找当前配置内容的id
        var index = ''
        // var id = ''
        for (var j = 0; j < allModular.length; j++) {
          if (this.moduleList[i].contentType === allModular[j].value) {
            index = j
            // id = allModular[j].id
          }
        }
        // console.log(index)
        // console.log(id)
        var functionName = 'getEchartsData'
        functionName = functionName + allModular[index].api;
        // console.log('外：' + functionName);
        (function (athis, modularSetIndex, modularAllIndex, functionName, moduleSet) {
          /*
            athis：this实例
            modularSetIndex：当前模块的索引---当前第几个模块
            modularAllIndex：当前模块所配置的模块在配置表中的索引
            functionName：获取数据接口的方法名称
          */  
          // console.log('内：' + functionName)
          // 调用对应  获取数据接口  的方法
          athis[functionName](modularSetIndex, modularAllIndex, moduleSet)
        })(this, i, index, functionName, this.moduleList[i])
      }
    },
    // 统计模块公用接口---获取模块数据接口1
    getEchartsDataCommon (modularSetIndex, modularAllIndex, moduleSet) {
      // console.log('common' + '---' + moduleSet.contentType)
      var paramObj = {
        auth: this.param.auth,
        userId: this.param.userId,
        contentType: moduleSet.contentType,
        device: moduleSet.device,
        time: moduleSet.time
      }
      back.statisticsInfoCommon(paramObj).then(function (response) {
       
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // console.log(response.data)
          
          // 接口数据
          let apiData = []
          // 判断response.data是否存在
          if (response.data) {
            if (moduleSet.contentType === 'deviceState') {
              // 设备状态统计
              let resData = response.data.deviceState
              apiData = [
                {
                  name: '在线',
                  value: resData.online
                },
                {
                  name: '离线',
                  value: resData.offline
                }
              ]
            } else if (moduleSet.contentType === 'deviceDistribution') { 
              // 设备城市分布
              let resData = response.data.deviceDistribution
              if (resData) {
                for (let i = 0; i < resData.length; i++) {
                  apiData[i] = {
                    name: resData[i].city,
                    value: resData[i].number
                  }
                }
              }
            } else if (moduleSet.contentType === 'deviceType') {
              // 设备类型统计
              let resData = response.data.deviceTypeCount
             
              for (let i = 0; i < resData.length; i++) {
                // 获取设备类型代表数字配置
                let deviceTypeArr = JSON.parse(sessionGetStore('deviceTypeArr'))
                // console.log(deviceTypeArr)
                if(resData[i].type ===3) {
                  apiData[i] = {
                    name: 'NB',
                    value: resData[i].number
                  }
                } else {
                  apiData[i] = {
                    name: deviceTypeArr[resData[i].type],
                    value: resData[i].number
                  }
                }
                
              }
            } else if (moduleSet.contentType === 'alarmHandle') {
              // 报警处理情况统计
              let resData = response.data.alarmHandle
              apiData = [
                {
                  name: '已处理',
                  value: resData.handled
                },
                {
                  name: '未处理',
                  value: resData.unhandled
                }
              ]
            } else if (moduleSet.contentType === 'alarmReason') {
              // 报警原因统计
              let resData = response.data.alarmReason
              for (let i = 0; i < resData.length; i++) {
                apiData[i] = {
                  name: modularAlarm.warnType[resData[i].type],
                  value: resData[i].number
                }
              }
            } else if (moduleSet.contentType === 'alarmNum') {
              // 报警次数统计
              let resData = response.data.alarmNum
              let nameArr = []
              let timeValueArr = []
              for (let i = 0; i < resData.length; i++) {
                let monthDay = new Date(new Date().setDate(new Date().getDate() - i - 1)).toLocaleDateString()
                monthDay = monthDay.substring(5, monthDay.length)
                monthDay = monthDay.replace('/', '.')
                nameArr.unshift(monthDay)
                // nameArr[i] = resData[i].type
                timeValueArr[i] = resData[i].number
              }
              // 数组反转
              timeValueArr.reverse()
              apiData = {
                name: nameArr,
                value: {
                  name: '报警次数',
                  type: 'line',
                  data: timeValueArr
                }
              }
            } else if (moduleSet.contentType === 'voltageOverrunNum') {
              // 电压超限报警次数统计
              let resData = response.data.voltageOver
              let nameArr = []
              let timeValueArr = []
              for (let i = 0; i < resData.length; i++) {
                let monthDay = new Date(new Date().setDate(new Date().getDate() - i - 1)).toLocaleDateString()
                monthDay = monthDay.substring(5, monthDay.length)
                monthDay = monthDay.replace('/', '.')
                nameArr.unshift(monthDay)
                // nameArr[i] = resData.type
                timeValueArr[i] = resData[i].number
              }
              // 数组反转
              timeValueArr.reverse()
              apiData = {
                name: nameArr,
                value: {
                  name: '电压超限报警次数',
                  type: 'line',
                  data: timeValueArr
                }
              }
            } else if (moduleSet.contentType === 'remoteControlNum') {
              // 远控操作次数统计
              let paramObj = {
                mac: moduleSet.device
              }
              let resData = response.data.remoteControl
              if (resData) {
                // 获取当前设备信息
                back.deviceInfoQue(paramObj).then(function (res) {
               
                  if (res.errno === 0) {
                    let streamsInfo = res.data.streamNameList.slice(-4)
                    // console.log(streamsInfo)

                    let remoteControlArr = []
                    let nameArr = []
                    for (let k = 0; k < resData[0].value.length; k++) {
                      let monthDay = new Date(new Date().setDate(new Date().getDate() - k - 1)).toLocaleDateString()
                      monthDay = monthDay.substring(5, monthDay.length)
                      monthDay = monthDay.replace('/', '.')
                      nameArr.unshift(monthDay)
                    }
                    // 遍历4个远控（或者遍历远控监控点，都具有一样的效果，因为数组元素个数都是4）
                    for (let i = 0; i < resData.length; i++) {
                      if (streamsInfo[i].auth === 1) {
                        // 显示此远控（监控点）的
                        let obj = {
                          name: streamsInfo[i].name + '操作次数',
                          type: 'line',
                          data: []
                        }
                        // 遍历每个远控的数据
                        for (let j = 0; j < resData[i].value.length; j++) {
                          obj.data.push(resData[i].value[j].number)
                        }
                        // 数组反转
                        obj.data.reverse()
                        remoteControlArr[i] = obj
                      }
                    }
                    apiData = {
                      name: nameArr,
                      value: remoteControlArr
                    }
                    // 绘制图表
                    this['draw' + this.moduleList[modularSetIndex].echartsType](apiData, modularSetIndex, modularAllIndex)
                  }
                }.bind(this))
              }
            } else {
              if ((modularAllIndex >= 6 && modularAllIndex <= 17) || moduleSet.contentType === 'currentValueUpper') {
                // 报警次数统计统一接口---12个（本来13个，除了第12个电压超限报警次数统计）
                let resData = response.data.warnTypeCount
                let nameArr = []
                let timeValueArr = []
                for (let i = 0; i < resData.length; i++) {
                  let monthDay = new Date(new Date().setDate(new Date().getDate() - i - 1)).toLocaleDateString()
                  monthDay = monthDay.substring(5, monthDay.length)
                  monthDay = monthDay.replace('/', '.')
                  nameArr.unshift(monthDay)
                  // nameArr[i] = resData.type
                  timeValueArr[i] = resData[i].number
                }
                // console.log(timeValueArr)
                // 数组反转
                timeValueArr.reverse()
                apiData = {
                  name: nameArr,
                  value: {
                    // name: '电压超限报警次数',
                    type: 'line',
                    data: timeValueArr
                  }
                }
              }
            }
          }
          // console.log(apiData)
          // 绘制图表
          this['draw' + this.moduleList[modularSetIndex].echartsType](apiData, modularSetIndex, modularAllIndex)
        }
      }.bind(this))

      // // 图表数据处理
      // var apiData = []
      // // 测试 数据很多很少
      // if (modularSetIndex % 2 !== 0) {
      //   // 偶数---多
      //   apiData = [
      //     {value: 173, name: '电压值超上限次数'},
      //     {value: 48, name: '电压值超下限次数'},
      //     {value: 44, name: '可燃气体报警次数'},
      //     {value: 222, name: 'SPD失效报警次数'},
      //     {value: 111, name: '雷击报警次数'},
      //     {value: 40, name: '空开报警次数'},
      //     {value: 17, name: '接地报警次数'},
      //     {value: 22, name: '温湿度报警次数'},
      //     {value: 87, name: '水位报警次数'},
      //     {value: 39, name: '烟感报警次数'},
      //     {value: 111, name: '联动报警次数'}
      //   ]
      // } else {
      //   // 奇数---少
      //   apiData = [
      //     {value: 173, name: '电压值超上限次数'},
      //     {value: 48, name: '电压值超下限次数'}
      //   ]
      // }

      // // 绘制图表
      // this['draw' + this.moduleList[modularSetIndex].echartsType](apiData, modularSetIndex, modularAllIndex)
    },
    // onenet获取数据---获取模块数据接口2
    getEchartsDataOnenet (modularSetIndex, modularAllIndex, moduleSet) {
   
      // console.log('onenet' + '---' + moduleSet.contentType)
      let paramObj = {
        mac: moduleSet.device,
        contentType: moduleSet.contentType
      }
      // 获取当前设备信息
      back.getonenet(paramObj).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.loadingFlag = false
          this.notificationInfo('错误提示', response.error)
          return
        }
        
        let onenetParamObj = {
          apiKey: '',
          deviceId: '',
          datastreamId: [],
          startTime: '',
          endTime: '',
          duration: 28800, // 60*60*24 = 86400  1天=86400秒 半天=43200秒 8小时=28800秒
          limit: 6000,
          cursor: ''
        }
        // 遍历所有设备信息
        // for (let i = 0; i < this.device.length; i++) {
        //   if (response.data.mac === this.device[i].mac) {
        //     // 设置网关信息
        //     onenetParamObj.apiKey = this.device[i].apiKey
        //     onenetParamObj.deviceId = this.device[i].devId
        //     break
        //   }
        // }
          onenetParamObj.apiKey = response.data.apiKey

          onenetParamObj.deviceId = response.data.deviceId
        let streamIdIndex = ''
        // 根据不同设备类型，进行不同的处理
        if (response.data.type === 1) {
          // ispd
          // 根据内容类型，确定监控点的索引，进而取得监控点id
          if (moduleSet.contentType === 'spdOnenetTest') {
            // spd失效Onenet测试
            streamIdIndex = 3
          }
        } else if (response.data.type === 2) {
          // cj485
          // 根据内容类型，确定监控点的索引，进而取得监控点id
          if (moduleSet.contentType === 'galvanicCurrent') {
            // 电流值走势
            streamIdIndex = 6
          } else if (moduleSet.contentType === 'thunderstrikePeakValue') {
            // 雷击峰值走势
            streamIdIndex = 7
          }
        }
        // 数据流id
        // onenetParamObj.datastreamId[0] = response.data.streamNameList[streamIdIndex].streamId
        // 时间相关
        let nowDate = new Date()
        function getNowFormatDate (date) {
          let seperator1 = '-'
          let seperator2 = ':'
          let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
          let strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          let currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate +
              'T'  + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + seperator2  + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
              seperator2 + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
          return currentdate
        }
        let nowTime = getNowFormatDate(nowDate)
        // console.log(nowTime)
        let oldTime = getNowFormatDate(new Date(nowDate.getTime() - moduleSet.time * 24 * 60 * 60 * 1000))
        // console.log(oldTime)

        // yyyy-MM-dd HH:MM:SS
        // 开始时间
        onenetParamObj.startTime = oldTime
        // 结束时间
        onenetParamObj.endTime = nowTime
        // console.log(onenetParamObj)
        // 查询历史数据
        // console.log(onenet)
        var obj = response.data
        obj.startTime = oldTime
        obj.endTime = nowTime
        // obj.limit = 6000
        onenetParamObj.datastreamId = response.data.streamIds.toString()
        onenet.onenetStartOneHisQue(onenetParamObj).then(function (response) {
  
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            this.loadingFlag = false
          }
          // console.log(response.data)
          if (response.data) {
            // 接口数据
            let apiData = []
            let nameArr = []
            let timeValueArr = []
            if (response.data.datastreams.length === 1) {
              let resData = response.data.datastreams[0].datapoints
              for (let i = 0; i < resData.length; i++) {
                let timeAt = resData[i].at.substring(0, resData[i].at.length - 4)
                // console.log(timeAt)
                nameArr.push(timeAt)
                timeValueArr.push(resData[i].value)
              }
            } else {
              let resData = response.data.datastreams
              for (let i = 0; i < resData[0].datapoints.length; i++) {
                for (let j= 0; j < resData[1].datapoints.length; j++) {
                  if ( resData[0].datapoints[i].at === resData[1].datapoints[j].at) {
                    let timeAt = resData[0].datapoints[i].at.substring(0, resData[0].datapoints[i].at.length - 4)
                    nameArr.push(timeAt)
                    timeValueArr.push(resData[0].datapoints[i].value * resData[1].datapoints[j].value)
                  }
                }
                // console.log(timeAt)
              }
            }
            // response.data.map(item=>{
            //   timeValueArr.push(item.current_value)
            //   nameArr.push(item.update_at)
            // })
            apiData = {
              name: nameArr,
              value: {
                // name: '电压超限报警次数',
                type: 'line',
                data: timeValueArr
              }
            }
            // 绘制图表
            this['draw' + this.moduleList[modularSetIndex].echartsType](apiData, modularSetIndex, modularAllIndex)
          }
        }.bind(this))
          .catch(function (err) {
            console.log(err)
          })
      }.bind(this))
      
      // // 图表数据处理
      // var apiData = []
      // if (modularSetIndex % 2 === 0) {
      //   // 偶数---多
      //   apiData = [
      //     {value: 173, name: '电压超限报警次数'},
      //     {value: 44, name: '可燃气体报警次数'},
      //     {value: 222, name: 'SPD失效报警次数'},
      //     {value: 111, name: '雷击报警次数'},
      //     {value: 40, name: '空开报警次数'},
      //     {value: 17, name: '接地报警次数'},
      //     {value: 22, name: '温湿度报警次数'},
      //     {value: 87, name: '水位报警次数'},
      //     {value: 39, name: '烟感报警次数'},
      //     {value: 111, name: '联动报警次数'}
      //   ]
      // } else {
      //   // 奇数---少
      //   apiData = [
      //     {value: 173, name: '电压超限报警次数'},
      //     {value: 44, name: '可燃气体报警次数'}
      //   ]
      // }

      // // 绘制图表
      // this['draw' + this.moduleList[modularSetIndex].echartsType](apiData, modularSetIndex, modularAllIndex)
    },
    // // onenet查询最多limit个历史数据,从cursor开始
    // onenetTrendNextFunc: function (cursor) {
    //   onenet.onenetHisTrendQueNext(this.param).then(function (response) {
    //     // console.log('onenet查询近期最多limit个历史数据,从cursor开始')
    //     if (response.errno !== 0) {
    //       this.notificationInfo('错误提示', response.error)
    //       return
    //     }
    //     // 若第一次查询数据返回参数没有cursor，则表示没有数据，即不再进行下次查询
    //     if (response.data.cursor !== undefined) {
    //       this.onenetTrendNextFunc(response.data.cursor)
    //     }
    //   }.bind(this))
    //     .catch(function (err) {
    //       console.log(err)
    //     })
    // },
    // 绘制饼图
    drawpie (apiData, modularIndex, modularAllIndex) {
      /*
        标签是否显示
      */
      var labelShow = true
      /*
        标签的位置
          outside：饼图扇区外侧，inside：饼图扇区内部，center：饼图中心位置
      */
      var labelPosition = 'outside'
      // 根据饼图数据的多少，修改饼图配置项
      // if (apiData.length > 5) {
      //   labelShow = false
      // }

      // 使用在饼图中的数据格式
      var echartsData = apiData
      var echartsOption = {
        tooltip: {
          formatter: '{b} : {c} ({d}%)',
          position: function (point) {
            return [point[0], point[1]]
          }
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        series: [
          {
            type: 'pie',
            // 扇形的半径
            radius: '60%',
            // 扇形位置
            center: ['48%', '53%'],
            data: echartsData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                // 是否显示
                show: labelShow,
                // 修改标签的位置
                position: labelPosition, // 标签的位置
                // width: '50%',
                // 修改标签的文字
                formatter: '{b} : {d}' + '%',
                // formatter (v) { 
                //   let text = v.name + ':' + Math.round(v.percent) + '%'
                //   if (text.length <= 8) {
                //     // text = text
                //   } else if (text.length > 8 && text.length <= 16) {
                //     text = `${text.slice(0, 8)}\n${text.slice(8)}`
                //   } else if (text.length > 16 && text.length <= 24) {
                //     text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16)}`
                //   } else if (text.length > 24 && text.length <= 30) {
                //     text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24)}`
                //   } else if (text.length > 30) {
                //     text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24, 30)}\n${text.slice(30)}` 
                //   }
                //   return text 
                // },
                textStyle: {
                  fontSize: 10
                }
              }
            }
            // 折线
            // labelLine: {
            //   normal: {
            //     show: false
            //   }
            // }
          }
        ],
        // 颜色
        color: [
          '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF', '#FF99FF', '#FF9900', '#FFFFCC', '#669900', '#CCFFFF', '#33CCFF', '#CC0099'
        ]
      }
      this.$nextTick(() => {
        // 创建echarts实例
        this['echartsObj' + (modularIndex + 1)] = echarts.init(document.getElementById('echartsDom' + (modularIndex + 1)))
        // 使用刚指定的配置项和数据显示图表
        this['echartsObj' + (modularIndex + 1)].setOption(echartsOption)
        // 浏览器宽度变化，重新计算Echarts图表
        this.echartsResize(this['echartsObj' + (modularIndex + 1)])
      })
    },
    // 绘制柱状图
    drawbar (apiData, modularIndex, modularAllIndex) {
      var nameArr = []
      var valueArr = []
      for (var i = 0; i < apiData.length; i++) {
        nameArr[i] = apiData[i].name
        valueArr[i] = apiData[i].value
      }
      // 使用在柱状图中的数据格式
      var echartsData = {
        name: nameArr,
        value: valueArr
      }
      var echartsOption = {
        tooltip: {
          formatter: '{b} : {c}'
          // position: function (point) {
          //   return [point[0], point[1]]
          // }
        },
        // 直角坐标系内绘图网格
        grid: {
          // 左上角坐标
          x: this.deviceHeight > 750 ? 60 : 45,
          y: this.echartsGridHeight,
          // 右下角坐标
          x2: 36,
          y2: 30
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          data: echartsData.name,
          // 坐标轴刻度与标签对齐
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#F4F5F5'
          }
        },
        yAxis: {
          type: 'value',
          // 修改轴上的字体颜色
          axisLabel: {
            color: '#F4F5F5'
          }
        },
        series: [{
          data: echartsData.value,
          type: 'bar',
          // barWidth: 25, // 柱图宽度
          barMaxWidth: 50, // 柱图最大宽度
          itemStyle: {
            normal: {
              // 柱状体颜色
              color: function (params) {
                // 首先定义一个数组 
                // var colorList = [
                //   '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF', '#FF99FF', '#FF9900', '#FFFFCC', '#669900', '#CCFFFF', '#33CCFF', '#CC0099'
                // ]
                var colorList = [
                  '#FFAC4A', '#FDFF4A', '#FFAC4A', '#FDFF4A', '#FFAC4A', '#FDFF4A', '#FFAC4A', '#FDFF4A', '#FFAC4A', '#FDFF4A', '#FFAC4A', '#FDFF4A', '#FFAC4A', '#FDFF4A'
                ]
                return colorList[params.dataIndex]
              }
            }
          }
        }],
        // 颜色
        color: [
          '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF', '#FF99FF', '#FF9900', '#FFFFCC', '#669900', '#CCFFFF', '#33CCFF', '#CC0099'
        ]
      }
      this.$nextTick(() => {
        // 创建echarts实例
        this['echartsObj' + (modularIndex + 1)] = echarts.init(document.getElementById('echartsDom' + (modularIndex + 1)))
        // 使用刚指定的配置项和数据显示图表
        this['echartsObj' + (modularIndex + 1)].setOption(echartsOption)
        // 浏览器宽度变化，重新计算Echarts图表
        this.echartsResize(this['echartsObj' + (modularIndex + 1)])
      })
    },
    // 绘制环形图
    drawannular (apiData, modularIndex, modularAllIndex) {
      /*
        标签是否显示
      */
      var labelShow = true
      /*
        标签的位置
          outside：饼图扇区外侧，inside：饼图扇区内部，center：饼图中心位置
      */
      var labelPosition = 'outside'
      // 根据饼图数据的多少，修改饼图配置项
      // if (apiData.length < 5) {
      //   labelShow = true
      // }

      // 使用在环形图中的数据格式
      var echartsData = apiData
      // 图例内容
      var nameArr = []
      for (var i = 0; i < apiData.length; i++) {
        nameArr[i] = apiData[i].name
      }
      var echartsOption = {
        tooltip: {
          formatter: '{b} : {c} ({d}%)',
          position: function (point) {
            return [point[0], point[1]]
          }
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        legend: {
          // 是否显示图例
          show: false,
          // 图例布局方向
          orient: 'vertical',
          // x: '74%',
          // y: '68%',
          right: '5%',
          bottom: '5%',
          data: nameArr,
          // 修改图例文字颜色
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '故障数目',
            type: 'pie',
            radius: ['50%', '60%'],
            center: ['48%', '53%'],
            // avoidLabelOverlap: false,
            label: {
              // 是否显示
              show: labelShow,
              // 修改标签的位置
              position: labelPosition, // 标签的位置
              // width: '50%',
              // 修改标签的文字
              formatter: '{b} : {d}' + '%',
              // formatter (v) { 
              //   let text = v.name + ':' + Math.round(v.percent) + '%'
              //   if (text.length <= 8) {
              //     // text = text
              //   } else if (text.length > 8 && text.length <= 16) {
              //     text = `${text.slice(0, 8)}\n${text.slice(8)}`
              //   } else if (text.length > 16 && text.length <= 24) {
              //     text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16)}`
              //   } else if (text.length > 24 && text.length <= 30) {
              //     text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24)}`
              //   } else if (text.length > 30) {
              //     text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24, 30)}\n${text.slice(30)}` 
              //   }
              //   return text 
              // },
              textStyle: {
                fontSize: 10
              }
              // emphasis: {
              //   show: true,
              //   textStyle: {
              //     fontSize: '20',
              //     fontWeight: 'normal'
              //   }
              // }
            },
            // labelLine: {
            //   normal: {
            //     show: false
            //   }
            // },
            data: echartsData
          }
        ],
        // 颜色
        color: [
          '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF', '#FF99FF', '#FF9900', '#FFFFCC', '#669900', '#CCFFFF', '#33CCFF', '#CC0099'
        ]
      }
      this.$nextTick(() => {
        // 创建echarts实例
        this['echartsObj' + (modularIndex + 1)] = echarts.init(document.getElementById('echartsDom' + (modularIndex + 1)))
        // 使用刚指定的配置项和数据显示图表
        this['echartsObj' + (modularIndex + 1)].setOption(echartsOption)
        // 浏览器宽度变化，重新计算Echarts图表
        this.echartsResize(this['echartsObj' + (modularIndex + 1)])
      })
    },
    // 绘制折线图
    drawline (apiData, modularIndex, modularAllIndex) {
      // console.log(apiData)
      // 使用在折线图中的数据格式
      // var echartsData = {
      //   name: nameArr,
      //   value: timeValueArr
      // }
      var echartsData = apiData
      var echartsOption = {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a}</br>{b} : {c}'
        // },
        tooltip: {
          trigger: 'axis'
          // position: function (point) {
          //   return [point[0], point[1]]
          // }
          // formatter: '{a}</br>{b} : {c}'
        },
        grid: {
          // 左上角坐标
          x: this.deviceHeight > 750 ? 60 : 50,
          y: this.echartsGridHeight,
          // 右下角坐标
          x2: 26,
          y2: 30
          // containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          // 坐标轴两边留白策略
          // boundaryGap: false,
          data: echartsData.name,
          // 坐标轴刻度与标签对齐
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#F4F5F5'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#F4F5F5'
          },
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(8, 191, 218, 0.3)'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: echartsData.value,
        // [
        //   {
        //     name: '故障统计',
        //     type: 'line',
        //     // 点的样式
        //     symbol: 'circle',     // 设定为实心点
        //     symbolSize: 5,   // 设定实心点的大小
        //     // areaStyle: {normal: {
        //     //   color: new echarts.graphic.LinearGradient(
        //     //     0, 0, 0, 1,
        //     //     // 渐变
        //     //     [
        //     //       {offset: 0, color: 'red'},
        //     //       {offset: 1, color: '#ddd'}
        //     //     ]
        //     //   )
        //     // }},
        //     itemStyle: {  
        //       normal: {
        //         // 点的颜色
        //         color: '#E55454',
        //         // 折线的样式
        //         lineStyle: {  
        //           color: '#E55454',
        //           width: 1 
        //         }  
        //       }  
        //     },  
        //     data: echartsData.value
        //   }
        // ],
        // 颜色
        color: [
          '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF', '#FF99FF', '#FF9900', '#FFFFCC', '#669900', '#CCFFFF', '#33CCFF', '#CC0099'
        ]
      }
      this.$nextTick(() => {
        // 创建echarts实例
        this['echartsObj' + (modularIndex + 1)] = echarts.init(document.getElementById('echartsDom' + (modularIndex + 1)))
        // 使用刚指定的配置项和数据显示图表
        this['echartsObj' + (modularIndex + 1)].setOption(echartsOption)
        // 浏览器宽度变化，重新计算Echarts图表
        this.echartsResize(this['echartsObj' + (modularIndex + 1)])
      })
    },
    // 返回登录页面
    tologinBt: function () {
      console.log('退出')
      // 清除浏览器本地存储
      sessionClearStore()
      // 这里跳转页面的方法此组件的父组件App.vue中，通过触发自定义函数transferuser，将参数('login'，要跳转的页面)传给App.vue
      this.$emit('transferuser', 'login')
    },
    // 跳转到home页
    goHomePage () {
      Routers.push({ path: '/home' })
    },
    // 地图主题样式选择器修改
    changeMapStyle: function (value) {
      // 当前选择地图主题样式---修改
      this.currentMayStyle = value
      // 修改地图主题样式
      this.map.setMapStyle({
        style: this.currentMayStyle
      })
      // 修改地图主题参数
      this.param.mapStyle = value
      // 设置地图主题---请求后台接口
      back.setMapStyle(this.param).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.notificationInfo('提示', '地图主题修改成功')
          sessionSetStore('userMap', value) // 地图主题
        }
      }.bind(this))
    },
    // 获取账号下全部设备信息
    getAllDeviceInfo () {
      back.allDeviceInfo(this.param).then(function (response) {
       
        // console.log(response)
        let k = 0
        if (response.data) {
          // 遍历数组
          for (let i = 0; i < response.data.length; i++) {
            let locat = response.data[i].location
            this.point[k] = new BMap.Point(locat.lon, locat.lat)
            // console.log(this.point[k])
            let obj = {}
            obj.title = response.data[i].name
            obj.devId = response.data[i].deviceId
            obj.apiKey = response.data[i].apiKey
            obj.sn = response.data[i].sn
            obj.mac = response.data[i].mac
            obj.address = ''
            obj.points = []
            obj.type = response.data[i].type
            if (response.data[i].isWarn === 1) {
              // 存在报警
              obj.online = 2
            } else {
              // 不存在报警
              obj.online = response.data[i].isOnline
            }
            obj.onlineimg = '/static/icon2Status' + obj.online + '.png'
            obj.points.push(this.point[k])
            // 获取设备地理位置信息
            let geoc = new BMap.Geocoder()
            geoc.getLocation(this.point[k], function (rs) {
              var addComp = rs.addressComponents
              obj.address = addComp.province + addComp.city
            })
            this.device[k] = obj
            // 存储apikey（去重）
            this.pushApikey(response.data[i].apiKey)
            k++
          }
        }
        // console.log(this.device)
        // 地图初始化
        this.mapinit()
        // 将经纬度相同的点存放在一个组里
        this.countmarkers()
      }.bind(this))
    },
    
    // 地图初始化
    mapinit: function () {
      // 创建Map实例
      this.map = new BMap.Map('allmap')
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
      // 左上角，添加比例尺
      var topleftcontrol = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT})
      this.map.addControl(topleftcontrol)
      // 左上角，添加默认缩放平移控件
      var topleftnavigation = new BMap.NavigationControl()
      this.map.addControl(topleftnavigation)            // 添加平移缩放控件
      // 左上角添加城市列表控件
      this.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(80, 60)
      }))
      // 根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别
      this.setCenterandZoom()
      // 个性化地图
      // // 个性化地图1------（需要引入json文件，略慢）
      // this.map.setMapStyleV2({styleJson: this.styleJson})
      // 个性化地图2---午夜蓝风格---（不需要引入json文件，略快）
      // var mapStyle = { style: 'midnight' }  // 午夜蓝
      // var mapStyle = { style: 'dark' }  // 黑夜
      this.map.setMapStyle({
        style: this.currentMayStyle
      })
      // 添加刷新页面图标及功能
      function Refresh () {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT
        this.defaultOffset = new BMap.Size(90, 90)
      }
      Refresh.prototype = new BMap.Control()
      Refresh.prototype.initialize = function (map) {
        var ref = document.createElement('input')
        document.body.appendChild(ref)
        ref.type = 'image'
        ref.src = '/static/refresh.png'
        ref.style = 'height: 35px; width: 35px'
        ref.onclick = function (e) {
          Routers.push({ path: '/home/blank' })
        }
        map.getContainer().appendChild(ref)
        return ref
      }
      if (navigator.userAgent.indexOf('Chrome') !== -1) {
        var myrefresh = new Refresh()
        this.map.addControl(myrefresh)
      }
      // 设置版权标识
      var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
      this.map.addControl(cr)
      var bs = this.map.getBounds()
      cr.addCopyright({id: 1, content: `<img src= ${this.titlelogo} height=30px/>`, bounds: bs})
    },
    // stomp协议数据长连接 
    stompLink: function () {
      this.stompClient = Stomp.client('ws://114.55.67.62:15674/ws') // 测试
      // this.stompClient = Stomp.client('ws://116.62.155.56:15674/ws') // 雷泰
      // Declare on_connect
      var onConnect = function (x) {
        // 雷泰
        this.stompClient.subscribe('/exchange/leitai/' + this.param.userId, function (data) {
        // // 测试
        // this.stompClient.subscribe('/exchange/zuannuo/' + this.param.userId, function (data) {
          console.log('长链接连接成功')
          if (data.body) {
            // 获取到数据
            // console.log(data.body)
            var resObj = JSON.parse(data.body)
            // console.log(resObj)
            // console.log(this)
            // 判断推送类型
            if (resObj.type === 'A') {
              // 设备上下线推送
              console.log('设备上下线推送')
              for (let i = 0; i < this.overlapgroup.length; i++) {
                for (let j = 0; j < this.overlapgroup[i].length; j++) { 
                  if (resObj.mac === this.overlapgroup[i][j].mac) {
                    // 修改状态
                    this.overlapgroup[i][j].online = resObj.state
                    // 修改图片属性
                    this.overlapgroup[i][j].onlineimg = '/static/icon2Status' + resObj.state + '.png'
                    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
                    this.addmarkerandInfo()
                    let str = ''
                    if (resObj.state === 0) {
                      str = '已离线'
                    } else if (resObj.state === 1) {
                      str = '已上线'
                    }
                    // 提示
                    this.notificationInfo('提示', '设备' + this.overlapgroup[i][j].title + str)
                  }
                }
              }
              // 设备状态统计---实时更新
              this.deviceStateLiveupdate()
              // /*
              // let x = {
              //   userId: '5cd538ffe4b0a6d2d74c3131', // 用户id
              //   state: 0,  // 设备在线状态
              //   mac: '5cf76503e4b007e8e83e6020',    // 设备mac
              //   type: 'A'  // 推送类型
              // }
              // let y = {
              //   "userId": "5cd538ffe4b0a6d2d74c3131",
              //   "state": 1,
              //   "mac": "5cf76503e4b007e8e83e6020",
              //   "type": "A"
              // }
              // */
            } else if (resObj.type === 'B') {
              // 设备报警推送
              console.log('设备报警推送')

              // 地图图标更换
              for (let i = 0; i < this.overlapgroup.length; i++) {
                for (let j = 0; j < this.overlapgroup[i].length; j++) { 
                  if (resObj.mac === this.overlapgroup[i][j].mac) {
                    // 修改状态
                    this.overlapgroup[i][j].online = 2
                    // 修改图片属性
                    this.overlapgroup[i][j].onlineimg = '/static/icon2Status2.png'
                    console.log(this.overlapgroup[i][j])
                    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
                    this.addmarkerandInfo()
                    // let str = '设备' + this.overlapgroup[i][j].title
                    // str += '出现' + modularAlarm.warnType[resObj.warnType] + ','
                    // str += '报警内容为' + resObj.content
                    // // 提示
                    // this.notificationInfo('提示', str, 0)
                  }
                }
              }

              // 报警处理容器相关
              let isWghav = false // 当前所有报警信息中是否含有此网关
              // 遍历 当前所有报警信息的网关
              for (let i = 0; i < this.allAlarmInfo.length; i++) {
                if (resObj.sn === this.allAlarmInfo[i].sn) {
                  // 目标网关本来就含有报警信息---当前所有报警信息中在目标网关对象下，追加报警信息
                  isWghav = true // 当前网关含有报警
                  let isWarnshav = false // 当前所有报警信息中是否含有此触发器
                  // 遍历网关下的warns
                  for (let j = 0; j < this.allAlarmInfo[i].warns.length; j++) {
                    if (resObj.triggerId === this.allAlarmInfo[i].warns[j].triggerMsg[0].triggerId) {
                      // 含有当前触发器
                      isWarnshav = true // 含有当前触发器
                      this.allAlarmInfo[i].warns[j].triggerMsg[0].idArry.push(resObj.id)
                      this.allAlarmInfo[i].warns[j].triggerMsg[0].value = resObj.value
                    }
                  }
                  if (!isWarnshav) {
                    // 不含当前触发器
                    this.allAlarmInfo[i].warns.push({
                      dname: resObj.dName,
                      tname: resObj.name,
                      content: resObj.content,
                      triggerMsg: [
                        {
                          value: resObj.value,
                          triggerId: resObj.triggerId,
                          idArry: [
                            resObj.id
                          ]
                        }
                      ]
                    })
                  }
                }
              }
              if (!isWghav) {
                // 目标网关本来不含有报警信息---当前所有报警信息中需要添加这个网关对象
                let obj = {
                  nname: resObj.nName,
                  sn: resObj.sn,
                  warns: [
                    {
                      dname: resObj.dName,
                      tname: resObj.name,
                      content: resObj.content,
                      triggerMsg: [
                        {
                          value: resObj.value,
                          triggerId: resObj.triggerId,
                          idArry: [
                            resObj.id
                          ]
                        }
                      ]
                    }
                  ]
                }
                this.allAlarmInfo.push(obj)
              }
              console.log(this.allAlarmInfo)

              // 报警统计图相关---实时更新
              this.alarmStatisticsLiveupdate()
              // let x = {
              //   userId: '5cd538ffe4b0a6d2d74c3131', // 用户id
              //   warnType: 1, // 报警类型
              //   content: '雷击报警', // 报警内容
              //   mac: '5cf76503e4b007e8e83e6020', // 设备mac
              //   sn: 'FR000001',    // 网关sn
              //   type: 'B'  // 推送类型
              // }
              // let y = {
              //   "userId": "5cd538ffe4b0a6d2d74c3131",
              //   "warnType": 1,
              //   "content": "leiji>50",
              //   "mac": "5cf76503e4b007e8e83e6020",
              //   "sn": "FR000001",
              //   "type": "B"
              // }
            } else if (resObj.type === 'C') {
              console.log(resObj)
              // 网关上下线
              console.log('网关上下线')
              // 获取账号下全部设备信息
              this.getAllDeviceInfo()
              // 设备状态统计---实时更新
              this.deviceStateLiveupdate()
              // let x = {
              //   userId: '5cd538ffe4b0a6d2d74c3131', // 用户id
              //   state: 0,  // 网关在线状态
              //   sn: 'FR000001',    // 网关sn
              //   type: 'C'  // 推送类型
              // }
              // let y = {
              //   "userId": "5cd538ffe4b0a6d2d74c3131",
              //   "state": 0,
              //   "sn": "FR000001",
              //   "type": "C"
              // }
            }
          } else {
            console.log('empty')
          }
        }.bind(this))
      }.bind(this)
      // Declare on_error
      var onError = function () {
        console.log('error')
      }
      // Conect to RabbitMQ
      this.stompClient.connect('thingcom', '106ling106', onConnect, onError) // 雷泰
      // this.stompClient.connect('zuannuo', 'zn123456', onConnect, onError) // 测试
    },
    // 设备状态统计---实时更新
    deviceStateLiveupdate () {
      // console.log('设备状态统计---实时更新')
      // 判断是否配置了 设备状态统计
      for (let i = 0; i < this.moduleList.length; i++) {
        if (this.moduleList[i].contentType === 'deviceState') {
          // console.log('配置了 设备状态统计')
          // 查找当前配置内容的id
          let index = ''
          // var id = ''
          for (let j = 0; j < allModular.length; j++) {
            if (this.moduleList[i].contentType === allModular[j].value) {
              index = j
              // id = allModular[j].id
            }
          }
          // 统计模块公用接口---获取模块数据接口1
          this.getEchartsDataCommon(i, index, this.moduleList[i])
        }
      }
    },
    // 报警统计图相关---实时更新
    alarmStatisticsLiveupdate () {
      for (let i = 0; i < this.moduleList.length; i++) {
        // 判断是否配置了 报警处理情况统计、报警原因统计 中的一项
        if (this.moduleList[i].contentType === 'alarmHandle' || this.moduleList[i].contentType === 'alarmReason') {
          // 查找当前配置内容的id
          let index = ''
          // var id = ''
          for (let j = 0; j < allModular.length; j++) {
            if (this.moduleList[i].contentType === allModular[j].value) {
              index = j
              // id = allModular[j].id
            }
          }
          // 统计模块公用接口---获取模块数据接口1
          this.getEchartsDataCommon(i, index, this.moduleList[i])
        }
      }
    },
    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
    addmarkerandInfo: function () {
      this.map.clearOverlays()
      
      console.log(this.overlapgroup)
      // 简化添加标注点和标签
      for (let i = 0; i < this.overlapgroup.length; i++) {
        // console.log(this.overlapgroup[i][0].online)
        // 按重叠分组的第一个点添加标注
        var myIconOn = new BMap.Icon('/static/icon1Status' + this.overlapgroup[i][0].online + '.png', new BMap.Size(32, 32))
        this.marker[i] = new BMap.Marker(this.overlapgroup[i][0].points[0], {icon: myIconOn})
        if (this.overlapgroup[i][0].online === 0) {
          // 离线
          this.marker[i].setZIndex(400 + i)
        } else if (this.overlapgroup[i][0].online === 1) {
          // 在线
          this.marker[i].setZIndex(1 + i)
        } else if (this.overlapgroup[i][0].online === 2) {
          // 报警
          this.marker[i].setZIndex(800 + i)
        }
        
        this.map.addOverlay(this.marker[i])
        // 添加标注点重叠数量标签
        var label = new BMap.Label(this.overlapgroup[i].length, {offset: new BMap.Size(20, -10)})
        this.marker[i].setLabel(label)
        this.marker[i].addEventListener('click', function () {
          // 获取点击的标注点序号
          this.clickEvent = i
          this.devicehtml = '<div class="class2"><span class="class00 class01">编号</span><span  class="class00 class02">名称</span>' +
          '<span class="class00 class03">ID</span><span class="class00 class04">状态</span><span class="class00 class05">地址</span>' +
          '<span class="class00" style="width:20px;float:left;margin-left:5px;"></span></div>'
          /*
            `
              <div class="class2">
                <span class="class1">编号</span>
                <span class="class1">名称</span>
                <span class="class1">ID</span>
                <span class="class1">状态</span>
                <span class="class1">地址</span>
                <span class="class1"></span>
              </div>
            `
          */
          document.getElementById('deviceinfo').innerHTML = this.devicehtml
          this.devpanelOnline = []
          for (let k = 0; k < this.overlapgroup[i].length; k++) {
            this.devpanelOnline.push(this.overlapgroup[i][k].online)
            var csObjJSON = JSON.stringify(this.overlapgroup[i][k]).replace(/"/g, '&' + '#34')
            var MyComponent = Vue.extend({
              template: '<div class="wgdzxx"></br></br><div class="class2"><span class="class00 class01">' + k + '</span><span class="class00 class02">' + this.overlapgroup[i][k].title +
              '</span><span class="class00 class03">' + this.overlapgroup[i][k].devId + '</span><span class="class00 class04"><img style="float:left;margin-left:15px" src=' + this.overlapgroup[i][k].onlineimg + '></span>' +
              '<span class="class00 class05">' + this.overlapgroup[i][k].address + '</span><span style="width:20px;float:left;margin-left:5px;cursor:default" v-on:click="todevice(' + "'" + csObjJSON + "'" + ')">>></span></div></div>',
              /*
                `
                  <div>
                    </br></br>
                    <div class="class2">
                      <span class="class1">${k}</span>
                      <span class="class1">${this.overlapgroup[i][k].title}</span>
                      <span class="class1">${this.overlapgroup[i][k].devId}</span>
                      <span class="class1"><img src=${this.overlapgroup[i][k].onlineimg}></span>
                      <span class="class1">${this.overlapgroup[i][k].address}</span>
                      <span style="width:20px;float:right;margin:5px;cursor:default" v-on:click="todevice(${this.overlapgroup[i][k].sn})">>></span>
                    </div>
                  </div>
                `
              */
              methods: {
                todevice: function (deviceObj) {
                  deviceObj = deviceObj.replace(/&#34/g, '"')
                  deviceObj = JSON.parse(deviceObj)
                  console.log(deviceObj)
                  sessionSetStore('deviceSNNow', deviceObj.sn)
                  sessionSetStore('apikeyNow', deviceObj.apiKey)
                  sessionSetStore('deviceIdNow', deviceObj.devId)
                  sessionSetStore('gatewayName', deviceObj.title)
                  sessionSetStore('nbmac', deviceObj.mac)
                  // if (deviceObj.online === 2) {
                  //   // 报警---前往报警统计页
                  //   Routers.push({ path: '/home/device/data/watchone' })
                  // } else {
                    // 在线或者离线---前往设备管理页
                  if (deviceObj.type==3 ) {
                    this.$bus.$emit('isnb', true)
                    sessionSetStore('isnb', true)
                    Routers.push({ path: `/home/device/data/deviceNb` , query: { id: deviceObj.mac } })
                  } else {
                    sessionSetStore('isnb', false)
                  Routers.push({ path: '/home/device/data/watchone' })
                  }
                  // }
                }
              }
            })
            var component = new MyComponent().$mount()
            document.getElementById('deviceinfo').appendChild(component.$el)

            $('#devicepanel').show()
          }
        }.bind(this))
        // 处理面板打开之后，在线离线状态刷新的问题
        if (this.devpanelOnline[0] !== undefined) {
          let num = 0
          for (let k = 0; k < this.overlapgroup[this.clickEvent].length; k++) {
            if (this.overlapgroup[this.clickEvent][k].online !== this.devpanelOnline[k]) {
              num = num + 1
              this.devpanelOnline[k] = this.overlapgroup[this.clickEvent][k].online
            }
          }
          if (num !== 0) {
            document.getElementById('deviceinfo').innerHTML = this.devicehtml
            for (let j = 0; j < this.overlapgroup[this.clickEvent].length; j++) {
              var csObjJSON = JSON.stringify(this.overlapgroup[this.clickEvent][j]).replace(/"/g, '&' + '#34')
              var MyComponent = Vue.extend({
                template: '<div class="wgdzxx"></br></br><div class="class2"><span class="class00 class01">' + j + '</span><span class="class00 class02">' + this.overlapgroup[this.clickEvent][j].title +
                '</span><span class="class00 class03">' + this.overlapgroup[this.clickEvent][j].devId + '</span><span class="class00 class04"><img style="float:left;margin-left:15px" src=' + this.overlapgroup[this.clickEvent][j].onlineimg + '></span>' +
                '<span class="class00 class05">' + this.overlapgroup[this.clickEvent][j].address + '</span><span style="width:20px;float:left;margin-left:5px;cursor:default" v-on:click="todevice(' + "'" + csObjJSON + "'" + ')">>></span></div></div>',
                /* 
                  `
                    <div>
                      </br></br>
                      <div class="class2">
                        <span class="class1">${j}</span>
                        <span class="class1">${this.overlapgroup[this.clickEvent][j].title}</span>
                        <span class="class1">${this.overlapgroup[this.clickEvent][j].devId}</span>
                        <span class="class1"><img src=${this.overlapgroup[this.clickEvent][j].onlineimg}></span>
                        <span class="class1">${this.overlapgroup[this.clickEvent][j].address}</span>
                        <span style="width:20px;float:right;margin:5px;cursor:default" v-on:click="todevice(${this.overlapgroup[this.clickEvent][j].sn})">>></span>
                      </div>
                    </div>
                  `
                */
                methods: {
                  todevice: function (deviceObj) {
                    // debugger
                    deviceObj = deviceObj.replace(/&#34/g, '"')
                    deviceObj = JSON.parse(deviceObj)
                    console.log(deviceObj)
                    sessionSetStore('deviceSNNow', deviceObj.sn)
                    sessionSetStore('apikeyNow', deviceObj.apiKey)
                    sessionSetStore('deviceIdNow', deviceObj.devId)
                    if (deviceObj.online === 2) {
                      // 报警---前往报警统计页
                      Routers.push({ path: '/home/device/data/watchone' })
                    } else {
                      // 在线或者离线---前往设备管理页
                      Routers.push({ path: '/home/device/set/deviceManage' })
                    }
                  }
                }
              })
              var component = new MyComponent().$mount()
              document.getElementById('deviceinfo').appendChild(component.$el)
            }
          }
        }
      }
    },
    // 根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别
    setCenterandZoom: function () {
      // console.log('设置中心点方法')
      if (this.point.length > 0) {
        let maxLon = this.point[0].lng
        let minLon = this.point[0].lng
        let maxLat = this.point[0].lat
        let minLat = this.point[0].lat
        // console.log(this.point[0])
        let res
        for (let i = 0; i < this.point.length; i++) {
          res = this.point[i]
          if (res.lng > maxLon) maxLon = res.lng
          if (res.lng < minLon) minLon = res.lng
          if (res.lat > maxLat) maxLat = res.lat
          if (res.lat < minLat) minLat = res.lat
        }
        let cenLon = (parseFloat(maxLon) + parseFloat(minLon)) / 2
        let cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2
        let zoom = this.getZoom(maxLon, minLon, maxLat, minLat)
        // console.log(cenLon)
        // console.log(cenLat)
        // console.log(zoom)
        this.map.centerAndZoom(new BMap.Point(cenLon, cenLat), zoom)
        // console.log('有中心点')
      } else {
        this.map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5)
        // console.log('无中心点')
      }
    },
    // 根据经纬极值计算缩放级别
    getZoom: function (maxLon, minLon, maxLat, minLat) {
      let zoom = ['50', '100', '200', '500', '1000', '2000', '5000', '10000', '20000', '25000', '50000', '100000', '200000', '500000', '1000000', '2000000']
      let pointA = new BMap.Point(maxLon, maxLat)
      let pointB = new BMap.Point(minLon, minLat)
      let distance = this.map.getDistance(pointA, pointB).toFixed(1)
      for (let i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
          return 18 - i + 3
        }
      }
      return 5
    },
    // push apikey 存储不同的APIKEY值 (去重)
    pushApikey: function (apikeyparam) {
      if (this.apikey.length === undefined || this.apikey.length === 0) {
        this.apikey.push(apikeyparam)
      } else if (this.apikey.length > 0) {
        for (let i = 0; i < this.apikey.length; i++) {
          if (apikeyparam === this.apikey[i]) {
            return
          }
        }
        this.apikey.push(apikeyparam)
      }
    },
    // 关闭设备信息面板
    closepanel: function () {
      $('#devicepanel').hide()
    },
    // 将经纬度相同的点存放在一个组里
    countmarkers: function () {
      this.overlapgroup = []
      // console.log('将经纬度相同的点存放在一个组里')
      this.pointsimplify = [] // 全部的设备坐标点
      let warnArr = [] // 含报警的设备坐标点
      let deviceArr = [] // 全部的设备信息
      let deviceArrWarn = [] // 含报警的设备信息
      for (let i = 0; i < this.device.length; i++) {
        // console.log(this.device[i])
        // console.log(this.point[i])
        if (this.device[i].online === 0) {
          // 离线
          this.pointsimplify.push(this.point[i])
          deviceArr.push(this.device[i])
        } else if (this.device[i].online === 1) {
          // 在线
          this.pointsimplify.unshift(this.point[i])
          deviceArr.unshift(this.device[i])
        } else if (this.device[i].online === 2) {
          // 报警
          warnArr.push(this.point[i])
          deviceArrWarn.push(this.device[i])
        }
      }
      deviceArr = deviceArr.concat(deviceArrWarn)
      // 按照在线-离线-报警的排序，重新为设备坐标点数组赋值
      this.pointsimplify = this.pointsimplify.concat(warnArr)
      // 按照在线-离线-报警的排序，重新为设备信息数组赋值
      this.device = deviceArr
      // console.log(this.pointsimplify)
      // console.log(this.pointsimplify.length)
      // console.log(this.device)
      // console.log(this.device.length)
      for (let i = 0; i < this.pointsimplify.length; i++) {
        // for (let i = 0; i < 1; i++) {
        let group = []
        if (this.pointsimplify[i] === undefined) {
          continue
        }
        for (let j = i; j < this.pointsimplify.length; j++) {
          if (this.pointsimplify[j] === undefined) {
            continue
          }
          if (this.pointsimplify[i].lng === this.pointsimplify[j].lng && this.pointsimplify[i].lat === this.pointsimplify[j].lat) {
            group.push(this.device[j])
            // 防止i与j相等时，删除数组中第j个数据时也删除了第i个数据，导致继续进行循环时找不到第i个数据出错
            if (i !== j) {
              delete this.pointsimplify[j]
            }
          }
        }
        this.overlapgroup.push(group)
      }

      // console.log(this.overlapgroup)
      // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
      this.addmarkerandInfo()
      // 开启定时器，定时查询设备信息，并添加标注点和信息窗口
      // this.queryLoop()
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`),
        duration: 1000
      })
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
/* 布局 */
.layout_container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background: url(/static/bgimg1.jpg) no-repeat; */
  background: #0D111B;
}
/* 顶部区域 */
.layout_header{
  position: fixed;
  width: 100%;
  // height: 100px;
  height: 10vh;
  top: 0;
  left: 0;
  z-index: 3;
  /* background: url(/static/nav_top.png) no-repeat center center;
  background-size: 100% 100%; */
  .left_welcome, .right_time {
    position: absolute;
    width: 24%;
    // top: 35px;
    top: 3vh;
    text-align: center;
    color: #74F4FF;
    font-size: 16px;
    // line-height: 28px;
    line-height: 3vh;
    letter-spacing: 2px;
  }
  .left_welcome {
    left: 0;
    .logoutBtn{
      background: #00A8EC;
      border-color: #00A8EC;
      margin-left: 25px;
      width: 60px;
    }
  }
  .center_title {
    width: 100%;
    text-align: center;
    .c_t_top {
      display: flex;
      justify-content: center;
      align-items: center;
      // height: 55px;
      height: 5vh;
      text-align: center;
      .c_t_top_img {
        img {
          height: 24px;
        }
      }
      .c_t_top_text {
        p {
          font-size: 24px;
          color:#64F2FF;
          // line-height: 1;
          line-height: 5vh;
          cursor: pointer;
          margin: 0px;
          // margin-top: 10px;
          margin-left: 15px;
        }
      }
    }
    .c_t_botm {
      // height: 35px;
      height: 4vh;
    }
    .c_t_botm .c_t_botm_img{
      width: 100%;
      height: 100%;
    }
  }
  .right_time {
    right: 0;
  }
}

/* 主要区域 */
.layout_main {
  position: relative;
  // padding-top: 100px;
  padding-top: 10vh;
  width: 100%;
  height: 100%;
  .layout_left, .layout_right {
    position: absolute;
    top: 0;
    width: 24%;
    height: 100%;
    // padding-top: 84px;
    padding-top: 8vh;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 13px;
    z-index: 2;
    .itemBox_box {
      width: 100%;
      height: 100%;
    }
  }
  /* 左边区域 */
  .layout_left {
    left: 0;
  }
  .itemBox{
    width: 100%;
    height: 33.33%;
    position: relative;
    box-sizing: border-box;
    padding-top: 20px;
    .item_title{
      position: absolute;
      top: 20px;
      left: 0;
      width: 100%;
      // height: 50px;
      height: 6vh;
      background: url(/static/bg_global_item2.png) no-repeat left center;
      // background-size: auto 50px;
      background-size: auto 100%;
    }
    .title_textc{
      padding-left: 6vh;
      width: 86%;
      font-size: 14px;
      color: #00E9FE;
      // line-height: 25px;
      line-height: 3vh;
      text-align: left;
      font-weight: 200;
    }
    .item_content{
      height: 100%;
      // padding-top: 25px;
      padding-top: 3vh;
    }
    .echartsDom{
      height: 100%;
      background: url(/static/bg_global_item1.png) no-repeat center center;
      background-size: 100% 100%;
    }
    .textDom{
      height: 100%;
      background: url(/static/bg_global_item1.png) no-repeat center center;
      background-size: 100% 100%;
      font-size: 20px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: normal;
    }
  }
  
  /* 右边区域 */
  .layout_right {
    right: 0;
  }
  /* 中间区域 */
  .layout_center{
    width: 100%;
    padding: 0 24%;
    padding-bottom: 15px;
    height: 100%;
    position: relative;
    // 地图部分
    .mapbox {
      width: 100%;
      height: 66.666%;
      position: relative;
      .mapbox_main {
        height: 100%;
        padding-bottom: 15px;
        position: relative;
        .chose_mapstyle{
          position: absolute;
          width: 140px;
          bottom: 25px;
          left: 10px;
        }
      }
      /* 地图相关 */
      #allmap {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        font-family: '微软雅黑';
        /* margin:0; */
        /* background: white; */
      }
      /* 去除百度标识 */
      .anchorBL{
        display: none;
      }
      .map {
        padding: 0;
        margin: 0;
      }
      .h3 {
        padding: 0;
        margin: 0;
      }
      #devicepanel {
        position: absolute;
        font-size: 13px;
        top: 10px;
        right: 10px;
        color: white;
        width: 440px;
        height: 330px;
        opacity: 0.75;
        background: black;
        border-radius: 5px;
        overflow: auto;
      }
      #deviceinfo {
        float: left;
        margin: 10px;
      }
      #paneltitle {
        font-size: 18px;
      }
      #titleandclose {
        margin-top: 10px;
        margin-bottom: 10px
      }
      .class2 {
        margin-left: 5px;
        margin-top:10px;
      }
    }
    .mapbox #allmap {
      border-radius: 10px;
    }
    // 下方图表部分
    .botm_echarts {
      height: 33.33%;
      .itemBox_box {
        height: 100%;
        .itemBox {
          float: left;
          width: 46%;
          margin: 0 2%;
          height: 100%;
        }
      }
    }
  }
}
@media screen and (max-height:700px){
  /* 顶部区域 */
  .layout_header{
    height: 60px;
    .left_welcome, .right_time {
      top: 10px;
      font-size: 14px;
      line-height: 36px;
    }
    .center_title {
      .c_t_top {
        height: 30px;
      }
      .c_t_top p{
        font-size: 18px;
        line-height: 30px;
      }
      .c_t_botm {
        height: 30px;
      }
    }
  }

  /* 主要区域 */
  .layout_main {
    padding-top: 60px;
    .layout_left, .layout_right {
      padding-top: 55px;
    }
    /* 中间区域 */
    .layout_center{
      .mapbox {
        .mapbox_main {
          padding-top: 14px;
        }
      }
    }
  }
}
@media screen and (max-height:580px){
  /* 主要区域 */
  .layout_main {
    .itemBox{
      .item_title{
        height: 32px;
      }
      .title_textc{
        padding-left: 35px;
        font-size: 12px;
        line-height: 16px;
      }
      .item_content{
        padding-top: 16px;
      }
    }
    /* 中间区域 */
    .layout_center{
      .mapbox {
        padding-bottom: 126px;
      }
      .textbox{
        height: 126px;
        .textbox_main {
          .textbox_item{
            font-size: 12px;
            padding-top: 7px;
            padding-bottom: 7px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.mapbox #deviceinfo .wgdzxx {
  float: left;
  height: 246px;
  overflow-y: auto;
}
.mapbox #deviceinfo .class2 {
  float: left;
}
.mapbox #deviceinfo .class00 {
  float: left;
}
.mapbox #deviceinfo .class01 {
  width: 50px;
}
.mapbox #deviceinfo .class02 {
  width: 85px;
}
.mapbox #deviceinfo .class03 {
  width: 85px;
}
.mapbox #deviceinfo .class04 {
  width: 60px;
}
.mapbox #deviceinfo .class05 {
  width: 85px;
}
.mapbox .BMap_scaleCtrl div.BMap_scaleTxt {
  color: #fff!important;
}
.mapbox #allmap .anchorBL {
  display: none;
}
/* 报警处理容器 */
.alarmContainer {
  .alarmListBox_btnkz {
    position: fixed;
    top: 5px;
    right: 5px;
    z-index: 66;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .alarmListBox {
    position: fixed;
    top: 40px;
    right: 30px;
    width: 480px;
    text-align: left;
    // background: #f5f5f5;
    z-index: 66;
    .gatewayItem_alarm {
      padding-right: 20px;
      .gateway_name {
        float: left;
        width: 100%;
        line-height: 40px;
      }
      .gateway_alarm {
        float: left;
        width: 100%;
        padding-left: 20px;
        border-bottom: 1px solid #EBEEF5;
        .item_alarm {
          float: left;
          width: 100%;
          margin: 5px 0;
          .alarm_deviceName, .alarm_alarmName, .alarm_alarmContent {
            float: left;
            font-size: 14px;
            line-height: 30px;
            overflow: hidden;
          }
          .alarm_deviceName {
            width: 100px;
          }
          .alarm_alarmName {
            width: 100px;
          }
          .alarm_alarmContent {
            width: 110px;
          }
          .alarm_ck {
            float: left;
          }
        }
      }
    }
  }
  .alarmTcBox {
    .mainContent {
      .item_alarmTcBox {
        float: left;
        width: 100%;
        color: #fff;
        font-size: 16px;
        line-height: 40px;
        margin-bottom: 20px;
        .left {
          float: left;
          width: 146px;
          text-align: right;
        }
        .right {
          float: left;
          width: 260px;
          text-align: left;
          padding-left: 10px;
          background-color: #136672;
          box-sizing: border-box;
          border-radius: 5px;
          // background: url(/static/bg_global_item2.png) no-repeat left center;
          // background-size: auto 100%;
        }
      }
    }
    .footerBtn {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
