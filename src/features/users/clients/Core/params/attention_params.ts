import type Params from "@/base/core/params/params";

export default class AttentionParams implements Params {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;

  constructor(
    id: number | null,
    name: string,
    email: string,
    phone: string,
    jobTitle: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.jobTitle = jobTitle;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    if (this.id) data["id"] = this.id;
    data["name"] = this.name;
    data["email"] = this.email;
    data["phone"] = this.phone;
    data["job_title"] = this.jobTitle;
    return data;
  }
}
