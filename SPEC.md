# Research Agent

As a user, I want to be able to generate a report on any topic which consults with several different LLMs, so I can get multiple views on the topic. 

Perplexity, especially, gets very different results from the Google SERP and therefore OpenAI's models. 

I want the individual reports and a summary of them. 

## Data Model 

### Inputs
- prompt
- api keys 

### Outputs
- api responses
- summary report
- markdown file 

## App Logic
1. Read prompt from CLI 
2. Parse prompt 
2. Read api keys from env
3. Read provider configs
4. Call providers 
5. Parse responses 
6. Call summary agent 
7. Parse summary agent response 
8. Create markdown files 


