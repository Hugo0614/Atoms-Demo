# Project Requirements: Atoms AI Agent Demo

## Overview
We are building a web-based AI coding assistant platform inspired by Atoms.dev. The goal is to provide a unified workspace where users can describe a web application component in natural language, and an AI agent will plan, write, and instantly render the code in a live, in-browser sandbox environment.

## Core Features
1. **User Authentication:** Users must be able to sign up, log in, and maintain secure sessions to access their workspace.
2. **AI-Driven Development Workflow:** A conversational interface where users prompt the AI. The AI should generate functional React/Tailwind code based on the prompt.
3. **In-Browser IDE & Live Preview:** The generated code must instantly render in an isolated, client-side sandbox environment so the user can test the UI without leaving the browser or setting up a local environment.
4. **Persistent Project Storage:** All generated code, dependencies, and chat history must be saved to a database linked to the user's account, allowing them to resume work later.

## Advanced Feature (Differentiator)
* **Multi-Agent Visualization Graph:** To provide transparency into the AI's reasoning, the UI will feature a visual node-based graph. When a prompt is submitted, the graph will highlight which "Agent" is currently active (e.g., Planner Agent -> Developer Agent -> Reviewer Agent) and show the data flow between them.