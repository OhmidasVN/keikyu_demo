import { Layout, Menu, Avatar, Dropdown } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.svg';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: "import-data",
      icon: <i className="fa-light fa-up-from-bracket icon-color" />, label: "Import data",
      children: [
        { key: "import-data", icon: <i className="fa-light fa-file-arrow-up icon-color" />, label: "Import" },
        { key: "employee", icon: <i className="fa-light fa-users icon-color" />, label: "Nhân viên" },
        { key: "update-data", icon: <i className="fa-light fa-arrows-rotate icon-color" />, label: "Cập nhật data" },
      ]
    },
    { key: "master-data", icon: <i className="fa-light fa-database icon-color" />, label: "Master data" },
    { key: "cost-estimate", icon: <i className="fa-light fa-money-check-pen icon-color" />, label: "Input" },
    {
      key: "report",
      icon: <i className="fa-light fa-game-board icon-color" />,
      label: "Output",
      children: [
        { key: "cost-estimate-sent", icon: <i className="fa-light fa-list-tree icon-color" />, label: "Dự toán đã gửi" },
      ]
    },
    { key: "account", icon: <i className="fa-light fa-user-plus icon-color"/>, label: "Tài khoản" },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <i className="fa-light fa-user icon-color" style={{ marginRight: 8 }} />,
      label: 'Profile',
    },
    {
      key: 'change-password',
      icon: <i className="fa-light fa-key icon-color" style={{ marginRight: 8 }} />,
      label: 'Đổi mật khẩu',
    },
    {
      key: 'logout',
      icon: <i className="fa-light fa-arrow-right-from-bracket icon-color" style={{ marginRight: 8 }} />,
      label: 'Đăng xuất',
    },
  ];
  const userMenuProps = {
    items: userMenuItems,
    onClick: handleMenuClick,
  };

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
          <Dropdown menu={userMenuProps} trigger={['hover']} placement="bottomRight">
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
