package com.nckh.htql_thi.infrastructure.persistence.adapter;

import com.nckh.htql_thi.application.port.out.UserPort;
import com.nckh.htql_thi.domain.entity.User;
import com.nckh.htql_thi.infrastructure.persistence.entity.UserJpaEntity;
import com.nckh.htql_thi.infrastructure.persistence.mapper.ComplexMapper;
import com.nckh.htql_thi.infrastructure.persistence.repository.UserRepository;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UserPersistenceAdapter implements UserPort {
    private final UserRepository repository;
    private final ComplexMapper mapper;

    public UserPersistenceAdapter(UserRepository repository, ComplexMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<User> findById(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return repository.findByUsername(username).map(mapper::toDomain);
    }

    @Override
    public boolean existsByUsername(String username) { return repository.existsByUsername(username); }

    @Override
    public User save(User user) {
        UserJpaEntity saved = repository.save(mapper.toJpaEntity(user));
        return mapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) { repository.deleteById(id); }
}