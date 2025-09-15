import React from "react";
import { useParams } from "react-router-dom";
import CarForm from "./CarForm";

const mockData = {
  1: { name: 'John Brown', manufacturer: 'Toyota', age: 32, status: 'SELLING', description: '...' },
  2: { name: 'Jim Green', manufacturer: 'Honda', age: 42, status: 'SOLD', description: '...' },
  3: { name: 'Joe Black', manufacturer: 'Mazda', age: 32, status: 'HIDDEN', description: '...' },
  4: { name: 'Joe Black', manufacturer: 'Mazda', age: 32, status: 'EXPIRED', description: '...' },
};

const CarEdit = () => {
  const { id } = useParams();
  const initialValues = mockData[id] || {};

  const handleSubmit = (values) => {
    console.log("Cập nhật xe:", values);
    // Thực hiện gọi API cập nhật xe ở đây nếu cần
  };

  return (
    <div>
      <h1>Cập nhật xe</h1>
      <CarForm initialValues={initialValues} onSubmit={handleSubmit} mode="edit" />
    </div>
  );
};

export default CarEdit;

