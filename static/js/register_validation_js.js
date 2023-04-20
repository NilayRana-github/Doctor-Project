 <script>
  // Get form and error message elements
  const form = document.getElementById('registration-form');
  const errorMessages = document.getElementById('error-messages');

  // Add event listener to form submission
  form.addEventListener('submit', function(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form field values
    const name = document.getElementById('patient_name').value.trim();
    const password = document.getElementById('patient_password').value.trim();
    const email = document.getElementById('patient_email').value.trim();
    const disease = document.getElementById('patient_disease').value.trim();
    const city = document.getElementById('patient_city').value.trim();

    // Check if any field is empty
    if (!name || !password || !email || !disease || !city) {
      // Show error message
      errorMessages.innerHTML = 'All fields are required.';
      errorMessages.classList.remove('d-none');
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Show error message
      errorMessages.innerHTML = 'Please enter a valid email address.';
      errorMessages.classList.remove('d-none');
      return;
    }

    // Submit form
    form.submit();
  });
</script>
