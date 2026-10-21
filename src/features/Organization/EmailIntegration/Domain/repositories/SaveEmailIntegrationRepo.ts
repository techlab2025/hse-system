import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import SaveEmailIntegrationApiService from '../../Data/apiServices/SaveEmailIntegrationApiService'
import EmailIntegrationModel from '../../Data/models/EmailIntegrationModel'

export default class SaveEmailIntegrationRepo extends RepoInterface<EmailIntegrationModel> {
  private static instance: SaveEmailIntegrationRepo
  static getInstance() {
    return (this.instance ??= new SaveEmailIntegrationRepo())
  }
  get serviceInstance() {
    return SaveEmailIntegrationApiService.getInstance()
  }
  onParse(data: Record<string, unknown>): EmailIntegrationModel {
    return EmailIntegrationModel.fromMap(data)
  }
}
