/*
 * “在活跃的 Safari 浏览器标签页上运行 JavaScript”动作脚本。
 *
 * 使用前，在快捷指令中分别对 Password 和 Salt 执行“Base64 编码”，
 * 然后把下面两个占位文本替换成对应的魔法变量：
 *   __BASE64_PASSWORD__
 *   __BASE64_SALT__
 */

const bridge = document.getElementById("shortcut-bridge");

if (!bridge) {
  completion("ERROR:当前页面不是 XMU Rollcall Helper");
} else {
  const passwordInput = document.getElementById("shortcut-password");
  const saltInput = document.getElementById("shortcut-salt");
  const encryptButton = document.getElementById("shortcut-encrypt");
  const output = document.getElementById("shortcut-output");

  const observer = new MutationObserver(() => {
    if (bridge.dataset.state === "success" || bridge.dataset.state === "error") {
      observer.disconnect();
      completion(output.value || output.textContent);
    }
  });

  observer.observe(bridge, {
    attributes: true,
    attributeFilter: ["data-state"],
  });

  bridge.dataset.encoding = "base64";
  passwordInput.value = "__BASE64_PASSWORD__";
  saltInput.value = "__BASE64_SALT__";
  encryptButton.click();
}
