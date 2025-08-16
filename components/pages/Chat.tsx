import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Plus,
  Users,
  MessageCircle
} from 'lucide-react'

const mockChats = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    lastMessage: "That sounds amazing! When are you free?",
    time: "2m ago",
    unread: 2,
    isGroup: false,
    online: true
  },
  {
    id: 2,
    name: "Photography Enthusiasts",
    avatar: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop",
    lastMessage: "Alex: Check out this sunset shot!",
    time: "5m ago",
    unread: 0,
    isGroup: true,
    members: 12
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: "Great meeting you at the event!",
    time: "1h ago",
    unread: 0,
    isGroup: false,
    online: false
  },
  {
    id: 4,
    name: "Book Club",
    avatar: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop",
    lastMessage: "Emma: What did everyone think of chapter 5?",
    time: "2h ago",
    unread: 1,
    isGroup: true,
    members: 8
  }
]

const mockMessages = [
  {
    id: 1,
    senderId: 2,
    senderName: "Sarah Chen",
    content: "Hey! I saw your profile and noticed we both love hiking. Have you been to Mount Wilson recently?",
    time: "10:30 AM",
    isOwn: false
  },
  {
    id: 2,
    senderId: 1,
    senderName: "You",
    content: "Hi Sarah! Yes, I was there last weekend. The views were incredible! Are you planning a trip?",
    time: "10:35 AM",
    isOwn: true
  },
  {
    id: 3,
    senderId: 2,
    senderName: "Sarah Chen",
    content: "That sounds amazing! When are you free?",
    time: "10:36 AM",
    isOwn: false
  }
]

export function Chat() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0])
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex">
      {/* Chat List */}
      <div className="w-full lg:w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button size="icon" variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat.id === chat.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-accent'
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>{chat.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {!chat.isGroup && chat.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                  {chat.isGroup && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      <Users className="h-3 w-3" />
                    </div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                  {chat.isGroup && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {chat.members} members
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="hidden lg:flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                <AvatarFallback>{selectedChat.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedChat.isGroup 
                    ? `${selectedChat.members} members` 
                    : selectedChat.online ? 'Online' : 'Last seen 2h ago'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost">
                <Phone className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Video className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-1' : 'order-2'}`}>
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8 mb-2">
                      <AvatarImage src={selectedChat.avatar} alt={msg.senderName} />
                      <AvatarFallback>{msg.senderName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      msg.isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile: Show message when no chat selected */}
      <div className="lg:hidden flex-1 flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </div>
      </div>
    </div>
  )
}