import IndexNcrsParams from '../ncrs/indexNcrsParams'

export default class IndexMyNcrsParams extends IndexNcrsParams {
  constructor(internalAuditId: number, word = '', pageNumber = 1, perPage = 10, withPage = 0) {
    super(word, pageNumber, perPage, withPage, internalAuditId)
  }
}
