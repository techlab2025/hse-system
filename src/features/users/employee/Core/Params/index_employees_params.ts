import type Params from "@/base/core/params/params";
import { formatJoinDate } from "@/base/Presentation/utils/date_format";

export default class IndexEmployeesParams implements Params {
  public word: string;
  public withPage: number = 1;
  public perPage: number = 10;
  public pageNumber: number = 10;
  public status: number[] = [];
  public startDate?: string;
  public endDate?: string;
  public clientRequestStatus?: number;
  public departmentIds?: number[];

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    status: number[] = [],
    startDate?: string,
    endDate?: string,
    clientRequestStatus?: number,
    departmentIds?: number[],
  ) {
    this.word = word;
    this.withPage = withPage;
    this.pageNumber = pageNumber;
    this.perPage = perPage;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.clientRequestStatus = clientRequestStatus;
    this.departmentIds = departmentIds;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["word"] = this.word;
    data["with_pagination"] = this.withPage;
    data["page"] = this.pageNumber;
    data["per_page"] = this.perPage;
    if (this.status.length > 0) data["project_status"] = this.status;
    if (this.startDate) data["start_date"] = formatJoinDate(this.startDate);
    if (this.endDate) data["end_date"] = formatJoinDate(this.endDate);
    if (this.clientRequestStatus)
      data["client_request_status"] = this.clientRequestStatus;
    if (this.departmentIds && this.departmentIds.length > 0)
      data["department_ids"] = this.departmentIds;
    return data;
  }
}
