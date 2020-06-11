import React from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import { Form, Divider, Modal, Button, Icon } from "antd";
/* import { Link } from "react-router-dom"; */
import { API_URL } from "../../../package.json";
const { Column /* , ColumnGroup */ } = Table;
/* const formatter = new Int16Array.NumberFormat("en-US"); */
const columns = [
  {
    title: "Захиалгын дугаар",
    dataIndex: "ord_no",
    key: "ord_no"
  },
  {
    title: "Барааны id",
    dataIndex: "product_id",
    key: "product_id"
  },
  {
    title: "Барааны нэр",
    dataIndex: "skunm",
    key: "skunm"
  },
  {
    title: "Тоо ширхэг",
    dataIndex: "buying_qty",
    key: "buying_qty"
  },
  /* {
    title: "ord_type",
    dataIndex: "ord_type",
    key: "ord_type"
  }, */
  {
    title: "Үнэ",
    dataIndex: "price",
    key: "price"
  }
];

class DashboardPage extends React.Component {
  state = {
    data: [],
    myData: [],
    ModalText: "Content of the modal",
    visible: false,
    confirmLoading: false
  };

  setData() {
    fetch(API_URL + "/order/getOrders")
      .then(function (response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({ data: myJson.data });
      });
  }

  componentWillMount() {
    this.setData();
  }

  onAgree(e, record) {
    var url = API_URL + "/order/approveOrder/" + record.id;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log("Success:", response);
        this.setData();
      })
      .catch(error => console.error("Error:", error));
  }

  onDisAgree(e, record) {
    var url = API_URL + "/order/unApproveOrder/" + record.id;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log("Success:", response);
        this.setData();
      })
      .catch(error => console.error("Error:", error));
  }

  showModal = (e, record) => {
    fetch(API_URL + "/order/getOrderDetail/" + record.ord_no)
      .then(function (response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({ myData: myJson.data });
      });
    this.setState({
      visible: true
    });
  };

  deleteOrder = (e, record) => {
    fetch(`${API_URL}/order/deleteOrder/${record.id}`, {
        method: 'DELETE',
    }).then(response => response.json())
        .then(data =>
            this.setData()
        );
}

  handleOk = () => {
    this.setState({
      ModalText: "The modal will be closed after two seconds",
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <Table
          rowSelection={this.rowSelection}
          dataSource={this.state.data}
          onClick={this.onClicked}
          bordered
        >
          {/* <Column title="Захиалга" dataIndex="id" key="id" /> */}
          <Column title="Захиалгын дугаар" dataIndex="ord_no" key="ord_no" />
          <Column title="Хаяг" dataIndex="ord_addr" key="ord_addr" />
          <Column title="Хүргэлт" dataIndex="ord_delivery" key="ord_delivery" />
          <Column title="И-Мэйл" dataIndex="ord_email" key="ord_email" />
          <Column title="Нэр" dataIndex="ord_name" key="ord_name" />

          {/* <Column title="ord_type" dataIndex="ord_type" key="ord_type" /> */}
          {/* <Column title="Хэрэглэгчийн id" dataIndex="ord_userid" key="ord_userid" /> */}
          <Column
            title=""
            key="action"
            render={(text, record) => (
              <span>
                {record.ord_type === 0 ? (
                  <Button icon="plus" size={"medium"} onClick={e => this.onAgree(e, record)}/>
                ) : (
                    <Button  icon="minus" size={"medium"} onClick={e => this.onDisAgree(e, record)}/>
                  )}
                <Divider type="vertical" />
                <Button  icon="eye" size={"medium"} onClick={e => this.showModal(e, record)}/>
                <Divider type="vertical" />
                <Button icon="delete" size={"medium"} onClick={e => this.deleteOrder(e, record)} danger/>
              </span>
            )}
          />
        </Table>
        <Modal
          width="800px"
          title="Дэлгэрэнгүй"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Table dataSource={this.state.myData} bordered columns={columns} />
        </Modal>
      </div>
    );
  }
}

export default Form.create({ name: "Ariunkhuslen" })(DashboardPage);
