// Water ripple effect on clicks
document.addEventListener("DOMContentLoaded", () => {
  // Add click event listener to the entire document
  document.addEventListener("click", (e) => {
    createRipple(e.clientX, e.clientY)
  })

  // Create ripple effect
  function createRipple(x, y) {
    const ripple = document.createElement("div")
    ripple.className = "water-ripple"

    // Set initial position - center the ripple on the click position
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    // Add to document
    document.body.appendChild(ripple)

    // Force reflow to ensure the initial state is applied
    ripple.offsetWidth

    // Animate the ripple
    ripple.classList.add("animate")

    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove()
    }, 1000)
  }
})

