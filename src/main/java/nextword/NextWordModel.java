package nextword;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * 학습 과정을 보여 주는 작은 신경망: 마지막 4단어 → 임베딩 → tanh → softmax.
 * 외부 모델이나 정답 조회표 없이 모든 가중치를 무작위로 초기화하고 직접 학습한다.
 * Transformer나 범용 언어 모델은 아니며, 학습 자료에 있는 정답 단어만 예측한다.
 */
public final class NextWordModel {
    private static final int CONTEXT_SIZE = 4;
    private static final int EMBEDDING_SIZE = 8;
    private static final int HIDDEN_SIZE = 24;
    private static final int INPUT_SIZE = CONTEXT_SIZE * EMBEDDING_SIZE;
    private static final int PADDING_ID = 0;
    private static final int UNKNOWN_ID = 1;

    private final Map<String, Integer> inputVocabulary = new LinkedHashMap<>();
    private final Map<String, Integer> outputVocabulary = new LinkedHashMap<>();
    private final double[][] embeddings;
    private final double[][] hiddenWeights;
    private final double[] hiddenBias = new double[HIDDEN_SIZE];
    private final double[][] outputWeights;
    private final double[] outputBias;

    public NextWordModel(
        List<TrainingExample> examples,
        long seed
    ) {
        if (examples == null || examples.isEmpty()) {
            throw new IllegalArgumentException("학습 예제가 필요합니다.");
        }

        for (TrainingExample example : examples) {
            if (example == null) {
                throw new IllegalArgumentException("학습 예제는 null일 수 없습니다.");
            }

            for (String word : example.getContext().split("\\s+")) {
                if (!this.inputVocabulary.containsKey(word)) {
                    this.inputVocabulary.put(
                        word,
                        this.inputVocabulary.size() + 2
                    );
                }
            }

            if (!this.outputVocabulary.containsKey(example.getTarget())) {
                this.outputVocabulary.put(
                    example.getTarget(),
                    this.outputVocabulary.size()
                );
            }
        }

        if (this.outputVocabulary.size() < 2) {
            throw new IllegalArgumentException("확률 비교를 위해 서로 다른 정답이 2개 이상 필요합니다.");
        }

        Random random = new Random(seed);

        this.embeddings = initialize(
            this.inputVocabulary.size() + 2,
            EMBEDDING_SIZE,
            random
        );

        this.hiddenWeights = initialize(
            HIDDEN_SIZE,
            INPUT_SIZE,
            random
        );

        this.outputWeights = initialize(
            this.outputVocabulary.size(),
            HIDDEN_SIZE,
            random
        );

        this.outputBias = new double[this.outputVocabulary.size()];
    }

    private static double[][] initialize(
        int rows,
        int columns,
        Random random
    ) {
        double[][] values = new double[rows][columns];
        double scale = Math.sqrt(2.0 / (rows + columns));

        for (double[] row : values) {
            for (int column = 0; column < columns; column++) {
                row[column] = random.nextGaussian() * scale;
            }
        }

        return values;
    }

    /** 단어 순서를 보존하고 짧은 문맥은 왼쪽을 0으로 채운다. 모르는 단어는 UNK로 처리한다. */
    private ForwardPass forward(String context) {
        if (context == null || context.trim().isEmpty()) {
            throw new IllegalArgumentException("입력 문맥이 비어 있습니다.");
        }

        String[] words = context.trim().split("\\s+");
        ForwardPass pass = new ForwardPass(this.outputBias.length);
        int count = Math.min(
            CONTEXT_SIZE,
            words.length
        );

        for (int index = 0; index < count; index++) {
            Integer token = this.inputVocabulary.get(words[words.length - count + index]);

            if (token == null) {
                token = UNKNOWN_ID;
            }

            int position = CONTEXT_SIZE - count + index;
            pass.tokens[position] = token;

            for (int dimension = 0; dimension < EMBEDDING_SIZE; dimension++) {
                pass.input[position * EMBEDDING_SIZE + dimension] = this.embeddings[token][dimension];
            }
        }

        for (int hidden = 0; hidden < HIDDEN_SIZE; hidden++) {
            double activation = this.hiddenBias[hidden];

            for (int input = 0; input < INPUT_SIZE; input++) {
                activation += this.hiddenWeights[hidden][input] * pass.input[input];
            }

            pass.hidden[hidden] = Math.tanh(activation);
        }

        double maximum = Double.NEGATIVE_INFINITY;

        for (int output = 0; output < this.outputBias.length; output++) {
            double logit = this.outputBias[output];

            for (int hidden = 0; hidden < HIDDEN_SIZE; hidden++) {
                logit += this.outputWeights[output][hidden] * pass.hidden[hidden];
            }

            pass.logits[output] = logit;

            maximum = Math.max(
                maximum,
                logit
            );
        }

        // 최댓값을 빼서 exp가 넘치지 않도록 softmax와 교차 엔트로피를 계산한다.
        double sum = 0;

        for (int output = 0; output < pass.probabilities.length; output++) {
            pass.probabilities[output] = Math.exp(pass.logits[output] - maximum);
            sum += pass.probabilities[output];
        }

        for (int output = 0; output < pass.probabilities.length; output++) {
            pass.probabilities[output] /= sum;
        }

        pass.maximum = maximum;
        pass.logShiftedSum = Math.log(sum);
        return pass;
    }

    public Map<String, Double> predict(String context) {
        ForwardPass pass = forward(context);
        Map<String, Double> result = new LinkedHashMap<>();

        for (Map.Entry<String, Integer> entry : this.outputVocabulary.entrySet()) {
            result.put(
                entry.getKey(),
                pass.probabilities[entry.getValue()]
            );
        }

        return Collections.unmodifiableMap(result);
    }

    private int targetId(TrainingExample example) {
        if (example == null || !this.outputVocabulary.containsKey(example.getTarget())) {
            throw new IllegalArgumentException("모델의 출력 어휘에 없는 정답입니다.");
        }

        return this.outputVocabulary.get(example.getTarget());
    }

    public double loss(TrainingExample example) {
        int target = targetId(example);
        ForwardPass pass = forward(example.getContext());
        return (pass.maximum - pass.logits[target]) + pass.logShiftedSum;
    }

    /**
     * 한 예제의 SGD 학습. 반환값은 갱신 전 손실이다.
     * softmax + 교차 엔트로피의 미분은 '예측 확률 - 정답(one-hot)'이다.
     */
    public double trainStep(
        TrainingExample example,
        double learningRate
    ) {
        if (!Double.isFinite(learningRate) || learningRate <= 0 || learningRate > 1) {
            throw new IllegalArgumentException("학습률은 0보다 크고 1 이하여야 합니다.");
        }

        int target = targetId(example);
        ForwardPass pass = forward(example.getContext());
        double loss = (pass.maximum - pass.logits[target]) + pass.logShiftedSum;
        double[] outputGradient = pass.probabilities.clone();
        outputGradient[target] -= 1.0;
        double[] hiddenGradient = new double[HIDDEN_SIZE];
        double[] inputGradient = new double[INPUT_SIZE];

        // 모든 역전파는 갱신 전 가중치로 계산해야 한다.
        for (int hidden = 0; hidden < HIDDEN_SIZE; hidden++) {
            for (int output = 0; output < outputGradient.length; output++) {
                hiddenGradient[hidden] += this.outputWeights[output][hidden] * outputGradient[output];
            }

            hiddenGradient[hidden] *= 1 - pass.hidden[hidden] * pass.hidden[hidden];

            for (int input = 0; input < INPUT_SIZE; input++) {
                inputGradient[input] += this.hiddenWeights[hidden][input] * hiddenGradient[hidden];
            }
        }

        // 경사하강법: 새 가중치 = 기존 가중치 - 학습률 × 손실의 기울기.
        for (int output = 0; output < outputGradient.length; output++) {
            this.outputBias[output] -= learningRate * outputGradient[output];

            for (int hidden = 0; hidden < HIDDEN_SIZE; hidden++) {
                this.outputWeights[output][hidden] -= learningRate * outputGradient[output] * pass.hidden[hidden];
            }
        }

        for (int hidden = 0; hidden < HIDDEN_SIZE; hidden++) {
            this.hiddenBias[hidden] -= learningRate * hiddenGradient[hidden];

            for (int input = 0; input < INPUT_SIZE; input++) {
                this.hiddenWeights[hidden][input] -= learningRate * hiddenGradient[hidden] * pass.input[input];
            }
        }

        for (int position = 0; position < CONTEXT_SIZE; position++) {
            if (pass.tokens[position] == PADDING_ID) {
                continue;
            }

            for (int dimension = 0; dimension < EMBEDDING_SIZE; dimension++) {
                // 같은 단어가 여러 번 나오면 같은 임베딩에 각 위치의 기울기를 누적한다.
                this.embeddings[pass.tokens[position]][dimension] -= learningRate
                    * inputGradient[position * EMBEDDING_SIZE + dimension];
            }
        }

        return loss;
    }

    /** 순전파 중간값은 한 번의 예측/학습에서만 사용한다. */
    private static final class ForwardPass {
        private final int[] tokens = new int[CONTEXT_SIZE];
        private final double[] input = new double[INPUT_SIZE];
        private final double[] hidden = new double[HIDDEN_SIZE];
        private final double[] logits;
        private final double[] probabilities;
        private double maximum;
        private double logShiftedSum;

        private ForwardPass(int outputSize) {
            this.logits = new double[outputSize];
            this.probabilities = new double[outputSize];
        }
    }
}
