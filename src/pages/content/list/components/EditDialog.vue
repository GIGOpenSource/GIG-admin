<template>
  <!-- 小说动漫漫画编辑 -->
  <t-dialog
    v-model:visible="visible"
    :width="600"
    header="小说/动漫/漫画编辑"
    confirm-btn="保存"
    style="width: 100%"
    @cancel="onCancel"
  >
    <t-form ref="formRef" :model="data" label-width="60px" label-align="right">
      <t-row>
        <t-col :span="4">
          <t-form-item label="封面" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="上传封面" readonly />
          </t-form-item>
        </t-col>
        <t-col :span="8">
          <t-form-item label="名称" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" readonly />
          </t-form-item>
          <t-form-item label="作者" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" readonly />
          </t-form-item>
          <t-form-item label="标签" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" readonly />
          </t-form-item>
        </t-col>
      </t-row>
      <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
        <t-col :span="12">
          <t-form-item label="简介" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
        </t-col>
      </t-row>
      <!-- 分集列表 -->
      <div class="diversity-list">
        <t-row
          v-for="(diversity, index) in diversitys"
          :key="diversity.key"
          align="middle"
          :gutter="16"
          :style="{ marginTop: 'var(--td-comp-margin-xxl)' }"
        >
          <t-col :span="1" style="text-align: right">{{ index + 1 }}</t-col>
          <t-col :span="4">
            <t-input v-model="diversity.name" class="form-item-content" placeholder="分集名称" />
          </t-col>
          <t-col :span="4">
            <t-input v-model="diversity.file" class="form-item-content" placeholder="上传文件" />
          </t-col>
          <t-col :span="1">
            <t-link theme="danger" @click="handleDeleDiversitys(diversity.key)">删除</t-link>
          </t-col>
        </t-row>
      </div>

      <!-- 添加分集 -->
      <t-button theme="primary" :style="{ marginTop: 'var(--td-comp-margin-xxl)' }" @click="addDiversity"
        >添加分集</t-button
      >
    </t-form>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  name: string;
  type: string;
  range: Array<string | number>;
}
// 分集类型
interface Diversity {
  name: string;
  file: string;
  key: number;
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  type: '',
  range: ['', ''],
});

const open = (row?: any) => {
  console.log('🚀 ~ row:', row);
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
  diversitys.value = []; // 清空分集列表
};

// 动态表单
const diversitys = ref<Diversity[]>([]);
// 添加分集
const addDiversity = () => {
  diversitys.value.push({
    key: Date.now(),
    name: '',
    file: '',
  });
};
// 删除分集
const handleDeleDiversitys = (key: number) => {
  diversitys.value = diversitys.value.filter((item) => item.key !== key);
};
defineExpose({
  open,
});
</script>
<style lang="less" scoped>
.diversity-list {
  margin-top: var(--td-comp-margin-xxl);
  max-height: 300px;
  overflow: hidden auto;
  padding-right: 5px;
}
</style>
