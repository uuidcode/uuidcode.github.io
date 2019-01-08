package blue;

import org.junit.Test;

import com.github.uuidcode.util.StringStream;

public class BlueTest {
    @Test
    public void test() {
        for (int i = 0; i < 40; i++) {
            int left = 0;
            int top = 0;

            if (0 <= i && i <= 10) {
                top = i * 120;
            }

            String line = StringStream.of()
                .add(".cell" + i + " {")
                .add("    left: " + left + "px")
                .add("    top: " + top + "px")
                .add("}")
                .joiningWithNewLine();

            System.out.println(line);
        }
    }
}