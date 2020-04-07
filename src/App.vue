<template>
  <div id="app">
    <router-view @transferuser="getuser"></router-view>
  </div>
</template>

<script>
import { back } from 'api'
import Routers from './router'

export default {
  name: 'App',
  data () {
    return {
      param: {
        'userId': 0,
        'Authorization': ''
      }
    }
  },
  created () {
    // 定时刷新Token
    // window.setInterval(this.backRefreshToken, 3600000)
  },
  methods: {
    // 判断用户登录是否正确，通过子传父传递msg,进而跳转
    getuser (msg) {
      if (msg === 'home') {
        Routers.push({ path: '/home' })
      } else if (msg === 'login') {
        Routers.push({ path: '/login' })
      } else if (msg === 'globalPage') {
        // 进入全局示意模式页面
        Routers.push({ path: '/globalPage' })
      }
    },
    // 后台刷新token值
    backRefreshToken: function () {
      this.param.userId = this.$store.state.userId
      this.param.Authorization = this.$store.state.Authorization
      back.refreshToken(this.param).then(function (response) {
        if (response.errno === 0) {
          let Authorization = 'Bearer' + ' ' + response.data.token
          this.$store.commit('setAuthorization', Authorization)
        } else {
          console.log('获取token值失败 ：' + response.error)
        }
      }.bind(this)) // bind在=>函数下不可用
    }
  }
}
</script>

<style>
body, html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
html {
  display: block;
}
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  text-align: center;
  color: #2c3e50;
  background-color: rgb(128, 141, 163);
}
/* 额外加的，不知道师兄怎么没加这个，而只用#app的text-align就可以了 */
.el-table td {
  text-align: center;
}
.el-dialog--center .el-dialog__header {
  background-color: #409EFF;
  padding-top: 15px;
  line-height: 40px;
}
.el-dialog__title{
  color: #303133;
}
/* line-height是强加的，师兄没有这个(或许是我没找到)，但是有这个效果 */
.el-dialog--center .el-dialog__body {
  text-align: left;
  padding: 25px 27px 20px;
  line-height: 24px;
}
/* 解决table标签表头与内容边框错位问题 */
.el-table th.gutter{
  display: table-cell!important;
}

/* 解决tabs标签页的文字颜色问题 */
.secondtitle .el-tabs__item{
  color: #fff;
}
.secondtitle .el-tabs__item:hover,.secondtitle .el-tabs__item.is-active{
  color: #08C9DA;
}
/* 修改table表格样式 */
.el-table{
  background: url(/static/bg_device_tbody.png) no-repeat;
  background-size: 100% 100%;
  color: #08C9DA;
  border-radius: 5px;
}
.el-table__header-wrapper{
  background: url(/static/bg_device_thead.png) no-repeat;
  background-size: 100% 100%;
}
.el-table__body-wrapper{
}
.el-table tr{
  background-color: transparent;
}
.el-table th{
  background-color: transparent;
}
.el-table--group,.el-table--border{
  border: 1px solid #08C9DA;
  /* border: none; */
  /* border-top: 1px solid #08C9DA;
  border-bottom: 1px solid #08C9DA;
  border-left: 1px solid #08C9DA;
  border-right: 1px solid #08C9DA; */
}
.el-table th.is-leaf, .el-table td{
  border-bottom: 1px solid #08C9DA;
}
.el-table--border th, .el-table--border td{
  border-right: 1px solid #08C9DA;
  border-bottom: 1px solid #08C9DA;
}
.el-table--group::after,.el-table--border::after,.el-table::before{
  background-color: #08C9DA;
}
.el-table::before{
  height: 0px;
}
.el-table--group::after,.el-table--border::after{
  width: 0;
}
.el-table__fixed::before, .el-table__fixed-right::before{
  height: 0;
}
.el-table thead{
  color: #fff;
  /* font-weight: normal; */
}
/* 按钮样式 */
.el-button--primary {
  color: #05494F;
  /* color: #FFFFFF; */
  font-size: 14px;
  border: none;
  /* background-color: #08C9DA;
  border-color: #08C9DA; */
}
/* tabs选项卡 */
.el-tabs__nav-wrap::after{
  height: 0px;
}
/* 对话框dialog */
.el-dialog{
  background: url(/static/dialog_bg1.png) no-repeat;
  background-size: 100% 100%;
  padding-top: 15px;
  /* box-sizing: border-box;
  max-height: 90%;
  overflow-y: auto; */
}
.el-dialog--center .el-dialog__header{
  padding: 0;
  background: url(/static/dialog_title_bg1.png) no-repeat center center;
  background-size: 76% 100%;
  background-color: transparent;
  line-height: 50px;
  margin-bottom: 20px;
}
.el-dialog .el-dialog__title,.el-dialog .dialog-title{
  color: #fff;
  font-size: 18px;
  /* font-size: 14px; */
}
.el-dialog__headerbtn .el-dialog__close{
  color: #00FFFF;
  border: 1px solid #00FFFF;
  border-radius: 50%;
  padding: 3px;
}
.el-dialog__headerbtn{
  top: 10px;
  right: 10px;
}
.el-dialog .el-dialog__body .el-input__inner{
  background-color: #136672;
  border: none;
  color: #fff;
}
.el-dialog .el-dialog__body .el-form-item__label{
  color: #fff;
}
</style>
