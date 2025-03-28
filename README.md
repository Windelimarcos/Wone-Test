# Visualizador de Treinos

Este projeto é uma aplicação web simples para visualizar planos de treino armazenados em um arquivo JSON. Ele consiste em um backend feito com FastAPI (Python) e um frontend feito com React e Material UI (MUI).

## Funcionalidades

*   Lista os treinos disponíveis a partir de um arquivo de dados (`workoutPlans.json`).
*   Exibe detalhes de um treino selecionado, incluindo:
    *   Tipo de treino, dono, descrição.
    *   Divisão diária (Treino A, B, C, etc.).
    *   Grupo muscular, intervalo de descanso e dia da semana para cada divisão.
    *   Lista de exercícios com séries/repetições (SxR) e técnicas avançadas para cada dia de treino.

## Tecnologias Utilizadas

*   **Backend:**
    *   Python 3.x
    *   FastAPI
    *   Uvicorn (servidor ASGI)
*   **Frontend:**
    *   Node.js / npm (ou yarn)
    *   React
    *   Material UI (MUI)
    *   Axios (para requisições HTTP)
*   **Dados:**
    *   JSON (`workoutPlans.json`)

## Pré-requisitos

*   Python 3.7 ou superior (com `pip`)
*   Node.js 14 ou superior (com `npm` ou `yarn`)

## Configuração do Projeto

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-da-pasta-do-projeto>
    ```

2.  **Configure o Backend:**
    *   Navegue até a pasta do backend:
        ```bash
        cd backend
        ```
    *   (Opcional, mas recomendado) Crie e ative um ambiente virtual:
        ```bash
        # Windows
        python -m venv venv
        .\venv\Scripts\activate

        # macOS / Linux
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   Instale as dependências Python:
        ```bash
        pip install -r requirements.txt
        # Ou, se não tiver requirements.txt:
        # pip install fastapi uvicorn pydantic
        ```
    *   Certifique-se de que o arquivo `workoutPlans.json` está presente na pasta `backend/`.

3.  **Configure o Frontend:**
    *   Volte para a pasta raiz do projeto (se necessário) e navegue até a pasta do frontend:
        ```bash
        cd ../frontend
        # ou 'cd frontend' se estiver na pasta raiz
        ```
    *   Instale as dependências Node.js:
        ```bash
        npm install
        # ou 'yarn install'
        ```

## Executando a Aplicação

É necessário executar o backend e o frontend separadamente.

1.  **Inicie o Backend:**
    *   Abra um terminal na pasta `backend/`.
    *   Execute o servidor FastAPI com Uvicorn:
        ```bash
        uvicorn main:app --reload --port 8000
        ```
    *   O backend estará rodando em `http://localhost:8000`.

2.  **Inicie o Frontend:**
    *   Abra *outro* terminal na pasta `frontend/`.
    *   Inicie o servidor de desenvolvimento React:
        ```bash
        npm run dev
        # ou 'npm start' se estiver usando Create React App
        # ou 'yarn dev' / 'yarn start'
        ```
    *   O frontend estará acessível no endereço fornecido (geralmente `http://localhost:5173` ou `http://localhost:3000`). Abra este endereço no seu navegador.

Agora você pode navegar pela lista de treinos e visualizar os detalhes de cada um.

## Estrutura do Projeto 