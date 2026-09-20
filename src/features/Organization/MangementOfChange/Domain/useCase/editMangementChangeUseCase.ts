import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import { EditMangementChangeRepo } from '../repositories/editMangementChangeRepo'

export default class EditMangementChangeUseCase
  implements UseCase<MangementChangeModel, Params> {
  async call(params: Params): Promise<DataState<MangementChangeModel>> {
    return EditMangementChangeRepo.getInstance().call(params)
  }
}
