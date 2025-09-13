

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
function saveSender() {
  saveEntity({
    getDataFromForm: getSenderDataFromForm,
    storageKey: "senders",
    messageType: "saveSender",
    searchInputId: "searchSenderName",
    listElementId: "senderList",
    searchFunction: searchSenderListResult
  });
}
function saveReceiver() {
  saveEntity({
    getDataFromForm: getReceiverDataFromForm,
    storageKey: "receivers",
    messageType: "saveReceiver",
    searchInputId: "searchReceiverName",
    listElementId: "receiverList",
    searchFunction: searchReceiverListResult
  });
}
function saveCargo() {
  saveEntity({
    getDataFromForm: getCargoDataFromForm,
    storageKey: "cargos",
    messageType: "saveCargo",
    searchInputId: "searchCargoName",
    listElementId: "cargoList",
    searchFunction: searchCargoListResult
  });
}

async function saveEntity({
  getDataFromForm,
  storageKey,
  messageType,
  searchInputId,
  listElementId,
  searchFunction
}) {
  const data = getDataFromForm();
  if (!data.name) {
    alert(`請輸入${messageType.replace('save', '')}名稱`);
    return;
  }
  const id = Date.now().toString();
  const entities = await getDataFromLocalStorage(`get${capitalize(storageKey)}`, storageKey);
  const sameNameList = entities.filter(r => r.name === data.name);
  const sameIdIndex = entities.findIndex(r => r.id === data.id);

  if (sameNameList.length > 0) {
    const shouldSave = confirm(`已有同名的 ${data.name}，需要另存嗎？`);
    if (shouldSave) {
      data.id = id;
      entities.push(data);
    } else {
      if (sameIdIndex !== -1) {
        const shouldSave = confirm(`是否要更新已有的${data.name}?`)
        if (shouldSave) {
          entities[sameIdIndex] = data;
        }
      } else {
        const firstSameNameIndex = entities.findIndex(r => r.name === data.name);
        data.id = entities[firstSameNameIndex].id;
        entities[firstSameNameIndex] = data;
      }
    }
  } else {
    data.id = id;
    entities.push(data);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: messageType, payload: entities },
      (response) => {
        if (response && response.success) {
          const keyword = document.getElementById(searchInputId).value;
          const listElement = document.getElementById(listElementId);
          if (keyword) {
            searchFunction(keyword);
          } else {
            listElement.innerHTML = "";
          }
        } else {
          alert("儲存失敗");
        }
      }
    );
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 取得收件人dom內資料
function getReceiverDataFromForm() {
    return {
      name: document.getElementById("receiverName").value,
      id:document.getElementById('receiverName').dataset.receiverId,
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
    id: document.getElementById("senderName").dataset.senderId,
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
    id: document.getElementById("cargoName").dataset.cargoId,
    price:document.getElementById("cargoPrice").value,
    deliverTemperature: document.getElementById("selectDeliverTemperature").value,
    deliverTime: document.getElementById("selectDeliverTime").value,
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0]) {
    alert('找不到當前分頁');
    return;
  }

  chrome.tabs.sendMessage(tabs[0].id, { type: 'exportFillData' }, (response) => {
    if (chrome.runtime.lastError) {
      alert('無法連接內容腳本: ' + chrome.runtime.lastError.message);
      return;
    }

    if (response?.status === 'success') {
      alert('匯出成功');

      const exportData = {
        senders: response.senders || [],
        receivers: response.receivers || [],
        cargos: response.cargos || []
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'fillData.json';
      a.click();
      URL.revokeObjectURL(a.href);

    } else if (response?.status === 'empty') {
      alert('沒有資料可以匯出');
    } else {
      alert(`匯出失敗：${response?.message || '未知錯誤'}`);
    }
  });
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
      const rawData = JSON.parse(e.target.result);
      const data = {
        senders: Array.isArray(rawData.senders) ? rawData.senders : [],
        receivers: Array.isArray(rawData.receivers) ? rawData.receivers : [],
        cargos: Array.isArray(rawData.cargos) ? rawData.cargos : [],
      };
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, {
        type: 'importFillData',
        payload: {
          senders: data.senders,
          receivers: data.receivers,
          cargos: data.cargos,
    }
    }, (response) => {
    if (response?.status === 'success') {
      alert('匯入成功');
    } else {
      alert(`匯入失敗: ${response?.message || '未知錯誤'}`);
    }
  });
});

    } catch {
      alert('匯入失敗：無效的 JSON 檔案');
    }
  };

  reader.readAsText(file);
  fileInput.value = ''; // 清空選擇
});
// 顯示要import的檔案
document.getElementById('importFile').addEventListener('change', function () {
  const file = this.files[0];
  document.getElementById('fileNameDisplay').textContent = file ? file.name : '尚未選擇檔案';
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
  document.getElementById("receiverName").dataset.receiverId = data?.id || ""; 
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
  document.getElementById("senderName").dataset.senderId = data?.id || "";
  document.getElementById("senderMobile").value = data.mobile || "";
  document.getElementById("senderPhone").value = data.phone || "";
  document.getElementById("senderCounty").value = data.county || "";

  // 縣市選好後載入對應的區域
  loadDistricts(data.county, document.getElementById("senderDistrict"));
  document.getElementById("senderDistrict").value = data.district || "";

  document.getElementById("senderAddress").value = data.address || "";
}
function setCargoToInputs(data) {
  if (!data) return;
  document.getElementById("cargoName").value = data.name || "";
  document.getElementById("cargoName").dataset.cargoId = data.id || "";
  document.getElementById("cargoPrice").value = data.price || "";
  document.getElementById("selectDeliverTemperature").value = data.deliverTemperature || "";
  document.getElementById("selectDeliverTime").value = data.deliverTime || "";
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
    onDelete: (receiver) => {
      deleteListByIdAndName({
        item: receiver,
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
    onDelete: (sender) => {
      deleteListByIdAndName({
        item: sender,
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
function renderCargoList(cargos) {   
  renderList({     
    containerId: "cargoList",     
    data: cargos,     
    itemNameKey: "name",     
    onFill: (cargo) => {       
      chromeTabsQuery({       
        type: "fillCargo",       
        payload: cargo,       
        alertMessage: "填入失敗",       
        onSuccess: (response) => {
          console.log("填入完成");
          // 檢查是否有警告訊息需要顯示
          if (response && response.alertMessage) {
            alert(response.alertMessage); // 這個 alert 會顯示在 popup 內
          }
        },       
        onError: (err) => console.error("填入錯誤:", err),       
        expectResponse: true // 改為 true 因為我們需要接收回應
      });     
    },     
    onDelete: (cargo) => {       
      deleteListByIdAndName({         
        item: cargo,         
        type: "getCargos",         
        localStorageKey: "cargos",         
        confirmMessage: "確認刪除這個貨物嗎?",         
        dataName: "name",         
        successCallback: () => getDataAndRender({           
          type: "getCargos",           
          localStorageKey: "cargos",           
          renderCallback: renderCargoList         
        }),         
        saveType: "saveModifyCargos"       
      });     
    },     
    onItemClick: (cargo) => {       
      setCargoToInputs(cargo);     
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
      <div class="item-card" data-item-id="${item?.id || ''}">
        <div class="item-info" >
          <p>${item[itemNameKey] || "未命名"}</p>
        </div>
        <div class="item-actions">
          <button class="fill-btn mr-4">填入</button>
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
      // 進行兩次填入 因為寄件人在網頁需要填入兩次才不報錯
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

async function deleteListByIdAndName({
  item,
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
    if (!confirm(`『${item[dataName]}』${confirmMessage}`)) {
      return; // 使用者按取消
    }
    const spliceIndex = data.findIndex((i) => i?.id === item?.id);
    if (spliceIndex === -1) {
    alert("找不到要刪除的項目");
    return;
    }
    data.splice(spliceIndex, 1); // 刪除項目

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
        // 不需要回傳就直接觸發成功回調
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
  const searchSenderInput = document.getElementById('searchSenderName');
  const loadCargoBtn =document.getElementById("searchCargoBtn");
  const searchCargoInput = document.getElementById("searchCargoName");
  

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
    searchReceiverListResult(receiverSearchKeyWord);
  });
  // 寄件人搜尋功能
  searchSenderInput.addEventListener('input', debounce(() => {
    const senderSearchKeyWord = searchSenderInput.value;
    searchSenderListResult(senderSearchKeyWord);
  }, 300));
  loadSenderBtn.addEventListener("click", () => {
    const senderSearchKeyWord = document.getElementById('searchSenderName').value
    // 從網頁 content script 取得 localStorage 的收件人清單
    searchSenderListResult(senderSearchKeyWord);
  });
  // 貨物搜索功能
  searchCargoInput.addEventListener('input', debounce(()=> {
    const cargoSearchKeyWord = searchCargoInput.value;
    searchCargoListResult(cargoSearchKeyWord);
  }, 300));
  loadCargoBtn.addEventListener("click", () => {
    const cargoSearchKeyWord = document.getElementById('searchCargoName').value
    // 從網頁 content script 取得 localStorage 的收件人清單
    searchCargoListResult(cargoSearchKeyWord)
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
  // 貨物表摺疊
  createCollapsibleList({
    containerId: "cargoList",
    toggleBtnId: "toggleCargoListBtn"
  });
  // 收寄人表單摺疊
  createCollapsibleList({
    containerId: "senderForm",
    toggleBtnId: "toggleSenderFormBtn"
  });
  // 收件人表單摺疊
  createCollapsibleList({
    containerId: "receiverForm",
    toggleBtnId: "toggleReceiverFormBtn"
  });
  // 貨物表單摺疊
  createCollapsibleList({
    containerId: "cargoForm",
    toggleBtnId: "toggleCargoFormBtn"
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
async function searchCargoListResult(keyWord) {
  const result = await searchList(keyWord, "getCargos", "cargos", "name")
  renderCargoList(result)
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
  document.getElementById("senderName").dataset.senderId = "";
  document.getElementById("senderMobile").value = "";
  document.getElementById("senderPhone").value = "";
  document.getElementById("senderCounty").value = "";
  document.getElementById("senderDistrict").value = "";
  document.getElementById("senderAddress").value = "";
});
// 清除收件人表單
document.getElementById("resetReceiver").addEventListener("click", () => {
  document.getElementById("receiverName").value = "";
  document.getElementById("receiverName").dataset.senderId = "";
  document.getElementById("receiverMobile").value = "";
  document.getElementById("receiverPhone").value = "";
  document.getElementById("receiverCounty").value = "";
  document.getElementById("receiverDistrict").value = "";
  document.getElementById("receiverAddress").value = "";
});
// 清除貨物表單
document.getElementById("resetCargo").addEventListener("click", () => {
  document.getElementById("cargoName").value = "";
  document.getElementById("cargoName").dataset.cargoId = "";
  document.getElementById("cargoPrice").value = "";
  document.getElementById("selectDeliverTemperature").value = "";
  document.getElementById("selectDeliverTime").value = "";
});

