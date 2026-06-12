export const formatDateTime = (isoString: string) => {
  const dateObj = new Date(isoString);

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // 0-based hota hai
  const year = dateObj.getFullYear();

  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  // padding (05, 09 etc.)
  const pad = (n: number) => n.toString().padStart(2, "0");

  return {
    date: `${pad(day)}-${pad(month)}-${year}`,       // 23-04-2026
    time: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`, // 12:53:05
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    full: `${pad(day)}-${pad(month)}-${year} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  };
};