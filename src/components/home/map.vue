<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 08:35:25
 * @LastEditTime: 2019-08-23 09:30:06
 * @LastEditors: Please set LastEditors
 -->
<template>
  <!-- <div> -->
    <el-container class="mapmain">
      <div id="mapPage">
        <div id="allmap">
          <h3>地图显示</h3>
        </div>
        <div id="devicepanel">
          <div id="titleandclose">
            <span id="paneltitle">设备信息</span>
            <span style="float: right; margin: 5px; cursor: default" v-on:click="closepanel">X</span>
          </div>
            <div id="deviceinfo" style="height: 260px">
          </div>
        </div>
      </div>
    </el-container>
  <!-- </div> -->
</template>

<script>
import BMap from 'BMap'
import BMAP_ANCHOR_BOTTOM_RIGHT from 'BMAP_ANCHOR_BOTTOM_RIGHT'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
// import $ from 'jquery'
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import Routers from '@/router'
import Vue from 'vue'
// 引入WebSocket需要的插件
import Stomp from 'stompjs'
// 引入模块报警配置文件
// import modularAlarm from '@/libs/config/modularAlarm.js'

export default {
  data () {
    return {
      // 参数，用于API请求
      param: {

      },
      device: [],     // 存放设备信息，并赋予title,devId,address等属性
      point: [],      // 存放标注点经纬度信息
      marker: [],     // 存放标注点对象
      map: null,
      overlapgroup: [],   // 将经纬度相同的点存放在一个组里
      pointsimplify: [],  // 存放删除了重复点的点数据
      apikey: [],         // 存放不重复的APIKEY值
      timerOnlineMap: 0,
      clickEvent: 0,      // 当前点击显示弹窗序号
      devpanelOnline: [],
      // 当前选择主题样式
      currentMayStyle: 'midnight',
      devicehtml: '',
      // 即时推送
      stompClient: null,
      titlelogo: ''
    }
  },
  created () {
    this.titlelogo = sessionGetStore('logo')
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // 获取用户的地图主题
    this.currentMayStyle = sessionGetStore('userMap')
  },
  mounted () {
    // 获取账号下全部设备信息
    this.getAllDeviceInfo()
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
    // WebSocket相关
    this.stompClient.disconnect(function () {
      // console.log('断开')
    })
  },
  methods: {
    // 获取账号下全部设备信息
    getAllDeviceInfo () {
      back.allDeviceInfo(this.param).then(function (response) {
        // console.log(response)
        let k = 0
        // 遍历数组1
        for (let i = 0; i < response.data.length; i++) {
          let locat = response.data[i].location
          this.point[k] = new BMap.Point(locat.lon, locat.lat)
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
      // 修改地图主题样式
      this.map.setMapStyle({
        style: this.currentMayStyle
      })
      // 左上角，添加默认缩放平移控件
      var topleftnavigation = new BMap.NavigationControl()
      this.map.addControl(topleftnavigation)            // 添加平移缩放控件
      // 左上角添加城市列表控件
      this.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(80, 60)
      }))
      this.setCenterandZoom()
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
      cr.addCopyright({id: 1, content: `<img src=${this.titlelogo} height=30px/>`, bounds: bs})
    },
    // stomp协议数据长连接
    stompLink: function () {
      // this.stompClient = Stomp.client('ws://116.62.155.56:15674/ws')
      this.stompClient = Stomp.client('ws://114.55.67.62:15674/ws') // 测试
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
              for (let i = 0; i < this.overlapgroup.length; i++) {
                for (let j = 0; j < this.overlapgroup[i].length; j++) { 
                  if (resObj.mac === this.overlapgroup[i][j].mac) {
                    // 修改状态
                    this.overlapgroup[i][j].online = resObj.state
                    // 修改图片属性
                    this.overlapgroup[i][j].onlineimg = '/static/icon2Status' + resObj.state + '.png'
                    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
                    this.addmarkerandInfo()
                    // let str = ''
                    // if (resObj.state === 0) {
                    //   str = '已离线'
                    // } else if (resObj.state === 1) {
                    //   str = '已上线'
                    // }
                    // // 提示
                    // this.notificationInfo('提示', '设备' + this.overlapgroup[i][j].title + str)
                  }
                }
              }
            } else if (resObj.type === 'B') {
              // 设备报警推送
              console.log('设备报警推送')
              for (let i = 0; i < this.overlapgroup.length; i++) {
                for (let j = 0; j < this.overlapgroup[i].length; j++) { 
                  if (resObj.mac === this.overlapgroup[i][j].mac) {
                    // 修改状态
                    this.overlapgroup[i][j].online = 2
                    // 修改图片属性
                    this.overlapgroup[i][j].onlineimg = '/static/icon2Status2.png'
                    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
                    this.addmarkerandInfo()
                    // let str = '设备' + this.overlapgroup[i][j].title
                    // str += '出现' + modularAlarm.warnType[resObj.warnType] + ','
                    // str += '报警内容为' + resObj.content
                    // // 提示
                    // this.notificationInfo('提示', str)
                  }
                }
              }
            } else if (resObj.type === 'C') {
              // 网关上下线
              console.log('网关上下线')
              // 获取账号下全部设备信息
              this.getAllDeviceInfo()
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
    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
    addmarkerandInfo: function () {
      this.map.clearOverlays()
      // 简化添加标注点和标签
      for (let i = 0; i < this.overlapgroup.length; i++) {
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
          this.devicehtml = '<div class="class2"><span class="class1" style="width:90px">编号</span><span class="class1" style="width:90px">名称</span>' +
          '<span class="class1" style="width:90px">ID</span><span class="class1" style="width:90px">状态</span><span class="class1" style="width:90px">地址</span>' +
          '<span class="class1" style="width:20px"></span></div>'
          document.getElementById('deviceinfo').innerHTML = this.devicehtml
          this.devpanelOnline = []
          for (let k = 0; k < this.overlapgroup[i].length; k++) {
            this.devpanelOnline.push(this.overlapgroup[i][k].online)
            var csObjJSON = JSON.stringify(this.overlapgroup[i][k]).replace(/"/g, '&' + '#34')
            var MyComponent = Vue.extend({
              template: '<div></br></br><div class="class2"><span class="class1" style="width:90px">' + k + '</span><span class="class1" style="width:90px">' + this.overlapgroup[i][k].title +
              '</span><span class="class1" style="width:90px">' + this.overlapgroup[i][k].devId + '</span><span class="class1" style="width:90px"><img src=' + this.overlapgroup[i][k].onlineimg + '></span>' +
              '<span class="class1" style="width:90px">' + this.overlapgroup[i][k].address + '</span><span style="width:20px;float:right;margin:5px;cursor:default" v-on:click="todevice(' + "'" + csObjJSON + "'" + ')">>></span></div></div>',
              methods: {
                todevice: function (deviceObj) {
                  // debugger
                  deviceObj = deviceObj.replace(/&#34/g, '"')
                  deviceObj = JSON.parse(deviceObj)
                  console.log(deviceObj)

                  if (deviceObj.type!=3) {
                    sessionSetStore('deviceSNNow', deviceObj.sn)
                  } else {
                    sessionSetStore('deviceSNNow', deviceObj.mac)
                  }
                  sessionSetStore('apikeyNow', deviceObj.apiKey)
                  sessionSetStore('deviceIdNow', deviceObj.devId)
                  sessionSetStore('nbmac', deviceObj.mac)
                  if (deviceObj.online === 2) {
                    // 报警---前往报警统计页
                    Routers.push({ path: '/home/device/data/watchone' })
                  } else {
                    // 在线或者离线---前往设备管理页
                    if (deviceObj.type==3 ) {
                      this.$bus.$emit('isnb', true)
                      sessionSetStore('isnb', true)
                      Routers.push({ path: '/home/device/set/deviceinfo' })
                    } else {
                      sessionSetStore('isnb', false)
                      Routers.push({ path: '/home/device/set/deviceManage' })
                    }
                    
                  }
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
                template: '<div></br></br><div class="class2"><span class="class1" style="width:90px">' + j + '</span><span class="class1" style="width:90px">' + this.overlapgroup[this.clickEvent][j].title +
                '</span><span class="class1" style="width:90px">' + this.overlapgroup[this.clickEvent][j].devId + '</span><span class="class1" style="width:90px"><img src=' + this.overlapgroup[this.clickEvent][j].onlineimg + '></span>' +
                '<span class="class1" style="width:90px">' + this.overlapgroup[this.clickEvent][j].address + '</span><span style="width:20px;float:right;margin:5px;cursor:default" v-on:click="todevice(' + "'" + csObjJSON + "'" + ')">>></span></div></div>',
                methods: {
                  todevice: function (deviceObj) {
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
      if (this.point.length > 0) {
        let maxLon = this.point[0].lng
        let minLon = this.point[0].lng
        let maxLat = this.point[0].lat
        let minLat = this.point[0].lat
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
      } else {
        this.map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5)
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
      for (let i = 0; i < this.pointsimplify.length; i++) {
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
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style>
.mapmain {
  padding: 20px;
}
#mapPage {
  width: 100%;
  height: 100%;
}
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
  font-size: 15px;
  top: 20px;
  right: 20px;
  color: white;
  width: 500px;
  height:400px;
  opacity: 0.75;
  background: black;
  margin: 5px;
  border-radius: 5px;
  overflow: auto;
}
.devInfo {
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
.class1 {
  float: left;
}
.class2 {
  margin-left: 5px;
  margin-top:10px;
}
</style>
