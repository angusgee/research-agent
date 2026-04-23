#! /usr/bin/env node 

import dotenv from "dotenv";
import { ApiKeys } from "./types.js";
import { callOpenAi } from "./providers.js";
import { callPerplexity } from "./providers.js";
import { callAnthropic } from "./providers.js";
import { summariseResponses } from "./providers.js";

function getUserInput():string[] {
  return process.argv;
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

async function createMarkdownFile(summary: string): Promise<void>{

}

const keys = getAPIKeysFromEnv();
handleMissingApiKeys(keys);

const userPrompt = getUserInput()[2];
if (userPrompt === undefined) {
  throw new Error("[!] No prompt provided, please pass in your prompt as the first and only argument")
}

const openAiResponse = callOpenAi(userPrompt);
// console.log(openAiResponse)

const perplexityResponse = callPerplexity(userPrompt, keys["perplexityKey"]);
// console.log(perplexityResponse);

const anthropicResponse = callAnthropic(userPrompt, keys["anthropicKey"]);
// console.log(anthropicResponse)

const values = await Promise.all([
  openAiResponse, perplexityResponse, anthropicResponse
]);

const finalSummary = await summariseResponses(...values);

console.log(finalSummary);
