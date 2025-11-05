
// src/utils/auth.ts

export async function logout() {
  try {
    // 1. Call the backend logout API
    const response = await fetch('https://hacknlearn.site/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // If your logout endpoint requires an auth token, add it here
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      // Even if the API call fails, we should still attempt to clear client-side tokens
      console.error('Backend logout failed:', await response.text());
    }
  } catch (error) {
    console.error('Error during logout API call:', error);
  } finally {
    // 2. Clear client-side authentication tokens
    localStorage.removeItem('authToken'); // Example: clear a token stored in localStorage
    // You might also clear other user-related data from localStorage or sessionStorage

    // 3. Redirect the user to the login page
    window.location.href = '/'; // Redirect to home page or dashboard
  }
}
