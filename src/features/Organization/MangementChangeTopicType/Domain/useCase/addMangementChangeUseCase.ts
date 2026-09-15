import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import MangementChangeModel from '../../Data/models/MangementChangeModel'
import { AddMangementChangeRepo } from '../repositories/addMangementChangeRepo'

export default class AddMangementChangeUseCase implements UseCase<MangementChangeModel, Params> {
  async call(params: Params): Promise<DataState<MangementChangeModel>> {
    return AddMangementChangeRepo.getInstance().call(params)
  }
}