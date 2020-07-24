<!-- 数据监测主页面 -->
<template>
  <div class="devicedata">
    <el-container class="">
      <el-header class="secondtitle" height="41px">
        <template>
          <el-tabs v-model="activeName" @tab-click="todevicedata">
            <el-tab-pane label="数据监测" name="first" v-if="!isnb"></el-tab-pane>
            <!-- <el-tab-pane label="监控设置" name="second"></el-tab-pane> -->
            <!-- <el-tab-pane label="设备管理" name="second"></el-tab-pane> -->
             <el-tab-pane label="NB数据监测" name="three" v-if="isnb"></el-tab-pane>
            <el-tab-pane label="远程控制" name="third"></el-tab-pane>
           
          </el-tabs>
        </template>
      </el-header>
      <el-container class="devicedatamain">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      activeName: 'first',
      isnb: false
    }
  },
  computed: {},
  watch: {
    $route (to, from) {
      
      if (to.path === '/home/device/data/watchone') {
        this.isnb = false
      } else if (to.path === '/home/device/data/deviceNb') {
        this.isnb = true
        this.activeName = 'three'
      }
      console.log(to,this.isnb)
    }
  },
  created () {
    this.tabPaneSet()
  },
  mounted () {},
  methods: {
    // Tabs标签页点击跳转
    todevicedata (tab, event) {
    
      // console.log(tab, event)
      if (tab.index === '0' && !this.isnb) Routers.push({ path: '/home/device/data/watchone' })
      // if (tab.index === '1') Routers.push({ path: '/home/device/data/watchset' })
      if (tab.index === '0' && this.isnb) Routers.push({ path: '/home/device/data/deviceNb' })
      if (tab.index === '1') Routers.push({ path: '/home/device/data/remoteControl' })
    },
    // Tabs标签刷新页面保存
    tabPaneSet () {
    
      let isnb = sessionGetStore('isnb')
   
      if (isnb === 'true') {
        this.isnb = true
      } 
      let url = window.location.href // 保存当前页面url地址
      // var arrUrl = url.split('/')
      if (url.indexOf('deviceNb') !== -1) {
        this.isnb = true
        this.activeName = 'three'
      } else if (url.indexOf('watchone') !== -1) {
        this.isnb = false
        this.activeName = 'first'
      } else if (url.indexOf('remoteControl') !== -1) {
        this.activeName = 'third'
      }
      // if (arrUrl[arrUrl.length - 1] === 'watchone') this.activeName = 'first'
      // if (arrUrl[arrUrl.length - 1] === 'watchset') this.activeName = 'second'
      // if (arrUrl[arrUrl.length - 1] === 'deviceNb') this.activeName = 'three'
      // if (arrUrl[arrUrl.length - 1] === 'remoteControl') this.activeName = 'third'
    }
  }
}
</script>

<style>
.devicedata {
  overflow: hidden;
  height: 100%;
}
.el-container {
  width: 100%;
  height: 100%;
}
.devicedatamain {
  bottom: 0;
  /* overflow: hidden; */
}
.secondtitle {
  padding: 0;
}
</style>
