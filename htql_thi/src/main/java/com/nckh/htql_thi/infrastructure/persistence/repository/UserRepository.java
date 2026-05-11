package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.UserJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserJpaEntity, Long> {
    Optional<UserJpaEntity> findByUsername(String username);
    boolean existsByUsername(String username);
}