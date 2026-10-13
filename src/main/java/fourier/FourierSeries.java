package fourier;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 한 좌표축의 푸리에 급수.
 *
 * <pre>
 * f(t) = mean + sum(k = 1..N) (a_k cos(kt) + b_k sin(kt))
 * </pre>
 */
public class FourierSeries {
    private final double mean;
    private final List<Harmonic> harmonicList;

    public FourierSeries(
        double mean,
        List<Harmonic> harmonicList
    ) {
        this.mean = mean;
        this.harmonicList = Collections.unmodifiableList(new ArrayList<Harmonic>(harmonicList));
    }

    /**
     * t 가 [0, 2pi) 구간에 균등하게 놓인 표본으로부터 계수를 구한다.
     */
    public static FourierSeries fit(
        double[] sampleList,
        int maxHarmonic
    ) {
        int count = sampleList.length;
        double total = 0;

        for (int index = 0; index < count; index++) {
            total += sampleList[index];
        }

        double mean = total / count;
        List<Harmonic> harmonicList = new ArrayList<Harmonic>();

        for (int order = 1; order <= maxHarmonic; order++) {
            double cosine = 0;
            double sine = 0;

            for (int index = 0; index < count; index++) {
                double angle = 2 * Math.PI * order * index / count;
                cosine += sampleList[index] * Math.cos(angle);
                sine += sampleList[index] * Math.sin(angle);
            }

            Harmonic harmonic = new Harmonic(
                order,
                2 * cosine / count,
                2 * sine / count
            );

            harmonicList.add(harmonic);
        }

        return new FourierSeries(
            mean,
            harmonicList
        );
    }

    /**
     * 앞에서부터 harmonicCount 개의 항만 더한 부분합.
     */
    public double valueAt(
        double t,
        int harmonicCount
    ) {
        double value = this.mean;
        int limit = Math.min(harmonicCount, this.harmonicList.size());

        for (int index = 0; index < limit; index++) {
            value += this.harmonicList.get(index).valueAt(t);
        }

        return value;
    }

    public double getMean() {
        return this.mean;
    }

    public List<Harmonic> getHarmonicList() {
        return this.harmonicList;
    }

    public int size() {
        return this.harmonicList.size();
    }
}
