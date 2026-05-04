import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const StatisticsGraph = ({ data }: { data: any[] }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false} // Y축 세로선 제거
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Bar
            dataKey="groupCount"
            name="총 제보 수"
            fill="#D1D3D8"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
          <Bar
            dataKey="reportCount"
            name="발생 건수"
            fill="#D4182E"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
