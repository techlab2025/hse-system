/* eslint-disable @typescript-eslint/no-explicit-any */
import TitleInterface from '@/base/Data/Models/title_interface'
import DrillTimelineItemModel from './DrillTimelineItemModel'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

export default class DrillModel {
  constructor(
    public id: number,
    public serialNumber: string,
    public date: string,
    public time: string,
    public evaluation: string,
    public improvement: string,
    public notes: string,
    public drillType: TitleInterface,
    public projectTeam: TitleInterface,
    public planning: DrillTimelineItemModel[] = [],
    public actions: DrillTimelineItemModel[] = [],
  ) {}

  static fromMap(data: any): DrillModel {
    const drillType = data.drill_type ?? data.drillType ?? {}
    const projectTeam = data.project_team ?? data.projectTeam ?? data.team ?? {}
    const planning = data.planning ?? data.planing ?? data.drill_planning ?? []
    const actions = data.actions ?? data.drill_actions ?? []

    return new DrillModel(
      Number(data.id ?? 0),
      useProjectAppStatusStore().isSerialNumberAuto()
        ? data.serial_name != 0
          ? data.serial_name
          : data.serial
        : data.serial,
      // String(data.serial_name ?? data.serial_number ?? data.serial ?? ''),
      String(data.date ?? ''),
      String(data.time ?? ''),
      String(data.evaluation ?? ''),
      String(data.improvement ?? ''),
      String(data.notes ?? ''),
      new TitleInterface({
        id: Number(drillType.id ?? data.drill_type_id ?? 0),
        title: String(drillType.title ?? data.drill_type_title ?? ''),
      }),
      new TitleInterface({
        id: Number(projectTeam.id ?? data.project_team_id ?? 0),
        title: String(projectTeam.title ?? projectTeam.team_title ?? data.team_title ?? ''),
      }),
      planning.map((item: any, index: number) => DrillTimelineItemModel.fromMap(item, index)),
      actions.map((item: any, index: number) => DrillTimelineItemModel.fromMap(item, index)),
    )
  }

  static example = new DrillModel(
    1,
    'DRL-2026-001',
    '2026-09-10',
    '10:30:00',
    'Evacuation completed within the target time.',
    'Improve radio communication at the assembly point.',
    'All participants attended the debrief.',
    new TitleInterface({ id: 1, title: 'Fire Drill' }),
    new TitleInterface({ id: 4, title: 'Emergency Response Team' }),
    [
      new DrillTimelineItemModel(
        1,
        '2026-09-12',
        '09:00:00',
        'Brief the emergency response team and confirm evacuation roles.',
        '',
        '',
        [],
      ),
    ],
  )
}
