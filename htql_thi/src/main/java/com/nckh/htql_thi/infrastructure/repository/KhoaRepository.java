package com.nckh.htql_thi.infrastructure.repository;

import com.nckh.htql_thi.domain.entity.Khoa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KhoaRepository extends JpaRepository<Khoa, Long> {

    Optional<Khoa> findByTenKhoa(String tenKhoa);

    boolean existsByTenKhoa(String tenKhoa);
}