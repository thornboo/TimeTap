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
    class="p-safe flex flex-col transition-colors duration-300 dark:bg-gray-900 bg-gray-50 container-page h-full"
  >
    <!-- 顶部信息区域 -->
    <view class="px-4 py-6 h-[88px]">
      <view class="flex justify-between items-center">
        <view class="flex items-center space-x-2">
          <view class="text-2xl font-bold text-green-600 dark:text-green-400">TimeTap</view>
          <view class="text-sm text-gray-500 dark:text-gray-400">打卡助手</view>
        </view>
        <view class="bg-green-100 dark:bg-green-800 rounded-full px-4 py-2">
          <text class="text-green-600 dark:text-green-300">已打卡 {{ checkDays }} 天</text>
        </view>
      </view>
    </view>

    <!-- 中间内容区域 -->
    <view class="flex flex-col items-center justify-center p-safe">
      <!-- 时间显示区域 -->
      <view class="text-center mb-16">
        <view class="text-5xl font-mono font-bold text-gray-800 dark:text-gray-100 tracking-wider">
          {{ currentTime }}
        </view>
        <view class="mt-2 text-gray-500 dark:text-gray-400">北京时间</view>
      </view>

      <!-- 打卡按钮区域 -->
      <view class="relative">
        <view
          :class="[
            'relative w-48 h-48 rounded-full shadow-lg transition-all duration-500',
            'flex items-center justify-center cursor-pointer',
            isThrottled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl active:scale-95',
            checkStatus ? 'bg-orange-500 dark:bg-orange-600' : 'bg-green-500 dark:bg-green-600',
          ]"
          @click="handleTapIn"
        >
          <!-- 打卡按钮内容 -->
          <view class="text-center">
            <view class="text-white text-2xl font-bold mb-2">
              {{ checkStatus ? '下班打卡' : '上班打卡' }}
            </view>
            <view class="text-white/80 text-sm" v-if="isThrottled">
              {{ throttleCountdown }}秒后可打卡
            </view>
          </view>

          <!-- 成功动画元素 -->
          <view v-if="showSuccess" class="success-animation"></view>
        </view>
      </view>

      <!-- 打卡记录提示 -->
      <view class="mt-8 text-center text-gray-500 dark:text-gray-400">
        {{ lastClockInTime ? `上次打卡时间：${lastClockInTime}` : '今天还没有打卡记录' }}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref, computed } from 'vue'
import { clockIn, getHomePageInfo } from '@/service/index/index'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'

defineOptions({
  name: 'Home',
})

const toast = useToast()

// 当前时间
const currentTime = ref(dayjs().format('HH:mm:ss'))
setInterval(() => {
  currentTime.value = dayjs().format('HH:mm:ss')
}, 1000)

// 打卡相关状态
const checkStatus = ref(false)
const checkDays = ref('0')
const lastClockInTime = ref('')
const showSuccess = ref(false)

// 节流相关
const isThrottled = ref(false)
const throttleTime = ref(0)
const throttleCountdown = computed(() => {
  return Math.ceil(60 - (Date.now() - throttleTime.value) / 1000)
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {
  getHomePageInfo('123').then((res) => {
    checkDays.value = res.data.clockInDays
  })
})

// 打卡操作
async function handleTapIn() {
  if (isThrottled.value) {
    toast.warning(`请等待${throttleCountdown.value}秒后再次打卡`)
    return
  }

  try {
    const type = checkStatus.value ? 'workEnd' : 'workStart'
    await clockIn({ type, date: currentTime.value })

    // 更新状态
    checkStatus.value = !checkStatus.value
    lastClockInTime.value = currentTime.value

    // 设置节流
    isThrottled.value = true
    throttleTime.value = Date.now()
    setTimeout(() => {
      isThrottled.value = false
    }, 60000)

    // 触发成功动画和反馈
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 1000)

    // 触发设备振动
    uni.vibrateShort({})

    // 显示成功提示
    uni.showToast({
      title: `${type === 'workStart' ? '上班' : '下班'}打卡成功`,
      icon: 'success',
    })
  } catch (error) {
    uni.showToast({
      title: '打卡失败，请重试',
      icon: 'error',
    })
  }
}
</script>

<style lang="scss" scoped>
.container-page {
  padding-bottom: env(safe-area-inset-bottom);
}

.success-animation {
  @apply absolute inset-0;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: success-pulse 1s ease-out;
}

@keyframes success-pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>
