import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import DashboardPage from "./components/pages/DashboardPage";
import BrandPage from "./components/pages/BrandPage";
import SignupPage from "./components/pages/SignupPage";
import GuestRoute from "./components/routes/GuestRoute";
import realHomePage from "./components/pages/realHomePage";
import Agree from "./components/pages/agree";
import { Layout, Menu /* , Breadcrumb */ } from "antd";

const { Header, Content, Footer } = Layout;
const App = ({ location }) => (
  <div>
    {/* <Route location={location} path="/" exact component={LoginPage} /> */}
    {
      <Layout>
        <Header style={{ position: "fixed", zIndex: "1", width: "100%" }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1">
              <Link to="/product">Бараа</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/order">Захиалга</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/brand">Бранд бүртгэх</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: "100px" }}>
          <div
            style={{ background: "#fff", padding: "24px", minHeight: "710px" }}
          >
            <GuestRoute
              location={location}
              path="/login"
              exact
              component={LoginPage}
            />
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
              component={DashboardPage}
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
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Created by Team1</Footer>
      </Layout>
    }
  </div>
);

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