package com.example.studentapp;

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
}
