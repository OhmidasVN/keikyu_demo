import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Dropdown } from 'antd';
import UnitTree, { getAllTitlesByTitle } from '../components/UnitTree';
import { demoData } from '../components/UnitTree';
import { get } from 'idb-keyval';

const Employee = () => {
  const [search, setSearch] = useState('');
  const [unit, setUnit] = useState('all');
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [unitTitles, setUnitTitles] = useState<string[]>([]);

  useEffect(() => {
    get('employees').then((employees) => {
      if (employees && Array.isArray(employees)) {
        setDataSource(employees);
      } else {
        setDataSource([]);
      }
    });
  }, []);

  const filteredData = dataSource.filter(row => {
    const searchText = search.trim().toLowerCase();
    const match =
      row.code?.toLowerCase().includes(searchText) ||
      row.fullname?.toLowerCase().includes(searchText) ||
      row.phone?.toLowerCase().includes(searchText);
    return (!searchText || match) && (unit === 'all' || unitTitles.includes(row.unit));
  });
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { title: 'STT', dataIndex: 'key', width: 60, align: 'center' as const, render: (t: any, r: any, i: number) => i + 1 },
    { title: 'Mã nhân viên', dataIndex: 'code', width: 100, align: 'left' as const },
    { title: 'Họ tên', dataIndex: 'fullname', width: 140, align: 'left' as const },
    { title: 'Đơn vị', dataIndex: 'unit', width: 180, align: 'left' as const },
    { title: 'Chức danh', dataIndex: 'position', width: 120, align: 'left' as const },
    { title: 'Ngày sinh', dataIndex: 'dob', width: 100, align: 'center' as const },
    { title: 'Ngày vào công ty', dataIndex: 'joinDate', width: 120, align: 'center' as const },
    { title: 'Số ĐT', dataIndex: 'phone', width: 120, align: 'center' as const },
  ];

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1C90BD' }}>
          Quản lý nhân viên
        </div>
        <Button type="text" icon={<i className="fa-light fa-arrow-left" />} style={{ color: '#1C90BD', background: '#F5F5F5', fontWeight: 600, fontSize: 16 }} onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', flexGrow: 1 }}>
          <Input
            placeholder="Tìm theo mã, tên hoặc số ĐT..."
            style={{ width: 260 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Dropdown
            open={unitDropdownOpen}
            onOpenChange={setUnitDropdownOpen}
            dropdownRender={() => (
              <div style={{ maxHeight: 400, overflow: 'auto', minWidth: 260 }}>
                <UnitTree
                  onSelect={title => {
                    setUnit(title);
                    setUnitTitles(title === 'all' ? [] : getAllTitlesByTitle(demoData, title));
                    setUnitDropdownOpen(false);
                  }}
                  selectedKey={unit}
                  showAllButton
                />
              </div>
            )}
          >
            <Button style={{ width: 180, textAlign: 'left' }}>
              {unit === 'all' ? 'Tất cả đơn vị' : unit}
            </Button>
          </Dropdown>
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
        {filteredData.length > 0 ? `Hiển thị ${pagedData.length} / ${filteredData.length} nhân viên` : 'Không có dữ liệu'}
      </div>
      <style>{`
        .ant-table-cell {
          padding: 4px 4px !important;
          font-size: 12px !important;
        }
      `}</style>
    </div>
  );
};

export default Employee;
