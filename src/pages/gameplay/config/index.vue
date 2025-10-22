<template>
  <div class="gameplay-config-container">
    <t-card title="玩法配置" :bordered="false">
      <t-form :data="formData" :label-width="120">
        <t-row :gutter="[24, 24]">
          <t-col :span="12">
            <t-form-item label="玩法名称">
              <t-input v-model="formData.name" disabled />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="玩法类型">
              <t-input v-model="formData.type" disabled />
            </t-form-item>
          </t-col>
        </t-row>

        <t-row :gutter="[24, 24]">
          <t-col :span="12">
            <t-form-item label="开始时间">
              <t-date-picker v-model="formData.startTime" type="datetime" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="结束时间">
              <t-date-picker v-model="formData.endTime" type="datetime" />
            </t-form-item>
          </t-col>
        </t-row>

        <t-row :gutter="[24, 24]">
          <t-col :span="12">
            <t-form-item label="最大参与人数">
              <t-input-number v-model="formData.maxParticipants" :min="1" :max="10000" />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="参与费用">
              <t-input-number v-model="formData.participationFee" :min="0" :precision="2" />
            </t-form-item>
          </t-col>
        </t-row>

        <t-form-item label="玩法规则">
          <t-textarea v-model="formData.rules" placeholder="请输入玩法规则" :maxlength="1000" />
        </t-form-item>

        <t-form-item label="奖励配置">
          <div class="reward-config">
            <t-row :gutter="[16, 16]">
              <t-col :span="8" v-for="(reward, index) in formData.rewards" :key="index">
                <t-card :bordered="true" size="small">
                  <div class="reward-item">
                    <t-form-item :label="`奖励${index + 1}`">
                      <t-input v-model="reward.name" placeholder="奖励名称" />
                    </t-form-item>
                    <t-form-item label="数量">
                      <t-input-number v-model="reward.quantity" :min="1" />
                    </t-form-item>
                    <t-form-item label="概率(%)">
                      <t-input-number v-model="reward.probability" :min="0" :max="100" :precision="2" />
                    </t-form-item>
                    <t-button theme="danger" size="small" @click="removeReward(index)">删除</t-button>
                  </div>
                </t-card>
              </t-col>
            </t-row>
            <t-button theme="primary" @click="addReward" style="margin-top: 16px">添加奖励</t-button>
          </div>
        </t-form-item>

        <t-form-item label="特殊设置">
          <t-checkbox-group v-model="formData.specialSettings">
            <t-checkbox value="allowRepeat">允许重复参与</t-checkbox>
            <t-checkbox value="requireVerification">需要身份验证</t-checkbox>
            <t-checkbox value="enableNotification">启用通知</t-checkbox>
            <t-checkbox value="enableRanking">启用排行榜</t-checkbox>
          </t-checkbox-group>
        </t-form-item>
      </t-form>

      <template #footer>
        <t-space>
          <t-button theme="primary" @click="handleSave">保存配置</t-button>
          <t-button theme="default" @click="handleReset">重置</t-button>
          <t-button theme="default" @click="handlePreview">预览</t-button>
        </t-space>
      </template>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getGameplayConfig, updateGameplayConfig } from '@/api/gameplay';

interface RewardItem {
  name: string;
  quantity: number;
  probability: number;
}

interface FormData {
  id: number;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  participationFee: number;
  rules: string;
  rewards: RewardItem[];
  specialSettings: string[];
}

const formData = reactive<FormData>({
  id: 0,
  name: '',
  type: '',
  startTime: '',
  endTime: '',
  maxParticipants: 100,
  participationFee: 0,
  rules: '',
  rewards: [],
  specialSettings: [],
});

const addReward = () => {
  formData.rewards.push({
    name: '',
    quantity: 1,
    probability: 0,
  });
};

const removeReward = (index: number) => {
  formData.rewards.splice(index, 1);
};

const handleSave = async () => {
  try {
    await updateGameplayConfig(formData);
    MessagePlugin.success('配置保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    MessagePlugin.error('保存失败，请重试');
  }
};

const handleReset = () => {
  // 重置表单数据
  Object.assign(formData, {
    startTime: '',
    endTime: '',
    maxParticipants: 100,
    participationFee: 0,
    rules: '',
    rewards: [],
    specialSettings: [],
  });
};

const handlePreview = () => {
  MessagePlugin.info('预览功能开发中...');
};

const loadConfig = async () => {
  try {
    const res = await getGameplayConfig(formData.id);
    Object.assign(formData, res.data);
  } catch (error) {
    console.error('加载配置失败:', error);
    MessagePlugin.error('加载配置失败');
  }
};

onMounted(() => {
  // 从URL参数获取玩法ID
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (id) {
    formData.id = parseInt(id);
    loadConfig();
  }
});
</script>

<style lang="less" scoped>
.gameplay-config-container {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);
}

.reward-config {
  .reward-item {
    .t-form-item {
      margin-bottom: 12px;
    }
  }
}
</style>
