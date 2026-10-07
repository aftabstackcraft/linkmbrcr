const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const closeNavigation = () => {
  header.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
};

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");

    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    closeNavigation();

    target.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });

    window.history.pushState(null, "", targetId);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("is-open")) {
    closeNavigation();
    navToggle.focus();
  }
});

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion.matches) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const clearFieldError = (field) => {
  const error = document.getElementById(`${field.id}-error`);

  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");

  if (error) {
    error.textContent = "";
  }
};

const showRoleError = (message) => {
  const roleField = contactForm.querySelector(".role-field");
  const roleError = document.getElementById("role-error");

  roleField.classList.add("is-invalid");

  if (roleError) {
    roleError.textContent = message;
  }
};

const clearRoleError = () => {
  const roleField = contactForm?.querySelector(".role-field");
  const roleError = document.getElementById("role-error");

  roleField?.classList.remove("is-invalid");

  if (roleError) {
    roleError.textContent = "";
  }
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateForm = () => {
  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const selectedRole = contactForm.querySelector('input[name="role"]:checked');
  let isValid = true;

  [name, email].forEach(clearFieldError);
  clearRoleError();

  if (!name.value.trim()) {
    showFieldError(name, "Please enter your name.");
    isValid = false;
  }

  if (!email.value.trim()) {
    showFieldError(email, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email.value.trim())) {
    showFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!selectedRole) {
    showRoleError("Please choose whether you are a brand or creator.");
    isValid = false;
  }

  return isValid;
};

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.classList.remove("is-error");
    formStatus.textContent = "";

    if (!validateForm()) {
      formStatus.classList.add("is-error");
      formStatus.textContent = "Please fix the highlighted fields before sending.";

      const firstInvalid = contactForm.querySelector(".is-invalid input, .is-invalid, [aria-invalid='true']");

      firstInvalid?.focus();
      return;
    }

    formStatus.textContent =
      "Thanks. Your inquiry looks complete. This frontend form is ready to connect to your preferred inbox or form service.";
    contactForm.reset();
  });

  contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);

      if (field.name === "role") {
        clearRoleError();
      }
    });

    field.addEventListener("blur", () => {
      if (field.required && field.type !== "radio" && !field.value.trim()) {
        showFieldError(field, "This field is required.");
      }
    });
  });
}
