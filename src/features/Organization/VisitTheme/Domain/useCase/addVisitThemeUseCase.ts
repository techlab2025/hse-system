import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddVisitThemeRepo } from '../repositories/addVisitThemeRepo'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'

export default class AddVisitThemeUseCase implements UseCase<VisitThemeModel, Params> {
  async call(params: Params): Promise<DataState<VisitThemeModel>> {
    return AddVisitThemeRepo.getInstance().call(params)
  }
}
