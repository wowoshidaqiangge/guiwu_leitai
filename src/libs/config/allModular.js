/*
  首页模块的所有选择项
*/
var allModular = [
  {
    // id
    id: 1,
    // 描述
    label: '设备状态统计',
    // 值
    value: 'deviceState',
    // 是否禁用
    disabled: false,
    // 支持的图表类型
    echartsType: 'proportion',
    // 支持的设备
    deviceType: 'noFit',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 2,
    label: '设备城市分布',
    value: 'deviceDistribution',
    disabled: false,
    echartsType: 'proportion',
    deviceType: 'noFit',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 3,
    label: '设备类型统计',
    value: 'deviceType',
    disabled: false,
    echartsType: 'proportion',
    deviceType: 'noFit',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 4,
    label: '报警处理情况统计',
    value: 'alarmHandle',
    disabled: false,
    echartsType: 'proportion',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 5,
    label: '报警原因统计',
    value: 'alarmReason',
    disabled: false,
    echartsType: 'pieAndAnnular',
    // echartsType: 'proportion',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 6,
    label: '报警次数统计',
    value: 'alarmNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 7,
    label: 'SPD失效报警次数统计',
    value: 'spdNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allIspd',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 8,
    label: '雷击报警次数统计',
    value: 'thunderstrikeNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 9,
    label: '空开报警次数统计',
    value: 'emptyOpenNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 10,
    label: '接地报警次数统计',
    value: 'groundingNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 11,
    label: '温湿度报警次数统计',
    value: 'humitureOverrunNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allCj485',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 12,
    label: '电压超限报警次数统计',
    value: 'voltageOverrunNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allCj485',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 13,
    label: '电压值超上限次数统计',
    value: 'voltageOverrunUpper',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allCj485',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 14,
    label: '电压值超下限次数统计',
    value: 'voltageOverrunLower',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allCj485',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 15,
    label: '可燃气体报警次数统计',
    value: 'combustibleGasNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 16,
    label: '水位报警次数统计',
    value: 'waterLevelNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 17,
    label: '烟感报警次数统计',
    value: 'smokeAlarmNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 18,
    label: '联动报警次数统计',
    value: 'togetherNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allType',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 19,
    label: '电流值走势',
    value: 'galvanicCurrent',
    // disabled: true,
    disabled: false,
    echartsType: 'trend',
    deviceType: 'cj485',
    // 使用的接口
    api: 'Onenet'
  },
  {
    id: 20,
    label: '功耗值走势',
    value: 'powerWaste',
    // disabled: true,
    echartsType: 'trend',
    deviceType: 'cj485',
    // 使用的接口
    api: 'Onenet'
  },
  {
    id: 21,
    label: '接地电阻阻值走势',
    value: 'electricResistance',
    // disabled: true,
    echartsType: 'trend',
    deviceType: 'cj485',
    // 使用的接口
    api: 'Onenet'
  },
  {
    id: 22,
    label: '雷击峰值走势',
    value: 'thunderstrikePeakValue',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'cj485',
    // 使用的接口
    api: 'Onenet'
  },
  {
    id: 23,
    label: '远控操作次数统计',
    value: 'remoteControlNum',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'ispd',
    // 使用的接口
    api: 'Common'
  },
  // {
  //   id: 24,
  //   label: 'spd失效Onenet测试',
  //   value: 'spdOnenetTest',
  //   disabled: false,
  //   echartsType: 'trend',
  //   deviceType: 'ispd',
  //   // 使用的接口
  //   api: 'Onenet'
  // },
  {
    id: 25,
    label: '电流值超上限次数统计',
    value: 'currentValueUpper',
    disabled: false,
    echartsType: 'trend',
    deviceType: 'allCj485',
    // 使用的接口
    api: 'Common'
  },
  {
    id: 26,
    label: '接地电阻阻值超上限统计',
    value: 'electricResistanceUpper',
    // disabled: true,
    echartsType: 'proportion',
    deviceType: 'cj485',
    // 使用的接口
    api: 'Common'
  }
]
/*
  20  功耗值
  21  接地电阻阻值
  22  雷击峰值
  对应什么设备
*/
export default allModular
