// =============================
// Logging Utility
// =============================

import CONSTANTS from "../constants.js";

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export function debug(msg, args = "") {
  if (game.settings.get(CONSTANTS.MODULE_ID, "debug")) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, args);
  }
  return msg;
}
export function log(message) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  console.log(message.replace("<br>", "\n"));
  return message;
}
export function notify(message) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace("<br>", "\n"));
  return message;
}
export function info(info, notify = false) {
  info = `${CONSTANTS.MODULE_ID} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace("<br>", "\n"));
  return info;
}
export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace("<br>", "\n"));
  return warning;
}
export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_ID} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace("<br>", "\n"));
}
export function timelog(message) {
  warn(Date.now(), message);
}
export const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};
export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
};
// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };
export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return `<p class="${CONSTANTS.MODULE_ID}-dialog">
          <i style="font-size:3rem;" class="${icon}"></i><br><br>
          <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
          <br><br>${message}
      </p>`;
}

// ================================
// Retrieve document utility
// ================================

export function getDocument(target) {
  if (stringIsUuid(target)) {
    target = fromUuidSync(target);
  }
  return target?.document ?? target;
}

export function stringIsUuid(inId) {
  return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
}

export function getUuid(target) {
  if (stringIsUuid(target)) {
    return target;
  }
  const document = getDocument(target);
  return document?.uuid ?? false;
}

export function getItemSync(target, ignoreError) {
  if (!target) {
    throw error(`Item is undefined`, true, target);
  }
  if (target instanceof Item) {
    return target;
  }
  // This is just a patch for compatibillity with others modules
  if (target.document) {
    target = target.document;
  }
  if (target instanceof Item) {
    return target;
  }
  if (stringIsUuid(target)) {
    target = fromUuidSync(target);
  } else {
    target = game.items.get(target) ?? game.items.getName(target);
  }
  if (!target) {
    if (ignoreError) {
      warn(`Item is not found`, false, target);
      return target;
    } else {
      throw error(`Item is not found`, true, target);
    }
  }
  // Type checking
  if (!(target instanceof Item)) {
    throw error(`Invalid Item`, true, target);
  }
  return target;
}

// ==================================================================================

export function isEmptyObject(obj) {
  // because Object.keys(new Date()).length === 0;
  // we have to do some additional check
  if (obj === null || obj === undefined) {
    return true;
  }
  const result =
    obj && // null and undefined check
    Object.keys(obj).length === 0; // || Object.getPrototypeOf(obj) === Object.prototype);
  return result;
}
