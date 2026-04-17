package com.nckh.htql_thi.application.port.in;

import com.nckh.htql_thi.domain.entity.User;

import java.util.List;

public interface ManageUserUseCase {

    List<User> getAllUsers();

    User getUserById(Long id);

    User getUserByUsername(String username);

    User createAdmin(String username, String password);

    User createStudentAccount(String username, String password, Long msv);

    User createTeacherAccount(String username, String password, Long maGiaoVien);

    void deleteUser(Long id);
}