# Employee & Family Registry

A full-stack Employee Management System built for the Bangladesh context.  
**Stack:** ASP.NET 10 · PostgreSQL · React 18 · Vite · Tailwind CSS · QuestPDF

---

## Prerequisites

Make sure you have these installed before starting:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [PostgreSQL 17](https://www.postgresql.org/download/)
- [dotnet-ef tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

---

## 1. Database Setup (Local PostgreSQL)

Make sure PostgreSQL is running on your machine.

```bash
# Start PostgreSQL service (Windows)
net start postgresql-x64-17

# Verify it's running
psql -U postgres -c "\l"
```

The default connection string is already configured in `EmployeeRegistry.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=EmployeeRegistryDb;Username=postgres;Password=1234"
}
```

> **Note:** If your PostgreSQL password is different from `1234`, update the connection string before running.

---

## 2. Install EF Core Tools (once per machine)

```bash
dotnet tool install --global dotnet-ef
```

---

## 3. Run Database Migrations

```bash
cd EmployeeRegistry.API
dotnet ef migrations add InitialCreate
```

> **Note:** If `InitialCreate` migration already exists in the `Migrations/` folder, skip this step.

---

## 4. Run the Backend

```bash
cd EmployeeRegistry.API
dotnet run
```

The API will start at `http://localhost:5127`

On first run, the app will automatically:
- Apply all pending migrations
- Create the `EmployeeRegistryDb` database
- Seed **10 realistic Bangladeshi employees** with family details

Swagger UI is available at:
```
http://localhost:5127/swagger
```

---

## 5. Run the Frontend

Open a **second terminal** and run:

```bash
cd employee-registry-client
npm install
npm run dev
```

The React app will start at:
```
http://localhost:5173
```

> **Important:** Keep both terminals running at the same time. The frontend requires the backend to be running.

---

## Project Structure

```
EmployeeFamilyRegistry/
├── EmployeeRegistry.API/              # ASP.NET 10 Web API
│   ├── Controllers/
│   │   └── EmployeesController.cs     # REST endpoints + PDF endpoints
│   ├── Data/
│   │   ├── AppDbContext.cs            # EF Core DbContext
│   │   └── SeedData.cs               # 10 seeded Bangladeshi employees
│   ├── DTOs/
│   │   └── EmployeeDtos.cs            # Request/Response DTOs
│   ├── Mappings/
│   │   └── MappingProfile.cs          # AutoMapper profile
│   ├── Models/
│   │   ├── Employee.cs                # Employee entity
│   │   ├── Spouse.cs                  # One-to-One with Employee
│   │   └── Child.cs                   # One-to-Many with Employee
│   ├── Reports/
│   │   └── PdfService.cs              # QuestPDF — list + CV generation
│   ├── Services/
│   │   └── EmployeeService.cs         # Business logic + search
│   ├── Validators/
│   │   └── EmployeeValidator.cs       # FluentValidation rules
│   └── Program.cs                     # App entry point + DI setup
│
├── employee-registry-client/          # React 18 + Vite frontend
│   └── src/
│       ├── api/
│       │   └── employeeApi.js         # Axios API calls
│       ├── components/
│       │   ├── EmployeeForm.jsx       # Create/Edit form
│       │   ├── EmployeeTable.jsx      # Employee list table
│       │   ├── FamilyDetails.jsx      # Spouse + children display
│       │   └── SearchBar.jsx          # Debounced search (400ms)
│       └── pages/
│           ├── HomePage.jsx           # Directory + search + PDF export
│           ├── AddEmployeePage.jsx    # Create employee
│           ├── EditEmployeePage.jsx   # Edit employee
│           └── EmployeeDetailPage.jsx # Profile view + CV download
│
└── SRS_Document.pdf                   # Software Requirements Specification
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees (optional `?search=`) |
| GET | `/api/employees/{id}` | Get single employee with family |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/{id}` | Update employee and family |
| DELETE | `/api/employees/{id}` | Delete employee (cascades family) |
| GET | `/api/employees/pdf` | Export filtered list as PDF |
| GET | `/api/employees/{id}/pdf` | Download individual employee CV as PDF |

---

## Key Features

- **Global Search** — case-insensitive search by Name, NID, or Department with 400ms debounce
- **Family Management** — one Spouse (One-to-One) and multiple Children (One-to-Many) per employee
- **Validation** — NID must be 10 or 17 digits · Phone must be valid BD format (`+8801XXXXXXXXX` or `01XXXXXXXXX`)
- **PDF Export** — export the current filtered employee list or download an individual employee CV
- **Auto Seeding** — 10 Bangladeshi employees seeded automatically on first run

---

## Packages Used

### Backend
| Package | Purpose |
|---------|---------|
| `Npgsql.EntityFrameworkCore.PostgreSQL` | PostgreSQL ORM |
| `Microsoft.EntityFrameworkCore.Design` | EF Core migrations |
| `FluentValidation.AspNetCore` | Request validation |
| `AutoMapper.Extensions.Microsoft.DependencyInjection` | DTO mapping |
| `QuestPDF` | PDF generation |
| `Swashbuckle.AspNetCore` | Swagger UI |

### Frontend
| Package | Purpose |
|---------|---------|
| `axios` | HTTP client |
| `react-router-dom` | Client-side routing |
| `tailwindcss` | Utility-first CSS |
