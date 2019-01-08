import java.io.File;
import java.nio.file.Files;
import java.util.List;

public class SortLog {
    public static void main(String[] args) throws Exception {
        List<String> contentList = Files.readAllLines(new File("log/20181128.log").toPath());

        System.out.println(contentList);
    }
}
