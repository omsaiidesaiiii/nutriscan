'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

interface WeeklyChartProps {
  data: {
    date: string
    calories: number
    protein: number
  }[]
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  // Format dates for display
  const chartData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }))

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Progress</h2>
          <p className="text-sm text-gray-400 font-medium">Last 7 days of consumption</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-indigo-600 mr-2" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Calories</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-purple-400 mr-2" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Protein</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="calories" 
              stroke="#4f46e5" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCalories)" 
              dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="protein" 
              stroke="#c084fc" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#c084fc', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
