# HomeServiceHub: System Design & Documentation

This document provides a comprehensive overview of the **HomeServiceHub** architecture, data flow, entity relationships, and functional use cases.

---

## 1. Architectural Design
The system follows a **MERN Stack** (MongoDB, Express, React, Node.js) architecture, leveraging a decoupled client-server model.

### Architecture Overview
- **Frontend**: React.js with Vite for high-performance builds. State management is handled via Redux Toolkit. Styling is implemented using Tailwind CSS for a responsive, utility-first design.
- **Backend**: Node.js and Express.js provide a RESTful API. JWT (JSON Web Tokens) are used for stateless authentication.
- **Database**: MongoDB (NoSQL) stores document-based data for flexible schemas (Services, Providers, Users).
- **Security**: Password hashing with Bcrypt, CORS for cross-origin requests, and middleware-level authorization.

```mermaid
graph TD
    User((User/Client))
    Provider((Service Provider))
    Admin((System Admin))

    subgraph "Frontend (React + Vite)"
        UI[UI Components]
        Redux[Redux Store]
        Router[React Router]
    end

    subgraph "Backend (Node + Express)"
        Auth[Auth Middleware]
        Controllers[API Controllers]
        Routes[API Routes]
    end

    subgraph "Database (MongoDB)"
        DB[(Mongoose Models)]
    end

    User --> UI
    Provider --> UI
    Admin --> UI
    UI --> Redux
    Redux --> Router
    Router --> Routes
    Routes --> Auth
    Auth --> Controllers
    Controllers --> DB
```

---

## 2. Data Flow Diagram (DFD - Level 1)
The Data Flow Diagram illustrates how information moves through the HomeServiceHub system.

```mermaid
graph LR
    User[User]
    System((HomeServiceHub System))
    DB[(Database)]
    Provider[Service Provider]

    User -- "1. Registration/Login" --> System
    System -- "2. Auth Token/Session" --> User
    
    User -- "3. Search/Book Service" --> System
    System -- "4. Save Booking" --> DB
    System -- "5. Notify Provider" --> Provider
    
    Provider -- "6. Accept/Complete Service" --> System
    System -- "7. Update Status" --> DB
    System -- "8. Payment Processing" --> DB
```

---

## 3. ER Diagram (Entity Relationship)
The ER Diagram defines the relationship between core entities like Users, Providers, Services, and Bookings.

```mermaid
erDiagram
    USER ||--o{ BOOKING : makes
    USER ||--|| WALLET : owns
    USER {
        string name
        string email
        string password
        string role
    }
    PROVIDER ||--o{ SERVICE : offers
    PROVIDER ||--o{ BOOKING : receives
    PROVIDER {
        string businessName
        string bio
        string kycStatus
    }
    SERVICE ||--o{ BOOKING : "is booked"
    SERVICE {
        string title
        float price
        string category
    }
    CATEGORY ||--o{ SERVICE : contains
    CATEGORY {
        string name
        string icon
    }
    BOOKING ||--|| REVIEW : has
    BOOKING {
        date date
        string status
        float totalAmount
    }
    WALLET ||--o{ TRANSACTION : logs
    TRANSACTION {
        float amount
        string type
        date timestamp
    }
```

---

## 4. Use Case Diagram of SAP (Service Application Platform)
This diagram covers the high-level interactions of all actors with the main platform.

```mermaid
graph TD
    User((User))
    Provider((Service Provider))
    Admin((Admin))

    subgraph "HomeServiceHub Platform"
        UC1([Browse Services])
        UC2([Book Service])
        UC3([Register as Provider])
        UC4([Manage Bookings])
        UC5([Manage Platform Users])
        UC6([Analyze Revenue])
        UC7([Process Payments])
    end

    User --- UC1
    User --- UC2
    User --- UC3
    Provider --- UC4
    Provider --- UC7
    Admin --- UC5
    Admin --- UC6
    Admin --- UC4
```

---

## 5. UI/UX Design of SAP
The UI/UX design is centered around **accessibility**, **trust**, and **efficiency**.

### Design Principles
- **Clarity**: High-contrast typography and clear call-to-action (CTA) buttons.
- **Consistency**: Unified color palette (Deep Blue, Slate Gray, and Mint Green for success states).
- **Responsiveness**: Mobile-first approach ensuring 100% functionality on handheld devices.

### Key Screens
1. **Landing Page**: Search bar for services, top-rated categories, and "How it works" section.
2. **Service Listing**: Grid view with filters for price, rating, and location.
3. **Booking Flow**: A 3-step wizard (Select Date/Time -> Enter Address -> Payment).
4. **Interactive Dashboards**: Data visualization using charts for earnings (Providers) and booking history (Users).

---

## 6. Use Case Diagram: Provider Registration
Specific flow for onboarding new service providers.

```mermaid
graph TD
    PP((Prospective Provider))
    A((Admin))

    subgraph "Registration Module"
        R1([Fill Personal Info])
        R2([Upload KYC Docs])
        R3([Select Service Categories])
        R4([Verify Identity])
        R5([Approve/Reject Application])
    end

    PP --- R1
    PP --- R2
    PP --- R3
    A --- R4
    A --- R5
```

---

## 7. Use Case Diagram: Service Management Module
Focuses on how providers manage their offerings.

```mermaid
graph TD
    P((Service Provider))

    subgraph "Service Management"
        S1([Add New Service])
        S2([Edit Service Pricing])
        S3([Set Availability/Slot])
        S4([Delete/Deactivate Service])
        S5([View Service Analytics])
    end

    P --- S1
    P --- S2
    P --- S3
    P --- S4
    P --- S5
```

---

## 8. Use Case Diagram: User Dashboard
Interactions available to the customer role.

```mermaid
graph TD
    U((User))

    subgraph "User Dashboard"
        D1([View Active Bookings])
        D2([Cancel Booking])
        D3([Add Review/Rating])
        D4([Manage Wallet/Credits])
        D5([Update Profile])
        D6([Track Provider Location])
    end

    U --- D1
    U --- D2
    U --- D3
    U --- D4
    U --- D5
    U --- D6
```

---

## 9. Use Case Diagram: Provider Dashboard
Interactions available to the service provider role.

```mermaid
graph TD
    P((Service Provider))

    subgraph "Provider Dashboard"
        PD1([Accept/Reject Requests])
        PD2([Update Service Status])
        PD3([View Earning Reports])
        PD4([Manage Schedule])
        PD5([Respond to Reviews])
    end

    P --- PD1
    P --- PD2
    P --- PD3
    P --- PD4
    P --- PD5
```
