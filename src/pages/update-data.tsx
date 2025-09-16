import React, { useEffect, useState } from 'react';
import { Table, Button, Dropdown } from 'antd';
import UnitTree, { getAllTitlesByTitle, demoData } from '../components/UnitTree';
import { get } from 'idb-keyval';

const UpdateData = () => {
  const [unit, setUnit] = useState('all');
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPositions() {
      const summary = (await get('employee_position_summary')) || [];
      if (unit === 'all') {
        setPositions([]);
        return;
      }
      const group = summary.find((g: any) => g.unit === unit);
      setPositions(group ? group.positions : []);
    }
    fetchPositions();
  }, [unit]);

  const columns = [
    { title: 'STT', dataIndex: 'stt', width: 60, align: 'center' as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên vị trí', dataIndex: 'position', width: 180 },
    { title: 'Số lượng', dataIndex: 'quantity', width: 100, align: 'center' as const },
    { title: 'Lương trung bình', dataIndex: 'salary', width: 140, align: 'center' as const, render: (v: number) => v ? v.toLocaleString() + ' đ' : '-' },
  ];

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 700, margin: '0 auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1C90BD', marginBottom: 20 }}>Cập nhật dữ liệu vị trí theo đơn vị</div>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontWeight: 500, fontSize: 15, color: '#1C90BD' }}>Đơn vị:</span>
        <Dropdown
          open={unitDropdownOpen}
          onOpenChange={setUnitDropdownOpen}
          dropdownRender={() => (
            <div style={{ maxHeight: 400, overflow: 'auto', minWidth: 260 }}>
              <Button
                type="text"
                style={{ width: '100%', textAlign: 'left', color: '#1890ff', fontWeight: 500, fontSize: 14, padding: '4px 16px', borderRadius: 0, borderBottom: '1px solid #f0f0f0', marginBottom: 2, background: '#e6f7ff', transition: 'background 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.background = '#e6f7ff')}
                onClick={() => { setUnit('all'); setUnitDropdownOpen(false); }}
              >
                Tất cả đơn vị
              </Button>
              <UnitTree
                onSelect={title => {
                  setUnit(title);
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
      </div>
      <Table
        columns={columns}
        dataSource={positions}
        pagination={false}
        bordered
        size="small"
        rowKey={(_, i) => i?.toString()}
        locale={{ emptyText: unit === 'all' ? 'Chọn đơn vị để xem danh sách vị trí' : 'Không có dữ liệu' }}
      />
    </div>
  );
};

export default UpdateData;

