import HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'

export interface LessonLearntProjectReference {
  id: number
  title: string
  serial_name: string
}

export default class LessonLearntReportModel {
  constructor(
    public lesson_learnt: string,
    public observation: HazardDetailsModel,
    public investigation_id: number = 0,
    public serial_name: string = '',
    public project: LessonLearntProjectReference = { id: 0, title: '', serial_name: '' },
  ) {}

  static fromMap(value: unknown): LessonLearntReportModel {
    const data =
      value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {}
    const project =
      data.project !== null && typeof data.project === 'object'
        ? (data.project as Record<string, unknown>)
        : {}

    return new LessonLearntReportModel(
      typeof data.lesson_learnt === 'string' ? data.lesson_learnt : '',
      HazardDetailsModel.fromMap(data.observation ?? {}),
      Number(data.investigation_id) || 0,
      typeof data.serial_name === 'string' ? data.serial_name : '',
      {
        id: Number(project.id ?? project.project_id) || 0,
        title: typeof project.title === 'string' ? project.title : '',
        serial_name: typeof project.serial_name === 'string' ? project.serial_name : '',
      },
    )
  }

  static examples: LessonLearntReportModel[] = [
    new LessonLearntReportModel(
      'Verify isolation controls before work begins and record the result during the toolbox talk.',
      HazardDetailsModel.example,
    ),
  ]
}
