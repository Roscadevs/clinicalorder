import React, { useState, useRef, useEffect } from 'react'; // React hooks
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react'; // Iconos
import { chatbotApi } from '../services/api'; // Chatbot API service
import { ChatMessage } from '../types'; // Types

export const GeminiChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! 🌿 Soy el asistente virtual de la Dra. Valeria Gómez. ¿En qué tratamiento o consulta dermatológica puedo asesorarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await chatbotApi.sendMessage(userMsg.content);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Disculpas, ocurrió una intermitencia temporal con nuestro asistente de IA. Por favor, intenta nuevamente en unos instantes o consulta directamente en nuestro portal de turnos.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside aria-label="Asistente Virtual con IA" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana de Chat */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 flex flex-col transition-all duration-300 overflow-hidden mb-3 ${
            isMinimized ? 'h-14' : 'h-[480px]'
          }`}
        >
          {/* Encabezado del Widget */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">Asistente IA Dermatológico</h3>
                <span className="text-[10px] text-teal-100 flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1 animate-pulse"></span>
                  Gemini 1.5 Flash Online
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/10 rounded text-teal-100"
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded text-teal-100"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cuerpo de Mensajes */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                      <span
                        className={`text-[9px] block mt-1 text-right ${
                          msg.role === 'user' ? 'text-teal-200' : 'text-slate-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-slate-400 text-xs">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 rounded-bl-none flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pregunta sobre precios, tratamientos..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white p-2 rounded-xl transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Botón Flotante de Apertura */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white p-3.5 rounded-full shadow-lg flex items-center space-x-2 transition-transform transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold pr-1">¿Dudas? Consultar con IA</span>
        </button>
      )}
    </aside>
  );
};
