// タブ切り替え
document.querySelectorAll(".tab-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// 募集保存
const form = document.getElementById("helpForm");
const postList = document.getElementById("postList");

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("helperPosts") || "[]");
  renderPosts(posts);
}

function renderPosts(posts) {
  postList.innerHTML = "";
  posts.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p><strong>カテゴリ:</strong> ${p.category}</p>
      <p><strong>エリア:</strong> ${p.area}</p>
      <p><strong>希望日時:</strong> ${p.datetime || "未指定"}</p>
      <p><strong>詳細:</strong> ${p.details}</p>
      <p><strong>お礼/報酬:</strong> ${p.reward || "未記入"}</p>
      <div>
        <button onclick="alert('連絡先: ${p.contact || "未記入"}\\n合言葉: ${p.keyword || "なし"}')">連絡先を見る</button>
        <button onclick="completePost(${i})">完了</button>
      </div>
      <small>投稿日時: ${p.created}</small>
    `;
    postList.appendChild(card);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: title.value,
    category: category.value,
    area: area.value,
    datetime: datetime.value,
    place: place.value,
    reward: reward.value,
    details: details.value,
    contact: contact.value,
    keyword: keyword.value,
    created: new Date().toLocaleString()
  };
  const posts = JSON.parse(localStorage.getItem("helperPosts") || "[]");
  posts.unshift(data);
  localStorage.setItem("helperPosts", JSON.stringify(posts));
  form.reset();
  alert("募集を登録しました。");
  loadPosts();
});

function completePost(index) {
  const posts = JSON.parse(localStorage.getItem("helperPosts") || "[]");
  if (confirm("この募集を完了しますか？")) {
    posts.splice(index, 1);
    localStorage.setItem("helperPosts", JSON.stringify(posts));
    loadPosts();
  }
}

// 検索＆カテゴリフィルター
document.getElementById("search").addEventListener("input", filterPosts);
document.getElementById("filterCategory").addEventListener("change", filterPosts);

function filterPosts() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("filterCategory").value;
  const posts = JSON.parse(localStorage.getItem("helperPosts") || "[]");
  const filtered = posts.filter(p =>
    (!category || p.category === category) &&
    (p.title.toLowerCase().includes(keyword) ||
     p.details.toLowerCase().includes(keyword) ||
     p.area.toLowerCase().includes(keyword))
  );
  renderPosts(filtered);
}

loadPosts();
