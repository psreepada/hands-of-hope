"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles,
  Minimize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateAIResponse } from "@/lib/gemini-ai"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant for Hands of Hope. How can I help you today? I can answer questions about our organization, branches, volunteering opportunities, donations, and more!",
      sender: "bot",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Auto-resize textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }

    try {
      // Use Gemini AI to generate response
      const botResponse = await generateAIResponse(inputValue.trim())
      // Filter out asterisks from the response
      const filteredResponse = botResponse.replace(/\*/g, '')
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: filteredResponse,
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error("Error generating AI response:", error)
      // Fallback response if AI fails
      const fallbackResponse = "I'm having trouble connecting right now, but I can still help with basic information about Hands of Hope. What would you like to know?"
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-16 w-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
            "text-white border-2 border-white relative overflow-hidden",
            "animate-float animate-glow",
            isOpen && "scale-0 opacity-0"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20"></div>
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-in-bottom">
          <Card className="w-80 h-[600px] shadow-2xl border-2 border-teal-200 bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/20 rounded-full animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    AI Assistant
                  </CardTitle>
                  <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20 transition-colors"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 h-full flex flex-col">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "bot" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shadow-sm">
                          <Bot className="h-4 w-4 text-teal-600" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm break-words",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        )}
                      >
                        {message.content}
                      </div>
                      
                      {message.sender === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-2 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shadow-sm">
                        <Bot className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2 text-sm border border-gray-200">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
                <div className="flex gap-2 items-end">
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none min-h-[40px] max-h-[120px]"
                    disabled={isTyping}
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white transition-all duration-200 disabled:opacity-50 h-[40px] px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
} 