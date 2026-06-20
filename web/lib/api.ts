const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
};

export const registerUser = (name: string, email: string, password: string) =>
  apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

export const loginUser = (email: string, password: string) =>
  apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const logoutUser = () =>
  apiCall('/api/auth/logout', { method: 'POST' });

export const getUserProfile = () =>
  apiCall('/api/users/me', { method: 'GET' });

export const processBgRemoval = (file: File, token: string) => {
  const formData = new FormData();
  formData.append('image', file);

  return fetch(`${API_URL}/api/images/process`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Processing failed');
    }
    return res.json();
  });
};

export const getImageHistory = () =>
  apiCall('/api/images/history', { method: 'GET' });
