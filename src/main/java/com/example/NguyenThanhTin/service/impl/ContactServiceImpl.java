package com.example.NguyenThanhTin.service.impl;

import com.example.NguyenThanhTin.domain.Contact;
import com.example.NguyenThanhTin.repository.ContactRepository;
import com.example.NguyenThanhTin.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public Contact getContactById(Long id) {
        return contactRepository.findById(id).orElse(null);
    }

    @Override
    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public Contact updateContact(Long id, Contact updatedContact) {
        return contactRepository.findById(id).map(existing -> {
            existing.setName(updatedContact.getName());
            existing.setContent(updatedContact.getContent());
            return contactRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    @Override
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
}
