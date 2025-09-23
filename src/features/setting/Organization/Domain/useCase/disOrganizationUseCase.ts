import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationModel from '../../Data/models/OrganizationModel'
import { DisActiveOrganizationRepo } from '../repositories/disActiveOrganizationRepo'

export default class DisOrganizationUseCase implements UseCase<OrganizationModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationModel>> {
    return DisActiveOrganizationRepo.getInstance().call(params)
  }
}
