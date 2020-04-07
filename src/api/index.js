import axios from 'axios'
import * as url from './urlConfig'
// import paramCase = require('param-case');

export const onenet = {
  //
  // ****************反向代理*****************
  //
  // 设备
  // 精确查询单个设备
  // 传入参数：apikey，设备id
  // 返回:设备名称、在线状态、数据流等信息
  onenetDevSingleQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 设备
  // 模糊查询设备
  // 参数：api-Key，不带其它参数
  // 返回：该产品下的所有设备的参数信息
  onenetDevQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 设备
  // 批量查询设备最新数据
  // 传入参数：apikey，需要查询的设备id
  // 返回各个设备的最新数据，设备Id,设备名，设备数据流名称，数据点最新时间，数据点值
  onenetDataRequire (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/datapoints?devIds=${param.deviceId}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetLimitHisQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datastreams?datastream_ids=${param.datastreamId}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询设备历史数据---第一次查询
  // 传入参数：apikey，需要查询的设备id，开始时间
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartOneHisQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询设备历史数据
  // 传入参数：apikey，需要查询的设备id，开始时间
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartOneHisQue1 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId1}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartOneHisQue2 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId2}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartOneHisQue3 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId3}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartOneHisQue4 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId4}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点，限制查询数据点的个数
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartNextHisQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&cursor=${param.cursor}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点，限制查询数据点的个数
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartNextHisQue1 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId1}&start=${param.startTime}&cursor=${param.cursor1}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartNextHisQue2 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId2}&start=${param.startTime}&cursor=${param.cursor2}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartNextHisQue3 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId3}&start=${param.startTime}&cursor=${param.cursor3}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartNextHisQue4 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId4}&start=${param.startTime}&cursor=${param.cursor4}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.9 onenet获取走势（历史数据）接口---初始
  // 查询设备历史数据
  // 传入参数：apikey，需要查询的设备id，开始时间
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetHisTrendQueStart (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&end=${param.endTime}&duration=${param.duration}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.10 onenet获取走势（历史数据）接口---第二次及以后的
  // 查询设备历史数据
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetHisTrendQueNext (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&end=${param.endTime}&duration=${param.duration}&limit=${param.limit}&cursor=${param.cursor}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

// 后台接口
export const back = {
  // 1.用户模块
  // 1.1 用户注册
  userRegister (param) {
    return axios({
      url: `${url.backbasurl}/api/user`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name, // 用户名，16字符以内
        password: param.password, // 密码，16字符以内
        company: param.company, // 公司，20字符以内
        mobile: param.mobile, // 手机号，11字符
        code: param.code // 短信验证码，6位数字
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 1.2 用户登录
  userLogin (param) {
    return axios({
      url: `${url.backbasurl}/api/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        password: param.password,
        account: param.account
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 1.3 用户信息获取
  getuserInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/user`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 1.4 修改用户信息
  userInfoModify (param) {
    return axios({
      url: `${url.backbasurl}/api/user`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {
        name: param.name, // 用户名
        mobile: param.mobile, // 手机号
        password: param.password, // 密码
        company: param.company // 公司
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 1.5 获取用户统计模块初始设置
  getIndexModule (param) {
    return axios({
      url: `${url.backbasurl}/api/user/module`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 1.6 用户统计模块初始设置
  setIndexModule (param) {
    return axios({
      url: `${url.backbasurl}/api/user/module`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
        // 'Authorization': param.Authorization
      },
      data: {
        moduleList: param.moduleList // 首页配置
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 1.7 修改用户统计模块配置
  modifyIndexModule (param) {
    return axios({
      url: `${url.backbasurl}/api/user/module`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
        // 'Authorization': param.Authorization
      },
      data: {
        moduleList: param.moduleList // 首页配置
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 2.网关模块
  // 2.1 添加网关
  addNetgate (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
        // 'Authorization': param.Authorization
      },
      data: {
        sn: param.sn, // 网关序列号,不超过16字符
        password: param.password, // 网关密码，6位
        name: param.name, // 网关名字，不超过16字符
        location: param.location, // 网关三维坐标，JSON格式
        groupUid: param.groupUid, // 网关组UID
        province: param.province, // 设备所在省份
        city: param.city // 设备所在城市
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 2.2 新增网关分组
  addNetGroup (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate/group`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        groupName: param.groupName // 网关分组名
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 2.3 查询网关信息
  getNetInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 2.4 修改网关分组名
  devGroupNameMod (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate/group`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        groupName: param.groupName, // 网关分组名
        groupUid: param.groupUid // 网关分组UID
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 2.5 修改网关信息
  devMod (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        sn: param.sn, // 网关sn
        name: param.name, // 网关名称
        location: param.location, // {"lon":12, "lat": 13, "ele": 13}
        installTime: param.installTime // 安装时间
        // installCompany: param.installCompany,   // 安装公司
        // operator: param.operator               // 安装人员
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 2.6 删除网关
  deleteNetgate (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate?sn=${param.sn}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'Authorization': param.Authorization,
        // 'userId': param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 2.7 删除网关分组
  deleteNetGroup (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate/group?groupUid=${
        param.deviceGroupId
      }`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.设备模块
  // 3.1 添加设备
  addDevice (param) {
    return axios({
      url: `${url.backbasurl}/api/device`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {
        name: param.name, // 设备名称
        queryTime: param.queryTime, // 查询时间
        type: param.type, // 设备类型
        station: param.station, // 设备站号
        crc: param.crc, // CRC校验
        deadArea: param.deadArea, // 死区设置
        sn: param.sn, // 网关sn
        installTime: param.installTime, // 安装时间
        nodeMac: param.nodeMac, // 节点Mac
        province: param.province, // 省份
        city: param.city, // 城市
        location: param.location, // 设备三维坐标
        streamNameList: param.streamNameList // 监控点配置
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.2 查询设备信息
  deviceInfoQue (param) {
    return axios({
      url: `${url.backbasurl}/api/device?mac=${param.mac}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
        // 'Authorization': param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.3 修改设备信息
  changeDevice (param) {
    return axios({
      url: `${url.backbasurl}/api/device`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        mac: param.mac, // 设备MAC
        deviceId: param.deviceId, // 设备ID
        apiKey: param.apiKey, // 产品apiKey
        name: param.name, // 设备名称
        isUpdate: parseInt(param.isUpdate), // 该参数表示是否需要修改设备的相关参数。0：不修改；1：修改。
        crc: param.crc, // CRC校验
        deadArea: param.deadArea, // 死区设置
        type: param.type, // 设备类型
        station: param.station, // 设备站号
        queryTime: param.queryTime, // 查询时间
        installTime: param.installTime, // 安装日期
        nodeMac: param.nodeMac, // 节点Mac
        province: param.province, // 省份
        city: param.city, // 城市
        location: param.location, // 设备三维坐标
        streamNameList: param.streamNameList // 监控点配置
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.4 删除设备
  deleteDevice (param) {
    return axios({
      url: `${url.backbasurl}/api/device`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': param.Authorization,
        userId: param.userId
      },
      data: {
        mac: param.mac // 设备MAC
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.5 获取全部类型设备的基本信息
  deviceAllTypeInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/device/type`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.6 获取账号下全部设备信息---无网关层级
  allDeviceInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/device/all`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.7 设备远程控制命令发送
  remoteControl (param) {
    return axios({
      url: `${url.backbasurl}/api/device/order`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {
        sn: param.sn, // 网关sn
        mac: param.mac, // 设备mac
        streamId: param.streamId, // 数据流id
        value: param.value // 值
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 3.8 获取账号下全部设备信息---有网关层级
  allDeviceInfoGateway (param) {
    return axios({
      url: `${url.backbasurl}/api/device/list`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 4.关联模块
  // 4.1 获取用户下网关列表
  userDevQue (param) {
    return axios({
      url: `${url.backbasurl}/api/relation/user/netgates`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 4.2 获取网关下设备列表
  relatioDevices (param) {
    return axios({
      url: `${url.backbasurl}/api/relation/netgate/devices?sn=${
        param.sn
      }`,
      method: 'get'
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 4.3 获取网关下监控点列表
  relatioMonitorPoint (param) {
    return axios({
      url: `${url.backbasurl}/api/relation/netgate/streams?sn=${
        param.sn
      }`,
      method: 'get'
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 5.工具模块
  // 5.1 发送短信验证码
  relatioNetgate (param) {
    return axios({
      url: `${url.backbasurl}/api/util/sms?mobile=${
        param.mobile
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 5.2 检查网关是否需要更新
  gatewayUpdateCheck (param) {
    return axios({
      url: `${url.backbasurl}/api/util/update?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 5.3 开始网关更新
  gatewayUpdate (param) {
    return axios({
      url: `${url.backbasurl}/api/util/update?sn=${
        param.sn
      }&type=${param.type}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 5.4 刷新token(未完成)
  refreshToken (param) {
    return axios({
      url: `${url.backbasurl}/api/util/token`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6. 报警模块
  // 6.1 添加触发器
  addTrigger (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
        // userId: param.userId
        // Authorization: param.Authorization
      },
      data: {
        sn: param.sn,
        triggerEtyList: param.triggerEtyList
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.2 获取当前未处理的报警信息
  getUndealTrigger (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/current?sn=${
        param.sn
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.2-x 查询全部设备当前报警
  getTriggerCurrentAll (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/current/all`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.3-A 确认当前报警
  comfirmTrigger (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/current?id=${
        param.id
      }`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.3-B 确认当前报警（批量）
  comfirmTriggerBatch (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/current/all`,
      method: "put",
      headers: {
        "Content-Type": "application/json"
        // userId: param.userId,
        // Authorization: param.Authorization
      },
      data: param.idArry
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  // 6.4  获取历史报警
  getHisTrigger (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/history?sn=${
        param.sn
      }&startTime=${param.startTime}&endTime=${param.endTime}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.5 添加报警联系人
  addTriggerPerson (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        mobile: param.mobile,
        enable: param.enable
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.6 获取报警联系人列表
  getTriggerList (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact/list?sn=${
        param.sn
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.7 获取触发器列表
  trListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/list?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.8 修改触发器
  trUpdate (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        streamId: param.streamId,
        type: param.type,
        threshold: param.threshold,
        content: param.content,
        triggerId: param.triggerId,
        streamName: param.streamName,
        warnType: param.warnType
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.9 删除触发器
  trDel (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        sn: param.sn,
        triggerId: param.triggerId
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.10 修改报警联系人
  contactMod (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        id: param.id, // 报警联系人id
        name: param.name,
        mobile: param.mobile,
        enable: param.enable
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.11 删除报警联系人
  contactDel (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact?id=${param.id}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 6.12 获取用户下所有的设备报警统计信息
  alarmStatistics (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/device?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 7. 用户管理模块
  // 7.1 新增用户
  userAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/manager/user`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {
        name: param.name,
        account: param.account,
        password: param.password,
        mobile: param.mobile, // 选填
        company: param.company, // 选填
        auth: param.auth // 0-超级(不可添加) 1-管理员 2-查看者 3-普通用户
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 7.2 修改用户信息
  userManagerMod (param) {
    let obj = {
      userId: param.userIdMod,
      name: param.name,
      account: param.account,
      mobile: param.mobile, // 选填
      company: param.company, // 选填
      auth: param.auth
    };
    if (param.password && param.password !== "") {
      obj.password = param.password;
    }
    return axios({
      url: `${url.backbasurl}/api/manager/user`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: obj
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  // 7.3 获取用户列表
  userInfoListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/manager/user/list`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 7.4 删除用户
  userDel (param) {
    return axios({
      url: `${url.backbasurl}/api/manager/user?userId=${
        param.userId
      }`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId,
        Authorization: param.Authorization
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // *********
  // 获取oss签名数据
  ossInfo () {
    return axios({
      url: `http://picture.thingcom.com/web/token`,
      method: 'get',
      headers: {},
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8. 数据统计模块
  // 8.1 设备在线状态统计
  statueStatistics (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/device/state?auth=${
        param.auth
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8.2 获取设备城市分布
  cityDistribution (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/device/city?auth=${
        param.auth
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8.3 获取设备类型统计
  typeStatistics (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/device/type?auth=${
        param.auth
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8.4 获取故障数目统计
  faultNumStatistics (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/warn/number?auth=${
        param.auth
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8.5 故障原因（类型）统计
  faultReasonStatistics (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/warn/type?auth=${
        param.auth
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8.6 30天故障统计
  fault30Statistics (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/warn/month?auth=${
        param.auth
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8.7 中间的聚合数据展示
  aggregateData (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/union?auth=${
        param.auth
      }`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 8.8 统计模块公用接口
  statisticsInfoCommon (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/count?auth=${param.auth}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {
        contentType: param.contentType,
        device: param.device,
        time: param.time
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
    
  // 9. 数据统计模块
  // 9.1 获取页面左右两侧dom结构
  getDomData (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/order`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 9.2 修改页面左右两侧dom结构
  setDomData (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/order`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {
        order: param.domSort
      }
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 10. 其他
  // 10.1 获取地图所有主题风格
  getMapAllStyle (param) {
    return axios({
      url: `${url.backbasurl}/api/analyze/order`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 10.2 设置地图主题
  setMapStyle (param) {
    return axios({
      url: `${url.backbasurl}/api/user/map?map=${param.mapStyle}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        userId: param.userId
      },
      data: {}
    })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
