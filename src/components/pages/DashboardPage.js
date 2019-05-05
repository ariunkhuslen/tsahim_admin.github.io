import React from "react";
import { Table, Modal, Upload, Icon } from 'antd';
import { Link } from 'react-router-dom'
import 'antd/dist/antd.css';
import {
  Form, Input, Button
} from 'antd';

const columns = [{
  title: 'Барааны id',
  dataIndex: 'skucd',
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
    data: [],
    confirmDirty: false,
    autoCompleteResult: [],
    editData: [],
    visible1: false,
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  showModal1 = () => {
    this.setState({ visible1: true })
  }

  componentWillMount() {
    fetch('http://10.3.132.177:6001/product/getAllProduct')
      .then(function (response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({ data: myJson.data })
      })
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

  handleOk1 = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      })
    }, 2000);
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  handleCancel1 = () => {
    console.log('Edit cancel button');
    this.setState({
      visible1: false
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        /* onsole.log(values, this.state.fileList)
        formData.append('values', values);
        formData.append('files', this.state.fileList[0]);
        formData.append('values', 'values');
        formData.append('files', this.state.fileList[0]);
        console.log(formData)
        fetch(`http://10.3.132.177:6001/product/addProduct`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        })
          .then(response => { console.log(response) })
          .catch(error => console.log(error)); */
          formData.append('values', values);
          formData.append('files', this.state.fileList[0]);
          const request = new Request(`http://10.3.132.177:6001/product/addProduct`, {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: formData
          });
          return fetch(request).then(response => {
            console.log(response);
          }).catch(error => {
            console.log(error)
          });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
    rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ editData: selectedRows[0] })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
    console.log(this.state.fileList)
  }

  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div style={{ padding: '50px' }}>
        <Link to="/dashboard">Products</Link> or <Link to="/agree">Agree</Link>
        <Button type="primary" onClick={this.showModal} block style={{ marginBottom: '20px' }}>
          Insert product
        </Button>
        <Button type="primary" onClick={this.showModal1} block style={{ marginBottom: '20px' }}>
          Edit product
        </Button>
        <Modal
          title="Title"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item
              label="skucd"
            >
              {getFieldDecorator('skucd', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="spice"
            >
              {getFieldDecorator('spice', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="price"
            >
              {getFieldDecorator('price', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="realqty"
            >
              {getFieldDecorator('realqty', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="status"
            >
              {getFieldDecorator('status', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="skunm"
            >
              {getFieldDecorator('skunm', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="featuretxt"
            >
              {getFieldDecorator('featuretxt', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="colorid"
            >
              {getFieldDecorator('colorid', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="brandid"
            >
              {getFieldDecorator('brandid', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="catid"
            >
              {getFieldDecorator('catid', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="imgnm"
            >
              <div className="clearfix">
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            </Form.Item>
            <Form.Item
              label="istop"
            >
              {getFieldDecorator('istop', {
                rules: [{ required: true, message: 'Заавал бөглө!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Хадгалах</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Edit product"
          visible={this.state.visible1}
          onOk={this.handleOk1}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel1}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
           <Form.Item
              label="skucd"
            >
              <Input value={this.state.editData.skucd} />
            </Form.Item>
            
            <Form.Item
              label="spice"
            >
                <Input value={this.state.editData.sprice} />
              
            </Form.Item>
            <Form.Item
              label="price"
            >
                <Input value={this.state.editData.price} />
            </Form.Item>
            <Form.Item
              label="realqty"
            >             
                <Input value={this.state.editData.realqty} />
            </Form.Item>
            <Form.Item
              label="status"
            >
                <Input value={this.state.editData.status} />
            </Form.Item>
            <Form.Item
              label="skunm"
            >
                <Input value={this.state.editData.skunm}/>
            </Form.Item>
            <Form.Item
              label="featuretxt"
            >
                <Input value={this.state.editData.featuretxt}/>

            </Form.Item>
            <Form.Item
              label="colorid"
            >
                <Input value={this.state.editData.colorid}/>
            </Form.Item>
            <Form.Item
              label="brandid"
            >
                <Input value={this.state.editData.brandid} />
            </Form.Item>
            <Form.Item
              label="catid"
            >
                <Input value={this.state.editData.catid}/>
            </Form.Item>
            <Form.Item
              label="imgnm"
            >
              <div className="clearfix">
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            </Form.Item>
            <Form.Item
              label="istop"
            >
                <Input value={this.state.editData.istop}/>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Хадгалах</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Table rowSelection={this.rowSelection} columns={columns} dataSource={this.state.data} />

      </div>
    );
  }
}

export default Form.create({ name: "Ariunkhuslen" })(DashboardPage);