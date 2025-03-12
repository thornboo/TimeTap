import { http } from '@/utils/http'
export interface IFooItem {
  id: string
  data: object
}

interface clockInParams {
  type: string
  date: string
}

// 打卡
export const clockIn = (data: clockInParams) => {
  return http.post<any>('/timeTap/clockIn', data)
}

// 获取首页信息
export const getHomePageInfo = (id: string) => {
  return http.get<any>(`/timeTap/homePageInfo/${id}`)
}
