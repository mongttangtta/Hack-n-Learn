import axios from "axios";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";
import {getPagination} from "../utils/pagination.js";

export const fetchBoanNewsList = async (page = 1, limit = 10) => {
        const url = "https://www.boannews.com/media/s_list.asp?skind=5";
        const { data } = await axios.get(url, {responseType: "arraybuffer"});

        const html = iconv.decode(Buffer.from(data), "EUC-KR").toString();
        const $ = cheerio.load(html);

        const newsList = [];

        $(".news_list").each((i, el) => {
                const $el = $(el);
                const aTag = $el.find("a").first();
                const title = $el.find(".news_txt").text().trim();
                const link = aTag.attr("href") ? `https://www.boannews.com${aTag.attr("href")}` : null;
                const summary = aTag.nextAll("a").first().text().trim();

                if (title && link) {
                        newsList.push({ title, link, summary });
                }
        });

        const { page :p , limit : l, skip } = getPagination(page, limit);
        const paginatedItems = newsList.slice(skip, skip + l);
        
        return {
                total : newsList.length,
                page : p,
                limit : l,
                totalPages : Math.ceil(newsList.length / l),
                items : paginatedItems
        };
};

export const fetchBoanNewsDetail = async (id) => {
        const url = `https://www.boannews.com/media/view.asp?idx=${id}`;
        const { data } = await axios.get(url, {responseType: "arraybuffer"});
        const html = iconv.decode(Buffer.from(data), "EUC-KR").toString();
        const $ = cheerio.load(html);

        const title = $(".news_title02 h1").text().trim();
        const content = $(".news_content").html()?.trim() || "";
        const dateRaw = $(".news_util01").text().trim();
        const date = dateRaw.replace(/^입력\s*:\s*/, "").trim();


        return { id, title, content, date };
};
