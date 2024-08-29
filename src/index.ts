import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Ollama } from "@langchain/ollama";
import simpleGit from "simple-git";

const llm = new Ollama({
  model: "llama3.1",
  temperature: 0,
  maxRetries: 2,
});

async function main() {
  const response = await simpleGit(process.cwd()).diff([
    "--name-only",
    "package.json",
  ]);

  console.log(response);

  // const assi = await llm.invoke([
  //   new SystemMessage("git diff 메시지입니다."),
  //   new SystemMessage(response),
  //   new SystemMessage("한국어로 대답해주세요."),
  //   new HumanMessage("달라진 차이점이 무엇입니까?"),
  // ]);

  // console.log(assi);
}

main();
