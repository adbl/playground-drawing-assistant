import OpenAI from "openai";

const run = async () => {
  const openai = new OpenAI();

  for await (const assistant of openai.beta.assistants.list()) {
    console.log(`assistant ${assistant.id}, ${assistant.name}`);
  }
};

run();
