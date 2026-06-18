package screen;

public class ColorHistoryEntry {
    private final String pickedAt;
    private final int red;
    private final int green;
    private final int blue;
    private final String htmlColor;
    private final Integer screenX;
    private final Integer screenY;

    public ColorHistoryEntry(String pickedAt,
                             int red,
                             int green,
                             int blue,
                             String htmlColor,
                             Integer screenX,
                             Integer screenY) {
        this.pickedAt = pickedAt;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.htmlColor = htmlColor;
        this.screenX = screenX;
        this.screenY = screenY;
    }

    public String getPickedAt() {
        return pickedAt;
    }

    public int getRed() {
        return red;
    }

    public int getGreen() {
        return green;
    }

    public int getBlue() {
        return blue;
    }

    public String getHtmlColor() {
        return htmlColor;
    }

    public Integer getScreenX() {
        return screenX;
    }

    public Integer getScreenY() {
        return screenY;
    }
}
