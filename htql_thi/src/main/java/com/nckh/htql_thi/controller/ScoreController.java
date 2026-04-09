package com.nckh.htql_thi.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nckh.htql_thi.dto.request.score.ScoreCreationRequest;
import com.nckh.htql_thi.entity.Score;
import com.nckh.htql_thi.service.ScoreService;

@RestController
@RequestMapping("/score")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    @PostMapping
    public Score createScore(@RequestBody ScoreCreationRequest request) {
        return scoreService.createScore(request);
    }

    @GetMapping
    public List<Score> getScores() {
        return scoreService.getScores();
    }

    @GetMapping("/{scoreId}")
    public Score getScore(@PathVariable Long scoreId) {
        return scoreService.getScore(scoreId);
    }

    @PutMapping("/{scoreId}")
    public Score updateScore(@PathVariable Long scoreId, @RequestBody ScoreCreationRequest request) {
        return scoreService.updateScore(scoreId, request);
    }

    @DeleteMapping("/{scoreId}")
    public String deleteScore(@PathVariable Long scoreId) {
        scoreService.deleteScore(scoreId);
        return "Bản ghi điểm ID: " + scoreId + " đã được xóa thành công.";
    }

    @PostMapping("/import")
    public String importScores(@RequestParam("file") MultipartFile file) {
        try {
            scoreService.importScores(file);
            return "Import danh sách điểm từ Excel thành công!";
        } catch (Exception e) {
            return "Lỗi khi import điểm: " + e.getMessage();
        }
    }
}