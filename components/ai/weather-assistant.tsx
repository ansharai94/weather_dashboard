import { invokeOpenAi } from "@/app/actions/openai";
import { formatWeatherContext, parseAndValidateJSON } from "@/lib/utils";
import { Dispatch, SetStateAction, useRef } from "react";
import { Message, WeatherForecastResponse } from "@/lib/types";

export interface WeatherAssistant {
  weatherData: WeatherForecastResponse;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
}

export function WeatherAssistant({
  weatherData,
  messages,
  setMessages,
  inputValue,
  setInputValue,
  isTyping,
  setIsTyping,
}: WeatherAssistant) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    "🌡️ Analize ale vremii actuale",
    "👕 Recomandări de îmbrăcăminte",
    "🏃‍♂️ Sfaturi pentru activități outdoor",
    "⚠️ Alerte pentru schimbări meteo",
    "📅 Planificarea pe baza prognozei",
  ];
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
      time: new Date().toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
    scrollToBottom();
    setInputValue("");
    try {
      console.log(weatherData, "weatherData");
      const weatherContext = formatWeatherContext(weatherData);
      // Fix the message handling logic
      const conversationHistory = messages
        .filter((msg) => msg.role !== "system") // Remove system messages from history
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));
      setIsTyping(true);

      const response = await invokeOpenAi(
        { role: "system", content: weatherContext },
        [...conversationHistory, { role: "user", content: newMessage.content }]
      );

      const parsed = parseAndValidateJSON(response.message?.content);
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: "assistant",
        time: new Date().toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...parsed, // This will spread the parsed JSON properties
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Îmi pare rău, am întâmpinat o problemă tehnică. Te rog încearcă din nou. 🔧",
        time: new Date().toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      scrollToBottom();
      setIsTyping(false);
    }
  };
  const handleQuickAction = (action: string) => {
    handleSendMessage(action.substring(2)); // Remove emoji prefix
  };
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(e.target.value);
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl shadow-black/10 border border-white/20 flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
          🤖
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold m-0">Weather AI Assistant</h3>
          <p className="text-sm opacity-90 m-0 mt-1">
            Online • Gata să te ajut
          </p>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
            💡
          </button>
          <button className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
            ⚙️
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 max-w-[85%] ${
              message.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              }`}
            >
              {message.role === "user" ? "👤" : "🤖"}
            </div>

            <div className="flex flex-col">
              <div
                className={`px-4 py-3 rounded-2xl leading-relaxed ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {message.content}
              </div>

              <div
                className={`text-xs text-gray-500 mt-1 ${
                  message.role === "user" ? "text-left" : "text-right"
                }`}
              >
                {message.time}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-lg text-white">
              🤖
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 hover:bg-blue-100 transition-all duration-300 hover:-translate-y-0.5"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyPress}
            placeholder="Întreabă AI-ul despre vreme..."
            className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-full outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            className="w-11 h-11 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="text-lg">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}
