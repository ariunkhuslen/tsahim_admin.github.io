import React from "react";
import { Table, Modal } from "antd";
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
				title: "id",
				dataIndex: "id",
				key: "id"
			},
			{
				title: "Өнгөний нэр",
				dataIndex: "colornm",
				key: "colornm",
			},
			{
				title: "Өнгөний код",
				dataIndex: "colorcode",
				key: "colorcode",
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
		fetch(`${API_URL}/color/getAllColor`)
			.then(response => response.json())
			.then(data =>
				this.setState({ data: data.data })
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

	handleSubmit = e => {
		e.preventDefault();
		const { edit, editData } = this.state;

		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let isEdit = edit === true ? "updateColor" : "addColor";
				if (edit) values.id = editData.id;

				fetch(`${API_URL}/color/${isEdit}`, {
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
		this.setState({ editData: record, visible2: true, edit: true, });
	}

	clickCell = (record, e) => {
		fetch(`${API_URL}/color/deleteColor/${record.id}`, {
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
				> Өнгө нэмэх </Button>
				<Modal
					title={edit === true ? "Өнгө засах" : "Өнгө нэмэх"}
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
							<Form.Item label="Өнгөний нэр" style={{ width: "45%", float: "left" }}>
								{getFieldDecorator("colornm", {
									initialValue: this.state.editData.colornm,
									rules: [{ required: true, message: "Заавал бөглө!" }]
								})(<Input />)}
							</Form.Item>
						</Form>
						<Form layout="inline" {...formItemLayout}>
							<Form.Item label="Өнгөний код" style={{ width: "45%", float: "left" }}>
								{getFieldDecorator("colorcode", {
									initialValue: this.state.editData.colorcode,
									rules: [{ required: true, message: "Заавал бөглө!" }]
								})(<Input />)}
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
