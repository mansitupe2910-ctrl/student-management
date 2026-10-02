package com.example.studentapp.repository;

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

    // Custom query method derived automatically by Spring Data JPA
    Optional<Student> findByEmail(String email);

    // Find all students belonging to a specific department
    List<Student> findByDepartment(String department);
}
