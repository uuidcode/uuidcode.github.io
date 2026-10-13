package fourier;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Shape;
import java.awt.geom.AffineTransform;
import java.awt.geom.Line2D;
import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;

import javax.imageio.ImageIO;

import static fourier.DiagramStyle.ARROW_FONT;
import static fourier.DiagramStyle.BIRD_COLOR;
import static fourier.DiagramStyle.BODY_FONT;
import static fourier.DiagramStyle.FADED_COLOR;
import static fourier.DiagramStyle.GOLD_COLOR;
import static fourier.DiagramStyle.HEAD_FONT;
import static fourier.DiagramStyle.INK_COLOR;
import static fourier.DiagramStyle.LINE_COLOR;
import static fourier.DiagramStyle.MUTED_COLOR;
import static fourier.DiagramStyle.PANEL_COLOR;
import static fourier.DiagramStyle.SMALL_HEAD_FONT;
import static fourier.DiagramStyle.TEAL_COLOR;
import static fourier.DiagramStyle.TINY_FONT;
import static fourier.DiagramStyle.center;
import static fourier.DiagramStyle.divider;
import static fourier.DiagramStyle.fitTransform;
import static fourier.DiagramStyle.header;
import static fourier.DiagramStyle.open;
import static fourier.DiagramStyle.text;

/**
 * 푸리에 급수가 왜 "모양 → 주파수 번역기" 인지 보여주는 그림.
 *
 * <p>윗줄은 같은 벌새를 모양의 언어(점 목록)와 주파수의 언어(차수별 반지름)로 나란히 적고,
 * 아랫줄은 번역을 N차에서 끊었을 때 되살아나는 모양을 차례로 보여준다.
 */
public class SpectrumDiagram {
    public static final int SHEET_WIDTH = DiagramStyle.SHEET_WIDTH;
    public static final int SHEET_HEIGHT = 1000;
    public static final String FILE_NAME = "spectrum.png";

    static final int[] STAGE_LIST = {1, 3, 10, 30, 100};

    /**
     * 로그 눈금의 아래 끝. r_k 가 1 차와 100 차 사이에서 1000 배 넘게 차이 나서 로그로 편다.
     */
    static final double AMPLITUDE_FLOOR = 0.05;

    private static final String DEFAULT_OUTPUT_DIRECTORY = "src/main/resources/fourier";
    private static final DecimalFormat ERROR_FORMAT = new DecimalFormat("0.0");

    private SpectrumDiagram() {
    }

    public static void main(String[] args) throws IOException {
        String directory = DEFAULT_OUTPUT_DIRECTORY;

        if (args.length > 0) {
            directory = args[0];
        }

        write(new File(directory));

        System.out.println("wrote " + FILE_NAME + " to " + directory);
    }

    public static void write(File directory) throws IOException {
        if (!directory.isDirectory() && !directory.mkdirs()) {
            throw new IOException("출력 디렉터리를 만들 수 없습니다: " + directory);
        }

        ImageIO.write(
            drawSpectrum(),
            "png",
            new File(directory, FILE_NAME)
        );
    }

    /**
     * 진폭을 막대 높이 비율로 바꾼다. 0 에서 1 사이이고, 로그 눈금이다.
     */
    static double barRatio(
        double amplitude,
        double maxAmplitude
    ) {
        double floor = Math.log10(AMPLITUDE_FLOOR);
        double ceiling = Math.log10(maxAmplitude);
        double value = Math.log10(Math.max(amplitude, AMPLITUDE_FLOOR));
        double ratio = (value - floor) / (ceiling - floor);

        return Math.max(0, Math.min(ratio, 1));
    }

    public static BufferedImage drawSpectrum() {
        BufferedImage image = new BufferedImage(SHEET_WIDTH, SHEET_HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = open(image);
        FourierBirdModel model = FourierBirdModel.create();

        try {
            header(
                g2,
                "모양 → 주파수 번역기",
                "같은 벌새를 두 가지 언어로 적은 것. 왼쪽은 \"점이 어디에 있나\", 오른쪽은 \"몇 번째 원이 얼마나 큰가\"."
            );

            drawTranslationRow(g2, model);

            divider(g2, 492);

            drawStageRow(g2, model);
        } finally {
            g2.dispose();
        }

        return image;
    }

    // ------------------------------------------------------------------ 윗줄: 두 언어

    private static void drawTranslationRow(
        Graphics2D g2,
        FourierBirdModel model
    ) {
        center(
            g2,
            "모양의 언어",
            SMALL_HEAD_FONT,
            INK_COLOR,
            235,
            168
        );

        center(
            g2,
            "외곽선 위의 점 2048개",
            TINY_FONT,
            MUTED_COLOR,
            235,
            192
        );

        Rectangle2D.Double birdBox = new Rectangle2D.Double(
            70,
            210,
            330,
            250
        );

        fillModelShape(
            g2,
            model.getOutlinePath(),
            birdBox,
            model.getOutlinePath().getBounds2D(),
            BIRD_COLOR
        );

        drawTranslationArrows(g2);

        center(
            g2,
            "주파수의 언어",
            SMALL_HEAD_FONT,
            INK_COLOR,
            919,
            168
        );

        center(
            g2,
            "차수 k 마다 원의 반지름 r 하나씩, 모두 100개",
            TINY_FONT,
            MUTED_COLOR,
            919,
            192
        );

        Rectangle2D.Double topChart = new Rectangle2D.Double(
            715,
            215,
            409,
            95
        );

        Rectangle2D.Double bottomChart = new Rectangle2D.Double(
            715,
            345,
            409,
            95
        );

        text(
            g2,
            "x(t) 쪽 반지름",
            TINY_FONT,
            TEAL_COLOR,
            715,
            208
        );

        text(
            g2,
            "y(t) 쪽 반지름",
            TINY_FONT,
            GOLD_COLOR,
            715,
            338
        );

        drawSpectrumBars(
            g2,
            model.getSeriesX(),
            topChart,
            model.getMaxHarmonic(),
            TEAL_COLOR
        );

        drawSpectrumBars(
            g2,
            model.getSeriesY(),
            bottomChart,
            model.getMaxHarmonic(),
            GOLD_COLOR
        );

        drawHarmonicAxis(g2, bottomChart);

        center(
            g2,
            "세로는 로그 눈금 — 1차와 100차의 반지름이 1000배 넘게 차이 난다",
            TINY_FONT,
            MUTED_COLOR,
            919,
            478
        );
    }

    private static void drawTranslationArrows(Graphics2D g2) {
        RoundRectangle2D.Double panel = new RoundRectangle2D.Double(
            437,
            305,
            236,
            60,
            14,
            14
        );

        g2.setColor(PANEL_COLOR);
        g2.fill(panel);
        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1.2f));
        g2.draw(panel);

        center(
            g2,
            "푸리에 급수",
            HEAD_FONT,
            INK_COLOR,
            555,
            343
        );

        arrow(
            g2,
            437,
            673,
            268
        );

        center(
            g2,
            "분석 — 계수 뽑기",
            TINY_FONT,
            MUTED_COLOR,
            555,
            252
        );

        arrow(
            g2,
            673,
            437,
            402
        );

        center(
            g2,
            "합성 — 다시 그리기",
            TINY_FONT,
            MUTED_COLOR,
            555,
            424
        );
    }

    private static void arrow(
        Graphics2D g2,
        double fromX,
        double toX,
        double y
    ) {
        double direction = Math.signum(toX - fromX);

        g2.setColor(MUTED_COLOR);
        g2.setStroke(new BasicStroke(1.6f));
        g2.draw(new Line2D.Double(fromX, y, toX, y));

        Path2D.Double head = new Path2D.Double();
        head.moveTo(toX, y);
        head.lineTo(toX - direction * 11, y - 5);
        head.lineTo(toX - direction * 11, y + 5);
        head.closePath();

        g2.fill(head);
    }

    private static void drawHarmonicAxis(
        Graphics2D g2,
        Rectangle2D.Double chart
    ) {
        int[] tickList = {1, 25, 50, 75, 100};

        for (int tick : tickList) {
            double x = chart.x + chart.width * (tick - 0.5) / 100;

            center(
                g2,
                "k = " + tick,
                TINY_FONT,
                MUTED_COLOR,
                x,
                chart.y + chart.height + 20
            );
        }
    }

    // ------------------------------------------------------------------ 아랫줄: 끊는 자리

    private static void drawStageRow(
        Graphics2D g2,
        FourierBirdModel model
    ) {
        text(
            g2,
            "번역을 어디서 끊느냐  =  원을 몇 개까지 쓰느냐",
            HEAD_FONT,
            INK_COLOR,
            56,
            534
        );

        text(
            g2,
            "왼쪽 스펙트럼에서 색칠된 앞부분만 가지고 오른쪽 모양을 되살린 것이다.",
            BODY_FONT,
            MUTED_COLOR,
            56,
            560
        );

        Rectangle2D sourceBounds = model.getOutlinePath().getBounds2D();
        double columnWidth = 200;
        double columnGap = 22;

        for (int index = 0; index < STAGE_LIST.length; index++) {
            int stage = STAGE_LIST[index];
            double x = 58 + index * (columnWidth + columnGap);

            Rectangle2D.Double miniChart = new Rectangle2D.Double(
                x,
                590,
                columnWidth,
                54
            );

            drawSpectrumBars(
                g2,
                model.getSeriesX(),
                miniChart,
                stage,
                TEAL_COLOR
            );

            Rectangle2D.Double shapeBox = new Rectangle2D.Double(
                x,
                664,
                columnWidth,
                200
            );

            Path2D.Double shape = toPath(model.approximationPointList(stage, 1200));

            fillModelShape(
                g2,
                shape,
                shapeBox,
                sourceBounds,
                BIRD_COLOR
            );

            center(
                g2,
                "N = " + stage,
                HEAD_FONT,
                INK_COLOR,
                x + columnWidth / 2,
                904
            );

            center(
                g2,
                "최대 오차 " + ERROR_FORMAT.format(model.maxErrorRatio(stage) * 100) + "%",
                TINY_FONT,
                MUTED_COLOR,
                x + columnWidth / 2,
                930
            );
        }

        center(
            g2,
            "고차를 더할수록 깃털 끝과 부리처럼 \"가장자리의 잔 변화\" 가 살아난다",
            TINY_FONT,
            MUTED_COLOR,
            590,
            972
        );
    }

    // ------------------------------------------------------------------ 공통 도구

    private static void drawSpectrumBars(
        Graphics2D g2,
        FourierSeries series,
        Rectangle2D.Double chart,
        int highlightCount,
        Color color
    ) {
        List<Harmonic> harmonicList = series.getHarmonicList();
        int count = harmonicList.size();
        double maxAmplitude = 0;

        for (Harmonic harmonic : harmonicList) {
            maxAmplitude = Math.max(maxAmplitude, harmonic.getAmplitude());
        }

        double barPitch = chart.width / count;
        double baseline = chart.y + chart.height;

        for (int index = 0; index < count; index++) {
            Harmonic harmonic = harmonicList.get(index);
            double height = chart.height * barRatio(harmonic.getAmplitude(), maxAmplitude);
            Color barColor = FADED_COLOR;

            if (index < highlightCount) {
                barColor = color;
            }

            Rectangle2D.Double bar = new Rectangle2D.Double(
                chart.x + index * barPitch,
                baseline - height,
                Math.max(barPitch - 1, 1),
                height
            );

            g2.setColor(barColor);
            g2.fill(bar);
        }

        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1.2f));
        g2.draw(new Line2D.Double(chart.x, baseline, chart.x + chart.width, baseline));
    }

    private static void fillModelShape(
        Graphics2D g2,
        Shape modelShape,
        Rectangle2D.Double box,
        Rectangle2D sourceBounds,
        Color color
    ) {
        AffineTransform transform = fitTransform(sourceBounds, box);
        Shape shape = transform.createTransformedShape(modelShape);

        g2.setColor(color);
        g2.fill(shape);
    }

    private static Path2D.Double toPath(List<Point2D.Double> pointList) {
        Path2D.Double path = new Path2D.Double();

        for (int index = 0; index < pointList.size(); index++) {
            Point2D.Double point = pointList.get(index);

            if (index == 0) {
                path.moveTo(point.x, point.y);
            } else {
                path.lineTo(point.x, point.y);
            }
        }

        path.closePath();

        return path;
    }
}
