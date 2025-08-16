'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { toast } from 'sonner'
import { 
  FileText, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  User
} from 'lucide-react'

interface Content {
  _id: string
  type: 'page' | 'post' | 'announcement' | 'category' | 'landing_section' | 'faq' | 'legal'
  title: string
  slug: string
  content: string
  excerpt?: string
  status: 'draft' | 'published' | 'archived'
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export function AdminContent() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [isLoadingContents, setIsLoadingContents] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [formData, setFormData] = useState({
    type: 'page' as Content['type'],
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as Content['status'],
    tags: ''
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
      return
    }

    fetchContents()
  }, [isAuthenticated, isLoading, searchTerm, typeFilter, statusFilter])

  const fetchContents = async () => {
    try {
      setIsLoadingContents(true)
      
      // Mock data for demo
      const mockContents: Content[] = [
        {
          _id: '1',
          type: 'page',
          title: 'About Us',
          slug: 'about-us',
          content: 'GroupFinder is a community-driven platform that helps people connect through shared activities and interests.',
          excerpt: 'Learn more about GroupFinder and our mission.',
          status: 'published',
          author: { name: 'Admin User' },
          tags: ['info', 'company'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-16T14:20:00Z',
          publishedAt: '2024-01-16T14:20:00Z'
        },
        {
          _id: '2',
          type: 'announcement',
          title: 'New Features Coming Soon',
          slug: 'new-features-announcement',
          content: 'We are excited to announce new features including video chat, event planning tools, and enhanced group discovery.',
          excerpt: 'Exciting updates coming to GroupFinder!',
          status: 'published',
          author: { name: 'Product Team' },
          tags: ['announcement', 'features'],
          createdAt: '2024-01-20T09:15:00Z',
          updatedAt: '2024-01-20T09:15:00Z',
          publishedAt: '2024-01-20T09:15:00Z'
        },
        {
          _id: '3',
          type: 'faq',
          title: 'How to Create a Group',
          slug: 'how-to-create-group',
          content: 'Step-by-step guide on creating and managing groups on GroupFinder.',
          status: 'draft',
          author: { name: 'Support Team' },
          tags: ['help', 'groups'],
          createdAt: '2024-01-18T11:20:00Z',
          updatedAt: '2024-01-19T16:45:00Z'
        },
        {
          _id: '4',
          type: 'legal',
          title: 'Privacy Policy',
          slug: 'privacy-policy',
          content: 'Our commitment to protecting your privacy and how we handle your data.',
          status: 'published',
          author: { name: 'Legal Team' },
          tags: ['legal', 'privacy'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-10T12:30:00Z',
          publishedAt: '2024-01-10T12:30:00Z'
        }
      ]
      
      // Filter contents
      let filteredContents = mockContents
      
      if (searchTerm) {
        filteredContents = filteredContents.filter(c => 
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }
      
      if (typeFilter !== 'all') {
        filteredContents = filteredContents.filter(c => c.type === typeFilter)
      }
      
      if (statusFilter !== 'all') {
        filteredContents = filteredContents.filter(c => c.status === statusFilter)
      }
      
      setContents(filteredContents)
    } catch (error) {
      console.error('Error fetching contents:', error)
      toast.error('Failed to fetch contents')
    } finally {
      setIsLoadingContents(false)
    }
  }

  const handleCreate = async () => {
    try {
      // Mock API call
      const newContent: Content = {
        _id: Date.now().toString(),
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        author: { name: user?.name || 'Admin' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined
      }
      
      setContents([newContent, ...contents])
      setIsCreateDialogOpen(false)
      setFormData({
        type: 'page',
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        status: 'draft',
        tags: ''
      })
      toast.success('Content created successfully')
    } catch (error) {
      console.error('Error creating content:', error)
      toast.error('Failed to create content')
    }
  }

  const handleEdit = (content: Content) => {
    setSelectedContent(content)
    setFormData({
      type: content.type,
      title: content.title,
      slug: content.slug,
      content: content.content,
      excerpt: content.excerpt || '',
      status: content.status,
      tags: content.tags.join(', ')
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedContent) return
    
    try {
      // Mock API call
      const updatedContent = {
        ...selectedContent,
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
        publishedAt: formData.status === 'published' && selectedContent.status !== 'published' 
          ? new Date().toISOString() 
          : selectedContent.publishedAt
      }
      
      setContents(contents.map(c => c._id === selectedContent._id ? updatedContent : c))
      setIsEditDialogOpen(false)
      setSelectedContent(null)
      toast.success('Content updated successfully')
    } catch (error) {
      console.error('Error updating content:', error)
      toast.error('Failed to update content')
    }
  }

  const handleDelete = async (contentId: string) => {
    try {
      setContents(contents.filter(c => c._id !== contentId))
      toast.success('Content deleted successfully')
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Failed to delete content')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
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
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Content Management</h1>
              </div>
              <p className="text-muted-foreground">
                Create and manage pages, posts, announcements, and other content.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Content</DialogTitle>
                  <DialogDescription>
                    Create a new page, post, or other content type.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value: Content['type']) => 
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="page">Page</SelectItem>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="faq">FAQ</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: Content['status']) => 
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setFormData({ 
                          ...formData, 
                          title,
                          slug: formData.slug || generateSlug(title)
                        })
                      }}
                      placeholder="Enter content title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => 
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="url-friendly-slug"
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => 
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="Brief description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => 
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Enter your content here"
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => 
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreate}>Create Content</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Table */}
        <Card>
          <CardHeader>
            <CardTitle>Content ({contents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingContents ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contents.map((content) => (
                      <TableRow key={content._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{content.title}</div>
                            <div className="text-sm text-muted-foreground">
                              /{content.slug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {content.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              content.status === 'published' ? 'default' : 
                              content.status === 'draft' ? 'secondary' : 'outline'
                            }
                          >
                            {content.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3" />
                            {content.author.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(content.updatedAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(content)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(content._id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
              <DialogDescription>
                Make changes to your content.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: Content['type']) => 
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page">Page</SelectItem>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: Content['status']) => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => 
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => 
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  value={formData.excerpt}
                  onChange={(e) => 
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => 
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => 
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Update Content</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}