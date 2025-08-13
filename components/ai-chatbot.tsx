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
  Minimize2,
  ChevronDown
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
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle body scroll lock for mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current && !isMobile) {
      inputRef.current.focus()
    }
  }, [isOpen, isMobile])

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
      <div className={cn(
        "fixed z-50 transition-all duration-300",
        isMobile ? "bottom-4 right-4" : "bottom-6 right-6"
      )}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
            "text-white border-2 border-white relative overflow-hidden",
            "animate-float animate-glow",
            isMobile ? "h-14 w-14" : "h-16 w-16",
            isOpen && isMobile ? "scale-0 opacity-0" : isOpen && "scale-0 opacity-0"
          )}
        >
          {isOpen ? (
            <X className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
          ) : (
            <>
              <MessageCircle className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20"></div>
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className={cn(
          "fixed z-50",
          isMobile 
            ? "inset-0 bg-black/50 backdrop-blur-sm animate-slide-in-bottom" 
            : "bottom-24 right-6 animate-slide-in-bottom"
        )}>
          {isMobile && (
            <div 
              className="absolute inset-0" 
              onClick={() => setIsOpen(false)}
            />
          )}
          
          <Card className={cn(
            "shadow-2xl border-2 border-teal-200 bg-white backdrop-blur-sm",
            isMobile 
              ? "absolute bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl rounded-b-none animate-slide-up-mobile"
              : "w-80 h-[600px] relative"
          )}>
            <CardHeader className={cn(
              "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
              isMobile ? "pb-3 pt-6 rounded-t-3xl" : "pb-3"
            )}>
              {isMobile && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/20 rounded-full animate-pulse">
                    <Bot className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
                  </div>
                  <CardTitle className={cn(
                    "font-semibold",
                    isMobile ? "text-lg" : "text-sm"
                  )}>
                    AI Assistant
                  </CardTitle>
                  <Sparkles className={cn(
                    "text-yellow-300 animate-pulse",
                    isMobile ? "h-4 w-4" : "h-3 w-3"
                  )} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "p-0 text-white hover:bg-white/20 transition-colors",
                    isMobile ? "h-8 w-8" : "h-6 w-6"
                  )}
                >
                  {isMobile ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 h-full flex flex-col">
              {/* Messages Area */}
              <ScrollArea className={cn(
                "flex-1",
                isMobile ? "p-4 pb-2" : "p-4"
              )}>
                <div className={cn(
                  "space-y-4",
                  isMobile && "pb-safe"
                )}>
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2 animate-message-slide-in",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "bot" && (
                        <div className={cn(
                          "flex-shrink-0 bg-teal-100 rounded-full flex items-center justify-center shadow-sm",
                          isMobile ? "w-10 h-10" : "w-8 h-8"
                        )}>
                          <Bot className={cn(
                            "text-teal-600",
                            isMobile ? "h-5 w-5" : "h-4 w-4"
                          )} />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 shadow-sm break-words leading-relaxed",
                          isMobile ? "max-w-[85%] text-base" : "max-w-[80%] text-sm",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        )}
                      >
                        {message.content}
                      </div>
                      
                      {message.sender === "user" && (
                        <div className={cn(
                          "flex-shrink-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm",
                          isMobile ? "w-10 h-10" : "w-8 h-8"
                        )}>
                          <User className={cn(
                            "text-white",
                            isMobile ? "h-5 w-5" : "h-4 w-4"
                          )} />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-2 justify-start animate-message-slide-in">
                      <div className={cn(
                        "flex-shrink-0 bg-teal-100 rounded-full flex items-center justify-center shadow-sm",
                        isMobile ? "w-10 h-10" : "w-8 h-8"
                      )}>
                        <Bot className={cn(
                          "text-teal-600",
                          isMobile ? "h-5 w-5" : "h-4 w-4"
                        )} />
                      </div>
                      <div className={cn(
                        "bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200",
                        isMobile ? "text-base" : "text-sm"
                      )}>
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
              <div className={cn(
                "border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm",
                isMobile ? "p-4 pb-6 safe-area-inset-bottom" : "p-4"
              )}>
                <div className="flex gap-3 items-end">
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isMobile ? "Type a message..." : "Type your message..."}
                    className={cn(
                      "flex-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none rounded-xl",
                      isMobile 
                        ? "text-base min-h-[48px] max-h-[120px] px-4 py-3" 
                        : "text-sm min-h-[40px] max-h-[120px] px-3 py-2"
                    )}
                    disabled={isTyping}
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size={isMobile ? "default" : "sm"}
                    className={cn(
                      "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
                      "text-white transition-all duration-200 disabled:opacity-50 rounded-xl flex-shrink-0",
                      isMobile ? "h-[48px] w-[48px] p-0" : "h-[40px] px-3"
                    )}
                  >
                    <Send className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
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