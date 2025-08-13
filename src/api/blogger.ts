import { request } from '@/utils/request';

const Api = {
  BlogList: '/blo/query',
  CreateBlog: '/blo/create',
  UpdateBlog: '/blo/update',
  DelBlog: '/blo/',

  BloAll:'/blo/query-all',
  BloCrawler: '/blo-python/query',
  BloCrawlerCreate: '/blo-python/create',
  BloCrawlerUpdate: '/blo-python/update',
  BloCrawleDel: '/blo-python/delete/',
};

// 查询所有博主
export function getBlogAll(data: any) {
 return request.post({
     url: Api.BloAll,
     data,
   });
}

// 博主列表
export function getBlogList(data: any) {
 return request.post({
     url: Api.BlogList,
     data,
   });
}

// 创建博主
export function createBlog(data: any) {
  return request.post({
      url: Api.CreateBlog,
      data,
    });
}

// 更新博主
export function updateBlog(data: any) {
  return request.put({
      url: Api.UpdateBlog,
      data,
    });
}

// 删除博主
export function delBlog(id: any) {
  return request.delete({
      url: Api.DelBlog + id,
    });
}

// 博主爬虫列表
export function getBlogCrawlerList(data: any) {
  return request.post({
      url: Api.BloCrawler,
      data,
    });
}

// 创建博主爬虫
export function createBlogCrawler(data: any) {
  return request.post({
      url: Api.BloCrawlerCreate,
      data,
    });
}

// 更新博主爬虫
export function updateBlogCrawler(data: any) {
  return request.put({
      url: Api.BloCrawlerUpdate,
      data,
    });
}

// 删除博主爬虫
export function delBlogCrawler(id: any) {
  return request.delete({
      url: Api.BloCrawleDel + id,
    });
}