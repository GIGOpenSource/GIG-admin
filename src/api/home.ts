import { request } from '@/utils/request';

const Api = {
  HomeDashboard: '/home/dashboard',
  HomeChart: '/home/chart',
};

// 表格
export function getDataList() {
  return request.get({
    url: Api.HomeDashboard,
  });
}

// 图标
export function getChartData() {
  return request.get({
    url: Api.HomeChart,
  });
}
