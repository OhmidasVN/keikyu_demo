import React, { useState } from 'react';
import { Table, Button, InputNumber, DatePicker, Dropdown } from 'antd';
import dayjs from 'dayjs';
import UnitTree, { getAllTitlesByTitle, demoData } from '../components/UnitTree';
import { get } from 'idb-keyval';

// Khôi phục lại interface CostEstimateRow như cũ
interface CostEstimateRow {
  key: number;
  employeeType: string;
  currentCount: number;
  raiseValue?: number;
  raiseType?: 'percent' | 'amount';
  months: (number | undefined)[];
  avgSalary: number;
}

const initialRows: Omit<CostEstimateRow, 'months'>[] = [
  { key: 1, employeeType: 'Nhân viên chính thức', currentCount: 10, avgSalary: 12000000 },
  { key: 2, employeeType: 'My star', currentCount: 5, avgSalary: 15000000 },
  { key: 3, employeeType: 'Phái cử', currentCount: 3, avgSalary: 10000000 },
  // ... thêm dòng mẫu nếu cần
];

function getMonthLabels() {
  const arr: string[] = [];
  let d = dayjs('2026-04', 'YYYY-MM');
  const end = dayjs('2027-04', 'YYYY-MM');
  while (d.isBefore(end) || d.isSame(end, 'month')) {
    arr.push(d.format('MM/YYYY'));
    d = d.add(1, 'month');
  }
  return arr;
}

const CostEstimate = () => {
  const nextYear = dayjs().add(1, 'year').year();
  const [salaryPercent, setSalaryPercent] = useState<number | null>(null);
  const [salaryAmount, setSalaryAmount] = useState<number | null>(null);
  const [month, setMonth] = useState<string>(`${nextYear}-04`);
  const monthLabels = getMonthLabels();
  const [data, setData] = useState<CostEstimateRow[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [unit, setUnit] = useState('all');
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const [unitTitles, setUnitTitles] = useState<string[]>([]);

  // Xác định index các mốc tháng
  const idxSep2026 = monthLabels.findIndex(m => m === '09/2026');
  const idxApr2027 = monthLabels.findIndex(m => m === '04/2027');

  const monthColumns = monthLabels.map((label, colIdx) => ({
    title: label,
    dataIndex: `month_${colIdx}`,
    width: 110,
    minWidth: 80,
    align: 'center' as const,
    render: (_: any, row: any, rowIdx: number) => (
      <InputNumber
        min={0}
        value={row.months[colIdx] ?? undefined}
        style={{ width: '90%' }}
        onChange={val => {
          const newData = [...data];
          newData[rowIdx].months[colIdx] = (val === null || val === undefined) ? undefined : Number(val);
          setData(newData);
        }}
      />
    ),
  }));

  // Chèn cột tổng kỳ đầu sau 09/2026
  if (idxSep2026 !== -1) {
    monthColumns.splice(idxSep2026 + 1, 0, {
      title: 'Tổng kỳ đầu',
      dataIndex: 'totalFirst',
      width: 110,
      minWidth: 110,
      align: 'center' as const,
      render: (_: any, row: any) => {
        const sum = row.months.slice(0, idxSep2026 + 1).reduce((a: number, b: number) => a + (b || 0), 0);
        return <span style={{ fontWeight: 600 }}>{sum}</span>;
      },
    });
  }
  // Chèn cột tổng kỳ cuối và tổng sau 04/2027
  if (idxApr2027 !== -1) {
    monthColumns.splice(idxApr2027 + 2, 0,
      {
        title: 'Tổng kỳ cuối',
        dataIndex: 'totalLast',
        width: 110,
        minWidth: 110,
        align: 'center' as const,
        render: (_: any, row: any) => {
          const sum = row.months.slice(idxSep2026 + 1, idxApr2027 + 1).reduce((a: number, b: number) => a + (b || 0), 0);
          return <span style={{ fontWeight: 600 }}>{sum}</span>;
        },
      },
      {
        title: 'Tổng',
        dataIndex: 'totalAll',
        width: 110,
        minWidth: 110,
        align: 'center' as const,
        render: (_: any, row: any) => {
          const sum = row.months.reduce((a: number, b: number) => a + (b || 0), 0);
          return <span style={{ fontWeight: 600, color: '#1C90BD' }}>{sum}</span>;
        },
      }
    );
  }

  // Table 1 columns:
  const columns = [
    { title: 'STT', dataIndex: 'key', width: 50, align: 'center' as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Phân loại nhân viên', dataIndex: 'employeeType', minWidth: 200, render: (value: string) => <span style={{ display: 'block' }}>{value}</span> },
    {
      title: 'Số lượng',
      dataIndex: 'currentCount',
      minWidth: 80,
      align: 'center' as const,
      render: (value: number) => <span style={{ display: 'block' }}>{value}</span>,
    },
    {
      title: 'Tăng lương',
      dataIndex: 'raise',
      minWidth: 180,
      align: 'center' as const,
      render: (_: any, row: CostEstimateRow, rowIdx: number) => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <InputNumber
            min={0}
            value={row.raiseValue}
            style={{ width: 90 }}
            onChange={val => {
              const newData = [...data];
              newData[rowIdx].raiseValue = val === null ? undefined : Number(val);
              setData(newData);
            }}

          />
          <select
            value={row.raiseType || 'percent'}
            style={{ width: 60, height: 32, borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }}
            onChange={e => {
              const newData = [...data];
              newData[rowIdx].raiseType = e.target.value as 'percent' | 'amount';
              setData(newData);
            }}
          >
            <option value="percent">%</option>
            <option value="amount">¥</option>
          </select>
        </div>
      ),
    },
    {
      title: 'Số lượng nhân viên',
      children: monthColumns,
    },
  ];

  // Tính tổng từng tháng
  const monthTotals = monthLabels.map((_, colIdx) =>
    data.reduce((sum, row) => sum + (Number(row.months[colIdx]) || 0), 0)
  );
  // Tổng kỳ đầu, kỳ cuối, tổng all
  const totalFirst = data.reduce((sum, row) => sum + row.months.slice(0, idxSep2026 + 1).reduce((a, b) => a + (b || 0), 0), 0);
  const totalLast = data.reduce((sum, row) => sum + row.months.slice(idxSep2026 + 1, idxApr2027 + 1).reduce((a, b) => a + (b || 0), 0), 0);
  const totalAll = data.reduce((sum, row) => sum + row.months.reduce((a, b) => a + (b || 0), 0), 0);
  const totalCurrent = data.reduce((sum, row) => sum + (row.currentCount || 0), 0);

  // Khi chọn đơn vị, load lại data từ employee_position_summary
  React.useEffect(() => {
    async function loadData() {
      const summary = (await get('employee_position_summary')) || [];
      let rows: CostEstimateRow[] = [];
      if (unit === 'all') {
        for (const group of summary) {
          for (const pos of group.positions) {
            rows.push({
              key: `${group.unit}-${pos.position}`,
              employeeType: pos.position,
              currentCount: pos.quantity,
              raiseValue: undefined,
              raiseType: 'percent',
              months: monthLabels.map(() => undefined),
              avgSalary: pos.salary || 0,
            });
          }
        }
      } else {
        const group = summary.find((g: any) => g.unit === unit);
        if (group) {
          for (const pos of group.positions) {
            rows.push({
              key: `${group.unit}-${pos.position}`,
              employeeType: pos.position,
              currentCount: pos.quantity,
              raiseValue: undefined,
              raiseType: 'percent',
              months: monthLabels.map(() => undefined),
              avgSalary: pos.salary || 0,
            });
          }
        }
      }
      setData(rows);
    }
    loadData();
  }, [unit, monthLabels]);

  // Table 2 (bảng kết quả): columns giữ nguyên, nhưng các cột tháng chỉ render label, không render input
  const resultColumns = [
    { ...columns[0] },
    { ...columns[1] },
    { ...columns[2] },
    {
      title: 'Lương trung bình',
      dataIndex: 'avgSalary',
      minWidth: 120,
      align: 'center' as const,
      render: (_: any, row: CostEstimateRow) => {
        let newSalary = row.avgSalary;
        if (row.raiseType === 'percent' && row.raiseValue) newSalary = Math.round(row.avgSalary * (1 + row.raiseValue / 100));
        else if (row.raiseType === 'amount' && row.raiseValue) newSalary = row.avgSalary + row.raiseValue;
        return <span>{newSalary.toLocaleString()} đ</span>;
      },
    },
    {
      title: 'Số lượng nhân viên',
      children: monthLabels.map((label, colIdx) => ({
        title: label,
        dataIndex: `month_${colIdx}`,
        width: 110,
        minWidth: 80,
        align: 'center' as const,
        render: (_: any, row: CostEstimateRow) => (
          <span>{row.months[colIdx] ?? ''}</span>
        ),
      })),
    },
  ];

  const handleApplyRaise = () => {
    if ((!salaryPercent && !salaryAmount) || (!salaryPercent && salaryAmount === 0) || (!salaryAmount && salaryPercent === 0)) return;
    // Xác định tháng bắt đầu
    let startIdx = 0;
    if (month) {
      const idx = monthLabels.findIndex(m => m === dayjs(month, 'YYYY-MM').format('MM/YYYY'));
      if (idx !== -1) startIdx = idx;
    }
    setData(prevData => prevData.map(row => {
      // Tính lương mới
      let newSalary = row.avgSalary;
      if (salaryPercent) newSalary = Math.round(row.avgSalary * (1 + salaryPercent / 100));
      if (salaryAmount) newSalary = row.avgSalary + salaryAmount;
      // Fill vào months từ startIdx trở đi
      const newMonths = row.months.map((val, idx) => idx >= startIdx ? newSalary : val);
      return { ...row, months: newMonths };
    }));
  };

  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1C90BD' }}>
          Biều mẫu dự toán theo đơn vị
        </div>
        <Button type="text" icon={<i className="fa-light fa-arrow-left" />} style={{ color: '#1C90BD', background: '#F5F5F5', fontWeight: 600, fontSize: 16 }} onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </div>
      {/* Dropdown chọn bộ phận */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
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
                onClick={() => { setUnit('all'); setUnitTitles([]); setUnitDropdownOpen(false); }}
              >
                Tất cả bộ phận
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
            {unit === 'all' ? 'Tất cả bộ phận' : unit}
          </Button>
        </Dropdown>
      </div>
      {/* Trạng thái kế hoạch */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <span style={{
          fontWeight: 700,
          color: '#1C90BD',
          fontSize: 15,
          letterSpacing: 0.2,
          marginRight: 4,
          height: 36,
          lineHeight: '36px',
          display: 'flex',
          alignItems: 'center',
        }}>
          Trạng thái kế hoạch:
        </span>
        {/* Các trạng thái */}
        <span style={{
          background: '#e6f4ff',
          border: '1px solid #1890ff',
          color: '#1C90BD',
          borderRadius: 6,
          padding: '0 20px',
          minWidth: 120,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: '0 1px 4px rgba(28,144,189,0.07)'
        }}>
          Bản nháp
        </span>
        <span style={{
          background: '#fffbe6',
          border: '1px solid #faad14',
          color: '#faad14',
          borderRadius: 6,
          padding: '0 20px',
          minWidth: 120,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: '0 1px 4px rgba(250,173,20,0.07)'
        }}>
          Chờ duyệt
        </span>
        <span style={{
          background: '#dcf1e1',
          border: '1px solid #22c55e',
          color: '#16a34a',
          borderRadius: 6,
          padding: '0 20px',
          minWidth: 120,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: '0 1px 4px rgba(34,197,94,0.07)'
        }}>
          Đã duyệt
        </span>
        <span style={{
          background: '#fff1f0',
          border: '1px solid #ff4d4f',
          color: '#ff4d4f',
          borderRadius: 6,
          padding: '0 20px',
          minWidth: 120,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: '0 1px 4px rgba(255,77,79,0.07)'
        }}>
          Từ chối
        </span>
        <span style={{
          background: '#e6f7ff',
          border: '1px solid #1890ff',
          color: '#1C90BD',
          borderRadius: 6,
          padding: '0 20px',
          minWidth: 120,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: '0 1px 4px rgba(28,144,189,0.07)'
        }}>
          Đã gửi
        </span>
      </div>
      {/* Filter */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Tăng lương theo tỷ lệ %</div>
          <InputNumber
            min={0}
            max={100}
            value={salaryPercent ?? undefined}
            onChange={v => setSalaryPercent(v)}
            style={{ width: 240 }}
            placeholder="Nhập % tăng lương"
            addonAfter="%"
          />
        </div>
        <div style={{ alignSelf: 'bottom', paddingTop: 30, fontWeight: 500, color: '#888', fontSize: 15, display: 'flex', alignItems: 'bottom', height: '100%' }}>
          Hoặc
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Tăng lương theo số tiền</div>
          <InputNumber
            min={0}
            value={salaryAmount ?? undefined}
            onChange={v => setSalaryAmount(v)}
            style={{ width: 240 }}
            placeholder="Nhập số tiền"
            addonAfter="¥"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Tăng lương từ tháng</div>
          <DatePicker
            picker="month"
            value={month ? dayjs(month, 'YYYY-MM') : null}
            onChange={d => setMonth(d ? d.format('YYYY-MM') : '')}
            style={{ width: 180, height: 35, borderRadius: 6, fontSize: 16, padding: '0 11px', display: 'flex', alignItems: 'center' }}
            placeholder="Chọn tháng"
            allowClear
            disabledDate={d => d && d.year() !== nextYear}
            inputReadOnly
          />
        </div>
        <Button
          type="primary"
          style={{ fontWeight: 600, height: 35, background: '#1C90BD', borderColor: '#1C90BD', borderRadius: 6, width: 120, alignSelf: 'flex-end', marginTop: 20 }}
          onClick={handleApplyRaise}
        >
          Áp dụng
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
        rowKey="key"
        scroll={{ x: true }}
        style={{ marginTop: 0 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={1} align="center"><b>Tổng</b></Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center"><b>{totalCurrent}</b></Table.Summary.Cell>
            <Table.Summary.Cell index={3} />
            {monthLabels.map((_, idx) => (
              <Table.Summary.Cell key={idx + 4} index={idx + 4} align="center">
                <b>{monthTotals[idx]}</b>
              </Table.Summary.Cell>
            ))}
            {idxSep2026 !== -1 && (
              <Table.Summary.Cell align="center"><b>{totalFirst}</b></Table.Summary.Cell>
            )}
            {idxApr2027 !== -1 && (
              <>
                <Table.Summary.Cell align="center"><b>{totalLast}</b></Table.Summary.Cell>
                <Table.Summary.Cell align="center"><b>{totalAll}</b></Table.Summary.Cell>
              </>
            )}
          </Table.Summary.Row>
        )}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <Button
          type="primary"
          style={{ background: '#1C90BD', borderColor: '#1C90BD', fontWeight: 600, fontSize: 14, borderRadius: 12, padding: '0 10px', height: 35, display: 'flex', alignItems: 'center', gap: 10 }}
          onClick={() => setShowResult(true)}
        >
          <i className="fa-light fa-calculator" style={{ fontSize: 18, marginRight: 8 }} />
          Tính toán chi phí nhân sự
        </Button>
      </div>
      {showResult && (
        <div style={{ marginTop: 32 }}>
          {/* Trạng thái kế hoạch */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>

          </div>
          <Table
            columns={resultColumns}
            dataSource={data}
            pagination={false}
            bordered
            size="small"
            rowKey="key"
            scroll={{ x: true }}
            style={{ marginTop: 0 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                <Table.Summary.Cell index={1} align="center"><b>Tổng</b></Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="center"><b>{totalCurrent}</b></Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
                {monthLabels.map((_, idx) => (
                  <Table.Summary.Cell key={idx + 4} index={idx + 4} align="center">
                    <b>{monthTotals[idx]}</b>
                  </Table.Summary.Cell>
                ))}
                {idxSep2026 !== -1 && (
                  <Table.Summary.Cell align="center"><b>{totalFirst}</b></Table.Summary.Cell>
                )}
                {idxApr2027 !== -1 && (
                  <>
                    <Table.Summary.Cell align="center"><b>{totalLast}</b></Table.Summary.Cell>
                    <Table.Summary.Cell align="center"><b>{totalAll}</b></Table.Summary.Cell>
                  </>
                )}
              </Table.Summary.Row>
            )}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32 }}>
            <Button
              type="default"
              style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, padding: '0 28px', height: 40, borderColor: '#1C90BD', color: '#1C90BD' }}
            >
              Lưu nháp
            </Button>
            <Button
              type="primary"
              style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, padding: '0 28px', height: 40, background: '#1C90BD', borderColor: '#1C90BD' }}
            >
              Lưu & gửi kế hoạch
            </Button>
          </div>
        </div>
      )}
      <style>{`
        .ant-table-cell:has(input) {
          padding: 2px 2px !important;
        }
      `}</style>
    </div>
  );
};

export default CostEstimate;
