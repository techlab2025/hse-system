import HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'
import TeamLeaderModel from './TeamLeaderModel'
import InvestegationTasksModel from './InvestegationTasksModel'
import InvestegationFactorModel from './InvestigationFactorsModel'
import InvestigationMeetingsModel from './InvestigationMeetingsModel'
import InvestigatingDocumentModel from './InvestegationDocumentModel'
import TitleInterface from '@/base/Data/Models/title_interface'
import InvestegationDocumentMedaModel from './InvestegationDocumentMedaModel'
import { Observation } from '../../Core/Enums/ObservationTypeEnum'
import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'
import type witnessStatementsModel from './InvestegationwitnessStatementsModel'

export default class InvestigatingDetailsModel {
  public id: number
  public investigationId: number
  public date: string
  public status: string
  public type: number
  public latestInvestigationmeetingId: number
  public observation: HazardDetailsModel
  public investigationTeamLeader: TeamLeaderModel
  public investigationTasks: InvestegationTasksModel[]
  public investigationEmployees: OrganizatoinEmployeeDetailsModel[]
  public investigationFactors: InvestegationFactorModel[]
  public investigationMeetings: InvestigationMeetingsModel[]
  public investigationDocumentations: InvestigatingDocumentModel[]
  public explainWhyText: string
  public witnessStatements: witnessStatementsModel[]
  public preventiveTasks: InvestegationTasksModel[]
  public correctiveTasks: InvestegationTasksModel[]
  public isActionCorrect: boolean
  public createdAt: string
  public investigationMeetingDate: string
  public investigationMeetingTime: string
  public investigationNextMeetingDate: string
  public investigationNextMeetingTime: string
  public incidentDescription: string
  public recommendation: string
  public lessonLearnt: string
  public injuries: any[]
  public deaths: any[]
  public rootCauses: any[]
  public questions: any[]
  public eventTimelines: any[]
  public serialName?: string

  constructor(
    id: number,
    investigationId: number,
    date: string,
    status: string,
    type: number,
    latestInvestigationmeetingId: number,
    observation: HazardDetailsModel,
    investigationTeamLeader: TeamLeaderModel,
    investigationTasks: InvestegationTasksModel[],
    investigationEmployees: OrganizatoinEmployeeDetailsModel[],
    investigationFactors: InvestegationFactorModel[],
    investigationMeetings: InvestigationMeetingsModel[],
    investigationDocumentations: InvestigatingDocumentModel[],
    explainWhyText: string,
    witnessStatements: witnessStatementsModel[],
    preventiveTasks: InvestegationTasksModel[],
    correctiveTasks: InvestegationTasksModel[],
    isActionCorrect: boolean,
    createdAt: string = '',
    investigationMeetingDate: string = '',
    investigationMeetingTime: string = '',
    investigationNextMeetingDate: string = '',
    investigationNextMeetingTime: string = '',
    incidentDescription: string = '',
    recommendation: string = '',
    lessonLearnt: string = '',
    injuries: any[] = [],
    deaths: any[] = [],
    rootCauses: any[] = [],
    questions: any[] = [],
    eventTimelines: any[] = [],
    serialName: string,
  ) {
    this.id = id
    this.investigationId = investigationId
    this.date = date
    this.status = status
    this.type = type
    this.latestInvestigationmeetingId = latestInvestigationmeetingId
    this.observation = observation
    this.investigationTeamLeader = investigationTeamLeader
    this.investigationTasks = investigationTasks
    this.investigationEmployees = investigationEmployees
    this.investigationFactors = investigationFactors
    this.investigationMeetings = investigationMeetings
    this.investigationDocumentations = investigationDocumentations
    this.explainWhyText = explainWhyText
    this.witnessStatements = witnessStatements
    this.preventiveTasks = preventiveTasks
    this.correctiveTasks = correctiveTasks
    this.isActionCorrect = isActionCorrect
    this.createdAt = createdAt
    this.investigationMeetingDate = investigationMeetingDate
    this.investigationMeetingTime = investigationMeetingTime
    this.investigationNextMeetingDate = investigationNextMeetingDate
    this.investigationNextMeetingTime = investigationNextMeetingTime
    this.incidentDescription = incidentDescription
    this.recommendation = recommendation
    this.lessonLearnt = lessonLearnt
    this.injuries = injuries
    this.deaths = deaths
    this.rootCauses = rootCauses
    this.questions = questions
    this.eventTimelines = eventTimelines
    this.serialName = serialName
  }

  static fromMap(data: any): InvestigatingDetailsModel {
    return new InvestigatingDetailsModel(
      data.id,
      data.investigation_id,
      data.investigation_date,
      data.status,
      data.type,
      data.latest_investigation_meeting_id,
      data.observation,
      data.investigation_team_leader,
      data.investigation_tasks ?? data.investigationTasks ?? [],
      data.investigation_employees ?? data.investigationEmployees ?? [],
      data.investigation_factors ?? data.investigationFactors ?? [],
      data.investigation_meetings ?? data.investigationMeetings ?? [],
      data.investigation_documentations ?? data.investigationDocumentations ?? [],
      data.explain_why_text ?? data.explainWhyText ?? '',
      data.witness_statements ?? data.witnessStatements ?? [],
      data.preventive_tasks ?? data.preventiveTasks ?? [],
      data.corrective_tasks ?? data.correctiveTasks ?? [],
      data.is_action_correct ?? data.isActionCorrect ?? false,
      data.created_at ?? data.createdAt ?? '',
      data.investigation_meeting_date ?? data.investigationMeetingDate ?? '',
      data.investigation_meeting_time ?? data.investigationMeetingTime ?? '',
      data.investigation_next_meeting_date ?? data.investigationNextMeetingDate ?? '',
      data.investigation_next_meeting_time ?? data.investigationNextMeetingTime ?? '',
      data.incidant_description ?? data.incident_description ?? data.incidentDescription ?? '',
      data.recommendation ?? '',
      data.lesson_learnt ?? data.lessonLearnt ?? '',
      data.injuries ?? [],
      data.deaths ?? [],
      data.root_causes ?? data.rootCauses ?? data.observation?.root_causes ?? [],
      data.questions ?? data.five_why_questions ?? data.fiveWhyQuestions ?? [],
      data.event_timelines ?? data.eventTimelines ?? [],
      data.serial_name,
    )
  }

  static example: InvestigatingDetailsModel = new InvestigatingDetailsModel(
    23,
    23,
    '11-12-2025',
    '1',
    1,
    12,
    new HazardDetailsModel(
      23,
      'incident',
      'new Incedian',
      '',
      1,
      1,
      Observation.AccidentsType,
      1,
      1,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ),
    new TeamLeaderModel(23, 'Mohab'),
    [
      new InvestegationTasksModel(23, 'new', 1, '12-11-2025', 'mohab', 'mohab', 10, 'welcome'),
      new InvestegationTasksModel(23, 'new', 1, '12-11-2025', 'mohab', 'mohab', 10, 'welcome'),
      new InvestegationTasksModel(23, 'new', 1, '12-11-2025', 'mohab', 'mohab', 10, 'welcome'),
      new InvestegationTasksModel(23, 'new', 1, '12-11-2025', 'mohab', 'mohab', 10, 'welcome'),
    ],
    [
      new OrganizatoinEmployeeDetailsModel(
        12,
        'mohab',
        '01007599123',
        'mohab@gmail.com',
        1,
        null,
        [new TitleInterface({ id: 1, title: 'mohab' })],
        [],
      ),
      new OrganizatoinEmployeeDetailsModel(
        12,
        'mohab',
        '01007599123',
        'mohab@gmail.com',
        1,
        null,
        [new TitleInterface({ id: 1, title: 'mohab' })],
        [],
      ),
      new OrganizatoinEmployeeDetailsModel(
        12,
        'mohab',
        '01007599123',
        'mohab@gmail.com',
        1,
        null,
        [new TitleInterface({ id: 1, title: 'mohab' })],
        [],
      ),
      new OrganizatoinEmployeeDetailsModel(
        12,
        'mohab',
        '01007599123',
        'mohab@gmail.com',
        1,
        null,
        [new TitleInterface({ id: 1, title: 'mohab' })],
        [],
      ),
    ],
    [
      new InvestegationFactorModel(
        10,
        new TitleInterface({ id: 1, title: 'factor1' }),
        1,
        '',
        ['factor item', 'factor item', 'factor item', 'factor item', 'factor item'],
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
      ),
      new InvestegationFactorModel(
        10,
        InvestegationFactorModel.example.factory,
        1,
        '',
        ['factor item', 'factor item', 'factor item', 'factor item', 'factor item'],
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
      ),
      new InvestegationFactorModel(
        10,
        InvestegationFactorModel.example.factory,

        1,
        '',
        ['factor item', 'factor item', 'factor item', 'factor item', 'factor item'],
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
      ),
      new InvestegationFactorModel(
        10,
        InvestegationFactorModel.example.factory,

        1,
        'title',
        ['factor item', 'factor item', 'factor item', 'factor item', 'factor item'],
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
      ),
    ],
    [
      new InvestigationMeetingsModel(23, 1, '12-11-2025', '12-11-2025', 1, 'mohab', 'mohab'),
      new InvestigationMeetingsModel(23, 1, '12-11-2025', '12-11-2025', 1, 'mohab', 'mohab'),
      new InvestigationMeetingsModel(23, 1, '12-11-2025', '12-11-2025', 1, 'mohab', 'mohab'),
      new InvestigationMeetingsModel(23, 1, '12-11-2025', '12-11-2025', 1, 'mohab', 'mohab'),
    ],
    [
      new InvestigatingDocumentModel(23, 1, '12-11-2025', [
        new InvestegationDocumentMedaModel(23, 'url', 'file_name'),
      ]),
      new InvestigatingDocumentModel(23, 1, '12-11-2025', [
        new InvestegationDocumentMedaModel(23, 'url', 'file_name'),
      ]),
      new InvestigatingDocumentModel(23, 1, '12-11-2025', [
        new InvestegationDocumentMedaModel(23, 'url', 'file_name'),
      ]),
      new InvestigatingDocumentModel(23, 1, '12-11-2025', [
        new InvestegationDocumentMedaModel(23, 'url', 'file_name'),
      ]),
    ],
  )
}
