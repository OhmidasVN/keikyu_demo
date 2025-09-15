import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fafafa'
    }}
  >
    {/* Nội dung layout chia 2 cột hoặc dọc trên mobile */}
    <div
      className="auth-content"
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 0'
      }}
    >
      {/* Removed auth-intro block */}
      <div
        className="auth-form"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          minWidth: 0
        }}
      >
        {children}
      </div>
    </div>
    {/* Responsive CSS */}
    <style>
      {`
        @media (max-width: 900px) {
          .auth-content {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 0 !important;
          }
          .auth-intro {
            display: none !important;
          }
          .auth-form {
            flex: none !important;
            width: 100vw !important;
            justify-content: center !important;
            align-items: flex-start !important;
            padding: 32px 0 !important;
          }
        }
      `}
    </style>
  </div>
);

export default AuthLayout;
