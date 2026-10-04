export default class NcrPreventiveActionParams {
  constructor(
    public preventive: string,
    public assignedToId: number,
    public targetDate: string,
    public actualDate: string,
  ) {}

  toMap() {
    return {
      preventive: this.preventive,
      assgined_to_id: this.assignedToId,
      target_date: this.targetDate,
      actual_date: this.actualDate,
    }
  }
}
