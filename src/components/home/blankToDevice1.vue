<template>
  <div id="blankToDevice">
    <h3>设备界面加载中</h3>
  </div>
</template>

<script>
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import Routers from '@/router'
export default {
  name: 'blankToDeviceDiv1',
  data () {
    return {
      userId: false,
      sn: ''
    }
  },
  created () {
   
  },
  // beforeDestroy () {
  //   this.$bus.$off('isnb', false)
  // },
  mounted () {
    var sn = ''
    if (sessionGetStore('onenb') === 'false') {
      sn = sessionGetStore('groupid')
    } else {
      sn = sessionGetStore('nbmac')
    }
    // var userId = sessionGetStore('userId')
    // // 无法获取到用户id，数据异常，退回到登陆界面
    // if (!userId) {
    //   Routers.push({ path: '/login' })
    //   return // 等同于if else的写法
    // }
    // Routers.push({ path: '/home/device' })
    var userId = true
    if (!userId) {
      } else {
        Routers.push({ path: '/home/device/data/deviceNb', query: { sn }})
      }
    // 无法获取到用户id，数据异常，退回到登陆界面
   
   
  }
}
</script>
