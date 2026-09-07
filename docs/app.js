(() => {
  "use strict";

  const AES_CHARS = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8", { fatal: true });

  function randomString(length) {
    let result = "";
    const cutoff = 256 - (256 % AES_CHARS.length);

    while (result.length < length) {
      const bytes = crypto.getRandomValues(new Uint8Array(length - result.length));
      for (const byte of bytes) {
        if (byte < cutoff) {
          result += AES_CHARS[byte % AES_CHARS.length];
        }
      }
    }

    return result;
  }

  function bytesToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;

    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }

    return btoa(binary);
  }

  function base64ToText(value, label) {
    try {
      const normalized = String(value).replace(/\s+/g, "");
      const binary = atob(normalized);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      return decoder.decode(bytes);
    } catch {
      throw new Error(`${label} 不是有效的 Base64 文本`);
    }
  }

  async function encryptPassword(password, salt) {
    if (typeof password !== "string" || typeof salt !== "string") {
      throw new TypeError("password 和 salt 必须是文本");
    }

    const keyBytes = encoder.encode(salt);
    if (![16, 24, 32].includes(keyBytes.byteLength)) {
      throw new Error("salt 必须是 16、24 或 32 字节");
    }

    const plaintext = encoder.encode(randomString(64) + password);
    const iv = encoder.encode(randomString(16));
    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-CBC" },
      false,
      ["encrypt"],
    );
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      key,
      plaintext,
    );

    return bytesToBase64(new Uint8Array(encrypted));
  }

  const bridge = document.getElementById("shortcut-bridge");
  const passwordInput = document.getElementById("shortcut-password");
  const saltInput = document.getElementById("shortcut-salt");
  const encryptButton = document.getElementById("shortcut-encrypt");
  const output = document.getElementById("shortcut-output");
  const readyText = document.getElementById("ready-text");

  function setBridgeResult(state, value) {
    output.value = value;
    output.textContent = value;
    bridge.dataset.state = state;
  }

  encryptButton.addEventListener("click", async () => {
    bridge.dataset.state = "working";
    output.value = "";
    output.textContent = "";

    try {
      const isBase64 = bridge.dataset.encoding === "base64";
      const password = isBase64
        ? base64ToText(passwordInput.value, "password")
        : passwordInput.value;
      const salt = isBase64
        ? base64ToText(saltInput.value, "salt")
        : saltInput.value;
      const encrypted = await encryptPassword(password, salt);
      setBridgeResult("success", encrypted);
    } catch (error) {
      const message = error instanceof Error ? error.message : "加密失败";
      setBridgeResult("error", `ERROR:${message}`);
    } finally {
      passwordInput.value = "";
      saltInput.value = "";
    }
  });

  Object.defineProperty(window, "XMURollcallHelper", {
    value: Object.freeze({ encryptPassword }),
    configurable: false,
    enumerable: true,
    writable: false,
  });

  if (window.isSecureContext && window.crypto?.subtle) {
    document.documentElement.dataset.ready = "true";
    readyText.textContent = "加密模块已就绪";
  } else {
    document.documentElement.dataset.ready = "false";
    readyText.textContent = "当前环境不支持安全加密";
  }
})();
