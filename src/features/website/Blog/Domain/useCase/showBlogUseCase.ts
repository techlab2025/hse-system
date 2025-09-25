import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type BlogDetailsModel from '../../Data/models/BlogDetailsModel'
import { ShowBlogRepo } from '../repositories/showBlogRepo'


export default class ShowBlogUseCase
  implements UseCase<BlogDetailsModel, Params> {
  async call(params: Params): Promise<DataState<BlogDetailsModel>> {
    return ShowBlogRepo.getInstance().call(params)
  }
}
