package nextword;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertTrue;

/** Spring을 사용하지 않는 콘솔 프로그램이므로 실제 Controller를 직접 조립한다. */
public class NextWordControllerIntegrationTest {
    @Test
    public void controllerTrainsAllDefaultExamplesAndReportsProgress() throws Exception {
        List<TrainingExample> examples = TrainingData.loadDefault();
        NextWordController controller = new NextWordController(examples);
        double before = controller.meanLoss();
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();

        try (PrintStream output = new PrintStream(
            bytes,
            true,
            "UTF-8"
        )) {
            controller.train(
                300,
                0.05,
                output
            );
        }

        assertTrue(controller.meanLoss() < before * 0.05);

        for (TrainingExample example : examples) {
            assertTrue(controller.getModel().predict(example.getContext()).get(example.getTarget()) > 0.98);
        }

        String report = bytes.toString("UTF-8");
        assertTrue(report.contains("| 0 |"));
        assertTrue(report.contains("| 300 |"));
    }
}
