'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, UserCheck, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAllocations } from '@/hooks/useAllocations';
import { useUsers } from '@/hooks/useUsers';

interface AllocationStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export default function SupervisorDashboard() {
  const { state: allocationsState } = useAllocations();
  const { state: usersState } = useUsers();

  const [stats, setStats] = useState<AllocationStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    if (allocationsState.allocations.length > 0) {
      const now = new Date();
      const total = allocationsState.allocations.length;
      const pending = allocationsState.allocations.filter(a => a.status === 'PENDING').length;
      const inProgress = allocationsState.allocations.filter(a => a.status === 'IN_PROGRESS').length;
      const completed = allocationsState.allocations.filter(a => a.status === 'COMPLETED').length;
      const overdue = allocationsState.allocations.filter(a =>
        a.dueDate && new Date(a.dueDate) < now && a.status !== 'COMPLETED'
      ).length;

      setStats({ total, pending, inProgress, completed, overdue });
    }
  }, [allocationsState.allocations]);

  const statCards = [
    {
      title: 'Total Allocations',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'All assignments',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Awaiting assignment',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: UserCheck,
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

  const recentAllocations = allocationsState.allocations.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage task allocations and monitor progress</p>
        </div>
        <Link
          href="/supervisor/allocations/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Allocation</span>
        </Link>
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
                You have {stats.overdue} overdue task{stats.overdue !== 1 ? 's' : ''} that need attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Allocations</h2>
            <p className="text-gray-600 mt-1">Latest task assignments</p>
          </div>
          <div className="p-6">
            {recentAllocations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No allocations yet</p>
            ) : (
              <div className="space-y-4">
                {recentAllocations.map((allocation) => (
                  <div key={allocation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{allocation.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{allocation.description}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          Assigned to: {usersState.users.find(u => u.id === allocation.assignedTo)?.name || 'Unknown'}
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600 mt-1">Common supervisor tasks</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                href="/supervisor/allocations/new"
                className="block p-3 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg font-medium"
              >
                Create New Allocation
              </Link>
              <Link
                href="/supervisor/allocations"
                className="block p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium"
              >
                View All Allocations
              </Link>
              <Link
                href="/supervisor/students"
                className="block p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium"
              >
                Manage Students
              </Link>
              <Link
                href="/supervisor/reports"
                className="block p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium"
              >
                Generate Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
