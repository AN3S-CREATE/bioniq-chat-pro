# Data Models and Database Schema

The Bioniq Chat Pro workspace includes structured `.json` databases within the `projects/` folder representing Taskade database templates. This document acts as a schema reference for those files.

## Database Entities

### 1. Customer Database ([`EdTX81Qs3i4JwPxs.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/projects/EdTX81Qs3i4JwPxs.json))
Stores consumer accounts, active plans, language settings, and monthly fee attributes.
*   `Customer Status` (`@cust3`): Select list (`active`, `inactive`, `suspended`, `pending`).
*   `WhatsApp ID` (`@cus10`): Mobile identity string (e.g., `27825550123@c.us`).
*   `Internet Plan` (`@cust4`): Description of subscribed line speed.
*   `Monthly Fee` (`@cust9`): Currency value format representing ZAR.
*   `Phone Number` (`@cust1`) / `Email Address` (`@cust2`).

### 2. Product Inventory ([`HPpKWYiSMBbn6Ta8.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/projects/HPpKWYiSMBbn6Ta8.json))
Describes available physical network nodes and setup kits.
*   `Product Name` (`@pro1`)
*   `Category` (`@pro2`): Select list (`Hardware`, `Installation`).
*   `Price` (`@pro3`): Numeric price in ZAR.
*   `Stock Status` (`@pro4`): Select list (`in-stock`, `out-of-stock`).
*   `SKU` (`@pro5`): Unique identifier (e.g., `PROD-001`).

### 3. Support Tickets ([`NTEpfNJa25HGekRL.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/projects/NTEpfNJa25HGekRL.json))
Tracks user tickets, categories, assignee handlers, and priority values.
*   `Ticket Status` (`@tic3`): Select list (`open`, `in-progress`, `resolved`).
*   `Priority` (`@tic4`): Priority rating (`low`, `medium`, `high`, `critical`).
*   `Category` (`@tic5`): Issue classification (`billing`, `technical`, `speed`, `outage`).
*   `Customer Phone` (`@tic1`) / `Customer Name` (`@tic2`).

### 4. Installation Appointments ([`S9ZKbhB6t7DYcjFt.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/projects/S9ZKbhB6t7DYcjFt.json))
Maintains dates and details for site fiber setup routines.
*   `Appointment Date` (`@app5`): DateTime value.
*   `Installer Name` (`@app1`): Field engineer handle.
*   `Appointment Status` (`@app3`): Select list (`scheduled`, `completed`, `cancelled`).

### 5. Order Management ([`ZGP7PY6VQiAhvEpK.json`](file:///C:/Users/verac/OneDrive - Salaria/Github_All/AN3S-CREATE/bioniq-chat-pro/projects/ZGP7PY6VQiAhvEpK.json))
Tracks billing states and delivery numbers for hardware.
*   `Order Status` (`@ord3`): Select list (`processing`, `shipped`, `delivered`, `cancelled`).
*   `Payment Status` (`@ord9`): Select list (`paid`, `unpaid`, `refunded`).
*   `Tracking Number` (`@ord7`): Shipment code.
*   `Total Amount` (`@ord4`).
