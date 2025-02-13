async function handleCC(event) {
  event.preventDefault(); // ✅ 기본 Form 제출 막기 (새로고침 방지)

  // ✅ 서버 API URL
  const url = "https://coordinated-onyx-ethernet.glitch.me";
  const formData = new FormData(document.querySelector("#ccForm"));
  const text = formData.get("text"); // 사용자가 입력한 위인의 이름 가져오기

  // ✅ 검색어가 없으면 요청하지 않음
  if (!text.trim()) {
      alert("검색할 위인의 이름을 입력하세요!");
      return;
  }

  try {
      let imagesLoaded = 0;
      let retryCount = 0;

      const updateImages = async () => {
          console.log(`🔄 ${retryCount + 1}번째 요청: 이미지 데이터 가져오는 중...`);

          // ✅ 서버에 요청 보내기 (POST 요청)
          const response = await fetch(url, {
              method: "POST",
              body: JSON.stringify({ text }),
              headers: { "Content-Type": "application/json" },
          });

          const json = await response.json(); // 응답을 JSON으로 변환
          console.log("📢 서버 응답 데이터:", json); // 🔥 서버에서 받은 데이터 확인 (디버깅용)

          // ✅ 서버가 "이미지 생성 중"이라고 응답하면 10초 후 다시 요청
          if (json.status === "processing") {
              console.warn("⏳ 이미지 생성 중... 10초 후 다시 요청합니다.");
              await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 대기 후 다시 요청
              retryCount++;

              if (retryCount < 7) { // 최대 7번 재요청
                  updateImages();
              } else {
                  alert("이미지 생성이 너무 오래 걸립니다. 나중에 다시 시도해주세요.");
              }
              return;
          }

          // ✅ 🔥 위인 이름 업데이트
          document.getElementById("profile-name").textContent = json.name || "이름 없음"; // 기본값 처리

          // ✅ 🔥 업적 이미지 3장이 아직 다 생성되지 않았다면 계속 요청
          if (json.achievements.length > imagesLoaded) {
              imagesLoaded = json.achievements.length;
              displayImages(json);
          }

          // ✅ 아직 3장이 모두 생성되지 않았다면 10초 후 다시 요청
          if (imagesLoaded < 3 && retryCount < 5) {
              retryCount++;
              setTimeout(updateImages, 10000);
          }
      };

      updateImages(); // 이미지 업데이트 시작

  } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
      alert("위인 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

// ✅ 🔥 동적으로 이미지를 추가하는 함수
function displayImages(json) {
  const imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = ""; // 기존 업적 이미지 삭제 후 새로 추가

  json.achievements.forEach(({ achievement, imageUrl }, index) => {
      const achievementWrapper = document.createElement("div");
      achievementWrapper.classList.add("achievement-item", "text-center");

      const achievementTitle = document.createElement("h5");
      achievementTitle.textContent = achievement || `업적 ${index + 1}`; // 기본값 설정

      const imageTag = document.createElement("img");
      imageTag.classList.add("img-fluid", "mt-3", "achievement-image", "rounded"); // Bootstrap 스타일 적용
      imageTag.src = imageUrl || "default-image.png"; // 기본 이미지 처리
      imageTag.alt = achievement || `업적 ${index + 1} 이미지`;

      // 🔥 이미지가 로드되지 않으면 기본 이미지로 변경
      imageTag.onerror = () => {
          console.error("❌ 이미지 로드 실패:", imageUrl);
          imageTag.src = "default-image.png"; // 기본 이미지 대체
      };

      achievementWrapper.appendChild(achievementTitle);
      achievementWrapper.appendChild(imageTag);
      imageContainer.appendChild(achievementWrapper); // 업적 이미지 추가
  });
}

// ✅ 폼 제출 시 `handleCC` 실행
document.querySelector("#ccForm").addEventListener("submit", handleCC);

// ✅ 검색 버튼 클릭 시에도 `handleCC` 실행
document.querySelector("#search-button").addEventListener("click", handleCC);
