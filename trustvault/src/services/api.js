
let csrfToken = null;

async function getCsrfToken() {
  const response = await fetch('/api/csrf-token', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to get CSRF token');
  }

  const data = await response.json();
  csrfToken = data.csrf_token;

  return csrfToken;
}

export async function apiLogin(email, password) {
  if (!csrfToken) {
    await getCsrfToken();
  }

  const response = await fetch('/api/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function apiSignup({
  name,
  email,
  password,
  role,
  company,
}) {
  if (!csrfToken) {
    await getCsrfToken();
  }

  const response = await fetch('/api/signup', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
      company,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data;
}

export async function apiMe() {
  const response = await fetch('/api/me', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to check login session');
  }

  return response.json();
}

export async function apiLogout() {
  if (!csrfToken) {
    await getCsrfToken();
  }

  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrfToken,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Logout failed');
  }

  return data;
}
