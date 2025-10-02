import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import { EditOrganizationLocationRepo } from '../repositories/editOrganizationLocationRepo'


export default class EditOrganizationLocationUseCase implements UseCase<OrganizationLocationModel, Params> {
  async call(params: Params): Promise<DataState<OrganizationLocationModel>> {
    return EditOrganizationLocationRepo.getInstance().call(params)
  }
}
