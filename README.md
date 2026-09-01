# CareSync - Healthcare Management Platform for Clinical Operations

CareSync is a production-grade, full-stack hospital administration and clinical operations management system. It provides an integrated platform connecting reception scheduling, doctor diagnostics, prescription logging, patient history timelines, and analytics dashboards under a robust role-based security layer.

---

## 1. TECHNICAL STACK

### Backend
* **Java 17+** & **Spring Boot 3.2.2**
* **Spring Security** (stateless session, JWT token authentication, BCrypt password hashing)
* **Spring MVC** (REST controllers, bean validation, custom exceptions filtering)
* **Spring Data JPA** & **Hibernate** (Object-Relational Mapping, relational constraint enforcement, dialect translation)
* **MySQL** (Relational database storage engine)
* **Lombok** (Boilerplate generation)
* **Maven** (Project compilation and dependency tracking)

### Frontend
* **React.js 18** (Vite build engine, TypeScript compiling, Tailwind CSS styling)
* **React Router Dom 6** (Client-side routing guard controls)
* **Axios** (Centralized API client with JWT headers injection interceptors)
* **React Hook Form** & **Zod** (Form validator schema bindings)
* **Recharts** (Interactive charting widgets)
* **Lucide React** (Unified icon pack)
* **React Toastify** (Status notification alerts)

---

## 2. SYSTEM ARCHITECTURE

```
                                  [ Vite Dev Server / Port 5173 ]
                                                │
                                    Axios Requests via API Interceptor
                                                │
                                                ▼
                                  [ Spring Boot REST / Port 8080 ]
                                                │
                             ┌──────────────────┴──────────────────┐
                             ▼                                     ▼
                     [ Spring Security ]                   [ Service Layer ]
                             │                                     │
                             ▼                                     ▼
                      [ JWT Claims ]                        [ JPA / ORM ]
                                                                   │
                                                                   ▼
                                                             [ MySQL DB ]
```

### Main Directories Layout
```
project-1/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/healthcare/management/
│       │   ├── config/             # DB Initializer, Security filters configuration
│       │   ├── controller/         # REST API endpoints mapping
│       │   ├── dto/                # Request and Response payloads representation
│       │   ├── entity/             # JPA Relational mapping objects
│       │   ├── exception/          # Centralized Exception Handler & JSON response structures
│       │   ├── mapper/             # Static mapping utilities (DTO <-> Entity)
│       │   ├── repository/         # Database repositories (JPA Queries)
│       │   ├── security/           # TokenProvider, UserDetails, JWT Filter
│       │   └── service/            # Business validation interfaces and services
│       └── resources/              # application.properties (Datasources, Secrets)
├── frontend/
│   ├── vite.config.ts              # Proxy redirect configs
│   ├── tailwind.config.js          # Color palettes and utility settings
│   ├── package.json                # Frontend packages list
│   └── src/
│       ├── assets/                 # Custom CSS rules
│       ├── components/             # Reusable widgets (Badge, Modal, Sidebar, Navbar)
│       ├── context/                # AuthContext (local storage session caching)
│       ├── pages/                  # Auth form, Dashboards, and CRUD sheets
│       ├── services/               # Centralized Axios services (Patient, Doctor, Scheduler)
│       ├── types/                  # TypeScript contract interface declarations
│       └── App.tsx                 # Client routing controls
└── docker-compose.yml              # Database containers
```

---

## 3. RELATIONAL SCHEMA EXPLANATION

* **`users`**: Contains credential logs for login. Stores emails, hashed passwords, roles (`ADMIN`, `DOCTOR`, `RECEPTIONIST`, `PATIENT`), and names.
* **`specializations`**: List of medical fields (e.g. Cardiologist, Pediatrician).
* **`departments`**: Clinical departments (e.g. Cardiology, Pediatrics).
* **`doctors`**: Maps doctor parameters. Connects to `users` (Account), `specializations`, and `departments`. Enforces unique license numbers.
* **`patients`**: Stores demographic particulars, emergency contacts, medical profiles (allergies, medical histories), and active statuses. Optionally links to a login account.
* **`appointments`**: Manages schedules. Maps to `patients` and `doctors`. Includes date, time, status (`BOOKED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`), and reasons. Enforces double-booking prevention.
* **`clinical_operations`**: Represents the clinical routing pipeline. Includes check-in timestamp, discharge timestamp, token codes, and states (`WAITING`, `CHECKED_IN`, `WITH_DOCTOR`, `UNDER_TREATMENT`, `COMPLETED`, `DISCHARGED`).
* **`medical_records`**: Encounter notes filed by doctors during diagnosis. Connects to patients and doctors. Includes symptoms, final diagnoses, treatment descriptions, and notes.
* **`prescriptions`**: Medication logs child-mapped to a specific `medical_record`. Includes name, dosages, frequencies, durations, and instructions.

---

## 4. DEFAULT LOGIN CREDENTIALS

The database is pre-seeded with these test credentials on startup:

| Role | Username / Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@clinic.com` | `admin123` | Master configuration rights |
| **Doctor** | `doctor1@clinic.com` | `doctor123` | Dr. Sarah Jenkins (Cardiologist) |
| **Doctor** | `doctor2@clinic.com` | `doctor123` | Dr. Robert Chen (Neurologist) |
| **Receptionist** | `receptionist@clinic.com` | `receptionist123` | Front Desk Operator (Sarah Connor) |
| **Patient** | `patient1@clinic.com` | `patient123` | John Doe |

---

## 5. GETTING STARTED

### Prerequisites
* **Java SDK 17+**
* **Node.js (v18+) & npm (v9+)**
* **MySQL Database** running locally or via Docker.

### Running MySQL via Docker
In the project root folder, execute:
```bash
docker compose up -d
```
*Note: If Docker is unavailable, verify MySQL is running locally on port 3306, and create a database named `healthcare_management`.*

### Running the Spring Boot Backend
1. Open the `backend/src/main/resources/application.properties` file. Adjust the `spring.datasource.username` and `spring.datasource.password` properties if they differ from your local MySQL configuration.
2. Open a terminal in the `backend` directory and compile/run the application:
```bash
# Using Maven wrapper or local Maven install
mvn spring-boot:run
```
The server starts on port `8080`.

### Running the Vite React Frontend
1. Open a terminal in the `frontend` directory.
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
The client-side app launches on `http://localhost:5173`. Sign in using one of the test accounts above.

---

## 6. BUSINESS LOGIC SCENARIOS COVERED

1. **Double Booking Prevention**: Attempting to book the same Doctor at the same Date and Time throws a `409 Conflict` (or `400 Bad Request`) error.
2. **Consultation State Transitions**: Patient transitions: `WAITING` -> `CHECKED_IN` -> `WITH_DOCTOR` -> `UNDER_TREATMENT` -> `COMPLETED` -> `DISCHARGED`.
3. **Medical Recording Integration**: Creating a consultation diagnosis automatically:
   * Sets the corresponding appointment status to `COMPLETED`.
   * Sets the patient's queue status in `clinical_operations` to `COMPLETED`.
   * Registers nested prescriptions in a single transaction database commit.
4. **Role Boundary Security**:
   * Patients can only view their own appointments, profiles, and medical timelines.
   * Doctors can view all patients, query active records, and issue diagnostics/medications.
   * Receptionists can register patients, manage queue tokens, check-in patients, and schedule slots.
