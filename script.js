// CHECKING IF THERE IS AN ERROR
var hasError = function (field) {

  // Don't validate submits, buttons, file and reset inputs, and disabled fields
  if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

  // Checking the validity of the field
  var validity = field.validity;
  console.log(validity)
  // If valid, add bootstrap class
  if (validity.valid) {
    field.classList.add('is-valid')
    return
  }

  // If required and empty
  if (validity.valueMissing) return "Please fill out this field";

  // If not the right type
  if (validity.typeMismatch) {
    if (field.type === 'email') return 'Please enter an email address';
  }

  // If too short
  if (validity.tooShort) return 'Please lengthen this text to ' + field.getAttribute('minLength') + ' characters or more. You are currently using ' + field.value.length + ' characters.';

  // if too long
  if (validity.tooLong) return 'Please short this text to no more than ' + field.getAttribute('maxLength') + ' characters. You are currently using ' + field.value.length + ' characters.';

  // if number input isn't a number
  if (validity.badInput) return "Please enter a number";

  // if number field is over max
  if (validity.rangeOverflow) return "Please select a smaller value";

  // if number field is below min
  if (validity.rangeUnderflow) return "Please select a bigger value";

  // if pattern doesn't match
  if (validity.patternMismatch) {
    if(field.hasAttribute('title')) return field.getAttribute('title');
    return 'Please match the requested format'
  };

  // generic catch all
  return "The value in this field is invalid"

};

// SHOW THE ERROR
var showError = function(field, error) {
  // Add BS 'is-invalid' class to the field
  field.classList.add('is-invalid');

  // If the field is a radio button and part of a group, error all and get the last item in the group
  if (field.type === 'radio' && field.name) {
    var group = document.getElementsByName(field.name);
    if (group.length > 0) {
      for (var i = 0; i < group.length; i++) {
        // Only check fields in current form
        if (group[i].form !== field.form) continue;
        group[i].classList.add('is-invalid');
      }
      field = group[group.length - 1];
    }
  }

  // Get field id or name
  var id = field.id || field.name;
  if (!id) return;

  // Check if error message field already exists
  var message = field.form.querySelector('.error-message.invalid-feedback#error-for-' + id );
  // If not, create the error message and inject it into the DOM
  if (!message) {
    message = document.createElement('div');
    message.className = 'invalid-feedback error-message';
    message.id = 'error-for-' + id;
    field.parentNode.insertBefore( message, field.nextSibling );

    // if radio or checkbox
    var label;
    if (field.type === 'radio' || field.type ==='checkbox') {
      label = field.form.querySelector('label[for="' + name + '"]') || field.parentNode;
      if (label) {
        label.parentNode.insertBefore( message, label.nextSibling );
      }
    }

    // Otherwise, insert it after the field
    if (!label) {
      field.parentNode.insertBefore( message, field.nextSibling );
    }
  }

  // Add ARIA role to the field
  field.setAttribute('aria-describedby', 'error-for-' + id);

  // Update error message
  message.innerHTML = error;

  // Show error message
  message.style.display = 'block';
  message.style.visibility = 'visible';
};

// REMOVE ERROR
var removeError = function(field) {
  // remove the error class
  field.classList.remove('is-invalid')
  // Remove ARIA role from the field
  field.removeAttribute('aria-describedby');

  // Get field id or name
  var id = field.id || field.name;
  if (!id) return;

  // Check if an error message is in the DOM
  var message = field.form.querySelector('.error-message.invalid-feedback#error-for-' + id + '');
  if (!message) return;

  // If so, hide it
  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';
};


// VALIDATION HANDLER ON BLUR
document.addEventListener('blur', function (event) {

  // Validate the field
  var error = hasError(event.target);
  console.log(error)

  // Show the error
  if (error) {
    showError(event.target, error);
    return
  }

  // Otherwise, remove any existing error message
  removeError(event.target)

}, true)


// VALIDATION ON SUBMIT
document.addEventListener('submit', function(event) {
  // Get all of the form elements
  var fields =  event.target.elements;
  var error, hasErrors;
  for (var i = 0; i < fields.length; i++) {
    error = hasError(fields[i]);
    if (error) {
      showError(fields[i], error);
      if (!hasErrors) {
        hasErrors = fields[i];
      }
    }
  }

  // If there are errrors, don't submit form and focus on first element with error
  if (hasErrors) {
    event.preventDefault();
    hasErrors.focus();
  }

  //AJAX PROCESS HERE

},false);
