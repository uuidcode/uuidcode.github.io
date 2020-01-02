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

    @Test
    public void getAsOptional2() {
        {
            Map<String, String> map = new HashMap<>();
            this.getAsOptional2(map, "test");
        }

        {
            Map<String, Object> map = new HashMap<>();
            this.getAsOptional2(map, "test");
        }

    }

    public <K, V> Optional<V> getAsOptional(Map<K, V> map, K k) {
        if (map == null) {
            return Optional.empty();
        }

        V value = map.get(k);

        return Optional.of(value);
    }

    public Optional<?> getAsOptional2(Map<String, ?> map, String k) {
        if (map == null) {
            return Optional.empty();
        }

        Object object = map.get(k);

        return Optional.of(object);
    }
}
