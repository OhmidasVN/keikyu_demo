import React from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const manufacturers = [
  'Toyota', 'Honda', 'Mazda', 'Kia', 'Hyundai'
];

const statusOptions = [
  { value: 'SELLING', label: 'Đang bán' },
  { value: 'SOLD', label: 'Đã bán' },
  { value: 'HIDDEN', label: 'Ẩn' },
  { value: 'EXPIRED', label: 'Hết hạn' },
];

const CarForm = ({ initialValues = {}, onSubmit, mode = 'add' }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <Form.Item name="name" label="Tên xe" rules={[{ required: true, message: 'Vui lòng nhập tên xe' }]}> 
        <Input placeholder="Nhập tên xe" />
      </Form.Item>
      <Form.Item name="manufacturer" label="Hãng xe" rules={[{ required: true, message: 'Vui lòng chọn hãng xe' }]}> 
        <Select placeholder="Chọn hãng xe">
          {manufacturers.map(m => <Option key={m} value={m}>{m}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item name="age" label="Năm sản xuất" rules={[{ required: true, message: 'Vui lòng nhập năm' }]}> 
        <Input type="number" placeholder="Nhập năm sản xuất" />
      </Form.Item>
      <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
        <Select placeholder="Chọn trạng thái">
          {statusOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item name="description" label="Mô tả"> 
        <Input.TextArea rows={3} placeholder="Nhập mô tả" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {mode === 'edit' ? 'Cập nhật xe' : 'Thêm xe mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CarForm;

