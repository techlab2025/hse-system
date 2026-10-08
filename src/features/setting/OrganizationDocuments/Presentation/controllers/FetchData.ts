import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'

export default class FetchThaeData {
  private static instance: FetchThaeData

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchThaeData()
    }
    return this.instance
  }

  FetchData(data: UseCase<OrganizationDocumentsModel[], Params>, params: Params) {
    data.call(params)
  }
}
