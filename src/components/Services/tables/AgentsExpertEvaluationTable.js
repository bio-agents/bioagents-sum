import React, {Component} from 'react'
import {configRatingsKeys, configRatings} from '../../../bioagentsSum/common/helperFunctions'
import ReactTable from 'react-table'
import FontAwesome from 'react-fontawesome'
import OverlayAgenttip from '../../common/OverlayAgenttip'

export default class AgentsExpertEvaluationTable extends Component {
  render () {
    const {list} = this.props
    const columns = [{
      Header: 'Agent',
      id: 'name',
      accessor: ({name}) => name,
      sortable: true,
      sortMethod: (a, b) => {
        return a.toLowerCase() > b.toLowerCase() ? 1 : -1
      },
      Cell: ({original: {id, version, name, homepage, agentType}}) => (
        <div>
          <a href={homepage} target='_blank'>{name}</a>
          {version && <span>{` v.${version}`}</span>}
          <OverlayAgenttip id='agenttip-windows' agenttipText={`Bio.agents: ${name}`}>
            <a href={`https://bio.agents/${id}`} target='_blank'>
              <FontAwesome className='icons' name='question-circle' />
            </a>
          </OverlayAgenttip>
        </div>),
      filterable: true,
      filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),
    }]

    Object.keys(configRatingsKeys).forEach(key => {
      const label = configRatingsKeys[key]
      columns.push({
        Header: label,
        id: key,
        accessor: ({id}) => configRatings[id.toLowerCase()] ? configRatings[id.toLowerCase()][key] : null,
        sortable: true,
        sortMethod: (a, b) => {
          return a - b
        },
        filterable: true,
        getProps: (state, rowInfo, column) => {
          let background = null
          switch (rowInfo.row[key]) {
            case 5:
              background = '#5cb85c'
              break
            case 1:
              background = '#d9534f'
          }
          return {
            style: {
              textAlign: 'center',
              background: background,
            },
          }
        },
      })
    })

    return (
      <ReactTable
        columns={columns}
        data={list}
        minRows={1}
      />
    )
  }
}
