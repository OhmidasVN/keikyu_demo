import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Space, Tooltip, Dropdown, Select, Modal, Form as AntForm, message } from 'antd';
import { set, get } from 'idb-keyval';
import UnitTree, { getAllTitlesByTitle, demoData } from '../components/UnitTree';
// Đã bỏ import @ant-design/icons

const { Option } = Select;

const statusMap = {
  active: {
    text: 'Active',
    style: {
      background: '#dcf1e1', // xanh lá nhạt
      border: '1px solid #22c55e', // viền xanh lá
      color: '#16a34a', // chữ xanh lá
      borderRadius: 6,
      padding: '0 5px',
      height: 28,
      lineHeight: '26px',
      fontSize: 12,
      cursor: 'default',
      minWidth: 80,
      display: 'inline-block',
    },
  },
  inactive: {
    text: 'Inactive',
    style: {
      background: '#f5f5f5',
      border: '1px solid #bfbfbf',
      color: '#888',
      borderRadius: 6,
      padding: '0 5px',
      height: 28,
      lineHeight: '26px',
      fontSize: 12,
      cursor: 'default',
      minWidth: 80,
      display: 'inline-block',
    },
  },
  locked: {
    text: 'Khoá',
    style: {
      background: '#fff1f0',
      border: '1px solid #ff4d4f',
      color: '#ff4d4f',
      borderRadius: 6,
      padding: '0 5px',
      height: 28,
      lineHeight: '26px',
      fontSize: 12,
      cursor: 'default',
      minWidth: 80,
      display: 'inline-block',
    },
  },
};

const Account = () => {
  const [search, setSearch] = useState('');
  const [unit, setUnit] = useState('all');
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showAddModal, setShowAddModal] = useState(false);
  const [form] = AntForm.useForm();
  const [selectedUnit, setSelectedUnit] = useState('');
  const [unitDropdownOpenModal, setUnitDropdownOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState([
    { key: 1, username: 'admin', unit: '101 経営陣', phone: '03-1234-5678', status: 'active' },
    { key: 2, username: 'manager1', unit: '103 総務担当103', phone: '03-2345-6789', status: 'active' },
    { key: 3, username: 'user1', unit: '104 人事部門担当104', phone: '03-3456-7890', status: 'active' },
    { key: 4, username: 'viewer1', unit: '105 経営計画/段階費105', phone: '03-4567-8901', status: 'inactive' },
    { key: 5, username: 'manager2', unit: '112 経営管理費112', phone: '03-5678-9012', status: 'locked' },
    { key: 6, username: 'user2', unit: '111 福利担当111', phone: '03-6789-0123', status: 'active' },
    { key: 7, username: 'admin2', unit: '829 経営管理本部費用829', phone: '03-7890-1234', status: 'active' },
    { key: 8, username: 'viewer2', unit: '93123 大手町営業所', phone: '03-8901-2345', status: 'active' },
  ]);
  const [unitTitles, setUnitTitles] = useState<string[]>([]);

  // Load data from indexDB on mount
  useEffect(() => {
    get('accounts').then((accounts) => {
      if (accounts && Array.isArray(accounts)) {
        setDataSource(accounts);
      }
    });
  }, []);

  // Lọc dữ liệu theo username và đơn vị
  const filteredData = dataSource.filter(row =>
    row.username.toLowerCase().includes(search.trim().toLowerCase()) &&
    (unit === 'all' || unitTitles.includes(row.unit)) &&
    (status === 'all' || row.status === status)
  );

  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { title: 'STT', dataIndex: 'key', width: 60, align: 'center' as const, render: (t: any, r: any, i: number) => i + 1 },
    { title: 'Username', dataIndex: 'username', width: 120, align: 'left' as const },
    { title: 'Đơn vị', dataIndex: 'unit', width: 180, align: 'left' as const },
    { title: 'Số ĐT', dataIndex: 'phone', width: 120, align: 'center' as const },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 110,
      align: 'center' as const,
      render: (status: keyof typeof statusMap) => (
        <span style={statusMap[status].style}>{statusMap[status].text}</span>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      width: 120,
      align: 'center' as const,
      render: () => (
        <Space>
          <Tooltip title="Sửa">
            <button
              style={{
                background: '#e6f4ff',
                border: 'none',
                borderRadius: 8,
                padding: 0,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <i className="fa-light fa-pencil" style={{ color: '#1d90bd', fontSize: 14 }} />
            </button>
          </Tooltip>
          <Tooltip title="Khoá">
            <button
              style={{
                background: '#fffbe6',
                border: 'none',
                borderRadius: 8,
                padding: 0,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <i className="fa-light fa-lock" style={{ color: '#faad14', fontSize: 14 }} />
            </button>
          </Tooltip>
          <Tooltip title="Xoá">
            <button
              style={{
                background: '#fff1f0',
                border: 'none',
                borderRadius: 8,
                padding: 0,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <i className="fa-light fa-xmark" style={{ color: '#ff4d4f', fontSize: 14 }} />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1C90BD' }}>
          Quản lý tài khoản
        </div>
        <Button type="text" icon={<i className="fa-light fa-arrow-left" />} style={{ color: '#1C90BD', background: '#F5F5F5', fontWeight: 600, fontSize: 16 }}>
          Quay lại
        </Button>
      </div>
     
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', flexGrow: 1 }}>
          <Input
            placeholder="Tên, email, vai trò..."
            style={{ width: 220 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* Đơn vị filter bằng UnitTree */}
          <Dropdown
            open={unitDropdownOpen}
            onOpenChange={setUnitDropdownOpen}
            dropdownRender={() => (
              <div style={{ maxHeight: 400, overflow: 'auto', minWidth: 260 }}>
                <Button
                  type="text"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    color: '#1890ff',
                    fontWeight: 500,
                    fontSize: 14,
                    padding: '4px 16px',
                    borderRadius: 0,
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: 2,
                    background: '#e6f7ff',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#e6f7ff')}
                  onClick={() => { setUnit('all'); setUnitTitles([]); setUnitDropdownOpen(false); }}
                >
                  Tất cả đơn vị
                </Button>
                <UnitTree
                  onSelect={title => {
                    setUnit(title);
                    setUnitTitles(title === 'all' ? [] : getAllTitlesByTitle(demoData, title));
                    setUnitDropdownOpen(false);
                  }}
                  selectedKey={unit}
                />
              </div>
            )}
          >
            <Button style={{ width: 180, textAlign: 'left' }}>
              {unit === 'all' ? 'Tất cả đơn vị' : unit}
            </Button>
          </Dropdown>
          {/* Filter trạng thái bằng dropdown */}
          <Select value={status} style={{ width: 140 }} onChange={setStatus}>
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="locked">Khoá</Select.Option>
          </Select>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button type="primary" icon={<i className="fa-light fa-user-plus" />} style={{ background: '#1C90BD', borderColor: '#1C90BD',width: 120, fontWeight: 500 }}
            onClick={() => setShowAddModal(true)}
          >
            新規追加
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={pagedData}
        pagination={false}
        bordered
        size="small"
        rowKey="key"
        scroll={{ x: true }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Pagination current={page} total={filteredData.length} pageSize={pageSize} onChange={setPage} showSizeChanger={false} />
      </div>
      <div style={{ textAlign: 'center', color: '#888', fontSize: 13, marginTop: 8 }}>
        10件中1-10件を表示
      </div>
      <style>{`
        .ant-table-cell {
          padding: 4px 4px !important;
          font-size: 12px !important;
        }
      `}</style>

      <Modal
        open={showAddModal}
        title="Tạo tài khoản mới"
        onCancel={() => setShowAddModal(false)}
        onOk={() => {
          form.validateFields().then(values => {
            const newAccount = {
              ...values,
              key: Date.now(),
            };
            const newData = [newAccount, ...dataSource];
            setDataSource(newData);
            set('accounts', newData);
            message.success('Tạo tài khoản thành công!');
            setShowAddModal(false);
            form.resetFields();
            setSelectedUnit('');
          });
        }}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#1C90BD', borderColor: '#1C90BD', fontWeight: 500 } }}
      >
        <AntForm form={form} layout="vertical">
          <AntForm.Item name="username" label="Username" rules={[{ required: true, message: 'Nhập username!' }]}> 
            <Input />
          </AntForm.Item>
          <AntForm.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}> 
            <Input.Password
              addonAfter={
                <Button
                  size="small"
                  type="default"
                  style={{ fontSize: 12, padding: '0 8px' }}
                  onClick={() => {
                    // Gen pass: 8 ký tự, có hoa, thường, đặc biệt
                    const lower = 'abcdefghijklmnopqrstuvwxyz';
                    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const special = '!@#$%^&*()_+-=~';
                    const all = lower + upper + special;
                    let pass = '';
                    pass += lower[Math.floor(Math.random() * lower.length)];
                    pass += upper[Math.floor(Math.random() * upper.length)];
                    pass += special[Math.floor(Math.random() * special.length)];
                    for (let i = 3; i < 8; ++i) pass += all[Math.floor(Math.random() * all.length)];
                    // Shuffle
                    pass = pass.split('').sort(() => Math.random() - 0.5).join('');
                    form.setFieldsValue({ password: pass });
                  }}
                >
                  Gen pass tự động
                </Button>
              }
            />
          </AntForm.Item>
          <AntForm.Item name="unit" label={<span style={{ fontSize: 13, fontWeight: 500 }}>Đơn vị</span>} rules={[{ required: true, message: 'Chọn đơn vị!' }]} style={{ marginBottom: 16 }}>
            <Dropdown
              open={unitDropdownOpenModal}
              onOpenChange={setUnitDropdownOpenModal}
              dropdownRender={() => (
                <div style={{ maxHeight: 260, overflow: 'auto', minWidth: 220, borderRadius: 6, boxShadow: '0 2px 8px #eee', padding: 4 }}>
                  <UnitTree
                    onSelect={title => {
                      setSelectedUnit(title);
                      form.setFieldsValue({ unit: title });
                      setUnitDropdownOpenModal(false);
                    }}
                    selectedKey={selectedUnit}
                  />
                </div>
              )}
            >
              <Button style={{ width: '100%', textAlign: 'left', fontSize: 13, padding: '4px 10px', height: 32, borderRadius: 6 }}>
                {selectedUnit || 'Chọn đơn vị'}
              </Button>
            </Dropdown>
          </AntForm.Item>
          <AntForm.Item name="phone" label="Số ĐT" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}> 
            <Input />
          </AntForm.Item>
          <AntForm.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái!' }]}> 
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="locked">Khoá</Select.Option>
            </Select>
          </AntForm.Item>
        </AntForm>
      </Modal>
    </div>
  );
};

export default Account;
