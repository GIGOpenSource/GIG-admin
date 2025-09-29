import { request } from '@/utils/request';

const Api = {
  TagtList: '/tags/',
  UpdateTag: '/tag/update',
};

// 列表
export function getTagList(data: any) {
  return request.get({
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
