# Hierarchy Plus Rebone

Hierarchy Plus Rebone은 Unity Hierarchy 창을 더 보기 쉽고 다루기 편하게 확장해주는 Unity 에디터 툴입니다. 오브젝트의 계층 구조를 색상, 가이드 라인, 컴포넌트 아이콘, Tag / Layer 라벨 등으로 시각화하여 복잡한 아바타나 씬을 더 빠르게 파악할 수 있도록 도와줍니다.

이 툴은 더 이상 유지보수되지 않는 원본 **HierarchyPlus**를 기반으로, 라이선스를 준수하며 현대 Unity 환경과 VPM / VCC 배포 구조에 맞게 수정·재구성한 버전입니다. 원본의 GPL-3.0 라이선스를 유지하며, 수정된 버전임을 명시합니다.



### 기능

- **Hierarchy 시각 개선**
  Unity 기본 Hierarchy 창에 색상, 행 배경, 가이드 라인 등을 추가해 오브젝트 구조를 더 쉽게 구분할 수 있습니다.

- **계층 깊이 표시**
  부모/자식 관계를 가이드 라인과 들여쓰기 기준으로 표시해 복잡한 계층 구조를 더 명확하게 확인할 수 있습니다.

- **행 색상 표시**
  홀수/짝수 행 색상과 커스텀 색상을 설정해 Hierarchy 항목을 시각적으로 구분할 수 있습니다.

- **컴포넌트 아이콘 표시**
  GameObject에 붙어 있는 컴포넌트 아이콘을 Hierarchy 창 오른쪽에 표시합니다.

- **GameObject 활성화 토글**
  Hierarchy 창의 아이콘을 통해 GameObject 또는 일부 컴포넌트의 활성 상태를 빠르게 전환할 수 있습니다.

- **드래그 토글 지원**
  여러 오브젝트 위로 드래그하면서 활성/비활성 상태를 연속으로 전환할 수 있습니다.

- **Tag / Layer 라벨 표시**
  Hierarchy 창에서 각 GameObject의 Tag와 Layer 정보를 라벨 형태로 확인할 수 있습니다.

- **Tag / Layer 빠른 변경**
  라벨 컨텍스트 클릭을 통해 Tag 또는 Layer를 빠르게 변경할 수 있습니다.

- **숨김 아이콘 타입 설정**
  표시하고 싶지 않은 컴포넌트 타입 이름을 등록해 특정 아이콘을 숨길 수 있습니다.

- **커스텀 스타일 설정**
  아이콘 색상, 비활성 아이콘 색상, 가이드 라인 색상, 아이콘 배경색, 행 배경색 등을 설정할 수 있습니다.

- **설정 저장**
  툴 설정을 저장하여 Unity를 다시 열어도 동일한 환경을 유지할 수 있습니다.

- **Editor-only 구조**
  에디터 확장 전용 툴이며, 런타임 빌드에는 영향을 주지 않습니다.

- **VPM / VCC 패키지 지원**
  VPM 패키지 구조로 정리되어 VRChat Creator Companion 환경에서 설치 및 관리할 수 있습니다.



### 요구 사항

- Unity **2022.3** 이상
- VCC 또는 VPM 패키지 관리 환경
- Unity Editor 전용 사용
- 런타임 의존성 없음



### 사용 방법

#### 기본 사용법

1. VCC 또는 VPM을 통해 패키지를 설치합니다.

2. Unity 상단 메뉴에서
   **Iyan-Kim > Tools > Hierarchy Plus Rebone** 을 엽니다.

3. 설정 창에서 **HierarchyPlus Enabled** 옵션을 켭니다.

4. 필요한 기능을 설정합니다:
   - **Colors** – 행 색상, 가이드 라인, 아이콘 배경색 설정
   - **Components** – 컴포넌트 아이콘, 드래그 토글, 컨텍스트 클릭 설정
   - **Labels** – Tag / Layer 라벨 표시 설정

5. 설정을 변경하면 Hierarchy 창에 바로 반영됩니다.

6. 아이콘이 정상적으로 갱신되지 않을 경우 **Refresh Icons** 버튼을 눌러 아이콘 캐시를 다시 불러옵니다.



### 옵션 설명

- **HierarchyPlus Enabled**
  Hierarchy Plus Rebone 기능 전체를 켜거나 끕니다.

- **Colors**
  Hierarchy 창에 표시되는 색상 관련 기능을 설정합니다.
  Active Icon Tint, Inactive Icon Tint, Guide Lines, Icon Background, Row Coloring 등을 조정할 수 있습니다.

- **Guide Lines**
  부모/자식 구조를 따라 가이드 라인을 표시합니다.
  복잡한 계층 구조에서 오브젝트의 소속 관계를 더 쉽게 확인할 수 있습니다.

- **Row Coloring**
  Hierarchy 행 배경색을 홀수/짝수 기준으로 나누어 표시합니다.
  긴 계층 목록을 볼 때 가독성을 높이는 데 유용합니다.

- **Components**
  Hierarchy 창 오른쪽에 GameObject 및 컴포넌트 아이콘을 표시합니다.
  Transform, Renderer, Collider, Behaviour 등 컴포넌트 상태를 빠르게 확인할 수 있습니다.

- **Enable Context Click**
  컴포넌트 아이콘을 우클릭했을 때 Unity의 컨텍스트 메뉴를 열 수 있도록 합니다.

- **Enable Drag-Toggle**
  아이콘 위를 드래그하면서 여러 오브젝트나 컴포넌트의 활성 상태를 연속으로 변경할 수 있습니다.

- **Show GameObject Icon**
  GameObject 아이콘 표시 여부를 설정합니다.

- **Show Transform Icon**
  Transform 아이콘 표시 여부를 설정합니다.

- **Show Non-Toggleable Icons**
  활성/비활성 토글이 불가능한 컴포넌트 아이콘도 표시할지 설정합니다.

- **Always Render Icons**
  아이콘 영역이 좁아도 가능한 한 아이콘을 계속 표시합니다.

- **Hidden Types**
  특정 컴포넌트 타입 이름을 등록해 해당 아이콘이 Hierarchy에 표시되지 않도록 숨길 수 있습니다.

- **Labels**
  Tag와 Layer 라벨 표시 기능을 설정합니다.

- **Layer Label**
  GameObject의 Layer 이름 또는 Layer 번호를 Hierarchy에 표시합니다.

- **Tag Label**
  GameObject의 Tag를 Hierarchy에 표시합니다.

- **Enable Label Context Click**
  Tag / Layer 라벨을 우클릭해 빠르게 값을 변경할 수 있도록 합니다.

- **Refresh Icons**
  컴포넌트 아이콘 또는 커스텀 아이콘 표시가 갱신되지 않을 때 아이콘 캐시를 다시 초기화합니다.



### 팁

- 복잡한 VRChat 아바타 작업에서는 **Guide Lines**와 **Row Coloring**을 함께 켜두면 계층 구조를 파악하기 쉽습니다.

- 컴포넌트가 많은 오브젝트를 자주 확인한다면 **Components** 기능을 켜두면 Hierarchy에서 바로 상태를 확인할 수 있습니다.

- Tag / Layer를 자주 바꾸는 프로젝트라면 **Labels**와 **Enable Label Context Click**을 함께 사용하는 것이 편합니다.

- 아이콘이 너무 많이 보여 Hierarchy가 복잡해진다면 **Hidden Types**에 자주 보지 않는 컴포넌트 타입을 등록하세요.

- 아이콘 위치가 오브젝트 이름과 겹친다면 **Icons X Offset** 값을 조정해 보세요.

- 기존 HierarchyPlus와 함께 사용하면 충돌 가능성이 있으므로, 가능하면 원본과 동시에 사용하지 않는 것을 권장합니다.



### 문제 해결

- Hierarchy에 아무 변화가 없습니다
  - 설정 창에서 **HierarchyPlus Enabled**가 켜져 있는지 확인하세요.
  - Unity Hierarchy 창을 클릭하거나 새로고침해 보세요.
  - 필요하면 **Refresh Icons** 버튼을 눌러 아이콘 캐시를 갱신하세요.

- 컴포넌트 아이콘이 보이지 않습니다
  - **Components** 기능이 켜져 있는지 확인하세요.
  - **Show GameObject Icon**, **Show Transform Icon**, **Show Non-Toggleable Icons** 옵션을 확인하세요.
  - **Hidden Types**에 해당 컴포넌트 타입이 등록되어 있지 않은지 확인하세요.

- Tag 또는 Layer 라벨이 보이지 않습니다
  - **Labels** 기능이 켜져 있는지 확인하세요.
  - **Show Layer Label** 또는 **Show Tag Label** 옵션이 켜져 있는지 확인하세요.
  - 기본 Layer 또는 Untagged 항목을 숨기도록 설정되어 있지 않은지 확인하세요.

- 아이콘이나 색상이 이상하게 겹쳐 보입니다
  - **Icons X Offset** 값을 조정하세요.
  - **Always Render Icons** 옵션을 끄거나 아이콘 배경 옵션을 조정해 보세요.
  - Hierarchy 창의 너비를 넓혀 보세요.

- 원본 HierarchyPlus와 충돌하는 것 같습니다
  - 원본 HierarchyPlus와 Hierarchy Plus Rebone을 동시에 사용하지 않는 것을 권장합니다.
  - 이 버전은 원본과의 충돌을 줄이기 위해 네임스페이스와 메뉴 경로를 변경했지만, 동일한 Hierarchy 확장 기능을 동시에 실행하면 표시가 중복될 수 있습니다.



## 라이선스 및 원본 고지

Hierarchy Plus Rebone은 원본 **HierarchyPlus**를 기반으로 수정 및 재구성한 프로젝트입니다.

- 원본 프로젝트: **HierarchyPlus**
- 원본 제작자: **DreadScripts**
- 수정 및 재구성: **Iyan-Kim**
- 라이선스: **GNU General Public License v3.0 or later**
- 패키지 라이선스 표기: `GPL-3.0-or-later`

이 프로젝트는 원본의 GPL-3.0 계열 라이선스를 유지합니다. GPL-3.0은 수정과 재배포를 허용하지만, 배포 시 동일한 라이선스 조건을 유지해야 하며, 라이선스 고지와 소스 코드 제공 의무를 따라야 합니다.

본 패키지는 원본 라이선스를 보존하고, 수정된 버전임을 명시하며, VPM / VCC 배포를 위해 패키지 구조, 네임스페이스, 메뉴 경로, asmdef 및 Unity 2022.3+ 호환성을 정리한 버전입니다.



## 릴리즈 노트

### 1.0.6

- 패키지 표시 이름을 `Iyan-Kim Hierarchy Plus Rebone`으로 정리했습니다.
- 패키지 설명과 메타데이터를 현재 배포 형식에 맞게 정리했습니다.
- 라이선스 정보를 `GPL-3.0-or-later`로 명시했습니다.
- VPM / VCC 패키지 구성을 정리했습니다.

### 1.0.5

- 패키지 배포 관련 메타데이터를 정리했습니다.
- VPM repository 등록 및 배포 안정성을 위한 유지보수 작업을 진행했습니다.
- 기능 변경은 없습니다.

### 1.0.4

- Unity 2022.3+ 환경에서 사용할 수 있도록 패키지 구조를 정리했습니다.
- Editor-only asmdef 구성을 보강했습니다.
- 원본 HierarchyPlus와 충돌을 줄이기 위한 네임스페이스 구조를 정리했습니다.

### 1.0.3

- 메뉴 경로를 Iyan-Kim 툴 구조에 맞게 정리했습니다.
- 설정 창 이름과 PRODUCT_NAME을 `Hierarchy Plus Rebone` 기준으로 수정했습니다.
- VPM 패키지 배포를 위한 내부 파일 구성을 정리했습니다.

### 1.0.2

- 원본 HierarchyPlus 코드를 현대 Unity 패키지 구조에 맞게 리팩터링했습니다.
- 저장 설정, 스타일, 콘텐츠, 들여쓰기, 색상 처리 관련 클래스를 패키지 내부 구조에 맞게 정리했습니다.
- Editor 전용 코드로 분리했습니다.

### 1.0.1

- 원본 HierarchyPlus 기반 기능을 Rebone 프로젝트 구조로 이전했습니다.
- 네임스페이스와 파일 구조를 정리했습니다.
- VPM 배포를 위한 초기 패키지 구성을 추가했습니다.

### 1.0.0

- 최초 릴리즈입니다.
- 원본 HierarchyPlus를 기반으로 한 Hierarchy Plus Rebone 프로젝트를 시작했습니다.
- Unity Hierarchy 창의 색상, 가이드 라인, 컴포넌트 아이콘, Tag / Layer 라벨 표시 기능을 포함했습니다.
- GPL-3.0 라이선스를 유지한 상태로 수정 및 재배포 가능한 구조를 구성했습니다.