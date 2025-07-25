// 縣市資料，value為宅配通網頁的 value，label為顯示名稱
const countiesData = [
  { value: '1', label: '基隆市' },
  { value: '2', label: '台北市' },
  { value: '3', label: '新北市' },
  { value: '4', label: '桃園市' },
  { value: '5', label: '新竹市' },
  { value: '6', label: '新竹縣' },
  { value: '7', label: '苗栗縣' },
  { value: '8', label: '台中市' },
  { value: '9', label: '彰化縣' },
  { value: '10', label: '南投縣' },
  { value: '11', label: '雲林縣' },
  { value: '12', label: '嘉義市' },
  { value: '13', label: '嘉義縣' },
  { value: '14', label: '台南市' },
  { value: '15', label: '高雄市' },
  { value: '16', label: '屏東縣' },
  { value: '17', label: '台東縣' },
  { value: '18', label: '花蓮縣' },
  { value: '19', label: '宜蘭縣' },
  { value: '20', label: '澎湖縣' },
  { value: '21', label: '金門縣' },
  { value: '22', label: '連江縣' },
];
const districtsData = {
  '1': [ // 基隆市
    { value: '0', label: '仁愛區' },
    { value: '1', label: '信義區' },
    { value: '2', label: '中正區' },
    { value: '3', label: '中山區' },
    { value: '4', label: '安樂區' },
    { value: '5', label: '暖暖區' },
    { value: '6', label: '七堵區' },
  ],
  '2': [ // 台北市
    { value: '0', label: '中正區' },
    { value: '1', label: '大同區' },
    { value: '2', label: '中山區' },
    { value: '3', label: '松山區' },
    { value: '4', label: '大安區' },
    { value: '5', label: '萬華區' },
    { value: '6', label: '信義區' },
    { value: '7', label: '士林區' },
    { value: '8', label: '北投區' },
    { value: '9', label: '內湖區' },
    { value: '10', label: '南港區' },
    { value: '11', label: '文山區' },
  ],
  '3': [ // 新北市
    { value: '0', label: '萬里區' },
    { value: '1', label: '金山區' },
    { value: '2', label: '板橋區' },
    { value: '3', label: '汐止區' },
    { value: '4', label: '深坑區' },
    { value: '5', label: '石碇區' },
    { value: '6', label: '瑞芳區' },
    { value: '7', label: '平溪區' },
    { value: '8', label: '雙溪區' },
    { value: '9', label: '貢寮區' },
    { value: '10', label: '新店區' },
    { value: '11', label: '坪林區' },
    { value: '12', label: '烏來區' },
    { value: '13', label: '永和區' },
    { value: '14', label: '中和區' },
    { value: '15', label: '土城區' },
    { value: '16', label: '三峽區' },
    { value: '17', label: '樹林區' },
    { value: '18', label: '鶯歌區' },
    { value: '19', label: '三重區' },
    { value: '20', label: '新莊區' },
    { value: '21', label: '泰山區' },
    { value: '22', label: '林口區' },
    { value: '23', label: '蘆洲區' },
    { value: '24', label: '五股區' },
    { value: '25', label: '八里區' },
    { value: '26', label: '淡水區' },
    { value: '27', label: '三芝區' },
    { value: '28', label: '石門區' },
  ],
  '4': [ // 桃園市
    { value: '0', label: '中壢區' },
    { value: '1', label: '平鎮區' },
    { value: '2', label: '龍潭區' },
    { value: '3', label: '楊梅區' },
    { value: '4', label: '新屋區' },
    { value: '5', label: '觀音區' },
    { value: '6', label: '桃園區' },
    { value: '7', label: '龜山區' },
    { value: '8', label: '八德區' },
    { value: '9', label: '大溪區' },
    { value: '10', label: '復興區' },
    { value: '11', label: '大園區' },
    { value: '12', label: '蘆竹區' },
  ],
  '5': [ // 新竹市
    { value: '0', label: '新竹市' },
  ],
  '6': [ // 新竹縣
    { value: '0', label: '竹北市' },
    { value: '1', label: '湖口鄉' },
    { value: '2', label: '新豐鄉' },
    { value: '3', label: '新埔鎮' },
    { value: '4', label: '關西鎮' },
    { value: '5', label: '芎林鄉' },
    { value: '6', label: '寶山鄉' },
    { value: '7', label: '竹東鎮' },
    { value: '8', label: '五峰鄉' },
    { value: '9', label: '橫山鄉' },
    { value: '10', label: '北埔鄉' },
    { value: '11', label: '尖石鄉' },
    { value: '12', label: '峨眉鄉' },
  ],
  '7': [ // 苗栗縣
    { value: '0', label: '竹南鎮' },
    { value: '1', label: '頭份市' },
    { value: '2', label: '三灣鄉' },
    { value: '3', label: '南庄鄉' },
    { value: '4', label: '獅潭鄉' },
    { value: '5', label: '後龍鎮' },
    { value: '6', label: '通霄鎮' },
    { value: '7', label: '苑裡鎮' },
    { value: '8', label: '苗栗市' },
    { value: '9', label: '造橋鄉' },
    { value: '10', label: '頭屋鄉' },
    { value: '11', label: '公館鄉' },
    { value: '12', label: '大湖鄉' },
    { value: '13', label: '泰安鄉' },
    { value: '14', label: '銅鑼鄉' },
    { value: '15', label: '三義鄉' },
    { value: '16', label: '西湖鄉' },
    { value: '17', label: '卓蘭鎮' },
  ],
  '8': [ // 台中市
    { value: '0', label: '中區' },
    { value: '1', label: '東區' },
    { value: '2', label: '南區' },
    { value: '3', label: '西區' },
    { value: '4', label: '北區' },
    { value: '5', label: '北屯區' },
    { value: '6', label: '西屯區' },
    { value: '7', label: '南屯區' },
    { value: '8', label: '太平區' },
    { value: '9', label: '大里區' },
    { value: '10', label: '霧峰區' },
    { value: '11', label: '烏日區' },
    { value: '12', label: '豐原區' },
    { value: '13', label: '后里區' },
    { value: '14', label: '石岡區' },
    { value: '15', label: '東勢區' },
    { value: '16', label: '和平區' },
    { value: '17', label: '新社區' },
    { value: '18', label: '潭子區' },
    { value: '19', label: '大雅區' },
    { value: '20', label: '神岡區' },
    { value: '21', label: '大肚區' },
    { value: '22', label: '沙鹿區' },
    { value: '23', label: '龍井區' },
    { value: '24', label: '梧棲區' },
    { value: '25', label: '清水區' },
    { value: '26', label: '大甲區' },
    { value: '27', label: '外埔區' },
    { value: '28', label: '大安區' },
  ],
  '9': [ // 彰化縣
    { value: '0', label: '彰化市' },
    { value: '1', label: '芬園鄉' },
    { value: '2', label: '花壇鄉' },
    { value: '3', label: '秀水鄉' },
    { value: '4', label: '鹿港鎮' },
    { value: '5', label: '福興鄉' },
    { value: '6', label: '線西鄉' },
    { value: '7', label: '和美鎮' },
    { value: '8', label: '伸港鄉' },
    { value: '9', label: '員林市' },
    { value: '10', label: '社頭鄉' },
    { value: '11', label: '永靖鄉' },
    { value: '12', label: '埔心鄉' },
    { value: '13', label: '溪湖鎮' },
    { value: '14', label: '大村鄉' },
    { value: '15', label: '埔鹽鄉' },
    { value: '16', label: '田中鎮' },
    { value: '17', label: '北斗鎮' },
    { value: '18', label: '田尾鄉' },
    { value: '19', label: '埤頭鄉' },
    { value: '20', label: '溪州鄉' },
    { value: '21', label: '竹塘鄉' },
    { value: '22', label: '二林鎮' },
    { value: '23', label: '大城鄉' },
    { value: '24', label: '芳苑鄉' },
    { value: '25', label: '二水鄉' },
  ],
  '10': [ // 南投縣
    { value: '0', label: '南投市' },
    { value: '1', label: '中寮鄉' },
    { value: '2', label: '草屯鎮' },
    { value: '3', label: '國姓鄉' },
    { value: '4', label: '埔里鎮' },
    { value: '5', label: '仁愛鄉' },
    { value: '6', label: '名間鄉' },
    { value: '7', label: '集集鎮' },
    { value: '8', label: '水里鄉' },
    { value: '9', label: '魚池鄉' },
    { value: '10', label: '信義鄉' },
    { value: '11', label: '竹山鎮' },
    { value: '12', label: '鹿谷鄉' },
  ],
  '11': [ // 雲林縣
    { value: '0', label: '斗南鎮' },
    { value: '1', label: '大埤鄉' },
    { value: '2', label: '虎尾鎮' },
    { value: '3', label: '土庫鎮' },
    { value: '4', label: '褒忠鄉' },
    { value: '5', label: '東勢鄉' },
    { value: '6', label: '台西鄉' },
    { value: '7', label: '崙背鄉' },
    { value: '8', label: '麥寮鄉' },
    { value: '9', label: '斗六市' },
    { value: '10', label: '林內鄉' },
    { value: '11', label: '古坑鄉' },
    { value: '12', label: '莿桐鄉' },
    { value: '13', label: '西螺鎮' },
    { value: '14', label: '二崙鄉' },
    { value: '15', label: '北港鎮' },
    { value: '16', label: '水林鄉' },
    { value: '17', label: '口湖鄉' },
    { value: '18', label: '四湖鄉' },
    { value: '19', label: '元長鄉' },
  ],
  '12': [ // 嘉義市
    { value: '0', label: '嘉義市' },
  ],
  '13': [ // 嘉義縣
    { value: '0', label: '番路鄉' },
    { value: '1', label: '梅山鄉' },
    { value: '2', label: '竹崎鄉' },
    { value: '3', label: '阿里山鄉' },
    { value: '4', label: '中埔鄉' },
    { value: '5', label: '大埔鄉' },
    { value: '6', label: '水上鄉' },
    { value: '7', label: '鹿草鄉' },
    { value: '8', label: '太保市' },
    { value: '9', label: '朴子市' },
    { value: '10', label: '東石鄉' },
    { value: '11', label: '六腳鄉' },
    { value: '12', label: '新港鄉' },
    { value: '13', label: '民雄鄉' },
    { value: '14', label: '大林鎮' },
    { value: '15', label: '溪口鄉' },
    { value: '16', label: '義竹鄉' },
    { value: '17', label: '布袋鎮' },
  ],
  '14': [ // 台南市
    { value: '0', label: '中西區' },
    { value: '1', label: '東區' },
    { value: '2', label: '南區' },
    { value: '3', label: '北區' },
    { value: '4', label: '安平區' },
    { value: '5', label: '安南區' },
    { value: '6', label: '永康區' },
    { value: '7', label: '歸仁區' },
    { value: '8', label: '新化區' },
    { value: '9', label: '左鎮區' },
    { value: '10', label: '玉井區' },
    { value: '11', label: '楠西區' },
    { value: '12', label: '南化區' },
    { value: '13', label: '仁德區' },
    { value: '14', label: '關廟區' },
    { value: '15', label: '龍崎區' },
    { value: '16', label: '官田區' },
    { value: '17', label: '麻豆區' },
    { value: '18', label: '佳里區' },
    { value: '19', label: '西港區' },
    { value: '20', label: '七股區' },
    { value: '21', label: '將軍區' },
    { value: '22', label: '學甲區' },
    { value: '23', label: '北門區' },
    { value: '24', label: '新營區' },
    { value: '25', label: '後壁區' },
    { value: '26', label: '白河區' },
    { value: '27', label: '東山區' },
    { value: '28', label: '六甲區' },
    { value: '29', label: '下營區' },
    { value: '30', label: '柳營區' },
    { value: '31', label: '鹽水區' },
    { value: '32', label: '善化區' },
    { value: '33', label: '大內區' },
    { value: '34', label: '山上區' },
    { value: '35', label: '新市區' },
    { value: '36', label: '安定區' },
  ],
  '15': [ // 高雄市
    { value: '0', label: '新興區' },
    { value: '1', label: '前金區' },
    { value: '2', label: '苓雅區' },
    { value: '3', label: '鹽埕區' },
    { value: '4', label: '鼓山區' },
    { value: '5', label: '旗津區' },
    { value: '6', label: '前鎮區' },
    { value: '7', label: '三民區' },
    { value: '8', label: '楠梓區' },
    { value: '9', label: '小港區' },
    { value: '10', label: '左營區' },
    { value: '11', label: '仁武區' },
    { value: '12', label: '大社區' },
    { value: '13', label: '岡山區' },
    { value: '14', label: '路竹區' },
    { value: '15', label: '阿蓮區' },
    { value: '16', label: '田寮區' },
    { value: '17', label: '燕巢區' },
    { value: '18', label: '橋頭區' },
    { value: '19', label: '梓官區' },
    { value: '20', label: '彌陀區' },
    { value: '21', label: '永安區' },
    { value: '22', label: '湖內區' },
    { value: '23', label: '鳳山區' },
    { value: '24', label: '大寮區' },
    { value: '25', label: '林園區' },
    { value: '26', label: '鳥松區' },
    { value: '27', label: '大樹區' },
    { value: '28', label: '旗山區' },
    { value: '29', label: '美濃區' },
    { value: '30', label: '六龜區' },
    { value: '31', label: '內門區' },
    { value: '32', label: '杉林區' },
    { value: '33', label: '甲仙區' },
    { value: '34', label: '桃源區' },
    { value: '35', label: '那瑪夏區' },
    { value: '36', label: '茂林區' },
    { value: '37', label: '茄萣區' },
  ],
  '16': [ // 屏東縣
    { value: '0', label: '屏東市' },
    { value: '1', label: '三地門鄉' },
    { value: '2', label: '霧台鄉' },
    { value: '3', label: '瑪家鄉' },
    { value: '4', label: '九如鄉' },
    { value: '5', label: '里港鄉' },
    { value: '6', label: '高樹鄉' },
    { value: '7', label: '鹽埔鄉' },
    { value: '8', label: '長治鄉' },
    { value: '9', label: '麟洛鄉' },
    { value: '10', label: '竹田鄉' },
    { value: '11', label: '內埔鄉' },
    { value: '12', label: '萬丹鄉' },
    { value: '13', label: '潮州鎮' },
    { value: '14', label: '泰武鄉' },
    { value: '15', label: '來義鄉' },
    { value: '16', label: '萬巒鄉' },
    { value: '17', label: '崁頂鄉' },
    { value: '18', label: '新埤鄉' },
    { value: '19', label: '南州鄉' },
    { value: '20', label: '林邊鄉' },
    { value: '21', label: '東港鎮' },
    { value: '22', label: '琉球鄉' },
    { value: '23', label: '佳冬鄉' },
    { value: '24', label: '新園鄉' },
    { value: '25', label: '枋寮鄉' },
    { value: '26', label: '枋山鄉' },
    { value: '27', label: '春日鄉' },
    { value: '28', label: '獅子鄉' },
    { value: '29', label: '車城鄉' },
    { value: '30', label: '牡丹鄉' },
    { value: '31', label: '恆春鎮' },
    { value: '32', label: '滿州鄉' },
  ],
  '17': [ // 台東縣
    { value: '0', label: '台東市' },
    { value: '1', label: '綠島鄉' },
    { value: '2', label: '蘭嶼鄉' },
    { value: '3', label: '延平鄉' },
    { value: '4', label: '卑南鄉' },
    { value: '5', label: '鹿野鄉' },
    { value: '6', label: '關山鎮' },
    { value: '7', label: '海端鄉' },
    { value: '8', label: '池上鄉' },
    { value: '9', label: '東河鄉' },
    { value: '10', label: '成功鎮' },
    { value: '11', label: '長濱鄉' },
    { value: '12', label: '太麻里鄉' },
    { value: '13', label: '金峰鄉' },
    { value: '14', label: '大武鄉' },
    { value: '15', label: '達仁鄉' },
  ],
  '18': [ // 花蓮縣
    { value: '0', label: '花蓮市' },
    { value: '1', label: '新城鄉' },
    { value: '2', label: '秀林鄉' },
    { value: '3', label: '吉安鄉' },
    { value: '4', label: '壽豐鄉' },
    { value: '5', label: '鳳林鎮' },
    { value: '6', label: '光復鄉' },
    { value: '7', label: '豐濱鄉' },
    { value: '8', label: '瑞穗鄉' },
    { value: '9', label: '萬榮鄉' },
    { value: '10', label: '玉里鎮' },
    { value: '11', label: '卓溪鄉' },
    { value: '12', label: '富里鄉' },
  ],
  '19': [ // 宜蘭縣
    { value: '0', label: '宜蘭市' },
    { value: '1', label: '頭城鎮' },
    { value: '2', label: '礁溪鄉' },
    { value: '3', label: '壯圍鄉' },
    { value: '4', label: '員山鄉' },
    { value: '5', label: '羅東鎮' },
    { value: '6', label: '三星鄉' },
    { value: '7', label: '大同鄉' },
    { value: '8', label: '五結鄉' },
    { value: '9', label: '冬山鄉' },
    { value: '10', label: '蘇澳鎮' },
    { value: '11', label: '南澳鄉' },
  ],
  '20': [ // 澎湖縣
    { value: '0', label: '馬公市' },
    { value: '1', label: '西嶼鄉' },
    { value: '2', label: '望安鄉' },
    { value: '3', label: '七美鄉' },
    { value: '4', label: '白沙鄉' },
    { value: '5', label: '湖西鄉' },
  ],
  '21': [ // 金門縣
    { value: '0', label: '金沙鎮' },
    { value: '1', label: '金湖鎮' },
    { value: '2', label: '金寧鄉' },
    { value: '3', label: '金城鎮' },
    { value: '4', label: '烈嶼鄉' },
    { value: '5', label: '烏坵鄉' },
  ],
  '22': [ // 連江縣
    { value: '0', label: '南竿鄉' },
    { value: '1', label: '北竿鄉' },
    { value: '2', label: '莒光鄉' },
    { value: '3', label: '東引鄉' },
  ],
};

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

  // 儲存收件人按鈕
//   document.getElementById('saveReceiver').addEventListener('click', async () => {
//   console.log("getElementById SaveReceiver")
//   const data = getReceiverDataFromForm();
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.tabs.sendMessage(tab.id, {
//     type: 'saveReceiver',
//     data
//   });
// });
// 載入localStorage receiver資料並渲染
document.getElementById('loadReceiver').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { type: 'loadReceivers' }, (response) => {
    renderReceiverList(response?.data || []);
  });
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
        console.log('stream:', stream);
        video.srcObject = stream;
        video.play();
        const codeReader = new ZXing.BrowserQRCodeReader();
        const result = await codeReader.decodeFromVideoElement(video);
        console.log('QR Code 掃描成功:', result.text);
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

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveReceiver");
  const receiverList = document.getElementById("receiverList");

  

  function setReceiverToInputs(data) {
    document.getElementById("receiverName").value = data.name;
    document.getElementById("receiverMobile").value = data.mobile;
    document.getElementById("receiverPhone").value = data.phone;
    document.getElementById("receiverCounty").value = data.county;
    document.getElementById("receiverDistrict").value = data.district;
    document.getElementById("receiverAddress").value = data.address;
  }

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

function renderReceiverList(receivers) {
  const list = document.getElementById('receiverList');
  list.innerHTML = '';

  receivers.forEach((r, index) => {
    const div = document.createElement('div');
    div.style.marginBottom = '8px';

    const info = document.createElement('span');
    info.textContent = `${r.name} - ${r.county}${r.district}${r.address} (${r.mobile || r.phone})`;
    div.appendChild(info);

    const editBtn = document.createElement('button');
    editBtn.textContent = '編輯';
    editBtn.style.marginLeft = '8px';
    editBtn.onclick = () => {
      // 將資料填入表單
      document.getElementById('receiverName').value = r.name;
      document.getElementById('receiverMobile').value = r.mobile || '';
      document.getElementById('receiverPhone').value = r.phone || '';
      document.getElementById('receiverCounty').value = r.county;
      document.getElementById('receiverDistrict').value = r.district;
      document.getElementById('receiverAddress').value = r.address;

      // 編輯完成後先刪除原資料
      receivers.splice(index, 1);
      localStorage.setItem('receivers', JSON.stringify(receivers));
      renderReceiverList(receivers);
    };
    div.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '刪除';
    deleteBtn.style.marginLeft = '4px';
    deleteBtn.onclick = () => {
      receivers.splice(index, 1);
      localStorage.setItem('receivers', JSON.stringify(receivers));
      renderReceiverList(receivers);
    };
    div.appendChild(deleteBtn);

    list.appendChild(div);
  });
}


 // 存收件人資料
  saveBtn.addEventListener("click", saveReceiver);
  // if(fillBtn){
  //   fillBtn.addEventListener("click", () => {
  //   const receiverData = getReceiverDataFromForm();
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.scripting.executeScript({
  //       target: { tabId: tabs[0].id },
  //       func: (data) => {
  //         document.querySelector("#input-51").value = data.name;
  //         document.querySelector("#input-54").value = data.mobile;
  //         document.querySelector("#input-57").value = data.phone;
  //         // 地址的 select 欄位需自行處理（依地區下拉順序選擇）
  //         // 如有需要可以傳送整筆資料並用 options 內文字選擇
  //       },
  //       args: [receiverData],
  //     });
  //   });
  // });
  // }
// 取得localStorage資料  
function getReceiversFromPage(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'getReceivers' }, (response) => {
      if (Array.isArray(response)) {
        callback(response);
      }
    });
  });
}
  // 呼叫後畫面顯示
getReceiversFromPage(renderReceiverList);
});

