import React, { useState } from 'react';
import { Table, Button, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';

interface CostEstimateRow {
  key: number;
  employeeType: string;
  currentCount: number;
  months: (number | undefined)[];
  raiseType?: '%' | '¥';
  raiseValue?: number;
}

const initialRows: Omit<CostEstimateRow, 'months'>[] = [
  { key: 1, employeeType: 'Nhân viên chính thức', currentCount: 10, raiseType: '%', raiseValue: undefined },
  { key: 2, employeeType: 'My star', currentCount: 5, raiseType: '%', raiseValue: undefined },
  { key: 3, employeeType: 'Phái cử', currentCount: 3, raiseType: '%', raiseValue: undefined },
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
  const [data, setData] = useState<CostEstimateRow[]>(
    initialRows.map(row => ({
      key: row.key,
      employeeType: row.employeeType,
      currentCount: row.currentCount,
      months: monthLabels.map(() => undefined),
      raiseType: row.raiseType ?? '%',
      raiseValue: row.raiseValue,
    }))
  );

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

  const columns = [
    { title: 'STT', dataIndex: 'key', width: 50, align: 'center' as const, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Phân loại nhân viên', dataIndex: 'employeeType', minWidth: 200, render: (value: string) => (
      <span style={{ display: 'block' }}>{value}</span>
    ) },
    {
      title: 'Số lượng',
      dataIndex: 'currentCount',
      minWidth: 80,
      align: 'center' as const,
      render: (value: number) => (
        <span style={{ display: 'block' }}>{value}</span>
      ),
    },
    {
      title: 'Tăng lương',
      dataIndex: 'raiseType',
      minWidth: 120,
      align: 'center' as const,
      render: (_: any, row: any, rowIdx: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <InputNumber
            min={0}
            value={row.raiseValue ?? undefined}
            style={{ width: 60, height: 28, borderRadius: 4, border: '1px solid #d9d9d9', textAlign: 'center' }}
            onChange={val => {
              const newData = [...data];
              newData[rowIdx].raiseValue = val === null ? undefined : val;
              setData(newData);
            }}
          />
          <select
            value={row.raiseType || '%'}
            style={{ width: 40, height: 28, borderRadius: 4, border: '1px solid #d9d9d9', textAlign: 'center' }}
            onChange={e => {
              const newData = [...data];
              newData[rowIdx].raiseType = e.target.value as '%' | '¥';
              setData(newData);
            }}
          >
            <option value="%">%</option>
            <option value="¥">¥</option>
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
          style={{
            fontWeight: 600,
            height: 35,
            background: '#1C90BD',
            borderColor: '#1C90BD',
            borderRadius: 6,
            width: 120,
            alignSelf: 'flex-end',
            marginTop: 20
          }}
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
      <style>{`
        .ant-table-cell:has(input) {
          padding: 2px 2px !important;
        }
      `}</style>
    </div>
  );
};

export default CostEstimate;
