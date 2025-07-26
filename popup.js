function loadCounties(countySelect) {
  countySelect.innerHTML = '<option value="">請選擇縣市</option>';
  countiesData.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    countySelect.appendChild(option);
  });
}

function loadDistricts(countyValue, districtSelect) {
  districtSelect.innerHTML = '<option value="">請選擇區域</option>';
  if (districtsData[countyValue]) {
    districtsData[countyValue].forEach(({ value, label }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      districtSelect.appendChild(option);
    });
  }
}

function loadSenderData(data) {
  document.getElementById('senderName').value = data.senderName || '';
  document.getElementById('senderMobile').value = data.senderMobile || '';
  document.getElementById('senderPhone').value = data.senderPhone || '';
  document.getElementById('senderAddress').value = data.senderAddress || '';
  const senderCountySelect = document.getElementById('senderCounty');
  const senderDistrictSelect = document.getElementById('senderDistrict');
  senderCountySelect.value = data.senderCounty || '';
  loadDistricts(senderCountySelect.value, senderDistrictSelect);
  senderDistrictSelect.value = data.senderDistrict || '';
}

function loadReceiverData(data) {
  document.getElementById('receiverName').value = data.receiverName || '';
  document.getElementById('receiverMobile').value = data.receiverMobile || '';
  document.getElementById('receiverPhone').value = data.receiverPhone || '';
  document.getElementById('receiverAddress').value = data.receiverAddress || '';
  const receiverCountySelect = document.getElementById('receiverCounty');
  const receiverDistrictSelect = document.getElementById('receiverDistrict');
  receiverCountySelect.value = data.receiverCounty || '';
  loadDistricts(receiverCountySelect.value, receiverDistrictSelect);
  receiverDistrictSelect.value = data.receiverDistrict || '';
}

function saveReceiverData() {
  const recipient = {
    name: document.getElementById('receiverName').value,
    mobile: document.getElementById('receiverMobile').value,
    phone: document.getElementById('receiverPhone').value,
    county: document.getElementById('receiverCounty').value,
    district: document.getElementById('receiverDistrict').value,
    address: document.getElementById('receiverAddress').value,
  };

}
// 取得收件人dom內資料
function getReceiverDataFromForm() {
    return {
      name: document.getElementById("receiverName").value,
      mobile: document.getElementById("receiverMobile").value,
      phone: document.getElementById("receiverPhone").value,
      county: document.getElementById("receiverCounty").value,
      district: document.getElementById("receiverDistrict").value,
      address: document.getElementById("receiverAddress").value,
    };
  }
//載入localStorage receiver資料
async function getReceivers() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'getReceivers' }, (response) => {
        resolve(response?.receivers || []);
      });
    });
  });
}
//載入localStorage receiver資料後渲染
async function getReceiversAndRender() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { type: 'getReceivers' }, (response) => {
    console.log("response",response)
    renderReceiverList(response.receivers || []);
  });
  
}
window.addEventListener('DOMContentLoaded', () => {
  console.log('popup.js 已載入');
  // 載入縣市下拉選單
  loadCounties(document.getElementById('senderCounty'));
  loadCounties(document.getElementById('receiverCounty'));

  // 綁定縣市改變事件以更新區域
  document.getElementById('senderCounty').addEventListener('change', (e) => {
    loadDistricts(e.target.value, document.getElementById('senderDistrict'));
  });
  document.getElementById('receiverCounty').addEventListener('change', (e) => {
    loadDistricts(e.target.value, document.getElementById('receiverDistrict'));
  });
// 監聽載入按鈕

document.getElementById('loadReceiver').addEventListener('click', getReceiversAndRender);



  // 匯出按鈕
  document.getElementById('exportBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'getDeliveryData' }, (response) => {
      if (!response?.sender && !response?.recipients) {
        alert('沒有資料可匯出');
        return;
      }
      const exportData = { sender: response.sender, recipients: response.recipients || [] };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'deliveryData.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  });

  // 匯入按鈕
  document.getElementById('importBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (!file) {
      alert('請先選擇一個 JSON 檔案');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.sender || !data.recipients) {
          alert('JSON 格式不正確');
          return;
        }
        chrome.runtime.sendMessage({ type: 'saveDeliveryData', sender: data.sender, recipient: data.recipients[data.recipients.length - 1] }, (response) => {
          if (response?.status === 'success') {
            alert('匯入成功');
            loadSenderData(data.sender);
            if (data.recipients.length > 0) {
              loadReceiverData(data.recipients[data.recipients.length - 1]);
            }
          } else {
            alert(`匯入失敗: ${response?.message || '未知錯誤'}`);
          }
        });
      } catch {
        alert('匯入失敗：無效的 JSON 檔案');
      }
    };
    reader.readAsText(file);
    fileInput.value = '';
  });
  // QR Code 掃描
  const video = document.getElementById('video');
  const scanQRCodeButton = document.getElementById('scanQRCode');
  if (scanQRCodeButton) {
    scanQRCodeButton.addEventListener('click', async () => {
      console.log('開始掃描 QR Code');
      video.style.display = 'block';
      let stream = null;
      try {
        // 檢查可用攝影機
        console.log('檢查可用攝影機');
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length === 0) {
          throw new Error('NotFoundError: 無可用攝影機');
        }
        console.log('可用攝影機:', videoDevices);

        // 檢查權限狀態
        const permissionState = await checkCameraPermission();
        if (permissionState === 'denied') {
          throw new Error('NotAllowedError: 攝影機權限被拒絕，請在 chrome://settings/content/camera 中啟用');
        }

        // 嘗試存取攝影機
        console.log('嘗試存取攝影機');
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        video.srcObject = stream;
        video.play();
        const codeReader = new ZXing.BrowserQRCodeReader();
        const result = await codeReader.decodeFromVideoElement(video);
        video.style.display = 'none';
        stream.getTracks().forEach(track => track.stop());

        // 驗證是否為有效 URL
        try {
          const url = new URL(result.text);
          if (url.hostname.includes('pelicanec.e-can.com.tw')) {
            console.log('開啟宅配通 URL:', url);
            window.open(url, '_blank');
          } else {
            alert('QR Code 包含的 URL 不在允許的範圍內');
          }
        } catch {
          alert('QR Code 內容不是有效的 URL');
        }
      } catch (error) {
        let errorMessage = '無法存取攝影機';
        if (error.name === 'NotAllowedError') {
          errorMessage = '請在瀏覽器設定（chrome://settings/content/camera）中允許攝影機存取';
        } else if (error.name === 'NotFoundError') {
          errorMessage = '未找到可用的攝影機，請確認筆電攝影機是否可用';
        } else if (error.name === 'NotReadableError') {
          errorMessage = '攝影機已被其他應用程式占用';
        } else if (error.message.includes('Permission dismissed')) {
          errorMessage = '請在權限提示中選擇「允許」以使用攝影機';
        } else {
          errorMessage = `攝影機錯誤: ${error.message}`;
        }
        console.error('QR Code 掃描失敗:', error);
        alert(errorMessage);
        video.style.display = 'none';
        if (stream) stream.getTracks().forEach(track => track.stop());
      }
    });
  } else {
    console.error('未找到 scanQRCode 按鈕');
  }
});
async function checkCameraPermission() {
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'camera' });
    console.log('攝影機權限狀態:', permissionStatus.state);
    return permissionStatus.state; // 'granted', 'denied', or 'prompt'
  } catch (error) {
    console.error('檢查攝影機權限失敗:', error);
    return 'error';
  }
}
// 處理來自 popup 的資料請求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getDeliveryData') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url?.includes('pelicanec.e-can.com.tw')) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            const json = localStorage.getItem('deliveryData');
            return json ? JSON.parse(json) : { sender: {}, recipients: [] };
          }
        }, (results) => {
          sendResponse(results[0]?.result || { sender: {}, recipients: [] });
        });
      } else {
        sendResponse({ sender: {}, recipients: [] });
      }
    });
    return true; // 保持消息通道開放
  }
});
// 刪除收件人資料
// 填入popupForm資料
function setReceiverToInputs(data) {
  if (!data) return;

  document.getElementById("receiverName").value = data.name || "";
  document.getElementById("receiverMobile").value = data.mobile || "";
  document.getElementById("receiverPhone").value = data.phone || "";
  document.getElementById("receiverCounty").value = data.county || "";

  // 縣市選好後載入對應的區域
  loadDistricts(data.county, document.getElementById("receiverDistrict"));
  document.getElementById("receiverDistrict").value = data.district || "";

  document.getElementById("receiverAddress").value = data.address || "";
}
// 渲染收件人清單
function renderReceiverList(receivers) {
  const receiverList = document.getElementById("receiverList");
  receiverList.innerHTML = ""; // 清空舊列表

  if (!Array.isArray(receivers)) {
    console.error("傳進來的不是陣列", receivers);
    return;
  }

  receivers.forEach((receiver, index) => {
    const li = document.createElement("li");
    li.classList.add("receiver-item");
    li.innerHTML = `
      <div class="receiver-card">
        <div class="receiver-info">
          <p>${receiver.name}</p>
        </div>
        <div class="receiver-actions">
          <button class="fill-btn">填入</button>
          <button class="delete-btn">刪除</button>
        </div>
      </div>
    `;

    // 點 li 整體填入（可以不要的話可移除）
    li.addEventListener("click", (e) => {
      if (!e.target.classList.contains("fill-btn") && !e.target.classList.contains("delete-btn")) {
        setReceiverToInputs(receiver);
      }
    });

    // 點擊「填入」按鈕
    li.querySelector(".fill-btn").addEventListener("click", (e) => {
      e.stopPropagation();
    // 傳送資料給 content script 要求填入
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
          { type: "fillReceiver", payload: receiver },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("填入錯誤:", chrome.runtime.lastError.message);
              } else {
              console.log("填入完成");
              }
            }
        );
      });
    });

    // 點擊「刪除」按鈕
    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteReceiver(index);
    });

    receiverList.appendChild(li);
  });
}
async function deleteReceiver(indexToDelete) {
  try {
    const receivers = await getReceivers();
    receivers.splice(indexToDelete, 1); // 刪除指定項目
    chromeTabsQuery({
      type: "saveModifyReceiver",
      payload: receivers,
      alertMessage: "刪除失敗",
      onSuccess: getReceiversAndRender,
    });
  } catch (err) {
    console.error("刪除收件人錯誤：", err);
    alert("發生錯誤，請稍後再試");
  }
}

function chromeTabsQuery({ active = true, currentWindow = true, type, payload, alertMessage = "操作失敗", onSuccess = () => {} }) {
  chrome.tabs.query({ active, currentWindow }, (tabs) => {
    if (!tabs[0]) {
      alert("找不到當前分頁");
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { type, payload }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("sendMessage 錯誤：", chrome.runtime.lastError);
        alert(alertMessage);
        return;
      }

      if (response?.success) {
        onSuccess();
      } else {
        console.error("回傳失敗或無 success 字段", response);
        alert(alertMessage);
      }
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveReceiver");
  const loadReceiverBtn = document.getElementById("loadReceiver");
  const receiverList = document.getElementById("receiverList");
  function saveReceiver() {
  const data = getReceiverDataFromForm();
  if (!data.name) return alert("請輸入收件人姓名");
  console.log("popupSendSaveReceiver", data)
  // 向網頁的 content script 發送儲存請求
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: 'saveReceiver', payload: data },
      (response) => {
        if (response && response.success) {
          // 儲存成功後重新取得 receivers 並顯示
          getReceiversFromPage(renderReceiverList);
        } else {
          alert("儲存失敗");
        }
      }
    );
  });
}


function setReceiverToFrom(receiver) {
  document.getElementById("receiverName").value = receiver.name || "";
  document.getElementById("receiverMobile").value = receiver.mobile || "";
  document.getElementById("receiverPhone").value = receiver.phone || "";
  document.getElementById("receiverCounty").value = receiver.county || "";
  document.getElementById("receiverDistrict").value = receiver.district || "";
  document.getElementById("receiverAddress").value = receiver.address || "";
}
// 存收件人資料
  saveBtn.addEventListener("click", saveReceiver);
// 取得localStorage資料  
function getReceiversFromPage(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getReceivers" },
        (response) => {
          if (response && response.receivers) {
            callback(response.receivers);
          } else {
            alert("讀取收件人失敗");
          }
        }
      );
    });
  }
  loadReceiverBtn.addEventListener("click", () => {
    // 從網頁 content script 取得 localStorage 的收件人清單
    getReceiversFromPage(renderReceiverList);
  });
});

