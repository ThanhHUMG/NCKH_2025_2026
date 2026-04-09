package com.nckh.htql_thi.dto.request.score;

import lombok.Data;

@Data
public class ScoreUpdateRequest {
    private Long studentMsv;
    private Long examId;
    private Double diemA;
    private Double diemB;
    private Double diemC;
}
