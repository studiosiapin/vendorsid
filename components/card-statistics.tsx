import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CardStatisticsProps {
  title: string;
  icon: React.ReactNode;
  value: string | number | undefined;
  desc?: string;
  isLoading?: boolean;
}

const CardStatistics = ({
  title,
  icon,
  value,
  desc,
  isLoading
}: CardStatisticsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ? value : '-'}</div>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </CardContent>
    </Card>
  );
};

export default CardStatistics;
