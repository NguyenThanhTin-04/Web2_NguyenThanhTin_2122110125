package com.example.NguyenThanhTin.service;

import com.example.NguyenThanhTin.domain.Cart;

import java.util.List;

public interface CartService {
    List<Cart> findByUserId(Long userId);
    Cart getCartById(Long id); // thêm dòng này
    Cart addToCart(Cart cart);
    List<Cart> findAll(); 
    Cart updateQuantity(Long id, Integer quantity);
    void removeFromCart(Long id);
}