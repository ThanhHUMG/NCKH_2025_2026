package com.nckh.htql_thi.infrastructure.security;

import com.nckh.htql_thi.application.port.out.UserPort;
import com.nckh.htql_thi.domain.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserPort userPort;

    public CustomUserDetailsService(UserPort userPort) {
        this.userPort = userPort;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userPort.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user"));

        String roleName = user.getRole().name().toUpperCase().replace("ROLE_", "");

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + roleName))
        );
    }
}