import React from "react";
import { connect } from "react-redux";
/* import PropTypes from "prop-types"; */
import { login } from "../../../actions/auth";
import { Form, Icon, Input, Button, /* , Checkbox  */ 
message} from "antd";
import { API_URL } from "../../../../package.json";
// import CryptoJS from "crypto-js";

class LoginPage extends React.Component {
  state = {
    data: {
      email: "",
      password: ""
    },
    loading: false,
    errors: {}
  };
  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  handleSubmit = e => {
    e.preventDefault();
    if(this.refs.username.state.value != undefined && this.refs.password.state.value != undefined && this.refs.username.state.value != "" && this.refs.password.state.value != "")
    {
      this.setState({ loading: true });
      let tmp = {
        email: this.refs.username.state.value,
        password: this.refs.password.state.value
      }
      fetch(`${API_URL}/admin/loginAdmin`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(tmp)
  
      }).then(response => response.json())
      .then(data => {
        if(data.success)
        {
          message.success(data.message);
          localStorage.setItem("isLogged", true);
          localStorage.setItem("userData", data[0]);
          this.refs.username.state.value = "";
          this.refs.password.state.value = "";
          this.setState({ loading: false });
          this.props.history.push("/admin");
        }
        else
        {
          message.error(data.message);
        }
      });
    }
    else
    {
      message.error("Нэвтрэх нэр нууц үг оруулна уу.");
    }
  };

  render() {
    return (
      <div className="container"
        style={{
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative"
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            position: "absolute",
            top: "50vh",
            width: "45vh",
            padding: "16px 32px",
            top: "35vh",
            borderRadius: "20px",
          }}
        >
          <h1>Amarshop.mn <br/> Нэвтрэх хэсэг</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Имэйл хаяг"
                name="username"
                ref="username"
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Нууц үг"
                name="password"
                ref="password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                disabled={this.state.loading}
                loading={this.state.loading}
              >
                Нэвтрэх
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: login
  };
};

export default connect(mapStateToProps)(LoginPage);
