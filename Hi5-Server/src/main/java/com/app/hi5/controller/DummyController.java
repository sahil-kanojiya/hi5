package com.app.hi5.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/dummy")
@RequiredArgsConstructor
public class DummyController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello world";
    }
}
