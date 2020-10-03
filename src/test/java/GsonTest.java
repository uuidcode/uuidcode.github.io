import java.util.Map;

import org.junit.Test;

import com.google.gson.Gson;

import lombok.Data;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@Accessors(chain = true)
public class GsonTest {
    private Long totalCount;
    private Long totalCount1;
    private Integer totalCount2;

    public static GsonTest of() {
        return new GsonTest();
    }

    @Test
    public void test() {
        GsonTest gsonTest = GsonTest.of()
            .setTotalCount(1L)
            .setTotalCount1(2L)
            .setTotalCount2(3);

        String json = new Gson().toJson(gsonTest);

        Map map = new Gson().fromJson(json, Map.class);

        json = new Gson().toJson(map);

        if (log.isDebugEnabled()) {
            log.debug(">>> test map: {}", json);
        }
    }
}
