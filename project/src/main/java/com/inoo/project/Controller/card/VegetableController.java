package com.inoo.project.Controller.card;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.Gson;

@Controller
@RequestMapping("memory-cards")
public class VegetableController {

    //24.08.05.월요일 추가 요청사항 구현
    @GetMapping("vegetables")
    public String vegetables(Model model){

        List<String> imagePaths = new ArrayList<>();
        List<String> imageNames = new ArrayList<>();
        try {
            
            String absPath = "src/main/webapp/image/fruit";
            Path directory = Paths.get(absPath);

            // 디렉토리 내 파일 목록을 읽어옴
            List<Path> files = Files.list(directory)
                                    .filter(Files::isRegularFile)   //일반파일(즉, 디렉토리가 아닌 파일)인지 확인하는 코드
                                    .collect(Collectors.toList());

            // 이미지 파일만 필터링하여 경로 리스트에 추가
            for (Path file : files) {
                
                String fileName = file.getFileName().toString().toLowerCase();
                imageNames.add(fileName.replace(".jpg", ""));
                if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png"))
                    imagePaths.add("/image/fruit/" + file.getFileName().toString());
            }
        } catch (IOException e) {
            
            e.printStackTrace();
        }

        //System.out.println("파일들 :" + imagePaths);
        model.addAttribute("names",  new Gson().toJson(imageNames)); // JSON 형식으로 변환하여 모델에 추가
        model.addAttribute("images", new Gson().toJson(imagePaths));
        return "user/vegetable";
    }
}
