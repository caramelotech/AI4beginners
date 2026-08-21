# Boas Práticas e Segurança em Prompt Engineering

## Regras de ouro na hora de escrever um prompt

Além do [Framework de Prompt](/labs/ai/engenharia-de-prompt/01-engenharia-de-prompts/) (papel, instruções, perguntas, contexto e exemplos), existe um checklist prático que ajuda a evitar os erros mais comuns:

- **Definir persona e escopo:** deixe claro quem a IA deve "ser" e até onde ela pode ir
- **Ter um objetivo claro:** um prompt vago gera uma resposta vaga
- **Separar os inputs:** organize as informações de entrada em blocos claros, em vez de misturar tudo em um parágrafo só
- **Definir o formato de saída:** JSON, lista, tabela, texto corrido, o modelo precisa saber o que você espera
- **Explicitar os critérios:** se existe um jeito certo e um errado de responder, diga qual é
- **Tratar a ambiguidade:** se o pedido pode ser interpretado de mais de um jeito, oriente a IA sobre como decidir
- **Incluir restrições:** o que a IA não pode fazer é tão importante quanto o que ela pode

## Prompt como configuração declarativa

Em sistemas de produção (principalmente com agentes de codificação), o prompt deixa de ser só uma pergunta pontual e passa a funcionar como **configuração do sistema**, um conjunto de regras que a IA deve seguir durante toda a interação.

Um exemplo prático é dividir as regras de um projeto por domínio, em vez de colocar tudo em um único arquivo de instruções:

```md
Regras dos controllers ficam em controllers.md e valem só para os arquivos de controllers.
Regras dos services ficam em services.md e valem só para os arquivos de services.
Regras de testes ficam em testing.md e valem só para os arquivos de teste.
```

Isso é uma forma de **Context Engineering aplicada**: em vez de jogar tudo no contexto o tempo todo, você organiza as regras para que só a parte relevante entre no prompt de cada tarefa. O agente passa a seguir padrões de arquitetura, convenções de teste e regras de negócio de forma consistente, sem que você precise repetir tudo em cada pedido.

## Gerenciando prompts em produção

Assim como código, prompts em sistemas reais viram **artefatos de software**: eles precisam de versionamento, revisão e monitoramento, porque impactam diretamente **custo**, **latência** e **qualidade** das respostas.

Algumas práticas comuns:

- **Versionamento:** manter histórico de mudanças no prompt, assim como em código
- **Reuso:** organizar prompts por domínio (ex: um prompt para controllers, outro para services) em vez de duplicar instruções
- **Observabilidade:** acompanhar como o prompt está se saindo em produção, quantos tokens consome, quantas vezes falha

Algumas ferramentas usadas para isso na prática:

- **LangSmith**
- **PromptLayer**
- **LangFuse**
- Um registry local mais simples, para times menores

## Riscos, trade-offs e segurança em sistemas com LLMs

Construir sistemas com LLMs traz desafios que não existiam em software tradicional. Vale ter em mente três frentes:

### Engenharia de sistemas com IA

- Integrar um LLM em um sistema vai além de simplesmente chamar um SDK, envolve desenhar como o agente vai se comportar
- O **design de agentes** (quais ferramentas eles têm, quando agem, quando param) é uma decisão de arquitetura
- **Protocolos de comunicação** padronizados, como o MCP (Model Context Protocol), ajudam a conectar agentes a ferramentas de forma consistente

### Trade-offs críticos

Toda decisão de arquitetura envolvendo LLM esbarra em três variáveis que competem entre si:

- **Latência:** respostas mais elaboradas (mais raciocínio, mais chamadas de ferramenta) tendem a demorar mais
- **Custo:** mais tokens processados, mais chamadas de API, mais dinheiro gasto
- **Qualidade:** cortar latência ou custo demais geralmente sacrifica a qualidade da resposta

Não existe bala de prata aqui, é sempre uma escolha consciente entre os três.

### Segurança

Sistemas baseados em LLM têm riscos próprios, que vale conhecer:

- **Prompt Injection:** quando alguém insere instruções maliciosas no texto de entrada para fazer a IA ignorar suas regras originais e executar algo indevido (por exemplo, escondendo um comando dentro de um documento que o agente vai ler)
- **Jailbreaking:** tentativas de convencer o modelo a burlar suas próprias restrições de segurança através de manipulação da conversa
- **Falta de guardrails:** não ter camadas de validação (input e output) que impeçam o sistema de executar ações perigosas mesmo que o modelo "erre"

> ⚠️ **Na prática:** sempre trate qualquer conteúdo externo (documentos, resultados de busca, mensagens de usuário) como não confiável antes de deixar um agente agir com base nele.
