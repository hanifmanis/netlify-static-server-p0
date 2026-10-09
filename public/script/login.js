const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Login failed";
      return;
    }

    window.location.href = `/landingPage?id=${data.id}`;
  } catch (error) {
    message.textContent = "Unable to connect to server.";
    console.log(error)
  }
});
