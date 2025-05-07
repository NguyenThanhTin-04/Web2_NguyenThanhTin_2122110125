package com.example.NguyenThanhTin.service;

import com.example.NguyenThanhTin.domain.Contact;

import java.util.List;

public interface ContactService {
    List<Contact> getAllContacts();
    Contact getContactById(Long id);
    Contact saveContact(Contact contact);
    void deleteContact(Long id);
    Contact updateContact(Long id, Contact updatedContact);

}
