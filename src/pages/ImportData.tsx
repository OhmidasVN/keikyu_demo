import React, { useState } from 'react';
import { Steps, Button } from 'antd';
import ImportStep from './ImportStep';

const { Step } = Steps;

const employeeColumns = ['code','fullname','username','unit','position','dob','joinDate','phone'];
const employeeHeaders = 'code,fullname,username,unit,position,dob,joinDate,phone';
const salaryColumns = ['code','salary'];
const salaryHeaders = 'code,salary';
const overtimeColumns = ['code','salary'];
const overtimeHeaders = 'code,salary';

const ImportData = () => {
  const [step, setStep] = useState(0);
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));
  return (
    <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 1100, margin: '0 auto', display: 'flex', minHeight: 500 }}>
      <div style={{ position: 'absolute', right: 40, top: 24, zIndex: 2 }}>
        <Button type="text" icon={<i className="fa-light fa-arrow-left" />} style={{ color: '#1C90BD', background: '#F5F5F5', fontWeight: 600, fontSize: 16 }} onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </div>
      <div style={{ width: 220, marginRight: 32 }}>
        <Steps direction="vertical" current={step} style={{ minHeight: 300 }}>
          <Step title="Import danh sách nhân viên" status={step > 0 ? 'finish' : 'process'} />
          <Step title="Import bảng lương" status={step > 1 ? 'finish' : step === 1 ? 'process' : 'wait'} />
          <Step title="Import lương ngoài giờ" status={step === 2 ? 'finish' : 'wait'} />
        </Steps>
      </div>
      <div style={{ flex: 1 }}>
        {step === 0 && (
          <ImportStep
            title="Import dữ liệu nhân viên (CSV)"
            templateColumns={employeeColumns}
            templateHeaders={employeeHeaders}
            dbKey="employees"
            onNext={() => setStep(1)}
            showPrev={false}
          />
        )}
        {step === 1 && (
          <ImportStep
            title="Import bảng lương (CSV)"
            templateColumns={salaryColumns}
            templateHeaders={salaryHeaders}
            dbKey="salaries"
            onNext={() => setStep(2)}
            onPrev={handlePrev}
            showPrev={true}
          />
        )}
        {step === 2 && (
          <ImportStep
            title="Import lương ngoài giờ (CSV)"
            templateColumns={overtimeColumns}
            templateHeaders={overtimeHeaders}
            dbKey="overtimes"
            onNext={() => {}}
            onPrev={handlePrev}
            showPrev={true}
            isLastStep={true}
          />
        )}
      </div>
    </div>
  );
};

export default ImportData;
