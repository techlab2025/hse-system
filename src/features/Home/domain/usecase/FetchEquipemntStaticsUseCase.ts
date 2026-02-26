import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import StatisticsMachineModel from '../../data/Model/StatisticsMachineModel'
import { FetchEquipmentStaticsRepo } from '../repositories/FetchEquipmentStaticsRepo'

export default class FetchEquipmentStaticsUseCase
  implements UseCase<StatisticsMachineModel, Params>
{
  async call(params: Params): Promise<DataState<StatisticsMachineModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: StatisticsMachineModel.example })
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
