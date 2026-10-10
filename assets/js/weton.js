const DAY_NEPTU = {
  Minggu: 5,
  Senin: 4,
  Selasa: 3,
  Rabu: 7,
  Kamis: 8,
  Jumat: 6,
  Sabtu: 9,
};

const PASARAN_NEPTU = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
};

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PASARAN_NAMES = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
const PASARAN_REFERENCE_DATE = new Date(Date.UTC(1945, 7, 17));

const CATEGORY_META = {
  1: {
    key: "kurang-baik",
    label: "Suku",
    status: "Kurang Baik",
    description: "Hewan cenderung aktif dan suka berjalan, tetapi berisiko kurus atau kurang produktif.",
  },
  2: {
    key: "kurang-baik",
    label: "Watu",
    status: "Kurang Baik",
    description: "Ternak cenderung statis dan sulit berkembang; tubuh tidak lekas besar dan rezeki seret.",
  },
  3: {
    key: "sangat-baik",
    label: "Gajah",
    status: "Sangat Baik",
    description: "Ternak berpotensi tumbuh besar, gemuk, sehat, serta mendatangkan rezeki yang stabil.",
  },
  4: {
    key: "tidak-baik",
    label: "Buto",
    status: "Tidak Baik",
    description: "Ternak cenderung makan banyak atau rakus, rawan terserang penyakit, dan berisiko rugi.",
  },
  5: {
    key: "sangat-baik",
    label: "Ratu",
    status: "Sangat Baik (Istimewa)",
    description: "Ternak berpotensi cepat gemuk dan mudah berkembang biak, serta membawa keberuntungan besar.",
  },
};

const TRANSACTION_PRIORITIES = {
  "Beli Bakalan": {
    remainders: [3, 5],
    preferred: "Gajah atau Ratu",
    focus: "Pertumbuhan dan penggemukan ternak.",
  },
  "Beli Indukan": {
    remainders: [5],
    preferred: "Ratu",
    focus: "Kesuburan dan perkembangan reproduksi.",
  },
  "Beli Pejantan": {
    remainders: [3],
    preferred: "Gajah",
    focus: "Postur, rangka besar, dan stamina pejantan.",
  },
  "Jual Ternak / Panen": {
    remainders: [5, 3],
    preferred: "Ratu atau Gajah",
    focus: "Kelancaran pembayaran, margin, dan kepuasan bobot.",
  },
  "TTD Kontrak B2B / Kemitraan": {
    remainders: [5],
    preferred: "Ratu",
    focus: "Hari perjanjian; utamakan Weton Ratu dan Feng Shui Lucky.",
  },
};

function toDateObject(dateInput) {
  if (dateInput instanceof Date) {
    if (Number.isNaN(dateInput.getTime())) {
      throw new TypeError("Tanggal weton tidak valid.");
    }
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
  }
  if (typeof dateInput === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput);
    if (!match) {
      throw new TypeError("Tanggal weton harus menggunakan format YYYY-MM-DD.");
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new TypeError("Tanggal weton harus menggunakan tanggal Masehi yang valid.");
    }
    return date;
  }
  if (typeof dateInput === "number") {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) {
      throw new TypeError("Tanggal weton tidak valid.");
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  throw new TypeError("Masukkan tanggal sebagai string YYYY-MM-DD atau objek Date.");
}

function getPasaranName(dateInput) {
  const date = toDateObject(dateInput);
  const diffDays = Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      PASARAN_REFERENCE_DATE.getTime()) / 86400000,
  );
  const pasaranIndex =
    ((diffDays % PASARAN_NAMES.length) + PASARAN_NAMES.length) % PASARAN_NAMES.length;
  return PASARAN_NAMES[pasaranIndex];
}

function getWeton(dateInput) {
  const date = toDateObject(dateInput);
  const dayName = DAY_NAMES[date.getDay()];
  const pasaranName = getPasaranName(date);
  const totalNeptu = DAY_NEPTU[dayName] + PASARAN_NEPTU[pasaranName];
  const remainder = totalNeptu % 5 === 0 ? 5 : totalNeptu % 5;
  const meta = CATEGORY_META[remainder];

  return {
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    dayName,
    pasaranName,
    wetonName: `${dayName} ${pasaranName}`,
    totalNeptu,
    remainder,
    meta,
    status: meta.status,
    categoryKey: meta.key,
  };
}

function getTransactionPriority(weton, activity = "Beli Bakalan") {
  const legacyActivities = {
    "Jual Fattening": "Jual Ternak / Panen",
    "Tanda Tangan Kontrak B2B": "TTD Kontrak B2B / Kemitraan",
  };
  const priority =
    TRANSACTION_PRIORITIES[activity]
    ?? TRANSACTION_PRIORITIES[legacyActivities[activity]]
    ?? TRANSACTION_PRIORITIES["Beli Bakalan"];
  const isPriority = priority.remainders.includes(weton.remainder);
  return {
    isPriority,
    preferred: priority.preferred,
    focus: priority.focus,
    message: isPriority
      ? `Sesuai prioritas ${activity}: Panca Sudha ${weton.meta.label}. ${priority.focus}`
      : `Bukan prioritas utama untuk ${activity}. Utamakan Panca Sudha ${priority.preferred}. ${priority.focus}`,
  };
}

function getMonthRecommendationDates(year, monthIndex) {
  const dates = [];
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  for (let day = 1; day <= lastDay; day += 1) {
    if (getWeton(new Date(year, monthIndex, day)).categoryKey === "sangat-baik") {
      dates.push(day);
    }
  }
  return dates;
}

export {
  DAY_NAMES,
  PASARAN_NAMES,
  DAY_NEPTU,
  PASARAN_NEPTU,
  CATEGORY_META,
  TRANSACTION_PRIORITIES,
  getWeton,
  getTransactionPriority,
  getMonthRecommendationDates,
};
