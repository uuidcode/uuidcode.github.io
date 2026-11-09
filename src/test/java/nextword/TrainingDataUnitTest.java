package nextword;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TrainingDataUnitTest {
    private List<TrainingExample> read(String text) throws IOException {
        return TrainingData.read(new ByteArrayInputStream(text.getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    public void readsKoreanExamplesAndSkipsCommentsAndEmptyLines() throws IOException {
        List<TrainingExample> examples = read("# 설명\n\n이미지 파일의 이름을\t변경\n");

        assertEquals(
            1,
            examples.size()
        );

        assertEquals(
            "이미지 파일의 이름을",
            examples.get(0).getContext()
        );

        assertEquals(
            "변경",
            examples.get(0).getTarget()
        );
    }

    @Test(expected = IOException.class)
    public void rejectsMissingTab() throws IOException {
        read("이미지 파일의 이름을 변경");
    }

    @Test(expected = IOException.class)
    public void rejectsEmptyDataset() throws IOException {
        read("# 주석만 존재\n");
    }

    @Test(expected = IOException.class)
    public void rejectsMultipleTargetWords() throws IOException {
        read("이미지 파일의 이름을\t변경 합니다");
    }

    @Test(expected = IOException.class)
    public void rejectsExtraColumns() throws IOException {
        read("문맥\t정답\t추가");
    }

    @Test(expected = IllegalArgumentException.class)
    public void rejectsBlankContext() {
        new TrainingExample(
            " ",
            "변경"
        );
    }
}
