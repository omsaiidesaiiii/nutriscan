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
import { cn } from '@/lib/utils'

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
    <div className="premium-card p-10 bg-white border-emerald-100/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-emerald-950 tracking-tighter uppercase italic">Metabolic Velocity</h2>
          <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mt-1 px-1">Consumption Vector • Last 7 Cycles</p>
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="h-2 w-6 rounded-full bg-emerald-500 mr-2.5 shadow-lg shadow-emerald-500/20" />
            <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Fuel (kcal)</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-6 rounded-full bg-emerald-950 mr-2.5 shadow-lg shadow-emerald-950/20" />
            <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Build (g)</span>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f0fdf4" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#064e3b', fontSize: 10, fontWeight: 900, opacity: 0.3 }}
              dy={15}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#064e3b', fontSize: 10, fontWeight: 900, opacity: 0.3 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '24px', 
                border: '1px solid #ecfdf5', 
                boxShadow: '0 20px 25px -5px rgb(6 78 59 / 0.05)',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              labelStyle={{ color: '#064e3b', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}
            />
            <Area 
              type="monotone" 
              dataKey="calories" 
              stroke="#10b981" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorCalories)" 
              dot={{ r: 5, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#064e3b' }}
            />
            <Line 
              type="monotone" 
              dataKey="protein" 
              stroke="#064e3b" 
              strokeWidth={4} 
              dot={{ r: 5, fill: '#064e3b', strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
