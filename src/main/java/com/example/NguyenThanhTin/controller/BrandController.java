package com.example.NguyenThanhTin.controller;

import com.example.NguyenThanhTin.domain.Brand;
import com.example.NguyenThanhTin.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*") // Cho phép frontend gọi API
public class BrandController {
    private static final Logger logger = LoggerFactory.getLogger(BrandController.class);
    @Autowired
    private BrandService brandService;

    // GET tất cả các thương hiệu
    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        logger.info("Fetching brand with id: {}", id);
        try {
            Optional<Brand> brand = brandService.getBrandById(id);
            if (brand.isPresent()) {
                logger.info("Found brand: {}", brand.get().getName());
                return ResponseEntity.ok(brand.get());
            } else {
                logger.warn("Brand with id {} not found", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching brand with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }


    // POST tạo mới thương hiệu
    @PostMapping
    public Brand createBrand(@RequestBody Brand brand) {
        return brandService.createBrand(brand);
    }

    // PUT cập nhật thương hiệu
    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody Brand brandDetails) {
        Optional<Brand> optionalBrand = brandService.getBrandById(id);
        if (!optionalBrand.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Brand brand = optionalBrand.get();
        brand.setName(brandDetails.getName());
        Brand updatedBrand = brandService.updateBrand(id, brand);
        return ResponseEntity.ok(updatedBrand);
    }

    // DELETE xóa thương hiệu
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        if (!brandService.getBrandById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
}
