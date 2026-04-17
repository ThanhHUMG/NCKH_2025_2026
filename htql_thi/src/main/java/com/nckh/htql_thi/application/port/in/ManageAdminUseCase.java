package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.User;

public interface ManageAdminUseCase {

    User createStudentAccount(String username, String password, Long msv);

    User createTeacherAccount(String username, String password, Long maGiaoVien);
}