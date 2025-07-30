console.log("載入content.js")
function isFormPage() {
  // 檢查頁面是否包含表單元素（例如 #input-51）
  return document.querySelector('#input-51') !== null;
}

// 在頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
  console.log('content.js 已載入');
  // tryFillForm();
});

// 監聽來自 popup.js 的儲存請求;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 儲存收件人資料

  if (request.type === 'saveReceiver') {
    try {
      const receivers = request.payload;
      
      localStorage.setItem('receivers', JSON.stringify(receivers));
      sendResponse({ success: true });
    } catch (e) {
      console.error("處理 saveReceiver 錯誤", e);
      sendResponse({ success: false, error: String(e) });
    }
    return true; // <== 重要，否則 popup 端會以為沒有回應而報錯
  }
  // 儲存 寄件者資料
  
  if (request.type === "saveSender") {
  try {
    const senders = request.payload;
      console.log("senders", senders)
      localStorage.setItem("senders", JSON.stringify(senders));
      sendResponse({ success: true });
    } catch (e) {
      console.error("儲存寄件人失敗", e);
      sendResponse({ success: false, error: String(e) });
    }
    return true;
  }
  // 儲存貨物
  if (request.type === "saveCargo") {
  try {
    const cargos = request.payload;
      localStorage.setItem("cargos", JSON.stringify(cargos));
      sendResponse({ success: true });
    } catch (e) {
      console.error("儲存貨物失敗", e);
      sendResponse({ success: false, error: String(e) });
    }
    return true;
  }

  // 儲存修改後的收件人資料
  if (request.type === 'saveModifyReceiver') {
    try {
      const receivers = request.payload;
      localStorage.setItem('receivers', JSON.stringify(receivers));
      sendResponse({ success: true });
    } catch (e) {
      console.error("處理 saveReceiver 錯誤", e);
      sendResponse({ success: false, error: String(e) });
    }
    return true; // <== 重要，否則 popup 端會以為沒有回應而報錯
  }
  // 儲存修改後的收寄人資料
  if (request.type === 'saveModifySender') {
    try {
      const senders = request.payload;
      localStorage.setItem('senders', JSON.stringify(senders));
      sendResponse({ success: true });
    } catch (e) {
      console.error("處理 saveSender 錯誤", e);
      sendResponse({ success: false, error: String(e) });
    }
    return true; // <== 重要，否則 popup 端會以為沒有回應而報錯
  }
  // 儲存修改後的貨物資料
  if (request.type === 'saveModifyCargo') {
    try {
      const cargos = request.payload;
      localStorage.setItem('cargos', JSON.stringify(cargos));
      sendResponse({ success: true });
    } catch (e) {
      console.error("處理 saveCargo 錯誤", e);
      sendResponse({ success: false, error: String(e) });
    }
    return true; // <== 重要，否則 popup 端會以為沒有回應而報錯
  }
  // 取得收件人資料
  if (request.type === "getReceivers") {
    const receivers = JSON.parse(localStorage.getItem("receivers") || "[]");
    sendResponse({ success: true, receivers });
    return true
  }
  // 取得收寄人資料
  if (request.type === "getSenders") {
    const senders = JSON.parse(localStorage.getItem("senders") || "[]");
    sendResponse({ success: true, senders });
    return true
  }
  // 取得貨物資料
  if (request.type === "getCargos") {
    const cargos = JSON.parse(localStorage.getItem("cargos") || "[]");
    sendResponse({ success: true, cargos });
    return true
  }
  // 填入收件人資料到網頁中
  if (request.type === "fillReceiver") {
  try {
    const data = request.payload;

    const inputs = document.querySelectorAll("input");
    if (inputs.length >= 9) {
      // 收件人姓名 (第6個input)
      inputs[5].value = data.name || "";
      inputs[5].dispatchEvent(new Event("input"));

      // 手機 (第7個input)
      inputs[6].value = data.mobile || "";
      inputs[6].dispatchEvent(new Event("input"));

      // 市話 (第8個input)
      inputs[7].value = data.phone || "";
      inputs[7].dispatchEvent(new Event("input"));

      // 詳細地址 (第9個input)
      inputs[8].value = data.address || "";
      inputs[8].dispatchEvent(new Event("input"));
    } else {
      console.warn("input 數量不足，無法填入收件人欄位");
    }

    // 處理 select 縣市與區域（由第三與第四個 select 控制）
    const selects = document.querySelectorAll("select");
    if (selects.length >= 4) {
      if (data.county) {
        selects[2].value = data.county;
        selects[2].dispatchEvent(new Event("change")); // 可能會觸發區域更新
        // 等待區域選單更新後再填 district
      if (data.district) {
        setTimeout(() => {
          selects[3].value = data.district;
          selects[3].dispatchEvent(new Event("change"));
        } , 300); // 視網站的 JS 更新速度調整
    }
      }
    }
    sendResponse({ success: true });
  } catch (e) {
    console.error("填入收件人資料失敗", e);
    sendResponse({ success: false, error: String(e) });
     return true
  }
}

// 填入寄件人資料到網頁中
  if (request.type === "fillSender") {
  try {
    const data = request.payload;

    const inputs = document.querySelectorAll("input");
    if (inputs.length >= 9) {
      // 寄件人姓名 (第2個input)
      inputs[1].value = data.name || "";
      inputs[1].dispatchEvent(new Event("input"));

      // 寄件人手機 (第3個input)
      inputs[2].value = data.mobile || "";
      inputs[2].dispatchEvent(new Event("input"));

      // 寄件人市話 (第4個input)
      inputs[3].value = data.phone || "";
      inputs[3].dispatchEvent(new Event("input"));

      // 寄件人詳細地址 (第5個input)
      inputs[4].value = data.address || "";
      inputs[4].dispatchEvent(new Event("input"));
    } else {
      console.warn("input 數量不足，無法填入收件人欄位");
    }

    // 處理 select 縣市與區域（由第一與第二個 select 控制）
    const selects = document.querySelectorAll("select");
    if (selects.length >= 4) {
      if (data.county) {
    selects[0].value = data.county;
    selects[0].dispatchEvent(new Event("change"));

    if (data.district) {
      setTimeout(() => {
        selects[1].value = data.district;
        selects[1].dispatchEvent(new Event("change"));
      }, 300); // 延遲時間視網站 JS 的更新速度調整
  }
}
    }

      sendResponse({ success: true });
       return true
   }   catch (e) {
      console.error("填入寄件人資料失敗", e);
      sendResponse({ success: false, error: String(e) });
       return true
    }
  }
// 填入貨物資料到網頁中
  if (request.type === 'fillCargo') {
    try {
      const data = request.payload;
      const inputs = document.querySelectorAll("input");
      const selects = document.querySelectorAll("select");
      const radios = document.querySelectorAll('input[type="radio"]');
      // 計算有多少radio 只有一個的就是常溫單，兩個就是低溫單
      const radioCount = radios.length;
      // 
      if (radioCount === 1) {
        inputs[12].value = data.name;
        inputs[12].dispatchEvent(new Event("input"));
        inputs[13].value = data.price;
        inputs[13].dispatchEvent(new Event("input"));
        if (data.deliverTemperature === "常溫" && radios.length > 0) {
          radios[0].checked = true;
          radios[0].dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          alert(`所選貨物是${data.deliverTemperature}`)
        }
      } else if (radioCount === 2) {
        inputs[13].value = data.name;
        inputs[13].dispatchEvent(new Event("input"));
        inputs[14].value = data.price;
        inputs[14].dispatchEvent(new Event("input"));
        if (data.deliverTemperature === "冷凍" && radios.length > 0) {
          radios[0].checked = true;
          radios[0].dispatchEvent(new Event("change", { bubbles: true }));
        } else if (data.deliverTemperature === "冷藏" && radios.length > 0 ) {
          radios[1].checked = true;
          radios[1].dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          alert(`所選貨物是${data.deliverTemperature}`)
        }
      }
      selects[4].value = data.deliverTime;
      selects[4].dispatchEvent(new Event("change"));
      sendResponse({ success: true });
       return true
    } catch (e) {
      console.error("填入貨物資料失敗", e);
      sendResponse({ success: false, error: String(e) });
       return true
    }
  }
  // 匯入與匯出資料
  if (request.type === 'EXPORT_DATA') {
    const keys = ['senders', 'receivers', 'cargos'];
    const data = {};
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) data[key] = JSON.parse(value);
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.text';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (request.type === 'IMPORT_DATA') {
    try {
      const json = JSON.parse(request.payload);

      const validKeys = ['senders', 'receivers', 'cargos'];
      for (const key of validKeys) {
        if (key in json) {
          localStorage.setItem(key, JSON.stringify(json[key]));
        }
      }

      console.log('匯入成功');
      alert('匯入成功');
    } catch (e) {
      console.error('匯入失敗:', e);
      alert('檔案內容不是合法 JSON');
    }
  }
});

