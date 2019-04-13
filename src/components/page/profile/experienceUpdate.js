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

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    this.setState({ data: this.props.data})
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

  handleShow() {
    this.setState({ showModal: true })
  }

  handleClose() {
    this.setState({ showModal: false })
  }

  render(){
    return(
      <div>
        <Button variant="primary" onClick={this.handleShow}>
         Edit experience
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


// <Button variant="primary" onClick={handleShow}>
//  Add new experience
// </Button>
//
// <Modal
//   show={this.state.show}
//   onHide={this.handleClose}
// >
//   <Modal.Header closeButton>
//     <Modal.Title>Modal heading</Modal.Title>
//   </Modal.Header>
//   <Modal.Body>
//     <ExperienceUpdate
//       profileId={profileId}
//       getProfileData={this.getProfileData}
//     />
//   </Modal.Body>
// </Modal>
