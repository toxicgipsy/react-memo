export const getLeaders = async () => {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard", { method: "GET" });
  if (!response.ok) {
    throw new Error("Не получилось загрузить список, попробуй позже");
  }
  const data = await response.json();
  return data;
};

export const addLeaders = async ({ name, time, achievements }) => {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "POST",
    body: JSON.stringify({ name, time, achievements }),
  });
  if (!response.ok) {
    throw new Error("Не получилось добавить лидера");
  }
  const data = await response.json();
  return data;
};
