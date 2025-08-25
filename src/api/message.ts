import { request } from '@/utils/request';

const Api = {
    // MessageList: '/message/sessions',
    MessageList: '/message/simple/list',
    MessageDetails: '/message/details/',
    MessageDetailsByTime: '/message/session/details',
    InformsList: '/message/informs',
    DelInforms: '/message/inform/',
    CteateInforms: '/message/inform/create',
    UpdateInforms: '/message/update',
};

// 消息会话列表查询
export function getMessageList(data: any) {
    return request.post({
        url: Api.MessageList,
        data,
    });
}

//根据会话id和时间范围查询详情
export function getMessageDetailsByTime(data: any) {
    // const query = new URLSearchParams(data).toString()
    // return request.post({
    //     url: `${Api.MessageDetailsByTime}${sessionId}?${query}`,
    // })
    return request.post({
        url: Api.MessageDetailsByTime,
        data,
    });
}

//消息通知列表
export function getInformsList(data: any) {
    return request.post({
        url: Api.InformsList,
        data,
    });
}

//  根据ID删除消息通知 待测试
export function delInforms(id: any) {
    return request.delete({
        url: Api.DelInforms + id,
    });
}

// 创建消息通知
export function createInforms(data: any) {
    return request.post({
        url: Api.CteateInforms,
        data,
    })
}
// 更新分类
export function updateInforms(data: any) {
    return request.put({
        url: Api.UpdateInforms,
        data,
    })
}