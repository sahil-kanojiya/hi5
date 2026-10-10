package com.app.Hi5.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/dummy")
@RequiredArgsConstructor
public class DummyController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello world";
    }

    //    @PreAuthorize("hasRole('USER')")
    //    @GetMapping("/hello")
    //    public String hello(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    //        System.out.println(userDetails);
    //        System.out.println("userDetails.getUsername() = " + userDetails.getUsername());
    //        System.out.println("userDetails.getPassword() = " + userDetails.getPassword());
    //        System.out.println("userDetails.getAuthorities() = " + userDetails.getAuthorities());
    //        System.out.println("userDetails.getUser() = " + userDetails.getUser());
    //        return "hello world user";
    //    }
    //    @PreAuthorize("hasRole('ADMIN')")
    //    @GetMapping("/hello-admin")
    //    public String hello_admin(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    //        System.out.println(userDetails);
    //        return "hello world admin";
    //    }

}
