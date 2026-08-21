# Como as Redes Neurais Funcionam

As redes neurais são uma das técnicas mais populares de IA atualmente. Elas são compostas por "neurônios" artificiais organizados em camadas.

```mermaid
flowchart LR
    subgraph Entrada
        I1((•))
        I2((•))
        I3((•))
    end
    subgraph "Camadas ocultas"
        H1((•))
        H2((•))
        H3((•))
    end
    subgraph Saída
        O1((•))
    end
    I1 --> H1
    I1 --> H2
    I2 --> H1
    I2 --> H2
    I2 --> H3
    I3 --> H2
    I3 --> H3
    H1 --> O1
    H2 --> O1
    H3 --> O1
```

**Camada de entrada:** recebe os dados brutos (como pixels de uma imagem ou palavras convertidas em números).

**Camadas intermediárias (ocultas):** processam a informação, identificando padrões cada vez mais complexos. Nas primeiras camadas, podem ser detectadas bordas simples; nas seguintes, formas mais complexas; e assim por diante.

**Camada de saída:** produz o resultado final (por exemplo, "isso é um gato" ou "isso é um cachorro", ou ainda a próxima palavra de um texto).

Durante o treinamento, a rede faz previsões, compara com as respostas corretas, calcula o erro e ajusta seus parâmetros internos para melhorar. Esse processo se repete milhares ou milhões de vezes até que a rede fique precisa.
