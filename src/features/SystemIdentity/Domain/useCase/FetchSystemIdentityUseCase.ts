import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FetchSystemIdentityParams from '../../Core/params/FetchSystemIdentityParams'
import type SystemIdentityModel from '../../Data/models/SystemIdentityModel'
import FetchSystemIdentityRepo from '../repositories/FetchSystemIdentityRepo'

export default class FetchSystemIdentityUseCase
  implements UseCase<SystemIdentityModel, FetchSystemIdentityParams>
{
  call(params: FetchSystemIdentityParams): Promise<DataState<SystemIdentityModel>> {
    return FetchSystemIdentityRepo.getInstance().call(params)
  }
}
