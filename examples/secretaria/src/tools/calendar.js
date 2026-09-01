// Dados fake da agenda, guardados só em memória.
// Cada chave é uma data (yyyy-mm-dd) e o valor é a lista de eventos daquele dia.
const calendar = {
  "2025-04-29": [
    {
      title: "Reunião de Planejamento do Projeto",
      time: "10:00",
      attendees: ["Ana Silva", "Carlos Mendes", "João Pereira"],
    },
  ],
  "2025-04-30": [
    {
      title: "Apresentação de Resultados do Trimestre",
      time: "15:30",
      attendees: ["Mariana Costa", "Eduardo Lima"],
    },
  ],
  "2025-05-01": [
    {
      title: "Feriado do Dia do Trabalhador",
      time: "00:00",
    },
    {
      title: "Churrasco em família",
      time: "13:00",
      attendees: ["Rafael Oliveira", "Carla Souza", "Beatriz Rocha"],
    },
  ],
  "2025-05-02": [
    {
      title: "Almoço com equipe",
      time: "12:30",
      attendees: ["Carla Souza", "Rafael Oliveira"],
    },
    {
      title: "Reunião com cliente externo",
      time: "17:00",
      attendees: ["Carlos Mendes", "Mariana Costa"],
    },
  ],
  "2025-05-03": [
    {
      title: "Workshop de Inovação",
      time: "09:00",
      attendees: ["Beatriz Rocha", "Fernando Gomes", "Lucas Almeida"],
    },
  ],
  "2025-05-04": [
    {
      title: "Reunião de feedback individual",
      time: "16:00",
    },
    {
      title: "Sessão de brainstorming para novo produto",
      time: "18:30",
      attendees: ["Ana Silva", "João Pereira", "Eduardo Lima"],
    },
  ],
  "2025-05-05": [
    {
      title: "Apresentação para diretoria",
      time: "14:00",
      attendees: ["Carlos Mendes", "Mariana Costa", "Lucas Almeida"],
    },
  ],
};

// A data é fixa de propósito: assim o exemplo é determinístico e sempre "cai"
// dentro do calendário fake acima. Num sistema real, isto seria `new Date()`.
const getTodayDate = {
  function: () => {
    return "2025-05-01";
  },
  declaration: {
    name: "getTodayDate",
    description: "Retorna a data de hoje no formato yyyy-mm-dd",
  },
};

const getEvents = {
  function: ({ date }) => {
    return calendar[date] ?? [];
  },
  declaration: {
    name: "getEvents",
    description: "Retorna os eventos do calendário para um determinado dia",
    parametersJsonSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description:
            "A data para a qual queremos os eventos, no formato yyyy-mm-dd",
        },
      },
      required: ["date"],
    },
  },
};

const checkAvailability = {
  function: ({ date, time }) => {
    const eventList = calendar[date] ?? [];
    const conflict = eventList.find((event) => event.time === time);

    if (conflict) {
      return `Ocupado: já existe "${conflict.title}" às ${time} em ${date}.`;
    }

    return `Livre: nenhum compromisso às ${time} em ${date}.`;
  },
  declaration: {
    name: "checkAvailability",
    description:
      "Verifica se um horário específico está livre na agenda de um dia",
    parametersJsonSchema: {
      type: "object",
      properties: {
        date: {
          type: "string",
          description: "A data a consultar, no formato yyyy-mm-dd",
        },
        time: {
          type: "string",
          description: "A hora a consultar, no formato HH:MM",
        },
      },
      required: ["date", "time"],
    },
  },
};

const scheduleEvent = {
  function: ({ title, date, time, attendees }) => {
    const eventList = calendar[date] ?? [];
    eventList.push({
      title: title,
      time: time,
      attendees: attendees ?? [],
    });

    calendar[date] = eventList;
    return "Evento adicionado com sucesso!";
  },
  declaration: {
    name: "scheduleEvent",
    description: "Marca um novo evento na agenda",
    parametersJsonSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "O título do evento",
        },
        date: {
          type: "string",
          description: "A data do evento, no formato yyyy-mm-dd",
        },
        time: {
          type: "string",
          description: "A hora do evento, no formato HH:MM",
        },
        attendees: {
          type: "array",
          items: { type: "string" },
          description: "Lista de nomes de convidados para o evento",
        },
      },
      required: ["title", "date", "time"],
    },
  },
};

const rescheduleEvent = {
  function: ({ title, date, newTime }) => {
    const eventList = calendar[date] ?? [];
    const eventIndex = eventList.findIndex((event) => event.title === title);

    if (eventIndex === -1) {
      return "Evento não encontrado";
    }

    calendar[date][eventIndex].time = newTime;
    return "Evento alterado com sucesso!";
  },
  declaration: {
    name: "rescheduleEvent",
    description: "Remarca um evento na agenda para um novo horário",
    parametersJsonSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "O título do evento para remarcar",
        },
        date: {
          type: "string",
          description: "A data do evento, no formato yyyy-mm-dd",
        },
        newTime: {
          type: "string",
          description: "O novo horário do evento, no formato HH:MM",
        },
      },
      required: ["title", "date", "newTime"],
    },
  },
};

const allDefinitions = [
  getTodayDate,
  getEvents,
  checkAvailability,
  scheduleEvent,
  rescheduleEvent,
];

export { allDefinitions };
