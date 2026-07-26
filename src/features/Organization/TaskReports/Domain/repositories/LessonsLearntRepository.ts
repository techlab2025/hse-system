import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchLessonsLearntApiService from '../../Data/apiServices/FetchLessonsLearntApiService'
import LessonLearntReportModel from '../../Data/models/LessonLearntReportModel'

export default class LessonsLearntRepository extends RepoInterface<LessonLearntReportModel[]> {
  private static instance: LessonsLearntRepository

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new LessonsLearntRepository()
    return this.instance
  }

  get hasPagination(): boolean {
    return true
  }

  get serviceInstance(): ServicesInterface {
    return FetchLessonsLearntApiService.getInstance()
  }

  onParse(
    data: Record<string, unknown> | Array<Record<string, unknown>>,
  ): LessonLearntReportModel[] {
    const nestedData = Array.isArray(data) ? data : data.data
    const lessons = Array.isArray(nestedData) ? nestedData : []
    return lessons.map((lesson) => LessonLearntReportModel.fromMap(lesson))
  }
}
