import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type BlogModel from '../../Data/models/BlogModel'
import { DeleteBlogRepo } from '../repositories/deleteBlogRepo'

export default class DeleteBlogUseCase implements UseCase<BlogModel, Params> {
  async call(params: Params): Promise<DataState<BlogModel>> {
    return DeleteBlogRepo.getInstance().call(params)
  }
}
