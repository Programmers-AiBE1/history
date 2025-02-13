async function main() {
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
      // ✅ 서버에 요청 보내기 (POST 요청)
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ text }), // JSON 형식으로 변환하여 보냄
        headers: { "Content-Type": "Application/json" },
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const json = await response.json(); // 응답을 JSON으로 변환
      const { name, achievements } = json; // ✅ 서버에서 받은 데이터 추출

      if (!achievements || !Array.isArray(achievements) || achievements.length !== 3) {
        throw new Error("서버에서 받은 업적 데이터가 올바르지 않습니다.");
      }

      // ✅ 🔥 위인 이름 업데이트
      document.getElementById("profile-name").textContent = name || "이름 없음"; // 기본값 처리

      // ✅ 🔥 업적 이미지 표시 영역 초기화 후 추가
      const imageContainer = document.getElementById("image-container");
      imageContainer.innerHTML = ""; // 기존 업적 이미지 삭제

      // ✅ 🔥 업적 이미지 3장 추가
      achievements.forEach(({ achievement, imageUrl }, index) => {
        const achievementWrapper = document.createElement("div");
        achievementWrapper.classList.add("achievement-item");

        const achievementTitle = document.createElement("h5");
        achievementTitle.textContent = achievement || `업적 ${index + 1}`; // 기본값 설정

        const imageTag = document.createElement("img");
        imageTag.classList.add("img-fluid", "mt-3", "achievement-image"); // Bootstrap 스타일 적용
        imageTag.src = imageUrl || "default-image.png"; // 기본 이미지 처리
        imageTag.alt = achievement || `업적 ${index + 1} 이미지`;

        achievementWrapper.appendChild(achievementTitle);
        achievementWrapper.appendChild(imageTag);
        imageContainer.appendChild(achievementWrapper); // 업적 이미지 추가
      });
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
      alert("위인 정보를 불러오는 중 오류가 발생했습니다.");
    }
  }

  // ✅ 폼 제출 시 `handleCC` 실행
  document.querySelector("#ccForm").addEventListener("submit", handleCC);

  // ✅ 검색 버튼 클릭 시에도 `handleCC` 실행
  document.querySelector("#search-button").addEventListener("click", handleCC);
}

document.addEventListener("DOMContentLoaded", main);
