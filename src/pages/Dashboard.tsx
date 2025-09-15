const Dashboard = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          style={{ color: '#1C90BD', background: '#F5F5F5', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 6, padding: '4px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => window.history.back()}
        >
          <i className="fa-light fa-arrow-left" style={{ fontSize: 16 }} />
          Quay lại
        </button>
      </div>
      <h1>Dashboard Page</h1>
    </div>
  );
};

export default Dashboard;
