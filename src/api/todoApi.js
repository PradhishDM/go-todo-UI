const BASE_URL =
  process.env.REACT_APP_API_URL || "https://go-todo-55uh.onrender.com";

// GET ALL TODOS
export const getTodos = async (token) => {
  const response = await fetch(`${BASE_URL}/todo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ SPACE MATTERS
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch todos");
  }

  const data = await response.json();

  return data;
};

// CREATE TODO
export const createTodo = async (token, title) => {
  const response = await fetch(`${BASE_URL}/todo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create TODO");
  }

  const data = await response.json();
  console.log("CREATED-TODO", data);

  return data;
};

// UPDATE TODO

export const updateTodo = async (token, id, title) => {
  const response = await fetch(`${BASE_URL}/todo`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, title }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update TODO");
  }

  const data = await response.json();
  console.log("UPDATED-TODO", data);

  return data;
};

// DELETE TODO
export const deleteTodo = async (token, id) => {
  const response = await fetch(`${BASE_URL}/todo?id=${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete TODO");
  }

  return { id };
};
