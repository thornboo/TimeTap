<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'Demo',
  },
}
</route>

<template>
  <view class="">
    <view class="text-center mt-8">
      当前平台是：
      <text class="text-green-500">{{ PLATFORM.platform }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { TestEnum } from '@/typings'
import PLATFORM from '@/utils/platform'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 测试 uni API 自动引入
onLoad(() => {
  console.log(safeAreaInsets)
  console.log(TestEnum.A)
})
</script>

<style lang="scss" scoped>
//
</style>
