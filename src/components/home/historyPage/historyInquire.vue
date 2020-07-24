<template>
  <div class="history">
    <div class="history_search">
      <div class="jkd_chose_box">
        <span>设备选择：</span>
        <!-- <el-select 
          class="jkd_chose"
          size="small"
          v-model="deviceSelected" 
          placeholder="请选择"
        >
          <el-option v-for="item in deviceListInfo" :key="item.collectorUId" :label="item.name" :value="item.mac"></el-option>
        </el-select> -->
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="deviceSelected"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :clearable="true"
          size="mini"
          @select="handleSelect">
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
          
          </template>
        </el-autocomplete>
      </div>
      <div class="date_chose_box">
        <div class="date_chose">开始日期
          <el-date-picker
              v-model="valueStart"
              type="datetime"
              size="mini"
              style="width:176px"
              @change="getStartTime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="选择日期时间"
              :picker-options="pickerOptions">
            </el-date-picker>
        </div>
        <div class="date_chose">结束日期
          <el-date-picker
            v-model="valueEnd"
            type="datetime"
            size="mini"
            style="width:176px"
            @change="getEndTime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </div>
      <el-button class="search_btn" size="mini" type="primary" @click="queryHistoryBt">开始查询</el-button>
      <div class="txxz_box">
        <el-button-group>
          <el-tooltip content="表格" placement="bottom" effect="light">
            <el-button size="mini" type="primary" icon="el-icon-tickets" @click="dataListBtn" :class="isTable?'tableIcon':'lineIcon'"></el-button>
          </el-tooltip>
          <el-tooltip content="折线图" placement="bottom" effect="light">
            <el-button size="mini" type="primary" icon="el-icon-picture-outline" @click="dataChartBtn" :class="isTable?'lineIcon':'tableIcon'"></el-button>
          </el-tooltip>
        </el-button-group>
      </div>
      <div class="page_table" v-show="pageControlBtnShow">
        <el-button-group>
          <el-tooltip content="上一页" placement="bottom" effect="light">
            <el-button size="mini" type="primary" icon="el-icon-arrow-left" @click="pageUpBtn" :disabled="this.loadingFlag"></el-button>
          </el-tooltip>
          <el-tooltip content="下一页" placement="bottom" effect="light">
            <el-button size="mini" type="primary" icon="el-icon-arrow-right" @click="pageDownBtn" :disabled="this.loadingFlag"></el-button>
          </el-tooltip>
        </el-button-group>
        <span>&nbsp;&nbsp;第{{this.pageCurNum}}页</span>
      </div>
      <div class="export_table_btn" v-show="downloadShow">
        <el-button type="primary" @click="download" size="mini">导出表格</el-button>
      </div>
      <div style="clear:both"></div>
    </div>
    <template v-if="dataListView">
      <el-table
        v-loading="loadingFlag"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="monitorPointData"
         v-if="tableIsShow"
        ref="table"
        border
        style="width: 100%;"
        :max-height="tableHeight">
          <el-table-column
            prop="number"
            label="序号"
            header-align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间"
            header-align="center"
            width="200">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in sensorNameArr"
           
            :key="index"
            :prop="item.prop? item.prop:'CH'+index"
            header-align="center"
            :label="item.name">
          </el-table-column>
        </el-table>
    </template>
    <!-- <h1></h1> -->
    <template v-else>
      <div class="chartview">
        <div id="diagram">
          <h1>echart</h1>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { back, onenet } from 'api'
import { sessionGetStore, export2Excel } from '@/components/config/Utils'

export default {
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'sn': '',
        'Authorization': '',
        'apiKey': '',
        'deviceId': '',
        'startTime': '',
        'endTime': '',
        'limit': 200, // onenet规定最大为6000
        'cursor': '',
        'datastreamId': []
      },
      // ...几个数据存储变量说明
      // * lengthData--各路传感器各个数组的数据长度
      // * limitData--cursor,时间格式,数据格式,各路最小数组长度的onenet所有数据
      // * moniterPointer--所有处理之后的最终最新各路监控点数据，表格实际显示数据
      // 传感器名称列表
      sensorNameArr: [
        // { name: '传感器1', sensorId: 1, mac: '' }
      ],
      sensorNameArr1: [
        {prop:'value1', name:'远控1'},
        {prop:'value2', name:'远控2'},
        {prop:'value3', name:'远控3'},
        {prop:'value4', name:'远控4'},
        {prop:'value5', name:'电平跳变1'},
        {prop:'value6', name:'电平跳变2'},
        {prop:'value7', name:'电平跳变3'},
        {prop:'value8', name:'电平跳变4'},
        {prop:'value9', name:'电平跳变5'},
        {prop:'value10', name:'脉冲次数'},
        {prop:'value11', name:'电压'},
        {prop:'value12', name:'电流'},
       
      ],
      // 实际存储当前页面中的设备的查询到的历史数据信息
      monitorPointData: [{
        number: '',
        time: '',
        CH1: '',
        CH2: '',
        CH3: '',
        CH4: ''
      }],
      restaurants:[],
      tableIsShow: false, // 表格显示状态
      valueStart: '',             // 开始日期
      valueEnd: '',              // 结束日期
      monitorCreatetime: '',      // 当前选中监控点创建时间
      deviceSelected: '',           // 当前选择的监控点(采集器)的ID号（小组【采集器】UID号（用于后台））
      limitData: [],              // 存放向onenet查询到的带limit参数的数据
      // 存储设备列表信息 collectorId,installTime,location,mac,name,online,slaveAddress,index
      deviceListInfo: [{
        collectorUId: '',                 // 采集器UID号（用于后台）
        collectorId: '',                  // 采集器ID号（用于发往设备）
        name: '',                         // 采集器名
        index: ''
      }],
      pickerOptions: {
        // 设置禁用状态，参数为当前日期，要求返回 Boolean
        disabledDate (time) {
          return (time.getTime() > Date.now() || time.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 90)
        }
      },
      dataListView: true,                  // 表格/折线图显示标志位
      downloadShow: true,                  // 下载图标按钮显示标志位
      isTable: true,                       // 表格/折线图图标显示标志位
      loadingFlag: false,
      loadingText: '拼命加载中',            // 加载loading提示文字
      // ...分页用变量
      cursorArr: [],                       // 存储每一次请求返回的cursor到一个数组中去
      pageTotalNum: [0],                      // 存储每一页的数据条数，此数组和cursorArr的长度是相同的
      pageCurNum: null,                    // 当前页码
      numberConst: 1000,                   // 常量，每页行数
      pageDownBackNum: null,               // 最新数据页面量，===请求back次数 只增不减
      pageDataNum: null,                   // 1，2，3，4, 5 表示最大长度为5的arr数组的索引号.当前页大于5则为5，当前页小于1则为1
      pageLeftNum: null,                   // 左移几位变量
      pageRightNum: null,                  // 右移几位变量
      pageControlBtnShow: false,           // 上页下页按钮显示标志位
      pageDownOrUp: null,                  // 上一页下一页判断 true-下一页，false-上一页
      // ...导出表格所用变量
      isDownLoad: false,                   // 导出表格事件标志位
      limitDataCur: [],                    // 本次onenet查询的数据
      limitDataCurLengthOld: 0,            // data原始长度，用于计算行号
      excelDataStr: '',    // excel表格数据存储，通过string字符串来存储
      /* 表格高度自适应所需变量 */
      tableHeight: 0, // 表格高度 = clientHeight - 顶部height - 上部height - 底部height
      screenHeight: document.body.clientHeight, // 监听变化辅助用，一定要设初始值
      onresizeTimer: false // 屏幕高度变化定时器，避免频繁调用window.onresize()方法
    }
  },
  created () {
   
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    // back获取apikey,deviceId
    // if (sessionGetStore('isnb') !=='true') {
    //   back.getNetInfo(this.param).then(function (response) {
    //     if (response.errno !== 0) {
    //       this.notificationInfo('错误提示', response.error)
    //       return
    //     }
    //     this.param.apiKey = response.data.apiKey
    //     this.param.deviceId = response.data.deviceId
    //   }.bind(this))
    // }
    

    // 表格最大高度
    var reduceHeight = 70 + 39 + 135
    if (document.body.clientWidth < 1336) {
      reduceHeight = reduceHeight + 38
      // this.tableHeight = document.body.clientHeight - 70 - 39 - 135
    }
    this.tableHeight = document.body.clientHeight - reduceHeight

    // // 测试数据
    // this.valueStart = '2019-05-13T16:00:00'
    // this.valueEnd = '2019-06-11T22:18:44'
    // // // 485
    // // this.deviceSelected = '5cf7b3cce4b02cead8e759d1'
    // // spd
    // this.deviceSelected = '5cf76503e4b007e8e83e6020'
  },
  watch: {
    // 监听屏幕高度改变表格高度
    screenHeight (val) {
      /* 触发dom操作，考虑到函数节流，避免window.onresize()方法频繁触发
      强调一点，window.onresize()方法频繁触发也无所谓，前提是在不操作dom的情况下 */
      if (!this.onresizeTimer) {
        this.resizeDivFun()
        this.onresizeTimer = true
        const that = this
        setTimeout(function () {
          that.onresizeTimer = false
        }, 400)
      }
    },
    // 监控 当前选择设备
    deviceSelected (val) {
      // console.log(val)
      // // 数据流信息
      // var streams = this.deviceListInfo[index].streams
      // var datastreamId = []
      // for (let j = 0; j < streams.length; j++) {
      //   datastreamId[j] = streams[j].streamId
      // }
      // this.param.datastreamId = datastreamId
    }
  },
  mounted () {
    // 复位表格数据
    this.monitorPointData = []
    // 查询网关下监控点信息（重新渲染组件时操作）
    this.backDevInfoQue()


    //  this.getnbhistory()
    // 监听屏幕高度
    const that = this
    window.onresize = () => {
      return (() => {
        that.screenHeight = document.body.clientHeight
        // console.log('that.screenHeight: ' + that.screenHeight)
      })() // 不加最后()会报错，并没有立即执行,立即执行函数
    }
  },
  methods: {
    // dom更新操作函数
    resizeDivFun () {
      // console.log('dom更新操作函数' + new Date())
      var reduceHeight = 70 + 39 + 135
      if (document.body.clientWidth < 1336) {
        reduceHeight = reduceHeight + 38
        // this.tableHeight = document.body.clientHeight - 70 - 39 - 135
      }
      this.tableHeight = document.body.clientHeight - reduceHeight
    },
    // 点击开始查询按键，查询对应时间段内的历史数据
    queryHistoryBt () {
      // // 调试用数据
      // test1 ... 无限数据
      // this.valueStart = '2019-05-01T00:00:00'
      // this.valueEnd = '2019-05-29T16:18:44'
      // this.deviceSelected = '5cecb0bae4b0156dca8bbd35'
      // test2 ... 4页数据 实际查到了 4000+4000+4000+1372()
      // this.valueStart = '2019-04-29T11:14:35'
      // this.valueEnd = '2019-05-03T11:14:35'
      // this.deviceSelected = 'FDFD0001'
      // test3 ...
      // this.valueStart = '2019-05-01T00:00:00'
      // this.valueEnd = '2019-05-04T00:00:00'
      // this.deviceSelected = 'FDFD0105'
      // 表格显示状态---隐藏
      this.tableIsShow = false
      if (this.deviceSelected === '') {
        this.notificationInfo('错误提示：', '请选择设备')
        return
      }
      if (!(this.valueStart && this.valueEnd)) {
        this.notificationInfo('错误提示：', '请选择时间范围')
        return
      }
      if (this.valueStart > this.valueEnd) {
        this.notificationInfo('错误提示：', '开始时间不能大于结束时间')
        return
      }
      var index // 选择框选中设备的index
      // 遍历设备列表，根据mac地址来判断选择的设备是哪个
      for (let i = 0; i < this.deviceListInfo.length; i++) {
        if (this.deviceSelected === this.deviceListInfo[i].name) {
          var sensorListArr = []
          for (var j = 0; j < this.deviceListInfo[i].streams.length; j++) {
            if (this.deviceListInfo[i].streams[j].auth === 1) {
              sensorListArr[sensorListArr.length] = this.deviceListInfo[i].streams[j]
            }
          }
          // 设备对应的传感器名称数组
          this.sensorNameArr = sensorListArr
          console.log(this.deviceListInfo)
          console.log(this.sensorNameArr)
          // 设备在设备列表中的index
          index = this.deviceListInfo[i].index
        }
      }

      // 查到传感器名称之后，excel表格初始化
      var excelTitleStr = '序号' + ',' + '时间' 
      for (var i = 0; i < this.sensorNameArr.length; i++) {
        excelTitleStr += ',' + this.sensorNameArr[i].name
      }
      excelTitleStr += '\n'
      this.excelDataStr = excelTitleStr
      // debugger
      this.param.startTime = this.valueStart
      this.param.endTime = this.valueEnd
      // 页面判断相关变量，cursor数组复位
      this.cursorArr = []
      this.pageTotalNum = [0]
      this.limitData = []
      var valueStart = this.valueStart.replace(/T/, ' ')
      var valueEnd = this.valueEnd.replace(/T/, ' ')
      
      // 根据index，获取对应的设备创建时间
      // * 如果监控点创建时间大于选择开始时间，则param.startTime = 监控点创建时间
      // console.log(this.deviceListInfo)
      // console.log(index)
      this.monitorCreatetime = this.deviceListInfo[index].installTime
      // console.log(this.monitorCreatetime)
      // 时间判断1
      if (this.monitorCreatetime >= valueStart) {
        // 开始时间改为监控点创建时间
        valueStart = this.monitorCreatetime.replace(' ', 'T')
        this.param.startTime = valueStart
      }
      if (this.monitorCreatetime >= valueEnd) {
        this.notificationInfo('提示：', '该时间段内无数据')
        return
      }
      this.loadingFlag = true
      this.dataListView = true
      // 数据流信息
      var streams = this.deviceListInfo[index].streams
      var datastreamId = []
      for (let j = 0; j < streams.length; j++) {
        datastreamId[j] = streams[j].streamId
      }
      this.param.datastreamId = datastreamId
      this.param.condition = this.nbcondition
      // onenet查询数据 or 下载数据
      if (!this.isDownLoad) {
        // ...查询数据
        this.loadingText = '拼命加载中'
        // onenet查询近期最多limit个历史数据---初始查询
        if (sessionGetStore('isnb') ==='true') {
            this.getnbhistory()
        } else {
          this.onenetOneHistoryQuery()
        }
        
      } else {
        // ...下载数据...只允许下载一个月数据
        let dataLimit = 30 * 24 * 60 * 60 * 1000
        if (new Date(this.valueEnd).getTime() - new Date(this.valueStart).getTime() >= dataLimit) {
          this.notificationInfo('提示：', '最多只允许下载30天数据')
          this.isDownLoad = false
          return
        }
        this.loadingText = '拼命加载中...'
        let deviceName
        deviceName = this.deviceListInfo[index].name
        
        if (sessionGetStore('isnb') ==='true') {
          this.getnbhistory1(deviceName)
        } else {
          this.onenetOneHistoryQueryAll(deviceName)
        }
      }
    },
    // 查询nb设备

    getnbhistory () {
      var obj = {
        condition: this.nbcondition,
        size: 50,
        page: 1,
        start: this.valueStart.replace('T', ' '),
        end: this.valueEnd.replace('T', ' ')
      }
      console.log(obj)
      back.nbhistory(obj).then(function (response) {
       
        this.loadingFlag = false
        if (response.errno == 0) {
          if ( !Array.isArray(response.data.record) || response.data.record.length < 0) {
             this.notificationInfo('错误提示', '暂无数据')
             return
          }
          let arr = []
          response.data.record.map((item, index) => {
            let obj = {}
            obj.time = item.time
            obj.number = index + 1
            item.datas.map(v => {
              obj[`value${v.streamId}`] = v.value
            })
            arr.push(obj)
          })
          this.monitorPointData = arr
          this.sensorNameArr = this.sensorNameArr1
          this.tableIsShow = true
         
          console.log(arr)
        } else {
          this.notificationInfo('错误提示', response.error)
        }
      }.bind(this))
    },
    getnbhistory1 (name) {
      var obj = {
        condition: this.nbcondition,
        size: 50,
        page: 1,
        start: this.valueStart.replace('T', ' '),
        end: this.valueEnd.replace('T', ' ')
      }
      console.log(obj)
      back.nbhistory(obj).then(function (response) {
       
        this.loadingFlag = false
        if (response.errno == 0) {
          if ( !Array.isArray(response.data.record) || response.data.record.length < 1 ) {
            this.notificationInfo('错误提示', '暂无数据')
            return
          }
          let arr = []
          response.data.record.map((item, index) => {
            let obj = {}
            obj.time = item.time
            obj.number = index + 1
            item.datas.map(v => {
              obj[`value${v.streamId}`] = v.value
            })
            arr.push(obj)
          })
       
          let a = JSON.parse(JSON.stringify(this.sensorNameArr1))
          a.unshift({prop:'number', name: '序号'}, {prop: 'time', name: '时间'})
          export2Excel(a, arr, name)
          this.isDownLoad = false
          console.log(arr)
        } else {
          this.notificationInfo('错误提示', response.error)
        }
      }.bind(this))
    },
    // 上一页触发按钮 不请求数据而是调用缓存已查询数据
    pageUpBtn: function () {
      // console.log('上一页')
      this.pageDownOrUp = false
      // 点击上一页 页码就减1
      this.pageCurNum -= 1
      this.pageDataNum -= 1
      // 综合判断
      // ...判断是否加载到第一页数据
      if (this.pageCurNum === 0) {
        this.notificationInfo('提示：', '已经到第一页数据了!!!')
        this.pageCurNum += 1
        this.pageDataNum += 1
        return
      }
      // ...判断上一页是back 还是 cache
      let pageUpCompare = this.pageRightNum + this.pageLeftNum - 5 // 因右边已经定位好了，所以右边 - '5'即可
      if (this.pageCurNum <= pageUpCompare) {
        // back
        if (this.cursorArr[this.pageCurNum - 1 - 1] !== undefined && this.pageCurNum >= 1) {
          // console.log('上一页back平常')
          this.loadingFlag = true
          this.onenetNextHistoryQuery(this.cursorArr[this.pageCurNum - 1 - 1])
        } else if (this.cursorArr[this.pageCurNum - 1 - 1] === undefined) {
          // 回滚之后到第一页时，因为没有最初的cursor，所以相当于点击开始查询按钮
          // console.log('上一页back第一页')
          this.loadingFlag = true
          this.onenetNoCursorHisQue()
        }
      } else if (this.pageCurNum > pageUpCompare) {
        // cache
        // console.log('上一页cache')
        this.loadingFlag = true
        this.fillSomeData()
      }
      this.$refs.table.bodyWrapper.scrollTop = 0
    },
    // 下一页触发按钮 判断是否请求数据还是调用缓存已查询数据
    pageDownBtn: function () {
      // console.log('下一页')
      this.pageDownOrUp = true
      // 点击下一页 页码就加1
      this.pageCurNum += 1
      this.pageDataNum += 1
      // 综合判断
      // ...判断是否加载到最后一页数据
      if (this.cursorArr[this.pageCurNum - 1 - 1] === undefined) {
        this.notificationInfo('提示：', '数据只有这么多了!!!')
        this.pageCurNum -= 1
        this.pageDataNum -= 1
        return
      }
      // ...判断下一页是back 还是 cache
      let pageNextCompare = null
      // if (this.pageLeftNum === 1) {
      //   // 若未发生左移
      //   pageNextCompare = this.pageDownBackNum
      // } else {
      //   // 发生左移
      //   pageNextCompare = this.pageRightNum + this.pageLeftNum
      // }
      pageNextCompare = this.pageRightNum + this.pageLeftNum
      if (this.pageCurNum > pageNextCompare) {
        // back
        if (this.cursorArr[this.pageCurNum - 1 - 1] !== undefined) {
          // console.log('下一页back')
          this.loadingFlag = true
          this.onenetNextHistoryQuery(this.cursorArr[this.pageCurNum - 1 - 1])
        }
      } else if (this.pageCurNum <= pageNextCompare) {
        // cache
        // console.log('下一页调cache')
        this.loadingFlag = true
        this.fillSomeData()
      }
      this.$refs.table.bodyWrapper.scrollTop = 0
    },
    // 开始时间选择改变，获取时间信息
    getStartTime: function (datetime) {
      this.valueStart = datetime
    },
    // 结束时间选择改变，获取时间信息
    getEndTime: function (datetime) {
      this.valueEnd = datetime
    },
    // 点击数据列表按钮
    dataListBtn () {
      this.dataListView = true
      this.downloadShow = true
      this.isTable = true
    },
    // 打开数据图表部分内容，加载图表信息
    // * autuo项目只查询一次onenet数据保存到组件中，点击曲线按钮切换显示，而不是再次查询数据
    // * 钻诺一一写的是分两次查询，这样太占用带宽了，尽管用户体验较好(仅仅是切换显示效果，而不是速度效果)
    dataChartBtn () {
      this.dataListView = false
      this.downloadShow = false
      this.isTable = false
      // 使用$nextTick函数避免dom异步更新。由于dom发生更新变化，同步获得不到dom节点，所以要等待dom更新完成后回调函数
      this.$nextTick(function () {
        let chartBox = document.getElementsByClassName('chartview')[0]
        // 用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        // * 开始点击第一次进来窗口大小自适应
        var resizechartviewContainer = function () {
          chartBox.style.height = document.body.clientHeight - 240 + 'px'
        }
        resizechartviewContainer()
        this.loaddiagram()
      })
    },
    // 合并历史数据数组---没值的补值
    mergeArrfunc (resData) {
      // 合并的时间数组
      let timeMergeArr = []
      // 合并的数据数组
      let mergeDataArr = []
      // 按照时间排出时间数组
      for (let i = 0; i < resData.length; i++) {
        let datapoints = resData[i].datapoints
        for (let j = 0; j < datapoints.length; j++) {
          // 没有才添加
          if (timeMergeArr.indexOf(datapoints[j].at) === -1) {
            timeMergeArr.push(datapoints[j].at)
          }
        }
      }
      timeMergeArr.sort((a, b) => {
        return a > b ? 1 : -1
      })
      // console.log(timeMergeArr)
      // 遍历时间数组---数据初始化（每个元素对象的格式定好，监控点属性值初设为0）
      for (let i = 0; i < timeMergeArr.length; i++) {
        let obj = {}
        obj.time = timeMergeArr[i]
        obj.number = i + 1
        for (let j = 0; j < resData.length; j++) {
          for (let z = 0; z < resData[j].datapoints.length; z++) {
            obj['CH' + j] = -9421
          }
        }
        mergeDataArr.push(obj)
      }
       console.log(resData)
      console.log(mergeDataArr)
      // 数值赋值
      // 遍历外层大数组的每个监控点
      for (let h = 0; h < resData.length; h++) {
        let coefficient = 1
        for (let m = 0; m < this.sensorNameArr.length; m++) {
          if (resData[h].id === this.sensorNameArr[m].streamId && this.sensorNameArr[m].coefficient!==undefined) {
            coefficient = this.sensorNameArr[m].coefficient
          }
        }
        // 遍历数据初始化的数组
        for (let i = 0; i < mergeDataArr.length; i++) {
          // 遍历外层大数组的每个监控点的每个历史信息
          for (let j = 0; j < resData[h].datapoints.length; j++) {
            // 先修改每个时间点本身有的值
            if (mergeDataArr[i].time === resData[h].datapoints[j].at) {
              // console.log('1')
              mergeDataArr[i]['CH' + h] = resData[h].datapoints[j].value*coefficient
            }
          }
          // 补值操作
          if (mergeDataArr[i]['CH' + h] === -9421) {
            // 如果数据数组中，某个监控点没有数据
            if (i === 0) {
              // 如果是第1行数据---每个值都取各自监控点的第1条数据的值
              mergeDataArr[0]['CH' + h] = resData[h].datapoints[0].value*coefficient
            } else {
              // 每个值都取各自监控点的上1条数据的值
              mergeDataArr[i]['CH' + h] = mergeDataArr[i - 1]['CH' + h]
            }
          }
        }
      }
      // console.log(mergeDataArr)
      return mergeDataArr
    },
    /*
    ** ************* API调用相关函数 *************
    */
    // *************   back   **************
    // 后台查询网关下监控点列表信息
    backDevInfoQue: function () {
      back.relatioMonitorPoint(this.param).then(function (response) {
        // console.log('网关下设备列表信息')
        // console.log(response)
        let deviceListdata = []
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.name = response.data[i].name
            obj.slaveAddress = response.data[i].slaveAddress
            obj.collectorId = response.data[i].collectorId
            obj.location = response.data[i].location
            obj.installTime = response.data[i].installTime
            obj.mac = response.data[i].mac
            obj.streams = response.data[i].streams
            obj.online = response.data[i].online
            obj.index = i
            deviceListdata[i] = obj
          }
        }
        this.deviceListInfo = deviceListdata
      }.bind(this))
    },
    querySearch(queryString, cb) {
        var restaurants = this.deviceListInfo;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      handleSelect(item) {
        console.log(item)
        this.deviceSelected = item.name
        this.nbcondition = item.mac
      },
    
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
        };
      },
    // *************   onenet   **************
    // onenet查询近期最多limit个历史数据
    onenetOneHistoryQuery: function () {
      this.monitorPointData = []  // 表格实际数据
      // 查询历史数据---第1次查询
      onenet.onenetStartOneHisQue(this.param).then(function (response) {
        // console.log('onenet查询近期最多limit个历史数据')
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          return
        }
      
        // cursor存储
        if (response.data.cursor !== undefined) this.cursorArr.push(response.data.cursor)
        // 页面变量初始化  已查到一页数据后才会初始化。
        this.pageCurNum = 1
        this.pageDataNum = 1
        this.pageDownBackNum = 1
        this.pageLeftNum = 0
        this.pageRightNum = 1
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')
        
        // 合并历史数据数组---没值的补值
        var limitDataArr = this.mergeArrfunc(response.data.datastreams)
        // 记录当前页的数据条数
        this.pageTotalNum.push(limitDataArr.length)
        // 在limitData数组中添加
        this.limitData.push(limitDataArr)

        // console.log(this.limitData)
        // 只查询一次进行this.limitData迁移到表格MointerPointerData中展示
        // * 目的是为了调用之前的程序，因为之前程序是基于limitData的
        this.fillSomeData()
        this.loadingFlag = false
        this.dataListView ? this.downloadShow = true : this.downloadShow = false
        // console.log(response.data.count)
        response.data.count !== 0 ? this.pageControlBtnShow = true : this.pageControlBtnShow = false
        this.$refs.table.bodyWrapper.scrollTop = 0
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // onenet查询近期最多limit个历史数据,从cursor开始
    onenetNextHistoryQuery: function (cursor) {
      this.param.cursor = cursor
      onenet.onenetStartNextHisQue(this.param).then(function (response) {
        // console.log('onenet查询近期最多limit个历史数据,从cursor开始')
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          return
        }
      
        // cursor存储
        // ...1.下一页查询 2.cursor不重复 3.response.data.cursor有值 => push新cursor到cursorArr数组中去
        if (this.pageDownOrUp && response.data.cursor !== undefined && this.pageCurNum > this.pageDownBackNum) {
          this.cursorArr.push(response.data.cursor)
        }
        // 页面变量初始化, 注意这一切都是基于已经发生onenet请求情况下
        // ...判断下一页or上一页
        if (this.pageDownOrUp)  {
          // ...下一页
          this.pageRightNum++
          /* 页面回滚时，curNum小于backNum，点击下一页是调cache而不应是back.
          所以应判断当前页大于请求页时，才pageBackNum+1 */
          if (this.pageCurNum > this.pageDownBackNum) this.pageDownBackNum++
        } else {
          // ...上一页
          this.pageLeftNum--
        }
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')

        // 合并历史数据数组---没值的补值
        var limitDataArr = this.mergeArrfunc(response.data.datastreams)

        // 判断是否包含 去头添尾或者添头去尾 的操作
        if (this.limitData.length < 5) {
          // 不包含
          this.limitData.push(limitDataArr)
        } else {
          // 包含
          // ...判断是去头还是去尾
          if (this.pageDownOrUp) {
            // 去头填尾
            this.limitData.splice(0, 1) // 去头：在开头减去1项
            this.limitData.push(limitDataArr) // 添尾：在最后增加1项
          } else {
            // 去尾添头
            this.limitData.splice(4, 1) // 去尾：在最后减去1项
            this.limitData.unshift(limitDataArr) // 添头：在开头增加1项
          }
        }

        // 判断是否记录页数
        if (this.pageCurNum >= this.pageTotalNum.length) {
          // 记录当前页的数据条数
          this.pageTotalNum.push(limitDataArr.length)
        }
        
        // 只查询一次进行this.limitData迁移到表格MointerPointerData中展示
        // *目的是为了调用之前的程序，因为之前程序是基于limitData的
        this.fillSomeData()
        this.loadingFlag = false
        this.dataListView ? this.downloadShow = true : this.downloadShow = false
        this.pageControlBtnShow = true
        this.$refs.table.bodyWrapper.scrollTop = 0
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // 回滚之后到第一页时，因为没有最初的cursor，所以相当于点击开始查询按钮
    onenetNoCursorHisQue: function () {
      // 查询历史数据---第1次查询
      onenet.onenetStartOneHisQue(this.param).then(function (response) {
        // console.log('回滚之后到第一页时，因为没有最初的cursor，所以相当于点击开始查询按钮')
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          return
        }
      
        // 页面变量初始化
        this.pageLeftNum--
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')
        
        // 合并历史数据数组---没值的补值
        var limitDataArr = this.mergeArrfunc(response.data.datastreams)
       
        // 判断是否包含 去头添尾或者添头去尾 的操作
        if (this.limitData.length < 5) {
          // 不包含
          this.limitData.push(limitDataArr)
        } else {
          // 包含
          // ...判断是去头还是去尾
          if (this.pageDownOrUp) {
            // 去头填尾
            this.limitData.splice(0, 1) // 去头：在开头减去1项
            this.limitData.push(limitDataArr) // 添尾：在最后增加1项
          } else {
            // 去尾添头
            this.limitData.splice(4, 1) // 去尾：在最后减去1项
            this.limitData.unshift(limitDataArr) // 添头：在开头增加1项
          }
        }
    
        // 判断是否记录页数
        if (this.pageCurNum >= this.pageTotalNum.length) {
          // 记录当前页的数据条数
          this.pageTotalNum.push(limitDataArr.length)
        }
        
        // 只查询一次进行this.limitData迁移到表格MointerPointerData中展示
        // *目的是为了调用之前的程序，因为之前程序是基于limitData的
        this.fillSomeData()
        this.loadingFlag = false
        this.dataListView ? this.downloadShow = true : this.downloadShow = false
        this.pageControlBtnShow = true
        this.$refs.table.bodyWrapper.scrollTop = 0
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // 从查询到的近期最多limit个历史数据中筛选所选时间段内的数据
    fillSomeData: function () {
      // 表格显示状态---显示
      this.tableIsShow = true
      let length = this.limitData.length
      if (length === 0) return
      
      // limitData: 所请求之后的并且筛选时间范围之后所有的数据 最多存5页数据
      // data：筛选后的limitData再slice切成最新根据cursor查找的数组，最新一次请求的数据
      // monitorPointData: 当前页数据
      // this.pageDataNum 为实际计算变量，当前页大于5则为5，当前页小于1则为1
      if (this.pageDataNum > 5) {
        this.pageDataNum = 5
      } else if (this.pageDataNum < 1) {
        this.pageDataNum = 1
      } else {
        this.pageDataNum = this.pageDataNum
      }
      // console.log(this.pageTotalNum)
      // pageCurNum
      let data = this.limitData[this.pageDataNum - 1]
     
      // 转化序号，因为this.limitdata保存的最多是[0,999... 4000,4999]
      var baseNum = 0
      for (let i = 0; i < this.pageCurNum; i++) {
        baseNum += this.pageTotalNum[i]
      }
      for (let i = 0; i < data.length; i++) {
        data[i].number = baseNum + i + 1
      }
      this.monitorPointData = data
      console.log(this.monitorPointData)  
      // 对应的折线图也实现相应功能
      if (!this.dataListView) {
        this.dataChartBtn()
      }
      this.loadingFlag = false
    },
    /* 
      ****** 导出表格查询所有数据 *********
    */
    // onenet查询近期最多limit个历史数据
    onenetOneHistoryQueryAll: function (deviceName) {
      // 查询历史数据---第1次查询
      onenet.onenetStartOneHisQue(this.param).then(function (response) {
        // console.log('onenet查询近期最多limit个历史数据')
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          return
        }
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')
        
        // 合并历史数据数组---没值的补值
        var limitDataArr = this.mergeArrfunc(response.data.datastreams)
        this.limitDataCur = limitDataArr
        
        // 只查询一次进行this.limitData迁移到表格MointerPointerData中展示
        // * 目的是为了调用之前的程序，因为之前程序是基于limitData的
        this.fillSomeDataAll()
        // 若第一次查询数据时间点已经大于结束日期，则不进行下次查询
        let valueEnd = this.valueEnd.replace(/T/, ' ')
        for (let i = 0; i < response.data.datastreams.length; i++) {
          for (let j = 0; j < response.data.datastreams[i].datapoints.length; j++) {
            if (response.data.datastreams[i].datapoints[j].at >= valueEnd) {
              this.loadingFlag = false
              this.toLargerCSV(deviceName)
              return
            }
          }
        }
        // 若第一次查询数据返回参数没有cursor，则表示没有数据，即不再进行下次查询
        if (response.data.cursor !== undefined) {
          this.onenetNextHistoryQueryAll(response.data.cursor, deviceName)
        } else {
          this.loadingFlag = false
          this.toLargerCSV(deviceName)
        }
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // onenet查询近期最多limit个历史数据,从cursor开始
    onenetNextHistoryQueryAll: function (cursor, deviceName) {
      this.param.cursor = cursor
      onenet.onenetStartNextHisQue(this.param).then(function (response) {
        // console.log('onenet查询近期最多limit个历史数据,从cursor开始')
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          this.toLargerCSV(deviceName)
          return
        }
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')
        
        // 合并历史数据数组---没值的补值
        var limitDataArr = this.mergeArrfunc(response.data.datastreams)
        this.limitDataCur = limitDataArr

        // 只查询一次进行this.limitData迁移到表格MointerPointerData中展示
        // *目的是为了调用之前的程序，因为之前程序是基于limitData的
        this.fillSomeDataAll()
        // 若第一次查询数据时间点已经大于结束日期，则不进行下次查询
        let valueEnd = this.valueEnd.replace(/T/, ' ')
        for (let i = 0; i < response.data.datastreams.length; i++) {
          for (let j = 0; j < response.data.datastreams[i].datapoints.length; j++) {
            if (response.data.datastreams[i].datapoints[j].at >= valueEnd) {
              this.loadingFlag = false
              this.toLargerCSV(deviceName)
              return
            }
          }
        }
        // 若第一次查询数据返回参数没有cursor，则表示没有数据，即不再进行下次查询
        if (response.data.cursor !== undefined) {
          this.onenetNextHistoryQueryAll(response.data.cursor, deviceName)
        } else {
          this.loadingFlag = false
          this.toLargerCSV(deviceName)
        }
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // 从查询到的近期最多limit个历史数据中筛选所选时间段内的数据
    fillSomeDataAll: function () {
      // console.log('fillSomeDataAll处理函数 :')
      if (this.limitDataCur.length === 0) return
      var valueStart = this.valueStart.replace(/T/, ' ')
      var valueEnd = this.valueEnd.replace(/T/, ' ')
      if (this.monitorCreatetime > valueEnd) {
        this.limitDataCur = []
      } else {
        if (this.monitorCreatetime >= valueStart) {
          valueStart = this.monitorCreatetime
        }
        if (this.limitDataCur[0].time > valueEnd) {
          this.limitDataCur = []
        } else {
          if (this.limitDataCur[0].time >= valueStart) {
            this.limitDataCur = this.limitDataCur.filter(function (item, index, array) {
              return (item.time <= valueEnd)
            })
          } else if (this.limitDataCur[0].time < valueStart) {
            this.limitDataCur = this.limitDataCur.filter(function (item, index, array) {
              return ((item.time >= valueStart) && (item.time <= valueEnd))
            })
          }
        }
      }
      // console.log('this.excelDataStr : ' + this.excelDataStr)
      // console.log('this.limitDataCur : ')
      // console.log(this.limitDataCur)
      // console.log('this.limitDataCurLengthOld : ' + this.limitDataCurLengthOld)
      // debugger
      let queTime = this.valueStart + ' 至 ' + this.limitDataCur[this.limitDataCur.length - 1].time.replace(' ', 'T') 
      let queNum = this.limitDataCur.length + this.limitDataCurLengthOld
      let queText = '当前已查询 ' + queTime + ' 时间段，共 ' + queNum + ' 条数据'
      this.loadingText = queText
      
      for (let i = 0; i < this.limitDataCur.length; i++) {
        this.excelDataStr += (this.limitDataCurLengthOld + i).toString() + ',' + this.limitDataCur[i].time.replace(' ', 'T')
        for (var j = 0; j < this.sensorNameArr.length; j++) {
          this.excelDataStr += ',' + this.limitDataCur[i]['CH' + j].toString()
        }
        this.excelDataStr +=  ',\n'
      }
      this.limitDataCurLengthOld += this.limitDataCur.length
    },
    // 存储折线图数据,绘制图表
    loaddiagram: function () {
      var xData = []
      var yData = []
      for (var a = 0; a < this.sensorNameArr.length; a++) {
        yData[a] = []
      } 
      // var yData1 = []
      // var yData2 = []
      // var yData3 = []
      // var yData4 = []
      if (sessionGetStore('isnb') ==='true') {
        for (let i = 0; i < this.monitorPointData.length; i++) {
          xData[i] = this.monitorPointData[i].time
          for (var j = 0; j < this.sensorNameArr.length; j++) {
            yData[j][i] = this.monitorPointData[i][`value${j+1}`]
          }
        }
      } else {
        for (let i = 0; i < this.monitorPointData.length; i++) {
          xData[i] = this.monitorPointData[i].time
          for (var j = 0; j < this.sensorNameArr.length; j++) {
            yData[j][i] = this.monitorPointData[i]['CH' + j]
          }
        }
      }
      // debugger
      // var _this = this
      // 折线图表高宽度自适应
      let chartBox = document.getElementsByClassName('chartview')[0]
      var resizechartviewContainer = function () {
        chartBox.style.height = document.body.clientHeight - 240 + 'px'
      }
      let diagram = this.$echarts.init(document.getElementById('diagram'))

      var seriesArr = []
      for (var k = 0; k < yData.length; k++) {
        seriesArr[k] = {
          name: this.sensorNameArr[k].name,
          type: 'line',
          smooth: true,
          data: yData[k]
        }
      }
      // 绘制图表
      diagram.setOption({
        color: [
          '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF', '#FF99FF', '#FF9900', '#FFFFCC', '#669900', '#CCFFFF', '#33CCFF', '#CC0099'
        ],
        
        tooltip: { // 提示框(鼠标悬浮)
          trigger: 'axis',
          axisPointer: { // 鼠标移动显示双轴坐标值
            type: 'cross'
          },
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          },
          extraCssText: 'width: 170px'
        },
        grid: { // 绘图网格
          show: true,
          left: '10%',
          right: '10%',
          bottom: '15%',
          background: '#ed1d1d'
        }, 
        dataZoom: [ // 区域缩放
          {
            type: 'slider', // 滑动条调节
            start: 0,
            end: 100
          },
          {
            type: 'inside', // 鼠标缩放
            start: 0,
            end: 100
          }
        ],
        xAxis: [ // x轴坐标显示
          {
            type: 'category',
            splitNumber: 10,
            data: xData,
            axisLabel: {
              formatter: function (value, idx) {
                var date = new Date(value)
                return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-')
              },
              color: '#F4F5F5'
            },
            // 设置轴线的属性
            axisLine: {
              lineStyle: {
                color: '#08C9DA'
              }
            },
            // 网格样式
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#08C9DA'],
                width: 1,
                type: 'solid'
              }
            },
            textStyle: {
              fontSize: 15,
              color: '#fff'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#F4F5F5'
            },
            // 设置轴线的属性
            axisLine: {
              lineStyle: {
                color: '#08C9DA'
              }
            },
            // 网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#08C9DA'],
                width: 1,
                type: 'solid'
              }
            }
          }
        ], // y轴坐标显示
        series: seriesArr
      })
      // chart自适应高度和宽度
      // ...window.onresize为实时监听事件，外部函数不执行，window.onresize也会执行，
      // ...但是同意页面只能有一处window.onresize
      window.onresize = function () {
        // 重置容器高，自己写一个自定义自适应外部容器高度
        resizechartviewContainer()
        // 重置容器宽，echarts自带resize()方法，
        // ...但相当于只能自适应宽度，
        // ...因为外部容器高度没有自适应，所以要自己再写一个外部容器自适应
        diagram.resize()
      }
    },
    /* 
      ****** excel表格模块 ******
    */
    // 下载excel表格
    download () {
      // console.log('下载表格')
      this.isDownLoad = true
      // 查询所选时间点所有数据，全部导出
      // console.log('开始时间：' + new Date())
      this.queryHistoryBt()
    },
    // 支持大批量数据导出，目前测试15万行 30列通过，导出时间约为6秒
    toLargerCSV: function (deviceName) {
      // CSV格式可以自己设定，适用MySQL导入或者excel打开。
      // 由于Excel单元格对于数字只支持15位，且首位为0会舍弃 建议用 =“数值”
      let blob = new Blob([this.excelDataStr], {type: 'text/plain;charset=utf-8'})
      // 解决中文乱码问题
      blob =  new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type})  
      let objectUrl = window.URL.createObjectURL(blob)
      var link = document.createElement('a')
      link.href = objectUrl
      link.download = deviceName === undefined ? '历史数据.csv' : deviceName + '.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      // 每一次下载表格之后，对this.excelDataStr / this.limitDataCurLengthOld / this.isDownLoad复位操作
      // window.open(objectUrl, 'newwindow', 'height=100, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      // debugger
      var excelTitleStr = '序号' + ',' + '时间' 
      for (var i = 0; i < this.sensorNameArr.length; i++) {
        excelTitleStr += ',' + this.sensorNameArr[i].name
      }
      excelTitleStr += '\n'
      this.excelDataStr = excelTitleStr
      
      this.limitDataCurLengthOld = 0
      this.isDownLoad = false
      // console.log('导出结束时间：' + new Date())
    },
    // 数组对象方法排序
    sortByKey: function (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
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
.history {
  width: 100%;
  height: 100%;
  bottom: 0;
  /* overflow-x: hidden;
  overflow-y: hidden; */
}
.history_search{
  color: #fff;
  position: relative;
  width: 100%;
  padding-bottom: 20px;
  padding-top: 20px;
}
.history_search .jkd_chose_box{
  position: absolute;
  top: -40px;
  right: 0;
}
.history_search .date_chose_box{
  float: left;
  width: 540px;
}
.history_search .date_chose_box .date_chose, .history_search .search_btn, .history_search .txxz_box, .history_search .export_table_btn, .history_search .page_table {
  float: left;
  margin-right: 20px;
}
.history_search .date_chose_box, .history_search .search_btn, .history_search .txxz_box, .history_search .export_table_btn, .history_search .page_table {
  margin-top: 10px;
}
 .history_search .page_table {
   margin-left: 20px;
   margin-right: 40px;
 }
.history_search .date_chose .el-date-editor{
  margin-left: 10px;
}
/* .history_search .date_chose_box .date_chose{
}
.history_search .search_btn{
}
.history_search .txxz_box{
}
.history_search .export_table_btn{
} */
.chartview{
  background: url(/static/bg_echarts1.png) no-repeat;
  background-size: 100% 100%;
}
#diagram {
  margin: 0 auto;
  width: 100%;
  height: 98%;
  min-height: 200px;
}
.span-top {
  padding-top: 10px;
}
.history >>> .tableIcon {
  background-color: #08C9DA;
}
.history >>> .lineIcon {
  background-color: #ccc;
  border-color: #ccc;
}
/* 表格loading样式 */
.history >>> .el-loading-spinner {
  top: 50px;
}
</style>
<style>
.jkd_chose .el-input__inner{
  background-color: #073846;
  border: transparent;
  color: #fff;
}
.jkd_chose .el-cascader__label{
  color: #fff;
}
.date_chose_box .date_chose .el-input__inner{
  background-color: #073846;
  color: #fff;
  border: transparent;
}
.jkd_chose .el-select:hover .el-input__inner {
  color: #fff;
}
</style>
