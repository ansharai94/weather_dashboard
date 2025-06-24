import { invokeOpenAi } from "@/app/actions/openai";
import { openai } from "@/lib/openai";
import { vi } from "vitest";
import { ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";

vi.mock("@/lib/openai", () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));
vi.mock("@/lib/prompts/system-prompt", () => ({
  WEATHER_AI_SYSTEM_PROMPT:
    "You are a weather AI assistant. Respond in JSON format.",
}));

describe("invokeOpenAi Server Action", () => {
  const mockSystemMessage: ChatCompletionSystemMessageParam = {
    role: "system",
    content: "Weather context: Temperature 25°C, sunny",
  };
  const mockUserMessages = [
    {
      role: "user" as const,
      content: "What should I wear today?",
    },
    {
      role: "assistant" as const,
      content: "Based on the weather, I recommend light clothing.",
    },
    {
      role: "user" as const,
      content: "Any specific suggestions?",
    },
  ];
  const mockOpenAISuccessResponse = {
    choices: [
      {
        message: {
          role: "assistant",
          content: JSON.stringify({
            content: "Wear light cotton clothing and sunglasses.",
            additional_tips: [
              {
                id: 1,
                type: "clothing",
                icon: "👕",
                title: "Light Clothing",
                content: "Cotton t-shirt and shorts are perfect.",
                confidence: 90,
                bgColor: "bg-blue-50",
                borderColor: "border-blue-400",
                iconBg: "bg-blue-100",
              },
            ],
          }),
        },
      },
    ],
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Successful API Calls", () => {
    it("successfully processes OPENAI response", async () => {
      vi.mocked(openai.chat.completions.create).mockResolvedValue(
        mockOpenAISuccessResponse
      );
      await invokeOpenAi(mockSystemMessage, mockUserMessages);
    });
    it("should call OpenAi with correct parameters", async () => {
      vi.mocked(openai.chat.completions.create).mockResolvedValue(
        mockOpenAISuccessResponse
      );
      await invokeOpenAi(mockSystemMessage, mockUserMessages);
      expect(openai.chat.completions.create).toHaveBeenCalledTimes(1);
      expect(openai.chat.completions.create).toHaveBeenCalledWith({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.1,
        stream: false,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a weather AI assistant. Respond in JSON format.",
          },
          {
            content: "Weather context: Temperature 25°C, sunny",
            role: "system",
          },
          {
            role: "user",
            content: "What should I wear today?",
          },
          {
            role: "assistant",
            content: "Based on the weather, I recommend light clothing.",
          },
          {
            role: "user",
            content: "Any specific suggestions?",
          },
        ],
      });
    });
  });
  describe("Error handling", () => {
    it("should return message required and 400 when messages.length is < 1", async () => {
      const result = await invokeOpenAi(mockSystemMessage, []);
      expect(result.error).toBe("Message required!");
      expect(result.status).toBe(400);
    });

    it("handles network errors without status", async () => {
      const networkError = new Error("Network connection failed");
      vi.mocked(openai.chat.completions.create).mockRejectedValue(networkError);
      await expect(
        invokeOpenAi(mockSystemMessage, mockUserMessages)
      ).rejects.toThrow(
        `Open ai error Network connection failed ,status: unknown`
      );
    });
  });
});
