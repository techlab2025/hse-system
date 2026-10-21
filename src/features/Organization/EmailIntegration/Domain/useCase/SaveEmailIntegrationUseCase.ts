import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EmailIntegrationModel from '../../Data/models/EmailIntegrationModel'
import SaveEmailIntegrationRepo from '../repositories/SaveEmailIntegrationRepo'

export default class SaveEmailIntegrationUseCase implements UseCase<EmailIntegrationModel, Params> {
  call(params: Params): Promise<DataState<EmailIntegrationModel>> {
    return SaveEmailIntegrationRepo.getInstance().call(params)
  }
}
