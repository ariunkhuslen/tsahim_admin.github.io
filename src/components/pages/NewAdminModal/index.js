import React from "react";
import { Table, Modal, Upload } from "antd";
import "antd/dist/antd.css";
import { Form, Input, Button, message, Popconfirm, Row, Select } from "antd";

import { API_URL } from "../../../../package.json";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class NewAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		loading: false
    };
	}
	
	handleOk = () => {
	this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				if(values.password === values.repassword)
				{
					this.setState({ loading: true });
					fetch(`${API_URL}/admin/addAdmin`, {
						headers: {
							'Content-Type': 'application/json'
						},
						method: "POST",
						body: JSON.stringify(values)
	
					}).then(response => response.json())
					.then(data => {
						if(data.success)
						{
							message.success(data.message);
							this.handleCancel();
							this.props.form.resetFields();
						}
						else
						{
							message.error(data.message);
						}
						this.setState({ loading: false });
					});
				}
				else
				{
					message.error("Нууц үг таарсангүй.");
				}
			}
		})
	}

	handleCancel = () => {
		this.props.changeActionModal(false);
	}

  render() {
	const { getFieldDecorator } = this.props.form;
	const { loading } = this.state;
    return (
        <Modal
        title="Админ бүртгэх"
		visible={this.props.visible}
		footer={[
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Хадгалах
            </Button>
        ]}
        onCancel={this.handleCancel}
      >
        <Row>
              <Form {...layout}>
									<Form.Item label="Хэрэглэгчийн нэр">
													{getFieldDecorator("username", {
															initialValue: "",
															rules: [{ required: true, message: "Заавал бөглө!" }]
													})(<Input />)}
                  </Form.Item>
                  <Form.Item label="Имэйл хаяг">
                      {getFieldDecorator("email", {
                          initialValue: "",
                          rules: [{ required: true, message: "Заавал бөглө!" }]
                      })(<Input />)}
                  </Form.Item>
									<Form.Item label="Админы төрөл">
										{getFieldDecorator("adminType", {
											initialValue: "1",
											rules: [{ required: false }]
										})(
											<Select placeholder="Төрөл сонгох">
												<Select.Option value="1">Админ</Select.Option>
												<Select.Option value="2">Админ хэрэглэгч</Select.Option>
											</Select>
										)}
									</Form.Item>
									<Form.Item label="Нууц үг">
                      {getFieldDecorator("password", {
                          initialValue: "",
                          rules: [{ required: true, message: "Заавал бөглө!" }]
                      })(<Input.Password />)}
                  </Form.Item>
									<Form.Item label="Нууц үг давтах">
                      {getFieldDecorator("repassword", {
                          initialValue: "",
                          rules: [{ required: true, message: "Заавал бөглө!" }]
                      })(<Input.Password />)}
                  </Form.Item>
            </Form>
          </Row>
      </Modal>
    );
  }
}

export default Form.create({ name: "admin" })(NewAdminModal);
