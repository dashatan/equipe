'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { 
  Users, 
  Search, 
  Filter,
  MoreHorizontal,
  Shield,
  Mail,
  MapPin,
  Calendar,
  ArrowLeft
} from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  location?: string
  provider: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
  groupsCount?: number
  activitiesCount?: number
}

export function AdminUsers() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [providerFilter, setProviderFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
      return
    }

    fetchUsers()
  }, [isAuthenticated, isLoading, currentPage, searchTerm, providerFilter])

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      
      // Mock data for demo
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          location: 'New York, NY',
          provider: 'email',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-01-20T14:20:00Z',
          groupsCount: 3,
          activitiesCount: 8
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5db?w=32&h=32&fit=crop&crop=face',
          location: 'San Francisco, CA',
          provider: 'google',
          isActive: true,
          createdAt: '2024-01-10T09:15:00Z',
          lastLogin: '2024-01-19T16:45:00Z',
          groupsCount: 5,
          activitiesCount: 12
        },
        {
          _id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          location: 'Austin, TX',
          provider: 'email',
          isActive: false,
          createdAt: '2024-01-05T11:20:00Z',
          lastLogin: '2024-01-18T12:30:00Z',
          groupsCount: 1,
          activitiesCount: 2
        },
        {
          _id: 'demo-user-id',
          name: 'Demo User',
          email: 'demo@test.com',
          location: 'Demo City',
          provider: 'demo',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          groupsCount: 0,
          activitiesCount: 0
        }
      ]
      
      // Filter users based on search and provider
      let filteredUsers = mockUsers
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(u => 
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (providerFilter !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.provider === providerFilter)
      }
      
      setUsers(filteredUsers)
      setTotalPages(Math.ceil(filteredUsers.length / 10))
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleUserToggle = async (userId: string, isActive: boolean) => {
    try {
      // Mock API call
      const updatedUsers = users.map(u => 
        u._id === userId ? { ...u, isActive: !isActive } : u
      )
      setUsers(updatedUsers)
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage users, view profiles, and handle user reports.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>
              Find and filter users by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>
              All registered users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {user.location || 'Not set'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.groupsCount || 0} groups</div>
                            <div className="text-muted-foreground">
                              {user.activitiesCount || 0} activities
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserToggle(user._id, user.isActive)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}