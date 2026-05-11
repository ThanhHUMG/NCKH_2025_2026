package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.MonHocJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonHocRepository extends JpaRepository<MonHocJpaEntity, Long> {}