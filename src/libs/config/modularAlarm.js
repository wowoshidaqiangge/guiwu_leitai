/*
  所有的报警项
*/
var modularAlarm = {
  // ispd（8个有效）：雷击、空开、接地、干接点（4）、spd失效
  ispd: [
    {
      index: 1,
      label: 'SPD失效报警',
      warnType: 4,
      streamIdIndex: 3,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 2,
      label: '雷击报警',
      warnType: 1,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 3,
      label: '空开报警',
      warnType: 2,
      streamIdIndex: 1,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 4,
      label: '接地报警',
      warnType: 3,
      streamIdIndex: 2,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 5,
      label: '温湿度报警',
      warnType: 9,
      streamIdIndex: '',
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 6,
      label: '电压值超上限报警',
      warnType: 10,
      streamIdIndex: '',
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 7,
      label: '电压值超下限报警',
      warnType: 11,
      streamIdIndex: '',
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 8,
      label: '可燃气体报警',
      warnType: 5,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 9,
      label: '水位报警',
      warnType: 6,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 10,
      label: '烟感报警',
      warnType: 7,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 11,
      label: '联动报警',
      warnType: 8,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      id: 12,
      label: '电流值超上限',
      warnType: 12,
      streamIdIndex: '',
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      id: 13,
      label: '雷击峰值超上限',
      warnType: 13,
      streamIdIndex: '',
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    }
  ],
  // cj485（12个有效）：雷击、空开、接地、干接点（4）、温湿度、电压（2：上、下）、电流超上限、雷击峰值超上限
  cj485: [
    {
      index: 1,
      label: 'SPD失效报警',
      warnType: 4,
      streamIdIndex: 0, // 0是遥信的索引，但是由于都有spd报警，和涛哥讨论后，使用遥信代替
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 2,
      label: '雷击报警',
      warnType: 1,
      streamIdIndex: 3,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 3,
      label: '空开报警',
      warnType: 2,
      streamIdIndex: 1,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 4,
      label: '接地报警',
      warnType: 3,
      streamIdIndex: 2,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 5,
      label: '温湿度报警',
      warnType: 9,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 6,
      label: '电压值超上限报警',
      warnType: 10,
      streamIdIndex: 5,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 7,
      label: '电压值超下限报警',
      warnType: 11,
      streamIdIndex: 5,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 8,
      label: '可燃气体报警',
      warnType: 5,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 9,
      label: '水位报警',
      warnType: 6,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 10,
      label: '烟感报警',
      warnType: 7,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      index: 11,
      label: '联动报警',
      warnType: 8,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      id: 12,
      label: '电流值超上限',
      warnType: 12,
      streamIdIndex: 7,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      id: 13,
      label: '雷击峰值超上限',
      warnType: 13,
      streamIdIndex: 8,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        },
        {
          label: '<',
          value: '<'
        },
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    }
  ],
  // warnType 对应的label---在报警统计中用到
  warnType: {
    '1': '雷击报警',
    '2': '空开报警',
    '3': '接地报警',
    '4': 'SPD失效报警',
    '5': '可燃气体报警',
    '6': '水位报警',
    '7': '烟感报警',
    '8': '联动报警',
    '9': '温湿度报警',
    '10': '电压值超上限报警',
    '11': '电压值超下限报警',
    '12': '电流值超上限',
    '13': '雷击峰值超上限'
  }
}
export default modularAlarm
