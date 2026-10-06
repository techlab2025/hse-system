export default class NcrPreventiveActionParams {
  constructor(
    public preventive: string,
    public assignedToId: number,
    public targetDate: string,
    public actualDate: string,
  ) {}

  toMap() {
    return {
      title: this.preventive,
      assgined_to_id: this.assignedToId,
      due_date: this.targetDate,
      // actual_date: this.actualDate,
    }
  }
}
