<template>
  <div class="alarmInfo">
    <el-container>
      <el-header class="secondtitle" height="39px">
        <template>
          <el-tabs v-model="activeName" @tab-click="toAlarmData">
            <el-tab-pane label="报警统计" name="first"></el-tab-pane>
            <!-- <el-tab-pane label="当前报警" name="second"></el-tab-pane> -->
            <!-- <el-tab-pane label="历史报警" name="third"></el-tab-pane> -->
            <el-tab-pane label="报警值设置" name="fourth"></el-tab-pane>
            <el-tab-pane label="报警联系人设置" :disabled="!(param.auth <= shareAdminAuth)" name="fifth"></el-tab-pane>
            <!-- <el-tab-pane label="全局设置" :disabled="!(param.auth <= shareAdminAuth)" name="fifth"></el-tab-pane> -->
          </el-tabs>
        </template>
      </el-header>
      <el-container class="alarmInfomain">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'alarmInfoDiv',
  data () {
    return {
      activeName: 'first',
      ownerAuth: 1, // 拥有者权限
      shareAdminAuth: 2, // 分享者管理员权限  写死定死的变量，用作权限比较，parm.auth是后台获取和vuex获得的
      shareOperateAuth: 3, // 分享者操作工权限
      shareNoteAuth: 4, // 分享者记录员权限
      // 参数，API请求用
      param: {
        'sn': '',
        'userId': '',
        'apikey': '',
        'deviceId': '',
        'auth': 2
      }
    }
  },
  created () {
    this.tabPaneSet()
  },
  methods: {
    // Tabs标签页点击跳转
    toAlarmData (tab, event) {
      console.log(tab, event)
      if (tab.index === '0') Routers.push({ path: '/home/device/alarm/alarmStatistics' })
      // if (tab.index === '1') Routers.push({ path: '/home/device/alarm/alarmnow' })
      // if (tab.index === '2') Routers.push({ path: '/home/device/alarm/alarmhistory' })
      if (tab.index === '1') Routers.push({ path: '/home/device/alarm/alarmregister' })
      if (tab.index === '2') Routers.push({ path: '/home/device/alarm/alarmauthority' })
      // if (tab.index === '4') Routers.push({ path: '/home/device/alarm/alarmset' })
    },
    // Tabs标签刷新页面保存(通过url来判断)
    tabPaneSet () {
      let url = window.location.href // 保存当前页面url地址
      var arrUrl = url.split('/')
      if (arrUrl[arrUrl.length - 1] === 'alarmStatistics') this.activeName = 'first'
      // if (arrUrl[arrUrl.length - 1] === 'alarmnow') this.activeName = 'second'
      // if (arrUrl[arrUrl.length - 1] === 'alarmhistory') this.activeName = 'third'
      if (arrUrl[arrUrl.length - 1] === 'alarmregister') this.activeName = 'fourth'
      if (arrUrl[arrUrl.length - 1] === 'alarmauthority') this.activeName = 'fifth'
      // if (arrUrl[arrUrl.length - 1] === 'alarmset') this.activeName = 'fifth'
    }
  }
}
</script>

<style>
.alarmInfo{
  overflow: hidden;
  height: 100%;
}
.el-container{
  width: 100%;
  height: 100%;
}
.alarmInfomain{
  bottom: 0;
  /* overflow: hidden; */
}
.secondtitle{
  padding: 0;
}
</style>
