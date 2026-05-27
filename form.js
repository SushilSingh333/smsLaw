/* ==================================================
   SMS Law College — CRM Lead Submission
   Wires heroForm + modalForm to apiv2.aajneetiadvertising.com
================================================== */

let isFormSubmitted = false;
let isFormDirty = false;

// Course → CRM Center ID
// NOTE: confirm this ID with the CRM admin for "BA LLB" lead routing.
const courseToCenterId = {
  "BA LLB": 1
};

const PROJECT_NAME = "SMS Law College Varanasi - BA LLB Admissions 2026-27";
const API_URL = "https://apiv2.aajneetiadvertising.com/lead/save";

function handleFormSubmit(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("input", function () {
    const hasValue = Array.from(form.elements).some(
      (el) =>
        el.tagName !== "BUTTON" &&
        el.type !== "hidden" &&
        el.value &&
        el.value.trim() !== ""
    );
    isFormDirty = hasValue;
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    Swal.fire({
      title: "Submitting...",
      text: "Please wait while we process your enquiry.",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const name = form.querySelector('[name="fullname"]')?.value.trim() || "";
    const phone = form.querySelector('[name="mobile"]')?.value.trim() || "";
    const email = form.querySelector('[name="email"]')?.value.trim() || "";
    const state = form.querySelector('[name="state"]')?.value.trim() || "";
    const city = form.querySelector('[name="city"]')?.value.trim() || "";
    const selectedCourse = form.querySelector('[name="course"]')?.value.trim() || "";

    const centerId = courseToCenterId[selectedCourse];

    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!phone) missingFields.push("Mobile");
    if (!email) missingFields.push("Email");
    if (!state) missingFields.push("State");
    if (!city) missingFields.push("City");
    if (!selectedCourse) missingFields.push("Course");

    if (missingFields.length > 0) {
      Swal.close();
      Swal.fire({
        title: "Missing Fields",
        text: `Please fill: ${missingFields.join(", ")}`,
        icon: "warning",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      Swal.close();
      Swal.fire({
        title: "Invalid Mobile Number",
        text: "Enter a valid 10-digit Indian mobile number.",
        icon: "error",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.close();
      Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        icon: "error",
      });
      return;
    }

    if (!centerId) {
      Swal.close();
      Swal.fire({
        title: "Invalid Course",
        text: "Please select a valid course.",
        icon: "error",
      });
      return;
    }

    const payload = {
      page_url: window.location.href,
      project_name: PROJECT_NAME,
      form_name: name,
      form_mobile: phone,
      form_email: email,
      form_state: state,
      form_city: city,
      form_center: centerId,
      form_course_name: selectedCourse,
      doc_url: document.URL,
      doc_ref: document.referrer,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      isFormSubmitted = true;
      await response.json().catch(() => ({}));

      window.location.href = "thankyou.html";
    } catch (error) {
      console.error("Lead submission failed:", error);
      Swal.fire({
        title: "Submission Failed",
        text: "Something went wrong. Please try again or call our helpline.",
        icon: "error",
      });
    }
  });
}

window.addEventListener("beforeunload", function (e) {
  if (isFormDirty && !isFormSubmitted) {
    e.preventDefault();
    e.returnValue = "";
  }
});

handleFormSubmit("heroForm");
handleFormSubmit("modalForm");
