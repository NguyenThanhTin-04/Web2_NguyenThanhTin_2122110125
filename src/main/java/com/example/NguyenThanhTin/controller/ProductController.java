package com.example.NguyenThanhTin.controller;

import com.example.NguyenThanhTin.domain.Brand;
import com.example.NguyenThanhTin.domain.Category;
import com.example.NguyenThanhTin.domain.Product;
import com.example.NguyenThanhTin.repository.BrandRepository;
import com.example.NguyenThanhTin.repository.CategoryRepository;
import com.example.NguyenThanhTin.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        logger.info("Fetching all products");
        return productService.getAllProducts();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Product>> getProductsByFilter(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "brandId", required = false) Long brandId) {
        logger.info("Fetching products with filters - categoryId: {}, brandId: {}", categoryId, brandId);
        try {
            List<Product> products;
            if (categoryId != null && brandId != null) {
                products = productService.getProductsByCategoryAndBrand(categoryId, brandId);
            } else if (categoryId != null) {
                products = productService.getProductsByCategory(categoryId);
            } else if (brandId != null) {
                products = productService.getProductsByBrand(brandId);
            } else {
                products = productService.getAllProducts();
            }
            logger.info("Found {} products for filters - categoryId: {}, brandId: {}", products.size(), categoryId,
                    brandId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products for filters - categoryId: {}, brandId: {}: {}", categoryId, brandId,
                    e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.info("Fetching product with id: {}", id);
        try {
            Optional<Product> product = productService.getProductById(id);
            if (product.isPresent()) {
                logger.info("Found product: {}", product.get().getName());
                return ResponseEntity.ok(product.get());
            } else {
                logger.warn("Product with id {} not found", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching product with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<?> createProduct(
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart("price") String price,
            // @RequestPart("quantity") String quantity,
            @RequestPart("category_id") String categoryId,
            @RequestPart("brand_id") String brandId,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        logger.info("Creating new product: {}", name);
        try {
            // Lấy Category và Brand từ repository
            Category category = categoryRepository.findById(Long.parseLong(categoryId))
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            Brand brand = brandRepository.findById(Long.parseLong(brandId))
                    .orElseThrow(() -> new RuntimeException("Brand not found with id: " + brandId));

            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(Double.parseDouble(price));
            // product.setQuantity(Integer.parseInt(quantity));

            Product createdProduct = productService.createProduct(product, category, brand, image);
            logger.info("Created product with id: {}", createdProduct.getId());
            return ResponseEntity.status(201).body(createdProduct);
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage());
            return ResponseEntity.status(500).body("Lỗi khi tạo sản phẩm: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("name") String name,
            @RequestPart("description") String description,
            @RequestPart("price") String price,
            // @RequestPart("quantity") String quantity,
            @RequestPart("category_id") String categoryId,
            @RequestPart("brand_id") String brandId,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        logger.info("Updating product with id: {}", id);
        try {
            // Lấy Category và Brand từ repository
            Category category = categoryRepository.findById(Long.parseLong(categoryId))
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            Brand brand = brandRepository.findById(Long.parseLong(brandId))
                    .orElseThrow(() -> new RuntimeException("Brand not found with id: " + brandId));

            Product productDetails = new Product();
            productDetails.setName(name);
            productDetails.setDescription(description);
            productDetails.setPrice(Double.parseDouble(price));
            // productDetails.setQuantity(Integer.parseInt(quantity));

            Product updatedProduct = productService.updateProduct(id, productDetails, category, brand, image);
            logger.info("Updated product: {}", updatedProduct.getName());
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            logger.warn("Product with id {} not found", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating product with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(500).body("Lỗi khi cập nhật sản phẩm: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting product with id: {}", id);
        try {
            productService.deleteProduct(id);
            logger.info("Deleted product with id: {}", id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.warn("Delete failed: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting product with id {}: {}", id, e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}