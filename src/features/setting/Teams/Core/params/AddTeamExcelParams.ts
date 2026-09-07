import type Params from '@/base/core/params/params'

interface TeamExcelRow {
  title: string
}

export default class AddTeamExcelParams implements Params {
  data: TeamExcelRow[]

  constructor(data: { data: TeamExcelRow[] }) {
    this.data = data.data
  }

  toMap(): Record<string, TeamExcelRow[]> {
    return { data: this.data }
  }
}
