async function main() {
    async function hanldeCC(event) {
      event.preventDefault(); // Form의 기본 submit 막아줘야하고...
  
      // 로딩을 추가했다가...
      const spinner = document.createElement("div");
      spinner.classList.add("spinner-border");
      document.querySelector("#box").appendChild(spinner);
  
      // const url = "http://127.0.0.1:3000";
      const url = "https://coordinated-onyx-ethernet.glitch.me"; //너의 영화 추천 서버 API를 사용하려면 URL 변경해야 해
      const formData = new FormData(document.querySelector("#ccForm"));
      const text = formData.get("text");
      // console.log(text);
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          text,
        }),
        // Content-Type 꼭!
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const json = await response.json();
  
      // 로딩을 추가했다가 종료시 없애는...
      spinner.remove();
  
      // document.querySelector("#box").textContent = JSON.stringify(json);
  
      const { image, desc } = json;
  
      const box = document.querySelector("#box");
      box.innerHTML = "";
      const imageTag = document.createElement("img");
      imageTag.classList.add("img-fluid");
      imageTag.src = image; // image - link
      const descTag = document.createElement("p");
      descTag.textContent = desc;
      box.appendChild(imageTag);
      box.appendChild(descTag);
    }
  
    //   document.querySelector("#ccBtn").addEventListener("click", hanldeCC);
    document.querySelector("#ccForm").addEventListener("submit", hanldeCC);
  }
  
  document.addEventListener("DOMContentLoaded", main);