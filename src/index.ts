#! /usr/bin/env node 

import fs from "fs";
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

function createMarkdownFile(summary: string): void{
  const fileName = `REPORT_${Date.now()}.md`
  fs.writeFileSync(fileName, summary);
}

const keys = getAPIKeysFromEnv();
handleMissingApiKeys(keys);

const userPrompt = getUserInput()[2];
if (userPrompt === undefined) {
  throw new Error("[!] No prompt provided, please pass in your prompt as the first and only argument")
}

const openAiResponse = callOpenAi(userPrompt, keys["openAiKey"]);

const perplexityResponse = callPerplexity(userPrompt, keys["perplexityKey"]);

const anthropicResponse = callAnthropic(userPrompt, keys["anthropicKey"]);

const values = await Promise.allSettled([
  openAiResponse, perplexityResponse, anthropicResponse
]);

values.forEach((value) =>{
  if (value.status === "rejected") {
    console.log("API call failed: ", value.reason);
  }
})

const fulfilledPromises = values.filter(v => v.status === "fulfilled")
                                .map(v => (v as PromiseFulfilledResult<string>).value);

const finalSummary = await summariseResponses(keys["openAiKey"], fulfilledPromises );

// console.log(finalSummary);

createMarkdownFile(finalSummary);
