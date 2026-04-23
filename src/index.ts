#! /usr/bin/env node 

import dotenv from "dotenv"


function getUserInput():string[] {
  return process.argv;
}

function parseUserInput(args:string[]):string{
  // validate input
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
    openAiKey: process.env.OPEN_API_KEY ?? "",
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

const keys = getAPIKeysFromEnv();
handleMissingApiKeys(keys);
// console.log(getUserInput()[2]);
const userPrompt = getUserInput()[2];
if (userPrompt === undefined) {
  throw new Error("[!] No prompt provided, please pass in your prompt as the first and only argument")
}


