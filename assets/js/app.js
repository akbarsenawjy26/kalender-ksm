import { getTransactionPriority, getWeton } from "./weton.js";
import { getCollectiveResult, getFengShuiStatus } from "./fengShui.js";

const dateInput = document.getElementById("dateInput");
const activityInput = document.getElementById("activityInput");
const dayInsightsDialog = document.getElementById("dayInsightsDialog");
const dialogDateTitleEl = document.getElementById("dialogDateTitle");
const collectiveResultEl = document.getElementById("collectiveResult");
const collectiveResultLabelEl = document.getElementById("collectiveResultLabel");
const collectiveStatusEl = document.getElementById("collectiveStatus");
const collectiveExplanationEl = document.getElementById("collectiveExplanation");
const shareDialog = document.getElementById("shareDialog");
const shareDateEl = document.getElementById("shareDate");
const shareActivityEl = document.getElementById("shareActivity");
const shareOverallEl = document.getElementById("shareOverall");
const shareOverallStatusEl = document.getElementById("shareOverallStatus");
const shareWetonEl = document.getElementById("shareWeton");
const shareWetonDetailEl = document.getElementById("shareWetonDetail");
const shareFengShuiEl = document.getElementById("shareFengShui");
const shareFengShuiDetailEl = document.getElementById("shareFengShuiDetail");
const shareFeedbackEl = document.getElementById("shareFeedback");
const openShareBtn = document.getElementById("openShareBtn");
const nativeShareBtn = document.getElementById("nativeShareBtn");
const copyShareBtn = document.getElementById("copyShareBtn");
const downloadShareBtn = document.getElementById("downloadShareBtn");
const wetonNameEl = document.getElementById("wetonName");
const wetonStatusEl = document.getElementById("wetonStatus");
const totalNeptuEl = document.getElementById("totalNeptu");
const sisaNeptuEl = document.getElementById("sisaNeptu");
const wetonCategoryEl = document.getElementById("wetonCategory");
const wetonDescriptionEl = document.getElementById("wetonDescription");
const wetonPriorityStatusEl = document.getElementById("wetonPriorityStatus");
const wetonPriorityDescriptionEl = document.getElementById("wetonPriorityDescription");
const fengShuiStatusEl = document.getElementById("fengShuiStatus");
const fengShuiActivityEl = document.getElementById("fengShuiActivity");
const selectedActivityLabelEl = document.getElementById("selectedActivityLabel");
const lunarDateEl = document.getElementById("lunarDate");
const lunarGanZhiEl = document.getElementById("lunarGanZhi");
const lunarZodiacEl = document.getElementById("lunarZodiac");
const recommendedListEl = document.getElementById("recommendedList");
const avoidedListEl = document.getElementById("avoidedList");
const generalRestrictionEl = document.getElementById("generalRestriction");
const monthLabelEl = document.getElementById("monthLabel");
const calendarGridEl = document.getElementById("calendarGrid");
const calendarSummaryEl = document.getElementById("calendarSummary");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const calendarFilters = document.querySelectorAll("[data-filter]");

let activeFilter = "all";
let currentShareData;

function formatDateValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getStatusClass(status) {
  if (status === "Lucky Day") {
    return "status-pill status-lucky";
  }
  if (status === "Ordinary Day") {
    return "status-pill status-ordinary-feng";
  }
  if (status === "Unlucky Day") {
    return "status-pill status-unlucky";
  }
  if (status === "Sangat Baik" || status === "Sangat Baik (Istimewa)" || status === "Good Day") {
    return "status-pill status-good";
  }
  if (status === "Dihindari" || status === "Tidak Baik" || status === "Kurang Baik" || status === "Avoid Day") {
    if (status === "Kurang Baik") return "status-pill status-caution";
    return "status-pill status-avoid";
  }
  if (status === "Super Golden Day") {
    return "status-pill status-golden";
  }
  return "status-pill status-ordinary";
}

function renderInsights(dateValue) {
  const weton = getWeton(dateValue);
  const activity = activityInput.value;
  const fengShui = getFengShuiStatus(dateValue, activity);
  const priority = getTransactionPriority(weton, activity);
  const collective = getCollectiveResult(weton, fengShui, activity);

  wetonNameEl.textContent = weton.wetonName;
  wetonStatusEl.textContent = weton.meta.status;
  wetonStatusEl.className = getStatusClass(weton.meta.status);
  totalNeptuEl.textContent = weton.totalNeptu;
  sisaNeptuEl.textContent = weton.remainder;
  wetonCategoryEl.textContent = `Panca Sudha ${weton.meta.label} · sisa ${weton.remainder}`;
  wetonPriorityStatusEl.textContent = priority.isPriority ? "Prioritas utama hajat" : "Bukan prioritas utama hajat";
  wetonPriorityDescriptionEl.textContent = priority.message;
  wetonPriorityStatusEl.className = priority.isPriority ? "priority-pill is-priority" : "priority-pill";
  wetonDescriptionEl.textContent = weton.meta.description;
  collectiveStatusEl.textContent = collective.label;
  collectiveStatusEl.className = `collective-result-status status-${collective.key}`;
  collectiveExplanationEl.textContent = collective.description;
  collectiveResultLabelEl.textContent =
    `Skor tertimbang ${collective.score}/100 · Weton ${collective.primaryWeight}% + Feng Shui ${collective.secondaryWeight}%`;
  collectiveResultEl.className = `collective-result collective-result-${collective.key}`;

  fengShuiStatusEl.textContent = fengShui.status;
  fengShuiStatusEl.className = getStatusClass(fengShui.status);
  selectedActivityLabelEl.textContent = activity;
  fengShuiActivityEl.textContent = fengShui.basis;
  lunarDateEl.textContent = fengShui.lunarDate;
  lunarGanZhiEl.textContent = `Hari ${fengShui.dayGanZhi} · Tahun ${fengShui.yearGanZhi}`;
  lunarZodiacEl.textContent = `Shio ${fengShui.zodiac} · ${fengShui.dayOfficer} (${fengShui.dayOfficerType})`;
  recommendedListEl.textContent = fengShui.dayYi.join(", ");
  avoidedListEl.textContent = fengShui.dayJi.join(", ");
  generalRestrictionEl.hidden = fengShui.generalRestrictions.length === 0;
  generalRestrictionEl.textContent = fengShui.generalRestrictions.join(". ");

  dialogDateTitleEl.textContent = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}

function getShareData() {
  const dateValue = dateInput.value;
  const weton = getWeton(dateValue);
  const activity = activityInput.value;
  const fengShui = getFengShuiStatus(dateValue, activity);
  const collective = getCollectiveResult(weton, fengShui, activity);
  const priority = getTransactionPriority(weton, activity);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
  const shareUrl = new URL(window.location.href);
  shareUrl.search = "";
  shareUrl.searchParams.set("tanggal", dateValue);
  shareUrl.searchParams.set("hajat", activity);

  return { dateValue, formattedDate, activity, weton, fengShui, collective, priority, shareUrl: shareUrl.toString() };
}

function buildShareText(data) {
  return [
    `🐐 Kandang Sena Mulya · Rencana Transaksi Ternak`,
    `Tanggal: ${data.formattedDate}`,
    `Hajat: ${data.activity}`,
    `Rekomendasi gabungan: ${data.collective.label} · skor ${data.collective.score}/100 (Weton ${data.collective.primaryWeight}%, Feng Shui ${data.collective.secondaryWeight}%)`,
    `Panca Sudha: ${data.weton.wetonName} · ${data.weton.meta.label} (${data.weton.meta.status}) · total neptu ${data.weton.totalNeptu}`,
    `Prioritas hajat: ${data.priority.isPriority ? "Ya" : "Bukan prioritas utama"} · ${data.priority.message}`,
    `Feng Shui: ${data.fengShui.status} · ${data.fengShui.dayGanZhi} · Shio ${data.fengShui.zodiac}`,
    `Penilaian hajat: ${data.fengShui.basis}`,
    `Panduan tradisi untuk bahan pertimbangan, bukan jaminan hasil bisnis.`,
    `Lihat kalender dan rincian: ${data.shareUrl}`,
  ].join("\n");
}

function renderSharePreview() {
  currentShareData = getShareData();
  const { weton, fengShui, collective } = currentShareData;
  shareDateEl.textContent = currentShareData.formattedDate;
  shareActivityEl.textContent = currentShareData.activity;
  shareOverallStatusEl.textContent = collective.label;
  shareOverallEl.className = `share-overall share-overall-${collective.key}`;
  shareWetonEl.textContent = `${weton.wetonName} · ${weton.meta.label}`;
  shareWetonDetailEl.textContent =
    `${weton.meta.status} · sisa ${weton.remainder} · neptu ${weton.totalNeptu}. ${currentShareData.priority.message}`;
  shareFengShuiEl.textContent = fengShui.status;
  shareFengShuiDetailEl.textContent =
    `${fengShui.dayGanZhi} · Shio ${fengShui.zodiac}. ${fengShui.basis}`;
  shareFeedbackEl.textContent = "";
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.split(/\s+/);
  let line = "";
  let lines = 0;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, y);
      y += lineHeight;
      lines += 1;
      line = word;
      if (lines >= maxLines) {
        context.fillText(`${line}…`, x, y);
        return y + lineHeight;
      }
    } else {
      line = candidate;
    }
  }

  if (line) {
    context.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function createShareImage(data) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Browser tidak mendukung pembuatan gambar.");

  context.fillStyle = "#faf7f0";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawRoundedRect(context, 54, 54, 972, 1242, 34);
  context.fillStyle = "#fffefb";
  context.fill();

  const logo = document.querySelector(".brand-logo");
  if (logo?.complete && logo.naturalWidth > 0) {
    drawRoundedRect(context, 104, 104, 112, 112, 20);
    context.save();
    context.clip();
    context.drawImage(logo, 104, 104, 112, 112);
    context.restore();
  }

  context.fillStyle = "#321a18";
  context.font = "700 32px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("Kandang Sena Mulya", 244, 148);
  context.fillStyle = "#796b61";
  context.font = "20px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("Data-Driven & Traditional Wisdom Farming", 244, 184);
  context.fillStyle = "#e9e1d5";
  context.fillRect(104, 254, 872, 2);

  context.fillStyle = "#632320";
  context.font = "700 18px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("RINGKASAN TANGGAL TRANSAKSI", 104, 322);
  context.fillStyle = "#321a18";
  context.font = "700 48px -apple-system, BlinkMacSystemFont, sans-serif";
  const dateEndY = drawWrappedText(context, data.formattedDate, 104, 386, 872, 56, 1, 2);
  context.fillStyle = "#796b61";
  context.font = "24px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText(`Hajat: ${data.activity}`, 104, dateEndY + 4);

  drawRoundedRect(context, 104, dateEndY + 34, 872, 100, 20);
  context.fillStyle = data.collective.key === "super-golden" || data.collective.key === "golden"
    ? "#fbf2dc"
    : data.collective.key === "avoid" ? "#fbefed" : "#edf5ef";
  context.fill();
  context.fillStyle = "#796b61";
  context.font = "700 16px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText(`REKOMENDASI GABUNGAN · SKOR ${data.collective.score}/100`, 132, dateEndY + 70);
  context.fillStyle = data.collective.key === "super-golden" || data.collective.key === "golden"
    ? "#876019"
    : data.collective.key === "avoid" ? "#9b4a42" : "#32674e";
  context.font = "700 28px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText(data.collective.label, 132, dateEndY + 110);

  const sectionTop = dateEndY + 198;
  context.fillStyle = "#632320";
  context.font = "700 18px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("PANCA SUDHA TERNAK", 104, sectionTop);
  context.fillStyle = "#321a18";
  context.font = "700 30px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText(`${data.weton.wetonName} · ${data.weton.meta.label}`, 104, sectionTop + 52);
  context.fillStyle = "#796b61";
  context.font = "22px -apple-system, BlinkMacSystemFont, sans-serif";
  let y = drawWrappedText(
    context,
    `${data.weton.meta.status} · sisa ${data.weton.remainder} · neptu ${data.weton.totalNeptu}. ${data.priority.message}`,
    104,
    sectionTop + 92,
    850,
    32,
    3,
  );

  context.fillStyle = "#e9e1d5";
  context.fillRect(104, y + 8, 872, 2);
  y += 62;
  context.fillStyle = "#632320";
  context.font = "700 18px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("FENG SHUI TIONGHOA", 104, y);
  context.fillStyle = "#321a18";
  context.font = "700 30px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText(data.fengShui.status, 104, y + 52);
  context.fillStyle = "#796b61";
  context.font = "22px -apple-system, BlinkMacSystemFont, sans-serif";
  y = drawWrappedText(
    context,
    `${data.fengShui.dayGanZhi} · Shio ${data.fengShui.zodiac}. ${data.fengShui.basis}`,
    104,
    y + 92,
    850,
    32,
    3,
  );

  context.fillStyle = "#e9e1d5";
  context.fillRect(104, 1160, 872, 2);
  context.fillStyle = "#796b61";
  context.font = "18px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("Panduan tradisi untuk bahan pertimbangan, bukan jaminan hasil bisnis.", 104, 1204);
  context.fillStyle = "#632320";
  context.font = "700 18px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("Kandang Sena Mulya · Blitar", 104, 1248);

  return canvas;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = text;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.append(temporaryInput);
  temporaryInput.select();
  const copied = document.execCommand("copy");
  temporaryInput.remove();
  if (!copied) throw new Error("Browser tidak mengizinkan penyalinan otomatis.");
}

async function shareCurrentResult() {
  if (!currentShareData) return;
  const text = buildShareText(currentShareData);
  if (navigator.share) {
    try {
      await navigator.share({ title: "Rencana Transaksi Ternak · Kandang Sena Mulya", text });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      shareFeedbackEl.textContent = "Hasil tidak berhasil dibagikan. Silakan salin ringkasan atau unduh kartu.";
      console.error(error);
    }
    return;
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

async function downloadShareImage() {
  try {
    const canvas = createShareImage(currentShareData);
    const imageBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Gambar tidak dapat dibuat."));
      }, "image/png");
    });
    const imageUrl = URL.createObjectURL(imageBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `kandang-sena-mulya-${currentShareData.dateValue}.png`;
    downloadLink.click();
    URL.revokeObjectURL(imageUrl);
    shareFeedbackEl.textContent = "Kartu PNG berhasil diunduh.";
  } catch (error) {
    shareFeedbackEl.textContent = error instanceof Error ? error.message : "Gagal membuat kartu gambar.";
    console.error(error);
  }
}

function matchesFilter(weton, fengShui, activity) {
  if (activeFilter === "super-golden") {
    return getCollectiveResult(weton, fengShui, activity).key === "super-golden";
  }
  if (activeFilter === "weton-baik") {
    return weton.categoryKey === "sangat-baik";
  }
  if (activeFilter === "lunar-lucky") {
    return fengShui.status === "Lucky Day";
  }
  return true;
}

function renderCalendar(dateValue) {
  const selectedDate = new Date(`${dateValue}T00:00:00`);
  const monthIndex = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const totalDays = lastDayOfMonth.getDate();
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;
  const activity = activityInput.value;
  let superGoldenDays = 0;
  let wetonGoodDays = 0;
  let lunarLuckyDays = 0;

  monthLabelEl.textContent = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(selectedDate);
  calendarGridEl.innerHTML = "";

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, monthIndex, day);
    const dateValueInMonth = formatDateValue(date);
    const weton = getWeton(date);
    const fengShui = getFengShuiStatus(dateValueInMonth, activity);
    if (weton.categoryKey === "sangat-baik") wetonGoodDays += 1;
    if (fengShui.status === "Lucky Day") lunarLuckyDays += 1;
    if (getCollectiveResult(weton, fengShui, activity).key === "super-golden") superGoldenDays += 1;
  }

  calendarSummaryEl.textContent =
    `${superGoldenDays} Super Golden · ${wetonGoodDays} hari baik Jawa · ${lunarLuckyDays} hari baik Tionghoa`;

  for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
    const dayNumber = cellIndex - startOffset + 1;
    const cellDate = new Date(year, monthIndex, dayNumber);
    const isOtherMonth = dayNumber < 1 || dayNumber > totalDays;
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-day";

    if (isOtherMonth) {
      cell.classList.add("is-other-month");
      cell.disabled = true;
    } else {
      const cellDateValue = formatDateValue(cellDate);
      const weton = getWeton(cellDate);
      const fengShui = getFengShuiStatus(cellDateValue, activity);
      const collective = getCollectiveResult(weton, fengShui, activity);
      const isSuperGolden = collective.key === "super-golden";
      const filteredOut = !matchesFilter(weton, fengShui, activity);

      if (isSuperGolden) {
        cell.classList.add("is-super-golden");
      } else if (weton.categoryKey === "sangat-baik") {
        cell.classList.add("is-good");
      } else if (weton.categoryKey === "kurang-baik") {
        cell.classList.add("is-caution");
      } else if (weton.categoryKey === "kurang-disarankan") {
        cell.classList.add("is-caution");
      } else {
        cell.classList.add("is-avoid");
      }
      if (fengShui.status === "Unlucky Day") cell.classList.add("has-lunar-unlucky");
      if (fengShui.status === "Lucky Day") cell.classList.add("has-lunar-lucky");
      if (fengShui.status === "Ordinary Day") cell.classList.add("has-lunar-ordinary");

      if (filteredOut) {
        cell.classList.add("is-filtered-out");
        cell.disabled = true;
        cell.setAttribute("aria-hidden", "true");
      } else {
        cell.setAttribute(
          "aria-label",
          `${new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(cellDate)}, ${weton.wetonName}, Panca Sudha ${weton.meta.label}, Feng Shui ${fengShui.status}, ${collective.label}`,
        );
      }

      if (cellDate.toDateString() === selectedDate.toDateString()) {
        cell.classList.add("is-selected");
      }
      cell.addEventListener("click", () => {
        dateInput.value = cellDateValue;
        renderInsights(cellDateValue);
        renderCalendar(cellDateValue);
        dayInsightsDialog.showModal();
      });
    }

    const dayLabel = document.createElement("span");
    dayLabel.className = "day-number";
    dayLabel.textContent = isOtherMonth ? "" : dayNumber;
    const mark = document.createElement("span");
    mark.className = "day-mark";
    if (!isOtherMonth) {
      const dateValueInCell = formatDateValue(cellDate);
      const weton = getWeton(cellDate);
      const fengShui = getFengShuiStatus(dateValueInCell, activity);
      const isSuperGolden = getCollectiveResult(weton, fengShui, activity).key === "super-golden";
      const lunarLabel = isSuperGolden ? "★ Super Golden" : fengShui.status.replace(" Day", "");
      mark.textContent = `${weton.meta.label}\n${lunarLabel}`;
      mark.setAttribute("aria-hidden", "true");
    }
    cell.append(dayLabel, mark);
    calendarGridEl.appendChild(cell);
  }
}

function updateView(dateValue) {
  if (!dateValue) return;
  renderInsights(dateValue);
  renderCalendar(dateValue);
}

function shiftMonth(delta) {
  const currentDate = new Date(`${dateInput.value || formatDateValue(new Date())}T00:00:00`);
  const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
  dateInput.value = formatDateValue(targetDate);
  updateView(dateInput.value);
}

function showLoadError(message) {
  calendarSummaryEl.textContent = `Data aplikasi gagal dimuat: ${message}`;
}

function initialize() {
  try {
    const query = new URLSearchParams(window.location.search);
    const sharedDate = query.get("tanggal");
    const sharedActivity = query.get("hajat");
    const validSharedDate = sharedDate && /^\d{4}-\d{2}-\d{2}$/.test(sharedDate)
      && !Number.isNaN(new Date(`${sharedDate}T00:00:00`).getTime())
      && formatDateValue(new Date(`${sharedDate}T00:00:00`)) === sharedDate;
    dateInput.value = validSharedDate ? sharedDate : formatDateValue(new Date());
    const legacyActivities = {
      "Jual Fattening": "Jual Ternak / Panen",
      "Tanda Tangan Kontrak B2B": "TTD Kontrak B2B / Kemitraan",
    };
    const normalizedActivity = legacyActivities[sharedActivity] ?? sharedActivity;
    if (normalizedActivity && [...activityInput.options].some((option) => option.value === normalizedActivity)) {
      activityInput.value = normalizedActivity;
    }
    updateView(dateInput.value);

    dateInput.addEventListener("change", () => updateView(dateInput.value));
    activityInput.addEventListener("change", () => updateView(dateInput.value));
    openShareBtn.addEventListener("click", () => {
      renderSharePreview();
      shareDialog.showModal();
    });
    nativeShareBtn.addEventListener("click", shareCurrentResult);
    copyShareBtn.addEventListener("click", async () => {
      try {
        await copyText(buildShareText(currentShareData));
        shareFeedbackEl.textContent = "Ringkasan berhasil disalin.";
      } catch (error) {
        shareFeedbackEl.textContent = error instanceof Error ? error.message : "Gagal menyalin ringkasan.";
        console.error(error);
      }
    });
    downloadShareBtn.addEventListener("click", downloadShareImage);
    prevMonthBtn.addEventListener("click", () => shiftMonth(-1));
    nextMonthBtn.addEventListener("click", () => shiftMonth(1));
    calendarFilters.forEach((filterButton) => {
      filterButton.addEventListener("click", () => {
        activeFilter = filterButton.dataset.filter;
        calendarFilters.forEach((button) => {
          const isActive = button === filterButton;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
        renderCalendar(dateInput.value);
      });
    });
  } catch (error) {
    console.error(error);
    showLoadError(error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.");
  }
}

initialize();
