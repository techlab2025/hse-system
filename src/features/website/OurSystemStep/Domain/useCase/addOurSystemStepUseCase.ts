import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OurSystemStepteModel from '../../Data/models/OurSystemStepModel'
import { AddOurSystemStepRepo } from '../repositories/addOurSystemStepRepo'


export default class AddOurSystemStepteUseCase implements UseCase<OurSystemStepteModel, Params> {
  async call(params: Params): Promise<DataState<OurSystemStepteModel>> {
    return AddOurSystemStepRepo.getInstance().call(params)
  }
}
