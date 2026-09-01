// Caixa de entrada fake, guardada só em memória.
const inbox = [
  {
    sender: "ana.silva@example.com",
    message: "Olá! Poderíamos remarcar nossa reunião para amanhã às 10h?",
  },
  {
    sender: "carlos.mendes@empresa.com",
    message: "Segue o relatório de desempenho do último trimestre em anexo.",
  },
  {
    sender: "mariana.costa@example.com",
    message:
      "Lembrete: apresentação para o cliente marcada para sexta-feira às 14h.",
  },
  {
    sender: "eduardo.lima@empresa.com",
    message: "Bom dia! Há alguma atualização sobre o projeto de inovação?",
  },
  {
    sender: "beatriz.rocha@example.com",
    message: "Convite: Workshop sobre metodologias ágeis no próximo sábado.",
  },
  {
    sender: "lucas.almeida@empresa.com",
    message: "Reunião de alinhamento confirmada para segunda-feira às 9h.",
  },
  {
    sender: "carla.souza@example.com",
    message: "Ei! Vai participar do churrasco do Dia do Trabalhador?",
  },
  {
    sender: "fernando.gomes@empresa.com",
    message:
      "Enviei os documentos solicitados para revisão. Confirma o recebimento?",
  },
];

const getEmails = {
  function: () => {
    return inbox;
  },
  declaration: {
    name: "getEmails",
    description: "Retorna todos os e-mails na caixa de entrada",
  },
};

const sendEmail = {
  function: ({ to, subject, message }) => {
    console.log(`**E-mail enviado para ${to} - "${subject}": ${message}`);

    return "E-mail enviado!";
  },
  declaration: {
    name: "sendEmail",
    description: "Envia um e-mail para um endereço",
    parametersJsonSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "O endereço de e-mail do destinatário",
        },
        subject: {
          type: "string",
          description: "O assunto do e-mail",
        },
        message: {
          type: "string",
          description: "O corpo da mensagem",
        },
      },
      required: ["to", "subject", "message"],
    },
  },
};

const allDefinitions = [getEmails, sendEmail];

export { allDefinitions };
