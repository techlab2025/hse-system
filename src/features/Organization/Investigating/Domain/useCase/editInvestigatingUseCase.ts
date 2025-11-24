import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditInvestigatingRepo } from '../repositories/editInvestigatingRepo'
import type InvestigatingModel from '../../Data/models/investigatingModel'

export default class EditInvestigatingUseCase implements UseCase<InvestigatingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigatingModel>> {
    return EditInvestigatingRepo.getInstance().call(params)
  }
}
