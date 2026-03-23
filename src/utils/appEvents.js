export const APP_DATA_UPDATED_EVENT = 'prp:data-updated'

export function dispatchAppDataUpdated(detail = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(APP_DATA_UPDATED_EVENT, { detail }))
}

