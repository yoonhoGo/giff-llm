import { checkbox, input } from "@inquirer/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOllama } from "@langchain/ollama";
import simpleGit from "simple-git";

const llm = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
  maxRetries: 2,
});
const parser = new StringOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer as markdown in Korean."],
  [
    "system",
    "Please rate the risk score of each changed content from 0 to 1 when you answer the question.",
  ],
  [
    "system",
    "Please show the risk score up to the second decimal place when you answer the question.",
  ],
  [
    "system",
    "Please indicate the risk score with parentheses when you answer the question.",
  ],
  [
    "system",
    "Please show the risk score of each changed content when you answer the question.",
  ],
  ["system", "This is git diff response: {response}"],
  ["human", "{input}"],
])
  .pipe(llm)
  .pipe(parser);

async function main() {
  const fileList = await simpleGit(process.cwd())
    .diff(["--name-only"])
    .then((diff) => diff.split("\n").filter(Boolean));

  const checkboxAnswer = await checkbox({
    message: "Select modified files",
    choices: fileList.map((file) => ({ name: file, value: file })),
  });

  const inputAnswer = await input({ message: "Write prompts 》" });

  const diff = await simpleGit(process.cwd()).diff(checkboxAnswer);

  const assi = await prompt.invoke({
    response: diff,
    input: inputAnswer,
  });

  console.log(assi);
}

main();
