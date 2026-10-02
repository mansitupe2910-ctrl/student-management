package com.example.studentapp.controller;

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
@CrossOrigin(origins = "*") // Cross-origin enabled at controller level in addition to CorsConfig
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
}
