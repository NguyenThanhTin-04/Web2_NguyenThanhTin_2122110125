package com.example.NguyenThanhTin.service.impl;

import com.example.NguyenThanhTin.domain.OrderDetail;
import com.example.NguyenThanhTin.repository.OrderDetailRepository;
import com.example.NguyenThanhTin.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Override
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    @Override
    public OrderDetail getOrderDetailById(int id) {
        return orderDetailRepository.findById(id).orElse(null);
    }

    @Override
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public OrderDetail updateOrderDetail(int id, OrderDetail orderDetail) {
        return orderDetailRepository.findById(id).map(existing -> {
            existing.setOrderId(orderDetail.getOrderId());
            existing.setProductId(orderDetail.getProductId());
            existing.setQuantity(orderDetail.getQuantity());
            existing.setPrice(orderDetail.getPrice());
            return orderDetailRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("OrderDetail not found"));
    }

    @Override
    public void deleteOrderDetail(int id) {
        orderDetailRepository.deleteById(id);
    }
}
