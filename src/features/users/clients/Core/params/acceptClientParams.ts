import type Params from "@/base/core/params/params";

export default class AcceptClientParams implements Params {
  id: string;
  code: string;
  status: number;

  constructor(id: string, code: string, status: number) {
    this.id = id;
    this.code = code;
    this.status = status;
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {};
    data["client_id"] = this.id;
    if (this.code) data["serial_number"] = this.code;
    data["status"] = this.status;
    return data;
  }
}
