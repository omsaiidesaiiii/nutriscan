'use client'

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line
} from 'recharts'

interface WeeklyChartProps {
  data: {
    date: string
    calories: number
    protein: number
  }[]
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
  }))

  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Weekly Overview</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Calories and protein over the last 7 days</p>
        </div>
        <div className="flex items-center space-x-5">
          <div className="flex items-center">
            <div className="h-1.5 w-4 rounded-full bg-emerald-500 mr-2" />
            <span className="text-xs text-zinc-400">Calories</span>
          </div>
          <div className="flex items-center">
            <div className="h-1.5 w-4 rounded-full bg-zinc-400 mr-2" />
            <span className="text-xs text-zinc-400">Protein</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f4f4f5" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #e4e4e7', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                fontSize: '13px'
              }}
              itemStyle={{ fontSize: '13px', fontWeight: '500' }}
              labelStyle={{ color: '#18181b', fontWeight: '600', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="calories" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCalories)" 
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
            />
            <Line 
              type="monotone" 
              dataKey="protein" 
              stroke="#a1a1aa" 
              strokeWidth={2} 
              dot={{ r: 4, fill: '#a1a1aa', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#71717a' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
