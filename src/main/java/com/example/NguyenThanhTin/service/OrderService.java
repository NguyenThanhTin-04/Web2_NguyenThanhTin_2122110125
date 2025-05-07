package com.example.NguyenThanhTin.service;

import com.example.NguyenThanhTin.domain.Order;


import java.util.List;

public interface OrderService {
    List<Order> getAllOrders();
    Order getOrderById(int id);
    Order saveOrder(Order order);
    void deleteOrder(int id);
    // 👇 Thêm dòng này
    List<Order> getOrdersByUserId(Long userId);
}