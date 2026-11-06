package nextword;

import java.util.Map;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/** HTTP 서버가 없는 예제이므로 모델의 공개 Java API 계약을 검사한다. */
public class NextWordApiTest {
    @Test(expected = UnsupportedOperationException.class)
    public void predictionResultCannotBeModifiedByCaller() throws Exception {
        NextWordModel model = new NextWordModel(
            TrainingData.loadDefault(),
            42L
        );

        model.predict("이미지 파일의 이름을").clear();
    }

    @Test
    public void predictionIsASnapshotAndDoesNotChangeAfterTraining() throws Exception {
        NextWordModel model = new NextWordModel(
            TrainingData.loadDefault(),
            42L
        );

        Map<String, Double> before = model.predict("이미지 파일의 이름을");
        double original = before.get("변경");

        model.trainStep(
            TrainingData.loadDefault().get(0),
            0.05
        );

        assertEquals(
            original,
            before.get("변경"),
            0.0
        );
    }
}
