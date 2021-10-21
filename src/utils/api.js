import axios from "axios";

const newsApi = axios.create({
  baseURL: "https://the-quality-times.herokuapp.com/api",
});

export const getArticles = async (queries) => {
  const page = queries.currPage || 1;
  const limit = queries.limit || 9;
  const offset = limit * page - limit;

  const newQueries = { ...queries, page, limit, offset };

  const { data } = await newsApi.get("/articles", { params: newQueries });

  return data;
};

export const getTopics = async () => {
  const { data } = await newsApi.get("/topics");
  return data.topics;
};

export const getSingleArticle = async (article_id) => {
  const { data } = await newsApi.get(`/artices/${article_id}`);
  return data.article;
};
