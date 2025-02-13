async function main() {
  async function handleCC(event) {
    event.preventDefault();
    document.getElementById("loading-spinner").style.display = "block";

    const url = "https://coordinated-onyx-ethernet.glitch.me";
    const formData = new FormData(document.querySelector("#ccForm"));
    const text = formData.get("text");

    if (!text.trim()) {
      alert("검색할 위인의 이름을 입력하세요!");
      document.getElementById("loading-spinner").style.display = "none";
      return;
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "Application/json" },
    });

    const json = await response.json();
    const { profileImage, description, achievementImages } = json;

    document.getElementById("loading-spinner").style.display = "none";

    // ✅ 프로필 정보 업데이트
    document.getElementById("profile-image").src = profileImage;
    document.getElementById("profile-name").textContent = text;
    document.getElementById("profile-desc").textContent = description;

    // ✅ 업적 이미지 추가 (기존 이미지 삭제 후 새로운 3장 추가)
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = ""; // 기존 이미지 삭제

    achievementImages.forEach((imgSrc) => {
      const imgElement = document.createElement("img");
      imgElement.classList.add("img-fluid", "mt-3"); // Bootstrap 스타일 적용
      imgElement.src = imgSrc;
      imgElement.style.width = "300px"; // 업적 이미지 크기 조절
      imgElement.style.height = "auto";
      imageContainer.appendChild(imgElement);
    });
  }

  document.querySelector("#ccForm").addEventListener("submit", handleCC);
  document.querySelector("#search-button").addEventListener("click", handleCC);
}
document.addEventListener("DOMContentLoaded", main);
