package com.example.wordex_backend.services;

import com.example.wordex_backend.model.User;
import com.example.wordex_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        System.out.println("Finding user by email: " + email); // Debug log
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.out.println("User not found with email: " + email); // Debug log
        }
        return user;
    }
    
    public User getUserByUserName(String userName) {
        System.out.println("Finding user by username: " + userName); // Debug log
        User user = userRepository.findByUserName(userName);
        if (user == null) {
            System.out.println("User not found with username: " + userName); // Debug log
        }
        return user;
    }
    

    // Get a user by ID
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Update an existing user
    public User updateUser(String id, User updatedUser) {
        Optional<User> existingUserOptional = userRepository.findById(id);
        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            // Update fields
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setBirthDate(updatedUser.getBirthDate());
            existingUser.setMobileNumber(updatedUser.getMobileNumber());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setUserName(updatedUser.getUserName());
            existingUser.setPassword(updatedUser.getPassword());
            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    // Delete a user by ID
    public void deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
}
