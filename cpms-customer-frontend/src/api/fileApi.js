import { BASE_URL } from "./api";

export function normalizeUrl(url) {
  if (!url) return "";
  const u = String(url);
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${BASE_URL}${u}`;
  return `${BASE_URL}/${u}`;
}

export async function uploadChatFile(projectId, file) {
  const token = localStorage.getItem("token");

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${BASE_URL}/api/files/upload/chat/${projectId}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (data?.fileUrl) data.fileUrl = normalizeUrl(data.fileUrl);
  return data;
}

async function authFetchBlob(fileUrl) {
  const url = normalizeUrl(fileUrl);
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`File request failed ${res.status}: ${text}`);
  }

  return await res.blob();
}

function downloadBlob(blob, fileName = "file") {
  const obj = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = obj;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(obj), 2000);
}

export async function downloadWithAuth(fileUrl, fileName = "file") {
  const blob = await authFetchBlob(fileUrl);
  downloadBlob(blob, fileName);
}

export async function openInNewTabWithAuth(fileUrl) {
  const blob = await authFetchBlob(fileUrl);
  const obj = URL.createObjectURL(blob);
  window.open(obj, "_blank");
  setTimeout(() => URL.revokeObjectURL(obj), 20000);
}

export async function getBlobUrlWithAuth(fileUrl) {
  const blob = await authFetchBlob(fileUrl);
  return URL.createObjectURL(blob);
}
