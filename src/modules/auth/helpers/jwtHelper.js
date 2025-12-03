export function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parseando JWT:", e);
    return null;
  }
}

// NUEVA FUNCIÓN ROBUSTA
export function getUserIdFromToken(token) {
  const decoded = parseJwt(token);
  if (!decoded) return null;

  // 1. Imprimimos TODO para ver qué tiene el token (Usamos warn para que se vea amarillo)
  console.warn("🔍 Analizando Token:", decoded);

  // 2. Buscamos cualquier clave que contenga 'nameidentifier' (sin importar mayúsculas o url)
  const idKey = Object.keys(decoded).find(key => key.toLowerCase().includes('nameidentifier'));

  if (idKey) {
      console.warn("✅ Clave encontrada:", idKey, "Valor:", decoded[idKey]);
      return decoded[idKey];
  }

  // 3. Fallback a 'sub' si no hay ID largo
  if (decoded.sub) return decoded.sub;

  return null;
}