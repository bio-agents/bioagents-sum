import 'babel-polyfill'
import React from 'react'
import * as R from 'ramda'
import ReactTable from 'react-table'
import ReadMore from '../common/ReadMore'
import { Label } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import OverlayAgenttip from '../common/OverlayAgenttip'
import ShowMore from '../common/ShowMore'
import { MAIN_ROW_CELLS_COUNT, PAGE_SIZE } from '../../constants/agentsTable'
import { getCellsCount, getChartConfig } from '../../bioagentsSum/services/index'
import ReactHighcharts from 'react-highcharts'
import HighChartsExporting from 'highcharts-exporting'
import HighChartsNoData from 'highcharts-no-data-to-display'
import { getPublicationAndCitationsLink } from '../../bioagentsSum/table/index'
// import {configRatings, configRatingsKeys} from '../../bioagentsSum/common/helperFunctions'
// import StarRating from '../common/StarRating'
HighChartsExporting(ReactHighcharts.Highcharts)
HighChartsNoData(ReactHighcharts.Highcharts)

const getColumns = (includePropsChosen) => {
  const isInfoMode = includePropsChosen === undefined

  let columns = [{
    Header: `Name ${isInfoMode ? '(Sortable, filterable)' : ''}`,
    id: 'name',
    accessor: ({ name }) => name,
    sortable: isInfoMode,
    sortMethod: (a, b) => {
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1
    },
    filterable: isInfoMode,
    filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),
    Cell: ({ original: { id, version, name, homepage, agentType } }) => {
      return <div>
        <a href={homepage} target='_blank'>{name}</a>
        {version && <span>{` v.${version}`}</span>}
        <OverlayAgenttip id='agenttip-windows' agenttipText={`Bio.agents: ${name}`}>
          <a href={`https://bio.agents/${id}`} target='_blank'>
            <FontAwesome className='icons' name='question-circle' />
          </a>
        </OverlayAgenttip>
        {/*{configRatings && configRatings[id] && (*/}
        {/*  <div>*/}
        {/*    <hr className="table-delimiter"/>*/}
        {/*    {Object.keys(configRatingsKeys).map(key => <StarRating key={key} value={configRatings[id][key]}>{configRatingsKeys[key]}</StarRating>)}*/}
        {/*  </div>*/}
        {/*)}*/}
        {(isInfoMode || includePropsChosen.includes('agentType')) &&
          <div>
            <hr className='table-delimiter' />
            <p>
              {agentType.map((value, index) =>
                <span key={index}>
                  <Label bsStyle='warning'>{value}</Label>
                  <br />
                </span>
              )}
            </p>
          </div>
        }
      </div>
    },
    minWidth: 120,
  }]

  if (isInfoMode || includePropsChosen.includes('institute')) {
    columns.push(
      {
        Header: 'Institute',
        id: 'institute',
        accessor: ({ credit }) => credit,
        Cell: ({ value }) => value.length > 0
          ? <ul className='table-list-item'>
            {value.map((institute, index) =>
              <li key={index}>{institute.name}</li>
            )}
          </ul>
          : <div />,
        minWidth: 150,
      }
    )
  }

  if (isInfoMode || includePropsChosen.includes('description')) {
    columns.push(
      {
        Header: `Description ${isInfoMode ? '(Filterable)' : ''}`,
        id: 'description',
        accessor: ({ description }) => description,
        filterable: isInfoMode,
        filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),
        Cell: ({ value }) => <ReadMore chars={350} text={value} />,
        minWidth: 150,
      }
    )
  }

  const includePublications = !isInfoMode && includePropsChosen.includes('publication')
  const includeCitations = !isInfoMode && includePropsChosen.includes('citations')
  if (isInfoMode || includePublications || includeCitations) {
    columns.push(
      {
        Header: `Publications info ${isInfoMode ? '(Sortable)' : ''}`,
        id: 'additional-info',
        accessor: ({ citations }) => R.isNil(citations) ? '-' : citations,
        sortable: isInfoMode,
        sortMethod: (a, b) => {
          if (a === '-') return -1
          if (b === '-') return 1
          return a - b
        },
        Cell: ({ original: { publication: publications, citations } }) => {
          return <div>
            {(isInfoMode || includePublications) &&
              <div>
                <strong>{'Publications: '}</strong>
                {publications.length > 0
                  ? publications.map((publication, index) =>
                    <span key={index}>
                      {getPublicationAndCitationsLink(publication, index + 1)}
                      {index + 1 < publications.length && ', '}
                    </span>
                  )
                  : 'no'
                }
              </div>
            }
            {(isInfoMode || (includePublications && includeCitations)) &&
              <hr className='table-delimiter' />
            }
            {(isInfoMode || includeCitations) &&
              <div>
                <strong>
                  {`Total Citations: ${citations || '-'}`}
                </strong>
              </div>
            }
          </div>
        },
        minWidth: 90,
        className: '',
      }
    )
  }

  return columns
}

const getSubColumns = (includePropsChosen) => {
  let subColumns = []
  const isInfoMode = includePropsChosen === undefined

  if (isInfoMode || includePropsChosen.includes('topic')) {
    subColumns.push(
      {
        Header: 'Topic',
        id: 'topic',
        accessor: ({ topic }) => <ShowMore lines={3} searchTermName='topic' list={topic} ulClassName='table-list-item' />,
        minWidth: 120,
      }
    )
  }
  if (isInfoMode || includePropsChosen.includes('function')) {
    subColumns.push(
      {
        Header: 'Function',
        id: 'function',
        accessor: data => <ShowMore lines={3} searchTermName='operation' list={data.func || data.function} ulClassName='table-list-item' />,
        minWidth: 120,
      }
    )
  }

  const includeMaturity = !isInfoMode && includePropsChosen.includes('maturity')
  const includePlatform = !isInfoMode && includePropsChosen.includes('platform')
  if (isInfoMode || includeMaturity || includePlatform) {
    subColumns.push(
      {
        Header: 'Additional info',
        id: 'additional-info',
        Cell: ({ original: { maturity, operatingSystem } }) => {
          const labelStyle = maturity === 'Mature' ? 'success' : maturity === 'Emerging' ? 'info' : 'danger'

          if (!maturity && operatingSystem.length === 0) {
            return <span>{'No additional info available'}</span>
          }

          return <div>
            {(isInfoMode || (includeMaturity && maturity)) &&
              <div>
                <strong>
                  {'Maturity: '}
                </strong>
                <Label bsStyle={labelStyle} className='label-margin'>
                  {maturity}
                </Label>
              </div>
            }

            {(isInfoMode || (includeMaturity && includePlatform && maturity && operatingSystem.length > 0)) &&
              <hr className='table-delimiter' />
            }

            {(isInfoMode || (includePlatform && operatingSystem.length > 0)) &&
              <div>
                <strong>{'Platforms: '}</strong>
                {R.contains('Windows', operatingSystem) &&
                  <OverlayAgenttip id='agenttip-windows' agenttipText='Platform: Windows'>
                    <FontAwesome className='icons' name='windows' />
                  </OverlayAgenttip>
                }
                {R.contains('Linux', operatingSystem) &&
                  <OverlayAgenttip id='agenttip-linux' agenttipText='Platform: Linux'>
                    <FontAwesome className='icons' name='linux' />
                  </OverlayAgenttip>
                }
                {R.contains('Mac', operatingSystem) &&
                  <OverlayAgenttip id='agenttip-mac' agenttipText='Platform: Mac'>
                    <FontAwesome className='icons' name='apple' />
                  </OverlayAgenttip>
                }
              </div>
            }
          </div>
        },
        minWidth: 80,
      }
    )
  }

  return subColumns
}

const expander = {
  expander: true,
  Header: 'More',
  width: 55,
  Expander: ({ isExpanded }) =>
    isExpanded
      ? <OverlayAgenttip id='agenttip-show-less-info' agenttipText='Show less info'>
        <FontAwesome className='more-icon' name='caret-up' />
      </OverlayAgenttip>
      : <OverlayAgenttip id='agenttip-show-more-info' agenttipText='Show more info'>
        <FontAwesome className='more-icon' name='caret-down' />
      </OverlayAgenttip>,
  className: 'table-expander',
}

class AgentsTable extends React.PureComponent {
  render () {
    const { list, includePropsChosen } = this.props

    let columns = getColumns(includePropsChosen)
    const subColumns = getSubColumns(includePropsChosen)
    const cellsPerRowCount = getCellsCount(includePropsChosen)

    if (cellsPerRowCount <= MAIN_ROW_CELLS_COUNT) {
      columns = R.concat(columns, subColumns)
    } else {
      columns.push(expander)
    }

    return (
      <ReactTable
        data={list}
        columns={columns}
        resizable={false}
        sortable={false}
        onExpandedChange={this.onExpandedChange}
        showPaginationTop
        showPageSizeOptions={false}
        defaultPageSize={PAGE_SIZE}
        minRows={1}
        className='-highlight'
        SubComponent={cellsPerRowCount <= MAIN_ROW_CELLS_COUNT ? null : row => {
          const { original } = row
          const subList = [{
            func: R.compose(R.prop('operation'), R.head)(original.function),
            topic: original.topic,
            maturity: original.maturity,
            operatingSystem: original.operatingSystem,
          }]
          const { citationsYears, citations, publication } = original
          const seriesNames = R.map(R.join(': '), R.pluck('publicationIdSourcePair', publication))

          return (
            <div className='sub-table'>
              <ReactTable
                data={subList}
                columns={subColumns}
                defaultPageSize={1}
                showPagination={false}
                sortable={false}
              />
              {citationsYears && !R.isEmpty(citationsYears) && citations > 0 &&
                <ReactHighcharts config={getChartConfig(citationsYears, original.name, seriesNames)} />
              }
            </div>
          )
        }}
      />
    )
  }
}

export default AgentsTable
