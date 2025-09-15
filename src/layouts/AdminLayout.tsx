import { Layout, Menu, Avatar, Dropdown } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.svg';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

  const items = [
    { key: "import-data", icon: <i className="fa-light fa-up-from-bracket icon-color" />, label: "Import data" },
    { key: "employee", icon: <i className="fa-light fa-users icon-color" />, label: "Nhân viên" },
    { key: "cost-estimate", icon: <i className="fa-light fa-display-chart-up-circle-dollar icon-color" />, label: "Dự toán chi phí" },
    { key: "account", icon: <i className="fa-light fa-user-plus icon-color"/>, label: "Tài khoản" },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">
        <i className="fa-light fa-user icon-color" style={{ marginRight: 8 }} />
        Profile
      </Menu.Item>
      <Menu.Item key="change-password">
        <i className="fa-light fa-key icon-color" style={{ marginRight: 8 }} />
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="logout">
        <i className="fa-light fa-arrow-right-from-bracket icon-color" style={{ marginRight: 8 }} />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="logo" style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
          }}>

            <img src={logo} alt="Logo" style={{ height: 35}} />
          </div>
          <Menu
            mode="inline"
            items={items}
            onClick={({ key }) => navigate(`/${key}`)}
          />
        </div>
        {/* Bỏ menu Đăng xuất ở dưới */}
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Dropdown overlay={userMenu} trigger={['hover']} placement="bottomRight">
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 500, color: '#222', fontSize: 15 }}>admin</span>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: '#e6f4ff' }}>
                <i className="fa-light fa-user" style={{ fontSize: 20, color: '#1C90BD' }} />
              </span>
              <i className="fa-light fa-angle-down" style={{ fontSize: 16 }} />
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: "3px", background: "#fff", padding: 5 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
