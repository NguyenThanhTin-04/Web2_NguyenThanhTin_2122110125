// package com.example.NguyenThanhTin.domain;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;
// import lombok.ToString;

// @Entity
// @Table(name = "product_root") // Tên bảng trong CSDL
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @ToString
// public class ProductRoot {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng
//     private int id;

//     @Column(name = "product_id", nullable = false)
//     private int productId;

//     @Column(name = "price_root", nullable = false)
//     private float priceRoot;
// }
