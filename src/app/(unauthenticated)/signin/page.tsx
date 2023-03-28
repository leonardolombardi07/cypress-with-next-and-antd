"use client";

import { Button, Divider, Typography } from "antd";
import * as Firebase from "@/services/firebase";

export default function SignInPage() {
  function onClick() {
    try {
      Firebase.signInWithGoogle();
    } catch (error) {
      // TODO: show error
    }
  }

  return (
    <main style={{ padding: "2em" }}>
      <Typography.Title>Sign in</Typography.Title>
      <Divider />

      <Button onClick={onClick}>Sign in</Button>
    </main>
  );
}
