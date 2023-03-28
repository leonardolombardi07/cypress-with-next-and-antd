"use client";

import "../globals.css";
import "antd/dist/reset.css";

import { Layout, Menu, theme } from "antd";
import { LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import AuthProvider from "@/context/auth";
import { usePathname, useRouter } from "next/navigation";
import * as Firebase from "@/services/firebase";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </Layout>
  );
}

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Layout.Header
      style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        items={[
          {
            label: "Home",
            key: "/",
            icon: <HomeOutlined />,
            onClick: () => router.push("/"),
          },

          {
            label: "Logout",
            key: "signout",
            icon: <LogoutOutlined />,
            onClick: () => Firebase.signOut(),
          },
        ]}
      />
    </Layout.Header>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Content style={{ padding: "2em" }}>
      <div
        style={{
          padding: "1em",
          background: colorBgContainer,
        }}
      >
        {children}
      </div>
    </Layout.Content>
  );
}

function Footer() {
  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      Leonardo Lombardi ©2023
    </Layout.Footer>
  );
}
