import type Params from "@/base/core/params/params";

export default class AttachmentParams implements Params {
  file: string;
  alt: string;

  constructor(file: string, alt: string) {
    this.file = file;
    this.alt = alt;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data.file = this.file;
    data.alt = this.alt;
    return data;
  }
}
