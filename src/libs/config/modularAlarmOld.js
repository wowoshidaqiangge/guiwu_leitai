/*
  所有的报警项
*/
var modularAlarm = {
  // all（11）
  all: [
    {
      index: 1,
      label: 'SPD失效报警',
      warnType: 4,
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 0
      }
    },
    {
      index: 2,
      label: '雷击报警',
      warnType: 1,
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
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 4,
      label: '接地报警',
      warnType: 3,
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 5,
      label: '温湿度报警',
      warnType: 9,
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
      alarmType: [
        {
          label: '>',
          value: '>'
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
      alarmType: [
        {
          label: '<',
          value: '<'
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
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 9,
      label: '水位报警',
      warnType: 6,
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 10,
      label: '烟感报警',
      warnType: 7,
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 11,
      label: '联动报警',
      warnType: 8,
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      id: 12,
      label: '电流值超上限',
      warnType: 12,
      streamIdIndex: 6,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
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
      streamIdIndex: 7,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    }
  ],
  // ispd（8）：雷击、空开、接地、干接点（4）、spd失效
  ispd: [
    {
      index: 1,
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
      index: 2,
      label: '空开报警',
      warnType: 2,
      streamIdIndex: 1,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 3,
      label: '接地报警',
      warnType: 3,
      streamIdIndex: 2,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 4,
      label: 'SPD失效报警',
      warnType: 4,
      streamIdIndex: 3,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 0
      }
    },
    {
      index: 5,
      label: '可燃气体报警',
      warnType: 5,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 6,
      label: '水位报警',
      warnType: 6,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 7,
      label: '烟感报警',
      warnType: 7,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 8,
      label: '联动报警',
      warnType: 8,
      streamIdIndex: 4,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    }
  ],
  // cj485（10）：雷击、空开、接地、干接点（4）、温湿度、电压（2：上、下）
  cj485: [
    {
      index: 1,
      label: '可燃气体报警',
      warnType: 5,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 2,
      label: '水位报警',
      warnType: 6,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 3,
      label: '烟感报警',
      warnType: 7,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 4,
      label: '联动报警',
      warnType: 8,
      streamIdIndex: 0,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 5,
      label: '空开报警',
      warnType: 2,
      streamIdIndex: 1,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 6,
      label: '接地报警',
      warnType: 3,
      streamIdIndex: 2,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '=',
          value: '=='
        }
      ],
      alarmThreshold: {
        input: false,
        value: 1
      }
    },
    {
      index: 7,
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
      index: 8,
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
      index: 9,
      label: '电压值超上限报警',
      warnType: 10,
      streamIdIndex: 5,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      id: 10,
      label: '电压值超下限报警',
      warnType: 11,
      streamIdIndex: 5,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '<',
          value: '<'
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      id: 11,
      label: '电流值超上限',
      warnType: 12,
      streamIdIndex: 6,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
        }
      ],
      alarmThreshold: {
        input: true,
        value: ''
      }
    },
    {
      id: 12,
      label: '雷击峰值超上限',
      warnType: 13,
      streamIdIndex: 7,
      streamId: '',
      streamName: '',
      alarmType: [
        {
          label: '>',
          value: '>'
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
