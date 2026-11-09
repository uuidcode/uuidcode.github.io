package nextword;

import java.io.IOException;
import java.io.PrintStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

/** 실행: nextword.NextWordDemo [학습 횟수] ["입력 문맥"] [학습 TSV 경로]. */
public final class NextWordDemo {
    private NextWordDemo() {
    }

    public static void main(String[] args) throws IOException {
        try {
            run(
                args,
                System.out
            );
        } catch (IllegalArgumentException | IOException exception) {
            System.err.println("실행 오류: " + exception.getMessage());
            System.err.println("사용법: nextword.NextWordDemo [학습 횟수] [\"입력 문맥\"] [학습 TSV 경로]");
            System.exit(1);
        }
    }

    public static void run(
        String[] args,
        PrintStream output
    ) throws IOException {
        if (args.length > 3) {
            throw new IllegalArgumentException("인수는 최대 3개입니다.");
        }

        int epochs = 300;
        String context = "이미지 파일의 이름을";

        if (args.length > 0) {
            epochs = Integer.parseInt(args[0]);
        }

        if (epochs <= 0 || epochs > 100000) {
            throw new IllegalArgumentException("학습 횟수는 1~100000이어야 합니다.");
        }

        if (args.length > 1) {
            context = args[1];
        }

        List<TrainingExample> examples;

        if (args.length > 2) {
            examples = TrainingData.read(Files.newInputStream(Paths.get(args[2])));
        } else {
            examples = TrainingData.loadDefault();
        }

        NextWordController controller = new NextWordController(examples);
        output.println("작은 다음 단어 신경망 — 외부 API 없이 무작위 가중치부터 학습");
        output.println("학습 예제: " + examples.size() + "개, 학습률: 0.05");
        output.println("첫 학습 예제: " + examples.get(0).getContext() + " → " + examples.get(0).getTarget());
        output.println("학습 전");

        controller.printPrediction(
            context,
            output
        );

        controller.train(
            epochs,
            0.05,
            output
        );

        output.println("학습 후");

        controller.printPrediction(
            context,
            output
        );

        output.println("학습 자료에 대한 결과이며 일반적인 언어 이해 성능을 뜻하지 않습니다.");
    }
}
