import { useState, useEffect, useCallback } from "react";
import { bugService } from "../services/bugService";
import type { Bug } from "../types";

export function useBugs() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBugs = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      const data = await bugService.getBugs(params);
      setBugs(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch bugs. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  return { bugs, loading, error, fetchBugs, setBugs };
}
