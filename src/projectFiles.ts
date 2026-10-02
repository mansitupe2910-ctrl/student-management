/**
 * Project files definition for the Spring Boot + H2 + Vanilla JS project.
 * Used for both the in-app code explorer and the one-click ZIP exporter.
 */

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  description: string;
  category: 'config' | 'java' | 'frontend' | 'docs';
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    language: 'xml',
    category: 'config',
    description: 'Maven Project Object Model: Defines dependencies for Spring Boot Web, Spring Data JPA, and H2 database.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.example</groupId>
    <artifactId>student-management-system</artifactId>
    <version>1.0.0</version>
    <name>student-management-system</name>
    <description>Simple Student Management System built with Spring Boot, Spring Data JPA, H2 Database, and Vanilla JS</description>

    <properties>
        <java.version>17</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Spring Boot Starter Web: For RESTful APIs, Spring MVC, and embedded Tomcat -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Starter Data JPA: For ORM with Hibernate and automated CRUD repositories -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- H2 In-Memory Database: Zero external setup needed, runs entirely in RAM -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot Starter Test: JUnit and Mockito test utilities -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Spring Boot Maven Plugin: Packages application as an executable jar -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/resources/application.properties',
    name: 'application.properties',
    language: 'properties',
    category: 'config',
    description: 'Spring Boot configuration: sets server port to 8080, configures the H2 in-memory URL, enables Hibernate SQL logging, and turns on the web H2 console.',
    content: `# ==============================================================
# Server Configuration
# ==============================================================
server.port=8080

# ==============================================================
# H2 In-Memory Database Configuration
# ==============================================================
# In-memory database named 'studentdb'. DB_CLOSE_DELAY=-1 keeps data alive while JVM runs.
spring.datasource.url=jdbc:h2:mem:studentdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# ==============================================================
# Spring Data JPA / Hibernate Configuration
# ==============================================================
# Automatically creates or updates table schema based on @Entity annotations
spring.jpa.hibernate.ddl-auto=update
# Display SQL statements in console for learning and debugging
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# ==============================================================
# H2 Web Console Configuration
# ==============================================================
# Access the web-based database management console at http://localhost:8080/h2-console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.web-allow-others=true`
  },
  {
    path: 'src/main/java/com/example/studentapp/model/Student.java',
    name: 'Student.java',
    language: 'java',
    category: 'java',
    description: 'JPA Entity representing a student in the database. Maps to the "students" table with an auto-generated primary key (id), name, unique email, and department.',
    content: `package com.example.studentapp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Student Entity representing a student record in the H2 Database.
 * Maps to the "students" table in the database.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String department;

    // Default No-Args Constructor (Required by JPA/Hibernate)
    public Student() {
    }

    // Parameterized Constructor
    public Student(String name, String email, String department) {
        this.name = name;
        this.email = email;
        this.department = department;
    }

    public Student(Long id, String name, String email, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}`
  },
  {
    path: 'src/main/java/com/example/studentapp/repository/StudentRepository.java',
    name: 'StudentRepository.java',
    language: 'java',
    category: 'java',
    description: 'Spring Data JPA interface extending JpaRepository<Student, Long>. Provides findAll(), save(), findById(), and deleteById() out of the box with zero boilerplate.',
    content: `package com.example.studentapp.repository;

import com.example.studentapp.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for the Student entity.
 * Provides out-of-the-box CRUD operations such as findAll(), save(),
 * findById(), deleteById(), and custom query derivation.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Derived query method to find student by email
    Optional<Student> findByEmail(String email);

    // Derived query method to find all students in a department
    List<Student> findByDepartment(String department);
}`
  },
  {
    path: 'src/main/java/com/example/studentapp/controller/StudentController.java',
    name: 'StudentController.java',
    language: 'java',
    category: 'java',
    description: 'REST Controller mapping /api/students. Implements GET /api/students, POST /api/students, and DELETE /api/students/{id} with validation and HTTP response codes.',
    content: `package com.example.studentapp.controller;

import com.example.studentapp.model.Student;
import com.example.studentapp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller exposing student management API endpoints.
 * Base path: /api/students
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*") // Cross-origin enabled at controller level
public class StudentController {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * GET /api/students
     * Retrieve all students from the database.
     *
     * @return List of students and HTTP 200 OK
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    /**
     * GET /api/students/{id}
     * Retrieve a single student by ID.
     *
     * @param id Student unique identifier
     * @return Student if found (HTTP 200) or HTTP 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> studentData = studentRepository.findById(id);
        return studentData
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * POST /api/students
     * Add a new student to the database.
     *
     * @param student The student object sent in the JSON request body
     * @return The saved student entity with auto-generated ID and HTTP 201 Created
     */
    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        // Basic validation
        if (student.getName() == null || student.getName().trim().isEmpty() ||
            student.getEmail() == null || student.getEmail().trim().isEmpty() ||
            student.getDepartment() == null || student.getDepartment().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Name, Email, and Department are all required fields.");
        }

        // Check if email already exists
        if (studentRepository.findByEmail(student.getEmail().trim()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Error: A student with email '" + student.getEmail() + "' already exists.");
        }

        student.setName(student.getName().trim());
        student.setEmail(student.getEmail().trim());
        student.setDepartment(student.getDepartment().trim());

        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }

    /**
     * DELETE /api/students/{id}
     * Delete a student by their ID.
     *
     * @param id Student unique identifier to remove
     * @return HTTP 204 No Content if deleted, or HTTP 404 Not Found if id does not exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Error: Student with ID " + id + " does not exist.");
        }

        studentRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // HTTP 204 No Content
    }
}`
  },
  {
    path: 'src/main/java/com/example/studentapp/config/CorsConfig.java',
    name: 'CorsConfig.java',
    language: 'java',
    category: 'java',
    description: 'Global CORS Configuration bean allowing web browsers to make GET, POST, and DELETE calls from any port or domain without browser security blocks.',
    content: `package com.example.studentapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global Cross-Origin Resource Sharing (CORS) Configuration.
 * Allows frontend applications (such as standalone index.html opened via file://,
 * Live Server, or modern web frameworks) to communicate freely with the backend REST API.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}`
  },
  {
    path: 'src/main/java/com/example/studentapp/StudentManagementApplication.java',
    name: 'StudentManagementApplication.java',
    language: 'java',
    category: 'java',
    description: 'Main Spring Boot application runner annotated with @SpringBootApplication. Includes a CommandLineRunner bean that seeds sample student records into H2 on launch.',
    content: `package com.example.studentapp;

import com.example.studentapp.model.Student;
import com.example.studentapp.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Main Spring Boot Application Entry Point.
 */
@SpringBootApplication
public class StudentManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" Student Management System is up and running!     ");
        System.out.println(" Backend API:  http://localhost:8080/api/students ");
        System.out.println(" H2 Console:   http://localhost:8080/h2-console   ");
        System.out.println("==================================================");
    }

    /**
     * Optional sample data seeder: Populates initial sample records upon startup.
     */
    @Bean
    public CommandLineRunner initData(StudentRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Student("Alice Johnson", "alice.johnson@university.edu", "Computer Science"));
                repository.save(new Student("Bob Smith", "bob.smith@university.edu", "Mechanical Engineering"));
                repository.save(new Student("Clara Oswald", "clara.oswald@university.edu", "Electrical Engineering"));
                System.out.println(">> Seeded 3 initial sample students into H2 in-memory database.");
            }
        };
    }
}`
  },
  {
    path: 'frontend/index.html',
    name: 'index.html',
    language: 'html',
    category: 'frontend',
    description: 'Clean, modern single-page frontend with embedded CSS and Vanilla JavaScript using standard Fetch API to connect with the Spring Boot REST endpoints.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Management System</title>
  <style>
    :root {
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --danger: #dc2626;
      --danger-hover: #b91c1c;
      --danger-light: #fef2f2;
      --success: #16a34a;
      --success-light: #f0fdf4;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --radius: 8px;
      --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-family); background-color: var(--bg-color); color: var(--text-main); line-height: 1.5; padding: 2rem 1rem; min-height: 100vh; }
    .container { max-width: 1000px; margin: 0 auto; }
    header { margin-bottom: 2rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
    .brand-title { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; color: var(--text-main); }
    .brand-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem; }
    .endpoint-badge { font-family: monospace; font-size: 0.8125rem; color: var(--text-muted); background: #f1f5f9; padding: 0.35rem 0.75rem; border-radius: var(--radius); border: 1px solid var(--border-color); }
    .dashboard-grid { display: grid; grid-template-columns: 320px 1fr; gap: 1.75rem; }
    @media (max-width: 860px) { .dashboard-grid { grid-template-columns: 1fr; } }
    .card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow); }
    .card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; }
    .card-subtitle { font-size: 0.8125rem; color: var(--text-muted); font-weight: 400; font-variant-numeric: tabular-nums; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; font-size: 0.8125rem; font-weight: 500; color: var(--text-main); margin-bottom: 0.375rem; }
    input[type="text"], input[type="email"], select { width: 100%; padding: 0.625rem 0.75rem; font-size: 0.875rem; border: 1px solid var(--border-color); border-radius: var(--radius); background: #ffffff; color: var(--text-main); outline: none; transition: border-color 0.15s ease; }
    input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
    .btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 0.625rem 1rem; font-size: 0.875rem; font-weight: 500; border-radius: var(--radius); border: 1px solid transparent; cursor: pointer; transition: background-color 0.15s ease; }
    .btn-primary { background-color: var(--primary); color: #ffffff; }
    .btn-primary:hover { background-color: var(--primary-hover); }
    .btn-danger-outline { background: transparent; color: var(--danger); border: 1px solid #fecaca; padding: 0.35rem 0.75rem; font-size: 0.8125rem; width: auto; border-radius: 6px; cursor: pointer; }
    .btn-danger-outline:hover { background: var(--danger-light); border-color: var(--danger); }
    .alert { padding: 0.75rem 1rem; font-size: 0.8125rem; border-radius: var(--radius); margin-bottom: 1rem; display: none; }
    .alert-success { background-color: var(--success-light); color: #14532d; border: 1px solid #bbf7d0; }
    .alert-danger { background-color: var(--danger-light); color: #7f1d1d; border: 1px solid #fecaca; }
    .table-container { width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
    th { padding: 0.75rem 1rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border-color); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc; }
    td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border-color); color: var(--text-main); vertical-align: middle; }
    tbody tr:hover { background-color: #f8fafc; }
    .col-id { font-family: monospace; font-size: 0.8125rem; color: var(--text-muted); font-variant-numeric: tabular-nums; width: 60px; }
    .col-actions { text-align: right; width: 90px; }
    .empty-state, .loading-state { text-align: center; padding: 3rem 1rem; color: var(--text-muted); font-size: 0.875rem; }
    .badge-dept { color: var(--text-muted); font-size: 0.8125rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1 class="brand-title">Student Management System</h1>
        <p class="brand-subtitle">Spring Boot REST API + Spring Data JPA + H2 In-Memory Database</p>
      </div>
      <div class="endpoint-badge">
        API: <span>http://localhost:8080/api/students</span>
      </div>
    </header>

    <div id="alertBox" class="alert"></div>

    <div class="dashboard-grid">
      <!-- Add Student Form -->
      <section class="card">
        <h2 class="card-title">Add New Student</h2>
        <form id="studentForm">
          <div class="form-group">
            <label for="studentName">Full Name *</label>
            <input type="text" id="studentName" placeholder="e.g. Eleanor Vance" required autocomplete="off">
          </div>
          <div class="form-group">
            <label for="studentEmail">Email Address *</label>
            <input type="email" id="studentEmail" placeholder="e.g. eleanor@university.edu" required autocomplete="off">
          </div>
          <div class="form-group">
            <label for="studentDept">Academic Department *</label>
            <select id="studentDept" required>
              <option value="" disabled selected>Select department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Mathematics & Statistics">Mathematics & Statistics</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
          <button type="submit" id="submitBtn" class="btn btn-primary">
            <span>Add Student</span>
          </button>
        </form>
      </section>

      <!-- Student List Table -->
      <section class="card">
        <div class="card-title">
          <span>Registered Students</span>
          <span class="card-subtitle" id="studentCount">0 students</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="col-id">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th class="col-actions">Action</th>
              </tr>
            </thead>
            <tbody id="studentTableBody"></tbody>
          </table>
          <div id="loadingState" class="loading-state" style="display: none;">Loading students from backend...</div>
          <div id="emptyState" class="empty-state" style="display: none;">No students found in the database. Use the form to add one!</div>
        </div>
      </section>
    </div>
  </div>

  <script>
    const API_BASE_URL = 'http://localhost:8080/api/students';
    const studentForm = document.getElementById('studentForm');
    const studentNameInput = document.getElementById('studentName');
    const studentEmailInput = document.getElementById('studentEmail');
    const studentDeptInput = document.getElementById('studentDept');
    const studentTableBody = document.getElementById('studentTableBody');
    const studentCount = document.getElementById('studentCount');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');
    const alertBox = document.getElementById('alertBox');
    const submitBtn = document.getElementById('submitBtn');

    function showAlert(message, type = 'success') {
      alertBox.textContent = message;
      alertBox.className = 'alert alert-' + type;
      alertBox.style.display = 'block';
      clearTimeout(alertBox.dismissTimer);
      alertBox.dismissTimer = setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
    }

    // GET /api/students
    async function fetchStudents() {
      loadingState.style.display = 'block';
      emptyState.style.display = 'none';
      try {
        const response = await fetch(API_BASE_URL, { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const students = await response.json();
        renderTable(students);
      } catch (err) {
        studentTableBody.innerHTML = '';
        studentCount.textContent = 'Error';
        showAlert('Could not reach Spring Boot backend (' + API_BASE_URL + '). Ensure it is running.', 'danger');
      } finally {
        loadingState.style.display = 'none';
      }
    }

    function renderTable(students) {
      studentTableBody.innerHTML = '';
      studentCount.textContent = students.length + (students.length === 1 ? ' student' : ' students');
      if (!students || students.length === 0) {
        emptyState.style.display = 'block';
        return;
      }
      emptyState.style.display = 'none';
      students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td class="col-id">#\${student.id}</td>
          <td><strong>\${escapeHtml(student.name)}</strong></td>
          <td>\${escapeHtml(student.email)}</td>
          <td><span class="badge-dept">\${escapeHtml(student.department)}</span></td>
          <td class="col-actions">
            <button class="btn-danger-outline" onclick="deleteStudent(\${student.id}, '\${escapeHtml(student.name)}')">Delete</button>
          </td>
        \`;
        studentTableBody.appendChild(row);
      });
    }

    // POST /api/students
    studentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const payload = {
        name: studentNameInput.value.trim(),
        email: studentEmailInput.value.trim(),
        department: studentDeptInput.value.trim()
      };
      submitBtn.disabled = true;
      submitBtn.innerText = 'Saving...';
      try {
        const res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.status === 201 || res.status === 200) {
          const created = await res.json();
          showAlert('Student "' + created.name + '" added successfully!', 'success');
          studentForm.reset();
          fetchStudents();
        } else {
          const err = await res.text();
          showAlert(err || 'Failed to add student (HTTP ' + res.status + ')', 'danger');
        }
      } catch (err) {
        showAlert('Error: ' + err.message, 'danger');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Add Student';
      }
    });

    // DELETE /api/students/{id}
    async function deleteStudent(id, name) {
      if (!confirm('Are you sure you want to delete student "' + name + '" (ID #' + id + ')?')) return;
      try {
        const res = await fetch(API_BASE_URL + '/' + id, { method: 'DELETE' });
        if (res.status === 204 || res.status === 200) {
          showAlert('Student ID #' + id + ' deleted.', 'success');
          fetchStudents();
        } else {
          showAlert('Failed to delete student.', 'danger');
        }
      } catch (err) {
        showAlert('Error deleting: ' + err.message, 'danger');
      }
    }

    function escapeHtml(str) {
      return (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
    }

    document.addEventListener('DOMContentLoaded', fetchStudents);
  </script>
</body>
</html>`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    category: 'docs',
    description: 'Complete documentation detailing architecture, step-by-step maven build and run instructions, frontend testing guide, and sample curl commands.',
    content: `# Simple Student Management System (Spring Boot + H2 + Vanilla JS)

A clean, beginner-friendly full-stack application built with Java, Spring Boot, Spring Data JPA, H2 In-Memory Database, and a modern single-page HTML5/Vanilla JavaScript frontend.

---

## 1. Project Architecture & Folder Structure

\`\`\`text
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
\`\`\`

---

## 2. Quick Start: How to Run the Backend

### Prerequisites
- **JDK 17** or newer installed (\`java -version\`)
- **Apache Maven 3.8+\` installed (\`mvn -version\`)

### Execution Steps
1. Open your terminal and navigate to the project directory:
   \`\`\`bash
   cd student-management-system
   \`\`\`

2. Compile and run the Spring Boot application using Maven:
   \`\`\`bash
   mvn spring-boot:run
   \`\`\`

3. Spring Boot will start on port \`8080\`:
   - Backend API: \`http://localhost:8080/api/students\`
   - H2 Console: \`http://localhost:8080/h2-console\`

---

## 3. How to Open and Test the Frontend

1. Navigate to the \`frontend/\` folder.
2. Open \`index.html\` in any web browser (Chrome, Firefox, Safari, Edge).
3. The frontend uses standard \`fetch()\` to query \`http://localhost:8080/api/students\`.

---

## 4. H2 In-Memory Database Console

1. Navigate to \`http://localhost:8080/h2-console\`.
2. Enter:
   - **JDBC URL**: \`jdbc:h2:mem:studentdb\`
   - **User Name**: \`sa\`
   - **Password**: *(leave blank)*
3. Click **Connect**, then query:
   \`\`\`sql
   SELECT * FROM students;
   \`\`\`

---

## 5. Sample cURL Commands

### GET all students:
\`\`\`bash
curl -X GET http://localhost:8080/api/students -H "Accept: application/json"
\`\`\`

### POST a new student:
\`\`\`bash
curl -X POST http://localhost:8080/api/students \\
     -H "Content-Type: application/json" \\
     -d '{"name":"Eleanor Vance","email":"eleanor@university.edu","department":"Physics"}'
\`\`\`

### DELETE a student by ID:
\`\`\`bash
curl -X DELETE http://localhost:8080/api/students/1
\`\`\`
`
  }
];
