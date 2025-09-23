import type Params from "@/base/core/params/params";
import { ClientStatusEnum } from "@/features/users/clients/clients/Core/enums/clientStatusEnum.ts";

export default class IndexClientsParams implements Params {
  public word: string;
  public withPage: number = 1;
  public perPage: number = 10;
  public pageNumber: number = 10;
  public order: number = 2;
  public clientStatus: number[] = [ClientStatusEnum.ACCEPT];

  constructor(
    word: string,
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    order: number = 2,
    clientStatus: number[] = [ClientStatusEnum.ACCEPT],
  ) {
    this.word = word;
    this.withPage = withPage;
    this.pageNumber = pageNumber;
    this.perPage = perPage;
    this.order = order;
    this.clientStatus = clientStatus;
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data:Record<string, string | number | number[] | null> = {};
    if (this.word) data["word"] = this.word;
    data["with_pagination"] = this.withPage;
    data["page"] = this.pageNumber;
    data["per_page"] = this.perPage;
    data["order"] = this.order;
    if (
      this.clientStatus.length > 0 &&
      this.clientStatus[0] !== ClientStatusEnum.ALL
    ) {
      data["new_status"] = this.clientStatus;
    }
    return data;
  }
}
