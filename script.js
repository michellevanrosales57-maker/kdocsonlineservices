/* =========================================================
   KDocs Online Services
   Front-End JavaScript
   ========================================================= */


/* =========================================================
   GOOGLE APPS SCRIPT WEB APP
   ========================================================= */

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyc1eyMhxs43uWLG0xYOahhZXrsPatL8h3pT2bjn5uIztTgjIVBBylvk0FEdz2x0XAbjw/exec";


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", function () {

    mainNav.classList.toggle("active");

  });


  document.querySelectorAll("#mainNav a").forEach(function (link) {

    link.addEventListener("click", function () {

      mainNav.classList.remove("active");

    });

  });

}


/* =========================================================
   ELEMENTS
   ========================================================= */

const form = document.getElementById("applicationForm");

const otherServiceBox =
  document.getElementById("other-service-box");

const otherServiceDetails =
  document.getElementById("other_service_details");


const psaUploadBox =
  document.getElementById("psa-upload-box");

const psaDocument =
  document.getElementById("psa_document");

const psaStatus =
  document.getElementById("psa-status");


const pmrfUploadBox =
  document.getElementById("pmrf-upload-box");

const pmrfForm =
  document.getElementById("pmrf_form");

const pmrfStatus =
  document.getElementById("pmrf-status");


const submitButton =
  document.getElementById("submitButton");

const formMessage =
  document.getElementById("formMessage");


/* =========================================================
   SERVICE CHECKBOXES
   ========================================================= */

const serviceCheckboxes =
  document.querySelectorAll(
    'input[name="services"]'
  );


/* =========================================================
   UPDATE REQUIRED DOCUMENTS
   ========================================================= */

function updateRequiredDocuments() {

  const selectedServices = Array.from(
    serviceCheckboxes
  )
  .filter(function (checkbox) {
    return checkbox.checked;
  })
  .map(function (checkbox) {
    return checkbox.value;
  });


  const psaSelected =
    selectedServices.includes("PSA Documents");


  const philHealthSelected =
    selectedServices.includes("PhilHealth Assistance");


  const otherSelected =
    selectedServices.includes("Other Online Services");


  /* ================= PSA ================= */

  if (psaSelected) {

    psaDocument.required = true;

    psaUploadBox.classList.add("required");

    psaStatus.textContent =
      "PSA Documents selected — PSA document upload is REQUIRED.";

  } else {

    psaDocument.required = false;

    psaUploadBox.classList.remove("required");

    psaStatus.textContent =
      'Select "PSA Documents" above to make this required.';

  }


  /* ================= PHILHEALTH PMRF ================= */

  if (philHealthSelected) {

    pmrfForm.required = true;

    pmrfUploadBox.classList.add("required");

    pmrfStatus.textContent =
      "PhilHealth Assistance selected — PMRF form upload is REQUIRED.";

  } else {

    pmrfForm.required = false;

    pmrfUploadBox.classList.remove("required");

    pmrfStatus.textContent =
      'Select "PhilHealth Assistance" above to make this required.';

  }


  /* ================= OTHER ================= */

  if (otherSelected) {

    otherServiceBox.classList.remove("hidden");

    otherServiceDetails.required = true;

  } else {

    otherServiceBox.classList.add("hidden");

    otherServiceDetails.required = false;

    otherServiceDetails.value = "";

  }

}


/* =========================================================
   SERVICE CHANGE LISTENER
   ========================================================= */

serviceCheckboxes.forEach(function (checkbox) {

  checkbox.addEventListener(
    "change",
    updateRequiredDocuments
  );

});


/* Run once when page loads */

updateRequiredDocuments();


/* =========================================================
   FILE SIZE LIMIT
   ========================================================= */

const MAX_FILE_SIZE =
  10 * 1024 * 1024;


/* =========================================================
   CHECK FILE
   ========================================================= */

function validateFile(file, fieldName) {

  if (!file) {
    return true;
  }

  if (file.size > MAX_FILE_SIZE) {

    throw new Error(
      fieldName +
      " is larger than 10 MB. Please choose a smaller file."
    );

  }

  return true;
}


/* =========================================================
   FILE TO BASE64
   ========================================================= */

function fileToBase64(file) {

  return new Promise(function (resolve, reject) {

    if (!file) {

      resolve(null);

      return;
    }


    const reader =
      new FileReader();


    reader.onload = function () {

      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result.split(",")[1]
      });

    };


    reader.onerror = function () {

      reject(
        new Error(
          "Unable to read the file."
        )
      );

    };


    reader.readAsDataURL(file);

  });

}


/* =========================================================
   GET SELECTED SERVICES
   ========================================================= */

function getSelectedServices() {

  return Array.from(
    document.querySelectorAll(
      'input[name="services"]:checked'
    )
  ).map(function (checkbox) {

    return checkbox.value;

  });

}


/* =========================================================
   FORM SUBMIT
   ========================================================= */

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    formMessage.textContent = "";
    formMessage.className = "form-message";


    /* ================= SERVICES ================= */

    const services =
      getSelectedServices();


    if (services.length === 0) {

      formMessage.textContent =
        "Please select at least one service.";

      formMessage.classList.add("error");

      return;
    }


    /* ================= OTHER SERVICE ================= */

    if (
      services.includes("Other Online Services") &&
      otherServiceDetails.value.trim() === ""
    ) {

      formMessage.textContent =
        "Please specify the other online service.";

      formMessage.classList.add("error");

      otherServiceDetails.focus();

      return;
    }


    /* ================= PSA ================= */

    if (
      services.includes("PSA Documents") &&
      !psaDocument.files.length
    ) {

      formMessage.textContent =
        "PSA Document is required because PSA Documents was selected.";

      formMessage.classList.add("error");

      psaDocument.focus();

      return;
    }


    /* ================= PMRF ================= */

    if (
      services.includes("PhilHealth Assistance") &&
      !pmrfForm.files.length
    ) {

      formMessage.textContent =
        "PhilHealth PMRF Form is required because PhilHealth Assistance was selected.";

      formMessage.classList.add("error");

      pmrfForm.focus();

      return;
    }


    /* ================= VALID ID ================= */

    if (!document.getElementById("valid_id").files.length) {

      formMessage.textContent =
        "Please upload your Valid ID.";

      formMessage.classList.add("error");

      document.getElementById("valid_id").focus();

      return;
    }


    /* ================= SELFIE ================= */

    if (!document.getElementById("selfie_id").files.length) {

      formMessage.textContent =
        "Please upload your Selfie with Valid ID.";

      formMessage.classList.add("error");

      document.getElementById("selfie_id").focus();

      return;
    }


    try {

      /* ================= FILES ================= */

      const validIdFile =
        document.getElementById("valid_id").files[0];


      const selfieFile =
        document.getElementById("selfie_id").files[0];


      const psaFile =
        psaDocument.files[0] || null;


      const pmrfFile =
        pmrfForm.files[0] || null;


      /* ================= SIZE VALIDATION ================= */

      validateFile(
        validIdFile,
        "Valid ID"
      );


      validateFile(
        selfieFile,
        "Selfie with Valid ID"
      );


      if (psaFile) {

        validateFile(
          psaFile,
          "PSA Document"
        );

      }


      if (pmrfFile) {

        validateFile(
          pmrfFile,
          "PhilHealth PMRF Form"
        );

      }


      /* ================= LOADING ================= */

      submitButton.disabled = true;

      submitButton.textContent =
        "Uploading Documents...";


      formMessage.textContent =
        "Please wait while your application and documents are being uploaded.";

      formMessage.className =
        "form-message";


      /* ================= CONVERT FILES ================= */

      const validId =
        await fileToBase64(validIdFile);


      const selfieId =
        await fileToBase64(selfieFile);


      let psaDocumentData = null;

      if (psaFile) {

        psaDocumentData =
          await fileToBase64(psaFile);

      }


      let pmrfFormData = null;

      if (pmrfFile) {

        pmrfFormData =
          await fileToBase64(pmrfFile);

      }


      /* ================= FORM DATA ================= */

      const formData =
        new FormData(form);


      /* ================= APPLICATION DATA ================= */

      const applicationData = {

        first_name:
          formData.get("first_name") || "",

        middle_name:
          formData.get("middle_name") || "",

        last_name:
          formData.get("last_name") || "",

        suffix:
          formData.get("suffix") || "",

        date_of_birth:
          formData.get("date_of_birth") || "",

        civil_status:
          formData.get("civil_status") || "",

        gender:
          formData.get("gender") || "",

        weight:
          formData.get("weight") || "",

        height:
          formData.get("height") || "",

        religion:
          formData.get("religion") || "",

        facebook_account:
          formData.get("facebook_account") || "",

        birthplace:
          formData.get("birthplace") || "",

        mother_maiden_name:
          formData.get("mother_maiden_name") || "",

        father_full_name:
          formData.get("father_full_name") || "",

        email:
          formData.get("email") || "",

        contact_number:
          formData.get("contact_number") || "",

        province:
          formData.get("province") || "",

        municipality_city:
          formData.get("municipality_city") || "",

        barangay:
          formData.get("barangay") || "",

        zip_code:
          formData.get("zip_code") || "",

        other_service_details:
          formData.get("other_service_details") || "",

        services_requested:
          services,

        valid_id:
          validId,

        selfie_id:
          selfieId,

        psa_document:
          psaDocumentData,

        pmrf_form:
          pmrfFormData

      };


      /* ================= SEND ================= */

      submitButton.textContent =
        "Submitting...";


      await fetch(
        SCRIPT_URL,
        {
          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(applicationData)
        }
      );


      /* ================= SUCCESS ================= */

      formMessage.textContent =
        "Application submitted successfully. Your documents have been sent for processing.";

      formMessage.classList.add(
        "success"
      );


      form.reset();

      updateRequiredDocuments();


      window.scrollTo({
        top:
          formMessage.getBoundingClientRect().top +
          window.scrollY -
          150,

        behavior: "smooth"
      });


    } catch (error) {

      console.error(error);

      formMessage.textContent =
        error.message ||
        "Something went wrong. Please try again.";

      formMessage.classList.add(
        "error"
      );

    } finally {

      submitButton.disabled = false;

      submitButton.textContent =
        "Submit Application";

    }

  }
);