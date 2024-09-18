import React from 'react'
import { Image, Navbar } from 'react-bootstrap'
import iechorLogo from '../../images/iechor-logo.png'
import NavbarForm from '../Services/NavbarForm'
import { allowCollectionChange } from '../../bioagentsSum/common/helperFunctions'

const MatrixNavbar = () => (
  <Navbar collapseOnSelect bsStyle='default'>
    <Navbar.Header>
      <Navbar.Brand>
        <Image src={iechorLogo} responsive style={{ width: '112px', height: '73px', marginTop: '-10px', marginBottom: '-15px' }} />
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      {allowCollectionChange &&
        <Navbar.Form pullRight>
          <NavbarForm />
        </Navbar.Form>
      }
    </Navbar.Collapse>
  </Navbar>
)

export default MatrixNavbar
