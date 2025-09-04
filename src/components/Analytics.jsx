import React from 'react'
import { TrendingUp, Users, Database, Target } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Card from './ui/Card'
import MetricCard from './ui/MetricCard'

const Analytics = () => {
  const customerGrowthData = [
    { month: 'Jan', customers: 1200, newCustomers: 145 },
    { month: 'Feb', customers: 1350, newCustomers: 150 },
    { month: 'Mar', customers: 1480, newCustomers: 130 },
    { month: 'Apr', customers: 1650, newCustomers: 170 },
    { month: 'May', customers: 1820, newCustomers: 170 },
    { month: 'Jun', customers: 2010, newCustomers: 190 },
    { month: 'Jul', customers: 2200, newCustomers: 190 },
    { month: 'Aug', customers: 2380, newCustomers: 180 },
    { month: 'Sep', customers: 2550, newCustomers: 170 },
    { month: 'Oct', customers: 2720, newCustomers: 170 },
    { month: 'Nov', customers: 2890, newCustomers: 170 },
    { month: 'Dec', customers: 3050, newCustomers: 160 }
  ]

  const sourceDistribution = [
    { name: 'Website', value: 35, color: '#8b5cf6' },
    { name: 'Referral', value: 25, color: '#3b82f6' },
    { name: 'LinkedIn', value: 20, color: '#10b981' },
    { name: 'Email Campaign', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#ef4444' }
  ]

  const dataQualityMetrics = [
    { metric: 'Complete Profiles', value: 85, color: '#10b981' },
    { metric: 'Valid Emails', value: 92, color: '#3b82f6' },
    { metric: 'Valid Phone Numbers', value: 78, color: '#f59e0b' },
    { metric: 'Duplicate Rate', value: 3, color: '#ef4444' }
  ]

  const taskCompletionData = [
    { week: 'Week 1', completed: 45, created: 52 },
    { week: 'Week 2', completed: 38, created: 41 },
    { week: 'Week 3', completed: 42, created: 45 },
    { week: 'Week 4', completed: 51, created: 48 }
  ]

  const metrics = [
    {
      title: 'Total Customers',
      value: '3,050',
      change: '+5.2%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Data Quality Score',
      value: '87%',
      change: '+2.1%',
      icon: Database,
      trend: 'up'
    },
    {
      title: 'Task Completion Rate',
      value: '91%',
      change: '+4.3%',
      icon: Target,
      trend: 'up'
    },
    {
      title: 'Monthly Growth',
      value: '5.2%',
      change: '+0.8%',
      icon: TrendingUp,
      trend: 'up'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-white/70">Track your customer data pipeline performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
          <button className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Chart */}
        <Card title="Customer Growth Trend">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Source Distribution */}
        <Card title="Customer Source Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {sourceDistribution.map((source) => (
              <div key={source.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-sm text-gray-600">{source.name}</span>
                <span className="text-sm font-medium text-gray-900">{source.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Data Quality and Task Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Quality Metrics */}
        <Card title="Data Quality Metrics">
          <div className="space-y-4">
            {dataQualityMetrics.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{metric.metric}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${metric.value}%`,
                        backgroundColor: metric.color 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {metric.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Quality Improvement Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enable phone number validation rules</li>
              <li>• Set up automated duplicate detection</li>
              <li>• Require email verification for new imports</li>
            </ul>
          </div>
        </Card>

        {/* Task Completion Trends */}
        <Card title="Task Completion Trends">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="created" fill="#e5e7eb" name="Created" />
                <Bar dataKey="completed" fill="#8b5cf6" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-600">Tasks Created</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-sm text-gray-600">Tasks Completed</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <Card title="Insights & Recommendations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-medium text-green-900">Strong Growth</h4>
            </div>
            <p className="text-sm text-green-700">
              Customer acquisition is up 18% this quarter. LinkedIn is your fastest-growing channel.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-yellow-600" />
              </div>
              <h4 className="font-medium text-yellow-900">Data Quality Alert</h4>
            </div>
            <p className="text-sm text-yellow-700">
              22% of profiles are missing phone numbers. Consider making this field required.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-900">Task Efficiency</h4>
            </div>
            <p className="text-sm text-blue-700">
              Task completion rate improved 4.3% with automated assignments. Great progress!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Analytics