export const getMinutesFromSeconds = (seconds) => Math.floor(seconds / 60) % 60;

export const getHoursFromSeconds = (seconds) =>
  Math.floor(Math.floor(seconds / 60) / 60);

export const getSeconds = (time) => time % 60;
