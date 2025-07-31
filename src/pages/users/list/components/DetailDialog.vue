<template>
  <t-dialog v-model:visible="visible" :width="600" header="用户详情" confirm-btn="保存" @cancel="onCancel">
    <t-tabs :default-value="1">
      <t-tab-panel :value="1" label="用户资料">
        <t-form ref="formRef" :model="data" label-width="80px" :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
          <t-form-item label="用户名" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="昵称" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="简介" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="粉丝量" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="关注" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="性别" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="推广码" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="头像" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
        </t-form>
      </t-tab-panel>
      <t-tab-panel :value="2" label="用户状态">
        <t-form ref="formRef" :model="data" label-width="90px" :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
          <t-form-item label="VIP状态" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="用户状态" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="设备" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="IP" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="注册时间" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="最后活跃时间" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="被邀请码" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
        </t-form>
      </t-tab-panel>
      <t-tab-panel :value="3" label="用户账户">
        <t-form ref="formRef" :model="data" label-width="80px" :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
          <t-form-item label="手机号" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="渠道码" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="用户类型" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="金币余额" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="积分余额" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="用户标签" name="username">
            <t-input v-model="data.name" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
        </t-form>
      </t-tab-panel>
    </t-tabs>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

interface FormData {
  name: string;
  type: string;
}

const data = ref<FormData>({
  name: '',
  type: '',
});

const visible = ref(false);

const open = (detail: FormData) => {
  console.log('🚀 ~ detail:', detail);
  data.value = { ...detail };
  visible.value = true;
};

const onCancel = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="scss" scoped></style>
