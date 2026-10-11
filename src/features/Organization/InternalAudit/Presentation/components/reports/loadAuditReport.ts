import {
  DataEmpty,
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import ShowInternalAuditPlanParams from '../../../Core/params/plan/showInternalAuditPlanParams'
import FetchInternalAuditAttendanceParams from '../../../Core/params/attendance/fetchInternalAuditAttendanceParams'
import FetchInternalAuditPlanDetailsParams from '../../../Core/params/reports/fetchInternalAuditPlanDetailsParams'
import FetchInternalAuditReportParams from '../../../Core/params/reports/fetchInternalAuditReportParams'
import IndexNcrsParams from '../../../Core/params/ncrs/indexNcrsParams'
import FetchNcrDetailsParams from '../../../Core/params/ncrs/fetchNcrDetailsParams'
import ShowInternalAuditPlanUseCase from '../../../Domain/useCase/plan/showInternalAuditPlanUseCase'
import FetchInternalAuditAttendanceUseCase from '../../../Domain/useCase/attendance/fetchInternalAuditAttendanceUseCase'
import FetchInternalAuditPlanDetailsUseCase from '../../../Domain/useCase/reports/fetchInternalAuditPlanDetailsUseCase'
import FetchInternalAuditReportUseCase from '../../../Domain/useCase/reports/fetchInternalAuditReportUseCase'
import FetchNcrsUseCase from '../../../Domain/useCase/ncrs/fetchNcrsUseCase'
import FetchNcrDetailsUseCase from '../../../Domain/useCase/ncrs/fetchNcrDetailsUseCase'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'

const services = {
  plan: new ShowInternalAuditPlanUseCase(),
  summary: new FetchInternalAuditPlanDetailsUseCase(),
  attendance: new FetchInternalAuditAttendanceUseCase(),
  report: new FetchInternalAuditReportUseCase(),
  ncrs: new FetchNcrsUseCase(),
  ncr: new FetchNcrDetailsUseCase(),
}

// Each request returns its own state; report loading never reads a shared controller's state.
export async function loadAuditReport(auditId: number, api = services, isCurrent = () => true) {
  if (!Number.isInteger(auditId) || auditId <= 0) throw new Error('Select a valid audit.')
  const errors: Record<string, string> = {}
  async function fetchSection<T>(
    key: string,
    request: Promise<DataState<T>>,
    allowEmpty = false,
  ): Promise<T | null> {
    try {
      const state = await request
      if (state instanceof DataSuccess && state.data !== null) return state.data
      if (allowEmpty && state instanceof DataEmpty) return null
      errors[key] = state.error?.title || `Unable to load ${key}.`
    } catch {
      errors[key] = `Unable to load ${key}. Please try again.`
    }
    return null
  }
  const [plan, summary, attendance, report, ncrs] = await Promise.all([
    fetchSection('plan', api.plan.call(new ShowInternalAuditPlanParams(auditId))),
    fetchSection('summary', api.summary.call(new FetchInternalAuditPlanDetailsParams(auditId))),
    fetchSection('attendance', api.attendance.call(new FetchInternalAuditAttendanceParams()), true),
    fetchSection('report', api.report.call(new FetchInternalAuditReportParams(auditId)), true),
    fetchSection('NCR list', api.ncrs.call(new IndexNcrsParams('', 1, 1000, 0, auditId)), true),
  ])
  const fullNcrs: InternalAuditNcrModel[] = []
  for (const ncr of ncrs ?? []) {
    if (!isCurrent()) break
    const key = `NCR ${ncr.serial_name || ncr.ncr || ncr.id}`
    const full = await fetchSection(key, api.ncr.call(new FetchNcrDetailsParams(ncr.id)))
    if (full?.id === ncr.id && full.details) fullNcrs.push(full)
    else if (full) errors[key] = 'The returned NCR does not match the requested NCR.'
  }
  return { plan, summary, attendance: attendance ?? [], report, ncrs: ncrs ?? [], fullNcrs, errors }
}

export type AuditReportData = Awaited<ReturnType<typeof loadAuditReport>>
