import React, { useState } from 'react'
import { Plus, Calendar, User, Flag, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Card from './ui/Card'

const Tasks = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const tasks = [
    {
      id: 1,
      title: 'Follow up with lead from product demo',
      customer: 'Acme Corporation',
      assignedTo: 'John Doe',
      dueDate: '2023-12-18',
      priority: 'high',
      status: 'open',
      description: 'Customer showed strong interest in enterprise features during demo',
      createdAt: '2023-12-15',
      source: 'Demo completion trigger'
    },
    {
      id: 2,
      title: 'Send welcome email and onboarding guide',
      customer: 'TechStart Inc',
      assignedTo: 'Sarah Johnson',
      dueDate: '2023-12-19',
      priority: 'medium',
      status: 'open',
      description: 'New customer signup - trigger welcome sequence',
      createdAt: '2023-12-16',
      source: 'New signup trigger'
    },
    {
      id: 3,
      title: 'Review and merge duplicate customer records',
      customer: 'Multiple customers',
      assignedTo: 'Mike Davis',
      dueDate: '2023-12-20',
      priority: 'low',
      status: 'open',
      description: '15 potential duplicate records detected in latest import',
      createdAt: '2023-12-16',
      source: 'Data cleaning trigger'
    },
    {
      id: 4,
      title: 'Customer inactivity check-in call',
      customer: 'Global Solutions Ltd',
      assignedTo: 'Emily Chen',
      dueDate: '2023-12-17',
      priority: 'medium',
      status: 'completed',
      description: 'No activity for 30 days - reach out to ensure satisfaction',
      createdAt: '2023-12-10',
      source: 'Inactivity trigger'
    },
    {
      id: 5,
      title: 'Upsell conversation - premium features',
      customer: 'Design Studio Pro',
      assignedTo: 'John Doe',
      dueDate: '2023-12-21',
      priority: 'high',
      status: 'in_progress',
      description: 'Customer has been using free tier for 3 months, high engagement',
      createdAt: '2023-12-14',
      source: 'Usage pattern trigger'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'open', label: 'Open', count: tasks.filter(t => t.status === 'open').length },
    { id: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
    { id: 'overdue', label: 'Overdue', count: 2 }
  ]

  const filteredTasks = selectedFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === selectedFilter)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />
      case 'open': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-white/70">Automatically generated follow-up tasks based on customer data</p>
        </div>
        <button className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Task Filters */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-600">Total Active Tasks</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">5</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-gray-600">Due Today</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </Card>
      </div>

      {/* Task List */}
      <Card title="Task List">
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(task.status)}
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{task.customer}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {task.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flag className="w-4 h-4" />
                      <span>Created by: {task.source}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    Edit
                  </button>
                  {task.status !== 'completed' && (
                    <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Task Automation Rules */}
      <Card title="Automation Rules">
        <div className="space-y-4">
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">New Lead Follow-up</h4>
                <p className="text-sm text-green-700">
                  Automatically create follow-up task when demo is completed
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                <button className="text-green-600 hover:text-green-700">Edit</button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Customer Inactivity</h4>
                <p className="text-sm text-blue-700">
                  Create check-in task when customer is inactive for 30+ days
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>
                <button className="text-blue-600 hover:text-blue-700">Edit</button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-yellow-900">Duplicate Records Detected</h4>
                <p className="text-sm text-yellow-700">
                  Create review task when duplicate records are found during import
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Active</span>
                <button className="text-yellow-600 hover:text-yellow-700">Edit</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Add New Rule
          </button>
        </div>
      </Card>
    </div>
  )
}

export default Tasks