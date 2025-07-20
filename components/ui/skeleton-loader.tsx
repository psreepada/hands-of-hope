import React from 'react'

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded-md w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-48 mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events Card Skeleton */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b">
              <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 bg-gray-50">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-24 mt-4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Card Skeleton */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b">
              <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
            </div>
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AdminSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded-md w-72 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-56 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded-md w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Tables Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((tableIndex) => (
            <div key={tableIndex} className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((rowIndex) => (
                    <div key={rowIndex} className="flex items-center space-x-4 p-4 border rounded">
                      <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const SuperAdminSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded-md w-80 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded-md w-36 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Organization Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Branch Management & Users Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((cardIndex) => (
            <div key={cardIndex} className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b">
                <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((itemIndex) => (
                    <div key={itemIndex} className="p-4 border rounded-lg">
                      <div className="h-5 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 