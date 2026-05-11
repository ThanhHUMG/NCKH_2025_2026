package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.HocKiJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HocKiRepository extends JpaRepository<HocKiJpaEntity, Long> {}