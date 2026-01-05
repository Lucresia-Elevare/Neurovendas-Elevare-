/**
 * Health Check Router - Sprint 3 Production Readiness
 * Endpoints para monitoramento de saúde da aplicação
 */

import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { z } from 'zod';

export const healthRouter = router({
  /**
   * Basic health check - sempre retorna 200 se o servidor está respondendo
   */
  ping: publicProcedure
    .query(() => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }),

  /**
   * Detailed health check - verifica componentes críticos
   */
  check: publicProcedure
    .query(async () => {
      const checks = {
        api: 'ok' as 'ok' | 'error',
        database: 'ok' as 'ok' | 'error',
        storage: 'ok' as 'ok' | 'error',
        ai: 'ok' as 'ok' | 'error',
      };

      const errors: string[] = [];

      // Check database connection
      try {
        await db.execute('SELECT 1');
      } catch (error) {
        checks.database = 'error';
        errors.push(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Check S3/Storage (basic check - verifica se env vars existem)
      if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_S3_BUCKET) {
        checks.storage = 'error';
        errors.push('S3 credentials not configured');
      }

      // Check OpenAI (verifica se API key existe)
      if (!process.env.OPENAI_API_KEY) {
        checks.ai = 'error';
        errors.push('OpenAI API key not configured');
      }

      const isHealthy = Object.values(checks).every(status => status === 'ok');

      return {
        status: isHealthy ? 'healthy' : 'degraded',
        checks,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || 'unknown',
        environment: process.env.NODE_ENV || 'development',
      };
    }),

  /**
   * Ready check - indica se o sistema está pronto para receber tráfego
   * Usado por orquestradores (Kubernetes, Docker Swarm, etc)
   */
  ready: publicProcedure
    .query(async () => {
      try {
        // Verifica se consegue conectar no banco
        await db.execute('SELECT 1');
        
        // Verifica configurações críticas
        const criticalEnvVars = [
          'DATABASE_URL',
          'JWT_SECRET',
        ];
        
        const missingVars = criticalEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
          return {
            ready: false,
            reason: `Missing critical environment variables: ${missingVars.join(', ')}`,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          ready: true,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          ready: false,
          reason: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };
      }
    }),

  /**
   * Live check - indica se o servidor está vivo
   * Usado por load balancers para detectar se o processo precisa ser reiniciado
   */
  live: publicProcedure
    .query(() => {
      return {
        alive: true,
        timestamp: new Date().toISOString(),
        pid: process.pid,
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
        },
      };
    }),

  /**
   * Metrics endpoint - métricas básicas para monitoramento
   */
  metrics: publicProcedure
    .query(async () => {
      const memoryUsage = process.memoryUsage();
      
      return {
        process: {
          uptime: process.uptime(),
          pid: process.pid,
          version: process.version,
          platform: process.platform,
        },
        memory: {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external,
          rss: memoryUsage.rss,
        },
        timestamp: new Date().toISOString(),
      };
    }),
});
