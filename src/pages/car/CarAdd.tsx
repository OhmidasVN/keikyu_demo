import React from "react";
import CarForm from "./CarForm";
import { Button } from "antd";
import { Link } from "react-router-dom";

const CarAdd = () => {
  const handleSubmit = (values) => {
    console.log("Thêm xe mới:", values);
    // Thực hiện gọi API thêm xe ở đây nếu cần
  };

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
            Thêm xe mới
          </div>
        </div>
        <Link to="/car">
          <Button
            type="default"
            style={{
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px #f0f1f2",
            }}
            icon={<i className="fa-light fa-arrow-left" style={{ fontSize: 18 }} />}
          >
            Quay lại
          </Button>
        </Link>
      </div>
      <CarForm onSubmit={handleSubmit} mode="add" />
    </div>
  );
};

export default CarAdd;
