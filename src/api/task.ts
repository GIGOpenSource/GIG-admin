import { request } from '@/utils/request';

const Api = {
  TaskList: '/tasks/template/',
  RewardTaskList: '/tasks/reward/',
  CreateTask: '/tasks/template/',
  UpdateTask: '/tasks/template/',
  DeleteTask: '/tasks/template/',
};

// 获取任务列表
export function getTaskList(data: any) {
  return request.get({
    url: Api.TaskList,
    data,
  });
}

// 新增任务
export function createTask(data: any) {
  return request.post({
    url: Api.CreateTask,
    data,
  });
}

// 更新任务
export function updateTask(data: any) {
  return request.put({
    url: Api.UpdateTask + data.id + '/',
    data,
  });
}

// 删除任务
export function deleteTask(id: number) {
  return request.delete({
    url: Api.DeleteTask + id + '/',
  });
}
//获取领取任务列表
export function getRewardTaskList(data: any) {
  return request.get({
    url: Api.RewardTaskList,
    data,
  });
}
