// 合同状态枚举
export const CONTRACT_STATUS = {
  FAIL: 0,
  AUDIT_PENDING: 1,
  EXEC_PENDING: 2,
  EXECUTING: 3,
  FINISH: 4,
};

// 合同类型枚举
export const CONTRACT_TYPES = {
  MAIN: 0,
  SUB: 1,
  SUPPLEMENT: 2,
};

// 合同收付类型枚举
export const CONTRACT_PAYMENT_TYPES = {
  PAYMENT: 0,
  RECEIPT: 1,
};

// 标签类型
type TagTheme = 'default' | 'success' | 'primary' | 'warning' | 'danger';
// 通知的优先级对应的标签类型
export const NOTIFICATION_TYPES: Map<string, TagTheme> = new Map([
  ['low', 'primary'],
  ['middle', 'warning'],
  ['high', 'danger'],
]);

// 通用请求头
export enum ContentTypeEnum {
  Json = 'application/json;charset=UTF-8',
  FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data;charset=UTF-8',
}

/** ⬇️ 业务新增  ⬆️ 模版自带 */

// table默认分页参数
export const DEFAULT_PAGE_PARAMS = {
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
  showFirstAndLastPageBtn: true,
  totalContent: false,
  showPageSize: false
};

// 性别
export const GENDER = {
  male:'男',
  female: '女',
  unknown:'未知'
}

// 用户状态
export const USER_STATUS = {
  0: {
    text: '正常',
    theme: 'success',
    value: '0'
  },
  1: {
    text: '禁言',
    theme: 'danger',
    value: '1'
  },
  2: {
    text: '冻结',
    theme: 'danger',
    value: '2'
  },
  3: {
    text: '其他',
    theme: 'warning',
    value: '3'
  },
};

// 用户角色
export const MEMBER_LEVEL = [
  { text: '普通', value: 'normal' },
  { text: 'VIP', value: 'vip' },
  { text: 'SVIP', value: 'svip' },
];
