package com.example.NguyenThanhTin.Jwt;

import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret-key}")
    private String SECRET_KEY;  // Lấy từ application.properties
    private final long EXPIRATION_TIME = 86400000; // 1 day

    // Hàm tạo token JWT
    public String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)  // Sử dụng SECRET_KEY cho việc ký
                .compact();
    }

    // Kiểm tra token có hợp lệ hay không
    public boolean validateToken(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes()) // Sử dụng JWT mới nhất để tạo JwtParser
                    .build();
            Claims claims = parser.parseClaimsJws(token).getBody();  // Kiểm tra tính hợp lệ và lấy thông tin claims
            return !claims.getExpiration().before(new Date());  // Kiểm tra thời gian hết hạn
        } catch (Exception e) {
            // Ghi log lỗi hoặc thông báo không hợp lệ
            System.out.println("Token không hợp lệ hoặc hết hạn: " + e.getMessage());
            return false;  // Token không hợp lệ
        }
    }

    // Lấy subject từ token (thường là username hoặc email)
    public String extractSubject(String token) {
        try {
            JwtParser parser = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes())  // Sử dụng JWT mới nhất
                    .build();
            Claims claims = parser.parseClaimsJws(token).getBody();
            return claims.getSubject();  // Trả về subject từ token
        } catch (Exception e) {
            // Xử lý lỗi khi không thể trích xuất thông tin từ token
            System.out.println("Không thể trích xuất thông tin từ token: " + e.getMessage());
            return null;
        }
    }
}