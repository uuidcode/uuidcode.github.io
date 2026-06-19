package screen;

public enum CaptureGridMode {
    NONE_NONE("none / none", null, null),
    GRID_50_NONE("grid 50 / none", 50, null),
    GRID_100_NONE("grid 100 / none", 100, null),
    GRID_50_50("grid 50 / grid 50", 50, 50),
    GRID_100_100("grid 100 / grid 100", 100, 100);

    private final String title;
    private final Integer previewGridSize;
    private final Integer captureGridSize;

    CaptureGridMode(String title, Integer previewGridSize, Integer captureGridSize) {
        this.title = title;
        this.previewGridSize = previewGridSize;
        this.captureGridSize = captureGridSize;
    }

    public Integer getPreviewGridSize() {
        return previewGridSize;
    }

    public Integer getCaptureGridSize() {
        return captureGridSize;
    }

    @Override
    public String toString() {
        return this.title;
    }
}
