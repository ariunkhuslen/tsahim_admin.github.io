import React from "react";
import { Table, Modal } from "antd";
import "antd/dist/antd.css";
import { Form, Input, Button, message, Popconfirm, Row, Checkbox, Tabs, Select } from "antd";

import { API_URL } from "../../../../package.json";

const { TabPane } = Tabs;
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
			mainMenu: [],
			type: "1",
		};
		/* name, parentid, isenable, type, news */
		this.columns = [
			{
				title: "id",
				dataIndex: "id",
				key: "id"
			},
			{
				title: "isenable",
				dataIndex: "isenable",
				key: "isenable",
			},
			{
				title: "name",
				dataIndex: "name",
				key: "name",
			},
			{
				title: "news",
				dataIndex: "news",
				key: "news",
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
		});
	};

	getData() {
		fetch(`${API_URL}/menu/getAllMenu`)
			.then(response => response.json())
			.then(data =>
				this.setState({ data: data.data })
			);

		fetch(`${API_URL}/menu/getAllMainMenu`)
			.then(response => response.json())
			.then(data =>
				this.setState({ mainMenu: data.data })
			);
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
		this.setState({
			visible2: false
		});
	};

	callback = (key) => {
		this.setState({ type: key });
	}

	handleSubmit = e => {
		e.preventDefault();
		const { edit, editData, type } = this.state;

		this.props.form.validateFields((err, values) => {
			console.log(type);
			values.type = Number(type);
			values.isenable = values.isenable === undefined ? 0 : 1;
			values.parentid = Number(type) === 1 ? 0 : values.parentid;
			console.log(values);
			if (Number(type) === 1) {
				let isEdit = edit === true ? "updateMenu" : "addMenu";
				if (edit) values.id = editData.id;

				fetch(`${API_URL}/menu/${isEdit}`, {
					headers: {
						'Content-Type': 'application/json'
					},
					method: "POST",
					body: JSON.stringify(values)

				}).then(() => {
					message.success("Амжилттай");
					this.getData();
					this.handleCancel2();
					this.props.form.resetFields();
				});
			} else {
				if (!err) {
					let isEdit = edit === true ? "updateMenu" : "addMenu";
					if (edit) values.id = editData.id;

					fetch(`${API_URL}/menu/${isEdit}`, {
						headers: {
							'Content-Type': 'application/json'
						},
						method: "POST",
						body: JSON.stringify(values)

					}).then(() => {
						message.success("Амжилттай");
						this.getData();
						this.handleCancel2();
						this.props.form.resetFields();
					});
				}
			}
		});

	};

	handleCancel = () => this.setState({ previewVisible: false });

	rendermain = () => {
		try {
			const { mainMenu } = this.state;
			return mainMenu.length === 0 ? <Select.Option disabled key={0}>Хоосон</Select.Option> :
				mainMenu.map((item, key) => (<Select.Option value={item.id} key={key}>{item.name}</Select.Option>));
		} catch (error) {
			return console.log(error);
		}
	}

	rowDoubleclick = (record, rowIndex) => {
		this.setState({ editData: record, visible2: true, edit: true, });
	}

	clickCell = (record, e) => {
		fetch(`${API_URL}/menu/deleteMenu/${record.id}`, {
			method: 'DELETE',
		}).then(response => response.json())
			.then(data => {
				if (data.success) {
					this.getData();
				}
			});
	}

	render() {
		const { edit } = this.state;
		const { getFieldDecorator } = this.props.form;
		return (
			<div style={{ padding: "20px" }}>
				<Button
					type="dashed"
					onClick={this.showModal}
					style={{ marginBottom: "20px", marginRight: "20px" }}
				>Цэс нэмэх</Button>
				<Modal
					title={edit === true ? "Цэс засах" : "Цэс нэмэх"}
					visible={this.state.visible2}
					confirmLoading={this.state.confirmLoading}
					onCancel={this.handleCancel2}
					footer={[
						<Button type="primary" onClick={e => this.handleSubmit(e)}> Хадгалах </Button>
					]}
					width={800}
				>
					<Row>
						<Form layout="inline" {...formItemLayout}>
							<Tabs defaultActiveKey={this.state.type} onChange={this.callback}>
								<TabPane tab="Эцэг" key="1">
									<Form.Item label="Цэсний нэр" style={{ width: "45%", float: "left" }}>
										{getFieldDecorator("name", {
											initialValue: this.state.editData.colornm,
											rules: [{ required: true, message: "Заавал бөглө!" }]
										})(<Input />)}
									</Form.Item>
									<Form.Item label="Мэдээ" style={{ width: "45%", float: "left" }}>
										{getFieldDecorator("news", {
											initialValue: this.state.editData.colorcode,
											rules: [{ required: true, message: "Заавал бөглө!" }]
										})(<Input />)}
									</Form.Item>
									<Form.Item label="Идэвхтэй эсэх" style={{ width: "45%", float: "left" }} valuePropName="checked">
										{getFieldDecorator("isenable", {
											initialValue: this.state.editData.isenable,
										})(
											<Checkbox></Checkbox>
										)}
									</Form.Item>
								</TabPane>
								<TabPane tab="Хүүхэд" key="2">
									<Form.Item label="Эцэг цэс" style={{ width: "45%", float: "left" }}>
										{getFieldDecorator("parentid", {
											initialValue: this.state.editData.colornm,
											rules: [{ required: true, message: "Заавал бөглө!" }]
										})(<Select >
											{this.rendermain()}
										</Select>)}
									</Form.Item>
									<Form.Item label="Цэсний нэр" style={{ width: "45%", float: "left" }}>
										{getFieldDecorator("name", {
											initialValue: this.state.editData.colornm,
											rules: [{ required: true, message: "Заавал бөглө!" }]
										})(<Input />)}
									</Form.Item>
									<Form.Item label="Мэдээ" style={{ width: "45%", float: "left" }}>
										{getFieldDecorator("news", {
											initialValue: this.state.editData.colorcode,
											rules: [{ required: true, message: "Заавал бөглө!" }]
										})(<Input />)}
									</Form.Item>
									<Form.Item label="Идэвхтэй эсэх" style={{ width: "45%", float: "left" }} valuePropName="checked">
										{getFieldDecorator("isenable", {
											initialValue: this.state.editData.isenable,
										})(
											<Checkbox></Checkbox>
										)}
									</Form.Item>
								</TabPane>
							</Tabs>
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
