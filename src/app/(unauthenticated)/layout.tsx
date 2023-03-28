"use client";

import "antd/dist/reset.css";
import "../globals.css";
import AuthProvider from "@/context/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

// Experiência do usuário
// 1) Usuário loga
// 2) Usuário vê card com outros usuários
// 3) Usuário vê valor da média do slider & número de avaliações & slider pra avaliar
// 3.1) Se usuário já tiver avaliado, vê slider avaliado + botão pra cancelar avaliação

// Testes
// 1) Stub do login com emuladores
// 2) Avaliação
// 3) Cancelamento de avaliação
