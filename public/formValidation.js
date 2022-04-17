const form = document.querySelector('form');
const userNameError = document.querySelector('.username.error');
const passwordError = document.querySelector('.password.error');
let formErrors = false;


form.addEventListener('submit', (e) => {
  userNameError.textContent = '';
  passwordError.textContent = '';

  const username = form.username.value;
  const password = form.password.value;

  if (!username.length) {
    formErrors = true;
    userNameError.textContent = 'Please enter a Username';
  }
  if (!password.length) {
    formErrors = true;
    passwordError.textContent = 'Please enter a Password';
  } else if (password.length < 6) {
    passwordError.textContent = 'Minimum password length is 6 characters';
  }

  if (formErrors) {
    e.preventDefault();
  }
})

