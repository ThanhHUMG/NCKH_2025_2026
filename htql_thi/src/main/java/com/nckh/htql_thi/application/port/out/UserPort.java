package com.nckh.htql_thi.application.port.out;

import com.nckh.htql_thi.domain.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserPort {

    List<User> findAll();

    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    User save(User user);

    void deleteById(Long id);
}