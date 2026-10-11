import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditVisitThemeRepo } from '../repositories/editVisitThemeRepo'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'

export default class EditVisitThemeUseCase implements UseCase<VisitThemeModel, Params> {
  async call(params: Params): Promise<DataState<VisitThemeModel>> {
    return EditVisitThemeRepo.getInstance().call(params)
  }
}
