package screen;

import java.awt.AWTException;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.jcodec.api.awt.AWTSequenceEncoder;

// 선택한 화면 영역을 일정 FPS로 캡처하여 H.264 MP4 파일로 저장하는 화면 녹화기.
// JCodec 순수 자바 인코더를 사용하므로 별도의 네이티브 바이너리(ffmpeg 등)가 필요 없다.
public class ScreenRecorder {
    public static final int DEFAULT_FPS = 12;
    public static final String VIDEO_EXTENSION = ".mp4";
    private static final int MILLIS_PER_SECOND = 1000;
    // 녹화 시작 직전에 선택 오버레이 창이 사라질 시간을 벌어주는 대기 시간.
    private static final int INITIAL_SETTLE_MILLIS = 150;

    private final Rectangle captureRectangle;
    private final int fps;
    private final File outputFile;
    private volatile boolean recording;
    private Thread captureThread;
    private volatile Throwable failure;

    public ScreenRecorder(
        Rectangle captureRectangle,
        int fps,
        File outputFile
    ) {
        this.captureRectangle = toEvenRectangle(captureRectangle);
        this.fps = fps;
        this.outputFile = outputFile;
    }

    public File getOutputFile() {
        return this.outputFile;
    }

    public Rectangle getCaptureRectangle() {
        return new Rectangle(this.captureRectangle);
    }

    public boolean isRecording() {
        return this.recording;
    }

    public Throwable getFailure() {
        return this.failure;
    }

    public void start() {
        if (this.recording) {
            return;
        }

        this.recording = true;
        this.failure = null;

        this.captureThread = new Thread(
            this::runCaptureLoop, // target
            "screen-recorder" // name
        );

        this.captureThread.start();
    }

    public File stop() {
        this.recording = false;

        if (this.captureThread != null) {
            try {
                this.captureThread.join();
            } catch (InterruptedException exception) {
                Thread.currentThread().interrupt();
            }

            this.captureThread = null;
        }

        return this.outputFile;
    }

    private void runCaptureLoop() {
        try {
            Robot robot = new Robot();
            AWTSequenceEncoder encoder = AWTSequenceEncoder.createSequenceEncoder(
                this.outputFile, // out
                this.fps // fps
            );

            try {
                Thread.sleep(INITIAL_SETTLE_MILLIS);

                long frameIntervalMillis = MILLIS_PER_SECOND / this.fps;

                while (this.recording) {
                    long frameStartMillis = System.currentTimeMillis();
                    BufferedImage frame = robot.createScreenCapture(this.captureRectangle);

                    encoder.encodeImage(toEncodableImage(frame));

                    long elapsedMillis = System.currentTimeMillis() - frameStartMillis;
                    long sleepMillis = frameIntervalMillis - elapsedMillis;

                    if (sleepMillis > 0) {
                        Thread.sleep(sleepMillis);
                    }
                }
            } finally {
                encoder.finish();
            }
        } catch (AWTException | IOException | InterruptedException exception) {
            this.failure = exception;
        }
    }

    // 캡처한 이미지를 H.264 인코딩이 가능한 형태(가로/세로 짝수, RGB)로 변환한다.
    static BufferedImage toEncodableImage(BufferedImage image) {
        int width = image.getWidth() - (image.getWidth() % 2);
        int height = image.getHeight() - (image.getHeight() % 2);

        BufferedImage encodable = new BufferedImage(
            width, // width
            height, // height
            BufferedImage.TYPE_3BYTE_BGR // imageType
        );

        Graphics2D g2 = encodable.createGraphics();

        try {
            g2.drawImage(
                image, // img
                0, // dx1
                0, // dy1
                width, // dx2
                height, // dy2
                0, // sx1
                0, // sy1
                width, // sx2
                height, // sy2
                null // observer
            );
        } finally {
            g2.dispose();
        }

        return encodable;
    }

    // H.264는 가로/세로가 짝수여야 하므로 홀수 크기를 한 픽셀 줄여 짝수로 맞춘다.
    static Rectangle toEvenRectangle(Rectangle rectangle) {
        int width = rectangle.width - (rectangle.width % 2);
        int height = rectangle.height - (rectangle.height % 2);

        return new Rectangle(
            rectangle.x, // x
            rectangle.y, // y
            Math.max(2, width), // width
            Math.max(2, height) // height
        );
    }

    public static File resolveOutputFile() {
        String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());

        return new File(
            Util.getImageDir(), // parent
            fileName + VIDEO_EXTENSION // child
        );
    }

    // 미리 준비된 프레임 목록을 MP4로 인코딩한다. 녹화 없이 인코딩만 검증할 때 사용한다.
    static File encodeFrames(
        File outputFile,
        int fps,
        List<BufferedImage> frameList
    ) throws IOException {
        AWTSequenceEncoder encoder = AWTSequenceEncoder.createSequenceEncoder(
            outputFile, // out
            fps // fps
        );

        try {
            for (BufferedImage frame : frameList) {
                encoder.encodeImage(toEncodableImage(frame));
            }
        } finally {
            encoder.finish();
        }

        return outputFile;
    }
}
