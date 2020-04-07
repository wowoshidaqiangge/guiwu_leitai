<template>
  <div class="groupSet">
    <el-container>
      <div class="top_group_set">
        <div class="left_groupSet">
          <span>分组管理</span>
        </div>
        <div class="right_groupSet">
          <el-button type="primary" size="small" class="back_btn" icon="el-icon-arrow-left" @click="backToMap">&nbsp;返回</el-button>
          <el-button type="primary" size="small" class="add_btn" icon="el-icon-circle-plus-outline" @click="groupaddinit">&nbsp;添加分组</el-button>
        </div>
      </div>
      <!-- 实际主要部分 -->
      <el-main class="setMain">
        <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tableDataGroup"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="name"
          label="分组名称"
          header-align="center"
          min-width="50%">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          header-align="center"
          min-width="50%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
      </el-main>
      <!-- 对话框部分 -->
      <el-dialog :title="formAddEditTitle" :visible.sync="groupDialogFormVisible" width="500px" center>
        <el-form ref="groupRuleForm" :model="groupRuleForm">
          <el-form-item label="新分组名" prop="groupName" label-width="80px">
            <el-input class="ip_fzm_setGroup1" v-model="groupRuleForm.groupName"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="footerBtn">
              <el-button type="primary" @click="handleGroup('groupRuleForm')">确定</el-button>
              <el-button type="primary" class="btn_cancel_setGroup"  @click="groupDialogFormVisible = false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'gruopSetDiv',
  data () {
    return {
      // 参数，用于API请求
      param: {
        userId: '123',
        groupName: '',
        deviceGroupId: ''
      },
      // 存储所有设备及分组信息 ?????????? 为了之后检查当前小组下是否有设备？1获取设备信息存到deviceInfo 2比对组名name之后检查小组下是否有设备 3分组信息只是存储组名，不存储设备devices
      deviceInfo: [
      ],
      // 存储分组信息
      tableDataGroup: [{
        name: 'Default',
        id: ''
      }],
      // 存储分组表单信息
      groupRuleForm: {
        index: 1,
        groupName: '',
        groupId: ''
      },
      formAddOrModify: 0, // 分组添加与编辑标志 0-add,1-modify
      formAddEditTitle: '',
      groupDialogFormVisible: false,
      loadingFlag: false
    }
  },
  created () {
    // 如果刷新页面，则重新获取用户下挂信息 userId
    this.param.userId = sessionGetStore('userId')
  },
  mounted () {
    // 获取用户下设备信息
    this.deviceInfoGet()
  },
  methods: {
    // 返回，跳转至地图页面
    backToMap () {
      Routers.push({ path: '/home/map' })
    },
    // 添加设备小组-打开对话框
    groupaddinit: function () {
      console.log('timestart')
      this.formAddEditTitle = '添加新分组'
      this.formAddOrModify = 0
      this.groupRuleForm.groupName = ''
      this.groupRuleForm.groupId = ''
      // this.groupRuleForm.index = this.tableDataGroup.length
      this.groupDialogFormVisible = true
    },
    // 编辑设备组信息-打开对话框
    handleEdit: function (index, row) {
      this.formAddEditTitle = '编辑分组'
      this.formAddOrModify = 1
      this.groupRuleForm.groupName = this.tableDataGroup[index].name
      this.groupRuleForm.groupId = this.tableDataGroup[index].id
      this.groupRuleForm.index = index
      this.groupDialogFormVisible = true
      console.log(index)
      console.log(row)
    },
    // 添加编辑设备小组信息-确定按键
    handleGroup: function () {
      if (this.groupRuleForm.groupName === '') {
        this.notificationInfo('错误提示：', '分组名称不能为空')
        return
      }
      if (this.formAddOrModify === 1) {
        if (this.tableDataGroup[this.groupRuleForm.index].name === 'Default') {
          this.$message({
            type: 'info',
            message: 'Default不可修改删除'
          })
          return
        }
      }
      if (this.checkGroupName(this.groupRuleForm.groupName)) {
        this.$message({
          type: 'info',
          message: '小组名称不可重复'
        })
        return
      }
      this.param.groupName = this.groupRuleForm.groupName
      this.param.groupUid = this.groupRuleForm.groupId
      if (this.formAddOrModify === 0) {
        this.backDevGroupAdd()
      } else if (this.formAddOrModify === 1) {
        this.backDevGroupEdit()
      }
      this.groupDialogFormVisible = false
    },
    // 删除选中行的小组
    handleDelete: function (index, row) {
      if (this.tableDataGroup[index].name === 'Default') {
        this.$message({
          type: 'info',
          message: 'Default不可修改删除'
        })
        return
      }
      // 区分两种情况，小组下有设备的删除与无设备的删除
      let checkFlag = true                          // 两种情况状态标志位
      if (this.checkGroupDevice(this.tableDataGroup[index].name)) {
        this.$confirm('此小组下存在设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          checkFlag = true
          this.groupSetLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          this.param.deviceGroupId = row.id
          this.backDevGroupDel(index, row)
        }).catch(() => {
          checkFlag = false
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      if (checkFlag) {
        this.groupSetLoading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        })
        this.param.deviceGroupId = row.id // 后台删除之前存储组名id到param中，以便下次向后台发请求查询信息
        this.backDevGroupDel(index, row)
      }
    },
    /*
    **  **********  API调用相关函数  **********
    */
    // 添加设备分组
    backDevGroupAdd: function () {
      console.log('添加设备分组')
      console.log(this.param)
      back.addNetGroup(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 1) {
          let obj = {}
          obj.name = this.groupRuleForm.groupName
          obj.id = this.groupRuleForm.groupId
          this.tableDataGroup.splice(this.tableDataGroup.length, 0, obj)
        } else {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 获取用户下设备信息
        this.deviceInfoGet()
      }.bind(this))
    },
    // 编辑选中设备组信息
    backDevGroupEdit: function () {
      console.log('编辑设备分组')
      console.log(this.param)
      back.devGroupNameMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 1) {
          let obj = {}
          obj.name = this.groupRuleForm.groupName
          obj.id = this.groupRuleForm.groupId
          this.tableDataGroup.splice(this.groupRuleForm.index, 1, obj)
        } else {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 获取用户下设备信息
        this.deviceInfoGet()
      }.bind(this))
    },
    // 删除选中设备组信息
    backDevGroupDel: function () {
      console.log('删除选中设备组信息')
      console.log(this.param)
      // 后台接口
      back.deleteNetGroup(this.param).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 用户下设备信息获取
          this.deviceInfoGet()
        }
      }.bind(this))
      // 关闭loading
      this.groupSetLoading.close()
    },
    // 用户下设备信息获取
    deviceInfoGet: function () {
      back.userDevQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 1) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 设备列表信息存储到当前组件内
        this.deviceInfoStore(response)
        this.$store.commit('setdeviceGroupRefresh', true)
        console.log(this.$store.state.deviceGroupRefresh)
      }.bind(this))
    },
    /*
    **  **********  辅助方法函数  **********
    */
    // 小组信息存储
    deviceInfoStore: function (info) {
      let devGroupinfo = []
      if (info.data !== undefined) {
        for (let i = 0; i < info.data.length; i++) {
          let groupinfo = {}
          groupinfo.name = info.data[i].groupName
          groupinfo.id = info.data[i].groupUid
          devGroupinfo[i] = groupinfo
        }
        this.deviceInfo = info.data
      }
      this.tableDataGroup = devGroupinfo
    },
    // 检查小组名称是否重复
    checkGroupName: function (name) {
      let checkFlag = false
      for (let i = 0; i < this.tableDataGroup.length; i++) {
        if (this.tableDataGroup[i].name === name) {
          checkFlag = true
          return checkFlag
        }
      }
      return checkFlag
    },
    // // 设备列表信息存储到当前组件内
    // deviceInfoStore: function (info) {
    //   let devicesinfo = [] // 网关列表数组
    //   if (info.errno === 0) {
    //     // 设备组
    //     // 设备列表信息存储到当前左侧组件内
    //     for (let j = 0; j < info.data.length; j++) {
    //       let devicesgroup = {} // 网关数组中的一个对象
    //       devicesgroup.id = info.data[j].groupUid
    //       devicesgroup.name = info.data[j].groupName
    //       let data = [] // 网关数组->对象->数组(chidldren数组)
    //       if (info.data[j].devices === undefined) {
    //         data[0] = {} // children数组内对象为空
    //         devicesgroup.children = data
    //         devicesinfo[j] = devicesgroup
    //         continue
    //       }
    //       // 组内设备
    //       for (let k = 0; k < info.data[j].devices.length; k++) {
    //         let obj = {} // children数组内对象
    //         obj.id = info.data[j].devices[k].deviceId
    //         obj.apiKey = info.data[j].devices[k].apiKey
    //         obj.sn = info.data[j].devices[k].sn
    //         obj.location = info.data[j].devices[k].name
    //         data[k] = obj
    //       }
    //       devicesgroup.children = data
    //       devicesinfo[j] = devicesgroup
    //     }
    //   }
    //   this.tableDataGroup = devicesinfo
    //   console.log(this.tableDataGroup)
    // },
    // 检查当前小组下是否有设备
    checkGroupDevice: function (name) {
      console.log(name)
      console.log(this.deviceInfo)
      let checkFlag = false
      for (let i = 0; i < this.deviceInfo.length; i++) {
        if (this.deviceInfo[i].groupName === name) {
          if (this.deviceInfo[i].devices.length !== 0) {
            checkFlag = true
            return checkFlag
          }
        }
      }
      return checkFlag
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

<style scoped>
.groupSet{
  padding: 0 35px;
}
.el-container {
  display: flex;
  display: -webkit-flex; /* Safari */
  position: relative;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  /* background-color: #FFFFFF; */
}
.el-main {
  padding: 0px;
  flex: 1;
}
.top_group_set{
  height: 30px;
  padding-top: 40px;
  padding-bottom: 30px;
}
.top_group_set .left_groupSet{
  float: left;
}
.top_group_set .left_groupSet span{
  float: left;
  padding-left: 10px;
  border-left: 2px solid #08C9DA;
  line-height: 30px;
  color: #fff;
  font-size: 16px;
}
.top_group_set .right_groupSet{
  float: right;
}
.right_groupSet .back_btn, .right_groupSet .add_btn{
  background: url(/static/bg_device_title1.png);
  background-size: 100% 100%;
  color: #fff;
}
.groupSet >>> .el-header, .el-footer {
  /* background-color: #FFFFFF; */
  color: #333;
  /* footer与header都在container容器内 => 可test-align */
  text-align: left;
  line-height: 60px;
  height: 60px;
}
.el-footer {
  bottom:0px;
  left: 0px;
}
.btn_cancel_setGroup{
  margin-left: 50px;
  background: #1C363F;
  color: #08C9DA;
  border: 1px solid #08C9DA;
}
/* .el-input {
  margin-top: 9px;
} */
.setmain{
  height: 100px;
  overflow: auto;
}
.el-dialog .el-dialog__header{
  text-align: center;
  color: rgb(65, 81, 226);
  background-color: #409EFF;
}
.groupSet >>> .el-form-item__content {
  text-align: center;
  /* margin-left: 0px; */
}
</style>
