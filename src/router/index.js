import Vue from 'vue'
import Router from 'vue-router'
const Hello = r => require.ensure([], () => r(require('@/components/hello/HelloWorld')), 'Hello')
const Login = r => require.ensure([], () => r(require('@/components/login')), 'Login')
const Home = r => require.ensure([], () => r(require('@/components/home')), 'Home')
const GlobalPage = r => require.ensure([], () => r(require('@/components/globalPage')), 'globalPage')
// const ceshi1 = r => require.ensure([], () => r(require('@/components/ceshi1')), 'ceshi1')
const Mapss = r => require.ensure([], () => r(require('@/components/home/map')), 'Mapss')
const set = r => require.ensure([], () => r(require('@/components/home/set')), 'set')
const userManaget = r => require.ensure([], () => r(require('@/components/home/userManaget')), 'userManaget')
const indexSet = r => require.ensure([], () => r(require('@/components/home/indexSet')), 'indexSet')
const Blank = r => require.ensure([], () => r(require('@/components/home/blank')), 'Blank')
const BlankToDevice = r => require.ensure([], () => r(require('@/components/home/blankToDevice')), 'BlankToDevice')
const BlankToDevice1 = r => require.ensure([], () => r(require('@/components/home/blankToDevice1')), 'BlankToDevice1')
const User = r => require.ensure([], () => r(require('@/components/home/user')), 'User')
const Devices = r => require.ensure([], () => r(require('@/components/home/device')), 'Devices')
const devicedatas = r => require.ensure([], () => r(require('@/components/home/datapage/devicedata')), 'devicedatas')
const deviceNb = r => require.ensure([], () => r(require('@/components/home/datapage/devicewatch/deviceNb')), 'deviceNb')

const devicewatchone = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/devicewatch-one')), 'devicewatchone')
// const devicewatchset = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/devicewatch-set')), 'devicewatchset')
const devicewatchgroup = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/devicewatch-group')), 'devicewatchgroup')
const remoteControl = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/remoteControl')), 'remoteControl')
const alarmBase = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmBase')), 'alarmBase')
const alarmNow = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmNow')), 'alarmNow')
const alarmStatistics = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmStatistics')), 'alarmStatistics')
const alarmHistory = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmHistory')), 'alarmHistory')
const alarmRegister = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmRegister')), 'alarmRegister')
const alarmAuthority = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmAuthority')), 'alarmAuthority')
const alarmSet = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmSet')), 'alarmSet')
const historyBase = r => require.ensure([], () => r(require('@/components/home/historyPage/historybase')), 'historyBase')
const historyInquire = r => require.ensure([], () => r(require('@/components/home/historyPage/historyInquire')), 'historyInquire')
const historyOnoff = r => require.ensure([], () => r(require('@/components/home/historyPage/historyOnoff')), 'historyOnoff')

const deviceBase = r => require.ensure([], () => r(require('@/components/home/setPage/devicebase')), 'deviceBase')
const deviceInfo = r => require.ensure([], () => r(require('@/components/home/setPage/deviceInfo')), 'deviceInfo')
const deviceSetData = r => require.ensure([], () => r(require('@/components/home/setPage/deviceSetData')), 'deviceSetData')
const deviceMap = r => require.ensure([], () => r(require('@/components/home/setPage/deviceMap')), 'deviceMap')
const deviceManage = r => require.ensure([], () => r(require('@/components/home/setPage/deviceManage')), 'deviceManage')
const deviceUpdate = r => require.ensure([], () => r(require('@/components/home/setPage/deviceUpdate')), 'deviceUpdate')
// 测试
const ceshi = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/devicewatch-one')), 'devicewatchone')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/hello', name: 'hello', component: Hello },
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    // 测试
    { path: '/ceshi', name: 'ceshi', component: ceshi },
    // 全局示意图页
    { path: '/globalPage', name: 'globalPage', component: GlobalPage },
    // { path: '/ceshi1', name: 'ceshi1', component: ceshi1 },
    // 主页
    {
      path: '/home',
      component: Home,
      children: [
        { path: '', redirect: 'map' },
        { path: 'map', name: 'map', component: Mapss },
        { path: 'set', name: 'set', component: set }, // 点击分组管理按键
        { path: 'userManaget', name: 'userManaget', component: userManaget }, // 点击用户管理按键
        { path: 'indexSet', name: 'indexSet', component: indexSet },
        { path: 'blank', name: 'Blank', component: Blank },
        {
          path: 'blankToDevice',
          name: 'blankToDevice',
          component: BlankToDevice
        }, // 过渡/检查userId
        {
          path: 'blankToDevice1',
          name: 'blankToDevice1',
          component: BlankToDevice1
        }, // 过渡/检查userId
        { path: 'user', name: 'user', component: User }, // 点击头像用户名
        {
          path: 'device', // 主页面顶部公共模板组件
          component: Devices,
          children: [
            { path: '', redirect: 'data' },
            {
              path: 'data', // 数据监控部分的header公共组件
              component: devicedatas,
              children: [
                { path: '', redirect: 'watchone' },
                // { path: '', redirect: 'watchgroup' },
                { path: 'watchone', component: devicewatchone },
                {path: 'deviceNb', component: deviceNb},
                // { path: 'watchset', component: devicewatchset },
                { path: 'watchgroup', component: devicewatchgroup },
                { path: 'remoteControl', component: remoteControl }
              ]
            },
            {
              path: 'alarm',
              component: alarmBase,
              children: [
                { path: '', redirect: 'alarmStatistics' },
                {
                  path: 'alarmStatistics',
                  name: 'alarmStatistics',
                  component: alarmStatistics
                },
                { path: 'alarmnow', name: 'alarmnow', component: alarmNow },
                {
                  path: 'alarmhistory',
                  name: 'alarmhistory',
                  component: alarmHistory
                },
                {
                  path: 'alarmregister',
                  name: 'alarmregister',
                  component: alarmRegister
                },
                {
                  path: 'alarmauthority',
                  name: 'alarmauthority',
                  component: alarmAuthority
                },
                { path: 'alarmset', name: 'alarmset', component: alarmSet }
              ]
            },
            {
              path: 'history',
              component: historyBase,
              children: [
                { path: '', redirect: 'historyinquire' },
                {
                  path: 'historyinquire',
                  name: 'historyinquire',
                  component: historyInquire
                },
                {
                  path: 'historyonoff',
                  name: 'historyonoff',
                  component: historyOnoff
                }
              ]
            },
            {
              path: 'set',
              component: deviceBase,
              children: [
                { path: '', redirect: 'deviceinfo' },
                {
                  path: 'deviceinfo',
                  name: 'deviceinfo',
                  component: deviceInfo
                },
                {
                  path: 'deviceSetData',
                  name: 'deviceSetData',
                  component: deviceSetData
                },
                { path: 'deviceMap', name: 'deviceMap', component: deviceMap },
                {
                  path: 'deviceUpdate',
                  name: 'deviceUpdate',
                  component: deviceUpdate
                },
                {
                  path: 'deviceManage',
                  name: 'deviceManage',
                  component: deviceManage
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})
