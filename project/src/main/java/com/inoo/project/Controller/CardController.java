package com.inoo.project.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("card")
public class CardController {
    
    @GetMapping("list")
    public String list(){

        return "user/list";
    }

    @GetMapping("main")
    public String main(){

        return "user/card";
    }
}
