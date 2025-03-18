document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  checkLoggedInStatus()

  // Initialize auth tabs
  initAuthTabs()

  // Initialize form submissions
  initFormSubmissions()

  // Check URL parameters for auto-tab selection
  checkUrlParams()

  // Initialize back to home button
  initBackToHomeButton()
})

// Check if user is already logged in
function checkLoggedInStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (currentUser) {
    // Redirect to landing page if already logged in
    window.location.href = "landing.html"
  }
}

// Auth tabs initialization
function initAuthTabs() {
  const authTabs = document.querySelectorAll(".auth-tab")
  const authForms = document.querySelectorAll(".auth-form")

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and forms
      authTabs.forEach((t) => t.classList.remove("active"))
      authForms.forEach((f) => f.classList.remove("active"))

      // Add active class to clicked tab
      tab.classList.add("active")

      // Show corresponding form
      const formId = `${tab.getAttribute("data-tab")}-form`
      document.getElementById(formId).classList.add("active")
    })
  })
}

// Form submissions
function initFormSubmissions() {
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginError = document.getElementById("login-error")
  const signupError = document.getElementById("signup-error")
  const signupSuccess = document.getElementById("signup-success")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      // Validate form
      if (!email || !password) {
        loginError.textContent = "Please fill in all fields"
        loginError.style.display = "block"
        return
      }

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users")) || []
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        loginError.textContent = "Invalid email or password"
        loginError.style.display = "block"
        return
      }

      // Set current user in localStorage (session)
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: user.name,
          email: user.email,
          id: user.id,
        }),
      )

      // Show success message
      loginError.style.display = "none"
      showToast("Login successful! Redirecting to dashboard...")

      // Redirect to main page after short delay
      setTimeout(() => {
        window.location.href = "landing.html"
      }, 1500)
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("signup-name").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm").value

      // Validate form
      if (!name || !email || !password || !confirmPassword) {
        signupError.textContent = "Please fill in all fields"
        signupError.style.display = "block"
        signupSuccess.style.display = "none"
        return
      }

      if (password !== confirmPassword) {
        signupError.textContent = "Passwords do not match"
        signupError.style.display = "block"
        signupSuccess.style.display = "none"
        return
      }

      // Validate email format (simple check for GMIT domain)
      if (!email.endsWith("@gmail.com")) {
        signupError.textContent = "Please use your GMIT email address (@gmail.com)"
        signupError.style.display = "block"
        signupSuccess.style.display = "none"
        return
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users")) || []
      if (users.some((user) => user.email === email)) {
        signupError.textContent = "This email is already registered"
        signupError.style.display = "block"
        signupSuccess.style.display = "none"
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        dateJoined: new Date().toISOString(),
      }

      // Add user to localStorage
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Show success message
      signupError.style.display = "none"
      signupSuccess.style.display = "block"
      signupSuccess.textContent = "Account created successfully! You can now log in."

      // Reset form
      signupForm.reset()

      // Switch to login tab after short delay
      setTimeout(() => {
        document.querySelector('.auth-tab[data-tab="login"]').click()
      }, 2000)
    })
  }
}

// Check URL parameters for auto-tab selection
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)
  const signupParam = urlParams.get("signup")

  if (signupParam === "true") {
    // Trigger click on signup tab
    document.querySelector('.auth-tab[data-tab="signup"]').click()
  }
}

// Back to Home button initialization
function initBackToHomeButton() {
  const backToHomeBtn = document.getElementById("back-to-home-btn")
  const transitionOverlay = document.getElementById("transition-overlay")

  if (backToHomeBtn && transitionOverlay) {
    backToHomeBtn.addEventListener("click", () => {
      // Hide default logo, show home logo
      const defaultLogo = document.querySelector(".transition-logo:not(.home-logo)")
      const homeLogo = document.querySelector(".transition-logo.home-logo")

      if (defaultLogo && homeLogo) {
        defaultLogo.style.display = "none"
        homeLogo.style.display = "flex"
      }

      // Add active class to overlay to show it
      transitionOverlay.classList.add("active")

      // After animation completes, redirect to index.html
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)

      // Add pulse animation to the button
      backToHomeBtn.classList.add("pulse")
    })
  }
}

// Show toast notification
function showToast(message) {
  // Create toast element if it doesn't exist
  let toast = document.getElementById("toast-notification")
  if (!toast) {
    toast = document.createElement("div")
    toast.id = "toast-notification"
    document.body.appendChild(toast)
  }

  // Set message and show toast
  toast.textContent = message
  toast.classList.add("show")

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

