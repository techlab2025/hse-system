import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import RetrySentCopyApiService from '../../Data/apiServices/RetrySentCopyApiService'
import SentCopyResultModel from '../../Data/models/SentCopyResultModel'

export default class RetrySentCopyRepo extends RepoInterface<SentCopyResultModel> {
  private static instance: RetrySentCopyRepo
  static getInstance() {
    return (this.instance ??= new RetrySentCopyRepo())
  }
  get serviceInstance() {
    return RetrySentCopyApiService.getInstance()
  }
  onParse(data: Record<string, unknown>): SentCopyResultModel {
    return SentCopyResultModel.fromMap(data)
  }
}
