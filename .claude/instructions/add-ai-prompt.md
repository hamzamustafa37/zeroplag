# Add AI Prompt

## Context
Adding a new Claude/GPT prompt.

## Steps

1. **File Location**
   lib/ai/prompts/[prompt-name].ts

2. **Prompt Structure**
   - Version number
   - Model config
   - System prompt
   - User prompt function
   - Response type interface

3. **Client Implementation**
   Create lib/ai/clients/[feature]-client.ts

4. **Streaming Version**
   Add async generator function if needed.

5. **Version Control**
   - Increment version on changes
   - Archive old versions
   - Document changes

6. **Testing**
   Create unit tests for prompt.

7. **Best Practices**
   - Keep under 4000 tokens
   - Strict JSON output
   - Include examples
   - Handle edge cases
   - Retry logic for invalid JSON
   - Cache by input hash
