import { http } from '@/utils/http'
export interface IFooItem {
  id: string
  data: object
}

interface clockInParams {
  type: string
  date: string
}

export const getHomePageInfo = (id: string) => {
  return http.get<IFooItem>(`/timeTap/homePageInfo/${id}`)
}

export const clockIn = (data: clockInParams) => {
  return http.post<IFooItem>('/timeTap/clockIn', data)
}
