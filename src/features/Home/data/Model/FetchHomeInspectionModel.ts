import EmployeeCertificatesModel from './employeeCertificates'
import HazardObservationModel from './hazardObservation'
import InspectionModel from './Inspection'
import MostUsedModel from './MostUsed'

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
    )
  }
  static example = {
  }
}
