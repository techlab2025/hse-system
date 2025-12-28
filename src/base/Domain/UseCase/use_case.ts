import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ServerEnum } from './ServerEnum'
// import DataStatus from "@/components/DataStatues/DataStatus.vue";

export default interface UseCase<T, P> {
  call(params: P): Promise<DataState<T>>
}

class UseCaseHandler {
  private static _instance: UseCaseHandler

  private constructor() {}

  static instance() {
    if (!this._instance) {
      this._instance = new UseCaseHandler()
    }
    return this._instance
  }

  handle<T>({
    onTest,
    onDev,
    onProduction,
  }: {
    onTest?: () => DataState<T>
    onDev?: () => DataState<T>
    onProduction?: () => DataState<T>
  }): Promise<DataState<T>> {
    // const Key = import.meta.env
    
    const i: number = Number(import.meta.env?.VITE_APP_ENV)
    if (i === ServerEnum.TEST) {
      if (onTest) {
        return Promise.resolve(onTest())
      } else {
        return Promise.resolve(onProduction!())
      }
    } else if (i === ServerEnum?.STAGING) {
      if (onDev) {
        return Promise.resolve(onDev())
      } else {
        return Promise.resolve(onProduction!())
      }
    } else if (i === ServerEnum.PRODUCTION) {
      if (onProduction) {
        return Promise.resolve(onProduction())
      }
    } else {
      return Promise.resolve(onProduction!())
    }
    return Promise.reject(new Error('Invalid case'))
  }
}

export { UseCaseHandler }
