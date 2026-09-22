import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexVisitThemeRepo } from '../repositories/indexVisitThemeRepo'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'

export default class IndexVisitThemeUseCase implements UseCase<VisitThemeModel[], Params> {
  async call(params: Params): Promise<DataState<VisitThemeModel[]>> {
    return IndexVisitThemeRepo.getInstance().call(params)
  }
}
