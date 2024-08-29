# API de Medição de Consumo de Água e Gás

Este projeto é uma API Node.js para gerenciar e processar medições, especialmente para medidores de água e gás. Faz parte do teste técnico para a vaga de desenvolvedor.

## Funcionalidades

- Upload de leituras de medidores com processamento de imagem
- Confirmação de leituras de medidores
- Listagem de medições por cliente e tipo
- Integração com a IA Gemini do Google para análise de imagens

## Pré-requisitos

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

Para uso detalhado da API, consulte o arquivo `api.http` na raiz do projeto.
