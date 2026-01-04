import { useState, useEffect, useCallback } from "react";
import { bugService } from "../services/bugService";
import type { Bug } from "../types";

export function useBugDetails(id: string | undefined) {
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBug = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      // Assuming getBugs can be filtered or there is a getBugById
      // For now, if we don't have getBugById, we might need to filter list-bugs or add it to service
      const data = await bugService.getBugs(); 
      const found = data.find(b => b.id === id);
      if (found) {
        setBug(found);
        setError(null);
      } else {
        setError("Bug not found");
      }
    } catch (err) {
      setError("Failed to fetch bug details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBug();
  }, [fetchBug]);

  const updateStatus = async (status: number) => {
    if (!id) return;
    try {
      await bugService.updateStatus(id, status);
      await fetchBug(); // Refresh data
    } catch (err) {
      console.error("Failed to update status", err);
      throw err;
    }
  };

  const assignBug = async () => {
    if (!id) return;
    try {
      await bugService.assignBug(id);
      await fetchBug(); // Refresh data
    } catch (err) {
      console.error("Failed to assign bug", err);
      throw err;
    }
  };

  return { bug, loading, error, updateStatus, assignBug, fetchBug };
}
