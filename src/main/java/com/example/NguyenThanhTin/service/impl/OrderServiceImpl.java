package com.example.NguyenThanhTin.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.NguyenThanhTin.domain.Order;
import com.example.NguyenThanhTin.repository.CartRepository;
import com.example.NguyenThanhTin.repository.OrderRepository;
import com.example.NguyenThanhTin.service.OrderService;

import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(int id) {
        return orderRepository.findById(id).orElse(null);
    }
    @Override
    @Transactional
    public Order saveOrder(Order order) {
        Order savedOrder = orderRepository.save(order);

        Long userId = order.getUser().getId();
        cartRepository.deleteByUserId(userId); // ✅ dùng instance để gọi
        return savedOrder;
    }
    @Override
    public void deleteOrder(int id) {
        orderRepository.deleteById(id);
    }
    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}