package com.nckh.htql_thi.infrastructure.persistence.repository;
import com.nckh.htql_thi.infrastructure.persistence.entity.KiThiJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KiThiRepository extends JpaRepository<KiThiJpaEntity, Long> {}