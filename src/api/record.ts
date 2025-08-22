import { request } from '@/utils/request';

const Api = {
    ConsumeList: '/record-query/consumption-records',
    RechargeList: '/record-query/recharge-records',
};

// 充值记录列表
export function getRechargeList(data: any) {
    return request.post({
        url: Api.RechargeList,
        data,
    });
}

// 消费记录列表
export function getConsumeList(data: any) {
    return request.post({
        url: Api.ConsumeList,
        data,
    });
}