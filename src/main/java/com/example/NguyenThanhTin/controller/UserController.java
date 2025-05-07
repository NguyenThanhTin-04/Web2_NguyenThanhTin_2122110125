package com.example.NguyenThanhTin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.NguyenThanhTin.domain.User;
import com.example.NguyenThanhTin.Jwt.JwtUtil;
import com.example.NguyenThanhTin.dto.Login;
import com.example.NguyenThanhTin.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // Lưu tạm token đăng ký để xác minh khi login
    private final Map<String, String> registrationTokens = new HashMap<>();

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        // Nếu là admin thì cấp role admin
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER"); // Mặc định là USER nếu không có role
        }
    
        User savedUser = userService.createUser(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());
    
        // Lưu token để kiểm tra khi login
        registrationTokens.put(savedUser.getEmail(), token);
    
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đăng ký thành công");
        response.put("email", savedUser.getEmail());
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
        @RequestBody Login loginRequest,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractSubject(token);
            if (email != null && !email.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "Bạn đã đăng nhập từ trước", "email", email));
            }
        }
    
        List<User> allUsers = userService.getAllUsers();
        Optional<User> userOptional = allUsers.stream()
            .filter(u -> u.getEmail().equals(loginRequest.getEmail()))
            .findFirst();
    
        if (userOptional.isPresent()) {
            User user = userOptional.get();
    
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String newToken = jwtUtil.generateToken(user.getEmail());
    
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Đăng nhập thành công");
                response.put("token", newToken);
                response.put("email", user.getEmail());
                response.put("id", user.getId());
                response.put("role", user.getRole()); // ✅ Thêm dòng này
    
                return ResponseEntity.ok(response);
    
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Mật khẩu không đúng"));
            }
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Email không tồn tại"));
        }
    }
    

    // GET tất cả người dùng
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();  // Lấy tất cả người dùng từ service
        return ResponseEntity.ok(users);  // Trả về danh sách người dùng
    }

    // GET thông tin người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);  // Tìm người dùng theo ID
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());  // Trả về 404 nếu không tìm thấy
    }

    // PUT cập nhật thông tin người dùng
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.getUserById(id).map(existingUser -> {
            existingUser.setName(userDetails.getName());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setRole(userDetails.getRole());
            User updatedUser = userService.updateUser(id, existingUser);
            return ResponseEntity.ok(updatedUser);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userService.getUserById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
}
