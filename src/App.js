import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { /* Route, */ Link } from "react-router-dom";
/* import HomePage from "./components/pages/HomePage"; */
import LoginPage from "./components/pages/LoginPage";
import DashboardPage from "./components/pages/DashboardPage";
import SignupPage from "./components/pages/SignupPage";
/* import UserRoute from "./components/routes/UserRoute"; */
import GuestRoute from "./components/routes/GuestRoute";
/* import TopNavigation from "./components/navigation/TopNavigation"; */
import realHomePage from "./components/pages/realHomePage";
import Agree from "./components/pages/agree";
import { Layout, Menu /* , Breadcrumb */ } from "antd";

const { Header, Content, Footer } = Layout;
const App = ({ location /*  isAuthenticated */ }) => (
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
              <Link to="/dashboard">Бараа</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/agree">Захиалга</Link>
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
              path="/dashboard"
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
              path="/agree"
              exact
              component={Agree}
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

/* <div className="ui container">
    <TopNavigation />
    <Route location={location} path="/" exact component={HomePage} />
    <GuestRoute location={location} path="/login" exact component={LoginPage} />
    <GuestRoute
      location={location}
      path="/signup"
      exact
      component={SignupPage}
    />
    <GuestRoute
      location={location}
      path="/dashboard"
      exact
      component={DashboardPage}
    />
    <GuestRoute
      location={location}
      path="/realHomePage"
      exact
      component={realHomePage}
    />
    <GuestRoute location={location} path="/agree" exact component={Agree} />
  </div> */
