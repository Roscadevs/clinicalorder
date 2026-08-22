import React, { useState, useRef, useEffect } from 'react'; // Hooks React
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react'; // Iconos Lucide
import { chatApi } from '../services/api'; // API cliente

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const GeminiChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado de apertura del modal flotante
  const [input, setInput] = useState(''); // Estado del input de texto
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: '¡Hola! Soy la Asistente Virtual de la Clínica Dermatológica Dra. Valeria. ¿En qué tratamiento estético o consulta médica puedo asesorarte hoy?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia para auto-scroll

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Envía historial al backend Spring Boot que orquesta con Gemini 1.5 Flash
      const historyPayload = messages.map((m) => ({ role: m.role, text: m.text }));
      const response = await chatApi.sendMessageToGemini(userText, historyPayload);

      setMessages((prev) => [...prev, { role: 'model', text: response.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Disculpa, tuve un inconveniente temporal al procesar tu consulta. Puedes consultar directamente nuestra lista de servicios y disponibilidad.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante para abrir el Chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-xl flex items-center space-x-2 transition-transform transform hover:scale-105"
          title="Consultar Asistente IA"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="text-sm font-semibold hidden sm:inline">¿Dudas sobre tratamientos?</span>
        </button>
      )}

      {/* Ventana de Chatbot */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Encabezado del Chat */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asistente IA Dermatológica</h3>
                <span className="text-[11px] text-teal-100 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 inline-block"></span>
                  Conectada con Google Gemini
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
                <Bot className="w-4 h-4 animate-spin text-teal-600" />
                <span>Gemini está escribiendo una recomendación...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Envío */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre peelings, botox, precios..."
              className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
