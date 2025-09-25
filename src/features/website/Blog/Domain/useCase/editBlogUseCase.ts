import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type BlogModel from '../../Data/models/BlogModel'
import { EditBlogRepo } from '../repositories/editBlogRepo'


export default class EditBlogUseCase implements UseCase<BlogModel, Params> {
  async call(params: Params): Promise<DataState<BlogModel>> {
    return EditBlogRepo.getInstance().call(params)
  }
}
