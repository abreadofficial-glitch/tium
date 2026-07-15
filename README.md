# 틔움프레첼 주문·견적·거래명세서 앱

Google Sheets를 데이터베이스로 사용하는 Google Apps Script 웹앱입니다.

## 저장소 구성

```text
src/
├─ Code.gs
├─ index.html
└─ appsscript.json

.github/workflows/
└─ deploy.yml

scripts/
└─ validate.mjs
```

## 자동 배포 방식

`main` 브랜치의 `src/` 파일이 변경되면 GitHub Actions가 다음 작업을 수행합니다.

1. Code.gs와 manifest 구문 검사
2. `clasp push --force`로 Apps Script 프로젝트 코드 교체
3. 지정된 기존 배포 ID를 새 버전으로 갱신
4. 기존 웹앱 주소 유지

## 최초 1회 설정

### 1. 저장소를 비공개로 전환

GitHub 저장소에서 아래 순서로 변경합니다.

```text
Settings
→ General
→ Danger Zone
→ Change repository visibility
→ Make private
```

### 2. Apps Script API 활성화

Google Apps Script 사용자 설정에서 Apps Script API를 사용으로 변경합니다.

### 3. Script ID 확인

Apps Script 편집기에서:

```text
프로젝트 설정(톱니바퀴)
→ ID
→ 스크립트 ID 복사
```

아래 형식의 `.clasp.json`을 준비합니다.

```json
{
  "scriptId": "여기에_스크립트_ID",
  "rootDir": "src"
}
```

### 4. clasp 로그인 파일 생성

Node.js를 설치한 PC의 터미널에서 실행합니다.

```bash
npm install -g @google/clasp@3
clasp login
```

로그인이 완료되면 사용자 홈 폴더에 `.clasprc.json`이 생성됩니다.

Windows PowerShell에서 내용을 클립보드로 복사:

```powershell
Get-Content "$HOME\.clasprc.json" -Raw | Set-Clipboard
```

### 5. 배포 ID 확인

Apps Script 편집기에서:

```text
배포
→ 배포 관리
→ 현재 웹앱 배포 선택
→ 배포 ID 복사
```

### 6. GitHub Secrets 등록

```text
Repository
→ Settings
→ Secrets and variables
→ Actions
→ New repository secret
```

다음 3개를 등록합니다.

| Secret 이름 | 값 |
|---|---|
| `CLASPRC_JSON` | `.clasprc.json` 전체 내용 |
| `CLASP_JSON` | 위에서 만든 `.clasp.json` 전체 내용 |
| `DEPLOYMENT_ID` | 현재 웹앱 배포 ID |

## 수동 배포 테스트

```text
Actions
→ Apps Script 자동 배포
→ Run workflow
```

성공한 뒤부터는 `main` 브랜치의 앱 코드를 수정하면 동일한 웹앱 주소에 자동 반영됩니다.

## 보안 주의사항

- `.clasprc.json`에는 Apps Script 프로젝트에 접근 가능한 갱신 토큰이 들어 있습니다.
- 해당 파일을 저장소 파일로 올리거나 채팅에 공개하지 마세요.
- 반드시 GitHub Secret으로만 등록하세요.
- 자동 배포 체계가 가동된 뒤에는 Apps Script 편집기에서 직접 코드를 수정하지 않는 것을 권장합니다. GitHub 코드가 다음 배포 때 편집기 내용을 덮어씁니다.
