import React, { useState, useEffect } from 'react';

/**
 * Formats local visitor time with time zone abbreviation in uppercase.
 * E.g., "05:47 PM IST" or "12:17 AM UTC" or "11:58 PM EDT".
 */
const formatVisitorLocalTime = (date = new Date()) => {
  try {
    const formatted = new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(date);

    let result = formatted.toUpperCase();

    // Ensure timezone label exists; if missing, append mapped offset
    if (
      !result.includes('IST') &&
      !result.includes('UTC') &&
      !result.includes('GMT') &&
      !result.includes('EDT') &&
      !result.includes('PST') &&
      !result.includes('EST') &&
      !result.includes('CST') &&
      !result.includes('PDT')
    ) {
      const offset = -date.getTimezoneOffset();
      if (offset === 330) result += ' IST';
      else if (offset === 0) result += ' UTC';
      else {
        const hrs = Math.floor(Math.abs(offset) / 60);
        const mins = Math.abs(offset) % 60;
        const sign = offset >= 0 ? '+' : '-';
        result += ` UTC${sign}${hrs}${mins ? `:${mins}` : ''}`;
      }
    }
    return result;
  } catch {
    const timeStr = date
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      .toUpperCase();
    const offset = -date.getTimezoneOffset();
    const tz =
      offset === 330
        ? 'IST'
        : offset === 0
        ? 'UTC'
        : `UTC${offset >= 0 ? '+' : '-'}${Math.floor(Math.abs(offset) / 60)}`;
    return `${timeStr} ${tz}`;
  }
};

const formatElapsed = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * FieldClock — Isolated header clock component.
 * Holds its own internal state updated via setInterval so its ticks NEVER
 * re-render the parent NightField or the animated cards.
 * When reset via key change, it cleanly remounts with elapsed = 0.
 */
export const FieldClock = () => {
  const [timeStr, setTimeStr] = useState(() => formatVisitorLocalTime());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(formatVisitorLocalTime());
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="nf-clock-wrap">
      <span className="nf-clock-time">{timeStr}</span>
      <span className="nf-clock-sep">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
      <span className="nf-clock-elapsed">last scan {formatElapsed(elapsedSeconds)} ago</span>
    </span>
  );
};

