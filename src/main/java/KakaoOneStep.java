import com.kakao.AI;
import com.kakao.Data;
import com.kakao.History;
import com.kakao.Future;

public class KakaoOneStep {
    public static void main(String[] args) {
        Future future =
            AI.learn(new History())
                .predict(new Data());
    }
}
