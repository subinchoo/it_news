const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5050;

// 🔐 CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
  })
);

// 🧠 뉴스 캐시 (메모리 저장)
let cache = {
  timestamp: null,
  data: null,
};

const cacheDuration = 1000 * 60 * 10; // 10분 캐시 유지

// 🔗 뉴스 라우트
app.get("/api/news", async (req, res) => {
  const category = req.query.category || "technology";
  const now = Date.now();

  // ✅ 캐시가 유효하면 그대로 응답
  if (cache.data && cache.timestamp && now - cache.timestamp < cacheDuration) {
    console.log("✅ 캐시에서 뉴스 응답 반환됨");
    return res.status(200).json({ results: cache.data });
  }

  const apiKey = process.env.NEWSDATA_API_KEY;
  const baseURL = "https://newsdata.io/api/1/news";

  const results = [];
  let nextPage = null;
  let pageCount = 0;
  const maxPages = 1; // 최대 1페이지 (rate limit 줄이기)

  try {
    while (pageCount < maxPages) {
      const params = {
        apikey: apiKey,
        category,
        language: "en",
      };

      if (nextPage) {
        params.page = nextPage;
      }

      const response = await axios.get(baseURL, { params });

      if (response.data.results) {
        results.push(...response.data.results);
      }

      nextPage = response.data.nextPage;
      if (!nextPage) break;

      pageCount++;
    }

    // 🧠 캐시에 저장
    cache = {
      timestamp: now,
      data: results,
    };

    console.log("🌐 뉴스 API에서 새로 불러옴");
    res.status(200).json({ results });
  } catch (error) {
    console.error(
      "❌ 뉴스 API 에러:",
      error.response?.status,
      error.response?.data
    );
    res.status(500).json({ error: "뉴스를 불러올 수 없습니다." });
  }
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ server running: http://localhost:${PORT}`);
});
