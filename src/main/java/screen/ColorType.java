package screen;

import java.awt.Color;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import static lombok.AccessLevel.PRIVATE;

@Getter
@Accessors(chain = true)
public enum ColorType {
    BLUE,
    GREEN;

    @Setter(PRIVATE)
    private Color color;

    @Setter(PRIVATE)
    private String Title;

    static {
        BLUE.setColor(new Color(124, 166, 208, 255))
            .setTitle("파란색");
        GREEN.setColor(new Color(102, 255, 102, 255))
            .setTitle("녹색");
    }

}
