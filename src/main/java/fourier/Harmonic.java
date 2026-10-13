package fourier;

/**
 * a_k cos(kt) + b_k sin(kt) 한 항을 표현한다.
 */
public class Harmonic {
    private final int order;
    private final double cosine;
    private final double sine;

    public Harmonic(
        int order,
        double cosine,
        double sine
    ) {
        this.order = order;
        this.cosine = cosine;
        this.sine = sine;
    }

    public int getOrder() {
        return this.order;
    }

    public double getCosine() {
        return this.cosine;
    }

    public double getSine() {
        return this.sine;
    }

    /**
     * 회전 벡터의 길이. a_k cos(kt) + b_k sin(kt) = r cos(kt - phase) 로 볼 때의 r 이다.
     */
    public double getAmplitude() {
        return Math.hypot(this.cosine, this.sine);
    }

    /**
     * 회전 벡터의 초기 위상.
     */
    public double getPhase() {
        return Math.atan2(this.sine, this.cosine);
    }

    public double valueAt(double t) {
        double angle = this.order * t;
        return this.cosine * Math.cos(angle) + this.sine * Math.sin(angle);
    }
}
