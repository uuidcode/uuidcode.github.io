import com.google.common.io.Files;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.nio.charset.Charset;

public class Downloader {
    public static final Charset CHARSET = Charset.defaultCharset();

    public static void main(String[] args) throws Exception {
        File file = new File("images/2013.html");
        Document document = Jsoup.parse(file, "UTF-8");
        Elements elements = document.select("img");

        for (int i = 0; i < elements.size(); i++) {
            Element element = elements.get(i);
            String url = element.attr("src");
            if (url.contains("media.tumblr.com")) {
                String newFile = saveImage(url);
                element.attr("src", newFile);
            }
        }

        Files.write(document.html(), file, CHARSET);
    }

    public static String saveImage(String imageUrl) throws IOException {
        String filename = String.valueOf(System.currentTimeMillis());
        String[] token = imageUrl.split("\\.");
        filename += "." + token[token.length - 1];

        System.out.println(imageUrl);
        System.out.println(filename);

        URL url = new URL(imageUrl);
        InputStream is = url.openStream();
        OutputStream os = new FileOutputStream(new File("_images/" + filename));

        byte[] b = new byte[2048];
        int length;

        while ((length = is.read(b)) != -1) {
            os.write(b, 0, length);
        }

        is.close();
        os.close();

        return "../i/" + filename;
    }
}
