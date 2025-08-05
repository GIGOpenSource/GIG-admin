<template>
  <t-dialog
    v-model:visible="visible"
    :width="600"
    header="用户详情"
    confirm-btn="保存"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <t-tabs :default-value="1">
      <t-tab-panel :value="1" label="用户资料">
        <t-form
          ref="formRef"
          :model="data.userProfile"
          label-width="80px"
          :style="{ marginTop: 'var(--td-comp-margin-xxl)' }"
        >
          <t-form-item label="用户名" name="username">
            <t-input v-model="data.userProfile.username" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <t-form-item label="昵称" name="nickname">
            <t-input v-model="data.userProfile.nickname" class="form-item-content" placeholder="请输入昵称" />
          </t-form-item>
          <t-form-item label="简介" name="bio">
            <t-input v-model="data.userProfile.bio" class="form-item-content" placeholder="请输入简介" />
          </t-form-item>
          <t-form-item label="粉丝量" name="followerCount">
            <t-input v-model="data.userProfile.followerCount" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="关注" name="followingCount">
            <t-input v-model="data.userProfile.followingCount" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="性别" name="gender">
            <t-radio-group v-model="data.userProfile.gender" default-value="male">
              <t-radio value="male">{{ GENDER['male'] }}</t-radio>
              <t-radio value="female">{{ GENDER['female'] }}</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="推广码" name="inviteCode">
            <t-input v-model="data.userProfile.inviteCode" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="头像" name="avatar">
            <t-avatar shape="round" size="large" :image="data.userProfile.avatar" />
          </t-form-item>
        </t-form>
      </t-tab-panel>
      <t-tab-panel :value="2" label="用户状态">
        <t-form
          ref="formRef"
          :model="data.userStatus"
          label-width="90px"
          :style="{ marginTop: 'var(--td-comp-margin-xxl)' }"
        >
          <!-- <t-form-item label="VIP状态" name="username">
            <t-input v-model="data.userStatus.status" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item> -->
          <t-form-item label="用户状态" name="status">
            <!-- <t-input v-model="data.userStatus.status" class="form-item-content" placeholder="请选择用户状态" /> -->
            <t-select v-model:value="data.userStatus.status" placeholder="请选择账号状态">
              <t-option v-for="op in USER_STATUS" :key="op.text" :label="op.text" :value="op.value"></t-option>
            </t-select>
          </t-form-item>
          <!-- <t-form-item label="设备" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="IP" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item> -->
          <t-form-item label="注册时间" name="createTime">
            <t-input v-model="data.userStatus.createTime" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <t-form-item label="最后活跃时间" name="lastLoginTime">
            <t-input v-model="data.userStatus.lastLoginTime" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item>
          <!-- <t-form-item label="被邀请码" name="email">
            <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" />
          </t-form-item> -->
        </t-form>
      </t-tab-panel>
      <t-tab-panel :value="3" label="用户账户">
        <t-form
          ref="formRef"
          :model="data.userAccount"
          label-width="80px"
          :style="{ marginTop: 'var(--td-comp-margin-xxl)' }"
        >
          <t-form-item label="手机号" name="phone">
            <t-input v-model="data.userAccount.phone" class="form-item-content" placeholder="请输入用户名" />
          </t-form-item>
          <!-- <t-form-item label="渠道码" name="username">
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
          </t-form-item> -->
        </t-form>
      </t-tab-panel>
    </t-tabs>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { getUserInfo, editUserInfo } from '@/api/user';
import { GENDER, USER_STATUS } from '@/constants';
import { useFormatDate } from '@/hooks';

const { formatDate } = useFormatDate();

const id = ref(0);

const defaultData = {
  userAccount: {
    phone: '',
    email: '',
  },
  userProfile: {
    username: '',
    nickname: '',
    gender: '',
    inviteCode: '',
    avatar: '',
    bio: '',
    followerCount: 0,
    followingCount: 0,
  },
  userStatus: {
    status: '',
    lastLoginTime: '',
    createTime: '',
  },
};

const data = reactive({ ...defaultData });

const visible = ref(false);

const open = (i: number) => {
  id.value = i;
  initData(i);
};

const initData = async (id: number) => {
  const res = await getUserInfo(id);

  console.log('🚀 ~ res:', res);
  // 格式化时间字段
  if (res.data && res.data.userStatus) {
    res.data.userStatus.createTime = formatDate(res.data.userStatus.createTime);
    res.data.userStatus.lastLoginTime = formatDate(res.data.userStatus.lastLoginTime);
  }

  Object.assign(data, res.data);
  visible.value = true;
};

const onConfirm = async () => {
  const res = await editUserInfo({ ...data.userAccount,...data.userProfile, ...data.userStatus, id: id.value });
  console.log('🚀 ~ res:', res);
  visible.value = false;
};
const onCancel = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="scss" scoped></style>
