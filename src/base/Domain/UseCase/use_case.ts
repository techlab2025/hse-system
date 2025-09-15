import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
// import DataStatus from "@/components/DataStatues/DataStatus.vue";

export default interface UseCase<T, P> {
    call(params: P): Promise<DataState<T>>
}


class UseCaseHandler {
    private static _instance: UseCaseHandler;

    private constructor() {
    }

    static instance() {
        if (!this._instance) {
            this._instance = new UseCaseHandler();
        }
        return this._instance;
    }

    handle<T>({ onTest, onDev, onProduction }: {
        onTest?: () => DataState<T>;
        onDev?: () => DataState<T>,
        onProduction?: () => DataState<T>
    }): Promise<DataState<T>> {
        const i: number = 3;
        if (i === 1) {
            if (onTest) {
                return Promise.resolve(onTest());
            } else {
                return Promise.resolve(onProduction!());
            }
        } else if (i === 2) {
            if (onDev) {
                return Promise.resolve(onDev());
            } else {
                return Promise.resolve(onProduction!());
            }
        } else if (i === 3) {
            if (onProduction) {
                return Promise.resolve(onProduction());
            }
        } else {
            return Promise.resolve(onProduction!());
        }
        return Promise.reject(new Error("Invalid case"));
    }
}


export { UseCaseHandler }