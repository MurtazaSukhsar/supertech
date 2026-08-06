'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Phone, Mail, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { contactInfo } from '@/lib/products'
import { useI18n } from '@/components/i18n-provider'
import {
  getAutoResponse,
  getChatbotContent,
  type ChatAction,
  type QuickReply,
} from '@/lib/chatbot-content'

// Custom Bot SVG icon to bypass type resolution issues in some environment scopes
function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}

// Custom Chatbot floating button icon: support agent headset
function SupportFABIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Headset band */}
      <path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9" />
      {/* Left earphone pad */}
      <path d="M2 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2V14z" fill="currentColor" fillOpacity="0.15" />
      {/* Right earphone pad */}
      <path d="M22 14h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1V14z" fill="currentColor" fillOpacity="0.15" />
      {/* Microphone arm and tip */}
      <path d="M19 18v1a2 2 0 0 1-2 2h-2" />
      <circle cx="14" cy="21" r="1.5" fill="currentColor" />
    </svg>
  )
}

type Message = {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
  actions?: ChatAction[]
  showQuickReplies?: boolean
}

export function Chatbot() {
  const { locale, isRtl, href } = useI18n()
  const c = getChatbotContent(locale)
  const QUICK_REPLIES = c.quickReplies
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [visible, setVisible] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Delayed entry of the floating button on initial mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  // Initialize welcome message when chatbot first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: c.welcome,
          timestamp: new Date(),
          actions: [
            {
              label: c.welcomeWhatsApp,
              href: `${contactInfo.whatsappHref}?text=${encodeURIComponent(
                'Hello Super Tech, I would like to get a quote and check product availability.',
              )}`,
              external: true,
            },
          ],
          showQuickReplies: true
        }
      ])
    }
  }, [isOpen, messages.length, c])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = (textToSend: string, isFromQuickReply = false) => {
    if (!textToSend.trim()) return

    const userMsgId = `user-${Date.now()}`
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    }

    // Add user message and clear quick replies on previous messages
    setMessages(prev => (prev.map(m => ({ ...m, showQuickReplies: false })) as Message[]).concat(userMsg))
    if (!isFromQuickReply) {
      setInputValue('')
    }

    setIsTyping(true)
    setTimeout(() => {
      const response = getAutoResponse(textToSend, c)
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        timestamp: new Date(),
        actions: response.actions,
        showQuickReplies: response.showQuickReplies // Show quick replies based on autoresponse settings
      }
      setMessages(prev => prev.concat(botMsg))
      setIsTyping(false)
    }, 750)
  }

  const handleActionClick = (actionHref: string) => {
    if (actionHref === 'action:menu') {
      const userMsgId = `user-${Date.now()}`
      const userMsg: Message = {
        id: userMsgId,
        sender: 'user',
        text: c.showMenu,
        timestamp: new Date()
      }
      setMessages(prev => (prev.map(m => ({ ...m, showQuickReplies: false })) as Message[]).concat(userMsg))
      
      setIsTyping(true)
      setTimeout(() => {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: c.menuPrompt,
          timestamp: new Date(),
          showQuickReplies: true
        }
        setMessages(prev => prev.concat(botMsg))
        setIsTyping(false)
      }, 500)
    }
  }

  const handleQuickReplyClick = (reply: QuickReply) => {
    handleSendMessage(reply.question, true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <>
      {/* Floating Chatbot FAB Button - positioned above WhatsApp button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label={c.fabLabel}
        className={`fixed bottom-[84px] z-50 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-accent/30 hover:bg-accent-hover sm:bottom-[88px] sm:size-14 md:bottom-[92px] md:size-16 ${
          isRtl ? 'left-4 sm:left-5 md:left-5' : 'right-4 sm:right-5 md:right-5'
        } ${
          visible && !isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 pointer-events-none opacity-0'
        }`}
      >
        <SupportFABIcon className="size-7 md:size-8" />
        <span
          className={`absolute -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white animate-pulse ${
            isRtl ? '-left-1' : '-right-1'
          }`}
        >
          1
        </span>
      </button>

      {/* Chatbot Window Container */}
      <div
        className={`fixed bottom-4 right-0 left-0 mx-auto z-40 flex flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl transition-all duration-300 sm:bottom-5 sm:rounded-2xl sm:w-[380px] ${
          isRtl ? 'sm:right-auto sm:left-5' : 'sm:left-auto sm:right-5'
        } ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto h-[85dvh] sm:h-[550px]'
            : 'translate-y-8 scale-95 opacity-0 pointer-events-none h-[85dvh] sm:h-[550px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
              <BotIcon className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold leading-tight">{c.headerTitle}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-medium text-white/80">{c.headerStatus}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label={c.closeLabel}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto bg-surface-alt/40 p-4 space-y-4 chatbot-messages"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <div className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <BotIcon className="size-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white border border-border text-foreground rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {/* Message Action Links (e.g. WhatsApp, Email, Categories) */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-border/60 font-sans">
                      {msg.actions.map((act) => {
                        if (act.href.startsWith('action:')) {
                          return (
                            <button
                              key={act.label}
                              type="button"
                              onClick={() => handleActionClick(act.href)}
                              className="flex items-center gap-1 rounded-lg bg-surface-alt px-2.5 py-1 text-xs font-semibold text-primary border border-border hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
                            >
                              {act.label}
                            </button>
                          )
                        }
                        return (
                          <a
                            key={act.label}
                            href={act.href.startsWith('/') ? href(act.href) : act.href}
                            target={act.external ? '_blank' : undefined}
                            rel={act.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center gap-1 rounded-lg bg-surface-alt px-2.5 py-1 text-xs font-semibold text-primary border border-border hover:bg-primary hover:text-white transition-all duration-200"
                          >
                            {act.label}
                            {!act.external && <ArrowRight className="rtl-flip size-3" />}
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Pretyped Quick Reply Buttons */}
              {msg.sender === 'bot' && msg.showQuickReplies && (
                <div className="ps-9 pe-4 py-1 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Sparkles className="size-3 text-accent" />
                    {c.menuPrompt}
                  </div>
                  <div className="flex flex-col gap-2">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => handleQuickReplyClick(reply)}
                        className="w-full text-start rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                <BotIcon className="size-4" />
              </div>
              <div className="bg-white border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-t border-border p-3.5 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={c.inputPlaceholder}
            className="flex-1 rounded-xl border border-border bg-surface-alt px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            aria-label={c.sendLabel}
            className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary-hover active:scale-95 disabled:scale-100 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="rtl-flip size-4" />
          </button>
        </form>
        <style>{`
          .chatbot-messages::-webkit-scrollbar {
            width: 5px;
          }
          .chatbot-messages::-webkit-scrollbar-track {
            background: transparent;
          }
          .chatbot-messages::-webkit-scrollbar-thumb {
            background: rgba(10, 36, 114, 0.15);
            border-radius: 10px;
          }
          .chatbot-messages::-webkit-scrollbar-thumb:hover {
            background: rgba(10, 36, 114, 0.35);
          }
        `}</style>
      </div>
    </>
  )
}
