# Component & Module Catalog

This catalog outlines key components in the Bioniq Chat Pro template, separating active runtime components from legacy/inactive ones.

## Active Components

*   [`FullScreenWhatsApp.tsx`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/apps/default/src/components/FullScreenWhatsApp.tsx): The primary component. Renders a full-screen, high-fidelity WhatsApp mockup chat UI. Connects to Taskade APIs and reads response streams.
*   `Loading.tsx` / `Loading.css`: Centered loader spinner styles used during initial app loading.

## Inactive / Bypassed Components (Technical Debt)

The following components are defined under `src/components/` but are currently bypassed:

*   `OldLandingPage.tsx`: The original application landing page containing a multi-tab panel.
*   `Navigation.tsx` / `Header.tsx`: Layout panels for switching between mock demo sections.
*   `AdminPanel.tsx`: Admin dashboard displaying metrics. Contains a hardcoded password check (`admin123`).
*   `SecurityModule.tsx`: Mock view demonstrating account verification steps.
*   `CustomerServiceModule.tsx`: Support ticket visualization panel.
*   `EcommerceModule.tsx`: Inbound order list viewer.
*   `InstallationModule.tsx`: Calendar installation scheduler presentation.
*   `DataIntegrationDemo.tsx`: Page displaying synchronization between systems.
*   `AccessibilityTester.tsx`: Diagnostic panel for checking UI layouts.
*   `WhatYouCanDo.tsx`: List of capabilities description page.
*   `WhatsAppInterface.tsx` / `RealtimeWhatsAppInterface.tsx` / `EnhancedWhatsAppInterface.tsx`: Alternative mock iterations of the WhatsApp interface.
