package nextword;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** UTF-8 TSV의 각 줄에서 문맥과 정답을 읽는다. 입력 스트림도 함께 닫는다. */
public final class TrainingData {
    private TrainingData() {
    }

    public static List<TrainingExample> loadDefault() throws IOException {
        InputStream input = TrainingData.class.getResourceAsStream("/nextword/training.tsv");

        if (input == null) {
            throw new IOException("학습 자료 /nextword/training.tsv를 찾을 수 없습니다.");
        }

        return read(input);
    }

    public static List<TrainingExample> read(InputStream input) throws IOException {
        if (input == null) {
            throw new IllegalArgumentException("학습 자료 스트림이 필요합니다.");
        }

        List<TrainingExample> examples = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            input,
            StandardCharsets.UTF_8
        ))) {
            String line;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                if (line.trim().isEmpty() || line.trim().startsWith("#")) {
                    continue;
                }

                String[] fields = line.split(
                    "\t",
                    -1
                );

                if (fields.length != 2) {
                    throw new IOException(lineNumber + "행: 문맥과 정답을 탭 하나로 구분하세요.");
                }

                try {
                    examples.add(new TrainingExample(
                        fields[0],
                        fields[1]
                    ));
                } catch (IllegalArgumentException exception) {
                    throw new IOException(
                        lineNumber + "행: " + exception.getMessage(),
                        exception
                    );
                }
            }
        }

        if (examples.isEmpty()) {
            throw new IOException("학습 자료가 비어 있습니다.");
        }

        return Collections.unmodifiableList(examples);
    }
}
