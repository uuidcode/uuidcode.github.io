import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.google.common.collect.Lists;
import com.google.common.io.Files;

public class Generator {
    public static final Charset CHARSET = Charset.defaultCharset();

    public static void main(String[] args) {
        List<File> fileList = Lists.newArrayList(new File("images").listFiles());
        fileList.addAll(Lists.newArrayList(new File("codegen").listFiles()));
        fileList.addAll(Lists.newArrayList(new File("virtualform").listFiles()));
        fileList.addAll(Lists.newArrayList(new File("programming2").listFiles()));
        fileList.addAll(Lists.newArrayList(new File("music").listFiles()));
        fileList.addAll(Lists.newArrayList(new File("at").listFiles()));
        fileList.addAll(Lists.newArrayList(new File("people").listFiles()));
        fileList.addAll(Lists.newArrayList(new File("deployable").listFiles()));
        fileList.add(new File("programming/programming.html"));
        fileList.add(new File("antlr4/index.html"));
        fileList.add(new File("generateAssertJ/index.html"));
        fileList.add(new File("redux/index.html"));

        fileList.stream()
            .filter(file -> file.getName().endsWith(".html"))
            .forEach(file -> {
                try {
                    System.out.println(file.getName());
                    Document document = Jsoup.parse(file, "UTF-8");
                    document.select("head").html(getHtml("head.html"));
                    document.select("div.navbar").html(getHtml("header.html"));
                    document.outputSettings().prettyPrint(false).escapeMode().getMap().clear();
                    Files.write(document.html(), file, CHARSET);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
    }

    private static String getHtml(String filename) throws IOException {
        return Files.toString(new File("include/" + filename), CHARSET);
    }
}
