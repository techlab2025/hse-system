import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import ProjectModel from '../../Data/models/ProjectModel'
import { IndexProjectRepo } from '../repositories/indexProjectRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import EquipmentStaticsModel from '@/features/Home/data/Model/EquipmentStaticsModel'

export default class IndexProjectUseCase implements UseCase<ProjectModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectModel[]>> {
    // return IndexProjectRepo.getInstance().call(params);
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data:  [ProjectModel.example , ProjectModel.example , ProjectModel.example] })
      },
      onDev: () => {
        return IndexProjectRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexProjectRepo.getInstance().call(params)
      },
    })
  }
}
