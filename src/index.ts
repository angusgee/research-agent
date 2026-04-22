#! /user/bin/env node 

import dotenv from "dotenv"

function getUserInput():string {
  // get input from args
}

function parseUserInput(args:string[]):string{
  // validate input
}

type apiKeys = {
  openAiKey: string,
  perplexityKey: string,
  anthropicKey: string
}

function getAPIKeysFromEnv(): apiKeys{
  dotenv.config();
  const apiKeys:apiKeys = {
    openAiKey: process.env.OPEN_API_KEY ?? "",
    perplexityKey: process.env.PERPLEXITY_API_KEY ?? "",
    anthropicKey: process.env.ANTHROPIC_API_KEY ?? ""
  };
  return apiKeys;
}

function handleMissingApiKeys(apiKeys: apiKeys): void {
  if (apiKeys.openAiKey === "") {
    console.log("OpenAI api key is missing, please add it")
  }
  if (apiKeys.perplexityKey === "") {
    console.log("Perplexity api key is missing, please add it")
  }
  if (apiKeys.anthropicKey === "") {
    console.log("Anthropic api key is missing, please add it")
  }
}

const keys = getAPIKeysFromEnv();
handleMissingApiKeys(keys);


