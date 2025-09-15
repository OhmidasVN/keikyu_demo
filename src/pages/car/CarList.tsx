import React, { useState } from 'react';
import { Table, Input, Select, Space, Button, Popconfirm, Tooltip, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { Link } from "react-router-dom";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  description: string;
  manufacturer?: string;
  status: string;
}

const manufacturers = [
  'Toyota', 'Honda', 'Mazda', 'Kia', 'Hyundai'
];

const STATUS_MAP = {
  SELLING: { label: "Đang bán", color: "#52c41a", bg: "#f6ffed" },
  SOLD: { label: "Đã bán", color: "#F4A460", bg: "#fff7e6" },
  HIDDEN: { label: "Ẩn", color: "#bfbfbf", bg: "#fafafa" },
  EXPIRED: { label: "Hết hạn", color: "#ff4d4f", bg: "#fff1f0" },
};

const data: DataType[] = [
  { key: 1, name: 'John Brown', age: 32, address: 'New York', description: '...', manufacturer: 'Toyota', status: 'SELLING' },
  { key: 2, name: 'Jim Green', age: 42, address: 'London', description: '...', manufacturer: 'Honda', status: 'SOLD' },
  { key: 3, name: 'Joe Black', age: 32, address: 'Sydney', description: '...', manufacturer: 'Mazda', status: 'HIDDEN' },
  { key: 4, name: 'Joe Black', age: 32, address: 'Sydney', description: '...', manufacturer: 'Mazda', status: 'EXPIRED' },
];

const CarList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [manufacturer, setManufacturer] = useState('');

  const filteredData = data.filter(car =>
    car.name.toLowerCase().includes(search.toLowerCase()) &&
    (manufacturer ? car.manufacturer === manufacturer : true)
  );

  const columns: TableColumnsType<DataType> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const s = STATUS_MAP[status] || {};
        return (
          <Tag
            style={{
              border: `1px solid ${s.color}`,
              background: s.bg,
              color: s.color,
              fontWeight: 500,
              fontSize: 14,
              display: 'inline-block',
              height: 28,
              lineHeight: '25px',
              minWidth: 90,
              textAlign: 'center',
            }}
          >
            {s.label || status}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="link"
              size="small"
              style={{ color: "#1890ff", padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
              // onClick={() => handleEdit(record)}
            >
              <i className="fa-light fa-pen-line blue-color" style={{ fontSize: 16 }} />
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá xe này?"
              okText="Xoá"
              cancelText="Huỷ"
              onConfirm={() => {
                // Xử lý xóa ở đây
              }}
            >
              <Button
                type="link"
                size="small"
                style={{ color: "#ff4d4f", padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <i className="fa-light fa-circle-minus" style={{ fontSize: 16 }} />
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0 12px 0",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 20,
          background: "#fff",
          borderRadius: 8,
          minHeight: 64,
        }}
      >
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>
            Danh sách xe
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="text" icon={<i className="fa-light fa-arrow-left" />} style={{ color: '#1C90BD', background: '#F5F5F5', fontWeight: 600, fontSize: 16 }} onClick={() => window.history.back()}>
            Quay lại
          </Button>
          <Link to="/car/add">
            <Button
              type="primary"
              style={{
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 8px #f0f1f2",
              }}
              icon={<i className="fa-light fa-plus" style={{ fontSize: 18 }} />}
            >
              Thêm xe mới
            </Button>
          </Link>
        </div>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm tên xe"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          allowClear
          placeholder="Chọn hãng xe"
          value={manufacturer || undefined}
          onChange={value => setManufacturer(value)}
          style={{ width: 160 }}
        >
          {manufacturers.map(m => (
            <Select.Option key={m} value={m}>{m}</Select.Option>
          ))}
        </Select>
      </Space>
      <Table<DataType>
        columns={columns}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
          rowExpandable: (record) => true,
        }}
        dataSource={filteredData}
      />
    </div>
  );
};

export default CarList;
