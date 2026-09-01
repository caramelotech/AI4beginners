# SecretarIA

Agente de IA simples que organiza agenda e e-mails por linguagem natural. É o
projeto prático da trilha de Agents do ai-labs - o passo a passo comentado está na
nota [Hands-on: Agente "SecretarIA"](https://caramelotech.github.io/ai-labs/labs/ai/agents/05-hands-on-secretaria/).

O agente usa **function calling** do Gemini: o modelo raciocina sobre o pedido,
decide qual ferramenta chamar, o nosso código executa a ferramenta e devolve o
resultado, e isso se repete até ele conseguir responder.

## Pré-requisitos

- Node.js 18 ou superior
- Uma chave da API do Gemini (gratuita) - gere em <https://aistudio.google.com/api-keys>

## Como rodar

```bash
cd examples/secretaria

# 1. instale as dependências
npm install

# 2. crie o .env a partir do exemplo e cole sua chave
cp .env.example .env      # no Windows: copy .env.example .env

# 3. rode o chat
npm start
```

Digite `sair` (ou deixe a linha vazia) para encerrar.

## Perguntas para testar

- `que dia é hoje?`
- `tenho algo marcado na sexta?`
- `o dia 2 de maio de 2025 está livre às 15h?`
- `marca um dentista dia 2 de maio de 2025 às 15h`
- `remarca a reunião de feedback individual do dia 4 para as 17h`
- `quais e-mails eu recebi?`
- `responde pro Fernando confirmando que recebi os documentos`

## Estrutura

```
src/
  secretaria.js      # o loop do agente: lê o usuário, chama o modelo, executa ferramentas
  tools/
    calendar.js      # ferramentas de agenda (dados fake em memória)
    email.js         # ferramentas de e-mail (dados fake em memória)
```

Cada ferramenta é um objeto `{ function, declaration }`: `function` é o código que
roda de verdade, `declaration` é o que o modelo enxerga (nome, descrição e schema
dos parâmetros).

## Limitações

Os dados de agenda e e-mail são fixos e vivem só em memória - fechou o processo,
tudo volta ao estado inicial. A data de hoje é fixa (`2025-05-01`) para o exemplo
ser determinístico. Trocar isso por APIs reais (Google Calendar, Gmail) e por
memória persistente fica como próximo passo.
