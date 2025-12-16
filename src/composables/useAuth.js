import { ref } from "vue";

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const token = ref(localStorage.getItem(TOKEN_KEY));

  const getToken = () => {
    return token.value || localStorage.getItem(TOKEN_KEY);
  };

  const setToken = (t) => {
    token.value = t;
    localStorage.setItem(TOKEN_KEY, t);
  };

  const removeToken = () => {
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
  };

  return { token, getToken, setToken, removeToken };
}
