# API Node.js para Gerenciamento e Processamento de Medições + Google Gemini

![gemini](https://github.com/user-attachments/assets/99799501-c847-4174-b0b7-e88393bdffde)

Este projeto é uma API desenvolvida em Node.js para gerenciar e processar medições de consumo de água e gás. A API é integrada com o Google Gemini, utilizando suas capacidades de visão e processamento de linguagem natural para extrair e analisar valores de medidores a partir de imagens. Faz parte do teste técnico para a vaga de desenvolvedor.

## Funcionalidades

- Upload de leituras de medidores com processamento de imagem
- Confirmação de leituras de medidores
- Listagem de medições por cliente e tipo
- Integração com a IA Gemini do Google para análise de imagens

## Pré-requisitos

- Docker
- Chave de API do Google Gemini

## Instalação e Configuração

1. Clone o repositório:

   ```
   git clone <url-do-repositório>
   cd measurement-api-shopper
   ```

2. A aplicação está totalmente dockerizada. Use o seguinte comando para iniciar todos os serviços:

   ```
   docker-compose up --build
   ```

3. A aplicação estará exposta na porta 80.

## Variáveis de Ambiente

A aplicação espera um arquivo `.env` no diretório raiz com o seguinte formato:

```
GEMINI_API_KEY=<chave_da_API>
```

## Endpoints da API

- `POST /upload`: Faz upload de uma nova imagem de leitura de medidor
- `PATCH /confirm`: Confirma uma leitura de medidor
- `GET /:customer_code/list`: Lista medições para um cliente

Para testar a API, você pode usar o arquivo `api.http` na raiz do projeto. Este arquivo contém uma série de requisições que você pode executar diretamente no com a extensão do VSCode [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) ou em qualquer outro cliente HTTP.
