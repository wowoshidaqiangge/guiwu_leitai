<template>
  <div id="userset">
    <!-- <h2>user page</h2> -->
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-title" label-width="120px">
          <el-form-item class="usertitle">
            <span  class="usertitletext">个人中心</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="用户名">
            <el-input readonly v-model="formInline.name"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="changenameBt">更改用户名</el-button>
        </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="公 司">
            <el-input readonly v-model="formInline.company"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changecompanyBt">更改公司</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="手 机">
            <el-input readonly v-model="formInline.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changephoneBt">更改手机</el-button>
          </el-form-item>
          <!-- <el-form-item v-show="false">
            <el-button type="primary" @click="unbindphoneBt">解绑手机</el-button>
          </el-form-item> -->
        </el-form>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="邮 箱">
            <el-input readonly v-model="formInline.mail"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changemailBt">更改邮箱</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="用户ID">
            <el-input readonly v-model="formInline.userId"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row> -->
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="密 码">
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changepassBt">更改密码</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 更改手机号对话框 -->
    <el-dialog title="更改手机号" :visible.sync="phonedialogFormVisible" width="500px" center>
      <el-form ref="phoneruleform" :model="phoneruleform" :rules="rules">
        <el-form-item label="手机号" prop="phone" label-width="80px">
          <el-input type="text" v-model="phoneruleform.phone" auto-complete="off" placeholder="请输入手机号">
          <!-- <el-button slot="append" v-show="!passwordComputedTime" @click.native.prevent="phoneGetVeriCode">获取验证码</el-button>
          <el-button slot="append" v-show="passwordComputedTime">已发送({{passwordComputedTime}}s)</el-button> -->
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="验证码" prop="VeriCode">
          <el-input type="text" v-model="phoneruleform.VeriCode" auto-complete="off" placeholder="请输入验证码"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="changePhoneHandleSave('phoneruleform')">修改</el-button>
          <el-button class="btn_cancel_dialog" @click="phonedialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 更改密码对话框 -->
    <el-dialog title="更改密码" :visible.sync="passdialogFormVisible" width="500px" center>
      <el-form ref="passruleform" :model="passruleform" :rules="rules">
        <el-form-item label="旧密码" prop="oldpass" label-width="80px">
          <el-input type="password" v-model="passruleform.oldpass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass" label-width="80px">
          <el-input type="password" v-model="passruleform.newpass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpass" label-width="80px">
          <el-input type="password" v-model="passruleform.confirmpass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="passHandleChange">修改</el-button>
          <el-button class="btn_cancel_dialog" @click="passdialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
// import 'element-ui/lib/theme-chalk/index.css'
export default {
  data  () {
    // 自定义校验规则
    // 旧密码
    var validatePassOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else if (value !== this.formInline.password) {
        callback(new Error('旧密码不正确'))
      } else {
        if (this.passruleform.newpass !== '') {
          this.$refs.passruleform.validateField('newpass')
        }
        callback()
      }
    }
    // 新密码
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.formInline.password) {
        callback(new Error('新密码不能与旧密码相同'))
      } else {
        if (this.passruleform.confirmpass !== '') {
          this.$refs.passruleform.validateField('confirmpass')
        }
        callback()
      }
    }
    // 确认新密码
    var validatePassConf = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passruleform.newpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 校验验证码
    var checkVeriCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (value.length !== 6) {
        callback(new Error('请输入6位验证码'))
      } else {
        callback()
      }
    }
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else if (value === this.formInline.mobile) {
        callback(new Error('新手机号码不能与旧手机号码相同'))
      } else {
        callback()
      }
    }
    return {
      formInline: {
        name: '',
        mobile: '',
        mail: '',
        company: '',
        password: '',
        userId: ''
      },
      phoneruleform: {
        phone: '',
        VeriCode: '',
        VerCodeToken: ''
      },
      passruleform: {
        oldpass: '',
        address: '',
        confirmpass: ''
      },
      param: {},
      // 校验规则
      rules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        oldpass: [
          {validator: validatePassOld, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ],
        newpass: [
          {validator: validatePassNew, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ],
        confirmpass: [
          {validator: validatePassConf, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ]
      },
      phonedialogFormVisible: false, // 手机号修改对话框
      passdialogFormVisible: false // 密码修改对话框
    }
  },
  //
  // ***************生命周期*********************
  //
  // 生命周期钩子--创建期
  created: function () {
    /// 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 获取用户信息
    this.backGetuserInfo()
  },
  methods: {
    // 更改用户名
    changenameBt () {
      this.$prompt('用户名', '更改用户名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fff\w]{3,18}$/,
        inputErrorMessage: '只能包含数字、字母、汉字和下划线，长度在3~18之间'
      }).then(({value}) => {
        this.formInline.name = value
        // 修改用户信息
        this.backUserInfoModify()
      }).catch(() => {
      })
    },
    // 更改公司
    changecompanyBt () {
      this.$prompt('公司', '更改公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.formInline.company = value
        // 修改用户信息
        this.backUserInfoModify()
      }).catch(() => {
      })
    },
    // 更改手机号
    changephoneBt () {
      this.phoneruleform = {phone: '', VeriCode: ''}
      if (this.passTimer !== undefined) {
        clearInterval(this.passTimer)
      }
      this.phonedialogFormVisible = true
      this.passwordComputedTime = 0
      if (this.$refs.phoneruleform !== undefined) {
        this.$refs.phoneruleform.resetFields()
      }
    },
    // 更改密码
    changepassBt () {
      this.passruleform.oldpass = ''
      this.passruleform.address = ''
      this.passruleform.confirmpass = ''
      this.passdialogFormVisible = true
      if (this.$refs.phoneruleform !== undefined) {
        this.$refs.phoneruleform.resetFields()
      }
    },
    // 确认手机号更改
    changePhoneHandleSave () {
      // 表单验证
      /*
        element-ui中Form表单的validate方法：
          对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      */
      // this.$refs.phoneruleform.validate((valid) => {
      //   // 表单校验结束
      //   if (valid && this.phoneruleform.VeriCode === this.phoneruleform.VerCodeToken) {
      //     // 表单验证通过并且验证码正确
      //     // 显示用户信息的表单对象---更新
      //     this.formInline.mobile = this.phoneruleform.phone
      //     // 修改用户信息
      //     this.backUserInfoModify()
      //     // 更改手机号的对话框---隐藏
      //     this.phonedialogFormVisible = false
      //     // 清除输入信息
      //     this.phoneruleform.phone = ''
      //     this.phoneruleform.VeriCode = ''
      //   } else if (this.phoneruleform.VeriCode !== this.phoneruleform.VerCodeToken) {
      //     // 验证码不正确
      //     this.notificationInfo('错误提示', '验证码不正确')
      //   } else {
      //     // 表单验证未通过
      //     return false
      //   }
      // })
      if (this.phoneruleform.phone === '') {
        this.notificationInfo('提示', '请输入手机号')
      } else if (!(/^[1][0-9]{10}$/.test(this.phoneruleform.phone))) {
        this.notificationInfo('提示', '请输入11位数字')
      } else if (this.phoneruleform.phone !== '' && this.phoneruleform.phone.length === 11) {
        // 显示用户信息的表单对象---更新
        this.formInline.mobile = this.phoneruleform.phone
        // 修改用户信息
        this.backUserInfoModify()
        // 更改手机号的对话框---隐藏
        this.phonedialogFormVisible = false
        // 清除输入信息
        this.phoneruleform.phone = ''
        this.phoneruleform.VeriCode = ''
      }
    },
    // 更改邮箱
    changemailBt () {
      this.$prompt('邮 箱', '更改邮箱', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '格式不正确'
      }).then(({value}) => {
        console.log(value)
        this.formInline.mail = value
        // 修改用户信息
        this.backUserInfoModify()
      }).catch(() => {
      })
    },
    // 确认密码修改
    passHandleChange () {
      this.$refs.passruleform.validate((valid) => {
        if (valid) {
          this.formInline.password = this.passruleform.newpass
          // 修改用户信息
          this.backUserInfoModify()
          this.passdialogFormVisible = false
          this.passruleform.oldpass = ''
          this.passruleform.newpass = ''
          this.passruleform.confirmpass = ''
        } else {
          return false
        }
      })
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // ******************   back   ****************************
    // 用户信息获取
    backGetuserInfo: function () {
      back.getuserInfo(this.param).then(function (response) {
        console.log('用户信息获取')
        console.log(response)
        let obj = {}
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          if (response.data.length !== 0) {
            obj.name = response.data.name
            obj.mobile = response.data.mobile
            obj.company = response.data.company
            obj.password = response.data.password
            // 更新用户名---home页左上角
            this.$store.commit('setUserName', response.data.name)
            // 浏览器本地存储（避免用户刷新页面数据丢失）
            sessionSetStore('name', response.data.name)
            sessionSetStore('nameMe', response.data.name)
            sessionSetStore('password', response.data.password)
          }
        }
        this.formInline = obj
      }.bind(this))
    },
    // 修改用户信息
    backUserInfoModify: function () {
      for (var key in this.formInline) {
        this.param[key] = this.formInline[key]
      }
      console.log(this.param)
      back.userInfoModify(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 用户信息获取
          this.backGetuserInfo()
        }
      }.bind(this))
    }
  }
}
</script>

<style scoped>
  #userset{
    /* background-color: #F8F8FF; */
    overflow-y: auto;
  }
  .from-title{
    width: 100%;
    height: 100%;
    float: left;
    border-bottom: solid 1px silver;
    margin-bottom: 20px;
  }
  .usertitle {
    float: left;
    margin: 0;
     margin-left: 28px;
  }
  .from-inline {
    float: left;
    margin-left: 20px;
  }
  .usertitletext {
    color: #fff;
    font-size: 20px;
  }
  .btn_cancel_dialog{
    margin-left: 30px;
    background: #1C363F;
    color: #08C9DA;
    border: 1px solid #08C9DA;
  }
  .el-message-box__header {
  position: relative;
  padding: 15px 15px 10px;
  /* background-color: #409EFF; */
}
.el-message-box__title {
  padding-left: 0;
  margin-bottom: 0;
  font-size: 18px;
  line-height: 1;
  color: #fff;
  text-align: center;
}
.el-dialog__header {
  padding: 15px 15px 10px;
  /* background-color: #409EFF; */
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #fff;
  text-align: center;
}
</style>
<style>
#userset .el-form-item__label{
  color: #fff;
}
#userset .el-dialog--center .el-dialog__body {
  text-align: center;
}
</style>
