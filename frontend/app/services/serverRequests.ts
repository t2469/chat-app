'use client';

import api from '@/utils/api';

/**
 * 指定したサーバーに参加する
 * @param serverId サーバーID
 */
export async function joinServer(serverId: string) {
    return api.post(`/servers/${serverId}/join`);
}

/**
 * 指定したサーバーから脱退する
 * @param serverId サーバーID
 */
export async function leaveServer(serverId: string) {
    return api.delete(`/servers/${serverId}/leave`);
}
