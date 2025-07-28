interface TendItem {
  growUp?: number;
  productName: string;
  count: number;
  date: string;
}

export const SALE_TEND_LIST: Array<TendItem> = [
  {
    growUp: 1,
    productName: '国家电网有限公司',
    count: 7059,
    date: '2021-09-01',
  },
  {
    growUp: -1,
    productName: '深圳燃气集团股份有限公司',
    count: 6437,
    date: '2021-09-01',
  },
  {
    growUp: 4,
    productName: '国家烟草专卖局',
    count: 4221,
    date: '2021-09-01',
  },
  {
    growUp: 3,
    productName: '中国电信集团有限公司',
    count: 3317,
    date: '2021-09-01',
  },
  {
    growUp: -3,
    productName: '中国移动通信集团有限公司',
    count: 3015,
    date: '2021-09-01',
  },
  {
    growUp: -3,
    productName: '新余市办公用户采购项目',
    count: 2015,
    date: '2021-09-12',
  },
];
