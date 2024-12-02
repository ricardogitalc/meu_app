interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  whatsappNumber?: string;
}

interface LoginDto {
  email: string;
}

interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
}

const API_URL = process.env.BACKEND_URL || "http://localhost:3003";

// Funções de Usuário
export const getUserDetails = async () => {
  const response = await fetch(`${API_URL}/user/me/details`, {
    credentials: "include",
  });
  return response.json();
};

export const updateUser = async (data: UpdateUserDto) => {
  const response = await fetch(`${API_URL}/user/me/update`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteUser = async () => {
  const response = await fetch(`${API_URL}/user/me/delete`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
};

// Funções de Admin
export const getUsers = async () => {
  const response = await fetch(`${API_URL}/user/users`, {
    credentials: "include",
  });
  return response.json();
};

export const getUserById = async (id: string) => {
  const response = await fetch(`${API_URL}/user/${id}`, {
    credentials: "include",
  });
  return response.json();
};

export const updateUserById = async (id: string, data: UpdateUserDto) => {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteUserById = async (id: string) => {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
};

// Funções de Autenticação
export const login = async (data: LoginDto) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const register = async (data: CreateUserDto) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const verifyLogin = async (loginToken: string) => {
  const response = await fetch(`${API_URL}/auth/verify-login`, {
    credentials: "include",
    headers: {
      loginToken,
    },
  });
  return response.json();
};

export const verifyRegister = async (registerToken: string) => {
  const response = await fetch(`${API_URL}/auth/verify-register`, {
    credentials: "include",
    headers: {
      registerToken,
    },
  });
  return response.json();
};

export const refreshToken = async (refreshToken: string) => {
  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    credentials: "include",
    headers: {
      refreshToken,
    },
  });
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    credentials: "include",
  });
  return response.json();
};
