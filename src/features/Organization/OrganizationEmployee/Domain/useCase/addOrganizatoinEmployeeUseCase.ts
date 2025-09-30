import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import { AddOrganizationEmployeeRepo } from '../repositories/addOrganizatoinEmployeeRepo';

export default class AddOrganizatoinEmployeeUseCase implements UseCase<OrganizatoinEmployeeModel, Params> {
  async call(params: Params): Promise<DataState<OrganizatoinEmployeeModel>> {
    return AddOrganizationEmployeeRepo.getInstance().call(params)
  }
}
