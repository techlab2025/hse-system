import type Params from '@/base/core/params/params'

export default class CreateAttachmentMatrixParams implements Params {
  constructor(
    public x: string[],
    public y: string[],
    public z: string[],
  ) {}

  toMap(): Record<string, string[]> {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    }
  }
}
