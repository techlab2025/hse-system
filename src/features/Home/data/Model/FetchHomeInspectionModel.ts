import EmployeeCertificatesModel from './employeeCertificatesModel'
import HazardObservationModel from './hazardObservationModel'
import InspectionModel from './InspectionModel'
import MostUsedModel from './MostUsedModel'

export default class FetchHomeInspectionModel {
  public totalIncidents: number
  public totalInspection: number
  public inspectionCompliancePercentage: number
  public openCorrectiveActions: number
  public hazardObservationsHigh: number
  public MostUsed: MostUsedModel[]
  public Inspection: InspectionModel
  public employeeCertificates: EmployeeCertificatesModel
  public Hazard: HazardObservationModel[]
  public totalInspectionSupposedOccuredThisMonth: number
  public totalFinishedInspectionsResults: number

  constructor(
    totalIncidents: number,
    totalInspection: number,
    inspectionCompliancePercentage: number,
    openCorrectiveActions: number,
    hazardObservationsHigh: number,
    MostUsed: MostUsedModel[],
    Inspection: InspectionModel,
    employeeCertificates: EmployeeCertificatesModel,
    Hazard: HazardObservationModel[],
    totalInspectionSupposedOccuredThisMonth: number,
    totalFinishedInspectionsResults: number,
  ) {
    this.totalIncidents = totalIncidents
    this.totalInspection = totalInspection
    this.inspectionCompliancePercentage = inspectionCompliancePercentage
    this.openCorrectiveActions = openCorrectiveActions
    this.hazardObservationsHigh = hazardObservationsHigh
    this.MostUsed = MostUsed
    this.Inspection = Inspection
    this.employeeCertificates = employeeCertificates
    this.Hazard = Hazard
    this.totalInspectionSupposedOccuredThisMonth = totalInspectionSupposedOccuredThisMonth
    this.totalFinishedInspectionsResults = totalFinishedInspectionsResults
  }

  static fromMap(data: any): FetchHomeInspectionModel {
    return new FetchHomeInspectionModel(
      data.total_incidents,
      data.total_inspection ,
      data.inspection_compliance_percentage,
      data.open_corrective_actions,
      data.hazard_observations_high,
      data.most_used_root_causes.map((item: any) => MostUsedModel.fromMap(item)),
      InspectionModel.fromMap(data.inspection_status),
      EmployeeCertificatesModel.fromMap( data.employee_certificates_status),
      data.hazard_with_high_risk_observations.map((item: any) => HazardObservationModel.fromMap(item)),
      data.total_inspection_supposed_occured_this_month,
      data.total_finished_inspections_results,
    )
  }
  static example = {
  }
}
