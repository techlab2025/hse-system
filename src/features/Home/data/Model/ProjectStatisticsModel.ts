import incidantFactorModel from './incidantFactorModel'
import SingleProjectStatisticsModel from './SingleProjectStatisticsModel'
import StatisticsMachineModel from './StatisticsMachineModel'
import TopTeamsModel from './TopTeamsModel'

export default class ProjectStatisticsModel {
  public id: number
  public totalProjects: number
  public Projects: SingleProjectStatisticsModel[]
  public topTeams: TopTeamsModel[]
  public machines: StatisticsMachineModel[]
  public incidantFactor: incidantFactorModel
  public numberOfProjects: number

  constructor(
    id: number,
    totalProjects: number,
    Projects: SingleProjectStatisticsModel[],
    topTeams: TopTeamsModel[],
    machines: StatisticsMachineModel[],
    incidantFactor: incidantFactorModel,
    numberOfProjects: number,
  ) {
    this.id = id
    this.totalProjects = totalProjects
    this.Projects = Projects
    this.topTeams = topTeams
    this.machines = machines
    this.incidantFactor = incidantFactor
    this.numberOfProjects = numberOfProjects
  }

  static fromMap(data: any): ProjectStatisticsModel {
    return new ProjectStatisticsModel(
      data.id,
      data.total_projects,
      data.projects.map((project: any) => SingleProjectStatisticsModel.fromMap(project)),
      data.top_teams.map((team: any) => TopTeamsModel.fromMap(team)),
      data.machines.map((machine: any) => StatisticsMachineModel.fromMap(machine)),
      data.incidant_factor,
      data.number_of_projects,
    )
  }

  static example: ProjectStatisticsModel = new ProjectStatisticsModel(
    1,
    120,
    [
      new SingleProjectStatisticsModel(
        1,
        2,
        'Eco-friendly / Sustainability-oriented Names',
        99,
        50,
        40,
        2,
      ),
      SingleProjectStatisticsModel.example,
      SingleProjectStatisticsModel.example,
      SingleProjectStatisticsModel.example,
    ],
    [
      new TopTeamsModel(1, 'Team A', 200),
      new TopTeamsModel(2, 'Team B', 150),
      new TopTeamsModel(3, 'Team C', 100),
    ],
    [
      new StatisticsMachineModel('Zoon1', [
        { type: 1, value: 10 },
        { type: 2, value: 20 },
        { type: 3, value: 30 },
      ]),
      new StatisticsMachineModel('Zoon2', [
        { type: 1, value: 10 },
        { type: 2, value: 20 },
        { type: 3, value: 30 },
      ]),
      new StatisticsMachineModel('Zoon3', [
        { type: 1, value: 10 },
        { type: 2, value: 40 },
        { type: 3, value: 40 },
      ]),
      new StatisticsMachineModel('Zoon1', [
        { type: 1, value: 10 },
        { type: 2, value: 20 },
        { type: 3, value: 30 },
      ]),
      new StatisticsMachineModel('Zoon2', [
        { type: 1, value: 10 },
        { type: 2, value: 20 },
        { type: 3, value: 30 },
      ]),
      new StatisticsMachineModel('Zoon3', [
        { type: 1, value: 10 },
        { type: 2, value: 40 },
        { type: 3, value: 40 },
      ]),
    ],
    new incidantFactorModel(30, 120, 200),
    20,
  )
}
