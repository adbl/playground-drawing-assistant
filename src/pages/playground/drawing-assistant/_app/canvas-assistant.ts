import OpenAI from "openai";
import type { RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs.mjs";
import { assert, sha1Hash, timeout } from "./util";
import { CanvasTools, getAssistantTools } from "./canvas-tools";

const createBody = {
  instructions: `You are a drawing assistant. You have access to the specified CanvasRenderingContext2D methods and properties as function tools. You interpret drawing instructions from the user and translate them into actions using the provided tools. You can ask for clarification if instructions are ambiguous. Your message should not include code. Your message should not include links. Your message should not include images.`,
  name: "Drawing Assistant",
  tools: getAssistantTools(),
  model: "gpt-3.5-turbo", // TODO try to use gpt-4
};

export const getAssistant = async (openai: OpenAI) => {
  const versionHash = await sha1Hash(createBody);
  const name = `${createBody.name} v-${versionHash}`;
  return (
    (await findAssistant(openai, name)) ?? (await createAssistant(openai, name))
  );
};

const createAssistant = async (openai: OpenAI, name: string) => {
  const assistant = await openai.beta.assistants.create({
    ...createBody,
    name,
  });
  console.debug(`[assistant] created assistant ${assistant.id} / '${name}'`);
  return assistant;
};

const findAssistant = async (openai: OpenAI, name: string) => {
  for await (const assistant of openai.beta.assistants.list()) {
    if (assistant.name === name) {
      console.debug(
        `[assistant] using existing assistant ${assistant.id} / '${name}'`
      );
      return assistant;
    }
  }
  return null;
};

export const createThread = async (openai: OpenAI) => {
  return await openai.beta.threads.create();
};

export const runAssistant = async (
  openai: OpenAI,
  assistant: OpenAI.Beta.Assistants.Assistant,
  thread: OpenAI.Beta.Threads.Thread,
  tools: CanvasTools,
  userMessage: string
) => {
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: userMessage,
  });

  let run: OpenAI.Beta.Threads.Run | null =
    await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      instructions: `The canvas dimensions are ${tools.width}x${tools.height}.`,
    });
  while ((run = await handleRun(openai, thread.id, run, tools)) !== null) {
    await timeout(500);
  }

  const messages = await openai.beta.threads.messages.list(thread.id);
  const assistantMessage = messages.data.at(0);
  assert(assistantMessage, "handleCompleted: unexpected missing last message");
  return assistantMessage.content.reduce(
    (acc, content) =>
      acc + ((content.type === "text" && content.text.value) || ""),
    ""
  );
};

const handleRun = async (
  openai: OpenAI,
  threadId: string,
  run: OpenAI.Beta.Threads.Run,
  tools: CanvasTools
) => {
  switch (run.status) {
    case "queued":
    case "in_progress":
      return await openai.beta.threads.runs.retrieve(threadId, run.id);
    case "requires_action":
      assert(
        run.required_action,
        "handleRun: unexpected missing run.required_action"
      );
      return await handlRequiredAction(
        openai,
        threadId,
        run.id,
        run.required_action,
        tools
      );
    case "completed":
      return null;
  }

  const message = `unexpected run status ${run.status}`;
  console.error(`[assistant] ${message}`, run);
  throw new Error(message);
};

const handlRequiredAction = async (
  openai: OpenAI,
  threadId: string,
  runId: string,
  action: OpenAI.Beta.Threads.Run.RequiredAction,
  tools: CanvasTools
) => {
  assert(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    action.type === "submit_tool_outputs",
    `unknown action type: ${action.type}`
  );
  const tool_outputs: RunSubmitToolOutputsParams.ToolOutput[] = [];

  for (const toolCall of action.submit_tool_outputs.tool_calls) {
    assert(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      toolCall.type === "function",
      `unknown tool call type: ${toolCall.type}`
    );
    tools.call(toolCall.function);
    // what _should_ the result be?
    tool_outputs.push({ tool_call_id: toolCall.id, output: "OK" });
  }
  return await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
    tool_outputs,
  });
};
