// Countdown Timer
const conferenceDate = new Date("October 26, 2025 09:00:00").getTime();

const x = setInterval(function () {
  const now = new Date().getTime();
  const distance = conferenceDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Update the elements
  document.getElementById("days").innerHTML = String(days).padStart(2, "0");
  document.getElementById("hours").innerHTML = String(hours).padStart(2, "0");
  document.getElementById("minutes").innerHTML = String(minutes).padStart(
    2,
    "0"
  );
  document.getElementById("seconds").innerHTML = String(seconds).padStart(
    2,
    "0"
  );

  // If the countdown is over, write some text
  if (distance < 0) {
    clearInterval(x);
    // Ensure elements exist before trying to update them
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
      countdownElement.innerHTML = "THE CONFERENCE HAS BEGUN!";
    }
    const daysElement = document.getElementById("days");
    if (daysElement) daysElement.innerHTML = "00";
    const hoursElement = document.getElementById("hours");
    if (hoursElement) hoursElement.innerHTML = "00";
    const minutesElement = document.getElementById("minutes");
    if (minutesElement) minutesElement.innerHTML = "00";
    const secondsElement = document.getElementById("seconds");
    if (secondsElement) secondsElement.innerHTML = "00";
  }
}, 1000);

// Mobile Menu Toggle
document
  .getElementById("mobile-menu-button")
  .addEventListener("click", function () {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("hidden");
  });

// Close mobile menu when a link is clicked
document.querySelectorAll("#mobile-menu a").forEach((item) => {
  item.addEventListener("click", () => {
    document.getElementById("mobile-menu").classList.add("hidden");
  });
});

// FAQ Toggle Function
function toggleFaq(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById("icon-" + id);
  content.classList.toggle("hidden");
  icon.classList.toggle("rotate-180"); // Rotate icon for visual feedback
}

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex"; // Use flex to center content
  document.body.classList.add('modal-open');
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  document.body.classList.remove('modal-open');
}

// Close modal if user clicks outside of it
window.onclick = function (event) {
  const privacyModal = document.getElementById("privacyPolicyModal");
  const termsModal = document.getElementById("termsOfUseModal");
  const paymentModal = document.getElementById("paymentModal");

  if (event.target == privacyModal) {
    privacyModal.style.display = "none";
  }
  if (event.target == termsModal) {
    termsModal.style.display = "none";
  }
  if (event.target == paymentModal) {
    paymentModal.style.display = "none";
  }
};

// Handle Registration Form Submission (to open payment modal)
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Basic form validation
    if (!this.checkValidity()) {
      // If form is invalid, trigger browser's default validation UI
      this.reportValidity();
      return;
    }

    // Get selected category and set payment amount
    const categorySelect = document.getElementById("category");
    let amount = 0;
    switch (categorySelect.value) {
      case "student":
        amount = 150;
        break;
      case "faculty":
        amount = 250;
        break;
      case "international":
        amount = 350;
        break;
    }
    document.getElementById("paymentAmount").innerText = `$${amount}`;

    openModal("paymentModal"); // Open the payment modal
  });

// Handle Payment Confirmation (simulates sending email)
// function handlePaymentConfirmation() {
//   const paymentProofInput = document.getElementById("payment-proof");
//   const paymentMessage = document.getElementById("paymentMessage");

//   if (!paymentProofInput.files || paymentProofInput.files.length === 0) {
//     paymentMessage.classList.remove("hidden", "text-green-600");
//     paymentMessage.classList.add("text-red-600");
//     paymentMessage.innerText = "Please upload your payment proof.";
//     return;
//   }

//   // Collect all registration data
//   const form = document.getElementById("registrationForm");
//   const formData = new FormData(form);
//   const registrationDetails = {};
//   for (let [key, value] of formData.entries()) {
//     if (
//       key !== "abstract-upload" &&
//       key !== "payment-proof" &&
//       key !== "terms"
//     ) {
//       // Exclude file inputs and terms for simpler log
//       registrationDetails[key] = value;
//     }
//   }

//   // Add file names to details
//   const abstractFile =
//     document.getElementById("abstract-upload").files[0];
//   if (abstractFile) {
//     registrationDetails["abstractFileName"] = abstractFile.name;
//   }
//   const paymentProofFile = paymentProofInput.files[0];
//   if (paymentProofFile) {
//     registrationDetails["paymentProofFileName"] = paymentProofFile.name;
//   }

//   // Simulate sending email with registration details
//   console.log("--- Simulating Email Sending ---");
//   console.log("To: " + registrationDetails.email);
//   console.log("Subject: IRSMC Conference Registration Confirmation");
//   console.log(
//     "Body: Your registration for the International Research Scholars' Meet & Conference has been received. Here are your details:"
//   );
//   console.log(JSON.stringify(registrationDetails, null, 2));
//   console.log("-------------------------------");
//   console.log(
//     "NOTE: In a real application, this data would be sent to a backend service for secure processing, payment validation, and actual email dispatch."
//   );

//   // Display success message
//   paymentMessage.classList.remove("hidden", "text-red-600");
//   paymentMessage.classList.add("text-green-600");
//   paymentMessage.innerText =
//     "Payment confirmed! Your registration details have been sent to your email (simulated).";

//   // Optionally, clear the form or redirect after a short delay
//   setTimeout(() => {
//     closeModal("paymentModal");
//     form.reset(); // Clear the registration form
//     paymentMessage.classList.add("hidden"); // Hide message
//   }, 3000); // Close modal and reset form after 3 seconds
// }
async function handlePaymentConfirmation() {
  const paymentProofInput = document.getElementById("payment-proof");
  const paymentMessage = document.getElementById("paymentMessage");

  if (!paymentProofInput.files || paymentProofInput.files.length === 0) {
    paymentMessage.classList.remove("hidden", "text-green-600");
    paymentMessage.classList.add("text-red-600");
    paymentMessage.innerText = "Please upload your payment proof.";
    return;
  }

  const form = document.getElementById("registrationForm");
  const formData = new FormData(form); // FormData automatically handles file inputs

  // Append payment proof file to formData
  if (paymentProofInput.files[0]) {
    formData.append("payment-proof", paymentProofInput.files[0]);
  }

  // You might also want to append the abstract file if it's not already part of the form
  const abstractFileInput = document.getElementById("abstract-upload");
  if (abstractFileInput && abstractFileInput.files[0]) {
    formData.append("abstract-upload", abstractFileInput.files[0]);
  }

  paymentMessage.classList.remove("hidden", "text-red-600", "text-green-600");
  paymentMessage.innerText = "Processing payment and registration...";
  paymentMessage.classList.add("text-gray-600"); // Indicate processing

  try {
    const response = await fetch("http://localhost:5500/submit-registration", {
      // Vercel will proxy this to your backend function
      // Target your Node.js backend
      method: "POST",
      body: formData, // Send FormData directly for multipart/form-data
    });

    const result = await response.json();

    if (response.ok) {
      paymentMessage.classList.remove("text-gray-600");
      paymentMessage.classList.add("text-green-600");
      paymentMessage.innerText = result.message; // "Registration successful! Confirmation email sent."
      form.reset(); // Clear the registration form
      setTimeout(() => {
        closeModal("paymentModal");
        paymentMessage.classList.add("hidden");
      }, 3000);
    } else {
      paymentMessage.classList.remove("text-gray-600");
      paymentMessage.classList.add("text-red-600");
      paymentMessage.innerText =
        result.error || "An error occurred during registration.";
    }
  } catch (error) {
    console.error("Network or server error:", error);
    paymentMessage.classList.remove("text-gray-600");
    paymentMessage.classList.add("text-red-600");
    paymentMessage.innerText =
      "Could not connect to the server. Please try again.";
  }
}
