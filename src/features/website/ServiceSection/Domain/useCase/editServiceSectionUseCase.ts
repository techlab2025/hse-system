import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import { EditServiceSectionRepo } from '../repositories/editServiceSectionRepo'

export default class EditServiceSectionUseCase implements UseCase<ServiceSectionModel, Params> {
  async call(params: Params): Promise<DataState<ServiceSectionModel>> {
    return EditServiceSectionRepo.getInstance().call(params)
  }
}
