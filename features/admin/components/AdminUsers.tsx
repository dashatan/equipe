'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Users, Search, Mail, MapPin, Calendar, ArrowLeft, Trash2, ShieldCheck } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  location?: string
  provider: string
  isEmailVerified: boolean
  createdAt: string
}

export function AdminUsers() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) q.set('search', search)
      if (provider !== 'all') q.set('provider', provider)
      const res = await fetch(`/api/admin/users?${q.toString()}`)
      if (res.status === 403) { toast.error('Admin access required'); router.push('/feed'); return }
      const data = await res.json()
      setUsers(data.users ?? [])
      setTotalPages(data.pagination?.pages ?? 1)
    } catch {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [page, search, provider, router])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/'); return }
    const t = setTimeout(fetchUsers, 250)
    return () => clearTimeout(t)
  }, [isAuthenticated, isLoading, fetchUsers])

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed')
      }
      toast.success('User deleted')
      fetchUsers()
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to delete user')
    }
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <p className="text-muted-foreground">Manage users, view profiles, and handle accounts.</p>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Filters & Search</CardTitle><CardDescription>Find and filter users</CardDescription></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, email, or location..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-10" />
              </div>
              <Select value={provider} onValueChange={(v) => { setProvider(v); setPage(1) }}>
                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Provider" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Users ({users.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <div className="text-4xl mb-2">👤</div>No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead><TableHead>Provider</TableHead><TableHead>Location</TableHead>
                      <TableHead>Verified</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatar} alt={u.name} />
                              <AvatarFallback>{u.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{u.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{u.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{u.provider}</Badge></TableCell>
                        <TableCell><div className="flex items-center gap-1 text-sm"><MapPin className="h-3 w-3" />{u.location || '—'}</div></TableCell>
                        <TableCell>{u.isEmailVerified ? <ShieldCheck className="h-4 w-4 text-green-600" /> : <span className="text-muted-foreground text-xs">No</span>}</TableCell>
                        <TableCell><div className="flex items-center gap-1 text-sm"><Calendar className="h-3 w-3" />{fmt(u.createdAt)}</div></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleDelete(u.id)}><Trash2 className="h-3 w-3" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
                    <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
