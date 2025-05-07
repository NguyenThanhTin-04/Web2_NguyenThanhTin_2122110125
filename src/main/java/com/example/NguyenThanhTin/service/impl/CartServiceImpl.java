package com.example.NguyenThanhTin.service.impl;

import com.example.NguyenThanhTin.domain.Cart;
import com.example.NguyenThanhTin.domain.Product;
import com.example.NguyenThanhTin.domain.User;
import com.example.NguyenThanhTin.repository.CartRepository;
import com.example.NguyenThanhTin.repository.ProductRepository;
import com.example.NguyenThanhTin.repository.UserRepository;
import com.example.NguyenThanhTin.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Cart> findByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    public Cart getCartById(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cart với id: " + id));
    }

    @Override
public List<Cart> findAll() {
    return cartRepository.findAll();
}


    @Override
    public Cart addToCart(Cart cart) {
        Product product = productRepository.findById(cart.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product with id " + cart.getProduct().getId() + " not found"));

        User user = userRepository.findById(cart.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User with id " + cart.getUser().getId() + " not found"));

        List<Cart> existingCarts = cartRepository.findByUserId(cart.getUser().getId());
        for (Cart existingCart : existingCarts) {
            if (existingCart.getProduct().getId().equals(cart.getProduct().getId())) {
                existingCart.setQuantity(existingCart.getQuantity() + cart.getQuantity());
                return cartRepository.save(existingCart);
            }
        }

        cart.setProduct(product);
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateQuantity(Long id, Integer quantity) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Override
    public void removeFromCart(Long id) {
        cartRepository.deleteById(id);
    }
}