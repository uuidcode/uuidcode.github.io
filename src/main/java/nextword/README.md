# Java로 직접 학습하는 다음 단어 모델

`이미지 파일의 이름을 → 변경`을 예로, 다음 과정을 직접 구현한다.

1. 입력을 공백 단위로 나눠 마지막 4단어의 번호를 구한다.
2. 단어마다 8개 숫자로 된 임베딩을 읽고, 순서대로 이어 붙인다.
3. 24개 뉴런의 tanh 은닉층을 거쳐 정답 후보별 점수를 계산한다.
4. softmax로 점수를 확률로 바꾼다.
5. 정답 확률의 음의 로그인 교차 엔트로피 손실을 계산한다.
6. 역전파로 각 가중치의 기울기를 계산하고 `가중치 -= 학습률 * 기울기`로 갱신한다.

입력 임베딩, 은닉층과 출력층의 가중치 및 편향을 모두 학습한다. 모든 기울기를
먼저 계산한 다음 가중치를 수정한다. 최대 점수를 빼는 softmax를 사용해 수치
오버플로를 줄인다. 짧은 문맥은 왼쪽을 0으로 채우고 처음 보는 단어는 UNK로 처리한다.

이 모델은 공백 단위의 제한된 다음 단어 분류기다. Transformer, 사전 학습 모델,
외부 AI API를 사용하지 않는다. 정답은 학습 자료에 등장하는 단어로 제한되고,
4단어보다 앞의 문맥은 보지 않는다. 출력하는 손실과 확률은 **학습 자료에 대한 값**이며,
일반적인 한국어 이해나 새로운 문장에 대한 성능을 증명하지 않는다.
UNK 임베딩은 기본 학습 자료에서 학습되지 않으므로 모르는 단어의 의미를 이해하지 못한다.

## 실행

프로젝트 루트에서 SDKMAN JDK 21을 명시한다. 새로운 의존성은 필요 없다.
기존 Maven의 Java 8 소스 호환 설정도 유지한다.

```bash
export JAVA_HOME="$HOME/.sdkman/candidates/java/21.0.9-tem"
rtk mvn -Dmaven.test.skip=true compile
rtk proxy "$JAVA_HOME/bin/java" -cp target/classes nextword.NextWordDemo
```

IntelliJ에서는 JDK 21로 `nextword.NextWordDemo.main()`을 실행해도 된다.
기본값은 300 epoch, 학습률 0.05, 고정 난수 시드이다. epoch는 전체 자료를 한 번
학습하는 단위다. 학습 전후 모든 후보의 확률과 약 10회 간격의 손실 표를 출력한다.
시작할 때마다 무작위 초기값부터 다시 학습하며 가중치는 파일에 저장하지 않는다.

```bash
export JAVA_HOME="$HOME/.sdkman/candidates/java/21.0.9-tem"
rtk proxy "$JAVA_HOME/bin/java" -cp target/classes nextword.NextWordDemo 500 "이미지 파일의 내용을"
```

## 학습 자료 바꾸기

기본 자료는 `src/main/resources/nextword/training.tsv`이다. 각 줄은
`입력 문맥<TAB>정답 단어`이며 실제 탭으로 구분한다. `#` 주석과 빈 줄은 건너뛴다.
서로 다른 정답이 최소 2개 필요하다. 정답이 하나뿐이면 처음부터 확률이 100%라서
학습에 따른 변화가 없기 때문이다. 기본 자료는 변경·확인·이동·저장 4종류, 총 16개다.

외부 UTF-8 TSV를 세 번째 인수로 주면 소스 변경이나 재컴파일 없이 자료를 바꿀 수 있다.

```bash
export JAVA_HOME="$HOME/.sdkman/candidates/java/21.0.9-tem"
rtk proxy "$JAVA_HOME/bin/java" -cp target/classes nextword.NextWordDemo 300 "입력 문맥" /absolute/path/training.tsv
```

## 테스트

프로젝트 POM의 기본 테스트 생략 설정을 해제하되, 새 UnitTest 두 클래스만 실행한다.

```bash
export JAVA_HOME="$HOME/.sdkman/candidates/java/21.0.9-tem"
rtk mvn -Dmaven.test.skip=false -Dtest=NextWordModelUnitTest,TrainingDataUnitTest test
```

UnitTest는 확률 합, 손실 감소, 단어 순서 학습, 임의 정답 학습, 잘못된 입력을 확인한다.
모든 가중치와 편향의 역전파 기울기를 수치 미분과 비교하며 반복 단어의 임베딩 기울기도 검사한다.
Controller IntegrationTest, 공개 Java ApiTest, 별도 JVM E2ETest도 작성되어 있지만
위 명령에서는 실행되지 않는다. 이 콘솔 예제에는 Spring이나 HTTP 서버가 없다.

## 코드 읽는 순서

- `TrainingExample`, `TrainingData`: 입력 자료와 정답 준비
- `NextWordModel.forward`: 숫자로 변환하고 예측
- `NextWordModel.loss`: 정답과 비교한 오차 계산
- `NextWordModel.trainStep`: 역전파와 가중치 수정
- `NextWordController`, `NextWordDemo`: 반복 학습과 실행 결과 출력
