import TitleInterface from '@/base/Data/Models/title_interface'
import IndexCapaModel from './IndexCapaModel'
import InvestigatingModel from '@/features/Organization/Investigating/Data/models/investigatingModel'
import { CapaTaskDetailsModel } from './CapaTasksModel'
import type { VerificationEnum } from '../../Core/Core/VerificationEnum'
import InternalAuditNcrDetailsModel from '@/features/Organization/InternalAudit/Data/models/ncrs/InternalAuditNcrDetailsModel'

export default class ShowCapaDetailsModel extends TitleInterface {
  public id: number
  public corrective: string
  public preventive: string
  public serialName: string
  public observationCapaId: number
  public observationId: number
  public date: string
  public time: string
  public observation: IndexCapaModel | null
  public internalAuditNcr: InternalAuditNcrDetailsModel | null
  public investigation: InvestigatingModel | null
  public correctiveTasks: CapaTaskDetailsModel[]
  public preventiveTasks: CapaTaskDetailsModel[]
  public lessonLearnt: string
  public resultFindings: string
  public verificationMethodology: string
  public verificationStatus: VerificationEnum

  constructor(data: {
    id: number
    corrective: string
    preventive: string
    serialName: string
    observationCapaId: number
    observationId: number
    date: string
    time: string
    observation: IndexCapaModel | null
    internalAuditNcr: InternalAuditNcrDetailsModel | null
    investigation: InvestigatingModel | null
    correctiveTasks: CapaTaskDetailsModel[]
    preventiveTasks: CapaTaskDetailsModel[]
    lessonLearnt: string
    resultFindings: string
    verificationMethodology: string
    verificationStatus: VerificationEnum
  }) {
    super({ id: data.id, title: '' })
    this.id = data.id
    this.corrective = data.corrective
    this.preventive = data.preventive
    this.serialName = data.serialName
    this.observationCapaId = data.observationCapaId
    this.observationId = data.observationId
    this.date = data.date
    this.time = data.time
    this.observation = data.observation
    this.internalAuditNcr = data.internalAuditNcr
    this.investigation = data.investigation
    this.correctiveTasks = data.correctiveTasks
    this.preventiveTasks = data.preventiveTasks
    this.lessonLearnt = data.lessonLearnt
    this.resultFindings = data.resultFindings
    this.verificationMethodology = data.verificationMethodology
    this.verificationStatus = data.verificationStatus
  }

  static fromMap(data: any): ShowCapaDetailsModel {
    const source = data.observation ?? data.internal_audit_ncr
    const investigation = data.investigation ?? source?.investigation
    const correctiveTasks =
      data.corrective_tasks ??
      data.correctiveTasks ??
      data.coorevtive_tasks ??
      source?.corrective_tasks ??
      source?.correctiveTasks ??
      source?.coorevtive_tasks ??
      investigation?.corrective_tasks ??
      investigation?.correctiveTasks ??
      investigation?.coorevtive_tasks ??
      []
    const preventiveTasks =
      data.preventive_tasks ??
      data.preventiveTasks ??
      data.previtive_tasks ??
      source?.preventive_tasks ??
      source?.preventiveTasks ??
      source?.previtive_tasks ??
      investigation?.preventive_tasks ??
      investigation?.preventiveTasks ??
      investigation?.previtive_tasks ??
      []

    return new ShowCapaDetailsModel({
      id: data.id,
      corrective: data.corrective,
      preventive: data.preventive,
      serialName: data.serial_name,
      observationCapaId: data.observation_capa_id,
      observationId: data.observation_id,
      date: data.date,
      time: data.time,
      observation: data.observation ? IndexCapaModel.fromMap(data.observation) : null,
      internalAuditNcr: data.internal_audit_ncr
        ? InternalAuditNcrDetailsModel.fromMap(data.internal_audit_ncr)
        : null,
      investigation: investigation ? InvestigatingModel.fromMap(investigation) : null,
      correctiveTasks: correctiveTasks.map((item: any) => CapaTaskDetailsModel.fromMap(item)),
      preventiveTasks: preventiveTasks.map((item: any) => CapaTaskDetailsModel.fromMap(item)),
      lessonLearnt: data.lesson_learnt ?? data.lessonLearnt ?? '',
      resultFindings: data.result_findings ?? data.resultFindings ?? '',
      verificationMethodology: data.verification_methodology ?? data.verificationMethodology ?? '',
      verificationStatus: data.verification_status ?? data.verificationStatus ?? '',
    })
  }
}
