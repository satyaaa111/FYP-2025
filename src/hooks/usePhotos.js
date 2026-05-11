// src/hooks/usePhotos.js
// Listens to /agri_cam/photos in the SAME Firebase project as your sensors.
// Imports the existing `db` from src/lib/firebase.js — no second Firebase app.

"use client";

import { useEffect, useState, useRef } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";

/**
 * @typedef {Object} CamPhoto
 * @property {string} key         - Firebase DB key (epoch-ms, sorts chronologically)
 * @property {string} url         - Firebase Storage download URL
 * @property {string} filename    - e.g. "photos/agri_20260510_130001.jpg"
 * @property {number} size        - JPEG byte size
 * @property {string} captured_at - ISO 8601 string from ESP32
 */

/**
 * @returns {{
 *   photos:   CamPhoto[],
 *   status:   'connecting' | 'live' | 'error',
 *   newPhoto: CamPhoto | null
 * }}
 */
export function usePhotos() {
  const [photos,   setPhotos]  = useState([]);
  const [status,   setStatus]  = useState("connecting");
  const [newPhoto, setNew]     = useState(null);

  const prevKeysRef = useRef(new Set());
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const photosRef = ref(db, "/agri_cam/photos");

    const unsubscribe = onValue(
      photosRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setPhotos([]);
          setStatus("live");
          return;
        }

        // Build array from Firebase object keys
        const incoming = Object.entries(data).map(([key, val]) => ({
          key,
          ...val,
        }));

        // Sort newest first
        incoming.sort(
          (a, b) =>
            new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime()
        );

        // Detect new photo arrivals — skip on first load to avoid spamming analysis
        if (!isFirstLoad.current) {
          for (const p of incoming) {
            if (!prevKeysRef.current.has(p.key)) {
              setNew(p);
              // Auto-clear after 60 s so stale "new" state doesn't linger
              setTimeout(
                () => setNew((prev) => (prev?.key === p.key ? null : prev)),
                60000
              );
              break;
            }
          }
        }

        prevKeysRef.current = new Set(incoming.map((p) => p.key));
        isFirstLoad.current = false;

        setPhotos(incoming);
        setStatus("live");
      },
      (error) => {
        console.error("[usePhotos] Firebase error:", error);
        setStatus("error");
      }
    );

    // Cleanup listener on unmount
    return () => off(photosRef, "value", unsubscribe);
  }, []);

  return { photos, status, newPhoto };
}
