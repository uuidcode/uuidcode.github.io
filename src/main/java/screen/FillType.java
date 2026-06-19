package screen;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import static lombok.AccessLevel.PRIVATE;

@Getter
@Accessors(chain = true)
public enum FillType {
    OPAQUE,
    TRANSPARENT;

    @Setter(PRIVATE)
    private String title;

    static {
        OPAQUE.setTitle("Opaque");
        TRANSPARENT.setTitle("Transparent");
    }
}
