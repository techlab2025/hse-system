import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchEmailIntegrationApiService from '../../Data/apiServices/FetchEmailIntegrationApiService'
import EmailIntegrationModel from '../../Data/models/EmailIntegrationModel'

export default class FetchEmailIntegrationRepo extends RepoInterface<EmailIntegrationModel> {
  private static instance: FetchEmailIntegrationRepo
  static getInstance() {
    return (this.instance ??= new FetchEmailIntegrationRepo())
  }
  get serviceInstance() {
    return FetchEmailIntegrationApiService.getInstance()
  }
  onParse(data: Record<string, unknown>): EmailIntegrationModel {
    return EmailIntegrationModel.fromMap(data)
  }
}
