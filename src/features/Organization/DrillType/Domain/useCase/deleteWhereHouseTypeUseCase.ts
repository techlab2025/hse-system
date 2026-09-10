import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteWhereHouseTypeRepo } from '../repositories/deleteWhereHouseTypeRepo'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'

export default class DeleteWhereHouseTypeUseCase implements UseCase<WhereHouseTypeModel, Params> {
  async call(params: Params): Promise<DataState<WhereHouseTypeModel>> {
    return DeleteWhereHouseTypeRepo.getInstance().call(params)
  }
}
