package screen;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ImageHtmlWriterTest {
    @Test
    public void insertNewDateAboveLargestDate() {
        String html = String.join("\n",
            "<pre>",
            "<h2>20260902</h2>",
            "",
            "<img src=\"../i/20260902.png\">",
            "",
            "</pre>"
        );

        ImageHtmlWriter.Result result = ImageHtmlWriter.write(html, "20260903");

        assertEquals("20260903", result.getImageName());
        assertEquals(String.join("\n",
            "<pre>",
            "<h2>20260903</h2>",
            "",
            "<img src=\"../i/20260903.png\">",
            "",
            "<h2>20260902</h2>",
            "",
            "<img src=\"../i/20260902.png\">",
            "",
            "</pre>"
        ), result.getHtml());
    }

    @Test
    public void appendFirstSuffixedImageWhenDateExists() {
        String html = String.join("\n",
            "<pre>",
            "<h2>20260903</h2>",
            "",
            "<img src=\"../i/20260903.png\">",
            "",
            "<h2>20260902</h2>",
            "",
            "<img src=\"../i/20260902.png\">",
            "",
            "</pre>"
        );

        ImageHtmlWriter.Result result = ImageHtmlWriter.write(html, "20260903");

        assertEquals("20260903_01", result.getImageName());
        assertEquals(String.join("\n",
            "<pre>",
            "<h2>20260903</h2>",
            "",
            "<img src=\"../i/20260903.png\">",
            "",
            "<img src=\"../i/20260903_01.png\">",
            "",
            "<h2>20260902</h2>",
            "",
            "<img src=\"../i/20260902.png\">",
            "",
            "</pre>"
        ), result.getHtml());
    }

    @Test
    public void appendNextSuffixedImage() {
        String html = String.join("\n",
            "<h2>20260903</h2>",
            "",
            "<img src=\"../i/20260903.png\">",
            "",
            "<img src=\"../i/20260903_01.png\">",
            "",
            "<h2>20260902</h2>"
        );

        ImageHtmlWriter.Result result = ImageHtmlWriter.write(html, "20260903");

        assertEquals("20260903_02", result.getImageName());
        assertEquals(String.join("\n",
            "<h2>20260903</h2>",
            "",
            "<img src=\"../i/20260903.png\">",
            "",
            "<img src=\"../i/20260903_01.png\">",
            "",
            "<img src=\"../i/20260903_02.png\">",
            "",
            "<h2>20260902</h2>"
        ), result.getHtml());
    }

    @Test
    public void insertAfterPreTagWhenNoDateExists() {
        String html = String.join("\n",
            "<pre>",
            "</pre>"
        );

        ImageHtmlWriter.Result result = ImageHtmlWriter.write(html, "20260903");

        assertEquals("20260903", result.getImageName());
        assertEquals(String.join("\n",
            "<pre>",
            "<h2>20260903</h2>",
            "",
            "<img src=\"../i/20260903.png\">",
            "",
            "</pre>"
        ), result.getHtml());
    }
}
