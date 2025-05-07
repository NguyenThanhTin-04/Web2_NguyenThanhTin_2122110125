package com.example.NguyenThanhTin.controller;

import com.example.NguyenThanhTin.domain.OrderDetail;
import com.example.NguyenThanhTin.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping
    public List<OrderDetail> getAll() {
        return orderDetailService.getAllOrderDetails();
    }

    @GetMapping("/{id}")
    public OrderDetail getById(@PathVariable int id) {
        return orderDetailService.getOrderDetailById(id);
    }

    @PostMapping
    public OrderDetail create(@RequestBody OrderDetail orderDetail) {
        return orderDetailService.createOrderDetail(orderDetail);
    }

    @PutMapping("/{id}")
    public OrderDetail update(@PathVariable int id, @RequestBody OrderDetail orderDetail) {
        return orderDetailService.updateOrderDetail(id, orderDetail);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        orderDetailService.deleteOrderDetail(id);
    }
}
