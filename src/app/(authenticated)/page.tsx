"use client";

import { RatedUserCard, UserCard } from "@/components";
import { Divider, Empty, Space, Typography } from "antd";
import React from "react";
import * as Firebase from "@/services/firebase";
import { FirestoreUser } from "@/services/firebase";
import { useAuth } from "@/context";

export default function HomePage() {
  const [users, setUsers] = React.useState<FirestoreUser[]>([]);
  const {
    state: { user: authUser },
  } = useAuth();

  React.useEffect(() => {
    const unsubscribe = Firebase.onUsersSnapshot({
      next: (snap) => {
        const users = snap.docs.map((doc) => ({ ...doc.data() }));
        setUsers(users);
      },
    });

    return function onUnmount() {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const onRate = React.useCallback(
    (uid: string, value: number) => {
      Firebase.rateUser(uid, { uid: authUser?.uid as string, value });
    },
    [authUser?.uid]
  );

  const onDeleteRating = React.useCallback(
    (uid: string) => {
      Firebase.deleteRating(uid, authUser?.uid as string);
    },
    [authUser?.uid]
  );

  if (!authUser) {
    return null;
  }

  return (
    <main style={{ padding: "2em" }}>
      <Typography.Title>Home</Typography.Title>
      <Divider />

      <Space
        direction="horizontal"
        wrap
        align="center"
        size="large"
        style={{
          padding: "2em",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {users.length === 0 && <EmpytUsers />}
        {users.map((user) => {
          const prevRating = user?.ratings?.find(
            (r) => r.uid === authUser?.uid
          );
          if (prevRating) {
            return (
              <RatedUserCard
                user={user}
                rating={prevRating}
                onRate={onRate}
                onDeleteRating={onDeleteRating}
                key={user?.uid}
              />
            );
          }

          return <UserCard user={user} onRate={onRate} key={user?.uid} />;
        })}
      </Space>
    </main>
  );
}

function EmpytUsers() {
  return <Empty description={<span>No users</span>}></Empty>;
}
