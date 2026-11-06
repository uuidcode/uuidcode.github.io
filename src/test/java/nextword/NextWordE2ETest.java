package nextword;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/** 별도 JVM으로 실제 main을 실행하는 테스트. 일반 UnitTest 실행에는 포함하지 않는다. */
public class NextWordE2ETest {
    @Test(timeout = 20000)
    public void commandLineTrainsAndPrintsTheRequestedCompletion() throws Exception {
        String java = Paths.get(
            System.getProperty("java.home"),
            "bin",
            "java"
        ).toString();

        String classpath = System.getProperty(
            "surefire.test.class.path",
            System.getProperty("java.class.path")
        );

        Process process = new ProcessBuilder(
            java,
            "-Dfile.encoding=UTF-8",
            "-cp",
            classpath,
            "nextword.NextWordDemo",
            "300",
            "이미지 파일의 이름을"
        ).redirectErrorStream(true).start();

        try {
            assertTrue(process.waitFor(
                10,
                TimeUnit.SECONDS
            ));

            StringBuilder result = new StringBuilder();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                process.getInputStream(),
                StandardCharsets.UTF_8
            ))) {
                String line;

                while ((line = reader.readLine()) != null) {
                    result.append(line).append('\n');
                }
            }

            assertEquals(
                result.toString(),
                0,
                process.exitValue()
            );

            String text = result.toString();
            assertTrue(text.contains("학습 전"));
            int afterTraining = text.indexOf("학습 후");
            assertTrue(afterTraining >= 0);
            assertTrue(text.substring(afterTraining).contains("예측: 이미지 파일의 이름을 변경"));
        } finally {
            process.destroyForcibly();
        }
    }
}
