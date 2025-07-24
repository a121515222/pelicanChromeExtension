function isFormPage() {
  // 檢查頁面是否包含表單元素（例如 #input-51）
  return document.querySelector('#input-51') !== null;
}

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

// 監聽來自 popup.js 的儲存請求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'saveDeliveryData') {
    try {
      const currentData = JSON.parse(localStorage.getItem('deliveryData') || '{}');
      const updatedData = {
        sender: message.sender,
        recipients: currentData.recipients ? [...currentData.recipients, message.recipient] : [message.recipient]
      };
      localStorage.setItem('deliveryData', JSON.stringify(updatedData));
      console.log('資料已儲存到 localStorage', updatedData);
      sendResponse({ status: 'success' });
    } catch (e) {
      console.error('儲存到 localStorage 失敗', e);
      sendResponse({ status: 'error', message: e.message });
    }
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'saveRecipient') {
    const data = msg.payload;
    try {
      const old = JSON.parse(localStorage.getItem('recipients') || '[]');
      old.push(data);
      localStorage.setItem('recipients', JSON.stringify(old));
      sendResponse({ status: 'ok' });
    } catch (e) {
      sendResponse({ status: 'error', message: e.message });
    }
  }

  if (msg.type === 'getRecipients') {
    try {
      const data = JSON.parse(localStorage.getItem('recipients') || '[]');
      sendResponse({ status: 'ok', data });
    } catch (e) {
      sendResponse({ status: 'error', data: [] });
    }
  }

  return true; // for async sendResponse
});