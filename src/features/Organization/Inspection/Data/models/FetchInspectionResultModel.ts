export default class FetchInspectionResultModel {
  public allResult: number
  public resultsReceivedToday: number
  public resultsCompleted: number
  public resultsNotYetCompleted: number
  public delayedResults: number

  constructor(
    allResult: number,
    resultsReceivedToday: number,
    resultsCompleted: number,
    resultsNotYetCompleted: number,
    delayedResults: number,
  ) {
    this.allResult = allResult
    this.resultsReceivedToday = resultsReceivedToday
    this.resultsCompleted = resultsCompleted
    this.resultsNotYetCompleted = resultsNotYetCompleted
    this.delayedResults = delayedResults
  }

  static fromMap(data: any): FetchInspectionResultModel {
    return new FetchInspectionResultModel(
      data.all_results,
      data.results_received_today,
      data.results_completed,
      data.results_not_yet_completed,
      data.delayed_results,
    )
  }

  static example: FetchInspectionResultModel = new FetchInspectionResultModel(10, 20, 30, 40, 50)
}
