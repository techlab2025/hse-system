import type Params from '@/base/core/params/params'
import { normalizeSystemIdentity, type SystemIdentity } from '../../Data/models/SystemIdentityModel'

export default class CreateSystemIdentityParams implements Params {
  private readonly identity: SystemIdentity
  constructor(identity: SystemIdentity) {
    this.identity = normalizeSystemIdentity(identity)
    this.identity.name = this.identity.name.trim()
    if (!this.identity.name) throw new Error('Identity name is required.')
  }
  toMap(): Record<string, unknown> {
    // JSON, not FormData: preserve nested maps, arrays, false, null and empty strings.
    return { ...normalizeSystemIdentity(this.identity) }
  }
}
