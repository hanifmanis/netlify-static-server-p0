const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Registration failed";
      return;
    }

    window.location.href = "/pages/login.html";
  } catch (error) {
    message.textContent = "Unable to connect to server.";
  }
});
