import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import ProjectProgressModel from '../../Data/models/ProjectProgressModel'
import { IndexProjectProgressRepo } from '../repositories/indexProjectProgressRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class IndexProjectProgressUseCase implements UseCase<ProjectProgressModel, Params> {
  async call(params: Params): Promise<DataState<ProjectProgressModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: ProjectProgressModel.example })
      },
      onDev: () => {
        return IndexProjectProgressRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexProjectProgressRepo.getInstance().call(params)
      },
    })
  }
}
