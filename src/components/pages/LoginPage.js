import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { Form, Icon, Input, Button, Checkbox } from 'antd';

class LoginPage extends React.Component {
  state = {
    data: {
      email: "",
      password: ""
    },
    loading: false,
    errors: {}
  };
  onSubmit = data => {
    this.props.history.push("/realHomePage");
    console.log("yaag darsan")
    console.log(this.props)
  }
  onChange = e =>
  this.setState({
    data: { ...this.state.data, [e.target.name]: e.target.value }
  });

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.history.push("/realHomePage");
    console.log("yaag darsan", e)
    console.log(this.props)
  }

  render() {
    return (
      <div className="container" style={{textAlign: 'center'}}>
        <div className="col-md-6" style={{border: '1px solid black'}}>
          <h1>Login page</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            </Form.Item>
            <Form.Item>
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" block>
                Log in
              </Button>
              <br/> Or <a href="">register now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
      
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  login: PropTypes.func.isRequired
};

export default connect(null, { login })(LoginPage);
