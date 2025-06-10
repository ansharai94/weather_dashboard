"use server";

import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources/index.mjs";
import { openai } from "@/lib/openai";
import { WEATHER_AI_SYSTEM_PROMPT } from "@/lib/prompts/system-prompt";

export async function invokeOpenAi(
  system: ChatCompletionSystemMessageParam,
  messages: ChatCompletionMessageParam[]
) {
  try {
    if (messages.length < 1) {
      return {
        error: "Message required!",
        status: 400,
      };
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7, // Sweet spot pentru naturalețe
      max_tokens: 1500, // Răspuns complet dar concis
      top_p: 0.9, // Vocabular bogat
      frequency_penalty: 0.3, // Evită repetiții
      presence_penalty: 0.1, // Focus pe meteo cu tips bonus
      stream: false, // Pentru comenzi simple
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: WEATHER_AI_SYSTEM_PROMPT,
        },
        system,
        ...messages,
      ],
    });
    return {
      status: 200,
      message: response.choices[0].message,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error", error);
    throw new Error(
      `Open ai error ${error.message} ,status: ${error.status || "unknown"}`
    );
  }
}
