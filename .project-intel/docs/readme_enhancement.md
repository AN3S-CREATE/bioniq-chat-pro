# Project Overview: Bioniq Chat Pro

Bioniq Chat Pro is an interactive customer support chat micro-app designed to look like WhatsApp Business. It serves as a visual frontend skin and connector for a Taskade Parade AI Agent, configured for the Bioniq ISP (Internet Service Provider) business.

## Core Capabilities
*   **WhatsApp Emulation**: Native-looking WhatsApp Business interface complete with custom bubble tails, message delivery tick marks (sending, sent, delivered, read), typing states, and status indicator.
*   **Taskade Parade Connection**: Interacts with the Taskade public conversations endpoint `/api/taskade/` to initialize conversations and stream chat responses.
*   **Theme Integration**: Listens for style updates from Taskade's parent iframe builder to dynamically switch themes (light/dark mode) and adjust accent colors.

## Repository Layout
*   [`manifest.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/manifest.json): Configuration and export metadata for the Taskade Space.
*   [`agents/`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/agents/): Contains the Taskade AI Agent prompt configurations (`01K8BSAKNHPDZHBSZ3RV4DK9E9.json`).
*   [`projects/`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/projects/): Structured database mockups exported from Taskade containing Customer Databases, Support Tickets, Product Inventories, and Installation Schedules.
*   [`apps/default/`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/apps/default/): The primary React template source folder.
