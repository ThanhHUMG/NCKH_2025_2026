package com.nckh.htql_thi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.nckh.htql_thi")
@EnableJpaRepositories(basePackages = "com.nckh.htql_thi.repository")
@EntityScan(basePackages = "com.nckh.htql_thi.entity")
public class HtqlThiApplication {
    public static void main(String[] args) {
        SpringApplication.run(HtqlThiApplication.class, args);
    }
}