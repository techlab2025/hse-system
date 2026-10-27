import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CreateSystemIdentityParams from '../../Core/params/CreateSystemIdentityParams'
import type SystemIdentityModel from '../../Data/models/SystemIdentityModel'
import CreateSystemIdentityRepo from '../repositories/CreateSystemIdentityRepo'

export default class CreateSystemIdentityUseCase
  implements UseCase<SystemIdentityModel, CreateSystemIdentityParams>
{
  call(params: CreateSystemIdentityParams): Promise<DataState<SystemIdentityModel>> {
    return CreateSystemIdentityRepo.getInstance().call(params)
  }
}
