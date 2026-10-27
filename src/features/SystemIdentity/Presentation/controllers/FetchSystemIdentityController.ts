import { ErrorType } from '@/base/core/networkStructure/Resources/errors/errorModel'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type FetchSystemIdentityParams from '../../Core/params/FetchSystemIdentityParams'
import type SystemIdentityModel from '../../Data/models/SystemIdentityModel'
import FetchSystemIdentityUseCase from '../../Domain/useCase/FetchSystemIdentityUseCase'

export default class FetchSystemIdentityController extends ControllerInterface<SystemIdentityModel> {
  constructor() {
    super()
  }
  async getData(params: FetchSystemIdentityParams) {
    this.setLoading()
    const result = await new FetchSystemIdentityUseCase().call(params)
    if (result.error?.type === ErrorType.dataDirty)
      result.error.title = 'The server returned an invalid system identity response.'
    this.setState(result)
    return result
  }
}
