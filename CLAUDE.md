# 프로젝트 규칙

이 문서의 내용은 항상 준수한다.

## 테스트

**UnitTest만 작성한다.**

IntegrationTest, ApiTest, E2ETest는 **만들지 않는다.** 소스를 수정해서 테스트가 필요하면 UnitTest 하나만 추가한다.

- `*IntegrationTest`, `*ApiTest`, `*E2ETest` 파일을 새로 만들지 않는다.
- ControllerTest 같은 통합 성격의 테스트도 만들지 않는다.
- 테스트 실행도 UnitTest만 한다.
- 테스트 결과는 항상 테이블 형태로 출력한다.
