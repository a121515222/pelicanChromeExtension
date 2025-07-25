function isFormPage() {
  // 檢查頁面是否包含表單元素（例如 #input-51）
  return document.querySelector('#input-51') !== null;
}
console.log("載入content.js")
function fillForm() {
  // 從 localStorage 讀取資料
  let data = { sender: {}, recipients: [] };
  try {
    const json = localStorage.getItem('deliveryData');
    if (json) {
      data = JSON.parse(json);
    }
  } catch (e) {
    console.error('解析 localStorage 資料失敗', e);
  }

  // 確保資料結構正確
  data.sender = data.sender || {};
  data.recipients = data.recipients || [];
  const latestRecipient = data.recipients.length > 0 ? data.recipients[data.recipients.length - 1] : {};

  try {
    // ===== 📨 寄件人 =====
    const senderNameInput = document.querySelector('#input-51');
    if (senderNameInput) senderNameInput.value = data.sender.senderName || '';

    const senderMobileInput = document.querySelector('#input-54');
    if (senderMobileInput) senderMobileInput.value = data.sender.senderMobile || '';

    const senderPhoneInput = document.querySelector('#input-57');
    if (senderPhoneInput) senderPhoneInput.value = data.sender.senderPhone || '';

    const senderAddressInput = document.querySelector('#input-62');
    if (senderAddressInput) senderAddressInput.value = data.sender.senderAddress || '';

    const selects = document.querySelectorAll('select');
    if (selects.length >= 4) {
      if (data.sender.senderCounty) {
        selects[0].value = data.sender.senderCounty;
        selects[0].dispatchEvent(new Event('change'));
      }

      if (data.sender.senderDistrict) {
        selects[1].value = data.sender.senderDistrict;
        selects[1].dispatchEvent(new Event('change'));
      }

      // ===== 📦 收件人 =====
      if (latestRecipient.receiverCounty) {
        selects[2].value = latestRecipient.receiverCounty;
        selects[2].dispatchEvent(new Event('change'));
      }

      if (latestRecipient.receiverDistrict) {
        selects[3].value = latestRecipient.receiverDistrict;
        selects[3].dispatchEvent(new Event('change'));
      }
    }

    const receiverNameInput = document.querySelector('#input-67');
    if (receiverNameInput) receiverNameInput.value = latestRecipient.receiverName || '';

    const receiverMobileInput = document.querySelector('#input-70');
    if (receiverMobileInput) receiverMobileInput.value = latestRecipient.receiverMobile || '';

    const receiverPhoneInput = document.querySelector('#input-73');
    if (receiverPhoneInput) receiverPhoneInput.value = latestRecipient.receiverPhone || '';

    const receiverAddressInput = document.querySelector('#input-78');
    if (receiverAddressInput) receiverAddressInput.value = latestRecipient.receiverAddress || '';
  } catch (e) {
    console.error('填寫表單失敗', e);
  }
}

// 檢查頁面是否是表單頁面，並延遲執行以確保動態元素載入
function tryFillForm(maxAttempts = 5, interval = 1000) {
  let attempts = 0;
  const intervalId = setInterval(() => {
    if (isFormPage()) {
      clearInterval(intervalId);
      console.log('找到表單頁面，開始填入資料');
      fillForm();
    } else if (attempts >= maxAttempts) {
      clearInterval(intervalId);
      console.log('未找到表單元素，停止嘗試');
    }
    attempts++;
  }, interval);
}

// 在頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
  console.log('content.js 已載入');
  tryFillForm();
});

// 監聽來自 popup.js 的儲存請求;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'saveReceiver') {
    try {
      const data = request.payload;
      console.log("content data", data)
      if (!data || typeof data.name !== 'string') {
        console.error('無效的收件人資料:', data);
        sendResponse({ success: false, error: 'Invalid receiver data' });
        return true;
      }

      let receivers = JSON.parse(localStorage.getItem('receivers') || '[]');

      const index = receivers.findIndex((r) => r.name === data.name);
      if (index >= 0) {
        receivers[index] = data;
      } else {
        receivers.push(data);
      }

      localStorage.setItem('receivers', JSON.stringify(receivers));
      sendResponse({ success: true });
    } catch (e) {
      console.error("處理 saveReceiver 錯誤", e);
      sendResponse({ success: false, error: String(e) });
    }
    return true; // <== 重要，否則 popup 端會以為沒有回應而報錯
  }
  if (request.type === "getReceivers") {
    const receivers = JSON.parse(localStorage.getItem("receivers") || "[]");
    sendResponse({ receivers });
  }
});

