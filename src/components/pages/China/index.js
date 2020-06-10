import React from "react";
import { Table, Modal, Upload, Icon } from "antd";
/* import { Link } from "react-router-dom"; */
import "antd/dist/antd.css";
import { Form, Input, Button, message, Popconfirm, Select, Row } from "antd";
import { API_URL } from "../../../../package.json";
import { CreateAndEditModal } from "./component"

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
    this.columns_mn = [
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
        title: "Үлдэгдэл",
        dataIndex: "real_qty",
        key: "real_qty"
      },
      {
        title: "нэмэлт тайлбар",
        dataIndex: "featuretxt",
        key: "featuretxt"
      },
      {
        title: "Өнгө",
        dataIndex: "color_name",
        key: "color_name"
      },
      {
        title: "Ангилал",
        dataIndex: "cat_name",
        key: "cat_name"
      },
      {
        title: "Бренд",
        dataIndex: "brand_name",
        key: "brand_name"
      },
      {
        title: "Жин",
        dataIndex: "weight",
        key: "weight"
      },
      {
        title: "Өргөн",
        dataIndex: "width",
        key: "width"
      },
      {
        title: "Өндөр",
        dataIndex: "height",
        key: "height"
      },
      {
        title: 'Устгах',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <Popconfirm
            title="Та устгахдаа итгэлтэй байна уу?"
            okText="Устгах"
            cancelText="Болих"
            onConfirm={(e) => this.clickCell(record, e)}
          >
            <Button type="danger" icon="delete">
              Утсгах
          </Button>
          </Popconfirm>
        ),
      },
    ];
    this.columns = [
      {
        title: "代碼",
        dataIndex: "skunm",
        key: "skunm"
      },
      {
        title: "價錢",
        dataIndex: "price",
        key: "price"
      },
      {
        title: "平衡",
        dataIndex: "real_qty",
        key: "real_qty"
      },
      {
        title: "功能文字",
        dataIndex: "featuretxt",
        key: "featuretxt"
      },
      {
        title: "顏色",
        dataIndex: "color_name",
        key: "color_name"
      },
      {
        title: "類別",
        dataIndex: "cat_name",
        key: "cat_name"
      },
      {
        title: "牌",
        dataIndex: "brand_name",
        key: "brand_name"
      },
      {
        title: "重量",
        dataIndex: "weight",
        key: "weight"
      },
      {
        title: "寬度",
        dataIndex: "width",
        key: "width"
      },
      {
        title: "高度",
        dataIndex: "height",
        key: "height"
      },
      {
        title: '刪除',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <Popconfirm
            title="你確定要刪除嗎？"
            okText="是"
            cancelText="沒有。"
            onConfirm={(e) => this.clickCell(record, e)}
          >
            <Button type="danger" icon="delete">
              刪除
          </Button>
          </Popconfirm>
        ),
      },
    ];
  }

  showModal = () => {
    this.setState({
      editData: [],
      visible: true,
      edit: false
    });
  };

  getData = () => {
    fetch(API_URL + "/request/getAllRequest").then(function (response) { return response.json(); }).then(myJson => {
      this.setState({ data: myJson.data });
    });
  }

  componentWillMount() {
    this.getData();
  }

  handleCancel2 = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  realqty = e => {
    let tmp = this.state.editData;
    tmp.realqty = e.target.value;
    this.setState({ editData: tmp });
  };

  rowDoubleclick = (record, rowIndex) => {
    this.setState({ editData: record, visible: true, edit: true });
  }

  clickCell = (record, e) => {
    fetch(`${API_URL}/request/deleteRequest/${record.id}`, {
      method: 'DELETE',
    }).then(response => response.json())
      .then(data =>
        this.getData()
      );
  }

  renderColor = () => {
    try {
      const { color } = this.state;
      return color.length === 0 ? <Select.Option disabled key={0}>Хоосон</Select.Option> : color.map((item, key) => (<Select.Option value={item.id} key={key}>{item.colornm}</Select.Option>));
    } catch (error) {
      return console.log(error);
    }
  }

  renderBrand = () => {
    try {
      const { brand } = this.state;
      return brand.length === 0 ? <Select.Option disabled key={0}>Хоосон</Select.Option> : brand.map((item, key) => (<Select.Option value={item.brandid} key={key}>{item.brandnm}</Select.Option>));
    } catch (error) {
      return console.log(error);
    }
  }

  renderCategory = () => {
    try {
      const { category } = this.state;
      return category.length === 0 ? <Select.Option disabled key={0}>Хоосон</Select.Option> : category.map((item, key) => (<Select.Option value={item.id} key={key}>{item.catnm}</Select.Option>));
    } catch (error) {
      return console.log(error);
    }
  }

  checkValues = (values) => {
    try {
      if (values === undefined)
        return "";
      return values;
    } catch (error) {
      return console.log(error);
    }
  }

  getUserData = () => {
    if (localStorage.getItem("userData") == undefined || localStorage.getItem("userData") == null || localStorage.getItem("userData") == "undefined") {
      return "";
    }
    let user = JSON.parse(localStorage.getItem("userData"));
    if (user.adminType == 1) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    let user = JSON.parse(localStorage.getItem("userData"));
    return (
      <div style={{ padding: "20px" }}>
        {this.getUserData() === true ? <Button
          type="dashed"
          onClick={this.showModal}
          style={{ marginBottom: "20px", marginRight: "20px" }}
        >
          {user.adminType === 2 ? "添加商品" : "Бараа нэмэх"}
        </Button> : null}
        <CreateAndEditModal
          {...this.state}
          {...this.props}
          handleCancel={this.handleCancel2}
          getData={this.getData}
        />
        <Table
          columns={user.adminType === 2 ? this.columns : this.columns_mn}
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
