// amplitude.ts
'use client';

import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

function initAmplitude() {
  if (typeof window !== 'undefined') {
    amplitude.add(sessionReplayPlugin());
    amplitude.init('6024a13377c652c386aa3113f162a0fd', {"autocapture":true,"serverZone":"EU"});
  }
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;