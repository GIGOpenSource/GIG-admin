<template>
  <t-dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑APP' : '新增APP'"
    width="600px"
    :confirm-btn="isEdit ? '更新' : '保存'"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <t-form ref="formRef" :data="formData" :rules="rules" :label-width="100">
      <t-form-item label="APP名称" name="name" required>
        <t-input v-model="formData.name" placeholder="输入APP名称" />
      </t-form-item>

      <t-form-item label="APP权限" name="permission" required>
        <t-select v-model="formData.permission" placeholder="请选择APP权限" @change="handlePermissionChange">
          <t-option key="vip" value="vip" label="VIP" />
          <t-option key="gold" value="gold" label="金币" />
          <t-option key="free" value="free" label="免费" />
        </t-select>
      </t-form-item>

      <t-form-item v-if="formData.permission === 'gold'" label="价格" name="price" required>
        <t-input-number v-model="formData.price" placeholder="请输入价格" :min="0" :precision="2" />
      </t-form-item>

      <!-- 隐藏字段，用于传递is_vip -->
      <input type="hidden" v-model="formData.is_vip" />

      <t-form-item label="APP地址" name="click_url" required>
        <t-input v-model="formData.click_url" placeholder="请输入APP地址" />
      </t-form-item>

      <t-form-item label="APP封面" name="image_url" required>
        <t-upload
          v-model="formData.image_url"
          :max="1"
          :auto-upload="true"
          :request-method="handleSingleUpload"
          accept="image/*"
          theme="image"
          :size-limit="5 * 1024 * 1024"
          @remove="handleRemoveCover"
        >
          <template #file-input>
            <div class="upload-placeholder">
              <t-icon name="image" size="24" />
              <div class="upload-text">点击上传封面</div>
            </div>
          </template>
        </t-upload>
        <div class="upload-tip">最多上传1张</div>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { createApp, updateApp, uploadImage, getAppDetail } from '@/api/gameplay';

interface FormData {
  id?: number;
  name: string;
  permission: string;
  is_vip: boolean;
  price?: number;
  click_url: string;
  image_url: any[];
}

const visible = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formData = reactive<FormData>({
  name: '',
  permission: '',
  is_vip: false,
  price: 0,
  click_url: '',
  image_url: [],
});

const rules = {
  name: [{ required: true, message: '请输入APP名称', type: 'error' as const }],
  permission: [{ required: true, message: '请选择APP权限', type: 'error' as const }],
  price: [
    {
      required: true,
      message: '请输入价格',
      type: 'error' as const,
      validator: (val: any) => {
        if (formData.permission === 'gold' && (!val || val <= 0)) {
          return { result: false, message: '金币权限必须设置价格' };
        }
        return { result: true, message: '' };
      }
    }
  ],
  click_url: [{ required: true, message: '请输入APP地址', type: 'error' as const }],
  image_url: [{
    required: true,
    message: '请上传APP封面',
    type: 'error' as const,
    trigger: 'change' as const // 只在内容变化时校验
  }],
};

const open = async (data?: FormData) => {
  visible.value = true;
  isEdit.value = !!data;

  // 清除之前的校验状态
  if (formRef.value) {
    formRef.value.clearValidate();
  }

  if (data && data.id) {
    // 编辑模式：调用API获取完整详情
    try {
      console.log('获取APP详情，ID:', data.id);
      const response = await getAppDetail(data.id);
      console.log('APP详情API返回:', response);

      const appData = response.data || response;
      console.log('APP详情数据:', appData);

      // 处理图片数据
      const imageUrl = appData.image_url || appData.cover || '';

      // 将字符串形式的图片URL转换为upload组件需要的格式
      const imageUrlList = imageUrl ? [{
        url: imageUrl,
        name: 'APP封面',
        status: 'success' as const,
        response: { url: imageUrl }
      }] : [];

      // 根据is_vip和price字段判断权限类型
      let permissionType = 'free';
      if (appData.is_vip === true && appData.price > 0) {
        permissionType = 'gold';
      } else if (appData.is_vip === true && appData.price === 0) {
        permissionType = 'vip';
      } else if (appData.is_vip === false && appData.price === 0) {
        permissionType = 'free';
      }

      console.log('权限判断:', {
        is_vip: appData.is_vip,
        price: appData.price,
        permissionType: permissionType
      });

      // 填充表单数据
      Object.assign(formData, {
        id: appData.id,
        name: appData.name || '',
        permission: permissionType,
        is_vip: appData.is_vip || false,
        price: appData.price || 0,
        click_url: appData.click_url || appData.url || '',
        image_url: imageUrlList,
      });

      console.log('填充后的表单数据:', formData);
    } catch (error) {
      console.error('获取APP详情失败:', error);
      MessagePlugin.error('获取APP详情失败，请重试');
      visible.value = false;
      return;
    }
  } else {
    // 新增模式
    resetForm();
  }
};

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    permission: '',
    is_vip: false,
    price: 0,
    click_url: '',
    image_url: [],
  });
};

const handleConfirm = async () => {
  // 先进行表单校验
  const valid = await formRef.value?.validate();
  if (!valid) {
    MessagePlugin.error('请检查表单填写是否完整');
    return;
  }

  // 手动校验必填字段
  if (!formData.name || formData.name.trim() === '') {
    MessagePlugin.error('请输入APP名称');
    return;
  }

  if (!formData.permission || formData.permission.trim() === '') {
    MessagePlugin.error('请选择APP权限');
    return;
  }

  if (!formData.click_url || formData.click_url.trim() === '') {
    MessagePlugin.error('请输入APP地址');
    return;
  }

  if (!formData.image_url || formData.image_url.length === 0) {
    MessagePlugin.error('请上传APP封面');
    return;
  }

  // 校验金币权限的价格
  if (formData.permission === 'gold' && (!formData.price || formData.price <= 0)) {
    MessagePlugin.error('金币权限必须设置价格');
    return;
  }

  try {
    // 处理图片数据
    const imageUrl = formData.image_url.length > 0 ?
      formData.image_url[0].url || formData.image_url[0].response?.url || formData.image_url[0].name : '';

    if (!imageUrl || imageUrl.trim() === '') {
      MessagePlugin.error('APP封面上传失败，请重新上传');
      return;
    }

    const submitData = {
      ...formData,
      type: 'app', // 默认传递app类型
      image_url: imageUrl
    };

    // 移除permission字段，不传递给后端
    delete submitData.permission;

    console.log('提交数据:', submitData);

    if (isEdit.value) {
      await updateApp(submitData);
      MessagePlugin.success('更新成功');
    } else {
      await createApp(submitData);
      MessagePlugin.success('创建成功');
    }

    visible.value = false;
    emit('confirm');
  } catch (error) {
    console.error('操作失败:', error);
    MessagePlugin.error(isEdit.value ? '更新失败' : '创建失败');
  }
};

const handleCancel = () => {
  visible.value = false;
  resetForm();
};

// 处理APP权限变化
const handlePermissionChange = (value: any) => {
  if (value === 'vip') {
    formData.is_vip = false;
    formData.price = 0;
  } else if (value === 'gold') {
    formData.is_vip = true;
    // 保持当前价格，如果为空则设为0
    if (!formData.price) {
      formData.price = 0;
    }
  } else if (value === 'free') {
    formData.is_vip = false;
    formData.price = 0;
  }
};

// 单张图片上传处理（APP封面）
const handleSingleUpload = async (file: any) => {
  try {
    console.log('开始上传APP封面:', file);

    // 单张上传时，file是对象
    const fileToUpload = file.raw || file;
    if (!fileToUpload) {
      throw new Error('文件对象不存在');
    }

    const fileName = fileToUpload.name || file.name || `image_${Date.now()}.jpg`;
    console.log('上传文件名:', fileName);

    const response = await uploadImage(fileToUpload);
    console.log('上传成功:', response);
    MessagePlugin.success('图片上传成功');

    const imageUrl = response.data?.url || response.data?.path || response.url || response;
    console.log('保存的图片URL:', imageUrl);

    return {
      url: imageUrl,
      name: fileName,
      status: 'success' as const,
      response: {
        url: imageUrl,
        ...(response.data || {})
      } as any
    };
  } catch (error) {
    console.error('上传失败:', error);
    MessagePlugin.error('图片上传失败，请重试');
    return {
      url: '',
      name: file.name || 'unknown',
      status: 'fail' as const,
      response: null
    };
  }
};

// 处理封面图片移除
const handleRemoveCover = (context: any) => {
  console.log('移除APP封面图片:', context);
  if (context && context.fileList) {
    formData.image_url = Array.isArray(context.fileList) ? context.fileList : [];
  } else {
    formData.image_url = [];
  }
};

const emit = defineEmits<{
  confirm: [];
}>();

defineExpose({
  open,
});
</script>

<style lang="less" scoped>
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #d3d3d3;
  border-radius: 6px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--td-brand-color);
    background-color: var(--td-brand-color-1);
  }

  .upload-text {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
