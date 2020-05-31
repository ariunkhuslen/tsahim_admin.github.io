import React from "react";
import { Table, Modal, Upload } from "antd";
import "antd/dist/antd.css";
import { Form, Input, Button, message, Popconfirm, Row } from "antd";

import { API_URL } from "../../../../package.json";

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

class BrandPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      fileList: [],
      edit: false,
    };
    this.columns = [
      {
        title: "Бранд код",
        dataIndex: "brandid",
        key: "brandid"
      },
      {
        title: "Брандийн нэр",
        dataIndex: "brandnm",
        key: "brandnm",
      },
      {
        title: 'Устгах',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <Popconfirm
            title="Та устгахдаа итгэлтэй байна уу?"
            okText="Тийм"
            cancelText="Үгүй"
            onConfirm={(e) => this.clickCell(record, e)}
          >
            <Button type="danger" icon="delete">
              Устгах
          </Button>
          </Popconfirm>
        ),
      },
    ];
  }

  componentWillMount() {
    this.getData();
  }
  getData() {
    fetch(`${API_URL}/brand/getAllBrand`)
      .then(response => response.json())
      .then(data =>
        this.setState({ data: data.data })
      );
  }
  showModal = () => {
    this.setState({
      actionType: 'new',
      editData: [],
      visible2: true,
      edit: false,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  handleCancel2 = () => {
    this.setState({
      visible2: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { edit, editData } = this.state;

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.fileList.length === 0 && !edit) {
          message.error("Брандын зураг оруулна уу.");
        }
        else {
          const formData = new FormData();
          formData.append("brandnm", values.brandnm);
          for (let i = 0; i < this.state.fileList.length; i++) {
            formData.append("files", this.state.fileList[i].originFileObj);
          }

          let isEdit = edit === true ? "updateBrand" : "addBrand";
          if (edit) formData.append("id", editData.brandid);

          fetch(`${API_URL}/brand/${isEdit}`, {
            method: "POST",
            body: formData
          }).then(response => {
            this.getData();
            this.handleCancel2();
            this.props.form.resetFields();
          });
        }
      }
    });

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
    const tmp = this.state.editData;
    tmp.realqty = e.target.value;
    this.setState({ editData: tmp });
  };

  rowDoubleclick = (record, rowIndex) => {
    console.log(record);
    this.setState({ editData: record, visible2: true, edit: true, });
  }

  clickCell = (record, e) => {
    fetch(`${API_URL}/brand/deleteBrand/${record.brandid}`, {
      method: 'DELETE',
    }).then(response => response.json())
      .then(data =>
        console.log(data)
        // this.setState({ data: data.data })
      );
    console.log(record);
  }

  render() {
    const { previewVisible, previewImage, fileList, edit, editData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <img alt="upload_icon" src="https://img.icons8.com/cute-clipart/64/000000/add-camera.png" />
      </div>
    );
    return (
      <div style={{ padding: "20px" }}>
        <Button
          type="dashed"
          onClick={this.showModal}
          style={{ marginBottom: "20px", marginRight: "20px" }}
        >
          Бранд нэмэх
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
          <Row>
            <Form layout="inline" {...formItemLayout}>
              <Form.Item label="Брандийн нэр" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("brandnm", {
                  initialValue: this.state.editData.brandnm,
                  rules: [{ required: true, message: "Заавал бөглө!" }]
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Брандын зураг" style={{ width: "45%", float: "left" }}>
                <div className="clearfix">
                  <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    // onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {
                      edit === true ? <div><img alt="upload_icon" className="w-100" src={API_URL + "/uploads/" + editData.brandimg} /></div> : fileList.length >= 1 ? null : uploadButton
                    }
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
          </Row>
        </Modal>
        <Table
          columns={this.columns}
          rowKey="uid"
          dataSource={this.state.data}
          bordered
          onRow={(record, rowIndex) => ({
            onDoubleClick: event => this.rowDoubleclick(record, rowIndex),
          })}
        />
      </div>
    );
  }
}

export default Form.create({ name: "brand" })(BrandPage);
