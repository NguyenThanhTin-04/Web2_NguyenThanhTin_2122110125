// package com.example.NguyenThanhTin.domain;

// import jakarta.persistence.*;
// import lombok.*;

// import java.util.Date;

// @Entity
// @Table(name = "product_sale") // Tên bảng trong CSDL
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @ToString
// public class ProductSale {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng
//     private int id;

//     @Column(name = "product_id", nullable = false)
//     private int productId;

//     @Column(name = "price_sale", nullable = false)
//     private float priceSale;

//     @Temporal(TemporalType.DATE)
//     @Column(name = "date_begin", nullable = false)
//     private Date dateBegin;

//     @Temporal(TemporalType.DATE)
//     @Column(name = "date_end", nullable = false)
//     private Date dateEnd;
// }
