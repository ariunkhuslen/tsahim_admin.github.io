import React from "react";
import { Table, Modal, Upload, Icon } from 'antd';
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import {
  Form, Input, Button
} from 'antd';
const props = {
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
  },
  defaultFileList: [],
};

const columns = [{
  title: 'Барааны id',
  dataIndex: ' ',
  key: ' ',
}, {
  title: 'Барааны нэр',
  dataIndex: 'skunm',
  key: 'skunm',
}, {
  title: 'Үнэ',
  dataIndex: 'price',
  key: 'price',
}, {
  title: 'Хямдрал',
  dataIndex: 'sprice',
  key: 'sprice',
}, {
  title: 'Нөөц',
  dataIndex: 'realqty',
  key: 'realqty',
}
];

const data = [{
  sprice: '1',
  skunm: 'John Brown',
  price: 32,
  realqty: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  sprice: '2',
  skunm: 'Jim Green',
  price: 42,
  realqty: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  sprice: '3',
  skunm: 'Joe Black',
  price: 32,
  realqty: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}];


class DashboardPage extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
    data: []
  }

  render() {

    return (
      <div style={{ padding: '50px' }}>
        <Link to="/dashboard">Products</Link> or <Link to="/agree">Agree</Link>
        <h5>hello it home page</h5>
      </div>
    );
  }
}

export default Form.create({ name: "Ariunkhuslen" })(DashboardPage);
