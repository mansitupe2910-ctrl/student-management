# Simple Student Management System (Spring Boot + H2 + Vanilla JS)

A clean, beginner-friendly full-stack application built with Java, Spring Boot, Spring Data JPA, H2 In-Memory Database, and a modern single-page HTML5/Vanilla JavaScript frontend.

---

## 1. Project Architecture & Folder Structure

```text
student-management-system/
├── pom.xml                                      # Maven project configuration & dependencies
├── README.md                                    # Documentation and setup instructions
├── frontend/
│   └── index.html                               # Standalone Frontend (HTML5, CSS3, Fetch API)
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── example/
        │           └── studentapp/
        │               ├── StudentManagementApplication.java  # Spring Boot main entry & seeder
        │               ├── config/
        │               │   └── CorsConfig.java                # Global Cross-Origin configuration
        │               ├── controller/
        │               │   └── StudentController.java         # REST API endpoints (/api/students)
        │               ├── model/
        │               │   └── Student.java                   # JPA Entity mapped to H2 database
        │               └── repository/
        │                   └── StudentRepository.java         # Spring Data JPA CRUD repository
        └── resources/
            └── application.properties           # Server, H2 database & JPA properties
```

---

## 2. Tech Stack & Dependencies

| Component | Technology | Description |
|---|---|---|
| **Backend** | Java 17+, Spring Boot 3.3.4 | Standard enterprise framework |
| **Web Layer** | Spring Web (Spring MVC) | RESTful API controllers |
| **Persistence** | Spring Data JPA (Hibernate) | ORM, queries, and repositories |
| **Database** | H2 Database (In-Memory) | Zero installation, runs inside the JVM |
| **Frontend** | HTML5, CSS3, JavaScript | Pure Vanilla JS with Fetch API |

---

## 3. Quick Start: How to Run the Backend

### Prerequisites
- **JDK 17** or newer installed (`java -version`)
- **Apache Maven 3.8+** installed (`mvn -version`)

### Execution Steps
1. Open your terminal and navigate to the project directory:
   ```bash
   cd student-management-system
   ```

2. Compile and run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(Or if you use Maven Wrapper: `./mvnw spring-boot:run`)*

3. Spring Boot will start on port `8080`. You will see:
   ```text
   ==================================================
    Student Management System is up and running!     
    Backend API:  http://localhost:8080/api/students 
    H2 Console:   http://localhost:8080/h2-console   
   ==================================================
   ```

---

## 4. How to Open and Test the Frontend

1. Navigate into the `frontend/` folder.
2. Simply double-click `index.html` to open it in Google Chrome, Firefox, Safari, or Edge.
3. Alternatively, serve it via any local web server:
   - **VS Code**: Right-click `index.html` and click **"Open with Live Server"**.
   - **Python 3**:
     ```bash
     cd frontend
     python3 -m http.server 3000
     ```
     Then open `http://localhost:3000`.

Because **CORS is globally enabled** in `CorsConfig.java` and `StudentController.java`, the frontend can connect without any cross-origin restrictions.

---

## 5. H2 In-Memory Database Web Console

Spring Boot includes a built-in web management interface for H2:

1. Open your browser and go to:
   ```
   http://localhost:8080/h2-console
   ```
2. Enter the connection settings from `application.properties`:
   - **Saved Settings**: `Generic H2 (Embedded)`
   - **Driver Class**: `org.h2.Driver`
   - **JDBC URL**: `jdbc:h2:mem:studentdb`
   - **User Name**: `sa`
   - **Password**: *(leave blank)*
3. Click **Connect**.
4. In the SQL query window, run:
   ```sql
   SELECT * FROM students;
   ```
   You will see the live records managed by Spring Data JPA!

---

## 6. REST API Endpoints & Sample cURL Requests

The Spring Boot backend exposes three REST endpoints under `/api/students`:

### A. GET /api/students — Fetch all students
```bash
curl -X GET http://localhost:8080/api/students \
     -H "Accept: application/json"
```

**Sample Response (HTTP 200 OK):**
```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice.johnson@university.edu",
    "department": "Computer Science"
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob.smith@university.edu",
    "department": "Mechanical Engineering"
  }
]
```

---

### B. POST /api/students — Add a new student
```bash
curl -X POST http://localhost:8080/api/students \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Eleanor Vance",
       "email": "eleanor.vance@university.edu",
       "department": "Physics"
     }'
```

**Sample Response (HTTP 201 Created):**
```json
{
  "id": 4,
  "name": "Eleanor Vance",
  "email": "eleanor.vance@university.edu",
  "department": "Physics"
}
```

---

### C. DELETE /api/students/{id} — Delete a student by ID
```bash
curl -X DELETE http://localhost:8080/api/students/1
```

**Sample Response:**
`HTTP 204 No Content` (Empty body on successful deletion)

---

### D. GET /api/students/{id} — Fetch single student by ID
```bash
curl -X GET http://localhost:8080/api/students/2
```

**Sample Response (HTTP 200 OK):**
```json
{
  "id": 2,
  "name": "Bob Smith",
  "email": "bob.smith@university.edu",
  "department": "Mechanical Engineering"
}
```
