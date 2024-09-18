// import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { createEpicMiddleware } from 'redux-observable'
import { applyMiddleware, compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import 'react-table/react-table.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'pretty-checkbox/dist/pretty-checkbox.min.css'
import './styles/index.css'
import 'react-s-alert/dist/s-alert-default.css'
import 'rc-slider/assets/index.css'
import ServicesMatrix from './components/Matrix/ServicesMatrix'
import ServicesNavbar from './components/Services/ServicesNavbar'
import BioAgentsData from './components/Services/AgentsData'
import FillStore from './components/FillStore'
import {Route} from 'react-router'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import configureEpics from './epics/configureEpics'
import reducers from './reducers'
import { autoRehydrate, persistStore } from 'redux-persist'
import { Grid, Row } from 'react-bootstrap'
import MatrixNavbar from './components/Matrix/MatrixNavbar'
import Alert from 'react-s-alert'
import { config, showOnlyAllServicesInCollection } from './bioagentsSum/common/helperFunctions'

const composeEnhancers = (
  process.env.NODE_ENV !== 'production' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

const webEpics = []

const rootEpic = configureEpics({}, webEpics)

const epicMiddleware = createEpicMiddleware(rootEpic)

const history = createHistory({
  basename: config.basename,
})

const enhancers = [
  epicMiddleware,
  routerMiddleware(history),
]

function configureStore () {
  return new Promise((resolve, reject) => {
    try {
      const store = createStore(
        reducers(),
        {},
        composeEnhancers(
          applyMiddleware(...enhancers),
          autoRehydrate()
        )
      )

      persistStore(store, {
        blacklist: ['router', 'ui', 'form'],
      }, () => resolve(store))
    } catch (e) {
      reject(e)
    }
  })
}

async function init () {
  const store = await configureStore()
  let renderedComponent = {}

  if (showOnlyAllServicesInCollection) {
    renderedComponent = <Provider store={store}>
      <ConnectedRouter history={history}>
        <Grid>
          <Row className='show-grid'>
            <Route path='/' component={FillStore} />
            <Route path='/' component={ServicesNavbar} />
            <Route path='/' component={BioAgentsData} />
          </Row>
        </Grid>
      </ConnectedRouter>
    </Provider>
  } else {
    renderedComponent = <Provider store={store}>
      <ConnectedRouter history={history}>
        <Grid>
          <Row className='show-grid'>
            <Route path='/' component={FillStore} />
            <Route exact path='/' component={MatrixNavbar} />
            <Route exact path='/' component={ServicesMatrix} />
            <Route path='/:id' component={ServicesNavbar} />
            <Route path='/:id' component={BioAgentsData} />
          </Row>
        </Grid>
      </ConnectedRouter>
    </Provider>
  }

  ReactDOM.render(
    renderedComponent,
    document.getElementById('root')
  )

  ReactDOM.render(
    <div style={{ zIndex: 9999, position: 'relative' }}>
      <Alert stack={{ limit: 1 }} timeout={3000} />
    </div>,
    document.getElementById('alert')
  )
}

init()
