import 'babel-polyfill'
import React from 'react'
import * as R from 'ramda'
import ReactTable from 'react-table'
import FontAwesome from 'react-fontawesome'
import OverlayAgenttip from '../common/OverlayAgenttip'
import { PAGE_SIZE } from '../../constants/agentsTable'
import { getChartConfig } from '../../bioagentsSum/services/index'
import ReactHighcharts from 'react-highcharts'
import { getPublicationAndCitationsLink } from '../../bioagentsSum/table/index'
import { Button } from 'react-bootstrap'
import ChartWithSlider from './ChartWithSlider'

const getColumns = () => [
  {
    Header: 'Name and publications info (Sortable and filterable by name) ',
    id: 'name',
    accessor: data => data.name,
    sortable: true,
    sortMethod: (a, b) => {
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1
    },
    filterable: true,
    filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),
    Cell: data => {
      const { id, version, name, homepage, publication: publications, citations } = data.original

      return <div>
        <a href={homepage} target='_blank'>{name}</a>
        {version && <span>{` v.${version}`}</span>}
        <OverlayAgenttip id='agenttip-windows' agenttipText={`Bio.agents: ${name}`}>
          <a href={`https://bio.agents/${id}`} target='_blank'>
            <FontAwesome className='icons' name='question-circle' />
          </a>
        </OverlayAgenttip>
        <hr className='table-delimiter' />

        <div>
          <strong>{'Publications: '}</strong>
          {publications.length > 0
              ? publications.map((publication, index) =>
                <span key={index}>
                  {getPublicationAndCitationsLink(publication, index + 1)}
                  {index + 1 < publications.length ? ', ' : ''}
                </span>
              )
              : 'no'
            }
        </div>
        <hr className='table-delimiter' />
        <div>
          <strong>
            {`Total Citations: ${citations || '-'}`}
          </strong>
        </div>
      </div>
    },
    minWidth: 140,
  },
  {
    Header: 'Citations chart (Sortable by citations count)',
    id: 'citations-chart',
    accessor: data => R.isNil(data.citations) ? '-' : data.citations,
    sortable: true,
    sortMethod: (a, b) => {
      if (a === '-') return -1
      if (b === '-') return 1
      return a - b
    },
    Cell: data => {
      const { name, citations, citationsYears } = data.original

      return <div>

        {citationsYears && !R.isEmpty(citationsYears) && citations > 0
            ? <ReactHighcharts config={getChartConfig(citationsYears, name)} />
            : <strong>{'No chart available because there are 0 citations'}</strong>
          }
      </div>
    },
    className: 'horizontal-vertical-center',
    minWidth: 250,
  },
]

class AgentsTableWithChart extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selected: {},
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.createGraph) {
      this.deselectAll()
    }
  }

  toggleRow = (name, citationsYears) => {
    const { selected } = this.state
    const newSelected = selected[name] ? R.dissoc(name, selected) : R.assoc(name, citationsYears, selected)

    this.setState({
      selected: newSelected,
    })
  }

  deselectAll = () => {
    this.setState({
      selected: {},
    })
  }

  render () {
    const { list, createGraph } = this.props
    let columns = getColumns()
    let chartConfig = {}

    if (createGraph) {
      const { selected } = this.state
      const citationsYears = R.compose(
        R.map(
          R.reduce(R.mergeWith(R.add), 0)
        ),
        R.values,
      )(selected)

      const seriesNames = R.keys(selected)
      chartConfig = getChartConfig(citationsYears, 'agents', seriesNames)

      columns = R.prepend(
        {
          Header: <div>
            <span>{'Selected'}</span>
            <br />
            {!R.isEmpty(selected) &&
              <Button bsStyle='warning' bsSize='xsmall' onClick={this.deselectAll}>
                {'Deselect all'}
              </Button>
            }
          </div>,
          id: 'include-agent',
          accessor: '',
          Cell: ({ original: { name, citationsYears, citations } }) => !citations || citations === 0
            ? <div />
            : <div style={{ marginRight: 0 }} className='pretty p-icon p-smooth p-round p-bigger'>
              <input
                type='checkbox'
                checked={!!selected[name]}
                onChange={() => this.toggleRow(name, citationsYears)}
              />
              <div className='state p-success'>
                <i className='icon fa fa-check' aria-hidden='true' />
                <label />
              </div>
            </div>,
          style: { textAlign: 'center' },
          width: 90,
        },
        columns,
      )
    }

    return (
      <div>
        {createGraph && <ChartWithSlider chartConfig={chartConfig} />}
        <ReactTable
          data={list}
          columns={columns}
          resizable={false}
          sortable={false}
          showPaginationTop
          showPageSizeOptions={false}
          defaultPageSize={PAGE_SIZE}
          minRows={1}
          className='-highlight'
        />
      </div>
    )
  }
}

export default AgentsTableWithChart
