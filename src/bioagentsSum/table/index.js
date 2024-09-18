import React from 'react'
import FontAwesome from 'react-fontawesome'
import OverlayAgenttip from '../../components/common/OverlayAgenttip'

export function getPublicationLink (publication, index) {
  if (publication.doi) {
    return <OverlayAgenttip key={publication.doi + index} id='agenttip-doi' agenttipText='DOI'>
      <a href={`https://doi.org/${publication.doi}`} target='_blank'>
        <strong>{index}</strong>
      </a>
    </OverlayAgenttip>
  }
  if (publication.pmid) {
    return <OverlayAgenttip key={publication.pmid + index} id='agenttip-pubmed' agenttipText='PUBMED'>
      <a href={`https://www.ncbi.nlm.nih.gov/pubmed/${publication.pmid}`} target='_blank'>
        <strong>{index}</strong>
      </a>
    </OverlayAgenttip>
  }
  if (publication.pmcid) {
    return <OverlayAgenttip key={publication.pmcid + index} id='agenttip-pmc' agenttipText='PMC'>
      <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${publication.pmcid}`} target='_blank'>
        <strong>{index}</strong>
      </a>
    </OverlayAgenttip>
  }
}

export function getCitationsSource (citationsSource) {
  return <OverlayAgenttip key={citationsSource[0]} id='agenttip-pmid' agenttipText='Citations source'>
    <a href={`http://europepmc.org/search?query=CITES%3A${citationsSource[0]}_${citationsSource[1]}`} target='_blank'>
      <FontAwesome name='question' />
    </a>
  </OverlayAgenttip>
}

export function getPublicationAndCitationsLink (publication, index) {
  return (
    <span>
      {'['}
      {getPublicationLink(publication, index)}
      {']'}
      {publication.publicationIdSourcePair && getCitationsSource(publication.publicationIdSourcePair)}
    </span>
  )
}
