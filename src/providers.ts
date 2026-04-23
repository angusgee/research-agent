import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export async function callOpenAi(prompt: string):Promise<string> {
  const openAiClient = new OpenAI;

  const response = await openAiClient.responses.create({
    model: "gpt-5.4",
    input: "Please research this user's question using your web search tool then return your answer and citations: " + prompt
  })
  
  return response.output_text;
}

export async function callPerplexity(prompt: string, perplexityApiKey: string):Promise<string> {
  const perplexityClient = new OpenAI({
    baseURL: "https://api.perplexity.ai",
    apiKey: perplexityApiKey,
  });
  const response = await perplexityClient.chat.completions.create({
    model: "sonar",
    messages: [{
      role: "user",
      content: "Please research this user's question using your web search tool then return your answer and citations: " + prompt
    }]
  });

  const messageContent = response.choices[0].message.content;
  const citations: string[] = (response as any).citations;
  
  //console.log(JSON.stringify(response, null, 2));
  return messageContent + "\n\n Citations: \n\n" + citations.join(", \n");
}

export async function callAnthropic(prompt: string, anthropicApiKey: string):Promise<string> {
  const anthropicClient = new Anthropic({
    apiKey: anthropicApiKey
  });

  const response = await anthropicClient.messages.create({
    max_tokens: 2048, 
    messages: [{
      role: "user",
      content: "Please research this user's question using your web search tool then return your answer and citations: " + prompt
    }],
    model: "claude-opus-4-6"
  })

  // return JSON.stringify(response.content, null, 2);
  if (response.content[0].type === "text") {
    return response.content[0].text;
  } else {
    throw new Error("[!] Invalid response from provider")
  }
}

export async function summariseResponses(openAiResponse: string,
  perplexityResponse: string,
  anthropicResponse: string)
  : Promise<string>{

  const summaryClient = new OpenAI;
    const response = await summaryClient.responses.create({
    model: "gpt-5.4",
    input: `You are a summarisation agent. Your user has used three agents to generate some research. Your task is to summarise the research and remove any duplicate entries. Return a summary of no more than 300 words, followed by all of the unique citations.\n\n\n==========\n\n\nAgent One Research:\n\n\n${openAiResponse}\n\n\n==========\n\n\nAgent Two Research:\n\n\n${perplexityResponse}\n\n\n==========\n\n\nAgent Three Research: \n\n\n${anthropicResponse}\n\n\n=========
    `
  })
  return response.output_text;
}