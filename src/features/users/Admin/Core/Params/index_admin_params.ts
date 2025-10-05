import type Params from "@/base/core/params/params";
import { formatJoinDate } from "@/base/Presentation/utils/date_format";

export default class IndexAdminsParams implements Params {
  public word: string;
  public withPage: number = 1;
  public perPage: number = 10;
  public pageNumber: number = 10;


  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,

  ) {
    this.word = word;
    this.withPage = withPage;
    this.pageNumber = pageNumber;
    this.perPage = perPage;

  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["word"] = this.word;
    data["with_pagination"] = this.withPage;
    data["page"] = this.pageNumber;
    data["per_page"] = this.perPage;

    return data;
  }
}
