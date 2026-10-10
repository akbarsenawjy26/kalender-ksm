import assert from "node:assert/strict";
import test from "node:test";
import { getCollectiveResult, getFengShuiStatus } from "../assets/js/fengShui.js";
import { CATEGORY_META, getTransactionPriority, getWeton } from "../assets/js/weton.js";

test("converts Gregorian dates to localized lunar date, Ganzhi and Indonesian zodiac", () => {
  const result = getFengShuiStatus("2026-10-14");

  assert.equal(result.dayGanZhi, "Xin-You (Logam Yin · Ayam)");
  assert.equal(result.yearGanZhi, "Bing-Wu (Api Yang · Kuda)");
  assert.equal(result.zodiac, "Kuda");
  assert.match(result.lunarDate, /Hari ke-\d+ · Bulan ke-\d+ · Tahun 2026/);
  assert.doesNotMatch(JSON.stringify(result), /\p{Script=Han}/u);
});

test("classifies livestock activity from the translated recommended list", () => {
  const result = getFengShuiStatus("2026-10-10", "Beli Bakalan");

  assert.equal(result.status, "Lucky Day");
  assert.deepEqual(result.recommendedTerms, [
    "Penerimaan atau pembelian ternak",
    "Memelihara ternak",
    "Penerimaan atau pengelolaan harta",
  ]);
});

test("shows empty recommended and avoided activity lists in Indonesian", () => {
  const result = getFengShuiStatus("2026-10-08", "Beli Bakalan");

  assert.equal(result.status, "Unlucky Day");
  assert.deepEqual(result.avoidedTerms, []);
  assert.ok(result.dayYi.includes("Ritual penghormatan leluhur"));
  assert.ok(!result.dayYi.includes("Hindari kegiatan lain di luar daftar anjuran"));
  assert.ok(result.generalRestrictions.includes("Hindari kegiatan lain di luar daftar anjuran"));
  assert.ok(result.dayJi.includes("Tidak ada aktivitas yang dihindari"));
  assert.doesNotMatch(JSON.stringify(result), /\p{Script=Han}/u);
});

test("uses updated Panca Sudha categories for every remainder", () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5].map((remainder) => [
      CATEGORY_META[remainder].label,
      CATEGORY_META[remainder].status,
      CATEGORY_META[remainder].key,
    ]),
    [
      ["Suku", "Kurang Baik", "kurang-baik"],
      ["Watu", "Kurang Baik", "kurang-baik"],
      ["Gajah", "Sangat Baik", "sangat-baik"],
      ["Buto", "Tidak Baik", "tidak-baik"],
      ["Ratu", "Sangat Baik (Istimewa)", "sangat-baik"],
    ],
  );
});

test("applies the primary-Weton and secondary-Feng-Shui recommendation matrix", () => {
  const base = getWeton("2026-10-13");
  const byRemainder = (remainder) => ({
    ...base,
    remainder,
    meta: CATEGORY_META[remainder],
    categoryKey: CATEGORY_META[remainder].key,
  });
  const lunar = (status) => ({ status, basis: `Feng Shui ${status}` });

  const superGolden = getCollectiveResult(byRemainder(3), lunar("Lucky Day"));
  const golden = getCollectiveResult(byRemainder(5), lunar("Ordinary Day"));
  const primaryGood = getCollectiveResult(byRemainder(3), lunar("Unlucky Day"));
  const boostedWeton = getCollectiveResult(byRemainder(1), lunar("Lucky Day"));
  const weakWeton = getCollectiveResult(byRemainder(2), lunar("Ordinary Day"));
  const buto = getCollectiveResult(byRemainder(4), lunar("Lucky Day"));

  assert.deepEqual(
    [superGolden.label, golden.label, primaryGood.label, boostedWeton.label, weakWeton.label, buto.label],
    ["Super Golden Day", "Golden Day", "Good Day", "Good Day", "Avoid Day", "Avoid Day"],
  );
  assert.deepEqual(
    [superGolden.score, golden.score, primaryGood.score, boostedWeton.score, weakWeton.score, buto.score],
    [100, 85, 70, 65, 50, 30],
  );
  assert.equal(superGolden.primaryWeight, 70);
  assert.equal(superGolden.secondaryWeight, 30);
});

test("applies transaction-specific Weton priorities", () => {
  const ratu = getWeton("2026-10-13");
  const gajah = getWeton("2026-10-25");

  assert.equal(getTransactionPriority(ratu, "Beli Indukan").isPriority, true);
  assert.equal(getTransactionPriority(gajah, "Beli Indukan").isPriority, false);
  assert.equal(getTransactionPriority(gajah, "Beli Pejantan").isPriority, true);
  assert.equal(getTransactionPriority(ratu, "Beli Pejantan").isPriority, false);
  assert.equal(getTransactionPriority(ratu, "Jual Ternak / Panen").isPriority, true);
  assert.equal(getTransactionPriority(gajah, "Beli Bakalan").isPriority, true);
  assert.equal(getTransactionPriority(ratu, "Beli Bakalan").isPriority, true);
  assert.equal(getTransactionPriority(gajah, "Jual Ternak / Panen").isPriority, true);
});

test("contract activity uses contract-specific Feng Shui while preserving the primary scoring matrix", () => {
  const luckyContractDay = getFengShuiStatus("2026-10-13", "TTD Kontrak B2B / Kemitraan");
  const genericallyLuckyDay = getFengShuiStatus("2026-10-02", "TTD Kontrak B2B / Kemitraan");
  const unluckyContractDay = getFengShuiStatus("2026-10-08", "TTD Kontrak B2B / Kemitraan");
  const ratu = getWeton("2026-10-13");
  const gajah = getWeton("2026-10-25");

  assert.equal(luckyContractDay.status, "Lucky Day");
  assert.equal(genericallyLuckyDay.status, "Ordinary Day");
  assert.equal(getCollectiveResult(ratu, luckyContractDay, "TTD Kontrak B2B / Kemitraan").key, "super-golden");
  assert.equal(getCollectiveResult(gajah, luckyContractDay, "TTD Kontrak B2B / Kemitraan").key, "super-golden");
  assert.equal(getCollectiveResult(ratu, genericallyLuckyDay, "TTD Kontrak B2B / Kemitraan").key, "golden");
  assert.equal(getCollectiveResult(ratu, unluckyContractDay, "TTD Kontrak B2B / Kemitraan").key, "good");
});

test("rejects impossible Gregorian date strings", () => {
  assert.throws(() => getFengShuiStatus("2026-02-30"), TypeError);
});
