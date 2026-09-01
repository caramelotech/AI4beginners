import { GoogleGenAI } from "@google/genai";
import readline from "node:readline/promises";
import dotenv from "dotenv";
import { allDefinitions as calendarDefinitions } from "./tools/calendar.js";
import { allDefinitions as emailDefinitions } from "./tools/email.js";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Faltou a GEMINI_API_KEY. Copie o .env.example para .env e coloque sua chave.\n" +
      "Você gera uma chave gratuita em https://aistudio.google.com/api-keys",
  );
  process.exit(1);
}

// "gemini-flash-latest" aponta sempre para a versão Flash atual, sem quebrar
// quando uma geração nova sai. Prefira fixar uma versão exata em produção.
const MODEL = "gemini-flash-latest";

const SYSTEM_INSTRUCTION = `Você é a SecretarIA, uma assistente que organiza a agenda e os e-mails de uma pessoa.
Use sempre as ferramentas disponíveis para consultar ou alterar dados reais, em vez de adivinhar.
Depois de agir, confirme em linguagem natural e de forma breve o que foi feito.
Se não existir ferramenta para o pedido, diga isso com honestidade em vez de inventar.`;

// Junta as ferramentas das duas fontes numa lista só.
const allDefinitions = [...calendarDefinitions, ...emailDefinitions];

// O catálogo que o modelo enxerga: só nome, descrição e schema dos parâmetros.
const declarations = allDefinitions.map((def) => def.declaration);

// O mapa que o nosso código usa para achar a implementação a partir do nome.
const functionsByName = Object.fromEntries(
  allDefinitions.map((def) => [def.declaration.name, def.function]),
);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Uma chamada ao modelo, sempre com o mesmo catálogo e a mesma instrução de sistema.
function askModel(contents) {
  return ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: declarations }],
    },
  });
}

// Executa uma ferramenta pedida pelo modelo e devolve o resultado como texto.
// Qualquer erro vira observação: o modelo decide o que fazer, o chat não quebra.
function runTool(call) {
  const fn = functionsByName[call.name];

  if (!fn) {
    return `Erro: a ferramenta "${call.name}" não existe.`;
  }

  try {
    return fn(call.args ?? {});
  } catch (error) {
    return `Erro ao executar "${call.name}": ${error.message}`;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('SecretarIA pronta. Digite "sair" para encerrar.\n');

// Histórico completo da conversa: mensagens do usuário, turnos do modelo e
// respostas das ferramentas. É a memória de curto prazo do agente.
const contents = [];

while (true) {
  let query;
  try {
    query = (await rl.question("Você: ")).trim();
  } catch {
    // stdin fechou (Ctrl+D ou fim de um pipe)
    break;
  }

  if (query === "" || query.toLowerCase() === "sair") {
    break;
  }

  // Marca onde este turno começa para conseguir desfazê-lo se algo falhar.
  const turnStart = contents.length;
  contents.push({ role: "user", parts: [{ text: query }] });

  try {
    let response = await askModel(contents);
    contents.push(response.candidates[0].content);

    // Enquanto o modelo pedir ferramentas, executamos e devolvemos o resultado.
    // Perguntas mais complexas encadeiam várias chamadas (ex.: pegar a data de
    // hoje e só então consultar os eventos daquele dia).
    while (response.functionCalls?.length) {
      for (const call of response.functionCalls) {
        console.log(`  ↳ chamando ${call.name}(${JSON.stringify(call.args ?? {})})`);

        const result = runTool(call);

        contents.push({
          role: "user",
          parts: [
            { functionResponse: { name: call.name, response: { result } } },
          ],
        });
      }

      response = await askModel(contents);
      contents.push(response.candidates[0].content);
    }

    console.log(`\nSecretarIA: ${response.text}\n`);
  } catch (error) {
    // Erros de rede ou da API (limite de uso, instabilidade) não devem
    // derrubar o chat. Descartamos o turno incompleto e seguimos.
    console.error(`\n[não consegui falar com o modelo: ${error.message}]\n`);
    contents.length = turnStart;
  }
}

rl.close();
