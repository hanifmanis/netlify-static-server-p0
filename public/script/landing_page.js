document.addEventListener("DOMContentLoaded", async () => {
  // 1. Ambil id dari parameter URL (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");
  console.log(userId)

  // 2. Jika tidak ada ID di URL, langsung lempar ke halaman login
  if (!userId) {
    window.location.href = "/pages/login.html";
    return;
  }

  // 3. Verifikasi ke backend apakah user dengan ID ini is_login = true
  try {
    const response = await fetch(`/api/check-login?id=${userId}`);
    const data = await response.json();

    if (!response.ok || !data.isLogin) {
      // Jika status is_login false / user tidak ditemukan
      window.location.href = "/pages/login.html";
      return;
    }

    console.log("Akses diterima untuk user ID:", userId);
  } catch (error) {
    console.error("Gagal memverifikasi status login:", error);
    window.location.href = "/pages/login.html";
  }

  // 4. Pasang listener untuk tombol logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const response = await fetch("/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          window.location.href = "/pages/login.html";
        }
      } catch (error) {
        console.error("Error logout:", error);
      }
    });
  }
});