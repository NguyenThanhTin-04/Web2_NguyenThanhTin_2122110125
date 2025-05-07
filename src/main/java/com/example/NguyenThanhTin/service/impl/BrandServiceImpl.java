package com.example.NguyenThanhTin.service.impl;

import com.example.NguyenThanhTin.domain.Brand;
import com.example.NguyenThanhTin.repository.BrandRepository;
import com.example.NguyenThanhTin.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Autowired
    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public Optional<Brand> getBrandById(Long id) {
        return brandRepository.findById(id);  // Trả về thương hiệu nếu tìm thấy ID
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public Brand updateBrand(Long id, Brand brand) {
        return brandRepository.findById(id).map(existingBrand -> {
            existingBrand.setName(brand.getName());
            return brandRepository.save(existingBrand);
        }).orElseThrow(() -> new RuntimeException("Brand not found"));
    }

    @Override
    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found");
        }
        brandRepository.deleteById(id);
    }
}
