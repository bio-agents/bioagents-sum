import React from 'react'
import {Alert} from 'react-bootstrap'
import {connect} from 'react-redux'
import AgentsTable from './AgentsTable'
import {getServices} from '../../selectors/servicesSelector'
import {
  hyphenDelimitedToCamelCased,
  config,
  showOnlyAllServicesInCollection,
} from '../../bioagentsSum/common/helperFunctions'
import Loader from '../common/Loader'
import * as R from 'ramda'
import {ALL_SERVICES} from '../../constants/stringConstants'
import FileGenerationForm from './FileGenerationForm'
import {formValueSelector} from 'redux-form'
import {orderByAttributeAndTakeFirstX} from '../../bioagentsSum/services/index'
import AgentsTableWithChart from './AgentsTableWithChart'
import {reportType} from '../../constants/generateFile'
import {getActiveCollection} from '../../selectors/collectionSelector'
import AgentsBasicTable from './tables/AgentsBasicTable'
import AgentsExpertEvaluationTable from './tables/AgentsExpertEvaluationTable'
import {Route, Switch} from 'react-router'
import AgentsScientometryAvailabilityTable from './tables/AgentsScientometryAvailabilityTable'

class BioAgentsData extends React.PureComponent {
  shouldComponentUpdate (nextProps) {
    return !!nextProps.services
  }

  render () {
    const {
      services,
      message,
      showReportPage,
      reportTypeChosen,
      createGraph,
      includePropsChosen,
      sortBy,
      order,
      takeFirstX,
    } = this.props
    const {count, list, serviceLoading, citationsLoading} = services

    let agentsList = list
    if (reportTypeChosen !== reportType.CHART && sortBy && order) {
      agentsList = orderByAttributeAndTakeFirstX(list, sortBy, order, takeFirstX)
    }

    return (
      <div>
        {count
          ? <div>
            <Alert bsStyle='warning'>
              <div className='center-text'>
                {message + '.'}
                <br />
                {'There is a total number of '}<strong>{count}</strong>{' agents available.'}
              </div>
              {serviceLoading &&
              <div className='center-text'>
                <br/>
                {'Reloading agents...'}
                <br/>
                {'This might take some time...'}
                <Loader/>
              </div>
              }
              {citationsLoading &&
              <div>
                <div className='center-text'>
                  <br/>
                  {'Reloading citations count...'}
                  <br/>
                  {'This might take some time, but you are free to explore agents.'}
                </div>
                <Loader/>
              </div>
              }
            </Alert>
            {showReportPage && <FileGenerationForm list={agentsList}/>}
            {/*<AgentsBasicTable list={agentsList}/>*/}
            {/*<AgentsExpertEvaluationTable list={agentsList}/>*/}
            {/*{reportTypeChosen === reportType.CHART*/}
            {/*  ? <AgentsTableWithChart list={agentsList} createGraph={createGraph} />*/}
            {/*  : <AgentsTable list={agentsList} includePropsChosen={includePropsChosen} sortBy={sortBy} order={order} />*/}
            {/*}*/}
            <Switch>
              {!showReportPage &&
              <Route path="/views/evaluation"
                     render={(props) => <AgentsExpertEvaluationTable {...props} list={agentsList}/>}/>}
              {!showReportPage &&
              <Route path="/views/basic" render={(props) => <AgentsBasicTable {...props} list={agentsList}/>}/>}
              {!showReportPage &&
              <Route path="/views/scientometry"
                     render={(props) => <AgentsScientometryAvailabilityTable {...props} list={agentsList}/>}/>
              }
              <Route path="/" render={(props) => reportTypeChosen === reportType.CHART
                ? <AgentsTableWithChart {...props} list={agentsList} createGraph={createGraph}/>
                : <AgentsTable {...props} list={agentsList} includePropsChosen={includePropsChosen} sortBy={sortBy}
                              order={order}/>
              }/>
            </Switch>
          </div>
          : serviceLoading
            ? <Alert bsStyle='warning'>
              <div className='center-text'>
                <br/>
                {'Loading agents...'}
                <br/>
                {'This might take some time...'}
                <Loader/>
              </div>
            </Alert>
            : <Alert bsStyle='danger'>{'We are sorry, but there are no services.'}</Alert>
        }
      </div>
    )
  }
}

export default BioAgentsData = connect(state => {
  const path = state.router.location.pathname
  let servicesName = path.substr(path.lastIndexOf('/') + 1)

  if (showOnlyAllServicesInCollection) {
    servicesName = ALL_SERVICES
  }

  if (path === '/' && !showOnlyAllServicesInCollection) {
    return {}
  }

  const activeCollection = getActiveCollection(state)

  const message = servicesName === ALL_SERVICES
    ? `All ${activeCollection || 'selected'} services`
    : R.compose(
      R.concat(`All ${activeCollection} `),
      R.prop('message'),
      R.find(R.propEq('route', servicesName)),
      R.flatten,
      R.pluck('cells'),
    )(config.rows)

  const selector = formValueSelector('fileGenerationForm')

  return ({
    showReportPage: state.ui.showReportPage,
    services: getServices(state, hyphenDelimitedToCamelCased(servicesName)),
    message,
    reportTypeChosen: selector(state, 'reportType'),
    createGraph: selector(state, 'createGraph'),
    includePropsChosen: selector(state, 'includeProps'),
    sortBy: selector(state, 'sortBy'),
    order: selector(state, 'order'),
    takeFirstX: selector(state, 'takeFirstX'),
  })
})(BioAgentsData)
