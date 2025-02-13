async function main() {
  async function hanldeCC(event) {
    event.preventDefault(); // ✅ 기본 Form 제출 막음 (새로고침 방지)

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

    // ✅ 서버에 요청 보내기 (POST 요청)
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ text }), // JSON 형식으로 변환하여 보냄
      headers: { "Content-Type": "Application/json" },
    });

    const json = await response.json(); // 응답을 JSON으로 변환
    const { image, desc } = json; // ✅ 서버에서 받은 데이터 추출

    // ✅ 로딩 스피너 숨기기
    document.getElementById("loading-spinner").style.display = "none";

    // ✅ 🔥 프로필 이미지 업데이트 (기존 `box.appendChild(imageTag);` 대신)
    document.getElementById("profile-image").src = image; // 프로필 사진 변경
    document.getElementById("profile-name").textContent = text; // 위인 이름 업데이트
    document.getElementById("profile-desc").textContent = desc; // 위인 설명 업데이트

    // ✅ 🔥 업적 이미지 표시 영역 초기화 후 추가 가능 (추후 확장 가능)
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = ""; // 기존 이미지 삭제

    const imageTag = document.createElement("img");
    imageTag.classList.add("img-fluid", "mt-3"); // Bootstrap 스타일 적용
    imageTag.src = image; // 서버에서 받은 이미지 적용
    imageContainer.appendChild(imageTag); // 이미지 추가
  }

  // ✅ 폼 제출 시 `hanldeCC` 실행
  document.querySelector("#ccForm").addEventListener("submit", hanldeCC);

  // ✅ 검색 버튼 클릭 시에도 `hanldeCC` 실행
  document.querySelector("#search-button").addEventListener("click", hanldeCC);
}

document.addEventListener("DOMContentLoaded", main);
