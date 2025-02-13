async function main() {
  async function handleCC(event) {
    event.preventDefault(); // ✅ 기본 Form 제출 막기 (새로고침 방지)

    // ✅ 로딩 스피너 표시
    document.getElementById("loading-spinner").style.display = "block";

    // ✅ 서버 API URL
    const url = "https://coordinated-onyx-ethernet.glitch.me"; 
    const formData = new FormData(document.querySelector("#ccForm"));
    const text = formData.get("text"); // 사용자가 입력한 위인의 이름 가져오기

    // ✅ 검색어가 없으면 요청하지 않음
    if (!text.trim()) {
      alert("검색할 위인의 이름을 입력하세요!");
      document.getElementById("loading-spinner").style.display = "none";
      return;
    }

    try {
      // ✅ 서버에 요청 보내기 (POST 요청)
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ text }), // JSON 형식으로 변환하여 보냄
        headers: { "Content-Type": "Application/json" },
      });

      const json = await response.json(); // 응답을 JSON으로 변환
      const { name, profileImage, description, achievementImages } = json; // ✅ 서버에서 받은 데이터 추출

      // ✅ 로딩 스피너 숨기기
      document.getElementById("loading-spinner").style.display = "none";

      // ✅ 🔥 프로필 이미지 업데이트
      document.getElementById("profile-image").src = profileImage; // 프로필 사진 변경
      document.getElementById("profile-name").textContent = name; // 위인 이름 업데이트
      document.getElementById("profile-desc").textContent = description; // 위인 설명 업데이트

      // ✅ 🔥 업적 이미지 표시 영역 초기화 후 추가
      const imageContainer = document.getElementById("image-container");
      imageContainer.innerHTML = ""; // 기존 업적 이미지 삭제

      // ✅ 🔥 업적 이미지 3장 추가
      achievementImages.forEach(({ achievement, imageUrl }) => {
        const acasync function main() {
          async function handleCC(event) {
            event.preventDefault(); // ✅ 기본 Form 제출 막기 (새로고침 방지)
        
            // ✅ 로딩 스피너 표시
            document.getElementById("loading-spinner").style.display = "block";
        
            // ✅ 서버 API URL
            const url = "https://coordinated-onyx-ethernet.glitch.me"; 
            const formData = new FormData(document.querySelector("#ccForm"));
            const text = formData.get("text"); // 사용자가 입력한 위인의 이름 가져오기
        
            // ✅ 검색어가 없으면 요청하지 않음
            if (!text.trim()) {
              alert("검색할 위인의 이름을 입력하세요!");
              document.getElementById("loading-spinner").style.display = "none";
              return;
            }
        
            try {
              let retryCount = 0;
              let json;
        
              while (retryCount < 10) { // 최대 10번 재시도
                console.log(`🔄 ${retryCount + 1}번째 요청 시도...`);
        
                // ✅ 서버에 요청 보내기 (POST 요청)
                const response = await fetch(url, {
                  method: "POST",
                  body: JSON.stringify({ text }), // JSON 형식으로 변환하여 보냄
                  headers: { "Content-Type": "application/json" },
                });
        
                json = await response.json(); // 응답을 JSON으로 변환
                console.log("📢 서버 응답 데이터:", json); // 🔥 서버에서 받은 데이터 확인 (디버깅용)
        
                // ✅ 이미지 생성이 아직 진행 중이면 10초 후 재요청
                if (json.status === "processing") {
                  console.warn("⏳ 이미지 생성 중... 10초 후 다시 요청합니다.");
                  await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 대기 후 다시 요청
                  retryCount++;
                  continue;
                } else {
                  break; // 정상 데이터 수신 시 반복 종료
                }
              }
        
              if (!json.achievements || !Array.isArray(json.achievements)) {
                throw new Error("서버에서 받은 업적 데이터가 올바르지 않습니다.");
              }
        
              // ✅ 로딩 스피너 숨기기
              document.getElementById("loading-spinner").style.display = "none";
        
              // ✅ 🔥 위인 이름 업데이트
              document.getElementById("profile-name").textContent = json.name || "이름 없음"; // 기본값 처리
        
              // ✅ 🔥 업적 이미지 표시 영역 초기화 후 추가
              const imageContainer = document.getElementById("image-container");
              imageContainer.innerHTML = ""; // 기존 업적 이미지 삭제
        
              // ✅ 🔥 업적 이미지 3장 추가
              json.achievements.forEach(({ achievement, imageUrl }) => {
                const achievementWrapper = document.createElement("div");
                achievementWrapper.classList.add("achievement-item", "text-center");
        
                const achievementTitle = document.createElement("h5");
                achievementTitle.textContent = achievement; // 업적 제목 추가
        
                const imageTag = document.createElement("img");
                imageTag.classList.add("img-fluid", "mt-3", "achievement-image"); // Bootstrap 스타일 적용
                imageTag.src = imageUrl; // 서버에서 받은 업적 이미지 적용
                imageTag.alt = achievement || "업적 이미지";
        
                // 🔥 이미지 로딩 실패 시 기본 이미지 표시
                imageTag.onerror = () => {
                  console.error("❌ 이미지 로드 실패:", imageUrl);
                  imageTag.src = "default-image.png"; // 기본 이미지 대체
                };
        
                achievementWrapper.appendChild(achievementTitle);
                achievementWrapper.appendChild(imageTag);
                imageContainer.appendChild(achievementWrapper); // 업적 이미지 추가
              });
        
            } catch (error) {
              console.error("데이터 로딩 중 오류 발생:", error);
              alert("위인 정보를 불러오는 중 오류가 발생했습니다.");
              document.getElementById("loading-spinner").style.display = "none";
            }
          }
        
          // ✅ 폼 제출 시 `handleCC` 실행
          document.querySelector("#ccForm").addEventListener("submit", handleCC);
        
          // ✅ 검색 버튼 클릭 시에도 `handleCC` 실행
          document.querySelector("#search-button").addEventListener("click", handleCC);
        }
        
        document.addEventListener("DOMContentLoaded", main);
        hievementWrapper = document.createElement("div");
        achievementWrapper.classList.add("achievement-item");

        const achievementTitle = document.createElement("h5");
        achievementTitle.textContent = achievement; // 업적 제목 추가

        const imageTag = document.createElement("img");
        imageTag.classList.add("img-fluid", "mt-3", "achievement-image"); // Bootstrap 스타일 적용
        imageTag.src = imageUrl; // 서버에서 받은 업적 이미지 적용

        achievementWrapper.appendChild(achievementTitle);
        achievementWrapper.appendChild(imageTag);
        imageContainer.appendChild(achievementWrapper); // 업적 이미지 추가
      });
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
      alert("위인 정보를 불러오는 중 오류가 발생했습니다.");
      document.getElementById("loading-spinner").style.display = "none";
    }
  }

  // ✅ 폼 제출 시 `handleCC` 실행
  document.querySelector("#ccForm").addEventListener("submit", handleCC);

  // ✅ 검색 버튼 클릭 시에도 `handleCC` 실행
  document.querySelector("#search-button").addEventListener("click", handleCC);
}

document.addEventListener("DOMContentLoaded", main);
