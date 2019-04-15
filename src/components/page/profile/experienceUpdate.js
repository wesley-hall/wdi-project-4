import React from 'react'
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap'

import Auth from '../../lib/auth'

import ExperienceForm from './experienceForm'

class ExperienceUpdate extends React.Component{
  constructor() {
    super()

    this.state = {
      data: {},
      errors: {},
      showModal: false
    }

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  componentDidMount() {
    this.setState({ data: this.props.data })
  }

  handleShow() {
    this.setState({ showModal: true })
  }

  handleClose() {
    this.setState({ showModal: false })
  }


  handleChange({target: {name, value}}){
    const data = {...this.state.data, [name]: value}
    const errors = {...this.state.errors, [name]: ''}
    this.setState({ data, errors })
  }

  handleSubmit(e){
    e.preventDefault()
    axios.put(`/api/profiles/${this.props.profileId}/experiences/${this.props.experienceId}`, this.state.data,
      { headers: { Authorization: `Bearer ${Auth.getToken()}`}})
      .then(() => {
        this.handleClose()
        this.props.getProfileData()
        console.log('on submit', this.state)
      })
      .catch(err => err.response && this.setState({errors: err.response.data}))
  }

  render(){
    return(
      <div>
        <Button className="m-1 px-4" size="sm" variant="info" onClick={this.handleShow}>
         Edit
        </Button>
        <Modal
          show={this.state.showModal}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Experience at {this.state.data.company}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ExperienceForm
              data={this.state.data}
              errors={this.state.errors}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
            />
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default ExperienceUpdate
