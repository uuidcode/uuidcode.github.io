import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.Test;

import static java.util.Optional.ofNullable;

public class GenericTest {
    @Test
    public void test() {
        Map map = new HashMap();

        Integer length = ofNullable(map.get("test"))
            .filter(String.class::isInstance)
            .map(String.class::cast)
            .map(String::length)
            .orElse(3);

//        getAsOptional(map, "test")
//            .filter(String.class::isInstance)
//            .map(String.class::cast)
//            .map(String::length)
//            .orElse(3);
    }

    public static <K, V> Optional<V> getAsOptional(Map<K, V> map, K k) {
        if (map == null) {
            return Optional.empty();
        }

        V value = map.get(k);

        return Optional.of(value);
    }

    public static Optional<?> getAsOptional(Map<?, ?> map, String k) {
        if (map == null) {
            return Optional.empty();
        }

        Object object = map.get(k);

        return Optional.of(object);
    }
}
