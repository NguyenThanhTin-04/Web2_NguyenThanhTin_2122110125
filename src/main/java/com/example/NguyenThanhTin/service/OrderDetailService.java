package com.example.NguyenThanhTin.service;

import com.example.NguyenThanhTin.domain.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetail> getAllOrderDetails();
    OrderDetail getOrderDetailById(int id);
    OrderDetail createOrderDetail(OrderDetail orderDetail);
    OrderDetail updateOrderDetail(int id, OrderDetail orderDetail);
    void deleteOrderDetail(int id);
}
