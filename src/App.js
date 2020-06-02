import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Layout, Menu, Modal, Row, Form, Input } from "antd";


import SignupPage from "./components/pages/SignupPage";
import GuestRoute from "./components/routes/GuestRoute";
import realHomePage from "./components/pages/realHomePage";
import Agree from "./components/pages/agree";

import {
  LoginPage,
  BrandPage,
  ColorPage,
  CategoryPage,
  DashBoard,
  BannerPage,
  NewAdminModal,
  AdminPage,
} from "./components/pages";

const { Header, Content, Footer } = Layout;
const formItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
  }
};

class App extends Component {
  state = { 
    isAuthenticated: false,
    visible: false,
   }

  componentWillMount() {
    // console.log(this.props);
  }

  getIsLogged = () => {
    return localStorage.getItem("isLogged");
  }

  setIsLogged = (value) => {
    localStorage.setItem("isLogged", value);
  }

  changeModal = (action) => {
    this.setState({ visible: action });
  }

  exitWeb = () => {
    localStorage.setItem("isLogged", false);
    localStorage.setItem("userData", null);
    this.props.history.push("/");
  }

  renderRoutes = () => {
    const { location } = this.props;
    if(this.getIsLogged() != null && this.getIsLogged() == "true")
    {
      return (
        <div>
            <Layout style={{ height: "100vh", position: "relative", width: "100%" }}>
              <Header style={{ position: "fixed", zIndex: "1", width: "100%" }}>
                <div className="logo" />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  // defaultSelectedKeys={[location]}
                  style={{ lineHeight: "64px" }}
                >
                  <Menu.Item key="product">
                    <Link to="/product">Бараа</Link>
                  </Menu.Item>
                  <Menu.Item key="order">
                    <Link to="/order">Захиалга</Link>
                  </Menu.Item>
                  <Menu.Item key="brand">
                    <Link to="/brand">Бранд бүртгэх</Link>
                  </Menu.Item>
                  <Menu.Item key="color">
                    <Link to="/color">Өнгө бүртгэх</Link>
                  </Menu.Item>
                  <Menu.Item key="category">
                    <Link to="/category">Категори бүртгэх</Link>
                  </Menu.Item>
                  <Menu.Item key="banner">
                    <Link to="/banner">Баннер бүртгэх</Link>
                  </Menu.Item>
                  <Menu.Item key="admins">
                    <Link to="/admins">Админ жагсаалт</Link>
                  </Menu.Item>
                  <Menu.Item key="exit" style={{ float: 'right' }}>
                    <li onClick={this.exitWeb}>Гарах</li>
                  </Menu.Item>
                  <Menu.Item key="addAdmin" style={{ float: 'right' }}>
                    <li onClick={() => this.setState({ visible: true })}>Амдин нэмэх</li>
                  </Menu.Item>
                </Menu>
              </Header>
              <Content style={{ padding: "0 50px", marginTop: "100px" }}>
                <div
                  style={{ background: "#fff", padding: "24px", height: "100%" }}
                >
                  <GuestRoute
                    location={location}
                    path="/signup"
                    exact
                    component={SignupPage}
                  />
                  <GuestRoute
                    location={location}
                    path="/product"
                    exact
                    component={DashBoard}
                  />
                  <GuestRoute
                    location={location}
                    path="/realHomePage"
                    exact
                    component={realHomePage}
                  />
                  <GuestRoute
                    location={location}
                    path="/order"
                    exact
                    component={Agree}
                  />
                  <GuestRoute
                    location={location}
                    path="/brand"
                    exact
                    component={BrandPage}
                  />
                  <GuestRoute
                    location={location}
                    path="/color"
                    exact
                    component={ColorPage}
                  />
                  <GuestRoute
                    location={location}
                    path="/category"
                    exact
                    component={CategoryPage}
                  />
                  <GuestRoute
                    location={location}
                    path="/banner"
                    exact
                    component={BannerPage}
                  />
                  <GuestRoute
                    location={location}
                    path="/admins"
                    exact
                    component={AdminPage}
                  />
                </div>
                <NewAdminModal visible={this.state.visible} changeActionModal={this.changeModal} />
              </Content>
              <Footer style={{ textAlign: "center" }}>Created by Team1</Footer>
            </Layout>
          </div>
      )
    }
    else
    {
      return (
        <GuestRoute
        location={location}
        path="*"
        exact
        component={LoginPage}
      />
      )
    }
  } 

  render() {
    return (
      <div>
        {/*  <div style={{ height: "100vh", position: "relative", width: "100%" }}>
          <GuestRoute
            location={location}
            path="/login"
            exact
            component={LoginPage}
          />
        </div> */}
        {this.renderRoutes()}
      </div>
    )
  }
}



App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.email
  };
}

export default connect(mapStateToProps)(App);