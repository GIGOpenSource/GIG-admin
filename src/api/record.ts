import { request } from '@/utils/request';

const Api = {
    ConsumeList: '/auth/purchases/',
    RechargeList: '/orders/',
    ConsumeDetails: '/auth/purchases/'
};

// 充值记录列表
export function getRechargeList(data: any) {
    return request.get({
        url: Api.RechargeList,
        data,
    });
}

// 消费记录列表
export function getConsumeList(data: any) {
    return request.get({
        url: Api.ConsumeList,
        data,
    });
}

// 消费记录详情
export function getConsumeDetails(id: string | number) {
    return request.get({
        url: `${Api.ConsumeDetails}${id}/detail-info/`,
    }, {
        joinTime: false
    });
}
