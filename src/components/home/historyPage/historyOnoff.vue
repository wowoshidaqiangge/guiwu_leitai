<template>
  <div class="history">
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
          @clear="clearall" 
          size='mini'
          @select="handleSelect">
         
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
          
          </template>
        </el-autocomplete>
        <el-button class="search_btn" size="mini" type="primary" @click="backgetonlinelog">开始查询</el-button>
      </div>
      <el-table class="table_bjls" :data="tableDataHistory" :max-height="max_table_height" border style="width: 100%">
        <el-table-column prop="index" label="序号" header-align="center" width="100px"></el-table-column>
        <el-table-column prop="state" label="状态" header-align="center"></el-table-column>
       
        <el-table-column prop="time" label="报警时间" header-align="center"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          layout="total, prev, pager, next"
          :total="totals">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import Routers from '@/router'
import { back, onenet } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  name: 'historyOnoff',
  data () {
    return {
      activeName: 'first',
      deviceListInfo: [],
      deviceSelected: '',
      max_table_height: 0,
      param: {
        page: 1,
        size: 15
      },
      totals: 0,
      currentPage1: 0,
      tableDataHistory: []
    }
  },
  created () {
    this.param.sn = sessionGetStore('deviceSNNow')
    this.max_table_height = document.documentElement.clientHeight - 229
  },
  mounted () {
    this.backDevInfoQue()
  },
  methods: {
    
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.param.page = val
      this.backgetonlinelog()
      console.log(`当前页: ${val}`)
    },
    querySearch (queryString, cb) {
      var restaurants = this.deviceListInfo
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect (item) {
      console.log(item)
      this.deviceSelected = item.name
      this.param.mac = item.mac
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }
    },
    backDevInfoQue: function () {
      back.relatioMonitorPoint(this.param).then(function (response) {
        // debugger
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
    
    backgetonlinelog () {
      var that = this
      if (!this.param.mac) {
        this.notificationInfo('提示', '请选择设备')
        return
      }
      back.getonlinelog(this.param).then(res => {
       
        if (res.errno === 0) {
          var arr = []
          res.data.record.forEach((item, index) => {
            item.index = index + 1
            arr.push(item)
          })
          that.tableDataHistory = arr
          that.currentPage1 = res.data.page
          that.totals = res.data.total
        }
      })
    },
    clearall () {
      this.param.mac = ''
      this.param.page = 1
      this.tableDataHistory = []
    },
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
.history{
  width: 100%;
}
.jkd_chose_box {
  margin:0 0 15px 0;
  float: right;
}
.jkd_chose_box span{
  color: #fff;
}
.block .el-pagination{
  float: right;
  margin-top: 10px;
}
.block .el-pagination button{
  background-color:transparent;
}
.block .el-pagination li{
  background-color:transparent;
}
.block .el-pagination .number{
  color:#fff
}
.block .el-pagination .active{
  color:#08c9da
}

.block .el-pagination .el-pagination__total{
  color:#fff
}
</style>
