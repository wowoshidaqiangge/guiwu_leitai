<template>
  <div class="deviceset">
    <el-container class="mapsmain">
      <div class="location_box">
        <el-button type="text" icon="el-icon-arrow-right"></el-button>
        <div class="jwd_box">
          <span class="sp_jwd">经度：</span>
          <el-input class="ip_jwd" v-model="lon" size="small"></el-input>
          <span class="sp_jwd">纬度：</span>
          <el-input class="ip_jwd" v-model="lat" size="small"></el-input>
        </div>
        <el-button type="primary" style="margin-left:50px;" size="small" icon="el-icon-location" @click="locatEditInit">修改位置信息</el-button>
      </div>
      <div class="devicemaps">
        <div id="deviceset">
          <h3>设备坐标图</h3>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import BMap from 'BMap'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'

export default {
  name: 'deviceSetDiv',
  // VUE内部数据
  data () {
    return {
      // 参数，用于API请求
      param: {
        'sn': '',
        'userId': 1000,
        'auth': 2, // 权限
        'deviceId': '19889082', // 当前设备ID号
        'deviceName': 'noname', // 当前设备设备名
        'apiKey': 'N0HRSTOlpNNQrJ=WmsDbXXgUfzI=', // apikey值
        'location': {'lon': '120', 'lat': '30', 'ele': '100'}
      },
      name: '',
      map: null,
      lon: null,
      lat: null,
      // 当前选择主题样式
      currentMayStyle: 'midnight',
      centerDialogVisible: false
    }
  },
  //
  // *************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    if (sessionGetStore('isnb') === 'true') {
      this.param.sn = sessionGetStore('nbmac')
    } else {
      this.param.sn = sessionGetStore('deviceSNNow')
    }
  
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // 获取用户的地图主题
    this.currentMayStyle = sessionGetStore('userMap')
  },
  // 生命周期，安装期
  mounted: function () {
    // 地图加载
    this.loadmap()
    // 获取设备地图信息
    this.getMapInfo()
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 地图加载
    loadmap: function () {
      this.map = new BMap.Map('deviceset')
      this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
      this.map.enableScrollWheelZoom(true)
      // 修改地图主题样式
      this.map.setMapStyle({
        style: this.currentMayStyle
      })
      this.map.addEventListener('click', function (e) {
        // console.log(e.point.lng + ',' + e.point.lat)
        this.lon = e.point.lng.toFixed(6)
        this.lat = e.point.lat.toFixed(6)
        this.addmarker()
        // this.param.location.lon = this.lon
        // this.param.location.lat = this.lat
      }.bind(this))
      this.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(50, 50)
      }))
      this.map.clearOverlays()
      var myIconOn = new BMap.Icon('/static/dw_icon_on.png', new BMap.Size(32, 32))
      var marker = new BMap.Marker(new BMap.Point(this.lon, this.lat), {icon: myIconOn})
      this.map.addOverlay(marker)
    },
    // 向地图中添加坐标标注点
    addmarker: function () {
      this.map.clearOverlays()
      var myIconOn = new BMap.Icon('/static/dw_icon_on.png', new BMap.Size(32, 32))
      var marker = new BMap.Marker(new BMap.Point(this.lon, this.lat), {icon: myIconOn})
      this.map.addOverlay(marker)
    },
    // 获取设备地图信息
    getMapInfo () {
      // 设备信息查询
      back.getNetInfo(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('', response.error)
          return
        }
        this.param.name = response.data.name
        this.param.location = response.data.location
        this.lon = this.param.location.lon
        this.lat = this.param.location.lat
        this.map.centerAndZoom(new BMap.Point(this.lon, this.lat), 11)
        this.map.enableScrollWheelZoom(true)
        this.addmarker()
        // // 用户设备权限查询
        // this.backUserDevAuthQue()
      }.bind(this))
    },
    // 修改位置信息
    locatEditInit: function () {
      console.log('修改设备位置信息')
      this.$confirm('此操作将修改设备位置信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let locat = {lon: this.lon, lat: this.lat, ele: '123'}
        this.param = {}
        this.param.sn = sessionGetStore('deviceSNNow')
        this.param.userId = sessionGetStore('userId')
        this.param.Authorization = sessionGetStore('Authorization')
        let locat = {
          lon: parseFloat(this.lon).toFixed(6),
          lat: parseFloat(this.lat).toFixed(6)
        }
        console.log(locat)
        this.param.location = locat
        console.log(this.param.location)
        back.devMod(this.param).then(function (response) {
          // console.log(response)
          if (response.errno === 1) {
            this.notificationInfo('', response.error)
            return
          }
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 获取设备地图信息
          this.getMapInfo()
        }.bind(this))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0;
  }
  .el-row{
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .deviceset{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .mapsmain {
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex; /* Safari */
    flex-direction: column;
    padding: 0px;
    bottom: 0;
  }
  .location_box{
    text-align: left;
    padding: 10px 0;
    color: #fff;
    .jwd_box {
      display: inline-block;
      .ip_jwd {
        width: 150px;
        margin: 0 15px 0 5px;
      }
    }
  }
  .devicemaps {
    padding-top: 5px;
    width: 100%;
    height: 100%;
    bottom: 0;
  }
  #deviceset {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    bottom: 0;
  }
  
  #ptest {
    height: 50px
  }
</style>
<style>
  #deviceset .anchorBL {
    display:none
  }
</style>
