import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import { DeleteServiceSectionRepo } from '../repositories/deleteServiceSectionRepo'

export default class DeleteServiceSectionUseCase implements UseCase<ServiceSectionModel, Params> {
  async call(params: Params): Promise<DataState<ServiceSectionModel>> {
    return DeleteServiceSectionRepo.getInstance().call(params)
  }
}
