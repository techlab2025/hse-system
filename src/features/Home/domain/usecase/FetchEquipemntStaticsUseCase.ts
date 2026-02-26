import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import { FetchEquipmentStaticsRepo } from '../repositories/FetchEquipmentStaticsRepo'
import EquipmentStaticsModel from '../../data/Model/EquipmentStaticsModel'

export default class FetchEquipmentStaticsUseCase
  implements UseCase<EquipmentStaticsModel, Params>
{
  async call(params: Params): Promise<DataState<EquipmentStaticsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: EquipmentStaticsModel.example })
      },
      onDev: () => {
        return FetchEquipmentStaticsRepo.getInstance().call(params)
      },
      onProduction: () => {
        return FetchEquipmentStaticsRepo.getInstance().call(params)
      },
    })
  }
}
