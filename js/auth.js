(function () {
  const PASSWORD_KEY = 'mathTutorAdminPasswordHashV1';
  const SESSION_KEY = 'mathTutorAdminAuthenticatedV1';
  const DEFAULT_PASSWORD = '1111';

  async function hash(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,'0')).join('');
  }
  async function getPasswordHash() {
    let stored = localStorage.getItem(PASSWORD_KEY);
    if (!stored) {
      stored = await hash(DEFAULT_PASSWORD);
      localStorage.setItem(PASSWORD_KEY,stored);
    }
    return stored;
  }
  async function verify(password) { return (await hash(password)) === (await getPasswordHash()); }
  async function login(password) {
    const valid = await verify(password);
    if (valid) sessionStorage.setItem(SESSION_KEY,'yes');
    return valid;
  }
  function isAuthenticated() { return sessionStorage.getItem(SESSION_KEY) === 'yes'; }
  function logout() { sessionStorage.removeItem(SESSION_KEY); }
  async function change(currentPassword,newPassword) {
    if (!(await verify(currentPassword))) return { ok:false,message:'Текущий пароль указан неверно.' };
    if (newPassword.length < 4) return { ok:false,message:'Новый пароль должен содержать минимум 4 символа.' };
    localStorage.setItem(PASSWORD_KEY,await hash(newPassword));
    sessionStorage.setItem(SESSION_KEY,'yes');
    return { ok:true,message:'Пароль успешно изменён.' };
  }

  window.AdminAuth = { login,isAuthenticated,logout,change };
})();
