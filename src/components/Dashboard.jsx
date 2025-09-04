import React from 'react'
import { Users, Upload, CheckSquare, TrendingUp, DollarSign, Activity } from 'lucide-react'
import Card from './ui/Card'
import MetricCard from './ui/MetricCard'
import ChartCard from './ui/ChartCard'

const Dashboard = () => {
  const metrics = [
    {
      title: 'Total Customers',
      value: '2,847',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Data Sources',
      value: '8',
      change: '+2',
      icon: Upload,
      trend: 'up'
    },
    {
      title: 'Active Tasks',
      value: '23',
      change: '-3',
      icon: CheckSquare,
      trend: 'down'
    },
    {
      title: 'Revenue',
      value: '$45,230',
      change: '+18%',
      icon: DollarSign,
      trend: 'up'
    }
  ]

  const recentActivity = [
    { action: 'Data import completed', source: 'customers.csv', time: '2 min ago', status: 'success' },
    { action: 'New customer profile created', source: 'API Integration', time: '5 min ago', status: 'success' },
    { action: 'Duplicate records detected', source: 'leads.csv', time: '10 min ago', status: 'warning' },
    { action: 'Task assigned', source: 'Follow-up: ABC Corp', time: '15 min ago', status: 'info' },
    { action: 'Data cleaning completed', source: 'contacts.csv', time: '20 min ago', status: 'success' }
  ]

  const upcomingTasks = [
    { title: 'Follow up with lead from demo', customer: 'Acme Corp', due: 'Today, 2:00 PM', priority: 'high' },
    { title: 'Send welcome email', customer: 'TechStart Inc', due: 'Tomorrow, 9:00 AM', priority: 'medium' },
    { title: 'Review duplicate records', customer: 'Multiple', due: 'Dec 20, 10:00 AM', priority: 'low' },
    { title: 'Update customer profile', customer: 'Global Solutions', due: 'Dec 21, 3:00 PM', priority: 'medium' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/70">Welcome back! Here's what's happening with your customer data.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
            Export Report
          </button>
          <button className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Import Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard />
        </div>
        
        <Card title="Recent Activity" className="max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-400' :
                  activity.status === 'warning' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.source}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card title="Upcoming Tasks" className="mb-6">
        <div className="space-y-4">
          {upcomingTasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  task.priority === 'high' ? 'bg-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.customer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{task.due}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard