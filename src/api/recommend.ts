import { request } from '@/utils/request';

const Api = {
  TagtList: '/tags/',
  UpdateTag: '/tags/',
  CreateTag: '/tags/',
  DeleteTag: '/tags/',
};

// 列表
export function getTagList(data: any) {
  return request.get({
    url: Api.TagtList,
    data,
  });
}


// 新增
export function createTag(data: any) {
  return request.post({
    url: Api.CreateTag,
    data,
  })
}

// 更新
export function updateTag(data: any) {
  return request.put({
    url: Api.UpdateTag + data.id + '/',
    data,
  })
}

// 删除
export function deleteTag(id: string) {
  return request.delete({
    url: Api.DeleteTag + id + '/',
  });
}
