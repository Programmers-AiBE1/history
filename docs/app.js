async function main() {
  async function hanldeCC(event) {
      event.preventDefault(); // 🚨 기본 Form 제출 막기 (페이지 새로고침 방지)

      // ✅ 로딩 스피너 표시
      document.getElementById("loading-spinner").style.display = "block";

      // ✅ 서버 API URL
      const url = "https://coordinated-onyx-ethernet.glitch.me";
      const formData = new FormData(document.querySelector("#ccForm"));
      const text = formData.get("text"); // 사용자가 입력한 위인의 이름 가져오기

      // ✅ 서버에 요청 보내기 (POST 요청)
      const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({ text }),
          headers: { "Content-Type": "application/json" },
      });

      const json = await response.json(); // 응답을 JSON으로 변환

      // ✅ 로딩 스피너 숨기기
      document.getElementById("loading-spinner").style.display = "none";

      // ✅ 서버에서 받은 데이터 추출
      const { image, desc } = json;

      // ✅ 프로필 이미지 업데이트 (기존 이미지 태그에 적용)
      document.getElementById("profile-image").src = image;

      // ✅ 위인의 이름 업데이트
      document.getElementById("profile-name").textContent = text;

      // ✅ 위인 설명 업데이트
      document.getElementById("profile-desc").textContent = desc;
  }

  // ✅ 폼 제출 시 `hanldeCC` 실행
  document.querySelector("#ccForm").addEventListener("submit", hanldeCC);
}

document.addEventListener("DOMContentLoaded", main);
