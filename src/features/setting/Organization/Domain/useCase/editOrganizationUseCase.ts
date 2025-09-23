import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationModel from '../../Data/models/OrganizationModel'
import { EditOrganizationRepo } from '../repositories/editOrganizationRepo'

export default class EditOrganizationUseCase implements UseCase<OrganizationModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationModel>> {
    return EditOrganizationRepo.getInstance().call(params)
  }
}
