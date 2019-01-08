import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.junit.Test;

public class JSoupTest {
    @Test
    public void test() {
        Document document = Jsoup.parse("<div test=\"&gt;<>&lt;\">&;&lt;tuple&gt;&gt;</div>");
        Elements elements = document.select("div");
        System.out.println(elements);

        document = Jsoup.parse(document.toString());
        System.out.println(document.select("div").toString());
    }
}