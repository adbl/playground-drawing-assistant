import OpenAI, { AuthenticationError } from "openai";
import {
  getAssistant,
  createThread,
  runAssistant,
} from "./canvas-assistant.ts";
import { CanvasTools } from "./canvas-tools.ts";
import { isAppEnabled } from "./config.ts";
import { assert } from "./util.ts";

class Tools extends CanvasTools {
  constructor(
    canvas: HTMLCanvasElement,
    // eslint-disable-next-line no-unused-vars
    private logMessage: (message: string) => void
  ) {
    const context = canvas.getContext("2d");
    assert(context, "unexpected missing context");
    super(canvas.width, canvas.height, context);
  }

  protected log(message: string) {
    this.logMessage(`🎨 ${message}`);
  }
}

const app = () => {
  const textInput = document.getElementById(
    "text-input"
  ) as HTMLInputElement | null;
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  const form = document.getElementById("form") as HTMLFormElement | null;
  const logArea = document.getElementById(
    "log-area"
  ) as HTMLTextAreaElement | null;

  assert(
    textInput && form && canvas && logArea,
    "app: unexpected missing elements"
  );
  const parent = canvas.parentElement;
  assert(parent, "unexpected missing canvas parent");
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
  parent.style.height = `${canvas.height + 4}px`;
  parent.style.width = `${canvas.width + 4}px`;
  console.debug(`[app] canvas size: ${canvas.width}x${canvas.height}`);

  const resetInput = () => {
    textInput.value = "";
    textInput.placeholder = "Enter drawing instructions...";
    textInput.disabled = false;
    textInput.focus({ preventScroll: true });
  };

  const logMessage = (message: string) => {
    logArea.value += `${message}\n`;
    logArea.scroll({
      top: logArea.scrollHeight,
      behavior: "smooth",
    });
  };

  const submitUserMessage = async (
    openai: OpenAI,
    assistant: OpenAI.Beta.Assistants.Assistant,
    thread: OpenAI.Beta.Threads.Thread
  ) => {
    const userMessage = textInput.value;
    if (userMessage) {
      textInput.disabled = true;
      textInput.placeholder = "Assistant working...";
      textInput.value = "";
      logMessage(`🗣️ ${userMessage}`);

      try {
        const result = await runAssistant(
          openai,
          assistant,
          thread,
          new Tools(canvas, logMessage),
          userMessage
        );
        logMessage(`🤖 ${result}`);
      } catch (error) {
        console.error("[app] run assistant error", error);
        alert(
          "Failed to run assistant. Try reloading page if error remains. See console for details"
        );
      } finally {
        resetInput();
      }
    }
  };

  const initAssistant = async (apiKey: string) => {
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    try {
      const assistant = await getAssistant(openai);
      const thread = await createThread(openai);
      logArea.value += "🤖 waiting for instructions...\n";
      resetInput();

      form.addEventListener("submit", async (e: SubmitEvent) => {
        e.preventDefault();
        submitUserMessage(openai, assistant, thread);
      });
    } catch (error) {
      if (error instanceof AuthenticationError) {
        localStorage.removeItem("openai-api-key");
      }
      console.error("[app] create assistant error", error);
      alert("failed to create assistant, see console");
    }
  };

  const storedApiKey = localStorage.getItem("openai-api-key");
  if (storedApiKey) {
    console.debug(`[app] using localStorage API key: ${storedApiKey}`);
    initAssistant(storedApiKey);
  } else {
    textInput.placeholder = "Enter OpenAI API key";
    logArea.value = "🤖 waiting for API key...\n";

    const onInitSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      const apiKey = textInput.value;
      await initAssistant(apiKey);
      form.removeEventListener("submit", onInitSubmit);
      localStorage.setItem("openai-api-key", apiKey);
    };
    form.addEventListener("submit", onInitSubmit);
  }
};

isAppEnabled && app();
