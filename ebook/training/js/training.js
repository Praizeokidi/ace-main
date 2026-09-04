(() => {
  const form = document.querySelector("#dpia-training-form");
  if (!form) return;

  const status = form.querySelector("[data-training-status]");
  const submitButton = form.querySelector(".training-submit");
  const submitLabel = submitButton?.querySelector("[data-submit-label]");
  const locationFields = form.querySelector("[data-location-fields]");
  const success = document.querySelector("[data-training-success]");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checked = (name) =>
    form.querySelectorAll(`[name="${name}"]:checked`).length;
  const requiredFields = () => [
    ...form.querySelectorAll(
      '[required]:not([type="radio"]):not([type="checkbox"])',
    ),
  ];

  const updateLocation = () => {
    const delivery = form.querySelector(
      'input[name="delivery_format"]:checked',
    )?.value;
    if (locationFields)
      locationFields.hidden = !["In-Person", "Hybrid"].includes(delivery);
  };

  const updateSubmitState = () => {
    const fieldsReady = requiredFields().every((field) => field.value.trim());
    const trainingReady = checked("training_types[]") > 0;
    const audienceReady = checked("audience[]") > 0;
    const participantsReady = Boolean(
      form.querySelector('input[name="participants"]:checked'),
    );
    const deliveryReady = Boolean(
      form.querySelector('input[name="delivery_format"]:checked'),
    );
    const flexibilityReady = Boolean(
      form.querySelector('input[name="date_flexible"]:checked'),
    );
    const privacyReady = Boolean(
      form.querySelector("#training-privacy-consent")?.checked,
    );
    if (submitButton)
      submitButton.disabled = !(
        fieldsReady &&
        trainingReady &&
        audienceReady &&
        participantsReady &&
        deliveryReady &&
        flexibilityReady &&
        privacyReady
      );
  };

  const showError = (message) => {
    status.textContent = message;
    status.className = "form-status is-error";
  };

  const validate = () => {
    let valid = true;
    const firstInvalid = [];
    requiredFields().forEach((field) => {
      const message = !field.value.trim()
        ? "This field is required."
        : field.type === "email" && !emailPattern.test(field.value.trim())
          ? "Enter a valid business email address."
          : "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (message) {
        valid = false;
        firstInvalid.push(field);
      }
    });
    if (!checked("training_types[]")) {
      showError("Select at least one training type.");
      valid = false;
    } else if (!checked("audience[]")) {
      showError("Select at least one participant group.");
      valid = false;
    } else if (!form.querySelector('input[name="participants"]:checked')) {
      showError("Select an approximate number of participants.");
      valid = false;
    } else if (!form.querySelector('input[name="delivery_format"]:checked')) {
      showError("Select a preferred delivery format.");
      valid = false;
    } else if (!form.querySelector('input[name="date_flexible"]:checked')) {
      showError("Tell us whether the date is flexible.");
      valid = false;
    } else if (!form.querySelector("#training-privacy-consent").checked) {
      showError("Please accept the privacy consent before submitting.");
      valid = false;
    } else status.textContent = "";
    firstInvalid[0]?.focus();
    return valid;
  };

  form.querySelectorAll('input[name="delivery_format"]').forEach((input) =>
    input.addEventListener("change", () => {
      updateLocation();
      updateSubmitState();
    }),
  );
  form
    .querySelectorAll("input, select, textarea")
    .forEach((field) =>
      field.addEventListener(
        field.type === "radio" || field.type === "checkbox"
          ? "change"
          : "input",
        updateSubmitState,
      ),
    );
  updateLocation();
  updateSubmitState();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";
    if (!validate()) return;

    submitButton.disabled = true;
    submitLabel.textContent = "Sending request…";

    try {
      const response = await fetch("/api/dpia-training", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok)
        throw new Error(
          result.error || "The training request could not be sent.",
        );
      form.hidden = true;
      success.hidden = false;
      success.querySelector("[data-training-reference]").textContent =
        result.reference || `ACE-TRAINING-${Date.now().toString().slice(-6)}`;
      success.focus();
    } catch (error) {
      console.error(error);
      showError("We could not send your request. Please try again.");
      submitButton.disabled = false;
      submitLabel.textContent = "Request DPIA Training";
    }
  });
})();

// Reveal the real page after the initial ebook-style skeleton pass.
document.addEventListener("DOMContentLoaded", () => {
  const skeleton = document.querySelector("#training-skeleton");
  const content = document.querySelector("#training-content");
  if (!skeleton || !content) return;

  const reveal = () => {
    skeleton.hidden = true;
    content.classList.add("is-ready");
  };

  window.setTimeout(reveal, 700);
});

document.addEventListener("DOMContentLoaded", () => {
  const skeleton = document.querySelector("#training-skeleton");
  const content = document.querySelector("#training-content");

  if (!skeleton || !content) return;

  // Keep the skeleton visible briefly while the page initializes.
  window.setTimeout(() => {
    skeleton.hidden = true;
    content.hidden = false;
    content.classList.add("is-ready");
  }, 700);
});
