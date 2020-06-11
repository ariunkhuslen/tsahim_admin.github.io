import React from "react";
import { Table, Modal, Upload, Icon } from "antd";
/* import { Link } from "react-router-dom"; */
import "antd/dist/antd.css";
import { Form, Input, Button, message, Popconfirm, Select, Row } from "antd";
import { API_URL } from "../../../../package.json";

const { Option } = Select;
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

class DashboardPage extends React.Component {
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
      color: [],
      category: [],
      edit: false,
    };
    this.columns = [
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
        dataIndex: "spice",
        key: "spice"
      },
      {
        title: "Нөөц",
        dataIndex: "realqty",
        key: "realqty"
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


  showModal = () => {
    this.setState({
      editData: [],
      visible2: true,
      edit: false,
      fileList: []
    });
  };

  getData() {
    fetch(API_URL + "/product/getAllProduct").then(function (response) { return response.json(); }).then(myJson => {
      this.setState({ data: myJson.data });
    });

    fetch(`${API_URL}/color/getAllColor`).then(response => response.json())
      .then(data => this.setState({ color: data.data }));

    fetch(`${API_URL}/brand/getAllBrand`).then(response => response.json())
      .then(data => this.setState({ brand: data.data }));

    fetch(`${API_URL}/category/getAllCategory`).then(response => response.json())
      .then(data => this.setState({ category: data.data }));
  }

  componentWillMount() {
    this.getData();
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel2 = () => {
    this.props.form.resetFields();
    this.setState({
      visible2: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { edit } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.fileList.length === 0 && !edit) {
          message.error("Барааны зураг оруулна уу.");
          return;
        }
        else {
          var formData = new FormData();
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
          formData.append("isnew", values.isnew);
          if (edit) {
            formData.append("id", this.state.editData.id);
          }

          for (let i = 0; i < this.state.fileList.length; i++) {
            if(this.state.fileList[i].originFileObj !== undefined)
            {
              formData.append("files", this.state.fileList[i].originFileObj);
            } 
          }

          let isEdit = edit === true ? "updateProduct" : "addProduct";

          fetch(API_URL + `/product/${isEdit}`, {
            method: "POST",
            body: formData
          }).then(function (response) { return response.json(); }).then(myJson => {
            if(myJson.success)
            {
              this.getData();
              this.handleCancel2();
              this.props.form.resetFields();
              this.setState({ fileList: [] })
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
    let tmp = this.state.editData;
    tmp.realqty = e.target.value;
    this.setState({ editData: tmp });
  };

  rowDoubleclick = (record, rowIndex) => {
    fetch(API_URL + "/product/getProductDetailImg/" + record.id).then(function (response) { return response.json(); }).then(myJson => {
      if(myJson.success)
      {
        let tmp = []
        myJson.data.map((item, i) => {
          let tmp1 = {
            uid: item.id,
            name: item.imgnm,
            status: 'done',
            url: API_URL + "/uploads/" + item.imgnm,
            }
            tmp.push(tmp1)
        })
        this.setState({ fileList: tmp })
      }
      else
      {
        message.error("Барааны зураг авхад алдаа гарлаа.");
      }
    });
    this.setState({ editData: record, visible2: true, edit: true });
  }

  clickCell = (record, e) => {
    
  }

  renderColor = () => {
    try {
      const { color } = this.state;
      return color.length === 0 ? <Select.Option disabled key={0}>Хоосон</Select.Option> : color.map((item, key) => (<Select.Option value={item.id} key={key}>{item.colornm}</Select.Option>));
    } catch (error) {
      return;
    }
  }

  renderBrand = () => {
    try {
      const { brand } = this.state;
      return brand.length === 0 ? <Select.Option disabled key={0}>Хоосон</Select.Option> : brand.map((item, key) => (<Select.Option value={item.brandid} key={key}>{item.brandnm}</Select.Option>));
    } catch (error) {
      return;
    }
  }

  renderCategory = () => {
    try {
      const { category } = this.state;
      return category.length === 0 ? <Select.Option disabled key={0}>Хоосон</Select.Option> : category.map((item, key) => (<Select.Option value={item.id} key={key}>{item.catnm}</Select.Option>));
    } catch (error) {
      return;
    }
  }

  checkValues = (values) => {
    try{
      if(values === undefined)
        return "";
      return values;
    } catch (error) {
      return;
    }
  }

  removeImage = (e) => {
    if(e.thumbUrl == undefined)
    {
      fetch(`${API_URL}/product/deleteImage/${e.uid}`, {
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
    const { previewVisible, previewImage, fileList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Зураг оруулах</div>
      </div>
    );
    return (
      <div style={{ padding: "20px" }}>
        <Button
          type="dashed"
          onClick={this.showModal}
          style={{ marginBottom: "20px", marginRight: "20px" }}
        >
          Бараа нэмэх
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
          width={1020}
        >
          <Row>
            <Form layout="inline" {...formItemLayout}>
              <Form.Item label="Барааны нэр" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("skunm", {
                  initialValue: this.checkValues(this.state.editData.skunm),
                  rules: [{ required: true, message: "Барааны нэр заавал оруулна уу." }]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Барааны үнэ" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("price", {
                  initialValue: this.checkValues(this.state.editData.price),
                  rules: [{ required: true, message: "Барааны үнэ заавал оруулна уу!" }]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Хямдралтай үнэ" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("spice", {
                  initialValue: this.checkValues(this.state.editData.spice),
                  rules: [{ required: false }]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Барааны үлдэгдэл" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("realqty", {
                  initialValue: this.checkValues(this.state.editData.realqty),
                  rules: [{ required: false }]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Барааны төлөв" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("status", {
                  initialValue: this.state.editData.status === undefined ? "1" : this.state.editData.status,
                  rules: [{ required: true, message: "Барааны төлөв заавал оруулна уу." }]
                })(
                  <Select >
                    <Option value="1">Идэвхитэй</Option>
                    <Option value="0">Идэвхгүй</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="Барааны ерөнхий танилцуулга"
                style={{ width: "45%", float: "left" }}
              >
                {getFieldDecorator("featuretxt", {
                  initialValue: this.checkValues(this.state.editData.featuretxt),
                  rules: [{ required: false }]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Барааны өнгө" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("colorid", {
                  initialValue: this.checkValues(this.state.editData.colorid),
                  rules: [{ required: false }]
                })(
                  <Select placeholder="Өнгө сонгох" >
                    {this.renderColor()}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Барааны бренд" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("brandid", {
                  initialValue: this.checkValues(this.state.editData.brandid),
                  rules: [{ required: false }]
                })(
                  <Select placeholder="Бренд сонгох" >
                    {this.renderBrand()}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Брааны категори" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("catid", {
                  initialValue: this.checkValues(this.state.editData.catid),
                  rules: [{ required: false }]
                })(
                  <Select placeholder="Ангилал сонгох">
                    {this.renderCategory()}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Эрэлттэй бараа эсэх" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("istop", {
                  initialValue: this.checkValues(this.state.editData.istop) === "" ? "0" : this.checkValues(this.state.editData.istop),
                  rules: [{ required: false }]
                })(
                  <Select>
                    <Option value="1">Тийм</Option>
                    <Option value="0">Үгүй</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Шинэ бараа эсэх" style={{ width: "45%", float: "left" }}>
                {getFieldDecorator("isnew", {
                  initialValue: this.checkValues(this.state.editData.isnew) === "" ? "0" : this.checkValues(this.state.editData.isnew),
                  rules: [{ required: false }]
                })(
                  <Select>
                    <Option value="1">Тийм</Option>
                    <Option value="0">Үгүй</Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Барааны зураг" style={{ width: "45%", float: "left" }}>
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
                      uploadButton
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
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: event => this.rowDoubleclick(record, rowIndex),
            };
          }}
        />
      </div>
    );
  }
}

export default Form.create({ name: "Ariunkhuslen" })(DashboardPage);
