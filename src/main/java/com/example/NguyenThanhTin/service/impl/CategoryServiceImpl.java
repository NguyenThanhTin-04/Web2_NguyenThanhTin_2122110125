package com.example.NguyenThanhTin.service.impl;

import com.example.NguyenThanhTin.domain.Category;
import com.example.NguyenThanhTin.repository.CategoryRepository;
import com.example.NguyenThanhTin.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category updatedCategory) {
        return categoryRepository.findById(id).map(existingCategory -> {
            existingCategory.setName(updatedCategory.getName());
            return categoryRepository.save(existingCategory);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy category với id: " + id));
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy category để xóa với id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
