'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Phone, Mail, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { contactInfo } from '@/lib/products'

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

type QuickReply = {
  id: string
  label: string
  question: string
  answer: string
  actions?: { label: string; href: string; external?: boolean }[]
}

const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'quote',
    label: '📋 Request a Quote',
    question: 'How can I request a quote for products?',
    answer: 'You can request a quote in two easy ways:\n\n1. Browse our website, add products to your quote list, and submit the request directly.\n2. Click the links below to send your requirements or Bill of Quantities (BOQ) directly to our team via WhatsApp or Email.',
    actions: [
      { label: '💬 WhatsApp Quote', href: contactInfo.whatsappHref, external: true },
      { label: '✉️ Email Quote', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=Quote%20Request`, external: true },
      { label: '🔍 Browse Products', href: '/products' }
    ]
  },
  {
    id: 'delivery',
    label: '🚚 Delivery Info',
    question: 'Do you deliver to job sites and workshops?',
    answer: 'Yes! We deliver bulk orders, HVAC accessories, power tools, and construction materials directly to workshops, stores, and project sites across Kuwait.',
    actions: [
      { label: '💬 Contact Delivery Desk', href: contactInfo.whatsappHref, external: true }
    ]
  },
  {
    id: 'categories',
    label: '🛠️ Product Categories',
    question: 'What types of materials and equipment do you supply?',
    answer: 'We supply a comprehensive range of materials:\n\n• **Air-Conditioning Materials:** Copper pipes, rubber insulation, refrigerants, condensers.\n• **Hardware Supplies:** Fasteners, fittings, fixing items, brackets.\n• **Hand & Power Tools:** Professional-grade drills, grinders, wrenches.\n• **Construction Materials:** Cement, steel, and core building materials in bulk.',
    actions: [
      { label: '❄️ A/C Materials', href: '/categories/air-conditioning' },
      { label: '⚙️ Hand & Power Tools', href: '/categories/tools' },
      { label: '🧱 Construction Materials', href: '/categories/construction' }
    ]
  },
  {
    id: 'location',
    label: '📍 Location & Hours',
    question: 'Where is your showroom and what are the working hours?',
    answer: 'Our main office & showroom is located in **Shuwaikh Industrial Area, Kuwait City**.\n\n🕒 **Working Hours:**\n• Saturday to Thursday: 8:00 AM - 5:00 PM\n• Friday: Closed',
    actions: [
      { label: '🗺️ Google Maps Location', href: contactInfo.googleMapsUrl, external: true },
      { label: '📞 Call Showroom', href: contactInfo.phoneHref, external: true }
    ]
  },
  {
    id: 'contact',
    label: '📞 Contact Support',
    question: 'How can I reach customer support or sales?',
    answer: `You can reach the Super Tech support and sales team directly:\n\n• **Phone:** ${contactInfo.phone}\n• **Email:** ${contactInfo.email}\n• **Showroom:** Shuwaikh Industrial Area, Kuwait`,
    actions: [
      { label: '💬 WhatsApp Chat', href: contactInfo.whatsappHref, external: true },
      { label: '📞 Call Now', href: contactInfo.phoneHref, external: true }
    ]
  }
]

type Message = {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
  actions?: { label: string; href: string; external?: boolean }[]
  showQuickReplies?: boolean
}

function getAutoResponse(userInput: string): { 
  answer: string; 
  actions?: { label: string; href: string; external?: boolean }[];
  showQuickReplies?: boolean;
} {
  const query = userInput.toLowerCase().trim()
  
  if (query === 'menu' || query === 'help' || query === 'categories' || query === 'start' || query === 'show main menu') {
    return {
      answer: 'Here are the quick topics you can choose from:',
      showQuickReplies: true
    }
  }
  
  if (query.includes('quote') || query.includes('price') || query.includes('cost') || query.includes('pricing') || query.includes('bulk') || query.includes('inquire') || query.includes('bill of') || query.includes('boq') || query.includes('buy')) {
    return {
      answer: QUICK_REPLIES[0].answer,
      actions: [...(QUICK_REPLIES[0].actions || []), { label: '↩️ Main Menu', href: 'action:menu' }],
      showQuickReplies: false
    }
  }
  
  if (query.includes('deliver') || query.includes('ship') || query.includes('send') || query.includes('transport') || query.includes('cargo') || query.includes('coverage') || query.includes('areas') || query.includes('workshops')) {
    return {
      answer: QUICK_REPLIES[1].answer,
      actions: [...(QUICK_REPLIES[1].actions || []), { label: '↩️ Main Menu', href: 'action:menu' }],
      showQuickReplies: false
    }
  }
  
  if (query.includes('product') || query.includes('category') || query.includes('categories') || query.includes('sell') || query.includes('supply') || query.includes('catalog') || query.includes('items') || query.includes('copper') || query.includes('pipe') || query.includes('tool') || query.includes('cement') || query.includes('ac') || query.includes('compressor') || query.includes('welding') || query.includes('hardware')) {
    return {
      answer: QUICK_REPLIES[2].answer,
      actions: [...(QUICK_REPLIES[2].actions || []), { label: '↩️ Main Menu', href: 'action:menu' }],
      showQuickReplies: false
    }
  }
  
  if (query.includes('location') || query.includes('map') || query.includes('showroom') || query.includes('address') || query.includes('where') || query.includes('place') || query.includes('office') || query.includes('site') || query.includes('hour') || query.includes('time') || query.includes('open') || query.includes('close') || query.includes('saturday') || query.includes('thursday') || query.includes('friday') || query.includes('work day')) {
    return {
      answer: QUICK_REPLIES[3].answer,
      actions: [...(QUICK_REPLIES[3].actions || []), { label: '↩️ Main Menu', href: 'action:menu' }],
      showQuickReplies: false
    }
  }
  
  if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('call') || query.includes('support') || query.includes('number') || query.includes('whatsapp') || query.includes('talk') || query.includes('reach') || query.includes('help') || query.includes('agent') || query.includes('human')) {
    return {
      answer: QUICK_REPLIES[4].answer,
      actions: [...(QUICK_REPLIES[4].actions || []), { label: '↩️ Main Menu', href: 'action:menu' }],
      showQuickReplies: false
    }
  }
  
  return {
    answer: "I couldn't quite match that with our standard FAQs. I am the Super Tech auto-assistant, but you can select one of the common topics below, or chat directly with our team on WhatsApp!",
    actions: [
      { label: '💬 Chat on WhatsApp', href: contactInfo.whatsappHref, external: true },
      { label: '✉️ Send an Email', href: `mailto:${contactInfo.email}`, external: true }
    ],
    showQuickReplies: true
  }
}

export function Chatbot() {
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
          text: "Hi there! Welcome to Super Tech. I can quickly answer your questions about quotes, delivery, products, showroom location, or contact details. Click a pretyped option below or type your question!",
          timestamp: new Date(),
          showQuickReplies: true
        }
      ])
    }
  }, [isOpen, messages.length])

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
      const response = getAutoResponse(textToSend)
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
        text: '↩️ Show Main Menu',
        timestamp: new Date()
      }
      setMessages(prev => (prev.map(m => ({ ...m, showQuickReplies: false })) as Message[]).concat(userMsg))
      
      setIsTyping(true)
      setTimeout(() => {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Here are the quick topics you can choose from:',
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
      {/* Floating Chatbot FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open support chat"
        className={`fixed bottom-[92px] right-5 z-50 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-accent/30 hover:bg-accent-hover md:bottom-[108px] md:size-16 ${
          visible && !isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 pointer-events-none opacity-0'
        }`}
      >
        <SupportFABIcon className="size-7 md:size-8" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white animate-pulse">
          1
        </span>
      </button>

      {/* Chatbot Window Container */}
      <div
        className={`fixed bottom-5 right-5 z-40 flex h-[500px] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 sm:right-6 sm:bottom-6 sm:w-[380px] sm:h-[550px] ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
            : 'translate-y-8 scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
              <BotIcon className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold leading-tight">Super Tech Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-medium text-white/80">Online • Auto-Answers</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
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
                            href={act.href}
                            target={act.external ? '_blank' : undefined}
                            rel={act.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center gap-1 rounded-lg bg-surface-alt px-2.5 py-1 text-xs font-semibold text-primary border border-border hover:bg-primary hover:text-white transition-all duration-200"
                          >
                            {act.label}
                            {!act.external && <ArrowRight className="size-3" />}
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Pretyped Quick Reply Buttons */}
              {msg.sender === 'bot' && msg.showQuickReplies && (
                <div className="pl-9 pr-4 py-1 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Sparkles className="size-3 text-accent" />
                    Quick Answers:
                  </div>
                  <div className="flex flex-col gap-2">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => handleQuickReplyClick(reply)}
                        className="w-full text-left rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
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
            placeholder="Type your question..."
            className="flex-1 rounded-xl border border-border bg-surface-alt px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
            className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105 hover:bg-primary-hover active:scale-95 disabled:scale-100 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="size-4" />
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
