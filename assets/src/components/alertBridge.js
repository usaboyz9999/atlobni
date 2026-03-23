import { createRef } from 'react';

// Global alert bridge - set by AppAlertProvider
export const alertRef = createRef();

export function showAlert(title, message, buttons) {
  if (alertRef.current) {
    alertRef.current(title, message, buttons);
  }
}