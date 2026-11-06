package nextword;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class NextWordModelUnitTest {
    private List<TrainingExample> examples() {
        return Arrays.asList(
            new TrainingExample(
                "이미지 파일의 이름을",
                "변경"
            ),
            new TrainingExample(
                "이미지 파일의 내용을",
                "확인"
            )
        );
    }

    private NextWordModel model() {
        return new NextWordModel(
            examples(),
            42L
        );
    }

    @Test
    public void probabilitiesAreFiniteAndSumToOne() {
        Map<String, Double> probabilities = model().predict("이미지 파일의 이름을");
        double sum = 0;

        for (double probability : probabilities.values()) {
            assertTrue(Double.isFinite(probability));
            assertTrue(probability > 0 && probability < 1);
            sum += probability;
        }

        assertEquals(
            1.0,
            sum,
            1e-12
        );
    }

    @Test
    public void oneStepReducesLossAndIncreasesTargetProbability() {
        NextWordModel model = model();
        TrainingExample example = examples().get(0);
        double before = model.loss(example);
        double probability = model.predict(example.getContext()).get(example.getTarget());

        double reported = model.trainStep(
            example,
            0.05
        );

        assertEquals(
            before,
            reported,
            1e-12
        );

        assertTrue(model.loss(example) < before);
        assertTrue(model.predict(example.getContext()).get(example.getTarget()) > probability);
    }

    @Test
    public void learnsDifferentLabelsForAlmostIdenticalContexts() {
        NextWordModel model = model();

        for (int epoch = 0; epoch < 200; epoch++) {
            for (TrainingExample example : examples()) {
                model.trainStep(
                    example,
                    0.05
                );
            }
        }

        for (TrainingExample example : examples()) {
            assertTrue(model.predict(example.getContext()).get(example.getTarget()) > 0.98);
            assertTrue(model.loss(example) < 0.03);
        }
    }

    @Test
    public void learnsCustomLabelsAndWordOrderInsteadOfHardCodedAnswers() {
        List<TrainingExample> data = Arrays.asList(
            new TrainingExample(
                "가 나",
                "왼쪽"
            ),
            new TrainingExample(
                "나 가",
                "오른쪽"
            )
        );

        NextWordModel model = new NextWordModel(
            data,
            12L
        );

        for (int epoch = 0; epoch < 200; epoch++) {
            for (TrainingExample example : data) {
                model.trainStep(
                    example,
                    0.05
                );
            }
        }

        for (TrainingExample example : data) {
            assertTrue(model.predict(example.getContext()).get(example.getTarget()) > 0.98);
        }
    }

    @Test
    public void sameSeedProducesSameInitialPredictions() {
        assertEquals(
            model().predict("이미지 파일의 이름을"),
            model().predict("이미지 파일의 이름을")
        );
    }

    @Test
    public void unknownWordsHaveFiniteProbabilities() {
        for (double probability : model().predict("처음보는단어").values()) {
            assertTrue(Double.isFinite(probability));
        }
    }

    @Test
    public void contextUsesOnlyLastFourWordsAndNormalizesWhitespace() {
        NextWordModel model = model();

        assertEquals(
            model.predict("이미지 파일의 내용을 이름을"),
            model.predict("  무시할단어  이미지\t파일의 내용을 이름을  ")
        );
    }

    @Test(expected = IllegalArgumentException.class)
    public void rejectsEmptyContext() {
        model().predict("   ");
    }

    @Test(expected = IllegalArgumentException.class)
    public void rejectsNonFiniteLearningRate() {
        model().trainStep(
            examples().get(0),
            Double.NaN
        );
    }

    @Test(expected = IllegalArgumentException.class)
    public void rejectsUnknownTarget() {
        model().trainStep(
            new TrainingExample(
                "이미지 파일의 이름을",
                "없는정답"
            ),
            0.05
        );
    }

    @Test(expected = IllegalArgumentException.class)
    public void rejectsSingleClassWhichCannotDemonstrateLearning() {
        new NextWordModel(
            examples().subList(
                0,
                1
            ),
            42L
        );
    }

    @Test
    public void backPropagationMatchesNumericalGradientIncludingRepeatedTokens() throws Exception {
        List<TrainingExample> data = Arrays.asList(
            new TrainingExample(
                "같은 같은 단어",
                "하나"
            ),
            new TrainingExample(
                "다른 단어",
                "둘"
            )
        );

        NextWordModel model = new NextWordModel(
            data,
            7L
        );

        List<Parameter> parameters = parameters(model);
        double[] original = new double[parameters.size()];
        double[] analytical = new double[parameters.size()];
        double rate = 0.01;
        double epsilon = 1e-5;

        for (int index = 0; index < parameters.size(); index++) {
            original[index] = parameters.get(index).get();
        }

        model.trainStep(
            data.get(0),
            rate
        );

        for (int index = 0; index < parameters.size(); index++) {
            Parameter parameter = parameters.get(index);
            analytical[index] = (original[index] - parameter.get()) / rate;
            parameter.set(original[index]);
        }

        // 역전파 구현과 독립적인 중심 차분으로 모든 가중치/편향을 확인한다.
        for (int index = 0; index < parameters.size(); index++) {
            Parameter parameter = parameters.get(index);
            parameter.set(original[index] + epsilon);
            double plus = model.loss(data.get(0));
            parameter.set(original[index] - epsilon);
            double minus = model.loss(data.get(0));
            parameter.set(original[index]);

            assertEquals(
                "parameter " + index,
                (plus - minus) / (2 * epsilon),
                analytical[index],
                1e-7
            );
        }
    }

    // 테스트만을 위한 가중치 수정 API를 제품 코드에 노출하지 않고 내부 배열을 검사한다.
    private List<Parameter> parameters(NextWordModel model) throws Exception {
        List<Parameter> result = new ArrayList<>();

        for (Field field : NextWordModel.class.getDeclaredFields()) {
            field.setAccessible(true);
            Object value = field.get(model);

            if (value instanceof double[][]) {
                for (double[] row : (double[][]) value) {
                    addParameters(
                        result,
                        row
                    );
                }
            } else if (value instanceof double[]) {
                addParameters(
                    result,
                    (double[]) value
                );
            }
        }

        return result;
    }

    private void addParameters(
        List<Parameter> result,
        double[] row
    ) {
        for (int index = 0; index < row.length; index++) {
            result.add(new Parameter(
                row,
                index
            ));
        }
    }

    private static final class Parameter {
        private final double[] row;
        private final int index;

        private Parameter(
            double[] row,
            int index
        ) {
            this.row = row;
            this.index = index;
        }

        private double get() {
            return this.row[this.index];
        }

        private void set(double value) {
            this.row[this.index] = value;
        }
    }
}
