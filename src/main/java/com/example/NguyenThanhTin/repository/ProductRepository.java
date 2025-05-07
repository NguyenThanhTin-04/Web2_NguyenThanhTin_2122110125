package com.example.NguyenThanhTin.repository;

import com.example.NguyenThanhTin.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.brand.id = :brandId")
    List<Product> findByBrandId(@Param("brandId") Long brandId);

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.brand.id = :brandId")
    List<Product> findByCategoryIdAndBrandId(@Param("categoryId") Long categoryId, @Param("brandId") Long brandId);
}
