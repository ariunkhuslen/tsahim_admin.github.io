import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";


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
} from "./components/pages";

const { Header, Content, Footer } = Layout;

class App extends Component {
  state = { isAuthenticated: false }

  componentWillMount() {
    // console.log(this.props);
  }

  render() {
    const { location } = this.props;
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
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>Created by Team1</Footer>
          </Layout>
        </div>
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