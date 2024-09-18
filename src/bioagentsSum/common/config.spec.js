import config from './config'

test('Get bio.agents api url with parameter', () => {
  expect(config.getBioAgentsApiUrl('path')).toEqual('https://bio.agents/api/agent/path')
})
test('Get bio.agents api url without parameter', () => {
  expect(config.getBioAgentsApiUrl()).toEqual('https://bio.agents/api/agent/')
})

test('Get citations info api url with parameters', () => {
  expect(config.getCitationsApiUrl('src', 'id', 'page'))
    .toEqual('https://www.ebi.ac.uk/europepmc/webservices/rest/src/id/citations/page/1000/json')
})
test('Get citations api url without parameters', () => {
  expect(config.getCitationsApiUrl())
    .toEqual('https://www.ebi.ac.uk/europepmc/webservices/rest///citations//1000/json')
})

test('Get publication info api url with parameter', () => {
  expect(config.getPublicationInfoApiUrl('id'))
    .toEqual('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=id&format=json')
})
test('Get publication info api url without parameter', () => {
  expect(config.getPublicationInfoApiUrl())
    .toEqual('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=&format=json')
})
