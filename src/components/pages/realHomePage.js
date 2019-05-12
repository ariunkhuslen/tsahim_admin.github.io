import React from "react";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import { Form } from "antd";

class DashboardPage extends React.Component {
  state = {
    ModalText: "Content of the modal",
    visible: false,
    confirmLoading: false,
    data: []
  };

  render() {
    return (
      <div style={{ padding: "50px" }}>
        <Link to="/dashboard">Products</Link> or <Link to="/agree">Agree</Link>
        <h5>hello it home page</h5>
      </div>
    );
  }
}

export default Form.create({ name: "Ariunkhuslen" })(DashboardPage);
