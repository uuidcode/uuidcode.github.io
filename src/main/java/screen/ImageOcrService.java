package screen;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.io.IOUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.CodeSource;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class ImageOcrService {
    private static final String OCR_SCRIPT_RELATIVE_PATH = "iphone_mirroring_automation/ocr_image_json.swift";
    private static final Gson GSON = new GsonBuilder()
        .disableHtmlEscaping()
        .setPrettyPrinting()
        .create();

    public OcrRunResult run(File imageFile) throws IOException, InterruptedException {
        File ocrScriptFile = resolveOcrScriptFile();
        if (ocrScriptFile == null) {
            throw new IOException("OCR script not found: " + buildOcrScriptLookupMessage());
        }

        ProcessBuilder processBuilder = new ProcessBuilder(
            "swift",
            ocrScriptFile.getAbsolutePath(),
            imageFile.getAbsolutePath()
        );
        Process process = processBuilder.start();
        String stdout = IOUtils.toString(process.getInputStream(), StandardCharsets.UTF_8);
        String stderr = IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8);
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException(stderr.isEmpty() ? "OCR command failed." : stderr.trim());
        }

        OcrResponse response = GSON.fromJson(stdout, OcrResponse.class);

        if (response == null) {
            throw new IOException("OCR command returned empty JSON.");
        }

        if (response.items == null) {
            response.items = Collections.emptyList();
        } else {
            response.items = new ArrayList<OcrItem>(response.items);
            Collections.sort(response.items, Comparator.comparing(OcrItem::getText, String.CASE_INSENSITIVE_ORDER));
        }

        return new OcrRunResult(response, GSON.toJson(response));
    }

    private static File resolveOcrScriptFile() {
        for (File candidate : buildOcrScriptCandidates()) {
            if (candidate.isFile()) {
                return candidate.getAbsoluteFile();
            }
        }

        return null;
    }

    private static String buildOcrScriptLookupMessage() {
        StringBuilder builder = new StringBuilder();
        builder.append("looked for ").append(OCR_SCRIPT_RELATIVE_PATH).append(" in:");
        for (File candidate : buildOcrScriptCandidates()) {
            builder.append("\n - ").append(candidate.getAbsolutePath());
        }
        return builder.toString();
    }

    private static List<File> buildOcrScriptCandidates() {
        List<File> candidates = new ArrayList<File>();
        Set<String> seen = new LinkedHashSet<String>();

        addSearchPathCandidates(candidates, seen, new File(System.getProperty("user.dir", ".")));

        try {
            CodeSource codeSource = ImageOcrService.class.getProtectionDomain().getCodeSource();
            if (codeSource != null && codeSource.getLocation() != null) {
                File codeLocation = new File(codeSource.getLocation().toURI());
                File startDir = codeLocation.isDirectory() ? codeLocation : codeLocation.getParentFile();
                addSearchPathCandidates(candidates, seen, startDir);
            }
        } catch (Exception ignored) {
        }

        return candidates;
    }

    private static void addSearchPathCandidates(List<File> candidates, Set<String> seen, File startDir) {
        File current = startDir;
        while (current != null) {
            File candidate = new File(current, OCR_SCRIPT_RELATIVE_PATH).getAbsoluteFile();
            String path = candidate.getAbsolutePath();
            if (seen.add(path)) {
                candidates.add(candidate);
            }
            current = current.getParentFile();
        }
    }

    public static class OcrRunResult {
        private final OcrResponse response;
        private final String prettyJson;

        public OcrRunResult(OcrResponse response, String prettyJson) {
            this.response = response;
            this.prettyJson = prettyJson;
        }

        public OcrResponse getResponse() {
            return response;
        }

        public String getPrettyJson() {
            return prettyJson;
        }
    }

    public static class OcrResponse {
        private String imagePath;
        private int imageWidth;
        private int imageHeight;
        private List<OcrItem> items;

        public String getImagePath() {
            return imagePath;
        }

        public int getImageWidth() {
            return imageWidth;
        }

        public int getImageHeight() {
            return imageHeight;
        }

        public List<OcrItem> getItems() {
            return items == null ? Collections.emptyList() : items;
        }
    }

    public static class OcrItem {
        private String text;
        private OcrRect rect;

        public String getText() {
            return text == null ? "" : text;
        }

        public OcrRect getRect() {
            return rect;
        }
    }

    public static class OcrRect {
        private int x;
        private int y;
        private int width;
        private int height;

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }

        public int getWidth() {
            return width;
        }

        public int getHeight() {
            return height;
        }

        public String toDisplayText() {
            return String.format("%d,%d,%d,%d", x, y, width, height);
        }
    }
}
