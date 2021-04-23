import { db } from "./firebase";

/**
 * Updates the `end` (end-time) in that timesheet
 * @param {String} taskId
 * @param {String} timesheetId
 * @param {Date} end
 * @returns {Promise}
 */
export const updateEndTime = async (taskId, timesheetId, end) => {
  return await db
    .collection("tasks")
    .doc(taskId)
    .collection("timesheets")
    .doc(timesheetId)
    .update({ end });
};

/**
 * Updates the `start` (start-time) in that timesheet
 * @param {String} taskId
 * @param {String} timesheetId
 * @param {Date} start
 * @returns {Promise}
 */
export const updateStartTime = async (taskId, timesheetId, start) => {
  return await db
    .collection("tasks")
    .doc(taskId)
    .collection("timesheets")
    .doc(timesheetId)
    .update({ start });
};

/**
 * Queries the db for tasks, returns them.
 * @returns {Array} task array
 * @returns {Promise}
 */
export const getTasks = async () => {
  const { docs } = await db.collection("tasks").get();
  return docs;
};

/**
 *
 * @param {String} name also the id
 * @param {Object} color from the color-picker, must have a color.hex value
 * @returns {Promise}
 */
export const createTask = async (name, color) => {
  return await db.collection("tasks").doc(name).set({
    name: name,
    color: color,
  });
};

/**
 * Removes the task document
 * @param {String} taskId the task id
 * @returns {Promise}
 */
export const deleteTask = async (taskId) => {
  return await db.collection("tasks").doc(taskId).delete();
};

/**
 *
 * @param {String} taskId the task (parent) id
 * @param {Date} time the start time (also at the point of creation, the end time)
 * @returns {String} timesheetId
 */
export const createTimesheet = async (taskId, time) => {
  const timesheetId = await db
    .collection("tasks")
    .doc(taskId)
    .collection("timesheets")
    .add({ start: time, end: time });
  return timesheetId;
};

/**
 * @param {String} taskId the task id
 * @returns {Promise}
 */
export const getAllTimeSheets = async (taskId) => {
  return await db
    .collection("tasks")
    .doc(taskId)
    .collection("timesheets")
    .get();
};

export const getTodaysTimeSheets = async (taskId) => {
  // Get the start & end dates (midnight & 23:59) of today
  const startOfThisDay = new Date().setHours(0, 0, 0, 0);
  const endOfThisDay = new Date().setHours(23, 59, 59, 999);

  // Compare with database timesheets
  return await db
    .collection("tasks")
    .doc(taskId)
    .collection("timesheets")
    .where("start", ">=", startOfThisDay)
    .where("start", "<", endOfThisDay)
    .get();
};
