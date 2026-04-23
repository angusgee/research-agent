#! /usr/bin/env node 

import dotenv from "dotenv";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

function getUserInput():string[] {
  return process.argv;
}

type ApiKeys = {
  openAiKey: string,
  perplexityKey: string,
  anthropicKey: string
}

function getAPIKeysFromEnv(): ApiKeys{
    const result = dotenv.config();
    if (result.error) {
      console.log("[!] Failed to load .env: " + result.error)
    }
  const apiKeys:ApiKeys = {
    openAiKey: process.env.OPENAI_API_KEY ?? "",
    perplexityKey: process.env.PERPLEXITY_API_KEY ?? "",
    anthropicKey: process.env.ANTHROPIC_API_KEY ?? ""
  };
  return apiKeys;
}

function handleMissingApiKeys(apiKeys: ApiKeys): void {
  const errorArr:string[] = []
  if (apiKeys.openAiKey === "") {
    errorArr.push("OpenAI")
  }
  if (apiKeys.perplexityKey === "") {
    errorArr.push("Perplexity")
  }
  if (apiKeys.anthropicKey === "") {
    errorArr.push("Anthropic")
  }
  if (errorArr.length > 0) {
    throw new Error(errorArr.join(", "))
  }
}

async function callOpenAi(prompt: string):Promise<string> {
  const openAiClient = new OpenAI;
  const response = await openAiClient.responses.create({
    model: "gpt-5.4",
    input: "Please resarch this user's question using your web search tool then return your answer and citations: " + prompt
  })
  return response.output_text;
}

async function callPerpexity(prompt: string, perplexityApiKey: string):Promise<string> {
  const perplexityClient = new OpenAI({
    baseURL: "https://api.perplexity.ai",
    apiKey: perplexityApiKey,
  });
  const response = await perplexityClient.chat.completions.create({
    model: "sonar",
    messages: [{
      role: "user",
      content: prompt
    }]
  });
  const messageContent = response.choices[0].message.content;
  const citations: string[] = (response as any).citations;
  //console.log(JSON.stringify(response, null, 2));
  return messageContent + "\n\n Citations: \n\n" + citations.join(", \n");
}

async function callAnthropic(prompt: string, anthropicApiKey: string):Promise<string> {
  const anthropicClient = new Anthropic({
    apiKey: anthropicApiKey
  });

  const response = await anthropicClient.messages.create({
    max_tokens: 2048, 
    messages: [{
      role: "user",
      content: "Please resarch this user's question using your web search tool then return your answer and citations: " + prompt
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

async function summariseResponses(openAiResponse: string,
  perplexityResponse: string,
  anthropicResponse: string)
  : Promise<string>{
  return "";
}

async function createMarkdownFile(summary: string): Promise<void>{

}

const keys = getAPIKeysFromEnv();
handleMissingApiKeys(keys);

const userPrompt = getUserInput()[2];
if (userPrompt === undefined) {
  throw new Error("[!] No prompt provided, please pass in your prompt as the first and only argument")
}

// const openAiResponse = await callOpenAi(userPrompt);
// console.log(openAiResponse)

// const perplexityResponse = await callPerpexity(userPrompt, keys["perplexityKey"]);
// console.log(perplexityResponse);

const anthropicResponse = await callAnthropic(userPrompt, keys["anthropicKey"])

console.log(anthropicResponse)

