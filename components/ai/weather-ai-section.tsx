import { IAdditionalTips, Message, WeatherForecastResponse } from "@/lib/types";
import { WeatherAssistant } from "./weather-assistant";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AnimatedWeatherInsights } from "./animated-weather-insights";
import { EmptyInsightsState } from "./empty-insights";
import { FloatingMessage } from "./floating-message";
import { AnimatedContainer } from "./animated-container";

interface WeatherAISection {
  weatherData: WeatherForecastResponse;
}
const defaultMessage: Message = {
  id: 1,
  role: "system",
  content:
    "Bună! 👋 Sunt WeatherBot, asistentul tău meteo personalizat! Cu ce te pot ajuta ?",
  time: new Date().toLocaleTimeString("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  }),
};
export function WeatherAISection({ weatherData }: WeatherAISection) {
  const [messages, setMessages] = useState<Message[]>([defaultMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // State pentru animații
  const [showInsights, setShowInsights] = useState(false);
  const [animatingMessage, setAnimatingMessage] = useState<Message | null>(
    null
  );
  const [previousInsights, setPreviousInsights] = useState<
    IAdditionalTips[] | undefined
  >(undefined);
  const [isLoadingNewInsights, setIsLoadingNewInsights] = useState(false);

  useEffect(() => {
    setMessages([defaultMessage]);
  }, [weatherData]);

  // Watch pentru noi insights
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.additional_tips && lastMessage.role === "assistant") {
      // Dacă e un mesaj nou cu insights
      if (previousInsights !== lastMessage.additional_tips) {
        // Start loading state immediately
        setIsLoadingNewInsights(true);
        setShowInsights(false);

        // Set the animating message immediately
        setAnimatingMessage(lastMessage);

        // Start the floating animation
        setTimeout(() => {
          // After a short delay, begin showing the new insights
          setShowInsights(true);
          setPreviousInsights(lastMessage.additional_tips);
          setIsLoadingNewInsights(false);

          // Stop the floating animation after insights are shown
          setTimeout(() => {
            setAnimatingMessage(null);
          }, 800);
        }, 500);
      }
    }
  }, [messages, previousInsights]);

  const insights = messages[messages.length - 1].additional_tips;
  const shouldShowInsights = Array.isArray(insights) && !isLoadingNewInsights;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <WeatherAssistant
        weatherData={weatherData}
        messages={messages}
        setMessages={setMessages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
      />

      <AnimatedContainer isVisible={shouldShowInsights}>
        {insights ? (
          <AnimatedWeatherInsights
            insights={insights}
            showInsights={showInsights}
            isLoading={isLoadingNewInsights}
          />
        ) : (
          <EmptyInsightsState isLoading={isLoadingNewInsights} />
        )}
      </AnimatedContainer>

      {/* Floating Animation Message */}
      <AnimatePresence>
        {animatingMessage && <FloatingMessage message={animatingMessage} />}
      </AnimatePresence>
    </div>
  );
}
