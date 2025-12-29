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
  }

  static fromMap(data: any): InvestigatingDetailsModel {
    return new InvestigatingDetailsModel(
      data.id,
      data.investigation_id,
      data.date,
      data.status,
      data.type,
      data.latest_investigation_meeting_id,
      data.observation,
      data.investigation_team_leader,
      data.investigation_tasks,
      data.investigation_employees,
      data.investigation_factors,
      data.investigation_meetings,
      data.investigation_documentations,
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
