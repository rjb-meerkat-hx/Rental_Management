import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your RentFlow assistant. How can I help you today? I can answer questions about our rental services, platform features, pricing, and more!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Pricing questions
    if (/price|cost|rate|affordable|much does|how much|expensive|cheap|discount/.test(lowerMessage)) {
      return 'Our pricing varies by equipment and rental duration. We offer hourly, daily, and weekly rates. For example, generators start at ₹2,000 per day, office furniture at ₹6,000 per day, and sound systems at ₹28,000 per day. Would you like specific pricing for any equipment?';
    }

    // Delivery & Transportation
    if (/deliver|delivery|shipping|transport|pickup|logistics|how it reaches|get to me/.test(lowerMessage)) {
      return 'We offer delivery services across Mumbai and surrounding areas. Delivery costs depend on the equipment size and distance. Standard delivery is typically ₹500-₹2,000. We also provide pickup services when your rental period ends.';
    }

    // How to rent / Process
    if (/how to|how do|rent|rental process|book|order|steps|procedure/.test(lowerMessage)) {
      return 'Renting from RentFlow is simple! 1) Browse our equipment catalog, 2) Select items and specify rental duration, 3) Complete the booking with your details, 4) We deliver the equipment to your location, 5) Use the equipment and we handle pickup when done.';
    }

    // Payment methods
    if (/payment|pay|card|upi|transfer|cash|billing|invoice/.test(lowerMessage)) {
      return 'We accept multiple payment methods including UPI, credit/debit cards, bank transfers, and cash. Payment can be made upfront or we offer corporate billing options for regular customers. A security deposit is required for most rentals.';
    }

    // Maintenance & Support
    if (/maintenance|maintain|service|repair|broken|issue|problem|support|help/.test(lowerMessage)) {
      return 'All our equipment is regularly maintained and serviced. In case of any issues during your rental period, we provide 24/7 support and can replace equipment if needed. Maintenance is included in your rental cost.';
    }

    // Insurance & Damage
    if (/insurance|insure|damage|accidental|accident|coverage|covered|protect/.test(lowerMessage)) {
      return 'Basic insurance is included with all rentals covering normal wear and tear. Additional comprehensive coverage is available for an extra 10% of the rental cost. This covers accidental damage, theft, and loss.';
    }

    // Bulk & Corporate
    if (/bulk|corporate|business|wholesale|company|organization|commercial/.test(lowerMessage)) {
      return 'We offer special rates for bulk and corporate rentals! Businesses can enjoy discounted pricing, flexible billing cycles, dedicated account managers, and priority support. Contact our business team for custom quotes on large orders.';
    }

    // Cancellation & Returns
    if (/cancel|refund|return|withdraw|undo/.test(lowerMessage)) {
      return 'Cancellations made 48 hours before delivery are fully refundable. Within 48 hours, there\'s a 25% cancellation fee. Once equipment is delivered, the rental fee is non-refundable, but you can return equipment early for a prorated refund.';
    }

    // Contact & Support
    if (/contact|phone|email|call|reach|support|help|faq/.test(lowerMessage)) {
      return 'You can reach us at 📞 +91 98765 43210 or 📧 support@rentflow.com. Our customer service is available Monday-Saturday, 9 AM to 7 PM. For urgent issues, we have 24/7 emergency support at +91 98765 43211.';
    }

    // Equipment/Products queries
    if (/equipment|product|item|tool|available|in stock|what do you|what equipment/.test(lowerMessage)) {
      return 'We offer a wide range of equipment for rent including industrial generators, office furniture sets, sound systems, mobile equipment, climate control units, and much more! Browse our catalog to see all available items and their pricing. Is there any specific type of equipment you\'re looking for?';
    }

    // Greeting responses
    if (/^(hi|hello|hey|greetings|namaste)$/.test(lowerMessage.trim())) {
      return 'Hello! Welcome to RentFlow! 👋 I\'m here to help you with any questions about our rental services. What would you like to know?';
    }

    // Default: ask for clarification
    return 'Thanks for your message! To help you better, could you provide more details? I can assist with: pricing, delivery, how to rent, payments, maintenance, insurance, bulk orders, cancellations, contact info, or product availability.';
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-slide-up">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold">RentFlow Assistant</h3>
            <p className="text-xs text-indigo-200">Online now</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'user' ? 'bg-indigo-600' : 'bg-gray-200'
            }`}>
              {message.sender === 'user' ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-gray-600" />
              )}
            </div>
            <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot size={16} className="text-gray-600" />
            </div>
            <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' || isTyping}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by RentFlow AI • Available 24/7
        </p>
      </div>
    </div>
  );
};

export const ChatbotButton: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all hover:scale-110 z-40 group"
    >
      <MessageCircle size={24} />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Talk to an Expert
      </div>
    </button>
  );
};
