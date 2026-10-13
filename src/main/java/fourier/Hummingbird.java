package fourier;

import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.util.List;

import static fourier.OutlineBuilder.CORNER;
import static fourier.OutlineBuilder.SMOOTH;

/**
 * 벌새 실루엣 외곽선. 좌표는 x 가 오른쪽, y 가 아래쪽인 1000 x 912 크기의 기준 공간이다.
 *
 * <p>부리 끝에서 출발해 머리 - 등 - 치켜든 날개 - 펼친 날개 - 꼬리 - 배 순서로 한 바퀴 돈다.
 * 깃털 끝처럼 뾰족한 구간은 {@link OutlineBuilder#CORNER}, 몸통처럼 매끄러운 구간은
 * {@link OutlineBuilder#SMOOTH} 로 표시한다.
 */
public class Hummingbird {
    private static final double[] OUTLINE = {
        // 부리 윗면
        1000, 272, CORNER,
        753, 285, CORNER,

        // 머리와 등
        704, 273, SMOOTH,
        652, 288, SMOOTH,
        622, 311, SMOOTH,
        592, 326, SMOOTH,
        556, 348, CORNER,

        // 치켜든 날개의 앞전
        532, 285, SMOOTH,
        494, 210, SMOOTH,
        447, 125, SMOOTH,
        391, 51, SMOOTH,
        348, 11, SMOOTH,
        318, 0, CORNER,

        // 치켜든 날개의 톱니 모양 뒷전
        313, 51, CORNER,
        337, 75, CORNER,
        318, 101, CORNER,
        348, 139, CORNER,
        330, 161, CORNER,
        358, 195, CORNER,
        339, 217, CORNER,
        369, 251, CORNER,
        352, 273, CORNER,
        384, 307, CORNER,
        369, 330, CORNER,
        405, 363, CORNER,
        391, 382, CORNER,
        433, 410, CORNER,

        // 펼친 날개의 윗면
        326, 367, SMOOTH,
        213, 322, SMOOTH,
        101, 266, SMOOTH,
        36, 228, SMOOTH,
        0, 213, CORNER,

        // 펼친 날개의 톱니 모양 아랫면
        22, 243, CORNER,
        60, 236, CORNER,
        30, 262, CORNER,
        82, 277, CORNER,
        67, 303, CORNER,
        124, 326, CORNER,
        109, 352, CORNER,
        169, 375, CORNER,
        154, 401, CORNER,
        213, 423, CORNER,
        199, 446, CORNER,
        258, 468, CORNER,
        243, 491, CORNER,
        303, 509, CORNER,
        292, 532, CORNER,
        348, 543, CORNER,

        // 갈라진 꼬리
        307, 603, SMOOTH,
        232, 678, SMOOTH,
        157, 753, SMOOTH,
        82, 813, SMOOTH,
        51, 831, CORNER,
        191, 790, CORNER,
        107, 912, CORNER,

        // 배와 가슴
        195, 828, SMOOTH,
        307, 715, SMOOTH,
        420, 612, SMOOTH,
        513, 528, SMOOTH,
        597, 453, SMOOTH,
        663, 388, SMOOTH,
        704, 341, SMOOTH,
        723, 313, SMOOTH,

        // 부리 아랫면
        753, 300, CORNER
    };

    private Hummingbird() {
    }

    public static Path2D.Double createPath() {
        return OutlineBuilder.buildClosedPath(OUTLINE);
    }

    public static List<Point2D.Double> samplePointList(int count) {
        return OutlineBuilder.resample(
            createPath(),
            count
        );
    }
}
