async function main() {
  async function hanldeCC(event) {
    event.preventDefault(); // 🚨 기본 Form 제출 막음 (페이지 새로고침 방지)

    // ✅ 로딩 스피너 추가 (로딩 중 표시)
    const spinner = document.createElement("div");
    spinner.classList.add("spinner-border");
    document.querySelector("#box").appendChild(spinner);

    // ✅ 서버 API URL
    const url = "https://coordinated-onyx-ethernet.glitch.me"; 
    const formData = new FormData(document.querySelector("#ccForm"));
    const text = formData.get("text"); // 사용자가 입력한 위인의 이름 가져오기

    // ✅ 서버에 요청 보내기 (POST 요청)
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ text }), // JSON 형식으로 변환하여 보냄
      headers: { "Content-Type": "Application/json" },
    });

    const json = await response.json(); // 응답을 JSON으로 변환

    // ✅ 로딩 스피너 제거
    spinner.remove();

    // ✅ 서버에서 받은 데이터 추출
    const { image, desc } = json;

    // ✅ 🔥 프로필 이미지 업데이트 (기존 `box`에 추가하는 코드 대신 사용!)
    document.getElementById("profile-image").src = image; // 프로필 사진 변경
    document.getElementById("profile-name").textContent = text; // 위인 이름 업데이트
    document.getElementById("profile-desc").textContent = desc; // 위인 설명 업데이트

    // ✅ 🔥 기존에는 box에 이미지와 설명을 넣었는데, 이제는 프로필 정보만 바뀌도록 유지!
    // ✅ box의 내용을 지울 필요 없음 (이미지 추가 X, 프로필만 변경되도록 수정)
    // ❌ 아래 코드는 더 이상 필요 없음 (삭제해야 함!)
    // const box = document.querySelector("#box");
    // box.innerHTML = ""; 
    // const imageTag = document.createElement("img");
    // imageTag.classList.add("img-fluid");
    // imageTag.src = image; // image - link
    // const descTag = document.createElement("p");
    // descTag.textContent = desc;
    // box.appendChild(imageTag);
    // box.appendChild(descTag);
  }

  // ✅ 폼 제출 시 `hanldeCC` 실행
  document.querySelector("#ccForm").addEventListener("submit", hanldeCC);
}

document.addEventListener("DOMContentLoaded", main);
