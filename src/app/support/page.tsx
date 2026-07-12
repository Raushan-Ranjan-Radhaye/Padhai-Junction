
"use client"

import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import Image from "next/image"
import { RootState } from "@/redux/store"
import { IUser } from "@/model/user.model"

interface Message {
  _id?: string
  sender: string | { _id: string }
  text: string
  createdAt: string | Date
}

function SupportChats() {
  const { userData } = useSelector((state: RootState) => state.user)
  const [users, setUsers] = useState<IUser[]>([])
  const [activeUser, setActiveUser] = useState<IUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      setIsDesktop(width >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Reset mobile view when active user changes
  useEffect(() => {
    if (activeUser && isMobile) {
      setShowMobileChat(true)
    } else if (!activeUser) {
      setShowMobileChat(false)
    }
  }, [activeUser, isMobile])

  // Fetch chat users on mount
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const result = await axios.get("/api/support/active-users")
        
        if (result.data && Array.isArray(result.data.users)) {
          setUsers(result.data.users)
        } else if (result.data && Array.isArray(result.data)) {
          setUsers(result.data)
        } else {
          setUsers([])
        }
      } catch (error) {
        console.error("Error fetching chat users:", error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchChatUsers()
  }, [])

  // Fetch messages when active user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeUser?._id) return
      
      try {
        const result = await axios.get(`/api/support/get?with=${activeUser._id}`)
        setMessages(result.data || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
        setMessages([])
      }
    }
    
    fetchMessages()
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [activeUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch AI suggestions when there's a new message from the other user
  const fetchSuggestions = async () => {
    if (!activeUser || messages.length === 0 || !userData) {
      console.log('fetchSuggestions: Missing required data', { activeUser, messagesLength: messages.length, userData })
      return
    }
    
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || !lastMessage.text) {
      console.log('fetchSuggestions: No valid last message', { lastMessage })
      return
    }
    
    // Check if last message is from the other person
    const lastSenderId = typeof lastMessage.sender === 'object' ? lastMessage.sender._id : lastMessage.sender
    const isMyMsg = String(lastSenderId) === String(userData._id)
    
    console.log('fetchSuggestions: Message check', { 
      lastSenderId, 
      userDataId: userData._id, 
      isMyMsg, 
      messageText: lastMessage.text 
    })
    
    // Only fetch if it's NOT our message
    if (isMyMsg) {
      console.log('fetchSuggestions: Skipping - message is from current user')
      return
    }
    
    const currentRole = userData.role || 'user'
    const targetRole = activeUser.role || 'user'
    
    console.log('fetchSuggestions: Making API call', { currentRole, targetRole, message: lastMessage.text })
    
    try {
      setLoadingSuggestions(true)
      const res = await fetch('/api/support/aisuggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: lastMessage.text,
          role: currentRole,
          targetRole: targetRole
        })
      })
      
      console.log('fetchSuggestions: API response status', res.status)
      
      const data = await res.json()
      console.log('fetchSuggestions: API response data', data)
      
      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        console.log('fetchSuggestions: Setting suggestions', data.suggestions)
        setSuggestions(data.suggestions)
      } else {
        console.log('fetchSuggestions: No valid suggestions in response')
        setSuggestions([])
      }
    } catch (err) {
      console.error('Suggestion error:', err)
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }
  
  // Fetch suggestions when messages change
  useEffect(() => {
    if (messages.length > 0 && activeUser && userData) {
      fetchSuggestions()
    }
  }, [messages.length, activeUser, userData])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeUser?._id || sending) return

    setSending(true)
    try {
      await axios.post("/api/support/send", {
        receiverId: activeUser._id,
        text: newMessage.trim()
      })
      
      // Refresh messages after sending
      const result = await axios.get(`/api/support/get?with=${activeUser._id}`)
      setMessages(result.data || [])
      setNewMessage("")
      setSuggestions([])
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const sendQuickReply = async (text: string) => {
    if (!activeUser?._id || sending) return
    
    setSending(true)
    try {
      await axios.post("/api/support/send", {
        receiverId: activeUser._id,
        text: text
      })
      
      // Refresh messages after sending
      const result = await axios.get(`/api/support/get?with=${activeUser._id}`)
      setMessages(result.data || [])
      setSuggestions([])
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isMyMessage = (msg: Message) => {
    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender
    return String(senderId) === String(userData?._id)
  }

  const handleUserSelect = (user: IUser) => {
    setActiveUser(user)
    setSuggestions([])
    // On mobile, show chat view
    if (isMobile) {
      setShowMobileChat(true)
    }
  }

  const handleBackToUsers = () => {
    setShowMobileChat(false)
    setActiveUser(null)
    setMessages([])
    setSuggestions([])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center bg-black justify-center text-white p-4">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto h-[95vh] sm:h-[90vh]">
        {/* Mobile Header */}
        <div className="lg:hidden mb-3">
          <h1 className="text-white text-lg sm:text-xl font-semibold px-1">Support Chats</h1>
        </div>

        <div className="h-full flex flex-col lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Users List - Desktop: Always visible | Mobile: Only when not in chat */}
          <div className={`
            ${showMobileChat && !isDesktop ? 'hidden' : 'flex'}
            lg:flex
            flex-col
            bg-black/50 border border-white/10 rounded-2xl p-3 sm:p-4 overflow-hidden
          `}>
            <h2 className="text-white font-semibold mb-3 text-base sm:text-lg hidden lg:block">Support Chats</h2>

            <p className="text-xs text-yellow-400 mt-0 lg:mt-1 leading-relaxed">
              {userData?.role === "user" && (
                <span className="block">
                  Note: The vendor response may take 1-2 hours.
                </span>
              )}
              {userData?.role === "vendor" && (
                <span className="block">
                  Note: The admin response may take 1-2 hours.
                </span>
              )}
            </p>

            <div className="flex-1 overflow-y-auto mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {users.length === 0 ? (
                <p className="text-white/50 mt-4 text-sm">No active support users</p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {users.map((u) => (
                    <div
                      onClick={() => handleUserSelect(u)}
                      key={String(u._id)}
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl cursor-pointer transition ${
                        activeUser?._id === u._id
                          ? "bg-blue-600/20 border border-blue-500/50 shadow-lg"
                          : "bg-black/20 border border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                        {u.image ? (
                          <Image
                            src={u.image}
                            alt={u.name || "User"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-sm sm:text-lg font-semibold">
                            {u.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm sm:text-base truncate">
                          {u.name || "Unknown User"}
                        </p>
                        <p className="text-white/50 text-xs sm:text-sm truncate">
                          {u.role === "vendor" ? u.shopName : u.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area - Desktop: col-span-2 | Mobile: Only when in chat */}
          <div className={`
            ${showMobileChat || isDesktop ? 'flex' : 'hidden'}
            lg:flex
            flex-col
            bg-black/50 border border-white/10 rounded-2xl p-3 sm:p-4 col-span-2
          `}>
            {activeUser ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-white/10 pb-3 sm:pb-4 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  {/* Back Button for Mobile */}
                  <button 
                    onClick={handleBackToUsers}
                    className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white transition"
                    aria-label="Back to users"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                    {activeUser.image ? (
                      <Image
                        src={activeUser.image}
                        alt={activeUser.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-sm sm:text-base">
                        {activeUser.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                      {activeUser.name}
                    </h3>
                    <p className="text-white/50 text-xs sm:text-sm truncate">
                      {activeUser.role === "vendor" ? activeUser.shopName : activeUser.email}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 mb-3 sm:mb-4 px-1 sm:px-2">
                  {messages.length === 0 ? (
                    <div className="text-center text-white/30 py-8 text-sm">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={msg._id || index}
                        className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[70%] p-2.5 sm:p-3 rounded-2xl ${
                            isMyMessage(msg)
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-gray-700 text-white rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.text}</p>
                          <p className={`text-[10px] sm:text-xs mt-1 ${
                            isMyMessage(msg) ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* AI Suggestions */}
                {(suggestions.length > 0 || loadingSuggestions) && (
                  <div className="mb-3 px-1 sm:px-2">
                    <p className="text-xs text-purple-400 mb-2">
                      {loadingSuggestions ? "AI is thinking..." : "Quick replies:"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {loadingSuggestions ? (
                        <div className="text-xs text-purple-400 animate-pulse">Loading...</div>
                      ) : (
                        suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => sendQuickReply(suggestion)}
                            disabled={sending}
                            className="text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 px-2.5 sm:px-3 py-1.5 rounded-full border border-purple-500/30 transition disabled:opacity-50"
                          >
                            {suggestion}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition text-sm sm:text-base"
                  >
                    {sending ? "..." : "Send"}
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-white/30 text-sm sm:text-base p-4 text-center">
                Select a user to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportChats

