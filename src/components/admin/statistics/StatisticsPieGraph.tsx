import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

export const StatisticsPieGraph = ({ data }: { data: any[] }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value" // 숫자가 들어갈 키
            nameKey="name" // 라벨이 들어갈 키
            cx="50%" // 차트 중심 X축
            cy="50%" // 차트 중심 Y축
            outerRadius={80} // 차트 크기
            label={({ name, percent }) =>
              `${name} ${(percent ?? 0 * 100).toFixed(0)}%`
            }
            isAnimationActive={true}
          >
            {/* <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                // boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            /> */}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
