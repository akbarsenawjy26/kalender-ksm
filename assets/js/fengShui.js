import { Solar } from "lunar-javascript";

const ACTIVITY_TERMS = {
  "Beli Bakalan": ["纳畜", "牧养", "纳财", "交易"],
  "Beli Indukan": ["纳畜", "牧养", "纳财", "交易"],
  "Beli Pejantan": ["纳畜", "牧养", "纳财", "交易"],
  "Jual Fattening": ["交易", "立券", "开市", "纳财"],
  "Jual Ternak / Panen": ["交易", "立券", "开市", "纳财"],
  "Tanda Tangan Kontrak B2B": ["立券", "交易", "订盟"],
  "TTD Kontrak B2B / Kemitraan": ["立券", "交易", "订盟"],
};

const GENERAL_RESTRICTIONS = new Set(["诸事不宜", "馀事勿取"]);

const STEMS = {
  甲: { name: "Jia", element: "Kayu Yang" },
  乙: { name: "Yi", element: "Kayu Yin" },
  丙: { name: "Bing", element: "Api Yang" },
  丁: { name: "Ding", element: "Api Yin" },
  戊: { name: "Wu", element: "Tanah Yang" },
  己: { name: "Ji", element: "Tanah Yin" },
  庚: { name: "Geng", element: "Logam Yang" },
  辛: { name: "Xin", element: "Logam Yin" },
  壬: { name: "Ren", element: "Air Yang" },
  癸: { name: "Gui", element: "Air Yin" },
};

const BRANCHES = {
  子: { name: "Zi", animal: "Tikus" },
  丑: { name: "Chou", animal: "Kerbau" },
  寅: { name: "Yin", animal: "Harimau" },
  卯: { name: "Mao", animal: "Kelinci" },
  辰: { name: "Chen", animal: "Naga" },
  巳: { name: "Si", animal: "Ular" },
  午: { name: "Wu", animal: "Kuda" },
  未: { name: "Wei", animal: "Kambing" },
  申: { name: "Shen", animal: "Monyet" },
  酉: { name: "You", animal: "Ayam" },
  戌: { name: "Xu", animal: "Anjing" },
  亥: { name: "Hai", animal: "Babi" },
};

const ACTIVITIES_ID = {
  上梁: "Pemasangan balok utama",
  乘船: "Bepergian dengan kapal",
  习艺: "Belajar keterampilan",
  交易: "Transaksi",
  伐木: "Penebangan kayu",
  会亲友: "Bertemu kerabat atau rekan",
  作梁: "Pembuatan balok",
  作灶: "Pembuatan tungku",
  修坟: "Perbaikan makam",
  修造: "Renovasi atau pembangunan",
  修门: "Perbaikan pintu",
  修饰垣墙: "Perbaikan pagar atau dinding",
  入学: "Memulai pendidikan",
  入宅: "Memasuki rumah baru",
  入殓: "Memasukkan jenazah ke peti",
  冠笄: "Upacara kedewasaan",
  出火: "Memindahkan api atau tungku",
  出行: "Perjalanan",
  出货财: "Pengeluaran barang atau dana",
  分居: "Berpisah tempat tinggal",
  割蜜: "Panen madu",
  动土: "Memulai pekerjaan tanah",
  取渔: "Menangkap ikan",
  合寿木: "Pembuatan peti jenazah",
  合帐: "Pemasangan tirai ranjang",
  合脊: "Pemasangan bubungan atap",
  启钻: "Pemindahan makam",
  坏垣: "Pembongkaran pagar atau dinding",
  塑绘: "Pembuatan patung atau lukisan",
  塞穴: "Menutup lubang",
  嫁娶: "Pernikahan",
  安床: "Pemasangan ranjang",
  安机械: "Pemasangan mesin",
  安碓磑: "Pemasangan alat penggiling",
  安葬: "Pemakaman",
  安门: "Pemasangan pintu",
  安香: "Pemasangan altar dupa",
  定磉: "Pemasangan fondasi bangunan",
  平治道涂: "Perbaikan jalan",
  开仓: "Pembukaan gudang",
  开光: "Pemberkatan benda ritual",
  开厕: "Pembangunan toilet",
  开市: "Pembukaan usaha atau pasar",
  开柱眼: "Pembuatan lubang tiang",
  开池: "Pembuatan kolam",
  开渠: "Pembuatan saluran",
  开生坟: "Pembuatan makam",
  归宁: "Kunjungan setelah pernikahan",
  归岫: "Kembali ke tempat asal",
  成服: "Mengenakan pakaian berkabung",
  扫舍: "Membersihkan rumah",
  拆卸: "Pembongkaran",
  挂匾: "Pemasangan papan nama",
  捕捉: "Menangkap hewan",
  掘井: "Menggali sumur",
  探病: "Menjenguk orang sakit",
  放水: "Pengaliran air",
  教牛马: "Melatih hewan ternak",
  整手足甲: "Perawatan kuku",
  斋醮: "Ritual keagamaan",
  断蚁: "Pengendalian semut",
  无: "Tidak ada",
  普渡: "Ritual doa umum",
  架马: "Pemasangan rangka penyangga",
  栽种: "Penanaman",
  求医: "Berobat",
  求嗣: "Memohon keturunan",
  沐浴: "Mandi atau bersuci",
  治病: "Pengobatan",
  牧养: "Memelihara ternak",
  理发: "Potong rambut",
  畋猎: "Berburu",
  盖屋: "Pembangunan atap",
  破土: "Penggalian tanah",
  破屋: "Pembongkaran rumah",
  祈福: "Doa memohon berkah",
  祭祀: "Ritual penghormatan leluhur",
  移徙: "Pindah tempat tinggal",
  移柩: "Pemindahan peti jenazah",
  立券: "Pembuatan atau penandatanganan kontrak",
  立碑: "Pemasangan prasasti atau nisan",
  竖柱: "Pemasangan tiang",
  筑堤: "Pembangunan tanggul",
  纳婿: "Penerimaan menantu",
  纳畜: "Penerimaan atau pembelian ternak",
  纳财: "Penerimaan atau pengelolaan harta",
  纳采: "Lamaran pernikahan",
  经络: "Pemasangan rangka bangunan",
  结网: "Pembuatan jaring",
  置产: "Pembelian properti",
  行丧: "Prosesi pemakaman",
  补垣: "Perbaikan pagar atau dinding",
  裁衣: "Menjahit pakaian",
  解除: "Pelepasan pantangan",
  订盟: "Perjanjian atau kesepakatan",
  词讼: "Perkara hukum",
  诸事不宜: "Tidak disarankan melakukan berbagai kegiatan",
  谢土: "Ritual setelah pekerjaan tanah",
  赴任: "Mulai menjalankan jabatan",
  起基: "Pembuatan fondasi",
  进人口: "Menerima anggota keluarga",
  造仓: "Pembangunan gudang",
  造庙: "Pembangunan tempat ibadah",
  造桥: "Pembangunan jembatan",
  造畜稠: "Pembangunan kandang ternak",
  造船: "Pembuatan kapal",
  造车器: "Pembuatan kendaraan",
  酬神: "Ritual penghormatan dewa",
  针灸: "Akupunktur",
  问名: "Pertukaran nama dalam lamaran",
  除服: "Melepas pakaian berkabung",
  雇佣: "Perekrutan pekerja",
  雕刻: "Pahatan",
  馀事勿取: "Hindari kegiatan lain di luar daftar anjuran",
};

const ZODIAC = Object.fromEntries(
  Object.values(BRANCHES).map(({ name, animal }) => [name, animal]),
);
const DAY_OFFICERS = {
  勾陈: "Gou Chen",
  司命: "Si Ming",
  天刑: "Tian Xing",
  天德: "Tian De",
  天牢: "Tian Lao",
  明堂: "Ming Tang",
  朱雀: "Zhu Que",
  玄武: "Xuan Wu",
  玉堂: "Yu Tang",
  白虎: "Bai Hu",
  金匮: "Jin Kui",
  青龙: "Qing Long",
};

function toLunar(dateInput) {
  let year;
  let month;
  let day;

  if (dateInput instanceof Date) {
    if (Number.isNaN(dateInput.getTime())) {
      throw new TypeError("Tanggal Feng Shui tidak valid.");
    }
    year = dateInput.getFullYear();
    month = dateInput.getMonth() + 1;
    day = dateInput.getDate();
  } else if (typeof dateInput === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput);
    if (!match) {
      throw new TypeError("Tanggal Feng Shui harus menggunakan format YYYY-MM-DD.");
    }
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
    const checkDate = new Date(Date.UTC(year, month - 1, day));
    if (
      checkDate.getUTCFullYear() !== year ||
      checkDate.getUTCMonth() !== month - 1 ||
      checkDate.getUTCDate() !== day
    ) {
      throw new TypeError("Tanggal Feng Shui harus berupa tanggal Masehi yang valid.");
    }
  } else {
    throw new TypeError("Masukkan tanggal sebagai string YYYY-MM-DD atau objek Date.");
  }

  return Solar.fromYmd(year, month, day).getLunar();
}

function formatStemBranch(stemCharacter, branchCharacter) {
  const stem = STEMS[stemCharacter];
  const branch = BRANCHES[branchCharacter];
  return `${stem.name}-${branch.name} (${stem.element} · ${branch.animal})`;
}

function translateActivities(activities) {
  return activities
    .filter((activity) => activity !== "无" && !GENERAL_RESTRICTIONS.has(activity))
    .map((activity) => ACTIVITIES_ID[activity] ?? "Aktivitas kalender lainnya");
}

function getFengShuiStatus(dateInput, activity = "Beli Bakalan") {
  const lunar = toLunar(dateInput);
  const dayYi = lunar.getDayYi();
  const dayJi = lunar.getDayJi();
  const generalRestrictions = dayYi.filter((term) => GENERAL_RESTRICTIONS.has(term));
  const relevantTerms = ACTIVITY_TERMS[activity] ?? ACTIVITY_TERMS["Beli Bakalan"];
  const recommendedTerms = relevantTerms.filter((term) => dayYi.includes(term));
  const avoidedTerms = relevantTerms.filter((term) => dayJi.includes(term));
  const dayOfficer = lunar.getDayTianShen();
  const dayOfficerType = lunar.getDayTianShenType();
  const dayOfficerLuck = lunar.getDayTianShenLuck();
  const isContractActivity =
    activity === "TTD Kontrak B2B / Kemitraan" || activity === "Tanda Tangan Kontrak B2B";
  let status;
  let basis;

  if (avoidedTerms.length > 0) {
    status = "Unlucky Day";
    basis = `Almanak secara khusus tidak menyarankan aktivitas ini (${translateActivities(avoidedTerms).join(", ")}).`;
  } else if (generalRestrictions.length > 0 && recommendedTerms.length === 0) {
    status = "Unlucky Day";
    basis = "Aktivitas ini tidak tercantum dalam daftar anjuran; Almanak juga memberi catatan untuk menghindari kegiatan lain.";
  } else if (isContractActivity && (dayOfficerType === "黑道" || dayOfficerLuck === "凶")) {
    status = "Unlucky Day";
    basis = `Penanda umum ${DAY_OFFICERS[dayOfficer] ?? "hari"} kurang baik untuk perjanjian.`;
  } else if (isContractActivity && recommendedTerms.length === 0) {
    status = "Ordinary Day";
    basis = "Hari ini tidak mencantumkan penandatanganan kontrak atau perjanjian sebagai anjuran khusus.";
  } else if (dayOfficerType === "黑道" || dayOfficerLuck === "凶") {
    status = "Unlucky Day";
    basis = recommendedTerms.length > 0
      ? `Aktivitas ini tercantum sebagai anjuran, tetapi penanda umum ${DAY_OFFICERS[dayOfficer] ?? "hari"} kurang baik.`
      : `Aktivitas ini tidak tercantum dalam pantangan khusus, tetapi penanda umum ${DAY_OFFICERS[dayOfficer] ?? "hari"} kurang baik.${generalRestrictions.length > 0 ? " Hindari kegiatan lain di luar daftar anjuran." : ""}`;
  } else if (recommendedTerms.length > 0) {
    status = "Lucky Day";
    basis = `Almanak menganjurkan aktivitas ini: ${translateActivities(recommendedTerms).join(", ")}.`;
  } else if (dayOfficerType === "黄道" || dayOfficerLuck === "吉") {
    status = "Lucky Day";
    basis = `Aktivitas ini tidak tercantum secara spesifik; penanda umum ${DAY_OFFICERS[dayOfficer] ?? "hari"} tergolong baik.`;
  } else {
    status = "Ordinary Day";
    basis = "Aktivitas ini tidak tercantum secara spesifik dan tidak ada penanda umum yang kuat.";
  }

  const zodiacBranch = lunar.getYearZhi();
  const zodiac = BRANCHES[zodiacBranch];
  const lunarMonth = lunar.getMonth();
  const formattedDayYi = translateActivities(dayYi);
  const formattedDayJi = translateActivities(dayJi);

  return {
    status,
    activity,
    lunarDate: `Hari ke-${lunar.getDay()} · Bulan ke-${Math.abs(lunarMonth)}${lunarMonth < 0 ? " (kabisat)" : ""} · Tahun ${lunar.getYear()}`,
    dayGanZhi: formatStemBranch(lunar.getDayGan(), lunar.getDayZhi()),
    yearGanZhi: formatStemBranch(lunar.getYearGan(), zodiacBranch),
    zodiac: zodiac.animal,
    dayOfficer: DAY_OFFICERS[dayOfficer] ?? "Penanda hari",
    dayOfficerType: dayOfficerType === "黄道" ? "jalur umum baik" : "jalur umum kurang baik",
    dayOfficerLuck: dayOfficerLuck === "吉" ? "baik" : "kurang baik",
    dayYi: formattedDayYi.length ? formattedDayYi : ["Tidak ada aktivitas khusus yang dianjurkan"],
    dayJi: formattedDayJi.length ? formattedDayJi : ["Tidak ada aktivitas yang dihindari"],
    generalRestrictions: generalRestrictions.map((term) => ACTIVITIES_ID[term]),
    recommendedTerms: translateActivities(recommendedTerms),
    avoidedTerms: translateActivities(avoidedTerms),
    basis,
    source: "lunar-javascript",
  };
}

function getCollectiveResult(weton, fengShuiStatus, activity) {
  const jawaAvoid = weton.categoryKey === "tidak-baik";
  const jawaGood = weton.categoryKey === "sangat-baik";
  const lunarGood = fengShuiStatus.status === "Lucky Day";
  const lunarNeutral = fengShuiStatus.status === "Ordinary Day";
  const weights = { primaryWeight: 70, secondaryWeight: 30 };
  const primaryScore = jawaGood ? 70 : jawaAvoid ? 0 : 35;
  const secondaryScore = lunarGood ? 30 : lunarNeutral ? 15 : 0;
  const score = primaryScore + secondaryScore;
  const scoreDetails = { ...weights, primaryScore, secondaryScore, score };

  if (jawaAvoid) {
    return {
      key: "avoid",
      label: "Avoid Day",
      description: `Weton Jawa ${weton.meta.label} bernilai utama dan berstatus Tidak Baik. Hindari meskipun Feng Shui menunjukkan hari baik.`,
      ...scoreDetails,
    };
  }

  if (jawaGood && lunarGood) {
    return {
      key: "super-golden",
      label: "Super Golden Day",
      description: "Weton Jawa sangat baik dan Almanak Tionghoa memberi sinyal hari baik.",
      ...scoreDetails,
    };
  }

  if (jawaGood && lunarNeutral) {
    return {
      key: "golden",
      label: "Golden Day",
      description: "Weton Jawa sangat baik sebagai acuan utama; Feng Shui bersifat netral.",
      ...scoreDetails,
    };
  }

  if (jawaGood || (weton.categoryKey === "kurang-baik" && lunarGood)) {
    return {
      key: "good",
      label: "Good Day",
      description: jawaGood
        ? "Weton Jawa sangat baik sebagai acuan utama; Feng Shui kurang baik tetapi tidak membatalkan rekomendasi Jawa."
        : "Feng Shui memberi booster positif pada Weton Jawa yang kurang baik.",
      ...scoreDetails,
    };
  }

  return {
    key: "avoid",
    label: "Avoid Day",
    description: `Weton Jawa ${weton.meta.label} menjadi acuan utama (70%); Feng Shui ${fengShuiStatus.status} belum cukup untuk menaikkan rekomendasi.`,
    ...scoreDetails,
  };
}

export { getFengShuiStatus, getCollectiveResult };
