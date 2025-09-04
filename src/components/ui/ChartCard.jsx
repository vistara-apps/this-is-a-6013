import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from './Card'

const ChartCard = () => {
  const data = [
    { name: 'Jan', customers: 240, revenue: 4200 },
    { name: 'Feb', customers: 398, revenue: 6800 },
    { name: 'Mar', customers: 320, revenue: 5400 },
    { name: 'Apr', customers: 478, revenue: 8100 },
    { name: 'May', customers: 520, revenue: 8900 },
    { name: 'Jun', customers: 650, revenue: 11200 },
    { name: 'Jul', customers: 720, revenue: 12800 },
  ]

  return (
    <Card title="Customer Growth & Revenue">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default ChartCard