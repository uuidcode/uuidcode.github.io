package nextword;

/** 공백으로 나눈 입력 문맥과 그 뒤에 올 정답 단어 한 개. */
public final class TrainingExample {
    private final String context;
    private final String target;

    public TrainingExample(
        String context,
        String target
    ) {
        if (context == null || context.trim().isEmpty()) {
            throw new IllegalArgumentException("입력 문맥이 비어 있습니다.");
        }

        if (target == null || target.trim().isEmpty()
            || target.trim().split("\\s+").length != 1) {
            throw new IllegalArgumentException("정답은 공백 없는 단어 한 개여야 합니다.");
        }

        this.context = context.trim();
        this.target = target.trim();
    }

    public String getContext() {
        return this.context;
    }

    public String getTarget() {
        return this.target;
    }
}
