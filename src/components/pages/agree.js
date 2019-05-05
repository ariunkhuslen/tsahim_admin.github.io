import React from "react";
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { Form, Divider, Modal } from 'antd';
import { Link } from 'react-router-dom';

const { Column, ColumnGroup } = Table;

const columns = [{
  title: 'buying_qty',
  dataIndex: 'buying_qty',
  key: 'buying_qty',
}, {
  title: 'ord_no',
  dataIndex: 'ord_no',
  key: 'ord_no',
}, {
  title: 'ord_type',
  dataIndex: 'ord_type',
  key: 'ord_type',
}, {
  title: 'price',
  dataIndex: 'price',
  key: 'price',
}, {
  title: 'product_id',
  dataIndex: 'product_id',
  key: 'product_id',
}, {
  title: 'skunm',
  dataIndex: 'skunm',
  key: 'skunm',
}];


class DashboardPage extends React.Component {
  state = {
    data: [],
    myData: [],
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
  }
  
  setData() {
    fetch('http://10.3.132.177:6001/order/getOrders')
      .then(function (response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({ data: myJson.data })
      })
  }

 componentWillMount() {
   this.setData();
  }

  onAgree(e, record) {
    var url = 'http://10.3.132.177:6001/order/approveOrder/' + record.id;
    fetch(url, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(response => { console.log('Success:', response); this.setData();})
    .catch(error => console.error('Error:', error));
  }


  onDisAgree(e, record) {
    var url = 'http://10.3.132.177:6001/order/unApproveOrder/' + record.id;
    fetch(url, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(response => { console.log('Success:', response); this.setData();})
    .catch(error => console.error('Error:', error));
  }

  showModal = (e, record) => {
    fetch('http://10.3.132.177:6001/order/getOrderDetail/' + record.ord_no)
      .then(function (response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({ myData: myJson.data })
      })
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }


  render() {
    return (
        <div style={{ padding: '50px' }}>
            <Link to="/dashboard">Products</Link> or <Link to="/agree">Agree</Link>
            <Table rowSelection={this.rowSelection} dataSource={this.state.data} onClick={this.onClicked} >
              <Column
                title="id"
                dataIndex="id"
                key="id"
              />
              <Column
                title="ord_addr"
                dataIndex="ord_addr"
                key="ord_addr"
              />
            <Column
              title="ord_delivery"
              dataIndex="ord_delivery"
              key="ord_delivery"
            />
            <Column
              title="ord_email"
              dataIndex="ord_email"
              key="ord_email"
            />
            <Column
              title="ord_name"
              dataIndex="ord_name"
              key="ord_name"
            />
            <Column
              title="ord_no"
              dataIndex="ord_no"
              key="ord_no"
            />
            <Column
              title="ord_type"
              dataIndex="ord_type"
              key="ord_type"
            />
            <Column
              title="ord_userid"
              dataIndex="ord_userid"
              key="ord_userid"
            />
            <Column
              title="Action"
              key="action"
            render={(text, record) => (
              <span>
                {
                  record.ord_type == '0' ? <a onClick={e=>this.onAgree(e, record)}>Батлах</a> : <a onClick={e=>this.onDisAgree(e, record)}>Цуцлах</a>
                }
                <Divider type="vertical" />
                {
                  <a onClick={e=>this.showModal(e, record)}>Дэлгэрэнгүй</a>
                }
                </span>
              )}
            />
        </Table>
        <Modal
          width="800px"
          title="Title"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Table dataSource={this.state.myData} columns={columns} />
        </Modal>
      </div>
    );
  }
}

export default Form.create({ name: "Ariunkhuslen" })(DashboardPage);
