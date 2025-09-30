import { request } from '@/utils/request';

const Api = {
  CreateContent: '/contents/',
  UpdateContent: '/contents/',
  ContentList: '/contents/',
  AuditContent: '/content-chapter/review/',
  DelContent: '/contents/',
  DataStatistics: '/content-chapter/statistics/',
  DelCommment: '/content-chapter/comment/delete',
  ContentChapters: '/content-chapter/chapters',

  ContentCategory: '/content-chapter/category/list',
  CteateCatrgory: '/content-chapter/category/create',
  UpdateCatrgory: '/content-chapter/category/update',
  CatrgoryDetail: '/content-chapter/category/detail/',
  DelCatrgory: '/content-chapter/category/delete',
  CatrgoryTree: '/content-chapter/category/tree',

};

// 创建内容
export function createContent(data: any) {
  return request.post({
    url: Api.CreateContent,
    data,
  });
}

// 更新内容
export function updateContent(data: any) {
  return request.put({
    url: Api.UpdateContent + data.id + '/',
    data,
  });
}

// 内容列表
export function getContentList(data: any) {
  return request.get({
    url: Api.ContentList,
    data,
  });
}

// 内容章节列表
export function getContentChapters(data: any) {
  return request.post({
    url: Api.ContentChapters,
    data,
  });
}

// 审核内容
export function auditContent(data: any) {
  return request.put({
    url: `${Api.AuditContent}${data.id}`,
    data: {
      reviewStatus: data.status,
    },
  });
}

// 删除内容
export function delContent(data: any) {
  return request.delete({
    url: Api.DelContent + data.id + '/',
    data,
  });
}

// 查看数据
export function dataStatistics(data: any) {
  return request.get({
    url: `${Api.DataStatistics}${data.id}`,
  });
}

// 删除评论
export function delCommment(data: any) {
  return request.delete({
    url: Api.DelCommment,
    data,
  });
}


// 内容分类
export function contentCategory(data: any) {
  return request.post({
    url: Api.ContentCategory,
    data,
  })
}

// 创建分类
export function createCategory(data: any) {
  return request.post({
    url: Api.CteateCatrgory,
    data,
  })
}

// 分类树
export function categoryTree() {
  return request.get({
    url: Api.CatrgoryTree,
  })
}

// 分类详情
export function categoryDetail(id: number | string) {
  console.log("🚀 ~ categoryDetail ~ d:", id)
  return request.get({
    url: `${Api.CatrgoryDetail}${id}`,
  })
}

// 更新分类
export function updateCategory(data: any) {
  return request.put({
    url: Api.UpdateCatrgory,
    data,
  })
}

// 删除分类
export function delCategory(data: any) {
  return request.delete({
    url: Api.DelCatrgory,
    data,
  })
}