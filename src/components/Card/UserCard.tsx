import React from "react";
import { Button, Card, Slider, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { FirestoreUser, UserRating } from "@/services/firebase";
import { useDebounce } from "../hooks";

interface BaseUserCardProps {
  value: any;
  onChange?: (value: [number, number]) => void;
  user: FirestoreUser;
  extra?: React.ReactNode;
}

function BaseUserCard({ value, onChange, user, extra }: BaseUserCardProps) {
  const avgValue = getAverage(user.ratings);

  return (
    <Card
      title={user.name || "Anonymous"}
      hoverable
      style={{ width: 400 }}
      extra={extra}
    >
      <Card.Grid style={{ width: "100%", padding: "1em" }} hoverable={false}>
        {`${user.ratings.length} ratings`}
      </Card.Grid>

      <Card.Grid
        style={{ width: "100%", textAlign: "center" }}
        hoverable={false}
      >
        <Slider
          range
          min={-5}
          max={5}
          step={0.1}
          value={[avgValue, value || 0]}
          onChange={onChange}
          tooltip={{ open: false }}
        />

        <UserCardLabel touched={value !== undefined} value={value || 0} />
      </Card.Grid>
    </Card>
  );
}

interface UserCardProps {
  user: FirestoreUser;
  onRate: (uid: string, value: number) => void;
}

function UserCard({ user, onRate }: UserCardProps) {
  const [value, setValue] = React.useState<number | undefined>();
  const debouncedValue = useDebounce(value, 1500);

  const avgValue = getAverage(user.ratings);

  function onChange(values: [number, number]) {
    const value = values[0] < avgValue ? values[0] : values[1];
    setValue(value);
  }

  React.useEffect(() => {
    if (debouncedValue === undefined) return;
    onRate(user.uid, debouncedValue);
  }, [debouncedValue, onRate, user.uid]);

  return <BaseUserCard value={value} onChange={onChange} user={user} />;
}

interface RatedUserCardProps extends UserCardProps {
  rating: UserRating;
  onDeleteRating: (uid: string) => void;
}

function RatedUserCard({
  user,
  rating,
  onRate,
  onDeleteRating,
}: RatedUserCardProps) {
  const [value, setValue] = React.useState<number>(rating.value);
  const debouncedValue = useDebounce(value, 1500);

  const avgValue = getAverage(user.ratings);

  function onChange(values: [number, number]) {
    const value = values[0] < avgValue ? values[0] : values[1];
    setValue(value);
  }

  React.useEffect(() => {
    if (debouncedValue === undefined) return;
    onRate(user.uid, debouncedValue);
  }, [debouncedValue, onRate, user.uid]);

  return (
    <BaseUserCard
      value={value}
      onChange={onChange}
      user={user}
      extra={
        <Button
          shape="circle"
          onClick={() => onDeleteRating(user.uid)}
          icon={<CloseOutlined />}
        />
      }
    />
  );
}

function UserCardLabel({
  touched,
  value,
}: {
  touched: boolean;
  value: number;
}) {
  if (!touched) {
    return (
      <Typography.Text type="secondary">Deslize para avaliar</Typography.Text>
    );
  }

  if (value === 0) {
    return <Typography.Text type="secondary">Neutro</Typography.Text>;
  }

  if (value < -4) {
    return <Typography.Text type="danger">Muito Esquerdomacho</Typography.Text>;
  }

  if (value < 0) {
    return <Typography.Text type="danger">Esquerdomacho</Typography.Text>;
  }

  if (value > 4) {
    return <Typography.Text type="success">Muito Heterotop</Typography.Text>;
  }

  return <Typography.Text type="success">Heterotop</Typography.Text>;
}

function getAverage(ratings: UserRating[]) {
  const sum = ratings.reduce((sum, rating) => sum + rating.value, 0);
  const avg = sum / ratings.length;
  return Number(avg.toFixed(1));
}

export { UserCard, RatedUserCard };
