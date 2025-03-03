package com.example.NguyenThanhTin;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@SpringBootApplication
@RestController 	
@RequestMapping("/products")
public class Hello {
    @GetMapping
    String GetProduct(){
        return "bạn đã lấy sản phẩm ";
    }
    @PostMapping
    public String postProduct() {

        return "bạn đã thêm sản phẩm ";
    }
    @PutMapping("/{id}")
     public String putProduct(@PathVariable int id) {
        
        return "bạn đã cập nhật sản phẩm  id: "+id;
     }
     @DeleteMapping("/{id}")
     public String delProduct(@PathVariable int id) {
        
        return "bạn đã xóa sản phẩm id: "+id;
    }

}
