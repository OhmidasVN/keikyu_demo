import { Button, Card, Form, Input, Divider, Checkbox } from "antd";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from '../assets/images/logo.svg';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const onFinish = (values: any) => {
    // Giả lập đăng nhập thành công
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  return (
    <AuthLayout>
      <Card
        style={{ width: 380, boxShadow: '0 2px 8px #f0f1f2' }}
        bodyStyle={{ padding: 32, position: 'relative' }}
        title={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: 35, marginTop: 30, marginBottom: 8 }} />
            <span style={{ fontSize: 20, fontWeight:600, alignSelf: 'flex-start' ,marginTop: 15 , marginBottom: 15}}>Đăng nhập</span>
          </div>
        }
      >
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true }]}> 
            <Input prefix={<i className="fa-light fa-user" style={{ color: '#bfbfbf', marginRight: 4 }} />} autoComplete="username" placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]} style={{ marginBottom: 0 }}> 
            <Input.Password prefix={<i className="fa-light fa-lock" style={{ color: '#bfbfbf', marginRight: 4 }} />} autoComplete="current-password" placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 16 }}>
            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
          </Form.Item>
          <Form.Item style={{marginBottom: 10}}>
            <Button type="primary" htmlType="submit" block style={{ background: '#1C90BD', borderColor: '#1C90BD', fontWeight: 500 }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthLayout>
  );
};

export default Login;
