const WA_NUMBER = "628xxxxxxxxxx";

const nameInput = document.getElementById("contactName");
const phoneInput = document.getElementById("contactPhone");
const messageInput = document.getElementById("contactMessage");
const submitBtn = document.getElementById("contactSubmit");
const statusText = document.getElementById("contactStatus");

function setStatus(text, isError) {
  statusText.textContent = text;
  statusText.className = "small mb-2 text-white" + (isError ? "text-white" : "text-success");
}

submitBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !phone || !message) {
    setStatus("Semua kolom wajib diisi.", true);
    return;
  }

  submitBtn.disabled = true;
  setStatus("Mengirim...", false);

  const waWindow = WA_NUMBER ? window.open("", "_blank") : null;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, message })
    });
    const data = await response.json();

    if (!response.ok) {
      if (waWindow) waWindow.close();
      setStatus(data.message || "Gagal mengirim pesan.", true);
      return;
    }

    setStatus("Pesan berhasil dikirim. Kami akan segera menghubungi kamu.", false);

    if (waWindow) {
      const text = `Halo, saya ${name} (${phone}).\n\n${message}`;
      waWindow.location.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    }

    nameInput.value = "";
    phoneInput.value = "";
    messageInput.value = "";
  } catch (error) {
    console.error(error);
    if (waWindow) waWindow.close();
    setStatus("Tidak bisa terhubung ke server.", true);
  } finally {
    submitBtn.disabled = false;
  }
});