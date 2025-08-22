import { request } from '@/utils/request';

const Api = {
  TagtList: '/tag/list',
 UpdateTag: '/tag/update',
};

// 列表
export function getTagList(data: any) {
  return request.post({
    url: Api.TagtList,
    data,
  });
}

// 更新
export function updateTag(data: any) {
  return request.put({
    url: Api.UpdateTag,
    data,
  })
}