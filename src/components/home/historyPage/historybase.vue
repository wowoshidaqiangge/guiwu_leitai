<template>
  <div class="historydata">
    <el-container>
     <template>
        <el-header class="secondtitle" height="39px">
          <el-tabs v-model="activeName" @tab-click="tohistorydata">
            <el-tab-pane label="数据查询" name="first"></el-tab-pane>
            <!--el-tab-pane label="图表分析" name="second"></el-tab-pane-->
            <el-tab-pane label="上下线查询" name="two"></el-tab-pane>
          </el-tabs>
        </el-header>
        <el-container class="historydatamain">
          <router-view class="historyview"></router-view>
        </el-container>
      </template>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'historyBaseDiv',
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
    this.tabPaneSet()
  },
  methods: {
    tabPaneSet () {
      let url = window.location.href // 保存当前页面url地址
      var arrUrl = url.split('/')
      if (arrUrl[arrUrl.length - 1] === 'historyinquire') this.activeName = 'first'
      if (arrUrl[arrUrl.length - 1] === 'historyonoff') this.activeName = 'two'
     
    },
    tohistorydata: function (tab) {
      if (tab.index === '0') {
        this.toHistoryInquire()
      } else if (tab.index === '1') {
        this.toHistoryOnoff()
      }
    },
    toHistoryInquire: function () {
      Routers.push({ path: '/home/device/history/historyinquire' })
    },
    toHistoryOnoff: function () {
      Routers.push({ path: '/home/device/history/historyonoff' })
    }
  }
}
</script>

<style scoped>
.historydata{
  overflow: hidden;
  height: 100%;
}
.el-container{
  width: 100%;
  height: 100%;
}
.historydatamain{
  bottom: 0;
  /* overflow: hidden; */
}
.secondtitle{
  padding: 0;
}
</style>
