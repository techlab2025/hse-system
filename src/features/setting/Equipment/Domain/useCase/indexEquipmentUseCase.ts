import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import EquipmentModel from '../../Data/models/equipmentModel'
import { IndexEquipmentRepo } from '../repositories/indexEquipmentRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class IndexEquipmentUseCase implements UseCase<EquipmentModel[], Params> {
  async call(params: Params): Promise<DataState<EquipmentModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: EquipmentModel.example })
      },
      onDev: () => {
        return IndexEquipmentRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexEquipmentRepo.getInstance().call(params)
      },
    })
  }
}
