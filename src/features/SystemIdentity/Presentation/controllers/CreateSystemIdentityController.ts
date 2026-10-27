import { ErrorType } from '@/base/core/networkStructure/Resources/errors/errorModel'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type CreateSystemIdentityParams from '../../Core/params/CreateSystemIdentityParams'
import type SystemIdentityModel from '../../Data/models/SystemIdentityModel'
import CreateSystemIdentityUseCase from '../../Domain/useCase/CreateSystemIdentityUseCase'

export default class CreateSystemIdentityController extends ControllerInterface<SystemIdentityModel> {
  constructor() {
    super()
  }
  async getData(params: CreateSystemIdentityParams) {
    this.setLoading()
    const result = await new CreateSystemIdentityUseCase().call(params)
    if (result.error?.type === ErrorType.dataDirty)
      result.error.title = 'The server returned an invalid system identity response.'
    this.setState(result)
    return result
  }
}
