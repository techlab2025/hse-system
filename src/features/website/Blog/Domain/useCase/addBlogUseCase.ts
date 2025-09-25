import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type BlogteModel from '../../Data/models/BlogModel'
import { AddBlogRepo } from '../repositories/addBlogRepo'


export default class AddBlogteUseCase implements UseCase<BlogteModel, Params> {
  async call(params: Params): Promise<DataState<BlogteModel>> {
    return AddBlogRepo.getInstance().call(params)
  }
}
