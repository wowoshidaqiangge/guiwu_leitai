// //////////////////////////////////////////
//
//   localStorage
//
// //////////////////////////////////////////
export function export2Excel (columns, list, excelname) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('../../excel/Export2Excel')
    let tHeader = []
    let filterVal = []
    console.log(columns)
    if (!columns) {
      return
    }
    columns.forEach(item => {
      tHeader.push(item.name);
      filterVal.push(item.prop);
    })
    const data = list.map(v => filterVal.map(j => v[j]));
    export_json_to_excel(tHeader, data, excelname);
  })
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}
/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}
/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}
// //////////////////////////////////////////
//
//   sessionStorage
//
// //////////////////////////////////////////
/**
 * 存储sessionStorage
 */
export const sessionSetStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}
/**
 * 获取sessionStorage
 */
export const sessionGetStore = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}
/**
 * 删除sessionStorage
 */
export const sessionRemoveStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}
/**
 * 删除所有sessionStorage
 */
export const sessionClearStore = () => {
  window.sessionStorage.clear()
}
