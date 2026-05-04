import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Rectangle,
} from 'recharts';

interface RecordGraphProps {
  approved: number;
  pending: number;
  //   suspicious: number;
}

export const RecordGraph = ({
  approved,
  pending,
  //   suspicious,
}: RecordGraphProps) => {
  const data = [
    { name: '검증', count: approved, color: '#3B82F6' },
    { name: '검증 안 됨', count: pending, color: '#327AFF' },
    // { name: '의심', count: suspicious, color: '#D4182E' },
  ];

  const CustomBar = (props: any) => {
    const { payload } = props;

    return <Rectangle {...props} fill={payload.color} radius={[0, 4, 4, 0]} />;
  };

  return (
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 20, right: 30 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={70}
            tick={{ fontSize: 12 }}
            tickLine={false} // Y축 눈금선 제거
            axisLine={false} // Y축 세로선 제거
          />

          <Bar dataKey="count" shape={<CustomBar />} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
