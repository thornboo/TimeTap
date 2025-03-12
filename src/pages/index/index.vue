<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>

<template>
  <view
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <!--顶部-->
    <view class="flex flex-col items-center">
      <span class="bg-[#99FFF3] p-4">已打卡{{ checkDays }}天</span>
    </view>
    <!--打卡区域-->
    <view class="center w-full">
      <view
        class="rounded-full bg-gradient-to-b from-green-400 to-green-600 w-40 h-40 fixed bottom-40 center shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
        @click="handleTapIn"
      >
        <view class="text-white text-2xl font-bold">
          {{ checkStatus ? '下班啦' : '上班啦' }}
        </view>
      </view>
      <view class="text-gray-600 text-sm mt-1">当前时间：{{ currentTime }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref } from 'vue'
import { clockIn, getHomePageInfo } from '@/service/index/index'
import { onLoad } from '@dcloudio/uni-app'

defineOptions({
  name: 'Home',
})

// 当前时间
const currentTime = ref(dayjs().format('HH:mm:ss'))
setInterval(() => {
  currentTime.value = dayjs().format('HH:mm:ss')
}, 1000)

// 打卡状态
const checkStatus = ref(false)
// 打卡天数
const checkDays = ref('0')

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {
  getHomePageInfo('123').then((res) => {
    checkDays.value = res.data.clockInDays
  })
})

// 打卡操作
function handleTapIn() {
  // todo：这里添加一个节流1分钟限制
  checkStatus.value = !checkStatus.value

  clockIn({ type: checkStatus.value ? 'workStart' : 'workEnd', date: currentTime.value })
  // 触发设备振动
  uni.vibrateShort({})
  // 成功成功提示
  uni.showToast({
    title: `${checkStatus.value ? '上班' : '下班'}打卡成功`,
    icon: 'none',
  })
}
</script>

<style lang="scss" scoped></style>
