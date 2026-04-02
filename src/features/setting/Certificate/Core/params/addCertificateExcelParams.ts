import type Params from '@/base/core/params/params'
interface Data {
  title: string
  image: string
  require_expired_date: boolean
}
export default class AddCertificateExcelParams implements Params {
  data: Data[]
  constructor(data: { data: Data[] }) {
    this.data = data.data
  }

  toMap(): Record<
    string,
    number | string | Data[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      number | string | Data[] | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    if (this.data) data['data'] = this.data

    return data
  }
}
