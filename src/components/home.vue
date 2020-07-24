<!--
 * @Author: your name
 * @Date: 2019-07-16 08:35:25
 * @LastEditTime: 2019-10-30 17:28:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mycode\04_guiwuCode\03-雷泰\leitai4.0\src\components\home.vue
 -->
<template>
  <div class="home">
    <el-container class="homeMainBox">
      <!-- 侧边栏 -->
      <el-aside id="aside" width="260px">
        <!-- 用户部分 -->
        <div class="asideTop_user">
          <div class="userheadImg">
            <img src="/static/user.png" v-on:click="touserBt">
          </div>
          <div class="userNickname">
            <div class="userNickname_text">用户名：<span>{{userName}}</span></div>
            <div class="userNickname_text" v-show="observeUserShow">观察对象：<span>{{observeUser}}</span></div>
          </div>
          <div class="operation_btn">
            <el-button class="signout_btn" type="primary" size="mini" @click="tologinBt">退出</el-button>
            <el-button class="backIndex_btn" type="primary" size="mini" @click="tomapBt">返回首页</el-button>
          </div>
        </div>

        <!-- 快捷键操作部分 -->
        <div class="asidecenter_operation">
          <div class="item_aso">
            <div class="box_item_aso">
              <img src="/static/asideccz_icon_1.png" alt="">
              <el-button class="btn_item_aso" type="text" @click="tosetBt" :disabled="!this.groupSetShow">分组管理</el-button>
            </div>
          </div>
          <div class="item_aso">
            <div class="box_item_aso">
              <img src="/static/asideccz_icon_2.png" alt="">
              <el-button class="btn_item_aso" type="text" @click="adddeviceformBt" :disabled="!this.devAddShow">添加网关</el-button>
            </div>
          </div>
          <div class="item_aso">
            <div class="box_item_aso">
              <img src="/static/asideccz_icon_3.png" alt="">
              <el-button class="btn_item_aso" type="text" @click="toUserManBt" :disabled="!this.userManagementShow">用户管理</el-button>
              </div>
          </div>
          <div class="item_aso">
            <div class="box_item_aso">
              <img src="/static/asideccz_icon_4.png" alt="">
              <el-button class="btn_item_aso" type="text" @click="toIndexSet">首页配置</el-button>
              </div>
          </div>
        </div>
        
        <!-- 设备组部分 -->
        <div class="deviceGroup_box">
          <!-- 搜索 -->
          <el-input class="ip_gjz_search" placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" v-model="filterText"></el-input>
          <!-- 具体设备组 -->
          <el-tree
          class="filter_tree"
          :style="{ height: treeMaxHeight + 'px' }"
          :data="deviceList"
          accordion
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="devListTree"
          :expand-on-click-node="false"
          :render-content="renderContent"
          :highlight-current="true"
          @node-click="todeviceBt">
          </el-tree>
        </div>
      </el-aside>

      <!-- 主窗体部分 -->
      <el-container id="container">
        <router-view class="main"></router-view>
      </el-container>

    </el-container>

    <!-- 添加设备(网关) 弹出对话框 -->
    <el-dialog class="addGateway" :title="devicename" :visible.sync="addDevDialogFormVisible" width="700px" top="50px"  center>
      <div style="padding:0 35px 15px 39px " v-if='!isedit'>
        <el-button @click="active(false)" size="mini" :type="activeName?'':'primary'">普通网关</el-button>
        <el-button  @click="active(true)" size="mini"  :type="activeName?'primary':''" >NB网关</el-button>
      </div>
      <el-form :model="form">
         <div class="item_addGateway" v-if="activeName">
          <el-form-item class="addGateway_formItem" label="设备名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" placeholder="输入设备名称"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="设备IMEI" :label-width="formLabelWidth">
            <el-input v-model="form.imei" :disabled="isedit" placeholder="输入设备IMEI"></el-input>
          </el-form-item>
        </div>
       
        <div class="item_addGateway" v-if="!activeName">
          <el-form-item class="addGateway_formItem" label="网关SN" :label-width="formLabelWidth">
            <el-input v-model="form.sn" placeholder="输入网关SN"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="网关密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" placeholder="输入网关密码"></el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" label="网关名称" :label-width="formLabelWidth" v-if="!activeName">
            <el-input v-model="form.name" placeholder="输入网关名称"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="网关组选择" :label-width="formLabelWidth">
            <el-select v-model="tableDataGroupSelected" placeholder="网关组">
              <el-option v-for="item in tableDataGroup" :key="item.groupUid" :label="item.name" :value="item.groupUid"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" label="经度" :label-width="formLabelWidth">
            <el-input v-model="form.location.lon" placeholder="经度"></el-input>
            <!--  :disabled="true" -->
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="纬度" :label-width="formLabelWidth">
            <el-input v-model="form.location.lat" placeholder="纬度"></el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" label="省份" :label-width="formLabelWidth">
            <el-input v-model="form.province" placeholder="省份"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="城市" :label-width="formLabelWidth">
            <el-input v-model="form.city" placeholder="城市"></el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" style="textAlign:center;">
            <!-- <span style="font-size:12px;color:red;">（选取点后，经度、纬度、省份、城市会被自动添上）</span> -->
            <el-button-group>
              <!-- 1、地图上选点(chose) 2、关键词搜索(search) -->
              <el-button size="small" :type="pointChoseType=='chose'?'primary':'info'" @click="mapselectpoint">地图上选点</el-button>
              <el-button size="small" :type="pointChoseType=='search'?'primary':'info'" @click="mapkeyword">关键词搜索</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item class="addGateway_formItem" v-show="pointChoseType == 'search'" label="地点" :label-width="formLabelWidth">
            <el-input v-model="form.locationKeyWord" class="ip_search_position" placeholder="请输入要搜索的地点">
              <el-button slot="append" icon="el-icon-search" @click="mapKeyWord"></el-button>
            </el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <!-- 地图 -->
          <div id="addwgmap"></div>
        </div>
         <!-- 监控点配置 -->
          <div class="streams_box" v-if="activeName">
            <div class="streams_box_title">监控点配置</div>
            <div class="streams_content" v-for="(item, index) in streamNameList" :key="item.streamId">
              <!-- v-model="streamWatchArr"  @change="checkboxChose" -->
              <div class="streams_content_item" >
                
                <div>
                  <div class="streams_item_left">监控点{{index+1}}</div>
                  <el-input class="streams_item_center" v-model="item.name" :placeholder="item.name"></el-input>
                  <!-- <el-checkbox class="streams_item_right" v-model="streamWatchArr[index]" :label="index" :true-label='1' :false-label='0'></el-checkbox> -->
                  <el-checkbox class="streams_item_right" v-model="item.auth" :true-label='1' :false-label='0'></el-checkbox>
                </div>
                <div v-if="index > 9 && index < 12" class="subText">
                  倍率：
                  <el-input  v-model="item.coefficient" oninput="value=value.replace(/[^\d.]/g,'')"  size="mini" class="beilv"></el-input>
                </div>
                <div v-else class="subText"></div>
              </div>
            </div>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="btn_cancel_dialog" @click="addDevDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deviceaddBt">确 定</el-button>
      </div>
    </el-dialog>
    
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

    <!-- 浏览器缩放，若窗口宽度过小，首先隐藏左侧设备列表，通过此div实现控制再显示和再隐藏控制 -->
    <div id="listbutton" @click="asideVisibleBt" v-show="listbuttonVisible">
      <img src="/static/listbutton.png" style="width:25px;height:25px;margin-top:6px;">
    </div>
  </div>
</template>

<script>
import BMap from 'BMap'
// import BMAP_STATUS_SUCCESS from 'BMAP_STATUS_SUCCESS'
import Routers from '../router'
import { back, onenet } from 'api'
import { sessionGetStore, sessionSetStore, sessionClearStore } from '@/components/config/Utils'
// 引入WebSocket需要的插件
import Stomp from 'stompjs'

export default {
  data () {
    return {
      isedit: false,
      streamNameList: [], 
      devicename: '添加网关',
      activeName: false,
      param: {
        'Authorization': '',
        'userId': 1000,
        'sn': '',
        'password': '',
        'name': '',
        'groupUid': '',
        'location': {'lat': 120.377841, 'lon': 30.3099, 'ele': ''},
        // 设备所在省份
        province: '',
        // 设备所在城市
        city: ''
      },
      observeUser: '',                                  // 所观察对象
      observeUserShow: false,                           // 所观察对象是否显示
      filterText: '',                                   // 设备过滤
      treeMaxHeight: '',                                  // 树形组件的高度
      addDevDialogFormVisible: false,                   // 添加设备对话框
      groupSetShow: true,                              // 是否显示分组管理按钮 auth: 0,1,2-true;3-false
      devAddShow: true,                             // 是否显示添加设备按钮 auth: 0,1,2-true;3-false
      userManagementShow: false,                               // 是否显示用户管理按钮 auth: 0,1,2-true;3-false
      xx: 20,
      yy: 67.5,
      formLabelWidth: '100px',
      deviceList: [
      //   { id: 1,
      //   label: 'Default',
      //   // online: '',
      //   // alarm: '',
      //   children: [{
      //     id: 9,
      //     label: '网关1',
      //     apiKey: '',
      //     sn: '',
      //     location: '',
      //     online: '在线',
      //     alarm: '',
      //     auth: ''
      //   }
      // }, {
      //   id: 2,
      //   label: '设备分组二',
      //   online: '',
      //   alarm: '',
      //   children: [{
      //     id: 5,
      //     label: '网关8',
      //     apiKey: '',
      //     sn: '',
      //     location: '',
      //     online: '离线',
      //     alarm: '报警',
      //     auth: ''
      //   }]
      // }
      ],
      // 树形组件设备显示
      defaultProps: {
        children: 'children',
        label: 'label',
        online: 'online'
      },
      timerOnline: 0,                  // 定时器，定时查询数据和在线状态
      timerWindowWidth: 0,             // 定时器，定时查询窗体宽度
      apiKeyGroup: [],                 // 存储所有不同网关设备的apikey
      // 存储设备表单信息
      form: {
        index: 0,
        sn: '',
        imei: '',
        password: '',
        name: '',
        groupUid: '',
        // 设备坐标
        location: {
          'lat': '',
          'lon': '',
          'ele': ''
        },
        // 设备所在省份
        province: '',
        // 设备所在城市
        city: '',
        // 地点关键词
        locationKeyWord: ''
      },
      tableDataGroupSelected: '',                           // 选中分组ID
      // 存储分组信息
      tableDataGroup: [{                                    // 一个字打错复制粘贴都不可以，...至今找不到哪里打错了
        id: '选项1',                                        // 为了设置默认显示而存在的
        name: 'Default',
        groupUid: ''
      }, {
        id: '选项2',
        name: '设备分组二',
        groupUid: '100258795781987100258795781'
      }],
      Authorization: 4,
      listbuttonVisible: true, // 控制左侧设备列表显示或隐藏
      windowWidth: 0,       // 窗体宽度
      aside: '',            // 左侧设备列表对象
      listbtn: '',          // 控制左侧列表显示或隐藏的按钮对象
      marker: 0,            // 标识，当窗体宽度从大于设定宽度缩小到小于设定宽度，默认隐藏左侧列表，按钮操作后不再默认隐藏，根据按钮操作进行变化
      map: null,             // 地图实例
      // 当前选择主题样式
      currentMayStyle: 'midnight',
      pointChoseType: 'chose', // 哪种选点方式---1、地图上选点(chose) 2、关键词搜索(search)
      keyWordObj: null,         // 关键词检索变量
      // 即时推送
      stompClient: null,
      // 所有设备（终端设备，非网关）
      allDeviceInfo: [],
      // 报警内容容器显示状态
      alarmListBoxShow: false,
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
      dialogVisibleAlarm: false,
      parentList: []
    }
  },
  computed: {
    // 左上角用户名渲染前computed 
    userName () {                                       // computed的proterty不能与data定义的变量重名
      var userName = sessionGetStore('nameMe')          // 前期测试通过浏览器缓存数据，后期只需浏览器存userId调用用户信息API
      this.$store.commit('setUserName', userName)
      return this.$store.state.userName
    },
    // 设备列表刷新-监控1（groupRefresh是单独命名的一个变量，与dom无关）
    groupRefresh () {
      return this.$store.state.deviceGroupRefresh
    },
    // 观察者对象名字显示---解决刷新页面，观察者名字消失的问题
    watcherNameShow () {
      let userId = sessionGetStore('userId')
      let userIdMe = sessionGetStore('userIdMe')
      return userId === userIdMe
    }
  },
  watch: {
    // 观察者对象名字显示
    watcherNameShow: {
      handler: function (value) {
        // console.log(value)
        if (value) {
          this.observeUserShow = false
        } else {
          this.observeUserShow = true
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    },
    // 设备过滤
    filterText (val) {
      this.$refs.devListTree.filter(val)
    },
    // 设备列表刷新-监控2 + 观察者对象名刷新
    groupRefresh: function (val) {
      // console.log('刷新111111')
      if (val) {
        // console.log('设备列表刷新refresh + observeUserRefresh')
        this.observeUser = sessionGetStore('name')
        this.param.userId = sessionGetStore('userId')
        // 分组管理/设备添加/用户管理 按钮显示判断
        if (sessionGetStore('userId') === sessionGetStore('userIdMe')) {
          // 若userId = userIdMe则代表回到自己，可以对自己的网关/节点进行任何操作
          this.groupSetShow = true
          this.devAddShow = true
          // 观察对象---隐藏
          this.observeUserShow = false
        } else {
          this.groupSetShow = false
          this.devAddShow = false
          // 观察对象---显示
          this.observeUserShow = true 
        }
        // 用户下设备信息获取
        this.backDevInfoGet()
        // 全局节点列表刷新标志位置false，已刷新
        this.$store.commit('setdeviceGroupRefresh', false)
      }
    },
    // 监听路由
    $route (to) {
      // console.log(to.path)
      if (to.path === '/home/map') {
        // console.log('刷新网关列表信息')
        // 获取用户下网关列表信息
        this.backDevInfoGet()
      }
    }
  },
  created () {
    this.observeUser = sessionGetStore('name')
    this.param.userId = sessionGetStore('userId')           // 避免刷新页面导致数据丢失，所以不用vuex而用localstore
    this.deviceList = sessionGetStore('deviceList')         // 存储设备list
    this.param.Authorization = sessionGetStore('Authorization') // 避免刷新页面导致数据丢失，所以不用vuex而用localstore
    let alarmBoxShow = JSON.parse(sessionGetStore('alarmBoxShow'))
    // console.log(alarmBoxShow)
    // 报警内容容器显示状态---更新
    this.alarmListBoxShow = alarmBoxShow
    // 获取用户的地图主题
    this.currentMayStyle = sessionGetStore('userMap')
    var userId = sessionGetStore('userId')
    // 无法获取到用户Id，数据异常，退回到登陆界面
    if (!userId) {
      this.notificationInfo('提示', '用户数据过期，拿不到userId,请重新登陆')
      // this.$emit('transferuser', 'login')
      Routers.push({ path: '/login' })
      return
    }
    // console.log(userId)
    this.param.userId = userId
    this.$store.commit('setUserId', userId)
    // 全局节点列表刷新标志位置false，已刷新
    // this.$store.commit('setdeviceGroupRefresh', false)
    // 分组管理/设备添加/用户管理 按钮显示判断
    if (sessionGetStore('authMe') === '3') {
      this.userManagementShow = false
      this.xx = 10
      this.yy = 45
    }
    if (sessionGetStore('authMe') === '0' || sessionGetStore('authMe') === '1' || sessionGetStore('authMe') === '2') {
      this.groupSetShow = true
      this.devAddShow = true
      this.userManagementShow = true
    }
    // 修改树形组件最大高度
    var jsHeight = 280 + 50
    if (document.documentElement.clientHeight > 730) {
      jsHeight = 390 + 50
    } else if (document.documentElement.clientHeight > 580) {
      jsHeight = 300 + 50
    } else if (document.documentElement.clientHeight > 450) {
      jsHeight = 280 + 50
    }
    // console.log(document.documentElement.clientHeight)
    // console.log(jsHeight)
    this.treeMaxHeight = document.documentElement.clientHeight - jsHeight
    // 获取账号下全部设备信息
    this.getAllDeviceInfo()
    // 查询全部设备当前报警
    this.getTriggerCurrentAllFunc()
    // 所有报警数据
    /*
    this.allAlarmInfo = [
      {
        nname: '网关1',
        warns: [
          {
            id: '1',
            dname: '设备1',
            content: 'leiji>20',
            value: 77,
            tname: '触发器1'
          },
          {
            id: '2',
            dname: '设备2',
            content: 'leiji>20',
            value: 77,
            tname: '触发器2'
          },
          {
            id: '2',
            dname: '设备2',
            content: 'leiji>20',
            value: 77,
            tname: '触发器2'
          },
          {
            id: '2',
            dname: '设备2',
            content: 'leiji>20',
            value: 77,
            tname: '触发器2'
          }
        ]
      },
      {
        nname: '网关2',
        warns: [
          {
            id: '3',
            dname: '设备3',
            content: 'leiji>20',
            value: 77,
            tname: '触发器1'
          },
          {
            id: '4',
            dname: '设备3',
            content: 'leiji>20',
            value: 77,
            tname: '触发器2'
          }
        ]
      },
      {
        nname: '网关3',
        warns: [
          {
            id: '3',
            dname: '设备3',
            content: 'leiji>20',
            value: 77,
            tname: '触发器1'
          },
          {
            id: '4',
            dname: '设备3',
            content: 'leiji>20',
            value: 77,
            tname: '触发器2'
          }
        ]
      },
      {
        nname: '网关4',
        warns: [
          {
            id: '3',
            dname: '设备3',
            content: 'leiji>20',
            value: 77,
            tname: '触发器1'
          },
          {
            id: '4',
            dname: '设备3',
            content: 'leiji>20',
            value: 77,
            tname: '触发器2'
          }
        ]
      }
    ]
    */
  },
  mounted () {
    this.$bus.$off('editnb').$on('editnb', target => {
      this.addDevDialogFormVisible = true
      this.backDevInfoGet()
      this.mapselectpoint()
      setTimeout(()=> {
        this.getnbdevice(target)
      },0)
      
      this.devicename = '修改网关'
      this.isedit = true
     
      this.activeName = true
    })
    // 获取用户下网关列表信息
    this.backDevInfoGet()
    // 开启定时器，定时查询onenet平台的监控点数据和在线离线信息；
    // * 定时查询浏览器窗口宽度，判断是否显示隐藏左侧设备的按钮
    // this.queryLoop()
    // 初始化获取aside，listbtn对象
    this.aside = document.getElementById('aside')
    this.listbtn = document.getElementById('listbutton') // 若'listbutton' div写在对话框内，则取不到该dom，设计nextTick
    // WebSocket相关
    if (this.stompClient == null) {
      // stomp接收消息方法
      this.stompLink()
    }
  },
  beforeDestroy: function () {
    // WebSocket相关
    this.stompClient.disconnect(function () {
      // console.log('断开')
    })
  },
  methods: {
    getnbdevice (id) {
      let obj = {mac: id}
      back.nbdevice(obj).then(res => {
        console.log(1222222222)
        if (res.errno === 0) {
          this.form = res.data
          this.streamNameList  = res.data.streamNameList
          this.tableDataGroupSelected = res.data.groupUid
        } else {
          this.notificationInfo('错误提示', res.error)
        }
      })
    },
    active (istrue) {
      this.activeName = istrue
    },
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
    // 地图初始化
    mapinit () {
      // 创建地图实例
      this.map = new BMap.Map('addwgmap')
      // 设置中心点和缩放比例
      // this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
      this.map.centerAndZoom('浙江', 11)

      // var geolocation = new BMap.Geolocation() // 返回用户当前的位置
      // // 浏览器定位
      // geolocation.getCurrentPosition(function (r) {
      //   if (this.getStatus() === BMAP_STATUS_SUCCESS) {
      //     var mk = new BMap.Marker(r.point)
      //     this.map.addOverlay(mk)
      //     this.map.panTo(r.point)
      //     console.log('您的位置：' + r.point.lng + ',' + r.point.lat)
      //   } else {
      //     console.log('failed' + this.getStatus())
      //   }        
      // }, {enableHighAccuracy: true})
      // 修改地图主题样式
      this.map.setMapStyle({
        style: this.currentMayStyle
      })
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
    },
    // 选择-地图上选点
    mapselectpoint () {
      // 修改选点方式
      this.pointChoseType = 'chose' // 1、地图上选点(chose) 2、关键词搜索(search)
      // 清除地图
      this.map = null
      // 清除 地点关键词
      this.form.locationKeyWord = '' // 地点关键词
      // 设置地图
      this.$nextTick(function () {
        // 百度地图是必须让它在页面加载完成后显示（生命周期mounted），但是由于element的对话框（el-dialog）是基于v-if这个功能。所以，应该在dom加载完后再初始化地图
        // 地图初始化
        this.mapinit()
        // 添加点击地图监听事件---点击地图后添加标注点
        this.map.addEventListener('click', function (e) {
          // console.log(e)
          // 清除标注点
          this.map.clearOverlays()
          // 添加标注点
          var point = new BMap.Point(e.point.lng, e.point.lat) // 创建点
          var myIconOn = new BMap.Icon('/static/dw_icon_on.png', new BMap.Size(32, 32))
          var marker = new BMap.Marker(point, {icon: myIconOn})  // 创建标注
          this.map.addOverlay(marker) // 将标注添加到地图中
          // 修改form表单内容
          // 设备坐标
          this.form.location = {
            'lat': e.point.lat.toFixed(6),
            'lon': e.point.lng.toFixed(6)
          }
          var geoc = new BMap.Geocoder() // 用于获取用户的地址解析
          // 地址解析
          geoc.getLocation(e.point, function (rs) {
            var addComp = rs.addressComponents
            // 设备所在省份
            this.form.province = addComp.province
            // 设备所在城市
            this.form.city = addComp.city
          }.bind(this))
        }.bind(this))
      }.bind(this))
    },
    // 选择-关键词搜索
    mapkeyword () {
      // 修改选点方式
      this.pointChoseType = 'search' // 1、地图上选点(chose) 2、关键词搜索(search)
      // 清除地图
      this.map = null
      // 清除 地点关键词
      this.form.locationKeyWord = '' // 地点关键词
      // 设置地图
      this.$nextTick(function () {
        // 百度地图是必须让它在页面加载完成后显示（生命周期mounted），但是由于element的对话框（el-dialog）是基于v-if这个功能。所以，应该在dom加载完后再初始化地图
        // 地图初始化
        this.mapinit()
        var _this = this
        // 关键词检索
        var gjcOptions = {
          // 结果呈现设置
          renderOptions: {map: this.map},
          // // 标注添加完成后的回调函数
          // onMarkersSet: function () {
          //   console.log('onMarkersSet')
          // },
          // 标注气泡内容创建后的回调函数---点击不同气泡会触发
          onInfoHtmlSet: function (res) {
            // console.log(res)
            // 修改form表单内容
            // 设备坐标
            _this.form.location = {
              'lat': res.point.lat.toFixed(6),
              'lon': res.point.lng.toFixed(6)
            }
            // 设备所在省份
            _this.form.province = res.province
            // 设备所在城市
            _this.form.city = res.city
          }
          // // 结果列表添加完成后的回调函数
          // onResultsHtmlSet: function () {
          //   console.log('onResultsHtmlSet')
          // },
          // // 检索完成后的回调函数
          // onSearchComplete: function (results) {
          //   console.log(results)
          // }
        }
        this.keyWordObj = new BMap.LocalSearch(this.map, gjcOptions) // 用于位置检索、周边检索和范围检索。
        // this.keyWordObj.search("景点")
      }.bind(this))
    },
    // 点击地点的搜索---关键词检索
    mapKeyWord () {
      this.keyWordObj.search(this.form.locationKeyWord)
    },
    // el-tree重新渲染，加入每行的在线离线数据显示
    renderContent (h, { node, data, store }) {
      // console.log(node)
      return (
        <span class={node.data.sn} style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button style="font-size: 14px; color: #ff0000;" type="text" >{node.data.alarm}</el-button>
            <el-button style="font-size: 14px;" type="text">{node.data.online !== undefined ? (node.data.online === 1 ? '在线' : '离线') : ''}</el-button>
          </span>
        </span>
      )
    },
    // el-tree设备树过滤
    filterNode (value, data) {
      if (!value) return true
      if (data.label === undefined) return false
      return data.label.indexOf(value) !== -1
    },
   
    getParent (node) {
      if (node.level == 1) {
        sessionSetStore('deviceSNNow', node.data.id)
        sessionSetStore('groupid', node.data.id)
        sessionSetStore('groupName', node.data.label)
        this.$store.commit('setDeviceSNNow', node.data.id)
        return
      }
      // 判断当前节点是否有父节点，并且父节点上的data不能是数组
      if (node.parent && !Array.isArray(node.parent.data)) {
        // 将父节点上data的menuid存储在 `parentlist` 里
        if (node.parent.data.apiKey && node.parent.data.sn && node.parent.data.id && node.parent.data.label) {
          this.parentList.push({apiKey: node.parent.data.apiKey, id: node.parent.data.id, sn: node.parent.data.sn, label:node.parent.data.label})
        }
        // 递归调用 父节点上有父节点
        this.getParent(node.parent)
        // 当父节点上data是数组时e799bee5baa6e79fa5e98193e58685e5aeb931333431373234点击对象为当前tree最高目录 并且parentList必须是0
      } 
    },
    // 加载设备监控页面(点击网关)
    todeviceBt (data, node, obj) {
      // console.log('点击分组')
      this.parentList = []
      this.getParent(node)
      if (node.level !== 1) { // 点击子节点网关，若没有children则跳转到blankToDevice，以此来阻止点击小组的跳转
        this.$nextTick(() => {           // {}外的程序先执行
          // console.log('点击分组下网关')
          let treeBox = document.getElementsByClassName('el-tree-node')
          for (let index = 0; index < treeBox.length; index++) {
            treeBox[index].style.backgroundColor = ''
          }
          let treeSelBox = document.getElementsByClassName('el-tree-node is-current')
          treeSelBox[0].style.backgroundColor = '#D9D9D9' // 选择之后的颜色，客户端交互
        })
        if (data.type === 3 && node.level === 3) {
          // 点击NB类型网关下的设备
          sessionSetStore('isnb', true)
          sessionSetStore('nbmac', data.mac)
          sessionSetStore('onenb',true)
          sessionSetStore('gatewayName', data.label1)
          this.$bus.$emit('isnb', true)
          // console.log(sessionGetStore('onenb'))
          // console.log(sessionGetStore('nbmac'))
          Routers.push({ path: '/home/blankToDevice1' })          
          // Routers.push({ path: `/home/device/data/deviceNb` , query: { id: data.mac }})
        } else if (data.type === 0 && node.level === 2) {
          // 点击NB类型网关
          sessionSetStore('isnb', true)
          sessionSetStore('onenb',false)
          sessionSetStore('gatewayName', data.label1)
          sessionSetStore('groupid', node.parent.data.id)
          this.$bus.$emit('isnb', true)
          Routers.push({ path: '/home/blankToDevice1' })          
          // console.log(sessionGetStore('onenb'))
          // console.log(sessionGetStore('groupid'))
          // Routers.push({ path: `/home/device/data/deviceNb` , query: { id: node.parent.data.id }})
        } else {
          sessionSetStore('isnb', false)
          // debugger
          if (node.level === 3) {
            if (data.type === 0) {
              this.$store.commit('setDeviceSNNow', data.mac)
              sessionSetStore('deviceSNNow',  data.mac)
            } else {
              this.$store.commit('setDeviceSNNow', node.parent.data.sn)
              sessionSetStore('deviceSNNow',  node.parent.data.sn)
            }
            this.$store.commit('setDeviceApiKeyNow', this.parentList[0].apiKey)
            this.$store.commit('setDeviceIdNow', this.parentList[0].id)
            sessionSetStore('onenb',true)
            sessionSetStore('gatewayName', data.label1)
            sessionSetStore('apikeyNow', this.parentList[0].apiKey)
            sessionSetStore('deviceIdNow', this.parentList[0].id)
          } else if (node.level === 4){
            this.$store.commit('setDeviceSNNow', node.parent.data.mac)
            this.$store.commit('setDeviceApiKeyNow', this.parentList[0].apiKey)
            this.$store.commit('setDeviceIdNow', this.parentList[0].id)
            sessionSetStore('onenb',true)
            sessionSetStore('deviceSNNow', node.parent.data.mac)
            sessionSetStore('gatewayName', data.label1)
            sessionSetStore('apikeyNow', this.parentList[0].apiKey)
            sessionSetStore('deviceIdNow', this.parentList[0].id)
          } else {
            this.$store.commit('setDeviceSNNow', data.sn)
            this.$store.commit('setDeviceApiKeyNow', data.apiKey)
            this.$store.commit('setDeviceIdNow', data.id)
            sessionSetStore('onenb',false)
            sessionSetStore('deviceSNNow', data.sn)
            sessionSetStore('gatewayName', data.label1)
            sessionSetStore('apikeyNow', data.apiKey)
            sessionSetStore('deviceIdNow', data.id)
          }
          Routers.push({ path: '/home/blankToDevice' })
        }
        // Routers.push({ path: '/home/blankToDevice' })
        // console.log('网关sn ：' + data.sn)
        // console.log(this.$store.state.deviceApiKeyNow)
       
        // back.relatioMonitorPoint(data.sn).then(function (response) {
        //   debugger
        // })
        // 相当于加了一个跳转页面的限制条件，在if下才会跳转，否则则会点击小组名就会触发跳转，导致el-tree自带事件被影响，不能够展开
      }
    },
    /*
    ****************用户操作触发方法*****************
    */
    // 返回登录页面
    tologinBt: function () {
      // console.log('退出')
      // 清除浏览器本地存储
      sessionClearStore()
      // 这里跳转页面的方法此组件的父组件App.vue中，通过触发自定义函数transferuser，将参数('login'，要跳转的页面)传给App.vue
      this.$emit('transferuser', 'login')
    },
    // 添加设备初始化（打开对话框）
    adddeviceformBt () {
      if (!this.devAddShow) {
        // this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      // console.log('添加设备')
      // console.log(this.tableDataGroup)
      this.isedit = false
      this.form.sn = ''
      this.form.password = ''
      this.form.name = ''
      // 设备坐标
      this.form.location = {
        'lat': '',
        'lon': '',
        'ele': ''
      }
      this.streamNameList =  [
        {name: '远控1', auth: 0, streamId: 1, coefficient: 1},
        {name: '远控2', auth: 0, streamId: 2, coefficient: 1},
        {name: '远控3', auth: 0, streamId: 3, coefficient: 1},
        {name: '远控4', auth: 0, streamId: 4, coefficient: 1},
        {name: '电平跳变1', auth: 0, streamId: 5, coefficient: 1},
        {name: '电平跳变2', auth: 0, streamId: 6, coefficient: 1},
        {name: '电平跳变3', auth: 0, streamId: 7, coefficient: 1},
        {name: '电平跳变4', auth: 0, streamId: 8, coefficient: 1},
        {name: '电平跳变5', auth: 0, streamId: 9, coefficient: 1},
        {name: '脉冲次数', auth: 0, streamId: 10, coefficient: 1},
        {name: '电压', auth: 0, streamId: 11, coefficient: 1},
        {name: '电流', auth: 0, streamId: 12, coefficient: 1}
      ]
      this.devicename = '添加网关'
     
      this.activeName = false
      this.form.province = '' // 设备所在省份
      this.form.city = '' // 设备所在城市
      this.form.locationKeyWord = '' // 地点关键词
      this.form.pointChoseType = 'chose' // 哪种选点方式
      this.form.keyWordObj = null // 关键词检索变量
      if (this.tableDataGroup.length === 0) {
        this.notificationInfo('错误提示', '请先添加分组')
      } else {
        // console.log(this.tableDataGroup)
        this.tableDataGroupSelected = this.tableDataGroup[0].groupUid // 默认选择分组为分组ID第一个
        this.addDevDialogFormVisible = true
        // 地图初始化---默认 地图上选点(chose)
        this.mapselectpoint()
      }
      // console.log(this.param)
    },
    // 加载分组设置界面
    tosetBt () {
      if (!this.groupSetShow) {
        // this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      Routers.push({ path: '/home/set' })
    },
    // 加载用户管理界面
    toUserManBt () {
      if (!this.userManagementShow) {
        // this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      Routers.push({ path: '/home/userManaget' })
    },
    // 加载首页配置界面
    toIndexSet () {
      Routers.push({ path: '/home/indexSet' })
    },
    // 加载用户设置界面
    touserBt: function () {
      if (sessionGetStore('userId') !== sessionGetStore('userIdMe')) {
        // 当前用户id !== 登录者用户id
        return
      }
      Routers.push({ path: '/home/user' })
    },
    // 跳转到全局示意模式页面
    tomapBt () {
      // // 加载地图组件
      // Routers.push({ path: '/home/map' })
      // 跳转到全局示意模式页面
      Routers.push({ path: '/globalPage' })
    },
    // 添加设备(网关)对话框确认按键
    deviceaddBt () {
      // if (this.checkDevName(this.param.name)) {
      //   this.notificationInfo('错误提示', '设备名称不能重复')
      //   return
      // }
      console.log(this.form)
  
      let flag = 0
      for (let i = 0; i < this.streamNameList.length; i++) {
        this.streamNameList[i].coefficient = Number(this.streamNameList[i].coefficient)
        if (this.streamNameList[i].coefficient === '' || this.streamNameList[i].coefficient === 0 || this.streamNameList[i].coefficient < 0) {
          flag = 1
        } 
      }
      if (flag) {
        this.notificationInfo('错误提示', '倍率不能为空或者小于0')
        return
      }
      if (this.activeName) {
        if (this.form.name === '' || this.form.imei === '') {
          this.notificationInfo('错误提示', '参数不能为空')
          return
        }
        this.param.streamNameList = this.streamNameList
        this.param.imei = this.form.imei
      } else {
        if (this.form.name === '' || this.form.sn === '' || this.form.password === '') {
          this.notificationInfo('错误提示', '参数不能为空')
          return
        }
        this.param.password = this.form.password
        this.param.sn = this.form.sn 
      }
     
      this.param.mac = sessionGetStore('nbmac')
      this.param.name = this.form.name
      // this.param.location = this.form.location
      this.param.groupUid = this.tableDataGroupSelected
      // this.param.location = this.form.location
      // console.log(this.form.location)
     
      this.param.location = {
        'lat': parseFloat(this.form.location.lat).toFixed(6),
        'lon': parseFloat(this.form.location.lon).toFixed(6)
        // 'ele': this.form.location.ele.toFixed(6)
      }
      this.param.province = this.form.province
      this.param.city = this.form.city
      // console.log(this.param)
      // 添加设备
      
      // 修改设备
      if (this.isedit) {
        this.getnbdeviceput()
      } else {
        this.backDeveiceAdd()
      }
      this.addDevDialogFormVisible = false
    },
    // 检查设备名称是否重复
    checkDevName: function (devName) {
      let checkFlag = false
      for (let groupIndex = 0; groupIndex < this.deviceList.length; groupIndex++) {
        if (this.deviceList[groupIndex].children !== undefined) {
          for (let deviceIndex = 0; deviceIndex < this.deviceList[groupIndex].children.length; deviceIndex++) {
            if (this.deviceList[groupIndex].children[deviceIndex].label === devName) {
              checkFlag = true
              return checkFlag
            }
          }
        }
      }
      return checkFlag
    },
    // stomp协议数据长连接
    stompLink: function () {
      this.stompClient = Stomp.client('ws://114.55.67.62:15674/ws') // 测试
      // this.stompClient = Stomp.client('ws://116.62.155.56:15674/ws')
      // Declare on_connect
      var onConnect = function (x) {
        this.stompClient.subscribe('/exchange/leitai/' + this.param.userId, function (data) {
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
              for (let j = 0; j < this.allDeviceInfo.length; j++) { 
                if (resObj.mac === this.allDeviceInfo[j].mac) {
                  let str = ''
                  if (resObj.state === 0) {
                    str = '已离线'
                  } else if (resObj.state === 1) {
                    str = '已上线'
                  }
                  // 提示
                  this.notificationInfo('提示', '设备' + this.allDeviceInfo[j].name + str)
                }
              }
            } else if (resObj.type === 'B') {
              // 设备报警推送
              // console.log('设备报警推送')
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
            } else if (resObj.type === 'C') {
              // 网关上下线
              console.log('网关上下线')
              // 遍历分组
              for (let i = 0; i < this.deviceList.length; i++) {
                // 遍历网关
                for (let j = 0; j < this.deviceList[i].children.length; j++) {
                  if (resObj.sn === this.deviceList[i].children[j].sn) {
                    this.deviceList[i].children[j].online = resObj.state === 0 ? '离线' : '在线'
                    let str = ''
                    if (resObj.state === 0) {
                      str = '已离线'
                    } else if (resObj.state === 1) {
                      str = '已上线'
                    }
                    // 提示
                    this.notificationInfo('提示', '网关' + this.deviceList[i].children[j].label + str)
                  }
                }
              }
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
      this.stompClient.connect('thingcom', '106ling106', onConnect, onError)
    },
    /*
    ** *************API调用相关函数*************
    */
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
    // 获取账号下全部设备信息
    getAllDeviceInfo () {
      back.allDeviceInfo(this.param).then(function (response) {
        let arr = []
        for (let i = 0; i < response.data.length; i++) {
          arr.push(response.data[i])
        }
        // 所有设备（终端设备，非网关）
        this.allDeviceInfo = arr
        // console.log(this.allDeviceInfo)
      }.bind(this))
    },
    // 查询设备的状态:在线离线--模糊查询设备
    queryDevStateOnenet: function () {
      onenet.onenetDevQue(this.param).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 查找本地设备列表，改变el-tree设备的在线离线状态
        this.listDevStatueChange(response)
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 用户下网关列表信息获取
    backDevInfoGet: function () {
      // console.log('用户下网关列表信息')
      // console.log(this.param)
      back.userDevQue(this.param).then(function (response) {
        // console.log(response)
        // this.apiResponses = response // 为啥把response存起来，其他请求参数会用到该数据
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 设备列表信息存储到当前组件内
        this.deviceInfoStore(response)
      }.bind(this))
    },
    // 修改
    getnbdeviceput () { 
      back.nbdeviceput(this.param).then(res => {
        if (res.errno === 0) {
          this.notificationInfo('提示', '修改成功')
          // 用户下设备信息获取
        } else {
          this.notificationInfo('错误提示', res.error)
        }
      })
    },
    // 添加设备
    backDeveiceAdd: function () {
      console.log(this.param)
      if (this.activeName) {
        back.addnbdevice(this.param).then(res => {
          if (res.errno === 0) {
            this.notificationInfo('提示', '添加成功')
            // 用户下设备信息获取
            this.backDevInfoGet()
          } else {
            this.notificationInfo('错误提示', res.error)
          }
        })
      } else {
        back.addNetgate(this.param).then(function (response) {
          // console.log(response)
          // 进行新设备的添加
          // 先判断是否添加成功，失败则弹出失败信息
          // 若成功，则刷新设备列表，弹出成功信息
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
          } else {
            this.notificationInfo('提示', '添加设备成功')
            console.log(response)
            // 用户下设备信息获取
            this.backDevInfoGet()
          }
        }.bind(this))
      }
    },
    
    /*
    //  ************  方法函数  *************
    */
    // 开启定时器，定时查询onenet上的最新数据，定时查询设备在线状态；
    // * 定时查询浏览器窗口大小，判断是否显示隐藏左侧设备组件按钮
    // queryLoop: function () {
    //   // 停止定时器
    //   window.clearInterval(this.timerOnline) // 复位再开启 重启操作
    //   this.timerOnline = window.setInterval(this.queOnenetDevInfo, 6666)
    //   // 停止定时器 （先停止再开始 === 重启操作） ？？？？？
    //   window.clearInterval(this.timerWindowWidth)
    //   this.timerWindowWidth = window.setInterval(this.listbtnVisible, 2000)
    // },
    // 模糊查询设备(根据不同的API批量查询)
    queOnenetDevInfo: function () {
      console.log(this.apiKeyGroup)
      if (this.apiKeyGroup.length !== undefined && this.apiKeyGroup.length > 0) {
        for (let i = 0; i < this.apiKeyGroup.length; i++) {
          this.param.apiKey = this.apiKeyGroup[i]
          // 查询设备的状态:在线离线
          this.queryDevStateOnenet()
        }
      }
    },
    // 判断是否显示listbutton按钮
    listbtnVisible: function () {
      this.windowWidth = $(window).width()
      if (this.windowWidth <= 700) {
        if (this.marker === 0) {
          this.aside.style.flexBasis = 0 + 'px'
          this.listbtn.style.left = 2 + 'px'
          this.listbuttonVisible = true
        } else {
          this.listbuttonVisible = true
        }
      } else {
        this.aside.style.flexBasis = 260 + 'px'
        this.listbtn.style.left = 262 + 'px'
        this.marker = 0
        this.listbuttonVisible = false
      }
    },
    // 按钮操作显示或隐藏左侧设备列表
    asideVisibleBt: function () {
      if (this.aside.style.flexBasis !== 0 + 'px') {
        this.aside.style.flexBasis = 0 + 'px'
        this.listbtn.style.left = 2 + 'px'
      } else {
        this.aside.style.flexBasis = 260 + 'px'
        this.listbtn.style.left = 262 + 'px'
        this.marker = 1
      }
    },
    // 设备列表信息存储到当前组件内
    deviceInfoStore: function (info) {
      let devicesinfo = [] // 网关列表数组
      // info.data.map( (item, index) => {
      //   var obj = {}
      //   obj.id = item.groupUid
      //   obj.label = item.groupName
      //   obj.children = item.devices
      //   if (item.devices) {
      //     var arr = {}
      //     item.devices.map(it=>{
            
      //     })
      //   }
      // })
      if (info.errno === 0) {
        // 设备组
        // 设备列表信息存储到当前左侧组件内
        for (let j = 0; j < info.data.length; j++) {
          let devicesgroup = {}                                       // 网关数组中的一个对象
          devicesgroup.id = info.data[j].groupUid
          devicesgroup.label = info.data[j].label
          // devicesgroup.online = ''
          // devicesgroup.alarm = ''
          let data = []                                               // 网关数组->对象->数组(chidldren数组)
          if (info.data[j].children === undefined) {
            data[0] = {}                                              // children数组内对象为空
            devicesgroup.children = data
            devicesinfo[j] = devicesgroup
            continue
          }
          // 组内设备
          for (let k = 0; k < info.data[j].children.length; k++) {
            let obj = {}                                              // children数组内对象
            obj.id = info.data[j].children[k].deviceId
            obj.children = info.data[j].children[k].children
            if (info.data[j].children[k].children === undefined) {
              obj.label1 = info.data[j].children[k].label
              obj.label = info.data[j].children[k].label + '(共0台）'
            } else {
              obj.label1 = info.data[j].children[k].label
              obj.label = info.data[j].children[k].label + '(共' + info.data[j].children[k].count + '台）'
              for(let m = 0; m < obj.children.length; m++) {
                obj.children[m].label1 = obj.children[m].label
                obj.children[m].label = obj.children[m].label + '(' + obj.children[m].mac + ')'
                if (obj.children[m].children !== undefined ) {
                  for (let n = 0 ; n < obj.children[m].children.length; n++) {
                    obj.children[m].children[n].label1 = obj.children[m].children[n].label
                    obj.children[m].children[n].label = obj.children[m].children[n].label + '(' + obj.children[m].children[n].mac + ')'
                  }
                }
              }
            }
            obj.apiKey = info.data[j].children[k].apiKey
            obj.sn = info.data[j].children[k].sn
            obj.location = info.data[j].children[k].location
            obj.type = info.data[j].children[k].type
            obj.auth = ''
            obj.alarm = ''
            obj.online = info.data[j].children[k].online
            data[k] = obj
          }
          devicesgroup.children = data
          devicesinfo[j] = devicesgroup
        }
      }
      // 设备列表信息存储到当前组件内
      this.deviceList = devicesinfo
      // console.log(this.deviceList)
      this.$store.commit('setDeviceList', this.deviceList)
      // 查询设备APIKEY 存储不同的APIKEY值
      this.apikeyGroupSet()
      // 设备列表组信息存储到 添加网关组件内
      let sets = []
      if (info.errno === 0) {
        for (let m = 0; m < info.data.length; m++) {
          let obj = {}
          obj.name = info.data[m].label
          obj.id = '选项' + (m + 1)
          obj.groupUid = info.data[m].groupUid
          sets[m] = obj
        }
     
        this.tableDataGroup = sets
        // console.log(this.tableDataGroup)
      }
    },
    // 查询设备APIKEY 存储不同的APIKEY值（仅仅是存储）
    apikeyGroupSet: function () {
      this.apiKeyGroup = []
      // console.log('查询设备APIKEY 存储不同的APIKEY值（仅仅是存储）')
      // console.log(this.deviceList)
      for (let i = 0; i < this.deviceList.length; i++) {
        if (this.deviceList[i].children !== undefined) {
          for (let j = 0; j < this.deviceList[i].children.length; j++) {
            if (this.deviceList[i].children[j].apiKey !== undefined) {
              this.pushApikey(this.deviceList[i].children[j].apiKey)
            }
          }
        }
      }
    },
    // push apikey 存储不同的APIKEY值
    pushApikey: function (apikeyparam) {
      if (this.apiKeyGroup.length === undefined || this.apiKeyGroup.length === 0) {
        this.apiKeyGroup.push(apikeyparam)
      } else if (this.apiKeyGroup.length > 0) {
        for (let i = 0; i < this.apiKeyGroup.length; i++) {
          if (apikeyparam === this.apiKeyGroup[i]) {
            return
          }
        }
        this.apiKeyGroup.push(apikeyparam)
      }
    },
    // 查找本地设备列表，改变el-tree设备的在线离线状态
    listDevStatueChange: function (responseInfo) {
      if (responseInfo.data !== undefined) {
        if (responseInfo.data.devices !== undefined) {
          for (let i = 0; i < responseInfo.data.devices.length; i++) {
            // 传入设备信息（deviceId，online），修改设备在线离线状态
            this.listDevOnlineChange(responseInfo.data.devices[i].id, responseInfo.data.devices[i].online)
          }
        }
      }
    },
    // 传入设备信息（deviceId，online），修改设备在线离线状态
    listDevOnlineChange: function (deviceId, online) {
      for (let i = 0; i < this.deviceList.length; i++) {
        if (this.deviceList[i].children !== undefined) {
          for (let j = 0; j < this.deviceList[i].children.length; j++) {
            if (this.deviceList[i].children[j].id !== undefined) {
              if (this.deviceList[i].children[j].id === deviceId) {
                this.deviceList[i].children[j].online = (online) ? '在线' : '离线'
                console.log(123456)
                this.$store.commit('settDeviceOnlieState', {sn: this.deviceList[i].children[j].sn, online: online})
              }
            }
          }
        }
      }
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

<style scoped>
.home {
  top: 0px;
  bottom: 0px;
  width: 100%;
  position: absolute;
}
.el-container {
  display: flex;
  width: 100%;
  top: 0;
  bottom: 0;
  height: 100%;
}
.homeMainBox{
  background: url(/static/bg_home1.png) no-repeat;
  background-size: 100% 100%;
}
.el-aside {
  /* width: 260px; */
  flex: 0 0 0 260px;
  flex-basis: 260px;
  overflow-y: hidden;
}
.main {
  width: 100%;
  overflow: hidden;
}
#aside {
  width: 260px;
  flex: 0 0 260px;
  flex-basis: 260px;
  background: url(/static/bg_home_side1.png) no-repeat;
  background-size: 100% 100%;
  /* transition: all 0.3s; */
}
.asideTop_user{
  height: 130px;
  max-height: 130px;
  position: relative;
  box-sizing: border-box;
  padding: 5px;
  border-bottom: 1px solid #08C9DA;
}
.userheadImg{
  position: absolute;
  left: 30px;
  top: 10px;
}
.userheadImg img{
  float: left;
  height: 50px;
}
.userNickname{
  height: 60px;
  padding-left: 100px;
  text-align: left;
  display:table-cell;
  vertical-align: middle;
}
.userNickname_text{
  color: #74F4FF;
  font-size: 14px;
  line-height: 25px;
}
.userNickname_text span{
  color: #fff;
}
.operation_btn{
  float: left;
  width: 100%;
  margin-top: 15px;
}
.signout_btn, .backIndex_btn{
  background: #08C9DA;
  color: #05494F;
  border: none;
}
.signout_btn{
  margin-right: 20px;
}
/* 快捷键操作部分 */
.asidecenter_operation{
  padding: 20px 0px;
}
.item_aso{
  width: 100%;
  text-align: left;
  padding-left: 50px;
  box-sizing: border-box;
  margin: 15px 0;
}
.box_item_aso{
  display: inline-block;
}
.item_aso img{
  float: left;
  width: 24px;
  height: 24px;
  margin-right: 15px;
}
.item_aso .btn_item_aso{
  float: left;
  padding: 0px;
  font-size: 16px;
  color: #fff;
  height: 24px;
  line-height: 24px;
}
/* 设备组部分 */
.deviceGroup_box{
  padding: 5px;
}
.ip_gjz_search{
  border-radius: 10px;
  background: #024B6E;
}

.filter_tree{
  background: none;
  color: #fff;
  margin-top: 15px;
  font-size: 14px;
  overflow-y: auto;
}

/* .el-tree-node__content:hover{
  background-color: red;
} */

#listbutton {
  position: absolute;
  background-color: white;
  opacity: 0.5;
  border-radius: 5px;
  /* border: 2px solid black; */
  top: 50%;
  transform: translateY(-50%);
  left: 262px;
  width: 30px;
  height: 35px;
}
.el-dialog--center .el-dialog__header {
  background-color: #409EFF;
  padding-top: 15px;
}
.addGateway {
  /* height: 100%;
  overflow: hidden; */
}
.addGateway .primary{
  background: greenyellow;
}
.addGateway .streams_box {
 
  margin-top: 5px;
  padding: 0 25px;
}
.addGateway .streams_box .streams_box_title {
  color: #fff;
  font-size: 16px;
  padding: 15px 0;
}
.addGateway .streams_box .streams_content {
  width: 45%;
  margin-bottom: 12px;
  float: left;
}
.deviaddGatewayceBj .streams_content .streams_content_item {
  /* display: inline-block; */
  width: 50%;
  margin-bottom: 15px;
  display: inline-flex;
  flex-direction: column;
}
.addGateway .streams_content .streams_item_left {
  display: inline-block;
  width: 80px;
  font-size: 14px;
  color: #fff;
  text-align: right;
}
.addGateway .streams_content .streams_item_center {
  display: inline-block;
  width: 140px;
  margin-left: 15px;
  margin-right: 10px;
}
.addGateway .streams_content .streams_item_right {
  display: inline-block;
}

.addGateway .item_addGateway {
  width: 100%;
  margin-bottom: 15px;
  min-height: 40px;
}
.addGateway .item_addGateway .addGateway_formItem {
  float: left;
  width: 50%;
  padding-right: 30px;
  height: 40px;
  box-sizing: border-box;
}
.btn_cancel_dialog{
  margin-right: 50px;
  background: #1C363F;
  color: #08C9DA;
  border: 1px solid #08C9DA;
}
#addwgmap{
  width: 90%;
  height: 300px;
  margin-left: 5%;
}
@media screen and (max-height:730px){
  .asideTop_user{
    height: 115px;
  }
  .userheadImg img{
    height: 45px;
  }
  .userNickname{
    height: 55px;
  }
  .userNickname_text{
    font-size: 14px;
  }
  .operation_btn{
    margin-top: 10px;
  }
  .signout_btn, .backIndex_btn {
    font-size: 12px;
  }
  /* 快捷键操作部分 */
  .asidecenter_operation{
    padding: 10px 0px 0px;
  }
  .item_aso{
    margin: 10px 0;
    padding-left: 60px;
  }
  .item_aso img{
    width: 20px;
    height: 20px;
  }
  .item_aso .btn_item_aso{
    font-size: 14px;
    height: 20px;
    line-height: 20px;
  }
  /* 设备组部分 */
  .deviceGroup_box{
    padding: 5px;
  }
  .filter_tree{
    margin-top: 8px;
    font-size: 14px;
  }
}
@media screen and (max-height:580px){
  .asideTop_user{
    height: 98px;
  }
  .userheadImg{
    left: 40px;
  }
  .userheadImg img{
    height: 40px;
  }
  .userNickname{
    height: 50px;
    padding-left: 110px;
  }
  .userNickname_text{
    font-size: 14px;
  }
  .operation_btn{
    margin-top: 8px;
  }
  .signout_btn, .backIndex_btn {
    height: 22px;
    padding: 0 15px;
  }
}
@media screen and (max-height:450px){
  
}
</style>

<style lang="scss">
/* 重写primary按钮样式 */
/* .el-button--primary, .el-button--primary:focus, .el-button--primary:hover {
  background: #08C9DA;
  color: #05494F;
  border: none;
} */
/* 设备组部分 */
.ip_gjz_search input{
  background: #024B6E;
  border: none;
  border-radius: 10px;
  color: #fff;
}
/* 修改树形控件图标 */
/* .icon_tree_class{
  width: 8px;
  height: 100%;
  background: url(/static/icon_tree_right.png) no-repeat center center;
  background-size: 8px;
} */
.filter_tree .el-tree-node__expand-icon {
  color: #74F4FF;
  font-size: 16px;
}
.filter_tree .el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}
.filter_tree .el-tree-node__content {
  height: 35px;
  line-height: 35px;
}
/* 修改鼠标移入样式 */
.filter_tree .el-tree-node__content:hover{
  background-color: transparent;
  color: #08C9DA;
}
.el-tree-node:focus > .el-tree-node__content{
  background-color: transparent;
  color: #08C9DA;
}
/* 修改当前选中状态 */
.filter_tree .el-tree-node.is-current>.el-tree-node__content {
  background-color: transparent;
  color: #08C9DA;
}
.filter_tree .el-tree-node.is-current {
  background-color: transparent!important;
}
/* 修改获取焦点样式 */
.filter_tree .is-focusable{
  background-color: transparent!important;
}

.addGateway .el-dialog--center .el-dialog__body {
  padding: 0;
}
.addGateway .item_addGateway .el-form-item {
  margin-bottom: 0;
}
.addGateway .el-dialog--center .el-dialog__header {
  /* padding-top: 10px;
  line-height: 30px; */
}
.addGateway .anchorBL{
  display: none;
}
.ip_search_position .el-input-group__append{
  background: #08C9DA;
  border-color: #08C9DA;
}
.el-cascader__label{
  color: #fff;
}
.el-cascader__label span{
  color: #fff;
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

.beilv {
  width: 70px;
}
.subText {
    text-align: center;
    margin-top: 5px;
}
/* .addGateway .el-dialog {
  box-sizing: border-box;
  max-height: 90%;
  overflow-y: auto;
} */
@media screen and (max-height:730px){
  .ip_gjz_search .el-input__inner {
    height: 30px;
  }
  .ip_gjz_search .el-input__icon {
    line-height: 30px;
  }
  .el-table tr th, .el-table tr td {
    padding: 5px 0px;
  }
}
@media screen and (max-height:580px){
  .el-table tr th, .el-table tr td {
    padding: 2px 0px;
  }
}
</style>
