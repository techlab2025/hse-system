import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import { DeleteOurSystemStepRepo } from '../repositories/deleteOurSystemStepRepo'

export default class DeleteOurSystemStepUseCase implements UseCase<OurSystemStepModel, Params> {
  async call(params: Params): Promise<DataState<OurSystemStepModel>> {
    return DeleteOurSystemStepRepo.getInstance().call(params)
  }
}
