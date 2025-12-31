"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getUsersOnlineStatus } from "@/service/user.service";

type OnlineStatus = {
  isOnline: boolean;
  lastLoginAt: string | null;
};

type OnlineStatusMap = Record<string, OnlineStatus>;

export function useOnlineStatus(
  userIds: string[],
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  },
) {
  const { enabled = true, refetchInterval = 30000 } = options || {};
  const [statusMap, setStatusMap] = useState<OnlineStatusMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousUserIdsRef = useRef<string>("");

  const sortedUserIds = useMemo(() => [...userIds].sort().join(","), [userIds]);

  const fetchStatus = useCallback(async () => {
    if (!enabled || userIds.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await getUsersOnlineStatus(userIds);
      setStatusMap(data);
    } catch (error) {
      console.error("Error fetching online status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userIds, enabled]);

  useEffect(() => {
    if (!enabled || userIds.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const shouldFetch =
      previousUserIdsRef.current === "" ||
      previousUserIdsRef.current !== sortedUserIds;

    if (shouldFetch) {
      previousUserIdsRef.current = sortedUserIds;
      fetchStatus();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (refetchInterval > 0) {
      intervalRef.current = setInterval(fetchStatus, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [sortedUserIds, enabled, refetchInterval, fetchStatus]);

  const getStatus = useCallback(
    (userId: string): OnlineStatus | null => {
      return statusMap[userId] || null;
    },
    [statusMap],
  );

  const isOnline = useCallback(
    (userId: string): boolean => {
      return statusMap[userId]?.isOnline || false;
    },
    [statusMap],
  );

  return {
    statusMap,
    isLoading,
    getStatus,
    isOnline,
    refetch: fetchStatus,
  };
}
