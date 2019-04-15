import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'
import JobPostForm from './jobPostForm'

class JobPostNew extends React.Component {
  constructor() {
    super()

    this.state = { data: {}, errors: {}}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.fileInput = React.createRef()
  }

  handleChange({ target: { name, value }}) {
    const data = {...this.state.data, [name]: value }
    const errors = {...this.state.errors, [name]: ''}
    this.setState({ data, errors })
  }

  handleSelect(e, actionMeta){
    console.log(actionMeta)
    const arr = []
    e.forEach(val => {
      const industries = {id: parseInt(val.value), industry: val.label}
      arr.push(industries)
      const data = {...this.state.data, industries: arr }
      this.setState({data})
    })
  }

  handleDeleteObjectKey(){
    const key = ['industries']
    delete this.state.data[key]
    this.postAxios()
  }

  handleNestedObject(){
    if (!this.state.data.industries) {
      this.setState(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          industry_id: ''
        }
      }))
    } else {
      const newdata = this.state.data.industries.map(data => (
        {id: data.id}
      ))
      this.setState(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          industry_id: newdata
        }
      }))
    }
    setTimeout(() => {
      this.handleDeleteObjectKey()
    },200)
  }

  postAxios(){
    axios.post('/api/job_posts',
      this.state.data,
      { headers: {Authorization: `Bearer ${Auth.getToken()}`}})
      .then(() => this.setState({data: ''},() =>{
        this.fileInput.current.select.clearValue()
        this.props.postInfo()
      }))
      .catch(err => this.setState({ errors: err.response.data}))
  }


  handleSubmit(e) {
    e.preventDefault()
    this.handleNestedObject()
  }

  render() {
    console.log(this.state.errors);
    return (
      <div className="sectionTwo">
        <span>Create a new post</span>
        <hr/>
        <JobPostForm
          selectRef={this.fileInput}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handleSelect={this.handleSelect}
          data={this.state.data}
          errors={this.state.errors}
          validated={this.state.validated}
        />
      </div>
    )
  }
}

export default JobPostNew
