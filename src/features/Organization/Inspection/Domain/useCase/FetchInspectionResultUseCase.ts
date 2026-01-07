import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchInspectionResultRepo } from '../repositories/FetchInspectionResultRepo'
import FetchInspectionResultModel from '../../Data/models/FetchInspectionResultModel'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import TaskResultModel from '../../Data/models/FetchTaskResultModels/TasksResultModel'

export default class FetchInspectionResultUseCase implements UseCase<TaskResultModel[], Params> {
  async call(params: Params): Promise<DataState<TaskResultModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: TaskResultModel.example })
      },
      onDev: () => {
        return FetchInspectionResultRepo.getInstance().call(params)
      },
      onProduction: () => {
        return FetchInspectionResultRepo.getInstance().call(params)
      },
    })
  }
}
