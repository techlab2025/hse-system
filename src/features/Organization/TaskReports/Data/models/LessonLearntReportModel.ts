import HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'

export default class LessonLearntReportModel {
  constructor(
    public lesson_learnt: string,
    public observation: HazardDetailsModel,
  ) {}

  static fromMap(value: unknown): LessonLearntReportModel {
    const data =
      value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {}

    return new LessonLearntReportModel(
      typeof data.lesson_learnt === 'string' ? data.lesson_learnt : '',
      HazardDetailsModel.fromMap(data.observation ?? {}),
    )
  }

  static examples: LessonLearntReportModel[] = [
    new LessonLearntReportModel(
      'Verify isolation controls before work begins and record the result during the toolbox talk.',
      HazardDetailsModel.example,
    ),
  ]
}
