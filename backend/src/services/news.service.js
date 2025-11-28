import axios from "axios";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";
import { getPagination } from "../utils/pagination.js";

// ===============================
// 1) 뉴스 리스트
// ===============================
export const fetchBoanNewsList = async (page = 1, limit = 10) => {
    const url = "https://www.boannews.com/media/s_list.asp?skind=5";
    const { data } = await axios.get(url, { responseType: "arraybuffer" });

    const html = iconv.decode(Buffer.from(data), "EUC-KR").toString();
    const $ = cheerio.load(html);

    const newsList = [];

    $(".news_list").each((i, el) => {
        const $el = $(el);
        const aTag = $el.find("a").first();

        const title = $el.find(".news_txt").text().trim();
        const href = aTag.attr("href");
        const link = href ? `https://www.boannews.com${href}` : null;

        let id = null;
        if (href) {
            const match = href.match(/idx=([0-9]+)/);
            if (match) id = match[1];
        }

        // 🔥 이미지 URL 처리 (공백 포함)
        let imgSrc = $el.find("img.news_img").attr("src") || null;
        if (imgSrc) {
            // 절대 URL
            if (imgSrc.startsWith("/")) {
                imgSrc = "https://www.boannews.com" + imgSrc;
            } else if (imgSrc.startsWith("//")) {
                imgSrc = "https:" + imgSrc;
            }

            // 공백 인코딩
            imgSrc = encodeURI(imgSrc);
        }

        // 🔥 요약문
        const summary = aTag.nextAll("a").first().text().trim();
        
        // 🔥 기자명 + 날짜
        const writerText = $el.find(".news_writer").text().trim();
        let writer = null;
        let date = null;

        if (writerText) {
            const parts = writerText.split("|").map(v => v.trim());
            writer = parts[0] || null;
            date = parts[1] || null;
        }

        if (id && title && link) {
            newsList.push({
                id,
                title,
                link,
                writer,
                date,
                image: imgSrc,      // ← 반드시 인코딩된 값!!
                summary
            });
        }
    });

    const { page: p, limit: l, skip } = getPagination(page, limit);
    const paginatedItems = newsList.slice(skip, skip + l);

    return {
        total: newsList.length,
        page: p,
        limit: l,
        totalPages: Math.ceil(newsList.length / l),
        items: paginatedItems
    };
};



// ===============================
// 2) 상세 페이지 크롤링 (최종 완성본)
// ===============================
export const fetchBoanNewsDetail = async (id) => {
    const url = `https://www.boannews.com/media/view.asp?idx=${id}`;

    const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
    });

    // EUC-KR → UTF-8
    const html = iconv.decode(response.data, "euc-kr");
    const cleaned = html.replace(/\r\n|\n|\r/g, "");

    const $ = cheerio.load(cleaned);

    // 제목
    const title = $("#news_title02 h1").text().trim();

    let rawHtml = $("#news_content").html() || "";

    // <br> → 줄바꿈
    rawHtml = rawHtml.replace(/<br\s*\/?>/gi, "\n");

    // </p> → 문단 구분
    rawHtml = rawHtml.replace(/<\/p>/gi, "\n\n");
    rawHtml = rawHtml.replace(/<p[^>]*>/gi, "");

    // <div> → 문단 구분
    rawHtml = rawHtml.replace(/<\/div>/gi, "\n\n");
    rawHtml = rawHtml.replace(/<div[^>]*>/gi, "");

    // &nbsp; 제거
    rawHtml = rawHtml.replace(/&nbsp;/g, " ");

    // 기타 HTML 태그 제거
    rawHtml = rawHtml.replace(/<[^>]+>/g, "");

    // 개행 정리: 3줄 이상 → 2줄
    const content = rawHtml
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    // 🔥 기사 내 모든 이미지 배열
    const images = [];
    $("#news_content img").each((i, el) => {
        let src = $(el).attr("src");
        if (!src) return;

        // 절대 URL 변환
        if (src.startsWith("/")) {
            src = "https://www.boannews.com" + src;
        } else if (src.startsWith("//")) {
            src = "https:" + src;
        }

        // 공백/괄호 등 인코딩 처리
        src = encodeURI(src);

        images.push(src);
    });

    //날짜 반환
    let date = $("#news_util01").text().trim();
    if(date){
        date = date.replace("입력 :", "").trim();
    } else {
        date = null;
    }


    //기자명 추출
    let writer = $("#news_util05 b").text().trim();

    writer = writer || null;

    return {
        id,
        title,
        content,
        images,  // 👈 딱 이것만 추가됨
        date,
        writer
    };
};


