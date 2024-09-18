export default class config {
  static getBioAgentsApiUrl (path = '') {
    return `https://bio.agents/api/agent/${path}&format=json`
  }

  static getCitationsApiUrl (src = '', id = '', page = '') {
    return `https://www.ebi.ac.uk/europepmc/webservices/rest/${src}/${id}/citations/${page}/1000/json`
    // https://www.ebi.ac.uk/europepmc/webservices/rest/MED/20972220/citations/1/1000/json
  }

  static getPublicationInfoApiUrl (id = '') {
    return `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${id}&format=json`
    // https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=ext_id:27174934%20src:med&format=json
  }

  static getOpenEBenchInfoApiUrl(id = '') {
    return `https://openebench.bsc.es/monitor/rest/aggregate?id=${id}`
  }

  static getOpenEBenchUptimeApiUrl(id, type, domain, limit = 8) {
    return `https://openebench.bsc.es/monitor/rest/homepage/${id}/${type}/${domain}?limit=${limit}`
  }
}
