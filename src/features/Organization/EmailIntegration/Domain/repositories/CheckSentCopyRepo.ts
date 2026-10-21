import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import CheckSentCopyApiService from '../../Data/apiServices/CheckSentCopyApiService'
import SentCopyResultModel from '../../Data/models/SentCopyResultModel'

export default class CheckSentCopyRepo extends RepoInterface<SentCopyResultModel> {
  private static instance: CheckSentCopyRepo
  static getInstance() {
    return (this.instance ??= new CheckSentCopyRepo())
  }
  get serviceInstance() {
    return CheckSentCopyApiService.getInstance()
  }
  onParse(data: Record<string, unknown>): SentCopyResultModel {
    return SentCopyResultModel.fromMap(data)
  }
}
