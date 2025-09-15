import React, { useState } from 'react';
import { Button, Upload, message, Alert } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { set } from 'idb-keyval';

const { Dragger } = Upload;

function parseCSV(csv: string, headers: string[]) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const fileHeaders = lines[0].split(',').map(h => h.trim());
  // Check headers match
  if (headers.join(',') !== fileHeaders.join(',')) return null;
  return lines.slice(1).map((line, idx) => {
    const values = line.split(',');
    const obj: any = { key: idx + 1 };
    headers.forEach((h, i) => {
      obj[h] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

interface ImportStepProps {
  title: string;
  templateColumns: string[];
  templateHeaders: string;
  dbKey: string;
  onNext: () => void;
  onPrev?: () => void;
  showPrev?: boolean;
  isLastStep?: boolean;
}

const ImportStep: React.FC<ImportStepProps> = ({ title, templateColumns, templateHeaders, dbKey, onNext, onPrev, showPrev, isLastStep }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (file: File) => {
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const json = parseCSV(text, templateColumns);
        if (!json) throw new Error('File không đúng định dạng template!');
        if (!json.length) throw new Error('File không hợp lệ hoặc không có dữ liệu!');
        setData(json);
        await set(dbKey, json);
        setSaved(true);
      } catch (err: any) {
        setError(err.message || 'File lỗi!');
        setData([]);
        setSaved(false);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    return false;
  };

  return (
    <div style={{ height: 160 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#1C90BD', marginBottom: 16 }}>{title}</div>
      <Dragger
        name="file"
        accept=".csv"
        beforeUpload={handleUpload}
        showUploadList={false}
        multiple={false}
        style={{ marginBottom: 24, padding: '8px 0', minHeight: 80, borderRadius: 8 }}
      >
        <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
          <InboxOutlined style={{ color: '#1C90BD', fontSize: 28 }} />
        </p>
        <p className="ant-upload-text" style={{ fontSize: 14, marginBottom: 4 }}>Kéo thả hoặc bấm để chọn file CSV</p>
        <p className="ant-upload-hint" style={{ fontSize: 12, color: '#888' }}>File phải có dòng đầu là tiêu đề: {templateHeaders}</p>
      </Dragger>
      {error && <div style={{ color: '#ff4d4f', fontWeight: 500, marginBottom: 20 }}>{error}</div>}
      {data.length > 0 && !error && (
        <div style={{ color: '#16a34a', fontWeight: 500, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-light fa-file-check" style={{ fontSize: 20, color: '#16a34a' }} />
          Upload thành công, số bản ghi: {data.length}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        {showPrev && (
          <Button onClick={onPrev} style={{ minWidth: 90 }}>
            <i className="fa-light fa-arrow-left" style={{ marginRight: 6 }} />Quay lại
          </Button>
        )}
        {!isLastStep && (
          <Button type="primary" style={{ background: '#1C90BD', borderColor: '#1C90BD', fontWeight: 500 }} onClick={onNext} disabled={!data.length} loading={loading}>
            Tiếp tục <i className="fa-light fa-arrow-right" style={{ marginLeft: 6 }} />
          </Button>
        )}
      </div>
      {isLastStep && data.length > 0 && !error && (
        <Alert
          type="success"
          showIcon
          style={{ marginTop: 20, fontWeight: 600, fontSize: 16 }}
          message="Upload dữ liệu thành công!"
        />
      )}
    </div>
  );
};

export default ImportStep;
