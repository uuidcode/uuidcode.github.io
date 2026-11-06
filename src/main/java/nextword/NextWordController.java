package nextword;

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;

/** 학습 자료를 섞어 반복 학습하고 실제 손실과 예측 확률을 콘솔에 보여 준다. */
public final class NextWordController {
    private final List<TrainingExample> examples;
    private final NextWordModel model;
    private final Random random = new Random(20261105L);

    public NextWordController(List<TrainingExample> examples) {
        this.model = new NextWordModel(
            examples,
            20261105L
        );

        this.examples = new ArrayList<>(examples);
    }

    public NextWordModel getModel() {
        return this.model;
    }

    public double meanLoss() {
        double total = 0;

        for (TrainingExample example : this.examples) {
            total += this.model.loss(example);
        }

        return total / this.examples.size();
    }

    public void train(
        int epochs,
        double learningRate,
        PrintStream output
    ) {
        if (epochs <= 0 || epochs > 100000) {
            throw new IllegalArgumentException("학습 횟수는 1~100000이어야 합니다.");
        }

        if (!Double.isFinite(learningRate) || learningRate <= 0 || learningRate > 1) {
            throw new IllegalArgumentException("학습률은 0보다 크고 1 이하여야 합니다.");
        }

        List<TrainingExample> shuffled = new ArrayList<>(this.examples);
        int interval = Math.max(
            1,
            epochs / 10
        );

        output.println("| Epoch | 학습 자료 평균 손실 | 첫 예제 정답 확률 |");
        output.println("| ---: | ---: | ---: |");

        report(
            0,
            output
        );

        for (int epoch = 1; epoch <= epochs; epoch++) {
            Collections.shuffle(
                shuffled,
                this.random
            );

            for (TrainingExample example : shuffled) {
                this.model.trainStep(
                    example,
                    learningRate
                );
            }

            if (epoch % interval == 0 || epoch == epochs) {
                report(
                    epoch,
                    output
                );
            }
        }
    }

    private void report(
        int epoch,
        PrintStream output
    ) {
        TrainingExample example = this.examples.get(0);
        double probability = this.model.predict(example.getContext()).get(example.getTarget());

        output.printf(
            Locale.ROOT,
            "| %d | %.6f | %.2f%% |%n",
            epoch,
            meanLoss(),
            probability * 100
        );
    }

    public void printPrediction(
        String context,
        PrintStream output
    ) {
        output.println("입력: " + context);
        Map<String, Double> probabilities = this.model.predict(context);
        String best = null;
        double maximum = -1;

        for (Map.Entry<String, Double> entry : probabilities.entrySet()) {
            output.printf(
                Locale.ROOT,
                "  %s: %.2f%%%n",
                entry.getKey(),
                entry.getValue() * 100
            );

            if (entry.getValue() > maximum) {
                maximum = entry.getValue();
                best = entry.getKey();
            }
        }

        output.println("예측: " + context + " " + best);
    }
}
