

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
// 儲存收件者
function saveReceiver() {
  const receiverData = getReceiverDataFromForm();
  if (!receiverData.name) return alert("請輸入收件人姓名");
  // 向網頁的 content script 發送儲存請求
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: 'saveReceiver', payload: receiverData },
      (response) => {
        if (response && response.success) {
        } else {
          alert("儲存失敗");
          }
        }
      );
    });
  }
 // 儲存寄件者
 function saveSender() {
  const senderData = getSenderDataFromForm();
  if (!senderData.name) {
    alert("請輸入寄件人姓名");
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "saveSender", payload: senderData },
      (response) => {
        if (response && response.success) {
        } else {
          alert("儲存寄件人失敗");
        }
      }
    );
  });
}
// 儲存貨物資料
function saveCargo() {
  const cargoData = getCargoDataFromForm();
  console.log("saveCargoData", cargoData)
  if (!cargoData.name) return alert("請輸入貨物名稱");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: 'saveCargo', payload: cargoData },
      (response) => {
        if (response && response.success) {
        } else {
          alert("儲存失敗");
          }
        }
      );
    });
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
// 取得寄件人dom內資料
function getSenderDataFromForm() {
  return {
    name: document.getElementById("senderName").value,
    mobile: document.getElementById("senderMobile").value,
    phone: document.getElementById("senderPhone").value,
    county: document.getElementById("senderCounty").value,
    district: document.getElementById("senderDistrict").value,
    address: document.getElementById("senderAddress").value,
  };
}
// 取得貨物dom內資料
function getCargoDataFromForm() {
  return {
    name: document.getElementById("cargoName").value,
    price:document.getElementById("cargoPrice").value,
    deliverTemperature: document.getElementById("selectDeliverTemperature").value,
    selectDeliverTime: document.getElementById("selectDeliverTime").value,
  }
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

async function getDataFromLocalStorage(type, localStorageKey) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type }, (response) => {
        if (!response) {
          resolve([]);
          return;
        }
        resolve(response[localStorageKey] || []); // 用 keyName 取資料
      });
    });
  });
}
// 取得localStorage 資料後渲染 
async function getDataAndRender({ type, localStorageKey, renderCallback }) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { type }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("sendMessage 錯誤:", chrome.runtime.lastError.message);
      return;
    }
    const data = response?.[localStorageKey] || [];
    if (typeof renderCallback === "function") {
      renderCallback(data);
    }
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
function setSenderToInputs(data) {
  if (!data) return;

  document.getElementById("senderName").value = data.name || "";
  document.getElementById("senderMobile").value = data.mobile || "";
  document.getElementById("senderPhone").value = data.phone || "";
  document.getElementById("senderCounty").value = data.county || "";

  // 縣市選好後載入對應的區域
  loadDistricts(data.county, document.getElementById("senderDistrict"));
  document.getElementById("senderDistrict").value = data.district || "";

  document.getElementById("senderAddress").value = data.address || "";
}
// 渲染收件人清單
function renderReceiverList(receivers) {
  renderList({
    containerId: "receiverList",
    data: receivers,
    itemNameKey: "name",
    onFill: (receiver) => {
      chromeTabsQuery({
      type: "fillReceiver",
      payload: receiver,
      alertMessage: "填入失敗",
      onSuccess: () => console.log("填入完成"),
      onError: (err) => console.error("填入錯誤:", err),
      expectResponse:false
  });
    },
    onDelete: (_, index) => {
      deleteList({
        indexToDelete: index,
        type: "getReceivers",
        localStorageKey: "receivers",
        confirmMessage: "確認刪除這個收件人嗎?",
        dataName: "name",
        successCallback: () => getDataAndRender({
          type: "getReceivers",
          localStorageKey: "receivers",
          renderCallback: renderReceiverList
        }),
        saveType: "saveModifyReceiver"
      });
    },
    onItemClick: (receiver) => {
      setReceiverToInputs(receiver);
    }
  });
}
function renderSenderList(senders){
  renderList({
    containerId: "senderList",
    data: senders,
    itemNameKey: "name",
    onFill: (sender) => {
      chromeTabsQuery({
      type: "fillSender",
      payload: sender,
      alertMessage: "填入失敗",
      onSuccess: () => console.log("填入完成"),
      onError: (err) => console.error("填入錯誤:", err),
      expectResponse:false
  });
    },
    onDelete: (_, index) => {
      deleteList({
        indexToDelete: index,
        type: "getSenders",
        localStorageKey: "senders",
        confirmMessage: "確認刪除這個寄件人嗎?",
        dataName: "name",
        successCallback: () => getDataAndRender({
          type: "getSenders",
          localStorageKey: "senders",
          renderCallback: renderSenderList
        }),
        saveType: "saveModifySender"
      });
    },
    onItemClick: (sender) => {
      setSenderToInputs(sender);
    }
  });
}
// 渲染清單
function renderList({
  containerId,
  data,
  itemNameKey = "name",
  onFill = () => {},
  onDelete = () => {},
  onItemClick = () => {}
}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`找不到容器 #${containerId}`);
    return;
  }

  container.innerHTML = ""; // 清空舊列表

  if (!Array.isArray(data)) {
    console.error("傳進來的不是陣列", data);
    return;
  }

  data.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.innerHTML = `
      <div class="item-card">
        <div class="item-info">
          <p>${item[itemNameKey] || "未命名"}</p>
        </div>
        <div class="item-actions">
          <button class="fill-btn">填入</button>
          <button class="delete-btn">刪除</button>
        </div>
      </div>
    `;

    // 點整列
    li.addEventListener("click", (e) => {
      if (!e.target.classList.contains("fill-btn") && !e.target.classList.contains("delete-btn")) {
         // 移除其他 li 的 focus 樣式
        container.querySelectorAll(".list-item").forEach((el) => {
          el.classList.remove("focused");
        });
        // 加上目前 li 的 focus 樣式
        li.classList.add("focused");
        onItemClick(item, index);
      }
    });

    // 點擊「填入」
    li.querySelector(".fill-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      onFill(item, index);
    });

    // 點擊「刪除」
    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete(item, index);
    });

    container.appendChild(li);
  });
}

async function deleteList({
  indexToDelete,
  type,                 // 要發送給 content.js 的 type
  localStorageKey,  // localStorage 的 key
  confirmMessage,
  dataName,             // 用來顯示在 confirm 文字
  successCallback = () => {}, // 刪除成功後要做的事
  saveType              // (可選) 內容 script 需要知道的「儲存 type」
}) {
  try {
    const data = await getDataFromLocalStorage(type, localStorageKey);
    if (!data || !Array.isArray(data)) {
      alert("資料格式錯誤或不存在");
      return;
    }

    if (!confirm(`『${data[indexToDelete][dataName]}』${confirmMessage}`)) {
      return; // 使用者按取消
    }

    data.splice(indexToDelete, 1); // 刪除項目

    chromeTabsQuery({
      type: saveType ,
      payload: data,
      expectResponse: true,
      alertMessage: "刪除失敗",
      onSuccess: successCallback
    });
  } catch (err) {
    console.error("刪除錯誤：", err);
    alert("發生錯誤，請稍後再試");
  }
}
function chromeTabsQuery({
  type,
  payload = null,
  active = true,
  currentWindow = true,
  alertMessage = "操作失敗",
  onSuccess = () => {},
  onError = () => {},
  expectResponse = true 
}) {
  chrome.tabs.query({ active, currentWindow }, (tabs) => {
    if (!tabs[0]) {
      alert("找不到當前分頁");
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { type, payload }, (response) => {
      if (!expectResponse) {
        // 🔹 不需要回傳就直接觸發成功回調
        onSuccess();
        return;
      }

      if (chrome.runtime.lastError) {
        console.error("sendMessage 錯誤：", chrome.runtime.lastError.message);
        alert(alertMessage);
        onError(chrome.runtime.lastError);
        return;
      }

      if (response?.success) {
        onSuccess(response);
      } else {
        console.warn("沒有 success 或回傳值不正確:", response);
        alert(alertMessage);
        onError(response);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const saveReceiverBtn = document.getElementById("saveReceiver");
  const saveSenderBtn = document.getElementById("saveSender")
  const saveCargoBtn = document.getElementById("saveCargo")
  const loadReceiverBtn = document.getElementById("searchReceiverBtn");
  const searchReceiverInput = document.getElementById('searchReceiverName');
  const loadSenderBtn = document.getElementById("searchSenderBtn");
  const searchSenderInput = document.getElementById('searchSenderName')
  

  function setReceiverToFrom(receiver) {
    document.getElementById("receiverName").value = receiver.name || "";
    document.getElementById("receiverMobile").value = receiver.mobile || "";
    document.getElementById("receiverPhone").value = receiver.phone || "";
    document.getElementById("receiverCounty").value = receiver.county || "";
    document.getElementById("receiverDistrict").value = receiver.district || "";
    document.getElementById("receiverAddress").value = receiver.address || "";
  }
  // 存收件人資料
  saveReceiverBtn.addEventListener("click", saveReceiver);
  // 儲存寄件人資料
  saveSenderBtn.addEventListener("click", saveSender);
  // 存貨物資料
  saveCargoBtn.addEventListener("click", saveCargo)
  // 收件人搜尋功能
  searchReceiverInput.addEventListener('input', debounce(() => {
    const receiverSearchKeyWord = searchReceiverInput.value;
    searchReceiverListResult(receiverSearchKeyWord)
  }, 300));
  
  loadReceiverBtn.addEventListener("click", () => {
    const receiverSearchKeyWord = document.getElementById('searchReceiverName').value
    // 從網頁 content script 取得 localStorage 的收件人清單
    searchReceiverListResult(receiverSearchKeyWord)
  });
  // 寄件人搜尋功能
  searchSenderInput.addEventListener('input', debounce(() => {
    const senderSearchKeyWord = searchSenderInput.value;
    searchSenderListResult(senderSearchKeyWord)
  }, 300));
  loadSenderBtn.addEventListener("click", () => {
    const senderSearchKeyWord = document.getElementById('searchSenderName').value
    // 從網頁 content script 取得 localStorage 的收件人清單
    searchSenderListResult(senderSearchKeyWord)
  });
  // 收件人列表摺疊
  createCollapsibleList({
    containerId: "receiverList",
    toggleBtnId: "toggleReceiverListBtn"
  });
  // 寄件人列表摺疊
  createCollapsibleList({
    containerId: "senderList",
    toggleBtnId: "toggleSenderListBtn"
  });
  // 收件人表單摺疊
  createCollapsibleList({
    containerId: "receiverForm",
    toggleBtnId: "toggleReceiverFormBtn"
  });
  // 寄件人表單摺疊
  createCollapsibleList({
    containerId: "senderForm",
    toggleBtnId: "toggleSenderFormBtn"
  });
});
async function searchReceiverListResult(keyWord) {
  const result = await searchList(keyWord, "getReceivers", "receivers", "name")
  renderReceiverList(result)
  } 
async function searchSenderListResult(keyWord) {
  const result = await searchList(keyWord, "getSenders", "senders", "name")
  renderSenderList(result)
  }   
async function searchList(searchKeyWord, type, localStorageKey, dataName){
  const data = await getDataFromLocalStorage(type, localStorageKey);
    if (!data || !Array.isArray(data)) {
      alert("資料格式錯誤或不存在");
      return;
    }
    if(!searchKeyWord){
      return data
    } else {
      const filterListData = data.filter((item) => item[dataName].toLowerCase().includes(searchKeyWord.toLowerCase()));
      return filterListData
    }
}
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 摺疊功能

function createCollapsibleList({ containerId, toggleBtnId }) {
  const container = document.getElementById(containerId);
  const toggleBtn = document.getElementById(toggleBtnId);
  const icon = toggleBtn.querySelector("i");
  let isCollapsed = false;

  toggleBtn.addEventListener("click", () => {
    isCollapsed = !isCollapsed;
    container.style.display = isCollapsed ? "none" : "block";
    icon.className = isCollapsed ? "fas fa-chevron-down" : "fas fa-chevron-up";
  });
}
// 清除寄件人表單
document.getElementById("resetSender").addEventListener("click", () => {
  document.getElementById("senderName").value = "";
  document.getElementById("senderMobile").value = "";
  document.getElementById("senderPhone").value = "";
  document.getElementById("senderCounty").value = "";
  document.getElementById("senderDistrict").value = "";
  document.getElementById("senderAddress").value = "";
});
// 清除收件人表單
document.getElementById("resetReceiver").addEventListener("click", () => {
  document.getElementById("receiverName").value = "";
  document.getElementById("receiverMobile").value = "";
  document.getElementById("receiverPhone").value = "";
  document.getElementById("receiverCounty").value = "";
  document.getElementById("receiverDistrict").value = "";
  document.getElementById("receiverAddress").value = "";
});
