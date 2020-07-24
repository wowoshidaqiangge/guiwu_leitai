<!-- 首页配置界面 -->
<template>
  <div id="indexSet">
    <div class="top">
      <div class="title">首页模块配置</div>
    </div>
    <div class="botm">
      <div class="title_box title_box1">
        <div class="title_text">左侧区域</div>
         <el-button class="btn_submit" size="small" type="primary" @click="submitFunc">确定</el-button>
      </div>
      <div class="title_box title_box2">
        <div class="title_text">右侧区域</div>
      </div>
      <div class="title_box title_box3">
        <div class="title_text">地图下方区域</div>
      </div>
      <div class="content_box">
        <div class="content_main">
          <div class="set_box" v-for="(moduleItem, moduleIndex) in moduleList" :key="moduleIndex">
            <div class="module_index">模块{{moduleIndex + 1}}</div>
            <div class="item_set">
              <span class="sp_left_item">模块内容：</span>
              <el-select v-model="moduleItem.contentType" class="form_right_item" size="small" placeholder="请选择模块内容">
                <el-option
                  v-for="(item, index) in allModular"
                  :key="index"
                  :label="item.label"
                  :disabled="item.disabled"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="item_set">
              <span class="sp_left_item">模块名称：</span>
              <el-input class="form_right_item" v-model="moduleItem.title" size="small" placeholder="请输入模块名称"></el-input>
            </div>
            <div class="item_set">
              <span class="sp_left_item">图表类型：</span>
              <el-select v-model="moduleItem.echartsType" class="form_right_item" size="small" placeholder="请选择图表类型">
                <el-option
                  v-for="(item, index) in everyModuleSet[moduleIndex].nowEchartsAllType"
                  :key="index"
                  :label="item.label"
                  :disabled="item.disabled"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div v-if="everyModuleSet[moduleIndex].deviceChoseShow" class="item_set">
              <span class="sp_left_item">设备选择：</span>
              <el-cascader
                v-model="moduleItem.device"
                :options="everyModuleSet[moduleIndex].nowDeviceList"
                class="form_right_item"
                placeholder="请选择设备"
                size="small"
                @change="cascaderChange"></el-cascader>
            </div>
            <div v-if="everyModuleSet[moduleIndex].timeChoseShow" class="item_set">
              <span class="sp_left_item">时间范围：</span>
              <el-select v-model="moduleItem.time" class="form_right_item" size="small" placeholder="请选择时间范围">
                <el-option
                  v-for="(item, index) in timeType"
                  :key="index"
                  :label="item.label"
                  :disabled="item.disabled"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
// 引入模块配置文件
import allModular from '@/libs/config/allModular.js'

export default {
  data  () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': ''
      },
      // 所有支持模块---选择项
      allModular: [],
      // // 支持选则设备的模块id
      // supportSelectDevice: [],
      // 图表类型---选择项
      allEchartsAllType: {
        // 全部
        all: [
          {
            label: '折线图',
            value: 'line'
          },
          {
            label: '柱状图',
            value: 'bar'
          },
          {
            label: '饼图',
            value: 'pie'
          },
          {
            label: '环形图',
            value: 'annular'
          }
        ],
        // 走势
        trend: [
          {
            label: '折线图',
            value: 'line'
          }
        ],
        // 比例
        proportion: [
          {
            label: '柱状图',
            value: 'bar'
          },
          {
            label: '饼图',
            value: 'pie'
          },
          {
            label: '环形图',
            value: 'annular'
          }
        ],
        // 饼图和环形图
        pieAndAnnular: [
          {
            label: '饼图',
            value: 'pie'
          },
          {
            label: '环形图',
            value: 'annular'
          }
        ]
      },
      // 时间---选择项
      timeType: [
        {
          label: '最近1月',
          value: 30
        },
        {
          label: '最近1周',
          value: 7
        },
        {
          label: '实时',
          value: 0
        }
      ],
      // 获取到的当前首页配置
      currentIndexSet: [],
      // 配置表单
      moduleList: [
        {
          number: 1,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 2,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 3,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 4,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 5,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 6,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 7,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 8,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        }
      ],
      // 空白设置配置
      blankModuleList: [
        {
          number: 1,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 2,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 3,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 4,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 5,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 6,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 7,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        },
        {
          number: 8,
          title: '',
          contentType: '',
          echartsType: '',
          device: '',
          time: ''
        }
      ],
      // 各个模块当前特殊配置
      everyModuleSet: [
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        },
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        },
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        },
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 当前所用设备列表
          nowDeviceList: [],
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        },
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        },
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        },
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        },
        {
          // 当前可以选择的图表类型
          nowEchartsAllType: [],
          // 设备选择---显示状态
          deviceChoseShow: false,
          // 时间选择---显示状态
          timeChoseShow: false
        }
      ],
      // 当前所用设备列表
      currentDeviceList: [],
      // 设备列表
      deviceList: {
        allType: [
          {
            value: 'all',
            label: '全部',
            children: []
          },
          {
            value: 'wangguan1',
            label: '网关1',
            children: [
              {
                value: 'shebei1',
                label: '设备1'
              },
              {
                value: 'shebei2',
                label: '设备2'
              }
            ]
          }
        ],
        allIspd: [
          {
            value: 'all',
            label: '全部',
            children: []
          }
        ],
        allCj485: [
          {
            value: 'all',
            label: '全部',
            children: []
          }
        ],
        tpye: [],
        ispd: [],
        cj485: []
      }
    }
  },
  computed: {
    /** 模块一 */
    // 1、模块内容
    module1ContentType () {
      return this.moduleList[0].contentType
    },
    // 2、图表类型
    module1EChartsType () {
      return this.moduleList[0].echartsType
    },
    /** 模块二 */
    // 1、模块内容
    module2ContentType () {
      return this.moduleList[1].contentType
    },
    // 2、图表类型
    module2EChartsType () {
      return this.moduleList[1].echartsType
    },
    /** 模块三 */
    // 1、模块内容
    module3ContentType () {
      return this.moduleList[2].contentType
    },
    // 2、图表类型
    module3EChartsType () {
      return this.moduleList[2].echartsType
    },
    /** 模块四 */
    // 1、模块内容
    module4ContentType () {
      return this.moduleList[3].contentType
    },
    // 2、图表类型
    module4EChartsType () {
      return this.moduleList[3].echartsType
    },
    /** 模块五 */
    // 1、模块内容
    module5ContentType () {
      return this.moduleList[4].contentType
    },
    // 2、图表类型
    module5EChartsType () {
      return this.moduleList[4].echartsType
    },
    /** 模块六 */
    // 1、模块内容
    module6ContentType () {
      return this.moduleList[5].contentType
    },
    // 2、图表类型
    module6EChartsType () {
      return this.moduleList[5].echartsType
    },
    /** 模块七 */
    // 1、模块内容
    module7ContentType () {
      return this.moduleList[6].contentType
    },
    // 2、图表类型
    module7EChartsType () {
      return this.moduleList[6].echartsType
    },
    /** 模块八 */
    // 1、模块内容
    module8ContentType () {
      return this.moduleList[7].contentType
    },
    // 2、图表类型
    module8EChartsType () {
      return this.moduleList[7].echartsType
    }
  },
  watch: {
    // // 监听 配置表单
    // moduleList: {
    //   handler (value) {
    //     console.log(value)
    //   },
    //   // 深度监听
    //   deep: true
    // }

    // 
    /** 模块一 */
    // 1、模块内容
    module1ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[0].title = this.allModular[index].label
      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[0].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[0].echartsType = this.everyModuleSet[0].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[0].timeChoseShow = this.moduleList[0].echartsType === 'line'
        this.moduleList[0].time = this.moduleList[0].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[0].timeChoseShow = false
        this.moduleList[0].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[0].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[0].nowDeviceList = this.deviceList.allType
        this.moduleList[0].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[0].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[0].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[0].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[0].device = ''
        if (this.everyModuleSet[0].nowDeviceList.length > 0) {
          if (this.everyModuleSet[0].nowDeviceList[0].children.length > 0) {
            this.moduleList[0].device = [this.everyModuleSet[0].nowDeviceList[0].value, this.everyModuleSet[0].nowDeviceList[0].children[0].value]
          }
        }
      }
      // console.log(this.allModular[index].deviceType)
      // console.log(this.moduleList[0])
    },
    // 2、图表类型
    module1EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[0].timeChoseShow = val === 'line'
      this.moduleList[0].time = val === 'line' ? 7 : ''
    },
    /** 模块二 */
    // 1、模块内容
    module2ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[1].title = this.allModular[index].label

      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[1].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[1].echartsType = this.everyModuleSet[1].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[1].timeChoseShow = this.moduleList[1].echartsType === 'line'
        this.moduleList[1].time = this.moduleList[1].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[1].timeChoseShow = false
        this.moduleList[1].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[1].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[1].nowDeviceList = this.deviceList.allType
        this.moduleList[1].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[1].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[1].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[1].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[1].device = ''
        if (this.everyModuleSet[1].nowDeviceList.length > 0) {
          if (this.everyModuleSet[1].nowDeviceList[0].children.length > 0) {
            this.moduleList[1].device = [this.everyModuleSet[1].nowDeviceList[0].value, this.everyModuleSet[1].nowDeviceList[0].children[0].value]
          }
        }
      }
    },
    // 2、图表类型
    module2EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[1].timeChoseShow = val === 'line'
      this.moduleList[1].time = val === 'line' ? 7 : ''
    },
    /** 模块三 */
    // 1、模块内容
    module3ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[2].title = this.allModular[index].label

      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[2].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[2].echartsType = this.everyModuleSet[2].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[2].timeChoseShow = this.moduleList[2].echartsType === 'line'
        this.moduleList[2].time = this.moduleList[2].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[2].timeChoseShow = false
        this.moduleList[2].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[2].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[2].nowDeviceList = this.deviceList.allType
        this.moduleList[2].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[2].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[2].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[2].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[2].device = ''
        if (this.everyModuleSet[2].nowDeviceList.length > 0) {
          if (this.everyModuleSet[2].nowDeviceList[0].children.length > 0) {
            this.moduleList[2].device = [this.everyModuleSet[2].nowDeviceList[0].value, this.everyModuleSet[2].nowDeviceList[0].children[0].value]
          }
        }
      }
    },
    // 2、图表类型
    module3EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[2].timeChoseShow = val === 'line'
      this.moduleList[2].time = val === 'line' ? 7 : ''
    },
    /** 模块四 */
    // 1、模块内容
    module4ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[3].title = this.allModular[index].label

      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[3].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[3].echartsType = this.everyModuleSet[3].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[3].timeChoseShow = this.moduleList[3].echartsType === 'line'
        this.moduleList[3].time = this.moduleList[3].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[3].timeChoseShow = false
        this.moduleList[3].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[3].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[3].nowDeviceList = this.deviceList.allType
        this.moduleList[3].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[3].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[3].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[3].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[3].device = ''
        if (this.everyModuleSet[3].nowDeviceList.length > 0) {
          if (this.everyModuleSet[3].nowDeviceList[0].children.length > 0) {
            this.moduleList[3].device = [this.everyModuleSet[3].nowDeviceList[0].value, this.everyModuleSet[3].nowDeviceList[0].children[0].value]
          }
        }
      }
    },
    // 2、图表类型
    module4EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[3].timeChoseShow = val === 'line'
      this.moduleList[3].time = val === 'line' ? 7 : ''
    },
    /** 模块五 */
    // 1、模块内容
    module5ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[4].title = this.allModular[index].label

      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[4].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[4].echartsType = this.everyModuleSet[4].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[4].timeChoseShow = this.moduleList[4].echartsType === 'line'
        this.moduleList[4].time = this.moduleList[4].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[4].timeChoseShow = false
        this.moduleList[4].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[4].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[4].nowDeviceList = this.deviceList.allType
        this.moduleList[4].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[4].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[4].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[4].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[4].device = ''
        if (this.everyModuleSet[4].nowDeviceList.length > 0) {
          if (this.everyModuleSet[4].nowDeviceList[0].children.length > 0) {
            this.moduleList[4].device = [this.everyModuleSet[4].nowDeviceList[0].value, this.everyModuleSet[4].nowDeviceList[0].children[0].value]
          }
        }
      }
    },
    // 2、图表类型
    module5EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[4].timeChoseShow = val === 'line'
      this.moduleList[4].time = val === 'line' ? 7 : ''
    },
    /** 模块六 */
    // 1、模块内容
    module6ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[5].title = this.allModular[index].label

      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[5].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[5].echartsType = this.everyModuleSet[5].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[5].timeChoseShow = this.moduleList[5].echartsType === 'line'
        this.moduleList[5].time = this.moduleList[5].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[5].timeChoseShow = false
        this.moduleList[5].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[5].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[5].nowDeviceList = this.deviceList.allType
        this.moduleList[5].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[5].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[5].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[5].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[5].device = ''
        if (this.everyModuleSet[5].nowDeviceList.length > 0) {
          if (this.everyModuleSet[5].nowDeviceList[0].children.length > 0) {
            this.moduleList[5].device = [this.everyModuleSet[5].nowDeviceList[0].value, this.everyModuleSet[5].nowDeviceList[0].children[0].value]
          }
        }
      }
    },
    // 2、图表类型
    module6EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[5].timeChoseShow = val === 'line'
      this.moduleList[5].time = val === 'line' ? 7 : ''
    },
    /** 模块七 */
    // 1、模块内容
    module7ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[6].title = this.allModular[index].label

      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[6].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[6].echartsType = this.everyModuleSet[6].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[6].timeChoseShow = this.moduleList[6].echartsType === 'line'
        this.moduleList[6].time = this.moduleList[6].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[6].timeChoseShow = false
        this.moduleList[6].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[6].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[6].nowDeviceList = this.deviceList.allType
        this.moduleList[6].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[6].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[6].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[6].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[6].device = ''
        if (this.everyModuleSet[6].nowDeviceList.length > 0) {
          if (this.everyModuleSet[6].nowDeviceList[0].children.length > 0) {
            this.moduleList[6].device = [this.everyModuleSet[6].nowDeviceList[0].value, this.everyModuleSet[6].nowDeviceList[0].children[0].value]
          }
        }
      }
    },
    // 2、图表类型
    module7EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[6].timeChoseShow = val === 'line'
      this.moduleList[6].time = val === 'line' ? 7 : ''
    },
    /** 模块八 */
    // 1、模块内容
    module8ContentType (val) {
      console.log(val)
      // 查找当前配置内容的id
      var index = ''
      // var id = ''
      for (var i = 0; i < this.allModular.length; i++) {
        if (val === this.allModular[i].value) {
          index = i 
          // id = this.allModular[i].id
        }
      }
      // console.log(index)
      // 修改当前模块的默认名称
      this.moduleList[7].title = this.allModular[index].label

      // 修改当前模块特殊配置---支持的图表类型
      this.everyModuleSet[7].nowEchartsAllType = this.allEchartsAllType[this.allModular[index].echartsType]
      this.moduleList[7].echartsType = this.everyModuleSet[7].nowEchartsAllType[0].value
      // 修改当前模块特殊配置---选择时间显示状态
      if (this.allModular[index].echartsType === 'trend' || this.allModular[index].echartsType === 'all') {
        // 第1个是折线图
        // 修改当前模块特殊配置---选择时间显示
        this.everyModuleSet[7].timeChoseShow = this.moduleList[7].echartsType === 'line'
        this.moduleList[7].time = this.moduleList[7].echartsType === 'line' ? 7 : ''
      } else {
        // 第1个不是折线图
        // 修改当前模块特殊配置---选择时间不显示
        this.everyModuleSet[7].timeChoseShow = false
        this.moduleList[7].time = ''
      }
      if (this.allModular[index].deviceType === 'noFit') {
        // 修改当前模块特殊配置---选择设备不显示
        this.everyModuleSet[7].deviceChoseShow = false
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[7].nowDeviceList = this.deviceList.allType
        this.moduleList[7].device = ''
        if (index < 3) {
          // 属于设备状态、城市分布、设备类型中的1个
          this.moduleList[7].device = 'all'
        }
      } else if (this.allModular[index].deviceType === '') {
        // 待处理
      } else {
        // 修改当前模块特殊配置---选择设备显示状态
        this.everyModuleSet[7].deviceChoseShow = true
        // 修改当前模块特殊配置---当前所用设备列表
        this.everyModuleSet[7].nowDeviceList = this.deviceList[this.allModular[index].deviceType]
        // 设置选择设备的默认值
        this.moduleList[7].device = ''
        if (this.everyModuleSet[7].nowDeviceList.length > 0) {
          if (this.everyModuleSet[7].nowDeviceList[0].children.length > 0) {
            this.moduleList[7].device = [this.everyModuleSet[7].nowDeviceList[0].value, this.everyModuleSet[7].nowDeviceList[0].children[0].value]
          }
        }
      }
    },
    // 2、图表类型
    module8EChartsType (val) {
      console.log(val)
      // 修改当前模块特殊配置---选择时间显示状态
      this.everyModuleSet[7].timeChoseShow = val === 'line'
      this.moduleList[7].time = val === 'line' ? 7 : ''
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

    // 所有支持模块选择项
    this.allModular = allModular
    // 图表支持类型值---初始化
    for (var i = 0; i < this.everyModuleSet.length; i++) {
      this.everyModuleSet[i].nowEchartsAllType = this.allEchartsAllType.all
    }

    // 获取用户统计模块初始设置
    this.getIndexSettings()
    // 获取账号下网关及设备列表
    this.getAllDeviceInfo()
  },
  // 生命周期钩子--安装期
  mounted: function () {
    
  },
  methods: {
    // // 获取全部模块内容选择项
    // getAllModular () {
    //   axios.get('/static/json/allModular.json')
    //     .then(response => {
    //       console.log(response)
    //       if (response.status === 200) {
    //         // 所有支持模块选择项
    //         this.allModular = response.data
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // },
    // 获取用户统计模块初始设置
    getIndexSettings () {
      back.getIndexModule(this.param).then(function (response) {
        // debugger
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // console.log(response.data)
          // 按照order排序
          response.data.sort(function (a, b) {  
            return a.number - b.number  
          })
          if (response.data.length === 0) {
            // 未设置
            // 设置配置表单---空白配置
            this.moduleList = this.blankModuleList
          } else {
            // 已设置
            // 设置配置表单---当前设置
            var num = 0
            for (var i = 0; i < response.data.length; i++) {
              // response.data
              for (var key in response.data[i]) {
                (function (aThis, i, key) {
                  setTimeout(function () {
                    aThis.moduleList[i][key] = response.data[i][key]
                  }, 100)
                })(this, i, key)
                num++
              }
            }
            console.log(num)
            console.log(this.moduleList)
            // this.moduleList = response.data
          }
          // 获取到的当前首页配置---更新
          this.currentIndexSet = response.data
          // this.currentIndexSet = [{}]
        }
      }.bind(this))
    },
    // 获取账号下网关及设备列表
    getAllDeviceInfo () {
      back.allDeviceInfoGateway(this.param).then(function (response) {
        // console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          var allType = [
            {
              value: 'quanbu',
              label: '全部网关',
              children: [
                {
                  value: 'all',
                  label: '全部'
                }
              ]
            }
          ]
          var allIspd = [
            {
              value: 'quanbu',
              label: '全部网关',
              children: [
                {
                  value: 'all',
                  label: '全部'
                }
              ]
            }
          ]
          var allCj485 = [
            {
              value: 'quanbu',
              label: '全部网关',
              children: [
                {
                  value: 'all',
                  label: '全部'
                }
              ]
            }
          ]
          var tpye = []
          var ispd = []
          var cj485 = []
          // 遍历网关
          for (var i = 0; i < response.data.length; i++) {
            var allTypeObj = {
              value: response.data[i].sn,
              label: response.data[i].name,
              sn: response.data[i].sn,
              children: []
            }
            var allIspdObj = {
              value: response.data[i].sn,
              label: response.data[i].name,
              sn: response.data[i].sn,
              children: []
            }
            var allCj485Obj = {
              value: response.data[i].sn,
              label: response.data[i].name,
              sn: response.data[i].sn,
              children: []
            }
            var tpyeObj = {
              value: response.data[i].sn,
              label: response.data[i].name,
              sn: response.data[i].sn,
              children: []
            }
            var ispdObj = {
              value: response.data[i].sn,
              label: response.data[i].name,
              sn: response.data[i].sn,
              children: []
            }
            var cj485Obj = {
              value: response.data[i].sn,
              label: response.data[i].name,
              sn: response.data[i].sn,
              children: []
            }
            // 遍历设备
            for (var j = 0; j < response.data[i].deviceEtyList.length; j++) {
              allTypeObj.children[allTypeObj.children.length] = {
                value: response.data[i].deviceEtyList[j].mac,
                label: response.data[i].deviceEtyList[j].name,
                mac: response.data[i].deviceEtyList[j].mac
              }
              tpyeObj.children[tpyeObj.children.length] = {
                value: response.data[i].deviceEtyList[j].mac,
                label: response.data[i].deviceEtyList[j].name,
                mac: response.data[i].deviceEtyList[j].mac
              }
              // 暂无设备类型参数
              if (response.data[i].deviceEtyList[j].type === 1) {
                // ispd
                allIspdObj.children[allIspdObj.children.length] = {
                  value: response.data[i].deviceEtyList[j].mac,
                  label: response.data[i].deviceEtyList[j].name,
                  mac: response.data[i].deviceEtyList[j].mac
                }
                ispdObj.children[ispdObj.children.length] = {
                  value: response.data[i].deviceEtyList[j].mac,
                  label: response.data[i].deviceEtyList[j].name,
                  mac: response.data[i].deviceEtyList[j].mac
                }
              } else if (response.data[i].deviceEtyList[j].type === 2) {
                // cj485
                allCj485Obj.children[allCj485Obj.children.length] = {
                  value: response.data[i].deviceEtyList[j].mac,
                  label: response.data[i].deviceEtyList[j].name,
                  mac: response.data[i].deviceEtyList[j].mac
                }
                cj485Obj.children[cj485Obj.children.length] = {
                  value: response.data[i].deviceEtyList[j].mac,
                  label: response.data[i].deviceEtyList[j].name,
                  mac: response.data[i].deviceEtyList[j].mac
                }
              }
            }
            allType[allType.length] = allTypeObj
            allIspd[allIspd.length] = allIspdObj
            allCj485[allCj485.length] = allCj485Obj
            tpye[tpye.length] = tpyeObj
            ispd[ispd.length] = ispdObj
            cj485[cj485.length] = cj485Obj
          }
          // 设备列表---更新
          this.deviceList = {
            allType: allType,
            allIspd: allIspd,
            allCj485: allCj485,
            tpye: tpye,
            ispd: ispd,
            cj485: cj485
          }
          console.log(this.deviceList)
          // 当前所用设备列表---初始化
          this.currentDeviceList = this.deviceList.allType
        }
      }.bind(this))
    },
    // 选择设备 级联选择器发生变化
    cascaderChange (value) {
      console.log(value)
    },
    // 点击确定
    submitFunc () {
      console.log(this.moduleList)
      // 表单验证
      for (var i = 0; i < this.moduleList.length; i++) {
        var item = this.moduleList[i]
        if (item.contentType === '') {
          this.notificationInfo('提示', '请选择模块' + (i + 1) + '的模块内容')
          return
        }
        if (item.title === '') {
          this.notificationInfo('提示', '请填写模块' + (i + 1) + '的模块名称')
          return
        }
        if (item.echartsType === '') {
          this.notificationInfo('提示', '请选择模块' + (i + 1) + '的图表类型')
          return
        }
        if (this.everyModuleSet[i].deviceChoseShow && item.device === '') {
          this.notificationInfo('提示', '此模块没有相关设备，请更换模块')
          return
        }
        if (this.everyModuleSet[i].deviceChoseShow) {
          console.log(i)
          console.log(item.device)
        }
        if (item.device !== '') {
          // 判断是数组还是字符串
          if (Array.isArray(item.device)) {
            // 数组---修改了设备或者初始设置设备
            item.device = item.device[1]
          } else {
            // 字符串---上次设置了设备，这次没修改
            item.device = item.device
          }
        }
      }
     
      this.moduleList.map(it => {
        if (it.contentType === 'electricResistanceUpper') {
          it.time = 0
        }
      })
      console.log(this.moduleList)
      this.param.moduleList = this.moduleList
      // 判断是设置还是修改
      if (this.currentIndexSet.length === 0) {
        // 设置
        console.log('设置')
        // 设置配置
        this.setIndexSettings()
      } else {
        // 修改
        console.log('修改')
        // 修改配置
        this.modifyIndexSettings()
      }
    },
    // 设置配置
    setIndexSettings () {
      back.setIndexModule(this.param).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // console.log(response.data)
          this.notificationInfo('提示', '设置成功')
        }
      }.bind(this))
    },
    // 修改配置
    modifyIndexSettings () {
      back.modifyIndexModule(this.param).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // console.log(response.data)
          this.notificationInfo('提示', '修改成功')
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
<style lang="scss" scoped>
  #indexSet {
    padding: 25px 35px;
    overflow: auto;
  }
  .top{
    height: 50px;
    .title{
      font-size: 18px;
      color: #fff;
      padding-left: 15px;
      line-height: 30px;
      border-left: 2px solid #08C9DA;
      text-align: left;
    }
  }
  .botm{
    position: relative;
    overflow-y: auto;
    .title_box{
      position: absolute;
      left: 0px;
      width: 100%;
      box-sizing: border-box;
      text-align: left;
      padding: 0px 20px;
      .title_text{
        float: left;
        font-size: 16px;
        color: #fff;
        line-height: 40px;
      }
      .btn_submit{
        float: right;
        margin-top: 4px;
      }
    }
    .title_box1 {
      top: 0px;
    }
    .title_box2 {
      top: 390px;
    }
    .title_box3 {
      top: 780px;
    }
    .content_box{
      padding: 50px 20px 0px;
      .content_main{
        padding: 0 1px;
        height: 730px;
        .set_box{
          float: left;
          box-sizing: border-box;
          width: 33.3333%;
          height: 330px;
          border: 1px solid #08C9DA;
          margin-left: -1px;
          margin-bottom: 60px;
          padding-top: 20px;
          position: relative;
          .module_index{
            position: absolute;
            top: 15px;
            left: 0;
            width: 100%;
            font-size: 14px;
            color: #fff;
            line-height: 20px;
            text-align: left;
            box-sizing: border-box;
            padding-left: 30px;
          }
          .item_set{
            margin-top: 20px;
            .sp_left_item{
              display: inline-block;
              width: 90px;
              text-align: right;
              color: #fff;
            }
            .form_right_item{
              display: inline-block;
              width: 200px;
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>
<style>

</style>
