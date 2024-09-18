import React, {Component} from 'react'
import ReactTable from 'react-table'
import * as R from 'ramda'
import FontAwesome from 'react-fontawesome'
import OverlayAgenttip from '../../common/OverlayAgenttip'

export default class AgentsBasicTable extends Component {
  render () {
    const {list} = this.props
    const columns = [
      {
        Header: 'Agent',
        id: 'name',
        accessor: ({name}) => name,
        sortable: true,
        sortMethod: (a, b) => {
          return a.toLowerCase() > b.toLowerCase() ? 1 : -1
        },
        filterable: true,
        filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),
        Cell: ({ original: { id, version, name, homepage, agentType } }) => (
          <div>
            <a href={homepage} target='_blank'>{name}</a>
            {version && <span>{` v.${version}`}</span>}
            <OverlayAgenttip id='agenttip-windows' agenttipText={`Bio.agents: ${name}`}>
              <a href={`https://bio.agents/${id}`} target='_blank'>
                <FontAwesome className='icons' name='question-circle' />
              </a>
            </OverlayAgenttip>
          </div>),
      },
      {
        Header: <div style={{display: 'flex'}}><div style={{paddingTop: 5, paddingBottom: 5, flex: '1', borderRight: '1px solid rgba(0,0,0,0.1)'}}>Input</div><div style={{paddingTop: 5, paddingBottom: 5, flex: '1', borderRight: '1px solid rgba(0,0,0,0.1)'}}>Output</div><div style={{paddingTop: 5, paddingBottom: 5, flex: '1'}}>Operations</div></div>,
        headerStyle: {padding: 0},
        id: 'functions',
        accessor: R.prop('function'),
        minWidth: 400,
        sortable: false,
        getProps: () => {
          return {
            style: {
              padding: 0,
            },
          }
        },
        Cell: data => {
          return (
            <ReactTable
              style={{border: 0}}
              showPagination={false}
              TheadComponent={props => null}
              minRows={0}
              columns={[
                {
                  Header: 'Input',
                  id: 'input',
                  accessor: R.compose(R.join(', '), R.map(R.compose(R.prop('term'), R.prop('data'))), R.propOr([], 'input')),
                },
                {
                  Header: 'Output',
                  id: 'output',
                  accessor: R.compose(R.join(', '), R.map(R.compose(R.prop('term'), R.prop('data'))), R.propOr([], 'output')),
                },
                {
                  Header: 'Operations',
                  id: 'operations',
                  accessor: R.compose(R.join(', '), R.map(R.prop('term')), R.propOr([], 'operation')),
                },
              ]}
              data={data.row.functions}
            />
          )
        },
      },
      // {
      //   Header: 'Input data',
      //   id: 'input',
      //   accessor: R.compose(
      //     // R.take(1),
      //     R.map(R.compose(R.join(', '), R.map(R.compose(R.prop('term'), R.prop('data'))), R.propOr([], 'input'))),
      //     R.propOr([], 'function'),
      //   ),
      //   Cell: data => subRows(data.row.input, cellSeparator)
      // },
      // {
      //   Header: 'Output data',
      //   id: 'output',
      //   accessor: R.compose(
      //     // R.take(1),
      //     R.map(R.compose(R.join(', '), R.map(R.compose(R.prop('term'), R.prop('data'))), R.propOr([], 'output'))),
      //     R.propOr([], 'function'),
      //   ),
      //   Cell: data => subRows(data.row.output, cellSeparator)
      // },
      // {
      //   Header: 'Operations',
      //   id: 'operations',
      //   accessor: R.compose(
      //     // R.take(1),
      //     R.map(R.compose(R.join(', '), R.map(R.prop('term')), R.propOr([], 'operation'))),
      //     R.propOr([], 'function')
      //   ),
      //   Cell: data => subRows(data.row.operations, cellSeparator)
      // },
      {
        Header: 'Platform',
        id: 'platform',
        Cell: ({original: {operatingSystem}}) => (
          <div>
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
        ),
      }, {
        Header: 'License',
        id: 'license',
        accessor: ({license}) => license,
      },
    ]

    return (
      <ReactTable
        minRows={1}
        columns={columns}
        data={list}
      />
    )
  }
}
