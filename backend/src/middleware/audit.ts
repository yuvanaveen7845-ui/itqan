import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { AuthRequest } from './auth';

export const auditLogger = (action: string, targetType?: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        // Only log successful modifications by admins
        const originalJson = res.json;
        res.json = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const logEntry = {
                    user_id: req.user?.id,
                    action: action,
                    target_type: targetType,
                    target_id: req.params.id || data.id || null,
                    new_value: req.method !== 'GET' ? req.body : null,
                    ip_address: req.ip,
                    user_agent: req.headers['user-agent'],
                    created_at: new Date().toISOString()
                };

                // Fire and forget
                supabase.from('audit_logs').insert(logEntry).then(({ error }) => {
                    if (error) console.error('Audit Log Error:', error);
                });
            }
            return originalJson.call(this, data);
        };
        next();
    };
};
