import axios from 'axios'
import React from 'react'
import {Form} from 'react-bootstrap'

import Auth from '../../lib/auth'
import SocialPostShow from './socialPostShow'
import SocialPostNew from './createSocialPost'

class SocialPostIndex extends React.Component {
  constructor() {
    super()

    this.state = { data:{}, errors:{}, search: ''}

    this.handleLike = this.handleLike.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.getPostInfo = this.getPostInfo.bind(this)
  }

  componentDidMount() {
    this.getPostInfo()
  }

  getPostInfo(){
    axios.get('/api/social_posts')
      .then(res => this.setState({socialPosts: res.data}))
  }

  handleLike(e) {
    e.preventDefault()
    axios.put(`/api/social_posts/${e.target.name}/like`, {},
    { headers: {Authorization: `Bearer ${Auth.getToken()}`}})
      .then(() => this.getPostInfo())
      .catch(err => console.log(err.response))
  }

  handleChange({target: {name, value}}){
    const data = {...this.state.data, [name]: value}
    const errors = {...this.state.errors, [name]: ''}
    this.setState({ data, errors })
  }

  handleSubmit(e, socialPost){
    e.preventDefault()
    axios.post(`/api/social_posts/${socialPost.id}/comments`,  this.state.data,
    { headers: {Authorization: `Bearer ${Auth.getToken()}`}})
      .then(() => this.setState({data: ''}, this.getPostInfo()))
      .catch(err => this.setState({errors: err.response.data}))
  }

  handleDelete(e){
    axios.delete(`/api/social_posts/${e.target.value}`,
    { headers: {Authorization: `Bearer ${Auth.getToken()}`}})
      .then(() => this.getPostInfo())
  }

  handleSearch(e) {
    this.setState({ search: e.target.value.substr(0, 20) })
  }

  render(){
    if (!this.state.socialPosts) return null
    const {socialPosts} = this.state
    const filteredSocialPost = socialPosts.filter(post => post.post_title.toLowerCase().indexOf(this.state.search.toLowerCase())!== -1)
    return(
      <div className="postform">
        <SocialPostNew
          postInfo={this.getPostInfo}
        />
        <Form.Control
          type="text"
          placeholder="Search by name"
          value={this.state.search}
          onChange={this.handleSearch}
        / >
        {filteredSocialPost && filteredSocialPost.sort((a,b) => {
          if (a.id > b.id) return 1
          return -1
        }).map((socialPost,id) => (
          <div key={id}>
            <SocialPostShow
              getPostInfo = {this.getPostInfo}
              socialPost = {socialPost}
              handleLike = {this.handleLike}
              handleChange = {this.handleChange}
              handleSubmit = {this.handleSubmit}
              handleDelete = {this.handleDelete}
              data = {this.state.data}
              errors = {this.state.errors}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default SocialPostIndex