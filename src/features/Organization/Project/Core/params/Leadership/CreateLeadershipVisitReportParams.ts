import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type LeadershipVisitImprovementParams from './LeadershipVisitImprovementParams'

export default class CreateLeadershipVisitReportParams implements Params {
  constructor(
    public visitId: number,
    public topic: string,
    public discussion: string,
    public observations: string,
    public improvements: LeadershipVisitImprovementParams[],
    public attachments: string[],
  ) {}

  toMap(): Record<string, unknown> {
    return {
      visit_id: this.visitId,
      engagement_topic: this.topic,
      engagement_discussion: this.discussion,
      positive_observations: this.observations,
      areas_of_improvement: this.improvements.map((improvement) => improvement.toMap()),
      attachments: this.attachments,
      date: formatJoinDate(Date.now()),
    }
  }
}
