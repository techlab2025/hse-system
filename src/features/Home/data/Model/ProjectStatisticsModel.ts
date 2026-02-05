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

  constructor(
    id: number,
    totalProjects: number,
    Projects: SingleProjectStatisticsModel[],
    topTeams: TopTeamsModel[],
    machines: StatisticsMachineModel[],
    incidantFactor: incidantFactorModel,
  ) {
    this.id = id
    this.totalProjects = totalProjects
    this.Projects = Projects
    this.topTeams = topTeams
    this.machines = machines
    this.incidantFactor = incidantFactor
  }

  static fromMap(data: any): ProjectStatisticsModel {
    return new ProjectStatisticsModel(
      data.id,
      data.total_projects,
      data.projects.map((project: any) => SingleProjectStatisticsModel.fromMap(project)),
      data.top_teams.map((team: any) => TopTeamsModel.fromMap(team)),
      data.machines.map((team: any) => StatisticsMachineModel.fromMap(team)),
      data.incidant_factor,
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
      new StatisticsMachineModel(1, 1, [
        { month: 1, number: 200 },
        { month: 2, number: 150 },
        { month: 3, number: 100 },
        { month: 4, number: 100 },
        { month: 5, number: 100 },
        { month: 6, number: 100 },
        { month: 7, number: 90 },
        { month: 8, number: 80 },
        { month: 9, number: 200 },
        { month: 10, number: 120 },
        { month: 11, number: 120 },
        { month: 12, number: 120 },
      ]),
      new StatisticsMachineModel(1, 2, [
        { month: 1, number: 200 },
        { month: 2, number: 150 },
        { month: 3, number: 100 },
        { month: 4, number: 100 },
        { month: 5, number: 100 },
        { month: 6, number: 100 },
        { month: 7, number: 90 },
        { month: 8, number: 80 },
        { month: 9, number: 200 },
        { month: 10, number: 120 },
        { month: 11, number: 120 },
        { month: 12, number: 120 },
      ]),
      new StatisticsMachineModel(1, 3, [
        { month: 1, number: 200 },
        { month: 2, number: 150 },
        { month: 3, number: 100 },
        { month: 4, number: 100 },
        { month: 5, number: 100 },
        { month: 6, number: 100 },
        { month: 7, number: 90 },
        { month: 8, number: 80 },
        { month: 9, number: 200 },
        { month: 10, number: 120 },
        { month: 11, number: 120 },
        { month: 12, number: 120 },
      ]),
    ],
    new incidantFactorModel(30, 120, 200),
  )
}
