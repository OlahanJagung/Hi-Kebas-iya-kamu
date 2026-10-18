// ===== Pengaturan (silakan ubah) =====
const WA_NUMBER = "6281234567890"; // ganti dengan nomor WhatsApp Hi! Kebab
const ONGKIR = 8000;
const DISKON = 0.05;
const TIER = ["Varian 1", "Varian 2", "Varian 3"]; // ganti nama varian harga jika perlu
// Harga dalam ribuan: 18 = Rp18.000
const MENU = {
  big: [
    ["Beef Kebab Original", [18,21,24], "🌯", "Rasa klasik yang selalu jadi favorit."],
    ["Beef Kebab Bolognese", [19,22,25], "🍝", "Saus bolognese gurih dan kaya rasa."],
    ["Beef Kebab Black Pepper", [20,23,26], "🧂", "Lada hitam yang hangat dan menggigit."],
    ["Beef Kebab Creamy Cheese", [20,23,26], "🧀", "Lumer, creamy, penuh keju."],
    ["Beef Kebab Curry", [20,23,26], "🍛", "Bumbu kari yang harum dan khas."],
    ["Beef Kebab Spicy Garlic", [20,23,26], "🧄", "Pedas, bawang putih, bikin nagih."],
    ["Beef Kebab Spicy Barbeque", [20,23,26], "🔥", "Saus BBQ pedas manis yang smoky."],
    ["Beef Kebab Pineapple", [20,23,26], "🍍", "Segar manis nanas, beda dari yang lain."],
    ["Beef Kebab Spicy Mozzarella", [23,26,29], "🧀", "Pedas dengan mozzarella yang melar."],
    ["Beef Kebab Spicy Korea", [20,23,29], "🌶️", "Saus ala Korea, pedas manis gurih."]
  ],
  small: [
    ["Beef Kebab Original", [13,16,19], "🌯", "Rasa klasik yang selalu jadi favorit."],
    ["Beef Kebab Bolognese", [14,17,20], "🍝", "Saus bolognese gurih dan kaya rasa."],
    ["Beef Kebab Black Pepper", [15,18,21], "🧂", "Lada hitam yang hangat dan menggigit."],
    ["Beef Kebab Creamy Cheese", [15,18,21], "🧀", "Lumer, creamy, penuh keju."],
    ["Beef Kebab Curry", [15,18,21], "🍛", "Bumbu kari yang harum dan khas."],
    ["Beef Kebab Spicy Garlic", [15,18,21], "🧄", "Pedas, bawang putih, bikin nagih."],
    ["Beef Kebab Spicy Barbeque", [15,18,21], "🔥", "Saus BBQ pedas manis yang smoky."],
    ["Beef Kebab Pineapple", [15,18,21], "🍍", "Segar manis nanas, beda dari yang lain."],
    ["Beef Kebab Mozzarella", [18,21,24], "🧀", "Mozzarella melar yang bikin puas."],
    ["Beef Kebab Spicy Korea", [15,18,21], "🌶️", "Saus ala Korea, pedas manis gurih."]
  ]
};
const SEGMEN = [
  {t:"Gratis Ongkir", k:"ongkir", dark:true}, {t:"Diskon 5%", k:"diskon"}, {t:"Zonk", k:"zonk"},
  {t:"Gratis Ongkir", k:"ongkir", dark:true}, {t:"Diskon 5%", k:"diskon"}, {t:"Zonk", k:"zonk"}
];

const $ = s => document.querySelector(s);
const rp = n => "Rp" + n.toLocaleString("id-ID");
const asli = k => k * 1000;
const state = { email:null, hadiah:null, cart:{}, size:"big", pending:null };
const harga = k => state.hadiah === "diskon" ? Math.round(asli(k) * (1 - DISKON)) : asli(k);

// ===== Penyimpanan aman =====
const simpan = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const muat = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const hapus = k => { try { localStorage.removeItem(k); } catch (e) {} };
const hariIni = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(); };
const spinKey = () => "hikebab_spin_" + state.email;

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600);
}

// ===== Email =====
function requireEmail(cb) {
  if (state.email) return cb();
  state.pending = cb; bukaModal();
}
function bukaModal() { $("#emailErr").textContent = ""; $("#modal").classList.add("show"); setTimeout(() => $("#emailIn").focus(), 50); }
function tutupModal() { $("#modal").classList.remove("show"); }
function setEmail(e) {
  state.email = e; simpan("hikebab_email", e);
  $("#userBtn").textContent = "👤 " + e;
  muatSpin();
}
$("#emailOk").onclick = () => {
  const e = $("#emailIn").value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) { $("#emailErr").textContent = "Format email belum benar."; return; }
  setEmail(e); tutupModal(); toast("Halo! Email tersimpan ✅");
  const cb = state.pending; state.pending = null; if (cb) cb();
};
$("#emailNo").onclick = () => { state.pending = null; tutupModal(); };
$("#emailIn").onkeydown = e => { if (e.key === "Enter") $("#emailOk").click(); };
$("#userBtn").onclick = () => { state.pending = null; $("#emailIn").value = state.email || ""; bukaModal(); };

// ===== Menu =====
function renderMenu() {
  const disc = state.hadiah === "diskon";
  $("#menuGrid").innerHTML = MENU[state.size].map((m, i) => `
    <div class="card">
      ${disc ? '<span class="tag">-5%</span>' : ""}
      <div class="ic">${m[2]}</div>
      <h3>${m[0]}</h3>
      <span class="sz">${state.size.toUpperCase()}</span>
      <p>${m[3]}</p>
      <div class="pvs">${m[1].map((k, t) => `
        <button class="pv ${disc ? "d" : ""}" data-i="${i}" data-t="${t}">
          <small>${TIER[t]}</small>
          <span>${disc ? `<s>${rp(asli(k))}</s>` : ""}<b>${rp(harga(k))}</b></span>
        </button>`).join("")}</div>
    </div>`).join("");
  $("#menuSub").textContent = disc
    ? "🎉 Diskon 5% aktif! Semua harga sudah turun (harga asli dicoret)."
    : "Pilih ukuran, lalu tap harga untuk menambah ke keranjang. Putar roda untuk peluang diskon 5%.";
}
$("#menuGrid").onclick = e => {
  const b = e.target.closest(".pv"); if (!b) return;
  requireEmail(() => tambah(state.size, +b.dataset.i, +b.dataset.t));
};
document.querySelectorAll(".tab").forEach(b => b.onclick = () => {
  state.size = b.dataset.size;
  document.querySelectorAll(".tab").forEach(x => x.classList.toggle("on", x === b));
  renderMenu();
});

// ===== Keranjang =====
function item(key) {
  const [s, i, t] = key.split("|"); const m = MENU[s][+i];
  return { nama: `${m[0]} ${s.toUpperCase()} (${TIER[+t]})`, k: m[1][+t] };
}
function tambah(s, i, t) {
  const key = [s, i, t].join("|"); state.cart[key] = (state.cart[key] || 0) + 1;
  renderCart(); toast("Ditambahkan ke keranjang 🌯");
}
$("#cartList").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  const key = b.dataset.key; state.cart[key] += +b.dataset.d;
  if (state.cart[key] <= 0) delete state.cart[key];
  renderCart();
};
function hitung() {
  let sub = 0, normal = 0, jml = 0;
  for (const key in state.cart) { const q = state.cart[key], it = item(key); sub += q * harga(it.k); normal += q * asli(it.k); jml += q; }
  const ongkir = jml === 0 ? 0 : (state.hadiah === "ongkir" ? 0 : ONGKIR);
  return { sub, normal, jml, ongkir, total: sub + ongkir };
}
function renderCart() {
  const h = hitung();
  if (h.jml === 0) {
    $("#cartList").innerHTML = '<div class="empty">Keranjang masih kosong. Yuk pilih menu favoritmu! 😋</div>';
    $("#cartSum").innerHTML = ""; $("#checkout").disabled = true; $("#bar").classList.remove("show"); return;
  }
  const disc = state.hadiah === "diskon";
  $("#cartList").innerHTML = Object.keys(state.cart).map(key => {
    const it = item(key);
    return `<div class="row"><div><b>${it.nama}</b><br><small>${rp(harga(it.k))}${disc ? ` <s>${rp(asli(it.k))}</s>` : ""}</small></div>
      <div class="qty"><button data-key="${key}" data-d="-1" aria-label="Kurangi">−</button><b>${state.cart[key]}</b><button data-key="${key}" data-d="1" aria-label="Tambah">+</button></div></div>`;
  }).join("");
  $("#cartSum").innerHTML = `
    ${disc ? `<div><span>Harga normal</span><s>${rp(h.normal)}</s></div><div class="good"><span>Hemat diskon 5%</span><span>-${rp(h.normal - h.sub)}</span></div>` : ""}
    <div><span>Subtotal</span><span>${rp(h.sub)}</span></div>
    <div><span>Ongkir</span>${h.ongkir === 0 ? `<span class="good"><s>${rp(ONGKIR)}</s> GRATIS</span>` : `<span>${rp(h.ongkir)}</span>`}</div>
    <div class="tot"><span>Total</span><span>${rp(h.total)}</span></div>`;
  $("#checkout").disabled = false;
  $("#bar").classList.add("show"); $("#barTxt").textContent = h.jml + " item · " + rp(h.total);
}
$("#checkout").onclick = () => requireEmail(() => {
  const h = hitung();
  let t = "Halo Hi! Kebab Signature, saya mau pesan:\n";
  for (const key in state.cart) { const it = item(key); t += `- ${it.nama} x${state.cart[key]} (${rp(harga(it.k) * state.cart[key])})\n`; }
  t += `\nSubtotal: ${rp(h.sub)}\nOngkir: ${h.ongkir === 0 ? "GRATIS" : rp(h.ongkir)}\nTotal: ${rp(h.total)}`;
  if (state.hadiah === "diskon") t += "\n(Diskon 5% dari putaran harian)";
  t += `\nEmail: ${state.email}`;
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(t), "_blank");
});

// ===== Roda =====
(function buatRoda() {
  SEGMEN.forEach((s, i) => {
    const el = document.createElement("div");
    el.className = "lbl" + (s.dark ? " dark" : ""); el.textContent = s.t;
    el.style.transform = `translate(-50%,-50%) rotate(${i * 60 + 30 - 90}deg) translate(75px,0)`;
    $("#wheel").appendChild(el);
  });
})();

function resetSpinUI() {
  state.hadiah = null;
  $("#spinBtn").disabled = false; $("#spinBtn").textContent = "PUTAR SEKARANG";
  $("#spinMsg").textContent = state.email ? "Siap memutar? Semoga hari ini beruntung!" : "Masukkan email untuk memutar roda.";
  $("#banner").classList.remove("show");
}
function tampilHasil(k, baru) {
  state.hadiah = k === "zonk" ? null : k;
  const p = { ongkir: "🚚 Selamat! GRATIS ONGKIR untuk pesananmu hari ini.", diskon: "🏷️ Selamat! Diskon 5% untuk semua menu hari ini.", zonk: "💨 Zonk! Belum beruntung, coba lagi besok ya." };
  $("#spinMsg").textContent = p[k] + (baru ? "" : " Kamu sudah memutar hari ini, datang lagi besok!");
  $("#spinBtn").disabled = true; $("#spinBtn").textContent = "Sudah diputar hari ini";
  const b = $("#banner");
  if (k === "zonk") b.classList.remove("show");
  else { b.textContent = k === "diskon" ? "🏷️ Diskon 5% aktif! Semua harga menu sudah dikurangi." : "🚚 Gratis ongkir aktif untuk pesananmu hari ini!"; b.classList.add("show"); }
  renderMenu(); renderCart();
}
function muatSpin() {
  let s = null; try { s = JSON.parse(muat(spinKey())); } catch (e) {}
  if (s && s.tgl === hariIni()) tampilHasil(s.hasil, false);
  else { resetSpinUI(); renderMenu(); renderCart(); }
}
let putar = 0, sedang = false;
$("#spinBtn").onclick = () => requireEmail(() => {
  if (sedang) return;
  sedang = true; $("#spinBtn").disabled = true; $("#spinMsg").textContent = "Roda berputar...";
  const idx = Math.floor(Math.random() * SEGMEN.length);
  putar += 360 * 6 + (360 - (idx * 60 + 30)) + (Math.random() * 30 - 15) - (putar % 360);
  $("#wheel").style.transform = `rotate(${putar}deg)`;
  setTimeout(() => {
    const k = SEGMEN[idx].k;
    simpan(spinKey(), JSON.stringify({ tgl: hariIni(), hasil: k }));
    sedang = false; tampilHasil(k, true);
    toast(k === "zonk" ? "Zonk 💨" : "Hadiah aktif! 🎉");
  }, 5200);
});
$("#resetBtn").onclick = () => {
  if (state.email) hapus(spinKey());
  state.cart = {}; resetSpinUI(); renderMenu(); renderCart(); toast("Putaran direset untuk uji coba");
};

// ===== Mulai =====
const e0 = muat("hikebab_email");
if (e0) setEmail(e0); else { resetSpinUI(); renderMenu(); renderCart(); }
