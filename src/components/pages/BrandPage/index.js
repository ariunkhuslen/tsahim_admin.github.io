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
        if (this.state.fileList.length === 0) {
          message.error("Брандын зураг оруулна уу.");
        }
        else {
          const formData = new FormData();
          formData.append("brandnm", values.brandnm);
          if (edit) {
            formData.append("id", editData.brandid);
          }

          for (let i = 0; i < this.state.fileList.length; i++) {
            if(this.state.fileList[i].originFileObj !== undefined)
            {
              formData.append("files", this.state.fileList[i].originFileObj);
            }
          }

          let isEdit = edit === true ? "updateBrand" : "addBrand";

          fetch(`${API_URL}/brand/${isEdit}`, {
            method: "POST",
            body: formData
          }).then(response => { return response.json() }).then( myJson => {
            if(myJson.success)
            {
              this.getData();
              this.handleCancel2();
              this.props.form.resetFields();
              message.success(myJson.message);
            }
            else
            {
              message.error(myJson.message);
            }
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
    let tmp = [];
    if(record.brandimg != "" && record.brandimg != "undefined")
    {
      let tmp1 = {
        uid: record.brandid,
        name: record.brandnm,
        status: 'done',
        url: API_URL + "/uploads/" + record.brandimg,
      }
        tmp.push(tmp1)
    }
    this.setState({ editData: record, visible2: true, edit: true, fileList: tmp });
  }

  clickCell = (record, e) => {
    fetch(`${API_URL}/brand/deleteBrand/${record.brandid}`, {
      method: 'DELETE',
    }).then(response => response.json())
      .then(data =>
        console.log(data)
      );
  }

  removeImage = (e) => {
    if(e.thumbUrl == undefined)
    {
      console.log(e)
      fetch(`${API_URL}/brand/deleteImage/${e.uid}`, {
        method: 'DELETE',
      }).then(response => response.json())
        .then(data => {
          if(data.success)
          {
            message.success(data.message);
          }
          else
          {
            message.error(data.message);
          }
        });
    }
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
          title="Бранд нэмэх"
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
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.removeImage}

                  >
                    {
                      fileList.length === 0 ? uploadButton : null
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
