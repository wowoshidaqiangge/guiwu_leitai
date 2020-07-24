<template>
  <div class="groupSet">
    <el-container>
      <div class="top_group_set">
        <div class="left_groupSet">
          <span>用户管理</span>
        </div>
        <div class="right_groupSet">
          <el-button type="primary" size="small" class="btn_topnav" icon="el-icon-arrow-left" @click="backToMap">&nbsp;返回</el-button>
          <el-button type="primary" size="small" class="btn_topnav" icon="el-icon-circle-plus-outline" @click="userAddBtn" v-show="addBtnShow">添加用户</el-button>
          <el-button type="primary" size="small" class="btn_topnav" icon="el-icon-circle-check-outline" @click="goPersonalBtn">回到自己</el-button>
        </div>
      </div>
      <!-- 实际主要部分 -->
      <el-main class="setMain">
        <el-table
        :data="userTableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="name"
          label="用户名称"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          header-align="center"
          min-width="20%">
        </el-table-column><el-table-column
          prop="company"
          label="公司名称"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="auth"
          label="权限"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          header-align="center"
          min-width="30%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit-outline" @click="hanld(scope.$index, scope.row)" v-show="authnum==='0' ">修改</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-show="editBtnShow">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-info" @click="handleRead(scope.$index, scope.row)">查看</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" v-show="delBtnShow">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
              
      </el-main>
      <!-- 对话框部分 -->
      <el-dialog :title="diaTitle" :visible.sync="diaShow" @closed="diaClose" width="300px" center>
        <el-form ref="userForm" :model="userForm" :rules="rulesLogin">
          <el-form-item label="用户名" prop="name" label-width="80px">
            <el-input v-model="userForm.name" placeholder="请填写用户名"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account" label-width="80px">
            <el-input v-model="userForm.account" placeholder="请填写账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="80px">
            <el-input v-model="userForm.password" type="password" placeholder="请填写密码"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" label-width="80px">
            <el-input v-model="userForm.mobile" placeholder="请填写手机号码"></el-input>
          </el-form-item>
          <el-form-item label="公司" prop="company" label-width="80px">
            <el-input v-model="userForm.company" placeholder="请填写公司名称"></el-input>
          </el-form-item>
          <el-form-item label="权限设置" prop="auth" label-width="80px">
            <el-select v-model="userForm.auth" placeholder="请选择权限">
              <el-option
                v-for="item in authOptions"
                :key="item.authValue"
                :label="item.authName"
                :value="item.authValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="footerBtn">
              <el-button type="primary" @click="diaConfirmBtn('userForm')">确定</el-button>
              <el-button class="btn_cancel_dialog" @click="diaShow = false">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog :title="diaTitle" :visible.sync="editShow" @closed="editClose" width="500px" center>
        <el-form ref="userForm1" :model="userForm1" :rules="rulesLogin">
          <el-form-item label="自定义名称" prop="sysName">
            <el-input  v-model="userForm1.sysName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="LOGO图标" >
            
          </el-form-item>
              <el-upload
                class="ip_halfLine"
                :action="host"
                :accept="type"
                ref='my-upload'
                :show-file-list="fileListShow"
                :file-list="pictureList"
                list-type="picture-card"
                :limit="pictureNum"
                :data="ossParams"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="onExceed">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              
          <el-form-item>
            <div class="footerBtn">
              <el-button type="primary" @click="editConfirmBtn('userForm1')">确定</el-button>
              <el-button class="btn_cancel_dialog" @click="editShow = false">取消</el-button>
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
import { sessionSetStore, sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'gruopSetDiv',
  data () {
    // ***********表单输入规则校验***********
    // 校验用户名
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    // 校验账号
    var checkAccount = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fff\w]{3,18}$/
      if (value === '') {
        return callback(new Error('账号不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('只能包含数字、字母、汉字和下划线，长度在3~18之间'))
      } else {
        callback()
      }
    }
    // 校验密码
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else {
        callback()
      }
    }
    // 校验手机号
    var checkMobile = (rule, value, callback) => {
      if (value === '') {
        return callback()
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    }
    return {
      query: {},
      editShow: false,
      authnum: '',
      host: 'http://thingcom-dianliuji.oss-cn-hangzhou.aliyuncs.com', // 上传地址：此处也是创建oss的外网地址
      type: 'image/*',                         // 接受上传的文件类型   
      fileListShow: true,                      // 是否显示已上传照片列表
      pictureNum: 1, // 最大允许上传个数
      // 从服务端获取到的签名数据
      ossParams: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        expire: '',
        key: '',                      // key后面有用，先默认设空字符串
        success_action_status: '200'  // 默认200
      },
      // 已上传文件列表
      pictureList: [],
      dialogImageUrl: '', // 放大的图片url
      dialogVisible: false, // 放大图片所在的对话框 
      tableHeight: document.body.clientHeight - 75 - 70 - 58 - 30 - 20,
      // 参数，用于API请求
      param: {
        userId: '123',
        name: ''
      },
      // 存储用户列表信息
      userTableData: [
        // {
        //   name: '周涛hh',
        //   mobile: '123456',
        //   company: '轨物',
        //   auth: '超级管理员',
        //   password: '123456',
        //   account: 'zhoutao'
        // }
      ],
      // 存储用户表单信息
      userForm: {
        index: 1,
        name: '',
        account: '',
        password: '',
        mobile: '',
        company: '',
        auth: ''
        // groupId: ''
      },
      userForm1: {
        sysName: ''
      },
      // 存储权限选择框
      authOptions: [{
        authValue: '1',
        authName: '管理员'
      }, {
        authValue: '2',
        authName: '查看者'
      }, {
        authValue: '3',
        authName: '普通用户'
      }],
      // 表单验证
      rulesLogin: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ],
        sysName: [
          {required: true, message: '请输入名称'}
        ],
       
        account: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        auth: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ]
      },
      formAddOrModify: 0,   // 分组添加与编辑标志 0-add,1-modify
      diaTitle: '',         // 对话框标题
      editBtnShow: true,    // 编辑按钮显示标志位
      delBtnShow: true,     // 删除按钮显示标志位
      addBtnShow: true,     // 添加按钮显示标志位
      diaShow: false        // 是否显示对话框
    }
  },
  computed: {
  },
  created () {
    // 如果刷新页面，则重新获取用户下挂信息 userId
    this.authnum = sessionGetStore('auth')
    this.param.userId = sessionGetStore('userId')
    // 分组管理/设备添加/用户管理 按钮显示判断
    let auth = sessionGetStore('authMe')
    switch (auth) { // 注：auth位string类型
      case '0':
        this.editBtnShow = true
        this.delBtnShow = true
        this.addBtnShow = true
        break
      case '1': 
        this.editBtnShow = true
        this.delBtnShow = true
        this.addBtnShow = true
        break
      case '2': 
        this.editBtnShow = false
        this.delBtnShow = false
        this.addBtnShow = false
        break
      default:
        this.editBtnShow = false
        this.delBtnShow = false
        this.addBtnShow = false
    }
  },
  mounted () {
    // back用户信息列表获取
    this.backUserInfoListQue() 
  },
  methods: {

    editConfirmBtn (form) {
      var that = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.imageUrl || this.pictureList.length>0) {
            this.query.logo = this.imageUrl
            this.query.sysName = this.userForm1.sysName
            back.userUi(this.query).then(function (response) {
              if (response === undefined) {
                that.notificationInfo('错误提示', response.error, 'error')
              } else {
                that.query = {}
                that.editShow = false
                that.clearFiles()
                that.backUserInfoListQue()
                that.notificationInfo('提示', '修改成功', 'success')
                console.log(response)
              }
            })
          } else {
            this.notificationInfo('错误提示', 'logo不能为空', 'error')
          }
        } else {
          return false
        }
      })
    },
    editClose () {
      this.$refs.userForm1.resetFields()
      this.clearFiles()
    },
    hanld (index, info) {
      var logourl = info.logo
      this.userForm1.sysName = info.sysName
      this.diaTitle = '修改名称及LOGO'
      this.pictureList = []
      this.pictureList.push({url: logourl})
      this.editShow = true
      this.query.userId = info.userId
    },
    // 上传之前的回调
    beforeUpload: async function (file) {
      console.log('上传之前的回调')
    
      console.log(this.pictureList)
      await this.backOssInfo(file)
    },
    // 上传成功的回调
    handleSuccess (res, file) {
      console.log('上传成功的回调')
      console.log(this.pictureList)
      this.imageUrl = this.host + '/' + this.ossParams.key
      // 用电方表单信息---更新
      // this.diaForm.companyInform = this.imageUrl
      console.log(this.imageUrl)
    },
    clearFiles () {
      this.$refs['my-upload'].clearFiles()
    },
    // 文件列表移除文件时的钩子
    handleRemove: function (file, fileList) {
     
      console.log('移除的回调')
      console.log(this.pictureList)
      console.log(file)                 // 移除文件
      console.log(fileList)             // 剩余文件
      // 供电方表单信息---更新
      
      this.pictureList = []
      this.imageUrl = ''
      // this.diaForm.imageUrl = ''
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview (file) {
      console.log('点击文件列表中已上传的文件时回调')
      console.log(this.pictureList)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件超出个数限制时的钩子
    onExceed (files, fileList) {
      console.log(files)
      console.log(fileList)
      this.notificationInfo('错误提示', '最多只允许上传一张图片', 'warning')
    },
    // 获取oss签名数据
    backOssInfo: function (file) {
      return new Promise(function (resolve, reject) {
        back.ossInfo().then(function (response) {
          console.log(response)
          if (response === undefined) {
            this.notificationInfo('错误提示', response.error, 'error')
            reject()
          } else {
            console.log(response)
            this.ossParams.OSSAccessKeyId = response.accessid
            this.ossParams.policy = response.policy
            this.ossParams.signature = response.signature
            this.ossParams.key = sessionGetStore('userId') + this.randomWord(true, 9, 12)
            resolve()
          }
        }.bind(this))
      }.bind(this))
    },
    randomWord (randomFlag, min, max) {
      let str = ''
      let range = min
      let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min
      }
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
      }
      return str
    },
    // 关闭对话框自动调用事件
    diaClose: function () {
      // 关闭表单验证
      this.$refs.userForm.resetFields()
    },
    // 返回，跳转至地图页面
    backToMap () {
      Routers.push({ path: '/home/map' })
    },
    // 添加用户-打开对话框
    userAddBtn: function () {
      this.userForm.name = ''
      this.userForm.account = ''
      this.userForm.password = ''
      this.userForm.mobile = ''
      this.userForm.company = ''
      // this.userForm.auth = ''
      this.formAddOrModify = 0              // 0-添加 1-编辑
      // 初始化用户表单信息
      this.diaTitle = '添加用户'
      console.log('userTableData.length: ' + this.userTableData.length)
      this.userForm.index = this.userTableData.length
      this.diaShow = true
    },
    // 编辑当前用户-打开对话框
    handleEdit: function (index, row) {
      console.log(index)
      console.log(row)
      this.formAddOrModify = 1
      this.diaTitle = '编辑用户'
      this.userForm.name = this.userTableData[index].name
      this.userForm.account = this.userTableData[index].account
      // this.userForm.password = this.userTableData[index].password
      // this.userForm.password = '******'
      this.userForm.mobile = this.userTableData[index].mobile
      this.userForm.company = this.userTableData[index].company
      this.userForm.auth = this.userTableData[index].auth
      this.userForm.index = index
      this.userForm.userId = row.userId
      this.diaShow = true
    },
    // 查看按钮
    handleRead: function (index, row) {
      console.log('查看按钮')
      console.log(index)
      console.log(row)
      sessionSetStore('logo', row.logo)
      sessionSetStore('sysName', row.sysName)
      sessionSetStore('name', row.name)
      sessionSetStore('userId', row.userId)
      let auth
      if (row.auth === '超级管理员') auth = 0
      if (row.auth === '管理员') auth = 1
      if (row.auth === '查看者') auth = 2
      if (row.auth === '普通用户') auth = 3
      sessionSetStore('auth', auth)
      // 全局网关列表刷新标志位置true，需要刷新
      this.$store.commit('setdeviceGroupRefresh', true)
    },
    // 对话框确定按键
    diaConfirmBtn: function (formName) {
      /* 
        如果是编辑用户，不写密码就不传password，去掉密码项的表单验证，让其placehold为空
        这里用了个迂回的方式，假设修改用户信息时，表单并未修改密码时，判断此时password为空，为其赋值'*******'
        这样就避免了去除密码表单验证必填项的繁琐
        之后后台请求时修改密码时判断是否为'*******',，若是则代表并未修改password，传递password参数为空即可
      */
      if (this.formAddOrModify === 1) {
        if (this.userForm.password === '') {
          this.userForm.password = '*******'
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 根据this.userForm.auth 中文转化为对应代号 用在编辑用户切换
          switch (this.userForm.auth) {
            case '超级管理员':
              this.userForm.auth = 0
              break
            case '管理员':
              this.userForm.auth = 1
              break
            case '查看者':
              this.userForm.auth = 2
              break
            case '普通用户':
              this.userForm.auth = 3
              break
            default:
              console.log('default')
          }
          // 存储param参数
          for (let key in this.userForm) {                      // for...in循环操作对象
            this.param[key] = this.userForm[key]                // K值构建 (对象)
          }
          this.param.userIdMod = this.userForm.userId
          if (this.formAddOrModify === 0) {
            this.backUserAdd()
          } else if (this.formAddOrModify === 1) {
            if (this.param.password === '*******') {
              this.param.password = ''
            }
            this.backUserManagerMod()
          }
          this.diaShow = false
        } else {
          console.log('错误提交')
        }
      })
    },
    // 删除选中行的小组
    handleDelete: function (index, row) {
      console.log(index)
      console.log(row)
      if (row.auth === '超级管理员') {
        this.$message({
          type: 'info',
          message: '超级管理员不可修改删除'
        })
        return
      }
      this.param.userId = row.userId
      this.backUserDel()
    },
    // 回到自己按钮
    goPersonalBtn: function () {
      console.log('回到自己按钮')
      sessionSetStore('name', sessionGetStore('nameMe'))
      sessionSetStore('userId', sessionGetStore('userIdMe'))
      sessionSetStore('auth', sessionGetStore('authMe'))
      sessionSetStore('logo', sessionGetStore('logoMe'))
      sessionSetStore('sysName', sessionGetStore('sysNameMe'))
      sessionSetStore('deviceIdNow', '')
      // 全局网关列表刷新标志位置true，需要刷新
      this.$store.commit('setdeviceGroupRefresh', true)
    },
    /*
    **  **********  API调用相关函数  **********
    */
    // back添加用户
    backUserAdd: function () {
      console.log('back添加用户')
      console.log(this.param)
      back.userAdd(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back用户信息列表获取
        this.backUserInfoListQue()
      }.bind(this))
    },
    // back用户信息列表获取
    backUserInfoListQue: function () {
      console.log('back获取用户信息列表')
      console.log(this.param)
      back.userInfoListQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          let list = []
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.userId = response.data[i].userId
            obj.name = response.data[i].name
            obj.mobile = response.data[i].mobile
            obj.company = response.data[i].company
            obj.account = response.data[i].account
            obj.logo = response.data[i].logo
            obj.sysName = response.data[i].sysName
            // back返给的auth 0,1,2,3 => 对应中文名称
            let auth
            if (response.data[i].auth === 0) auth = '超级管理员'
            if (response.data[i].auth === 1) auth = '管理员'
            if (response.data[i].auth === 2) auth = '查看者'
            if (response.data[i].auth === 3) auth = '普通用户'
            obj.auth = auth
            list[i] = obj
            if (this.param.userId===response.data[i].userId) {
              sessionSetStore('sysName', response.data[i].sysName)
              sessionSetStore('logo', response.data[i].logo)
            }
          }
          this.userTableData = list
        }
      }.bind(this))
    },
    // back修改用户
    backUserManagerMod: function () {
      console.log('back修改用户')
      console.log(this.param)
      back.userManagerMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back用户信息列表获取
        this.backUserInfoListQue()
      }.bind(this))
    },
    // 删除当前用户
    backUserDel: function () {
      console.log('back删除当前用户')
      console.log(this.param)
      back.userDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back用户信息列表获取
        this.backUserInfoListQue()
      }.bind(this))
    },
    /*
    **  **********  辅助方法函数  **********
    */
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
.ip_halfLine{
  margin-bottom: 20px;
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
.right_groupSet .btn_topnav{
  background: url(/static/bg_device_title1.png);
  background-size: 100% 100%;
  color: #fff;
}
.el-main {
  padding: 0px;
  flex: 1;
}
.groupSet >>> .el-header, .el-footer {
  background-color: #FFFFFF;
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
.btn_cancel_dialog{
  margin-left: 30px;
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
