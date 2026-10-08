import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowVisitThemeRepo } from '../repositories/showVisitThemeRepo'
import type VisitThemeDetailsModel from '../../Data/models/VisitThemeDetailsModel'

export default class ShowVisitThemeUseCase implements UseCase<VisitThemeDetailsModel, Params> {
  async call(params: Params): Promise<DataState<VisitThemeDetailsModel>> {
    return ShowVisitThemeRepo.getInstance().call(params)
  }
}
