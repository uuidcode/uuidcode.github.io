package fourier;

import java.util.function.DoubleUnaryOperator;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * 그림이 주장하는 수치가 실제로 맞는지 확인한다.
 */
public class InnerProductDiagramUnitTest {
    private static final int STEP_COUNT = 20000;

    private static double innerProduct(
        DoubleUnaryOperator first,
        DoubleUnaryOperator second
    ) {
        double dt = 2 * Math.PI / STEP_COUNT;
        double total = 0;

        for (int index = 0; index < STEP_COUNT; index++) {
            double t = dt * (index + 0.5);
            total += first.applyAsDouble(t) * second.applyAsDouble(t) * dt;
        }

        return total;
    }

    @Test
    public void sameHarmonicGivesPi() {
        assertEquals(
            Math.PI, // expected
            innerProduct(t -> Math.cos(t), t -> Math.cos(t)), // actual
            1e-6 // delta
        );
    }

    @Test
    public void differentHarmonicsAreOrthogonal() {
        assertEquals(
            0.0, // expected
            innerProduct(t -> Math.cos(t), t -> Math.cos(2 * t)), // actual
            1e-6 // delta
        );
    }

    @Test
    public void sineAndCosineAreOrthogonal() {
        assertEquals(
            0.0, // expected
            innerProduct(t -> Math.sin(t), t -> Math.cos(t)), // actual
            1e-6 // delta
        );
    }

    @Test
    public void sampleCurvesArePeriodic() {
        double t = 0.83;

        assertEquals(
            InnerProductDiagram.sampleF(t), // expected
            InnerProductDiagram.sampleF(t + 2 * Math.PI), // actual
            1e-9 // delta
        );

        assertEquals(
            InnerProductDiagram.sampleG(t), // expected
            InnerProductDiagram.sampleG(t + 2 * Math.PI), // actual
            1e-9 // delta
        );
    }

    @Test
    public void sampleCurvesStartAtTheSumOfTheirCosineParts() {
        assertEquals(
            0.72, // expected
            InnerProductDiagram.sampleF(0), // actual
            1e-9 // delta
        );

        assertEquals(
            0.85, // expected
            InnerProductDiagram.sampleG(0), // actual
            1e-9 // delta
        );
    }

    /**
     * 셋째 단계의 막대가 초록과 분홍 양쪽으로 갈리려면 곱이 부호를 바꿔야 한다.
     */
    @Test
    public void sampleProductTakesBothSigns() {
        boolean positiveFound = false;
        boolean negativeFound = false;

        for (int index = 0; index < 720; index++) {
            double t = 2 * Math.PI * index / 720;
            double product = InnerProductDiagram.sampleF(t) * InnerProductDiagram.sampleG(t);

            if (product > 0) {
                positiveFound = true;
            }

            if (product < 0) {
                negativeFound = true;
            }
        }

        assertTrue(positiveFound);
        assertTrue(negativeFound);
    }

    /**
     * 그래도 +넓이가 훨씬 커서 M → ∞ 그림이 대체로 초록으로 보여야 한다.
     */
    @Test
    public void sampleProductKeepsAPositiveArea() {
        double area = innerProduct(InnerProductDiagram::sampleF, InnerProductDiagram::sampleG);

        assertTrue(area > 0.5);
    }
}
