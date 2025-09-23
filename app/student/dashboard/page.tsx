'use client';

import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useAllocations } from '@/hooks/useAllocations';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';

interface StudentAllocationStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export default function StudentDashboard() {
  const { state: allocationsState } = useAllocations();
  const { user } = useAuth();
  const { state: usersState } = useUsers();

  const [stats, setStats] = useState<StudentAllocationStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    if (allocationsState.allocations.length > 0 && user) {
      const userAllocations = allocationsState.allocations.filter(a => a.assignedTo === user.id);
      const now = new Date();

      const total = userAllocations.length;
      const pending = userAllocations.filter(a => a.status === 'PENDING').length;
      const inProgress = userAllocations.filter(a => a.status === 'IN_PROGRESS').length;
      const completed = userAllocations.filter(a => a.status === 'COMPLETED').length;
      const overdue = userAllocations.filter(a =>
        a.dueDate && new Date(a.dueDate) < now && a.status !== 'COMPLETED'
      ).length;

      setStats({ total, pending, inProgress, completed, overdue });
    }
  }, [allocationsState.allocations, user]);

  const userAllocations = user ? allocationsState.allocations.filter(a => a.assignedTo === user.id) : [];

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'All assigned tasks',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Awaiting your action',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: FileText,
      color: 'bg-purple-500',
      description: 'Currently working',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Finished tasks',
    },
  ];

  const upcomingAllocations = userAllocations
    .filter(a => a.dueDate && a.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">View your assigned tasks and track your progress</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overdue Tasks Alert */}
      {stats.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Overdue Tasks</h3>
              <p className="text-red-700 mt-1">
                You have {stats.overdue} overdue task{stats.overdue !== 1 ? 's' : ''} that need immediate attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Recent Tasks</h2>
            <p className="text-gray-600 mt-1">Your latest assignments</p>
          </div>
          <div className="p-6">
            {userAllocations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks assigned yet</p>
            ) : (
              <div className="space-y-4">
                {userAllocations.slice(0, 5).map((allocation) => {
                  const supervisor = usersState.users.find(u => u.id === allocation.assignedBy);
                  return (
                    <div key={allocation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{allocation.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{allocation.description}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            Assigned by: {supervisor?.name || 'Unknown Supervisor'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            allocation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            allocation.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            allocation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {allocation.status}
                          </span>
                          <p className="text-gray-500 text-xs mt-1">
                            Priority: {allocation.priority}
                          </p>
                        </div>
                      </div>
                      {allocation.dueDate && (
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {new Date(allocation.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
            <p className="text-gray-600 mt-1">Tasks due soon</p>
          </div>
          <div className="p-6">
            {upcomingAllocations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
            ) : (
              <div className="space-y-4">
                {upcomingAllocations.map((allocation) => (
                  <div key={allocation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{allocation.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{allocation.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          allocation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          allocation.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          allocation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {allocation.status}
                        </span>
                        {allocation.dueDate && (
                          <p className="text-gray-500 text-xs mt-1">
                            {Math.ceil((new Date(allocation.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Progress Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <p className="text-gray-600 mt-2">Completion Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
            <p className="text-gray-600 mt-2">Active Tasks</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-gray-600 mt-2">Pending Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
