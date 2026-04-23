#! /usr/bin/env node 

import dotenv from "dotenv"
import OpenAI from "openai"

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
    input: prompt
  })
  return response.output_text;
}

async function callPerpexity(prompt: string):Promise<string> {
  return "";
}

async function callAnthropic(prompt: string):Promise<string> {
  return "";
}

const keys = getAPIKeysFromEnv();
handleMissingApiKeys(keys);

const userPrompt = getUserInput()[2];
if (userPrompt === undefined) {
  throw new Error("[!] No prompt provided, please pass in your prompt as the first and only argument")
}

const openAiResponse = await callOpenAi(userPrompt);

console.log(openAiResponse)


