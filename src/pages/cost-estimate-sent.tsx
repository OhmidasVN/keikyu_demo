import React, { useState } from 'react';
import { Table, Input, Button, Pagination, Dropdown, Select } from 'antd';
import UnitTree, { getAllTitlesByTitle, demoData } from '../components/UnitTree';

// Helper: tìm đơn vị cha trực tiếp theo title
function findParentUnitTitle(nodes: any[], childTitle: string, parent: string | null = null): string | null {
  for (const node of nodes) {
    let nodeTitle = node.title;
    if (typeof nodeTitle === 'object' && nodeTitle && 'props' in nodeTitle) nodeTitle = nodeTitle.props.children;
    if (nodeTitle === childTitle) return parent;
    if (node.children) {
      const found: string | null = findParentUnitTitle(node.children, childTitle, nodeTitle);
      if (found) return found;
    }
  }
  return null;
}

const statusMap = {
  draft: {
    text: 'Bản nháp',
    style: {
      background: '#e6f4ff',
      border: '1px solid #1890ff',
      color: '#1C90BD',
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
  pending: {
    text: 'Chờ duyệt',
    style: {
      background: '#fffbe6',
      border: '1px solid #faad14',
      color: '#faad14',
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
  approved: {
    text: 'Đã duyệt',
    style: {
      background: '#dcf1e1',
      border: '1px solid #22c55e',
      color: '#16a34a',
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
  rejected: {
    text: 'Từ chối',
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
  notstarted: {
    text: 'Chưa tạo',
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
};

const allData = [
  { key: 1, unit: '101 経営陣', status: 'approved', updatedAt: '2024-07-01 09:15', rejectedReason: '', rejectedBy: '' },
  { key: 2, unit: '103 総務担当103', status: 'draft', updatedAt: '2024-07-02 14:20', rejectedReason: '', rejectedBy: '' },
  { key: 3, unit: '104 人事部門担当104', status: 'pending', updatedAt: '2024-07-03 10:05', rejectedReason: '', rejectedBy: '' },
  { key: 4, unit: '105 経営計画/段階費105', status: 'rejected', updatedAt: '2024-07-04 16:40', rejectedReason: 'Thiếu chứng từ hợp lệ', rejectedBy: 'Phòng Kế toán' },
  { key: 5, unit: '112 経営管理費112', status: 'approved', updatedAt: '2024-07-05 08:30', rejectedReason: '', rejectedBy: '' },
  { key: 6, unit: '111 福利担当111', status: 'pending', updatedAt: '2024-07-06 11:55', rejectedReason: '', rejectedBy: '' },
  { key: 7, unit: '829 経営管理本部費用829', status: 'draft', updatedAt: '2024-07-07 13:10', rejectedReason: '', rejectedBy: '' },
  { key: 8, unit: '93123 大手町営業所', status: 'notstarted', updatedAt: '', rejectedReason: '', rejectedBy: '' },
];

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'notstarted', label: 'Chưa tạo thôi' },
];

const pageSize = 10;

const CostEstimateSent = () => {
  const [search, setSearch] = useState('');
  const [unit, setUnit] = useState('all');
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [unitTitles, setUnitTitles] = useState<string[]>([]);

  const filteredData = allData.filter(row => {
    const searchText = search.trim().toLowerCase();
    const match = row.unit.toLowerCase().includes(searchText);
    return (!searchText || match)
      && (unit === 'all' || unitTitles.includes(row.unit))
      && (status === 'all' || row.status === status);
  });
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { title: 'STT', dataIndex: 'key', width: 60, align: 'center' as const, render: (t: any, r: any, i: number) => (page - 1) * pageSize + i + 1 },
    { title: 'Đơn vị', dataIndex: 'unit', width: 220, align: 'left' as const },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      align: 'center' as const,
      render: (status: keyof typeof statusMap) => (
        <span style={statusMap[status].style}>{statusMap[status].text}</span>
      ),
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'updatedAt',
      width: 160,
      align: 'center' as const,
      render: (updatedAt: string) => updatedAt || <span style={{ color: '#bbb' }}>-</span>,
    },
    {
      title: 'Nội dung từ chối',
      dataIndex: 'rejectedReason',
      width: 200,
      align: 'left' as const,
      render: (reason: string, row: any) => row.status === 'rejected' ? reason || <span style={{ color: '#bbb' }}>-</span> : <span style={{ color: '#bbb' }}>-</span>,
    },
    {
      title: 'Đơn vị từ chối',
      dataIndex: 'rejectedBy',
      width: 160,
      align: 'left' as const,
      render: (_: string, row: any) => {
        if (row.status !== 'rejected') return <span style={{ color: '#bbb' }}>-</span>;
        const parent = findParentUnitTitle(demoData, row.unit);
        return parent ? parent : <span style={{ color: '#bbb' }}>-</span>;
      },
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1C90BD' }}>
          Dự toán đã gửi các bộ phận
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', flexGrow: 1 }}>
          {/* Bỏ filter tìm kiếm tên bộ phận */}
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
          <Select value={status} style={{ width: 140 }} onChange={setStatus}>
            {statusOptions.map(opt => (
              <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
            ))}
          </Select>
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
        {filteredData.length > 0 ? `Hiển thị ${pagedData.length} / ${filteredData.length} bộ phận` : 'Không có dữ liệu'}
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

export default CostEstimateSent;
