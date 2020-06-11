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
  China,
  MenuPage,
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

  getUserData = () => {
    if (localStorage.getItem("userData") == undefined || localStorage.getItem("userData") == null || localStorage.getItem("userData") == "undefined") {
      return "";
    }
    return JSON.parse(localStorage.getItem("userData"));
  }

  checkMenus = (name, path, adminType, isRight) => {
    let user = this.getUserData();
    if (user == "") {
      return;
    }

    if (user.adminType == adminType) {
      return (
        <Menu.Item key={name} style={isRight ? { float: 'right' } : ''}>
          <Link to={path}>{name}</Link>
        </Menu.Item>
      )
    }
    return null;
  }

  checkRoutes = (location, path, adminType, compon) => {
    let user = this.getUserData();
    if (user == "") {
      return;
    }

    if (user.adminType === adminType) {
      return (
        <GuestRoute
          location={location}
          path={path}
          exact
          component={compon}
        />
      )
    }
    return null;
  }

  renderRoutes = () => {
    const { location } = this.props;
    if (this.getIsLogged() != null && this.getIsLogged() == "true") {
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
                {this.checkMenus("Бараа", "/product", 1)}
                {this.checkMenus("Захиалга", "/order", 1)}
                {this.checkMenus("Бранд бүртгэх", "/brand", 1)}
                {this.checkMenus("Өнгө бүртгэх", "/color", 1)}
                {this.checkMenus("Категори бүртгэх", "/category", 1)}
                {this.checkMenus("Баннер бүртгэх", "/banner", 1)}
                {this.checkMenus("Админ жагсаалт", "/admins", 1)}
                {/* {this.checkMenus("Барааны хүсэлт", "/productRequest", 2)} */}
                {this.checkMenus("Цэс бүртгэх", "/menu", 1)}
                <Menu.Item key="Барааны хүсэлт">
                  <Link to="/productRequest">Барааны хүсэлт</Link>
                </Menu.Item>
                <Menu.Item key="exit" style={{ float: 'right' }}>
                  <li onClick={this.exitWeb}>Гарах</li>
                </Menu.Item>
                <Menu.Item key="addAdmin" style={{ float: 'right' }}>
                  <li onClick={(e) => this.changeModal(true)}>Амдин нэмэх</li>
                </Menu.Item>
              </Menu>
            </Header>
            <Row>
              <Content style={{ padding: "0 50px", marginTop: "100px" }}>
                <div
                  style={{ background: "#fff", padding: "24px", height: "100%" }}
                >
                  {this.checkRoutes(location, "/signup", 1, SignupPage)}
                  {this.checkRoutes(location, "/product", 1, DashBoard)}
                  {this.checkRoutes(location, "/realHomePage", 1, realHomePage)}
                  {this.checkRoutes(location, "/order", 1, Agree)}
                  {this.checkRoutes(location, "/brand", 1, BrandPage)}
                  {this.checkRoutes(location, "/color", 1, ColorPage)}
                  {this.checkRoutes(location, "/category", 1, CategoryPage)}
                  {this.checkRoutes(location, "/banner", 1, BannerPage)}
                  {this.checkRoutes(location, "/admins", 1, AdminPage)}
                  {this.checkRoutes(location, "/menu", 1, MenuPage)}
                  <GuestRoute
                    location={location}
                    path={"/productRequest"}
                    exact
                    component={China}
                  />
                </div>
                <NewAdminModal visible={this.state.visible} changeActionModal={this.changeModal} />
              </Content>
            </Row>
            <Footer style={{ textAlign: "center" }}>Created by Amarshop.mn</Footer>
          </Layout>
        </div>
      )
    }
    else {
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