package screen;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * images/{연도}.html 에 현재 날짜의 &lt;h2&gt; 와 &lt;img&gt; 태그를 추가한다.
 *
 * <p>날짜 &lt;h2&gt; 가 이미 있으면 그 날짜 블록의 마지막 이미지 다음 번호로 이미지를 붙이고,
 * 없으면 가장 큰 날짜 &lt;h2&gt; 윗줄에 새 날짜 블록을 만든다.
 */
public class ImageHtmlWriter {
    private static final Pattern H2_PATTERN = Pattern.compile("\\s*<h2>(\\d{8})</h2>\\s*");
    private static final Pattern IMG_PATTERN = Pattern.compile("\\s*<img src=\"\\.\\./i/(\\d{8}(?:_\\d+)?)\\.png\">\\s*");
    private static final Pattern IMAGE_NAME_PATTERN = Pattern.compile("(\\d{8})(?:_(\\d+))?");
    private static final String PRE_TAG = "<pre>";

    @Getter
    @RequiredArgsConstructor
    public static class Result {
        private final String html;
        private final String imageName;
    }

    public static Result write(String html, String date) {
        List<String> lineList = new ArrayList<String>(Arrays.asList(html.split("\n", -1)));

        int dateIndex = indexOfH2(lineList, date);

        if (dateIndex < 0) {
            return insertDateBlock(lineList, date);
        }

        return appendImage(lineList, date, dateIndex);
    }

    // 새 날짜는 가장 큰 날짜 블록 윗줄에 만든다.
    private static Result insertDateBlock(List<String> lineList, String date) {
        int insertIndex = indexOfLargestH2(lineList);

        if (insertIndex < 0) {
            insertIndex = indexAfterPreTag(lineList);
        }

        lineList.addAll(insertIndex, Arrays.asList(
            h2Tag(date),
            "",
            imgTag(date),
            ""
        ));

        return new Result(join(lineList), date);
    }

    // 이미 있는 날짜는 다음 <h2> 를 만나기 전까지의 마지막 이미지 뒤에 붙인다.
    private static Result appendImage(List<String> lineList, String date, int dateIndex) {
        int lastImageIndex = -1;
        String lastImageName = null;

        for (int i = dateIndex + 1; i < lineList.size(); i++) {
            String line = lineList.get(i);

            if (H2_PATTERN.matcher(line).matches()) {
                break;
            }

            Matcher matcher = IMG_PATTERN.matcher(line);

            if (matcher.matches()) {
                lastImageIndex = i;
                lastImageName = matcher.group(1);
            }
        }

        String imageName = nextImageName(date, lastImageName);
        int insertIndex = lastImageIndex < 0 ? dateIndex + 1 : lastImageIndex + 1;

        lineList.addAll(insertIndex, Arrays.asList(
            "",
            imgTag(imageName)
        ));

        return new Result(join(lineList), imageName);
    }

    static String nextImageName(String date, String lastImageName) {
        if (lastImageName == null) {
            return date;
        }

        Matcher matcher = IMAGE_NAME_PATTERN.matcher(lastImageName);
        int index = 0;

        if (matcher.matches() && matcher.group(2) != null) {
            index = Integer.parseInt(matcher.group(2));
        }

        return String.format("%s_%02d", date, index + 1);
    }

    private static int indexOfH2(List<String> lineList, String date) {
        for (int i = 0; i < lineList.size(); i++) {
            Matcher matcher = H2_PATTERN.matcher(lineList.get(i));

            if (matcher.matches() && matcher.group(1).equals(date)) {
                return i;
            }
        }

        return -1;
    }

    private static int indexOfLargestH2(List<String> lineList) {
        int largestIndex = -1;
        String largestDate = null;

        for (int i = 0; i < lineList.size(); i++) {
            Matcher matcher = H2_PATTERN.matcher(lineList.get(i));

            if (!matcher.matches()) {
                continue;
            }

            String date = matcher.group(1);

            if (largestDate == null || date.compareTo(largestDate) > 0) {
                largestDate = date;
                largestIndex = i;
            }
        }

        return largestIndex;
    }

    private static int indexAfterPreTag(List<String> lineList) {
        for (int i = 0; i < lineList.size(); i++) {
            if (lineList.get(i).trim().equals(PRE_TAG)) {
                return i + 1;
            }
        }

        return lineList.size();
    }

    private static String h2Tag(String date) {
        return "<h2>" + date + "</h2>";
    }

    private static String imgTag(String imageName) {
        return "<img src=\"../i/" + imageName + ".png\">";
    }

    private static String join(List<String> lineList) {
        StringBuilder stringBuilder = new StringBuilder();

        for (int i = 0; i < lineList.size(); i++) {
            if (i > 0) {
                stringBuilder.append("\n");
            }

            stringBuilder.append(lineList.get(i));
        }

        return stringBuilder.toString();
    }
}
