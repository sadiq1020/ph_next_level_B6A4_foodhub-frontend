// const BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// ✅ Use empty string for production (relative URLs use proxy)
// Only use BASE_URL for local development
// ✅ Use process.env.NODE_ENV directly (available on both client and server)
const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

// GET request
const get = async (endpoint: string) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Sends cookies automatically
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

//  POST request
const post = async (endpoint: string, body: unknown) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

//  PUT request
const put = async (endpoint: string, body: unknown) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

//  PATCH request
const patch = async (endpoint: string, body: unknown) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

//  DELETE request
const del = async (endpoint: string) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Export all methods
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};
