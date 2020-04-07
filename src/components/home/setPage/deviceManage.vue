<!-- 设备管理页面 -->
<template>
  <div class="monitorgroup">
    <el-container>
      <!-- 设备信息表格 -->
      <el-main class="setmain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="nodeListData"
          :max-height="max_table_height"
          border
          style="width: 100%"
          >
          <el-table-column
            fixed
            prop="index"
            label="序号"
            header-align="center"
            min-width="5%">
          </el-table-column>
          <el-table-column
            fixed
            prop="online"
            label="状态"
            header-align="center"
            min-width="5%">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.promptInfo"  placement="right">
                <el-button type="text" :icon="(scope.row.online === 1) ? 'el-icon-circle-check': 'el-icon-remove'"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            header-align="center"
            min-width="13%">
          </el-table-column>
          <el-table-column
            prop="type"
            label="设备类型"
            header-align="center"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="installTime"
            label="安装时间"
            header-align="center"
            min-width="20%"
            format="yyyy-MM-dd">
          </el-table-column>
          <el-table-column
            prop="station"
            label="站号"
            header-align="center"
            min-width="6%">
          </el-table-column>
          <el-table-column
            prop="nodeMac"
            label="节点"
            header-align="center"
            min-width="16%">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            header-align="center"
            width="180">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button> -->
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="deleteClick(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 添加设备按钮 -->
      <el-button type="primary" class="add_icon_btn" size="small" icon="el-icon-circle-plus-outline" @click="groupaddinit" :disabled="!this.addBtnShow">添加设备</el-button>
      <!-- 设备操作对话框 -->
      <el-dialog title="编辑设备" top="50px" :visible.sync="nodeDialogShow" width="740px" center @close="dialogClosed">
        <el-form class="deviceBj" :model="diaNodeInfoForm" :inline="true" label-width="80px" size="medium">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备名称" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.name" placeholder="请输入设备名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装时间" :label-width="formLabelWidth">
                <el-date-picker class="form_ipsl_item" type="datetime"  v-model="diaNodeInfoForm.installTime" placeholder="请选择安装时间" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="连接设备" :label-width="formLabelWidth">
                <el-select class="form_ipsl_item" v-model="diaNodeInfoForm.device" @change="connectDeviceChange" placeholder="请选择设备" :disabled="formAddOrModify===1">
                  <!-- <el-option label="Modbus设备" value="modbus"></el-option> -->
                  <el-option
                    v-for="item in connectDeviceSlOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型" :label-width="formLabelWidth">
                <el-select class="form_ipsl_item" v-model="diaNodeInfoForm.type" placeholder="请选择设备类型" :disabled="formAddOrModify===1">
                  <el-option
                    v-for="item in deviceTypeSlOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备站号" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.station" placeholder="请输入设备站号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="isCrcShow">
              <el-form-item label="CRC校验" :label-width="formLabelWidth">
                <el-select class="form_ipsl_item" v-model="diaNodeInfoForm.crc" placeholder="请选择CRC校验方式">
                  <el-option label="低位前" :value="0"></el-option>
                  <el-option label="高位前" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="查询时间" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.queryTime" placeholder="请输入查询时间"></el-input>
                <!-- <span style="font-size:14px">/s</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="节点Mac" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.nodeMac" placeholder="请输入节点Mac"></el-input>
                <!-- <span style="font-size:14px">/s</span> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="死区设置" :label-width="formLabelWidth">
                <el-input-number v-model="diaNodeInfoForm.deadArea" controls-position="right" :min="0" :max="5000"></el-input-number>
                <span style="color:#fff;">当值在±{{diaNodeInfoForm.deadArea}}范围内波动时，不上报数据以节省流量</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="经度" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.location.lon" placeholder="经度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.location.lat"  placeholder="纬度"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="省份" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.province" placeholder="省份"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市" :label-width="formLabelWidth">
                <el-input class="form_ipsl_item" v-model="diaNodeInfoForm.city" placeholder="城市"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 选择地图 -->
          <div class="form_map_item">
            <div>
              <el-form-item style="textAlign:center;">
                <!-- <span style="font-size:12px;color:red;">（选取点后，经度、纬度、省份、城市会被自动添上）</span> -->
                <el-button-group>
                  <!-- 1、地图上选点(chose) 2、关键词搜索(search) -->
                  <el-button size="small" :type="pointChoseType=='chose'?'primary':'info'" @click="mapselectpoint">地图上选点</el-button>
                  <el-button size="small" :type="pointChoseType=='search'?'primary':'info'" @click="mapkeyword">关键词搜索</el-button>
                </el-button-group>
              </el-form-item>
              <el-form-item v-show="pointChoseType == 'search'" label="地点" :label-width="formLabelWidth">
                <el-input v-model="diaNodeInfoForm.locationKeyWord" class="ip_search_position" placeholder="请输入要搜索的地点">
                  <el-button slot="append" icon="el-icon-search" @click="mapKeyWord"></el-button>
                </el-input>
              </el-form-item>
            </div>
            <div>
              <!-- 地图 -->
              <div id="addwgmap"></div>
            </div>
          </div>
          <!-- 监控点配置 -->
          <div class="streams_box">
            <div class="streams_box_title">监控点配置</div>
            <div class="streams_content">
              <!-- v-model="streamWatchArr"  @change="checkboxChose" -->
              <div class="streams_content_item" v-for="(item,index) in diaNodeInfoForm.streamNameList" :key="index">
                <div class="streams_item_left">监控点{{index+1}}</div>
                <el-input class="streams_item_center" v-model="item.name" :placeholder="item.name"></el-input>
                <!-- <el-checkbox class="streams_item_right" v-model="streamWatchArr[index]" :label="index" :true-label='1' :false-label='0'></el-checkbox> -->
                <el-checkbox class="streams_item_right" v-model="item.auth" :label="index" :true-label='1' :false-label='0'></el-checkbox>
              </div>
            </div>
          </div>
        </el-form>
        
        <div slot="title" class="dialog-title">{{operationName}}</div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" class="btn_cancel_dialog" @click="nodeDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="handleGroup('diaNodeInfoForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除设备对话框 -->
      <el-dialog title="删除设备" :visible.sync="dialogVisible" width="500px" center>
        <el-form ref="groupRuleForm" :model="deleteForm">
          <el-form-item label="账号密码" prop="groupName" label-width="80px">
            <el-input class="ip_fzm_setGroup1" type="password" v-model="deleteForm.value"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="footerBtn" style="textAlign:center;">
              <el-button type="primary" @click="deleteConfirm">确定</el-button>
              <el-button type="primary" class="btn_cancel_setGroup"  @click="dialogVisible = false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import BMap from 'BMap'
import { back } from 'api'
import $ from 'jquery'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  data () {
    return {
      streamsArrL: 10,
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
      // 实际存储当前页面所有设备信息
      nodeListData: [
        // {
        // index: '1',                              // 表格索引号
        // online: '在线',                          // 标识当前设备是在线还是离线
        // promptInfo: '条目已下发',                // 设备提示信息（条目已下发，条目未下发）
        // name: '1号设备',                       // 设备名称
        // station: '1',                      // 设备站号
        // installTime: '2018-12-17'              // 设备安装时间
        // }
      ],
      // 连接设备选择框的选项
      connectDeviceSlOption: [
        {
          value: 'modbus',
          label: 'Modbus设备'
        }, {
          value: 'other',
          label: '其他设备'
        }
      ],
      // 是否显示crc校验选择
      isCrcShow: true,
      // 全部类型设备的基本信息
      deviceTypeArr: [],
      deviceTypeObj: [],
      // 当前类型设备的监控点数据
      deviceStreamInfo: [],
      // 监控点选择显示的复选框的值---数组
      streamWatchArr: [],
      // 设备类型选择框的所有可能选项
      deviceTypeOptionArr: [
        [
          {
            value: 2,
            label: 'LT-CJ485'
          }
        ],
        [
          {
            value: 1,
            label: 'LT-iSPD-5'
          }
        ]
      ],
      // 设备类型选择框的当前可能选项
      deviceTypeSlOption: [],
      // 存储设备对话框表单信息(当前选中设备)
      diaNodeInfoForm: {
        index: 1,                           // 存储当前选择第几行
        name: '',                           // 设备名称
        installTime: '',                   // 设备安装时间
        device: '',                   // 连接设备
        type: 3,                           // 设备类型
        station: '',                   // 设备站号
        crc: 0,                    // CRC校验
        queryTime: '10',                    // 查询时间
        deadArea: 0,                    // 死区设置
        isUpdate: 0,                   // 该参数表示是否需要修改设备的相关参数  0：不修改；1：修改
        nodeMac: '',                 // 
        // 设备三维坐标
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
        locationKeyWord: '',
        // 监控点配置
        streamNameList: [
          {
            // 监控点名称
            name: '',
            // 是否显示数据
            auth: 0
          }
        ]
      },
      // 监控点默认配置
      streamBaseList: [
        {
          // 监控点名称
          name: '',
          // 是否显示数据
          auth: 0
        }
      ],
      map: null,             // 地图实例
      // 当前选择主题样式
      currentMayStyle: 'midnight',
      pointChoseType: 'chose', // 哪种选点方式---1、地图上选点(chose) 2、关键词搜索(search)
      keyWordObj: null,         // 关键词检索变量
      // 当前设备信息
      currentDeviceInfo: {
        name: '',                           // 设备名称
        installTime: '',                   // 设备安装时间
        device: '',                   // 连接设备
        type: '',                           // 设备类型
        station: '',                   // 设备站号
        crc: '',                    // CRC校验
        queryTime: '',                    // 查询时间
        deadArea: '',                    // 死区设置
        nodeMac: ''                 // 节点Mac
      },
      formAddOrModify: 0,                  // 设备添加与编辑的标志 0-add,1-modify
      nodeDialogShow: false,               // 设备添加/删除 对话框显示标志位
      loadingFlag: false,                  // 加载图标标志位
      formLabelWidth: '80px',              // 对话框表单宽度
      operationName: '编辑设备',          // 对话框标题
      // 添加/编辑/删除/对话框中确定按键 显示标志位 ----是否显示要根据权限来
      addBtnShow: true,
      editBtnShow: true,
      delBtnShow: true,
      confirmBtnShow: true,
      max_table_height: null, // 表格高度
      // 定时器
      lxctimer: null,
      // 删除设备对话框显示状态
      dialogVisible: false,
      // 删除对话框的输入框内容
      deleteForm: {
        value: ''
      }
    }
  },
  computed: {
    // 当前选择的设备类型
    editDeviceType () {
      return this.diaNodeInfoForm.type
    }
  },
  watch: {
    // 当前选择的设备类型  发生变化
    editDeviceType (newValue, oldValue) {
      // console.log(newValue)
      this.deviceStreamInfo = this.deviceTypeObj[newValue].streamNameList
      // console.log(this.deviceStreamInfo)
      var streamArrBackups = []
      var streamArrNormal = []
      // var streamAuth = []
      for (var i = 0; i < this.deviceStreamInfo.length; i++) {
        streamArrBackups[i] = {
          name: this.deviceStreamInfo[i].streamName,
          auth: 0
        }
        streamArrNormal[i] = {
          name: this.deviceStreamInfo[i].streamName,
          auth: 0
        }
        // streamAuth[i] = 0
      }
      // 监控点配置---初始化
      this.streamBaseList = streamArrBackups  // 监控点默认配置---存储
      this.diaNodeInfoForm.streamNameList = streamArrNormal // 表单的监控点配置---恢复默认
      // 监控点选择显示的复选框的值---初始化
      // this.streamWatchArr = streamAuth
      // console.log(this.diaNodeInfoForm.streamNameList)
      // console.log('设备类型变化')
      // console.log(this.streamWatchArr)
    }
    // // 数据流的勾选发生变化
    // streamWatchArr (value) {
    //   console.log(value)
    // }
  },
  //
  // ***************生命周期*********************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 获取用户的地图主题
    this.currentMayStyle = sessionGetStore('userMap')
    // 获取设备类型代表数字配置
    this.deviceTypeArr = JSON.parse(sessionGetStore('deviceTypeArr'))
    this.deviceTypeObj = JSON.parse(sessionGetStore('deviceTypeObj'))
    // console.log(this.deviceTypeObj)
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    // 设备类型选择框的当前可能选项---默认第一项
    this.deviceTypeSlOption = this.deviceTypeOptionArr[0]
    // 设备类型的默认值修改---设备类型选择框的当前可能选项的第一项
    this.diaNodeInfoForm.type = this.deviceTypeSlOption[0].value
    
    // 修改表格最大高度
    this.max_table_height = document.documentElement.clientHeight - 195
    
    // 获取onenet调用关键参数
    // 分组管理/设备添加/用户管理 按钮显示判断
    if (sessionGetStore('authMe') === '0') {
      this.addBtnShow = true
      this.editBtnShow = true
      this.delBtnShow = true
      this.confirmBtnShow = true
    } else {
      this.addBtnShow = false
      this.editBtnShow = false
      this.delBtnShow = false
      this.confirmBtnShow = false
    }
    if (sessionGetStore('userId') === sessionGetStore('userIdMe')) {
      this.addBtnShow = true
      this.editBtnShow = true
      this.delBtnShow = true
      this.confirmBtnShow = true
    }
    // console.log(this.addBtnShow)
    // console.log(this.editBtnShow)
    // console.log(this.delBtnShow)
    // console.log(this.confirmBtnShow)
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 后台查询网关下设备列表信息
    this.backDevicesListQue()
    // 轮询查询
    this.lxctimer = setInterval(this.backDevicesListQue.bind(this), 4000)
  },
  destroyed () {
    // 清除轮询查询
    clearInterval(this.lxctimer)
  },
  methods: {
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
      // var topleftnavigation = new BMap.NavigationControl()
      // this.map.addControl(topleftnavigation) 
      this.map.enableScrollWheelZoom(true)
    },
    // 选择-地图上选点
    mapselectpoint () {
      // 修改选点方式
      this.pointChoseType = 'chose' // 1、地图上选点(chose) 2、关键词搜索(search)
      // 清除地图
      this.map = null
      // 清除 地点关键词
      this.diaNodeInfoForm.locationKeyWord = '' // 地点关键词
      // 设置地图
      this.$nextTick(function () {
        // 百度地图是必须让它在页面加载完成后显示（生命周期mounted），但是由于element的对话框（el-dialog）是基于v-if这个功能。所以，应该在dom加载完后再初始化地图
        // 地图初始化
        this.mapinit()
        // 添加点击地图监听事件---点击地图后添加标注点
        this.map.addEventListener('click', function (e) {
          // console.log(e)
          // 清除标注点
          document.body.scrollTop = 0
          this.map.clearOverlays()
   
          // 添加标注点
          var point = new BMap.Point(e.point.lng, e.point.lat) // 创建点
          var myIconOn = new BMap.Icon('/static/dw_icon_on.png', new BMap.Size(32, 32))
          var marker = new BMap.Marker(point, {icon: myIconOn})  // 创建标注
          this.map.addOverlay(marker) // 将标注添加到地图中
          // 修改form表单内容
          // 设备坐标
          this.diaNodeInfoForm.location = {
            'lat': e.point.lat.toFixed(6),
            'lon': e.point.lng.toFixed(6)
          }
          var geoc = new BMap.Geocoder() // 用于获取用户的地址解析
          // 地址解析
          geoc.getLocation(e.point, function (rs) {
            var addComp = rs.addressComponents
            // 设备所在省份
            this.diaNodeInfoForm.province = addComp.province
            // 设备所在城市
            this.diaNodeInfoForm.city = addComp.city
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
      this.diaNodeInfoForm.locationKeyWord = '' // 地点关键词
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
            _this.diaNodeInfoForm.location = {
              'lat': res.point.lat.toFixed(6),
              'lon': res.point.lng.toFixed(6)
            }
            // 设备所在省份
            _this.diaNodeInfoForm.province = res.province
            // 设备所在城市
            _this.diaNodeInfoForm.city = res.city
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
      this.keyWordObj.search(this.diaNodeInfoForm.locationKeyWord)
    },
    // 复选框发生变化
    checkboxChose (value) {
      // console.log(value)
    },
    /*
    //  ************  用户操作触发方法  ************
    */
    // 添加设备中的  连接设备下拉框变化
    connectDeviceChange (value) {
      // console.log('连接设备下拉框变化')
      if (value === 'modbus') {
        // 设备类型选择框的当前可能选项---更新
        this.deviceTypeSlOption = this.deviceTypeOptionArr[0]
        // 是否显示crc校验选择---显示
        this.isCrcShow = true
      } else if (value === 'other') {
        // 设备类型选择框的当前可能选项---更新
        this.deviceTypeSlOption = this.deviceTypeOptionArr[1]
        // 是否显示crc校验选择---隐藏
        this.isCrcShow = false
      }
      // 设备类型的默认值修改---设备类型选择框的当前可能选项的第一项
      this.diaNodeInfoForm.type = this.deviceTypeSlOption[0].value
    }, 
    // 添加设备-打开对话框
    groupaddinit: function () {
      // console.log(this.param)
      if (!this.addBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      // 将标志改为添加
      this.formAddOrModify = 0 // 设备添加与编辑的标志 0-add,1-modify
      // 修改对话框标题
      this.operationName = '添加设备' // 对话框标题
      // console.log(this.streamBaseList)
      // 连接设备---恢复默认的modbus
      this.deviceTypeSlOption = this.deviceTypeOptionArr[0]
      // 表单对象的目标值
      var formTargetObj = {
        index: this.nodeListData.length,
        name: '',
        installTime: '',
        // device: this.deviceTypeSlOption[0].value !== 1 ? 'modbus' : 'other',
        // type: this.deviceTypeSlOption[0].value,
        station: '',
        crc: '',
        queryTime: '',
        deadArea: '',
        mac: '',
        isUpdate: '0',
        nodeMac: '',
        province: '',
        city: '',
        location: {
          'lat': '',
          'lon': '',
          'ele': ''
        },
        streamNameList: this.streamBaseList
      }
      // 表单设置操作
      this.formSetFunc(formTargetObj, this.deviceTypeSlOption[0].value)
      
      // 显示对话框
      this.nodeDialogShow = true
      // 地图初始化---默认 地图上选点(chose)
      this.mapselectpoint()
    },
    // 编辑设备-打开对话框
    handleEdit: function (index, row) {
      if (!this.editBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      // console.log(index)                                    // 当前选中行的index，即选中设备的index
      // console.log(row)
    
      this.formAddOrModify = 1                              // 设备添加/编辑标志位
      this.uploadShow = true
      this.operationName = '编辑设备'
      this.param.mac = row.mac                              // 查询当前设备信息需要当前设备MAC
      // back获取当前设备详细信息
      // 所需param: mac
      this.backDeviceInfoQue(index)
    },
    // 编辑设备信息-确认
    handleGroup: function () {
      if (!this.confirmBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      if (this.formAddOrModify === 0) {
        // 添加设备
        this.devDeviceAdd()
      } else if (this.formAddOrModify === 1) {
        // 编辑设备
        this.devNodeEdit()
      }
      this.nodeDialogShow = false
    },
    // 对话框关闭事件
    dialogClosed: function () {
      // console.log('对话框关闭事件2')
    },
    // 点击 表格中的删除
    deleteClick (index, row) {
      // console.log(this.delBtnShow)
      if (!this.delBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }

      // 表单初始化
      this.deleteForm = {
        value: '',
        index: index
      }
      // 打开对话框
      this.dialogVisible = true
    },
    // 点击 对话框的确认
    deleteConfirm () {
      if (!this.deleteForm.value || this.deleteForm.value === '') {
        this.notificationInfo('错误提示', '请输入账号的密码')
        return
      }
      let pwd = sessionGetStore('password')
      if (this.deleteForm.value !== pwd) {
        this.notificationInfo('错误提示', '密码错误')
        return
      }
      // 关闭对话框
      this.dialogVisible = false
      this.loadingFlag = true
      this.param.mac = this.nodeListData[this.deleteForm.index].mac
      this.backDeleteDevice()
    },
    // 编辑设备 1.表单规则校验，2.存储param参数
    devNodeEdit: function () {
      // 表单规则校验
      var index = this.diaNodeInfoForm.index           // 选中的设备在所有设备列表的索引号
      // console.log(index)
      if (this.diaNodeInfoForm.installTime === '' || this.diaNodeInfoForm.mac === '') {
        this.notificationInfo('错误提示', '主要信息项不可为空')
        return
      }
      if (this.diaNodeInfoForm.mac !== this.nodeListData[index].mac) {
        this.notificationInfo('错误提示', 'mac值不能改变')
        return
      }
      for (let i = 0; i < this.nodeListData.length; i++) {
        if (this.diaNodeInfoForm.station !== this.nodeListData[index].station) {
          if (this.diaNodeInfoForm.station === this.nodeListData[i].station) {
            this.notificationInfo('错误提示', '站号不能重复')
            return
          }
        }
      }
      if (this.diaNodeInfoForm.crc !== this.currentDeviceInfo.crc || this.diaNodeInfoForm.deadArea !== this.currentDeviceInfo.deadArea || this.diaNodeInfoForm.station !== this.currentDeviceInfo.station || this.diaNodeInfoForm.queryTime !== this.currentDeviceInfo.queryTime || this.diaNodeInfoForm.nodeMac !== this.currentDeviceInfo.nodeMac) {
        // 该参数表示是否需要修改设备的相关参数  0：不修改；1：修改
        this.diaNodeInfoForm.isUpdate = 1
      }
      this.diaNodeInfoForm.station = parseInt(this.diaNodeInfoForm.station)
      // // 对象转数组
      // var arrStreamList = []
      // for (let keyStream in this.diaNodeInfoForm.streamNameList) {

      //     arrStreamList.push(this.diaNodeInfoForm.streamNameList[keyStream])
      // }
      // this.diaNodeInfoForm.streamNameList = arrStreamList
      // console.log(this.diaNodeInfoForm.streamNameList)
      // console.log(this.diaNodeInfoForm)
      // 存储param参数
      for (let key in this.diaNodeInfoForm) {                      // for...in循环操作对象
        this.param[key] = this.diaNodeInfoForm[key]                // K值构建
      }
      this.param.location = {
        'lat': parseFloat(this.diaNodeInfoForm.location.lat).toFixed(6),
        'lon': parseFloat(this.diaNodeInfoForm.location.lon).toFixed(6)
        // 'ele': this.diaNodeInfoForm.location.ele.toFixed(6)
      }
      // console.log(this.param)
      this.backChangeDevice()
    },
    // 添加设备 1.表单规则校验，2.存储param参数
    devDeviceAdd: function () {
      // for (var j = 0; j < this.streamWatchArr.length; j++) {
      //   this.diaNodeInfoForm.streamNameList[j].auth = this.streamWatchArr[j]
      // }
      this.diaNodeInfoForm.station = parseInt(this.diaNodeInfoForm.station)
      // // 对象转数组
      // var arrStreamList = []
      // for (let keyStream in this.diaNodeInfoForm.streamNameList) {

      //     arrStreamList.push(this.diaNodeInfoForm.streamNameList[keyStream])
      // }
      // this.diaNodeInfoForm.streamNameList = arrStreamList
      // 存储param参数
      for (let key in this.diaNodeInfoForm) {                      // for...in循环操作对象
        this.param[key] = this.diaNodeInfoForm[key]                // K值构建
      }
      this.param.location = {
        'lat': parseFloat(this.diaNodeInfoForm.location.lat).toFixed(6),
        'lon': parseFloat(this.diaNodeInfoForm.location.lon).toFixed(6)
        // 'ele': this.diaNodeInfoForm.location.ele.toFixed(6)
      }
      // console.log(this.param)
      this.loadingFlag = true
      // back添加设备
      this.backAddDevice()
    },
    // 表单设置操作
    formSetFunc: function (newFormObj, deviceType) {
      // 设备类型选择框的当前可能选项---更新
      this.deviceTypeSlOption = deviceType !== 1 ? this.deviceTypeOptionArr[0] : this.deviceTypeOptionArr[1]
      // 连接设备发生变化
      this.diaNodeInfoForm.device = deviceType !== 1 ? 'modbus' : 'other'
      // 设备类型发生变化
      this.diaNodeInfoForm.type = deviceType
      // 是否显示crc校验选择---隐藏
      this.isCrcShow = deviceType !== 1

      var _this = this
      // 执行顺序：设备类型发生变化-->数据流信息根据类型重置-->表单赋值
      // 延时器，不加的话   执行顺序可能为：设备类型发生变化-->表单赋值-->数据流信息根据类型重置
      setTimeout(function () {
        // 表单赋值
        _this.diaNodeInfoForm = $.extend(true, {}, _this.diaNodeInfoForm, newFormObj)
        // console.log('表单设置')
      }, 500)
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // 后台查询网关下设备列表信息
    backDevicesListQue: function () {
      // console.log('后台查询网关下设备列表信息')
      // console.log(this.param)
      back.relatioDevices(this.param).then(function (response) {
        // console.log(response)
        let list = []
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.index = i + 1
            obj.name = response.data[i].name
            obj.installTime = response.data[i].installTime
            obj.mac = response.data[i].mac
            obj.nodeMac = response.data[i].nodeMac
            obj.station = response.data[i].station
            obj.type = this.deviceTypeArr[response.data[i].type]
            // 状态---实际
            obj.online = response.data[i].isOnline
            obj.promptInfo = obj.online === 1 ? '在线' : '离线'

            list[i] = obj
          }
        }
        this.nodeListData = list
        // console.log(this.nodeListData)
        this.loadingFlag = false
      }.bind(this))
    },
    // 后台添加设备
    backAddDevice: function () {
      // console.log('添加设备')
      // console.log(this.param)
      back.addDevice(this.param).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
        } else {
          // 添加设备成功之后自动刷新设备列表
          // 后台查询网关下设备列表信息
          this.backDevicesListQue()
        }
      }.bind(this))
    },
    // 后台删除设备
    backDeleteDevice: function () {
      // console.log('后台删除设备')
      back.deleteDevice(this.param).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 后台查询网关下设备列表信息
          this.backDevicesListQue()
        }
        // 后台查询网关下设备列表信息
        this.backDevicesListQue()
        this.loadingFlag = false
      }.bind(this))
    },
    // 后台修改设备信息
    backChangeDevice: function () {
      // console.log('后台修改设备')
      // console.log(this.param)
      back.changeDevice(this.param).then(function (response) {
        // console.log(response)
        // this.pictureList = [] // 初始化图片列表，防止点击其他设备继承遗留在上个设备的数据
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        }
        // 重置当前设备信息
        this.currentDeviceInfo = {}
        // 重新渲染组件时操作
        // 后台查询网关下设备列表信息
        this.backDevicesListQue()
        this.loadingFlag = false
      }.bind(this))
    },
    // 后台查询设备详细信息
    backDeviceInfoQue: function (index) {
      // console.log('设备详细信息')
      // console.log(this.param)
      // 获取当前设备信息
      back.deviceInfoQue(this.param).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.loadingFlag = false
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 设置当前设备信息
        this.currentDeviceInfo = response.data
        this.nodeDialogShow = true                           // 打开设备编辑对话框
        // 地图初始化---默认 地图上选点(chose)
        this.mapselectpoint()
        // 表单对象的目标值
        var formTargetObj = {
          index: index,
          name: response.data.name,
          installTime: response.data.installTime,
          // device: response.data.type !== 1 ? 'modbus' : 'other',
          // type: response.data.type,
          station: response.data.station,
          crc: response.data.crc,
          queryTime: response.data.queryTime,
          deadArea: response.data.deadArea,
          mac: response.data.mac,
          isUpdate: '0',
          nodeMac: response.data.nodeMac,
          province: response.data.province,
          city: response.data.city,
          location: response.data.location,
          streamNameList: response.data.streamNameList
        }
        // 表单设置操作
        this.formSetFunc(formTargetObj, response.data.type)
      }.bind(this))
    },
    /*
    //  ************  辅助函数  *************
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
.monitorgroup {
  padding-top: 30px;
  bottom: 0;
  width: 100%;
  /* overflow: hidden; */
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.setmain{
  padding: 0;
}
.add_icon_btn{
  position: absolute;
  top: -40px;
  right: 0;
}
.el-table .cell {
  text-align: center;
}
/* .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 160px;
} */
.diaPartTitle {
  font-size: larger;
  color: dodgerblue;
}
.monitorgroup >>> .el-icon-circle-check {
  color: green;
  font-size: 18px;
}
.monitorgroup >>> .el-icon-remove {
  color: red;
  font-size: 18px;
}
.monitorgroup >>> .el-dialog--center .el-dialog__body {
  padding: 15px 27px 8px;
}
.monitorgroup >>> .el-upload-list__item .el-upload--picture-card {
  width: 120px;
  height: 120px;
}
.monitorgroup >>> .el-header, .el-footer {
  background-color: #FFFFFF;
  color: #333;
  /* footer与header都在container容器内 => 可test-align */
  text-align: left;
  line-height: 60px;
  height: 60px;
}
.el-footer {
  bottom: 0px;
  left: 0px;
}
.form_ipsl_item{
  width: 220px;
}
#addwgmap{
  width: 90%;
  height: 300px;
  margin-left: 5%;
}
.btn_cancel_dialog{
  margin-right: 50px;
  background: #1C363F;
  color: #08C9DA;
  border: 1px solid #08C9DA;
}
.deviceBj .streams_box {
  width: 100%;
  margin-top: 5px;
}
.deviceBj .streams_box .streams_box_title {
  color: #fff;
  font-size: 16px;
  padding: 15px 0;
}
.deviceBj .streams_box .streams_content {
  width: 90%;
  margin: 0 auto;
}
.deviceBj .streams_content .streams_content_item {
  display: inline-block;
  width: 50%;
  margin-bottom: 15px;
}
.deviceBj .streams_content .streams_item_left {
  display: inline-block;
  width: 80px;
  font-size: 14px;
  color: #fff;
  text-align: right;
}
.deviceBj .streams_content .streams_item_center {
  display: inline-block;
  width: 140px;
  margin-left: 15px;
  margin-right: 10px;
}
.deviceBj .streams_content .streams_item_right {
  display: inline-block;
}

</style>
<style>
/* 解决element-ui的表格设置固定栏后，边框线消失的bug */
.monitorgroup .el-table__row td:not(.is-hidden):nth-child(1){
  bottom:-1px;
}
.monitorgroup .el-table__row td:not(.is-hidden):nth-child(2){
  bottom:-1px;
}
.monitorgroup .form_map_item .anchorBL{
  display: none;
}
.streams_box .el-checkbox__label {
  color: transparent;
}
.streams_box .el-checkbox__input.is-checked + .el-checkbox__label {
  color: transparent;
}
</style>
