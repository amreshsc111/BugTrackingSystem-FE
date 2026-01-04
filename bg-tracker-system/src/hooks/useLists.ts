import { useState, useCallback } from "react";
import { listService, type Role, type SeverityLevel, type Developer, type BugStatusInfo } from "../services/listService";

export function useLists() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [severityLevels, setSeverityLevels] = useState<SeverityLevel[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [bugStatuses, setBugStatuses] = useState<BugStatusInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllLists = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, severitiesData, devsData, statusesData] = await Promise.all([
        listService.getRoles(),
        listService.getSeverityLevels(),
        listService.getDevelopers(),
        listService.getBugStatuses(),
      ]);
      setRoles(rolesData);
      setSeverityLevels(severitiesData);
      setDevelopers(devsData);
      setBugStatuses(statusesData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch lists.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBugStatuses = useCallback(async () => {
    try {
      const data = await listService.getBugStatuses();
      setBugStatuses(data);
    } catch (err) {
      console.error("Failed to fetch bug statuses", err);
    }
  }, []);

  return { 
    roles, 
    severityLevels, 
    developers, 
    bugStatuses,
    loading, 
    error, 
    fetchAllLists,
    fetchRoles: useCallback(async () => {
      try {
        const data = await listService.getRoles();
        setRoles(data);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    }, []),
    fetchSeverityLevels: useCallback(async () => {
      try {
        const data = await listService.getSeverityLevels();
        setSeverityLevels(data);
      } catch (err) {
        console.error("Failed to fetch severity levels", err);
      }
    }, []),
    fetchDevelopers: useCallback(async () => {
      try {
        const data = await listService.getDevelopers();
        setDevelopers(data);
      } catch (err) {
        console.error("Failed to fetch developers", err);
      }
    }, []),
    fetchBugStatuses
  };
}
