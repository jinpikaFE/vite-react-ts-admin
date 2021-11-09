import { RouteType } from '@config/routes/type';

/**
 * 当前pathname是否在路由中有，有则返回当前对象，没有就是undefined
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends RouteType>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && path === pathname) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

/**
 *
 * 实现树级递归，生成树形菜单
 * @param {any[]} data 要转换的数组
 * @param {string} key 标识字段
 * @param {string} parentKey 父级字段
 * * @param {Function} cb 对item处理的回调函数
 * @param {string} children 子数组字段
 * @returns
 */
export const toTree = (
  data: any[],
  key: string,
  parentKey: string,
  cb: (param: any) => any,
  children = 'children',
) => {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.children;
  });

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  const map: any = {};
  data.forEach(function (item) {
    map[item?.[key]] = item;
  });
  //        console.log(map);
  const val: any[] = [];
  data.forEach(function (item) {
    // 以当前遍历项，的pid,去map对象中找到索引的id
    const parent = map?.[item?.[parentKey]];
    const newItem = cb(item);
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent?.[children] || (parent[children] = [])).push(newItem);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(newItem);
    }
  });
  return val;
};

/**
 * 上传附件转base64
 * @param {File} file 文件流
 */
export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export type ProvinceType = {
  value: string;
  label: string;
  children?: ProvinceType[];
};
// 省市区数据处理antd格式
export const reduceProvArr = (dataKey: any[], tempArr: ProvinceType[]) => {
  const keyArr = Object.keys(dataKey);
  for (let i = 0; i < keyArr.length; i += 1) {
    const itemObj: ProvinceType = {
      value: keyArr[i],
      label: keyArr[i],
    };
    if (
      Object.keys(dataKey?.[keyArr?.[i] as any]) &&
      Object.keys(dataKey?.[keyArr?.[i] as any])[0] !== '0'
    ) {
      itemObj.children = [];
      reduceProvArr(dataKey?.[keyArr?.[i] as any], itemObj.children);
    } else {
      itemObj.children = [];
      const cDataKey = dataKey?.[keyArr?.[i] as any];
      for (let j = 0; j < cDataKey.length; j += 1) {
        const cItemObj: ProvinceType = {
          value: cDataKey[j],
          label: cDataKey[j],
        };
        itemObj.children.push(cItemObj);
      }
    }
    tempArr.push(itemObj);
  }
};

//自定义cookie对象
export const cookie = {
  /**
   *
   * @param name cookie键
   * @param value cookie值
   */
  setCookie: function (name: string, value: string) {
    const curDate = new Date();
    //当前时间戳
    const curTamp = curDate.getTime();
    //当前日期
    const curDay = curDate.toLocaleDateString();
    let curWeeHours = 0;
    if (
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent)
    ) {
      //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
      curWeeHours = new Date(curDay).getTime() + 8 * 60 * 60 * 1000 - 1;
    } else {
      curWeeHours = new Date(curDay).getTime() - 1;
    }
    //当日已经过去的时间（毫秒）
    const passedTamp = curTamp - curWeeHours;
    //当日剩余时间
    let leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
    if (
      !(
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent)
      )
    ) {
      leftTamp = leftTamp + 8 * 60 * 60 * 1000;
    }
    const leftTime = new Date();
    leftTime.setTime(leftTamp + curTamp);
    //创建cookie
    document.cookie =
      name + '=' + value + ';expires=' + leftTime.toUTCString() + ';path=/';
  },
  getCookie: function (name: string) {
    //name 为想要取到的键值的键名
    const reg = /\s/g;
    const result = document.cookie.replace(reg, '');
    const resultArr = result.split(';');
    for (let i = 0; i < resultArr.length; i++) {
      const nameArr = resultArr[i].split('=');
      if (nameArr[0] == name) {
        return nameArr[1];
      }
    }
  },
  removeCookie: function (name: string) {
    //name为想要删除的Cookie的键名
    const oDate = new Date(); //时间对象
    oDate.setDate(new Date().getDate() - 1);
    document.cookie = name + '=123;expires=' + oDate + ';path=/';
  },
};
