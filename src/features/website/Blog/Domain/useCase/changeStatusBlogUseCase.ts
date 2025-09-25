import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type BlogModel from '../../Data/models/BlogModel'
import { ChangeStatusBlogRepo } from '../repositories/changeStatusBlogRepo'






export default class ChangeStatusBlogUseCase implements UseCase<BlogModel, Params> {
  async call(params: Params): Promise<DataState<BlogModel>> {
    return ChangeStatusBlogRepo.getInstance().call(params)
  }
}
