import React, { Component } from 'react'
import { Modal, Row, Form, Input, Select, Button, Upload, Icon, message } from "antd";
import { API_URL } from "../../../../../package.json";

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
class CreateAndEditModal extends Component {
	state = {
		fileList: [],
		previewVisible: false,
		previewImage: "",
		edit: false,
	}

	componentWillMount() {
		fetch(API_URL + `/request/getRequestDetailImg/${this.props.editData.id}`).then(function (response) { return response.json(); }).then(myJson => {
			if (myJson.success) {
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
				console.log(tmp);
				this.setState({ fileList: tmp })
			}
		})
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
	handleSubmit = e => {

		if (this.getUserData() === true) {
			e.preventDefault();
			const { edit } = this.props;
			this.props.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					if (this.state.fileList.length === 0 && !edit) {
						message.error("Барааны зураг оруулна уу.");
						return;
					}
					else {
						var formData = new FormData();
						formData.append("skunm", values.skunm);
						formData.append("price", values.price);
						formData.append("real_qty", values.real_qty);
						formData.append("featuretxt", values.featuretxt);
						formData.append("color_name", values.color_name);
						formData.append("cat_name", values.cat_name);
						formData.append("brand_name", values.brand_name);
						formData.append("weight", values.weight);
						formData.append("width", values.width);
						formData.append("height", values.height);

						if (edit) {
							formData.append("id", this.props.editData.id);
						}
						for (let i = 0; i < this.state.fileList.length; i++) {
							formData.append("files", this.state.fileList[i].originFileObj);
						}

						for (let i = 0; i < this.state.fileList.length; i++) {
							if (this.state.fileList[i].originFileObj !== undefined) {
								formData.append("files", this.state.fileList[i].originFileObj);
							}
						}

						let isEdit = edit === true ? "updateRequest" : "addRequest";

						fetch(API_URL + `/request/${isEdit}`, {
							method: "POST",
							body: formData
						}).then(response => {
							this.props.getData();
							this.props.handleCancel();
							this.props.form.resetFields();
						});
					}
				}
			});
		} else {
			message.warning("Та эрхгүй байна.");
		}

	};

	handlePreview = file => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true
		});
	};

	handleChange = ({ fileList }) => {
		this.setState({ fileList })
	};

	removeImage = (e) => {
		if (e.thumbUrl == undefined) {
			fetch(`${API_URL}/product/deleteImage/${e.uid}`, {
				method: 'DELETE',
			}).then(response => response.json())
				.then(data => {
					if (data.success) {
						message.success(data.message);
					}
					else {
						message.error(data.message);
					}
				});
		}
	}

	renderFileList = () => {
		return this.props.fileList;
	}

	handleCancelImg = () => this.setState({ previewVisible: false });

	handleCancelModal = () => {
		this.props.form.resetFields();
		this.props.handleCancel();
	}

	removeImage = (e) => {
		if (e.thumbUrl == undefined) {
			fetch(`${API_URL}/request/deleteImage/${e.uid}`, {
				method: 'DELETE',
			}).then(response => response.json())
				.then(data => {
					if (data.success) {
						message.success(data.message);
					}
					else {
						message.error(data.message);
					}
				});
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { previewVisible, previewImage, fileList, edit } = this.state;
		const { editData } = this.props;
		let user = JSON.parse(localStorage.getItem("userData"));
		const uploadButton = (
			<div>
				<Icon type="plus" />
				{<div className="ant-upload-text">{user.adminType === 2 ? "上傳一張照片" : "Зураг оруулах"}</div>}
			</div>
		);
		return (
			<Modal
				title={user.adminType === 2 ? '"添加商品"' : "Бараа бүртгэх"}
				visible={this.props.visible}
				confirmLoading={this.props.confirmLoading}
				onCancel={this.handleCancelModal}
				footer={[
					<Button type="primary" onClick={e => this.handleSubmit(e)}>救</Button>
				]}
				width={1020}
			>
				<Row>
					<Form layout="inline" {...formItemLayout}>
						<Form.Item label="skunm" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("skunm", {
								initialValue: this.checkValues(editData.skunm),
								rules: [{ required: true, message: "skunm" }]
							})(<Input placeholder="skunm" />)}
						</Form.Item>
						<Form.Item label="price" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("price", {
								initialValue: this.checkValues(editData.price),
								rules: [{ required: true, message: "price" }]
							})(<Input placeholder="price" />)}
						</Form.Item>
						<Form.Item label="real_qty" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("real_qty", {
								initialValue: this.checkValues(editData.real_qty),
								rules: [{ required: true }]
							})(<Input placeholder="real_qty" />)}
						</Form.Item>
						<Form.Item label="featuretxt" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("featuretxt", {
								initialValue: this.checkValues(editData.featuretxt),
								rules: [{ required: true }]
							})(<Input placeholder="featuretxt" />)}
						</Form.Item>
						<Form.Item
							label="color_name"
							style={{ width: "45%", float: "left" }}
						>
							{getFieldDecorator("color_name", {
								initialValue: this.checkValues(editData.color_name),
								rules: [{ required: true }]
							})(<Input placeholder="color_name" />)}
						</Form.Item>
						<Form.Item label="cat_name" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("cat_name", {
								initialValue: this.checkValues(editData.cat_name),
								rules: [{ required: true }]
							})(
								<Input placeholder="cat_name" />
							)}
						</Form.Item>
						<Form.Item label="brand_name" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("brand_name", {
								initialValue: this.checkValues(editData.brand_name),
								rules: [{ required: true }]
							})(
								<Input placeholder="brand_name" />
							)}
						</Form.Item>
						<Form.Item label="weight" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("weight", {
								initialValue: this.checkValues(editData.weight),
								rules: [{ required: true }]
							})(
								<Input placeholder="weight" />
							)}
						</Form.Item>
						<Form.Item label="width" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("width", {
								initialValue: this.checkValues(editData.width),
								rules: [{ required: true }]
							})(
								<Input placeholder="width" />
							)}
						</Form.Item>
						<Form.Item label="height" style={{ width: "45%", float: "left" }}>
							{getFieldDecorator("height", {
								initialValue: this.checkValues(editData.height),
								rules: [{ required: true }]
							})(
								<Input placeholder="height" />
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
									onCancel={this.handleCancelImg}
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
		)
	}
}

export default Form.create({ name: "CreateAndEditModal" })(CreateAndEditModal);
