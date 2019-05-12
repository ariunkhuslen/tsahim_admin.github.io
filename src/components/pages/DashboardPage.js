import React from "react";
import { Table, Modal, Upload, Icon } from "antd";
/* import { Link } from "react-router-dom"; */
import "antd/dist/antd.css";
import { Form, Input, Button } from "antd";
const URL = "http://10.3.133.232:6001/";
const columns = [
  {
    title: "Барааны id",
    dataIndex: "skucd",
    key: " "
  },
  {
    title: "Барааны нэр",
    dataIndex: "skunm",
    key: "skunm"
  },
  {
    title: "Үнэ",
    dataIndex: "price",
    key: "price"
  },
  {
    title: "Хямдрал",
    dataIndex: "sprice",
    key: "sprice"
  },
  {
    title: "Нөөц",
    dataIndex: "realqty",
    key: "realqty"
  }
];
/* function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
} */
/* const data = [
  {
    sprice: "1",
    skunm: "John Brown",
    price: 32,
    realqty: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  },
  {
    sprice: "2",
    skunm: "Jim Green",
    price: 42,
    realqty: "London No. 1 Lake Park",
    tags: ["loser"]
  },
  {
    sprice: "3",
    skunm: "Joe Black",
    price: 32,
    realqty: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  }
]; */

class DashboardPage extends React.Component {
  state = {
    ModalText: "Content of the modal",
    visible: false,
    visible2: false,
    confirmLoading: false,
    data: [],
    confirmDirty: false,
    autoCompleteResult: [],
    editData: [],
    visible1: false,
    previewVisible: false,
    previewImage: "",
    fileList: [
      /* {
        uid: "-1",
        name: "xxx.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      } */
    ]
  };

  showModal = () => {
    this.setState({
      visible2: true
    });
  };

  showModal1 = () => {
    this.setState({ visible1: true });
  };

  componentWillMount() {
    fetch(URL + "product/getAllProduct")
      .then(function(response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({ data: myJson.data });
      });
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

  handleOk1 = () => {
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
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
  };

  handleCancel2 = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible2: false
    });
  };

  handleCancel1 = () => {
    console.log("Edit cancel button");
    this.setState({
      visible1: false
    });
  };

  handleSubmitEdit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var formData = new FormData();
        formData.append("skucd", values.skucd);
        formData.append("spice", values.spice);
        formData.append("price", values.price);
        formData.append("realqty", values.realqty);
        formData.append("status", values.status);
        formData.append("skunm", values.skunm);
        formData.append("featuretxt", values.featuretxt);
        formData.append("colorid", values.colorid);
        formData.append("brandid", values.brandid);
        formData.append("catid", values.catid);
        formData.append("istop", values.istop);
        for (let i = 0; i < this.state.fileList.length; i++) {
          formData.append("files", this.state.fileList[i].originFileObj);
        }
        console.log("string", JSON.stringify(formData));
        fetch(URL + `product/addProduct`, {
          method: "POST",
          body: formData
        })
          .then(response => response.json())
          .then(response => console.log("Success:", JSON.stringify(response)))
          .catch(error => console.error("Error:", error));

        console.log(values);

        /* formData.append("values", values);
        formData.append("files", this.state.fileList[0]);
        const request = new Request(URL + `product/addProduct`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: formData
        });
        return fetch(request)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          }); */
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (/* rule,  */ value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (/* rule,  */ value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  rowSelection = {
    onChange: (/* selectedRowKeys, */ selectedRows) => {
      this.setState({ editData: selectedRows[0] });
    },
    getCheckboxProps: record => ({
      disabled: record.name === "Disabled User",
      name: record.name
    })
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  realqty = e => {
    console.log("ede");
    let tmp = this.state.editData;
    tmp.realqty = e.target.value;
    this.setState({ editData: tmp });
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {
      getFieldDecorator
      /* getFieldsError, */
      /* getFieldError,
      isFieldTouched */
    } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    /* const userNameError =
      isFieldTouched("userName") && getFieldError("userName");
    const passwordError =
      isFieldTouched("password") && getFieldError("password");
 */
    return (
      <div style={{ padding: "20px" }}>
        <Button
          type="dashed"
          onClick={this.showModal}
          style={{ marginBottom: "20px", marginRight: "20px" }}
        >
          Бараа нэмэх
        </Button>
        <Button
          type="dashed"
          onClick={this.showModal1}
          style={{ marginBottom: "20px" }}
        >
          Бараа засах
        </Button>
        <Modal
          title="Бараа нэмэх"
          visible={this.state.visible2}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel2}
          footer={[
            <Button type="primary" onClick={e => this.handleSubmit(e)}>
              Хадгалах
            </Button>
          ]}
          width={800}
        >
          <Form layout="inline" {...formItemLayout}>
            <Form.Item label="skucd" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("skucd", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="spice" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("spice", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="price" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("price", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="realqty" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("realqty", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="status" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("status", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="skunm" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("skunm", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="featuretxt"
              style={{ width: "45%", float: "left" }}
            >
              {getFieldDecorator("featuretxt", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="colorid" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("colorid", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="brandid" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("brandid", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="catid" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("catid", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="istop" style={{ width: "45%", float: "left" }}>
              {getFieldDecorator("istop", {
                rules: [{ required: true, message: "Заавал бөглө!" }]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="imgnm" style={{ width: "100%", float: "left" }}>
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
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Бараа засах"
          visible={this.state.visible1}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel1}
          footer={[
            <Button type="primary" onClick={e => this.handleSubmitEdit(e)}>
              Хадгалах
            </Button>
          ]}
          width={800}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="skucd" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.skucd} />
            </Form.Item>
            <Form.Item label="spice" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.sprice} />
            </Form.Item>
            <Form.Item label="price" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.price} />
            </Form.Item>
            <Form.Item label="realqty" style={{ width: "45%", float: "left" }}>
              <Input
                defaultValue={this.state.editData.realqty}
                /* onChange={e => this.realqty(e)} */
              />
            </Form.Item>
            <Form.Item label="status" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.status} />
            </Form.Item>
            <Form.Item label="skunm" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.skunm} />
            </Form.Item>
            <Form.Item
              label="featuretxt"
              style={{ width: "45%", float: "left" }}
            >
              <Input value={this.state.editData.featuretxt} />
            </Form.Item>
            <Form.Item label="colorid" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.colorid} />
            </Form.Item>
            <Form.Item label="brandid" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.brandid} />
            </Form.Item>
            <Form.Item label="catid" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.catid} />
            </Form.Item>
            <Form.Item label="istop" style={{ width: "45%", float: "left" }}>
              <Input value={this.state.editData.istop} />
            </Form.Item>
            <Form.Item label="imgnm" style={{ width: "45%", float: "left" }}>
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
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          rowSelection={this.rowSelection}
          columns={columns}
          dataSource={this.state.data}
          bordered
        />
      </div>
    );
  }
}

export default Form.create({ name: "Ariunkhuslen" })(DashboardPage);
