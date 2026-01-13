const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function checkAuth() {
  try {
    const response = await fetch(`${API}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}

async function login(email, password) {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Login failed" };
  }

  return response.json();
}

async function signup(userData) {
  const response = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Signup failed" };
  }

  const data = await response.json();
  return data;
}

async function logout() {
  const response = await fetch(`${API}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Logout failed" };
  }

  return response.json();
}

async function fetchEmails(){
    const reposponce = await fetch(`${API}/email/emails`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!reposponce.ok) {
        const error = await reposponce.json();
        return { error: error.message || "Failed to fetch emails" };
    }

    return reposponce.json();
}

async function fetchEmailSummary() {
  const response = await fetch(`${API}/email/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to fetch email summary" };
  }

  return response.json();
}

async function fetchSubscriptions() {
  const response = await fetch(`${API}/email/subscriptions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to fetch subscriptions" };
  }

  return response.json();
}

async function syncEmails() {
  const response = await fetch(`${API}/email/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to sync emails" };
  }

  return response.json();
}

async function unsubscribeFromSender(senderEmail) {
  const response = await fetch(`${API}/email/cleanup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: senderEmail }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "Failed to unsubscribe" };
  }

  return response.json();
}

export { 
    login, 
    signup, 
    logout,
    fetchEmailSummary,
    fetchSubscriptions,
    syncEmails,
    checkAuth,
    unsubscribeFromSender
};