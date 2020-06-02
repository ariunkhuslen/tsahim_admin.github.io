import React from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import { Form, Input, Button, message, Popconfirm } from "antd";

import { API_URL } from "../../../../package.json";


class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.columns = [
            {
                title: "id",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "Хэрэглэгчийн нэр",
                dataIndex: "username",
                key: "username",
            },
            {
                title: "Имэйл",
                dataIndex: "email",
                key: "email",
            },
            {
                title: "Төрөл",
                dataIndex: "adminType",
                key: "adminType",
            },
            {
                title: "Бүртгэгдсэн огноо",
                dataIndex: "createdDate",
                key: "createdDate",
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

    clickCell = (record, e) => {
        fetch(`${API_URL}/admin/deleteAdmin/${record.id}`, {
          method: 'DELETE',
        }).then(response => response.json())
          .then(data => {
              if(data.success)
              {
                    message.success(data.message);
                    this.getData();
              }
              else
              {
                    message.error(data.message);
              }
          });
      }

    componentWillMount() {
        this.getData();
    }

    getData() {
        fetch(`${API_URL}/admin/getAllAdmin`)
            .then(response => response.json())
            .then(data =>
                this.setState({ data: data.data })
            );
    }

    render() {
        return (
            <div style={{ padding: "20px" }}>
                <Table
                    columns={this.columns}
                    rowKey="uid"
                    dataSource={this.state.data}
                    bordered
                />
            </div>
        );
    }
}

export default Form.create({ name: "adminpage" })(AdminPage);
