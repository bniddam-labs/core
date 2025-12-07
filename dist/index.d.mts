import { z } from 'zod';

/**
 * Configuration schemas using Zod
 * These schemas are the single source of truth for configuration types
 */
/**
 * Database configuration schema
 */
declare const DatabaseConfigSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodLiteral<"postgres">>;
    host: z.ZodString;
    port: z.ZodNumber;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    synchronize: z.ZodDefault<z.ZodBoolean>;
    dropSchema: z.ZodOptional<z.ZodBoolean>;
    logging: z.ZodDefault<z.ZodBoolean>;
    ssl: z.ZodOptional<z.ZodBoolean>;
    autoLoadEntities: z.ZodDefault<z.ZodBoolean>;
    migrationsRun: z.ZodDefault<z.ZodBoolean>;
    rlsEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    autoLoadEntities: boolean;
    migrationsRun: boolean;
    rlsEnabled: boolean;
    dropSchema?: boolean | undefined;
    ssl?: boolean | undefined;
}, {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    type?: "postgres" | undefined;
    synchronize?: boolean | undefined;
    dropSchema?: boolean | undefined;
    logging?: boolean | undefined;
    ssl?: boolean | undefined;
    autoLoadEntities?: boolean | undefined;
    migrationsRun?: boolean | undefined;
    rlsEnabled?: boolean | undefined;
}>;
/**
 * OAuth provider configuration schema
 */
declare const OAuthProviderSchema: z.ZodObject<{
    clientId: z.ZodString;
    clientSecret: z.ZodString;
}, "strip", z.ZodTypeAny, {
    clientId: string;
    clientSecret: string;
}, {
    clientId: string;
    clientSecret: string;
}>;
/**
 * Authentication configuration schema
 */
declare const AuthConfigSchema: z.ZodObject<{
    jwtSecret: z.ZodString;
    jwtRefreshSecret: z.ZodString;
    jwtExpiresIn: z.ZodDefault<z.ZodString>;
    jwtRefreshExpiresIn: z.ZodDefault<z.ZodString>;
    bcryptRounds: z.ZodDefault<z.ZodNumber>;
    maxFailedAttempts: z.ZodDefault<z.ZodNumber>;
    lockoutDurationMinutes: z.ZodDefault<z.ZodNumber>;
    google: z.ZodOptional<z.ZodObject<{
        clientId: z.ZodString;
        clientSecret: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        clientSecret: string;
    }, {
        clientId: string;
        clientSecret: string;
    }>>;
    github: z.ZodOptional<z.ZodObject<{
        clientId: z.ZodString;
        clientSecret: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        clientSecret: string;
    }, {
        clientId: string;
        clientSecret: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    bcryptRounds: number;
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
    google?: {
        clientId: string;
        clientSecret: string;
    } | undefined;
    github?: {
        clientId: string;
        clientSecret: string;
    } | undefined;
}, {
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiresIn?: string | undefined;
    jwtRefreshExpiresIn?: string | undefined;
    bcryptRounds?: number | undefined;
    maxFailedAttempts?: number | undefined;
    lockoutDurationMinutes?: number | undefined;
    google?: {
        clientId: string;
        clientSecret: string;
    } | undefined;
    github?: {
        clientId: string;
        clientSecret: string;
    } | undefined;
}>;
/**
 * Redis cache configuration schema
 */
declare const RedisConfigSchema: z.ZodObject<{
    host: z.ZodString;
    port: z.ZodNumber;
    password: z.ZodOptional<z.ZodString>;
    db: z.ZodDefault<z.ZodNumber>;
    ttl: z.ZodDefault<z.ZodNumber>;
    keyPrefix: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    host: string;
    port: number;
    db: number;
    ttl: number;
    keyPrefix: string;
    password?: string | undefined;
}, {
    host: string;
    port: number;
    password?: string | undefined;
    db?: number | undefined;
    ttl?: number | undefined;
    keyPrefix?: string | undefined;
}>;
/**
 * Application configuration schema
 */
declare const AppConfigSchema: z.ZodObject<{
    name: z.ZodString;
    url: z.ZodString;
    port: z.ZodNumber;
    nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test", "staging"]>>;
    corsOrigin: z.ZodDefault<z.ZodString>;
    frontendUrl: z.ZodString;
    rateLimitMax: z.ZodDefault<z.ZodNumber>;
    rateLimitTtl: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    port: number;
    name: string;
    url: string;
    nodeEnv: "development" | "production" | "test" | "staging";
    corsOrigin: string;
    frontendUrl: string;
    rateLimitMax: number;
    rateLimitTtl: number;
}, {
    port: number;
    name: string;
    url: string;
    frontendUrl: string;
    nodeEnv?: "development" | "production" | "test" | "staging" | undefined;
    corsOrigin?: string | undefined;
    rateLimitMax?: number | undefined;
    rateLimitTtl?: number | undefined;
}>;
/**
 * Admin panel configuration schema
 */
declare const AdminConfigSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    allowedIps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    allowedIps?: string[] | undefined;
}, {
    password: string;
    email: string;
    allowedIps?: string[] | undefined;
}>;
/**
 * Email service configuration schema
 */
declare const EmailConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    from: z.ZodString;
    brevoApiKey: z.ZodOptional<z.ZodString>;
    smtp: z.ZodOptional<z.ZodObject<{
        host: z.ZodString;
        port: z.ZodNumber;
        secure: z.ZodDefault<z.ZodBoolean>;
        auth: z.ZodObject<{
            user: z.ZodString;
            pass: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            user: string;
            pass: string;
        }, {
            user: string;
            pass: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    }, {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
        secure?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    from: string;
    brevoApiKey?: string | undefined;
    smtp?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    } | undefined;
}, {
    from: string;
    enabled?: boolean | undefined;
    brevoApiKey?: string | undefined;
    smtp?: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
        secure?: boolean | undefined;
    } | undefined;
}>;
/**
 * S3-compatible storage configuration schema
 */
declare const S3ConfigSchema: z.ZodObject<{
    endpoint: z.ZodString;
    port: z.ZodNumber;
    useSSL: z.ZodDefault<z.ZodBoolean>;
    region: z.ZodString;
    accessKey: z.ZodString;
    secretKey: z.ZodString;
    bucketName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    port: number;
    endpoint: string;
    useSSL: boolean;
    region: string;
    accessKey: string;
    secretKey: string;
    bucketName: string;
}, {
    port: number;
    endpoint: string;
    region: string;
    accessKey: string;
    secretKey: string;
    bucketName: string;
    useSSL?: boolean | undefined;
}>;
/**
 * RabbitMQ message queue configuration schema
 */
declare const RabbitMQConfigSchema: z.ZodObject<{
    uri: z.ZodString;
    exchange: z.ZodString;
    dlxExchange: z.ZodString;
    connectionInitOptions: z.ZodOptional<z.ZodObject<{
        wait: z.ZodDefault<z.ZodBoolean>;
        timeout: z.ZodDefault<z.ZodNumber>;
        reject: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        wait: boolean;
        timeout: number;
        reject: boolean;
    }, {
        wait?: boolean | undefined;
        timeout?: number | undefined;
        reject?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    uri: string;
    exchange: string;
    dlxExchange: string;
    connectionInitOptions?: {
        wait: boolean;
        timeout: number;
        reject: boolean;
    } | undefined;
}, {
    uri: string;
    exchange: string;
    dlxExchange: string;
    connectionInitOptions?: {
        wait?: boolean | undefined;
        timeout?: number | undefined;
        reject?: boolean | undefined;
    } | undefined;
}>;
/**
 * Logging configuration schema
 */
declare const LoggingConfigSchema: z.ZodObject<{
    level: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
    format: z.ZodDefault<z.ZodEnum<["json", "pretty"]>>;
    transports: z.ZodDefault<z.ZodArray<z.ZodEnum<["console", "file"]>, "many">>;
    fileConfig: z.ZodOptional<z.ZodObject<{
        filename: z.ZodString;
        maxSize: z.ZodDefault<z.ZodString>;
        maxFiles: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        filename: string;
        maxSize: string;
        maxFiles: number;
    }, {
        filename: string;
        maxSize?: string | undefined;
        maxFiles?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    level: "debug" | "info" | "warn" | "error";
    format: "json" | "pretty";
    transports: ("console" | "file")[];
    fileConfig?: {
        filename: string;
        maxSize: string;
        maxFiles: number;
    } | undefined;
}, {
    level?: "debug" | "info" | "warn" | "error" | undefined;
    format?: "json" | "pretty" | undefined;
    transports?: ("console" | "file")[] | undefined;
    fileConfig?: {
        filename: string;
        maxSize?: string | undefined;
        maxFiles?: number | undefined;
    } | undefined;
}>;
/**
 * Feature flags configuration schema
 */
declare const FeatureFlagsConfigSchema: z.ZodObject<{
    enableNewUI: z.ZodDefault<z.ZodBoolean>;
    enableBetaFeatures: z.ZodDefault<z.ZodBoolean>;
    enableAnalytics: z.ZodDefault<z.ZodBoolean>;
    maintenanceMode: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enableNewUI: boolean;
    enableBetaFeatures: boolean;
    enableAnalytics: boolean;
    maintenanceMode: boolean;
}, {
    enableNewUI?: boolean | undefined;
    enableBetaFeatures?: boolean | undefined;
    enableAnalytics?: boolean | undefined;
    maintenanceMode?: boolean | undefined;
}>;
/**
 * Complete application configuration schema
 */
declare const ConfigurationSchema: z.ZodObject<{
    app: z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
        port: z.ZodNumber;
        nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test", "staging"]>>;
        corsOrigin: z.ZodDefault<z.ZodString>;
        frontendUrl: z.ZodString;
        rateLimitMax: z.ZodDefault<z.ZodNumber>;
        rateLimitTtl: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        port: number;
        name: string;
        url: string;
        nodeEnv: "development" | "production" | "test" | "staging";
        corsOrigin: string;
        frontendUrl: string;
        rateLimitMax: number;
        rateLimitTtl: number;
    }, {
        port: number;
        name: string;
        url: string;
        frontendUrl: string;
        nodeEnv?: "development" | "production" | "test" | "staging" | undefined;
        corsOrigin?: string | undefined;
        rateLimitMax?: number | undefined;
        rateLimitTtl?: number | undefined;
    }>;
    database: z.ZodObject<{
        type: z.ZodDefault<z.ZodLiteral<"postgres">>;
        host: z.ZodString;
        port: z.ZodNumber;
        username: z.ZodString;
        password: z.ZodString;
        database: z.ZodString;
        synchronize: z.ZodDefault<z.ZodBoolean>;
        dropSchema: z.ZodOptional<z.ZodBoolean>;
        logging: z.ZodDefault<z.ZodBoolean>;
        ssl: z.ZodOptional<z.ZodBoolean>;
        autoLoadEntities: z.ZodDefault<z.ZodBoolean>;
        migrationsRun: z.ZodDefault<z.ZodBoolean>;
        rlsEnabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "postgres";
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
        autoLoadEntities: boolean;
        migrationsRun: boolean;
        rlsEnabled: boolean;
        dropSchema?: boolean | undefined;
        ssl?: boolean | undefined;
    }, {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        type?: "postgres" | undefined;
        synchronize?: boolean | undefined;
        dropSchema?: boolean | undefined;
        logging?: boolean | undefined;
        ssl?: boolean | undefined;
        autoLoadEntities?: boolean | undefined;
        migrationsRun?: boolean | undefined;
        rlsEnabled?: boolean | undefined;
    }>;
    auth: z.ZodObject<{
        jwtSecret: z.ZodString;
        jwtRefreshSecret: z.ZodString;
        jwtExpiresIn: z.ZodDefault<z.ZodString>;
        jwtRefreshExpiresIn: z.ZodDefault<z.ZodString>;
        bcryptRounds: z.ZodDefault<z.ZodNumber>;
        maxFailedAttempts: z.ZodDefault<z.ZodNumber>;
        lockoutDurationMinutes: z.ZodDefault<z.ZodNumber>;
        google: z.ZodOptional<z.ZodObject<{
            clientId: z.ZodString;
            clientSecret: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clientId: string;
            clientSecret: string;
        }, {
            clientId: string;
            clientSecret: string;
        }>>;
        github: z.ZodOptional<z.ZodObject<{
            clientId: z.ZodString;
            clientSecret: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            clientId: string;
            clientSecret: string;
        }, {
            clientId: string;
            clientSecret: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        jwtSecret: string;
        jwtRefreshSecret: string;
        jwtExpiresIn: string;
        jwtRefreshExpiresIn: string;
        bcryptRounds: number;
        maxFailedAttempts: number;
        lockoutDurationMinutes: number;
        google?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
        github?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
    }, {
        jwtSecret: string;
        jwtRefreshSecret: string;
        jwtExpiresIn?: string | undefined;
        jwtRefreshExpiresIn?: string | undefined;
        bcryptRounds?: number | undefined;
        maxFailedAttempts?: number | undefined;
        lockoutDurationMinutes?: number | undefined;
        google?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
        github?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
    }>;
    redis: z.ZodObject<{
        host: z.ZodString;
        port: z.ZodNumber;
        password: z.ZodOptional<z.ZodString>;
        db: z.ZodDefault<z.ZodNumber>;
        ttl: z.ZodDefault<z.ZodNumber>;
        keyPrefix: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        host: string;
        port: number;
        db: number;
        ttl: number;
        keyPrefix: string;
        password?: string | undefined;
    }, {
        host: string;
        port: number;
        password?: string | undefined;
        db?: number | undefined;
        ttl?: number | undefined;
        keyPrefix?: string | undefined;
    }>;
    admin: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        allowedIps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        password: string;
        email: string;
        allowedIps?: string[] | undefined;
    }, {
        password: string;
        email: string;
        allowedIps?: string[] | undefined;
    }>;
    email: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        from: z.ZodString;
        brevoApiKey: z.ZodOptional<z.ZodString>;
        smtp: z.ZodOptional<z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            secure: z.ZodDefault<z.ZodBoolean>;
            auth: z.ZodObject<{
                user: z.ZodString;
                pass: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                user: string;
                pass: string;
            }, {
                user: string;
                pass: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        }, {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        from: string;
        brevoApiKey?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        } | undefined;
    }, {
        from: string;
        enabled?: boolean | undefined;
        brevoApiKey?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        } | undefined;
    }>;
    s3: z.ZodObject<{
        endpoint: z.ZodString;
        port: z.ZodNumber;
        useSSL: z.ZodDefault<z.ZodBoolean>;
        region: z.ZodString;
        accessKey: z.ZodString;
        secretKey: z.ZodString;
        bucketName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        port: number;
        endpoint: string;
        useSSL: boolean;
        region: string;
        accessKey: string;
        secretKey: string;
        bucketName: string;
    }, {
        port: number;
        endpoint: string;
        region: string;
        accessKey: string;
        secretKey: string;
        bucketName: string;
        useSSL?: boolean | undefined;
    }>;
    rabbitmq: z.ZodObject<{
        uri: z.ZodString;
        exchange: z.ZodString;
        dlxExchange: z.ZodString;
        connectionInitOptions: z.ZodOptional<z.ZodObject<{
            wait: z.ZodDefault<z.ZodBoolean>;
            timeout: z.ZodDefault<z.ZodNumber>;
            reject: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            wait: boolean;
            timeout: number;
            reject: boolean;
        }, {
            wait?: boolean | undefined;
            timeout?: number | undefined;
            reject?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        uri: string;
        exchange: string;
        dlxExchange: string;
        connectionInitOptions?: {
            wait: boolean;
            timeout: number;
            reject: boolean;
        } | undefined;
    }, {
        uri: string;
        exchange: string;
        dlxExchange: string;
        connectionInitOptions?: {
            wait?: boolean | undefined;
            timeout?: number | undefined;
            reject?: boolean | undefined;
        } | undefined;
    }>;
    logging: z.ZodOptional<z.ZodObject<{
        level: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
        format: z.ZodDefault<z.ZodEnum<["json", "pretty"]>>;
        transports: z.ZodDefault<z.ZodArray<z.ZodEnum<["console", "file"]>, "many">>;
        fileConfig: z.ZodOptional<z.ZodObject<{
            filename: z.ZodString;
            maxSize: z.ZodDefault<z.ZodString>;
            maxFiles: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            filename: string;
            maxSize: string;
            maxFiles: number;
        }, {
            filename: string;
            maxSize?: string | undefined;
            maxFiles?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        level: "debug" | "info" | "warn" | "error";
        format: "json" | "pretty";
        transports: ("console" | "file")[];
        fileConfig?: {
            filename: string;
            maxSize: string;
            maxFiles: number;
        } | undefined;
    }, {
        level?: "debug" | "info" | "warn" | "error" | undefined;
        format?: "json" | "pretty" | undefined;
        transports?: ("console" | "file")[] | undefined;
        fileConfig?: {
            filename: string;
            maxSize?: string | undefined;
            maxFiles?: number | undefined;
        } | undefined;
    }>>;
    featureFlags: z.ZodOptional<z.ZodObject<{
        enableNewUI: z.ZodDefault<z.ZodBoolean>;
        enableBetaFeatures: z.ZodDefault<z.ZodBoolean>;
        enableAnalytics: z.ZodDefault<z.ZodBoolean>;
        maintenanceMode: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enableNewUI: boolean;
        enableBetaFeatures: boolean;
        enableAnalytics: boolean;
        maintenanceMode: boolean;
    }, {
        enableNewUI?: boolean | undefined;
        enableBetaFeatures?: boolean | undefined;
        enableAnalytics?: boolean | undefined;
        maintenanceMode?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    database: {
        type: "postgres";
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
        autoLoadEntities: boolean;
        migrationsRun: boolean;
        rlsEnabled: boolean;
        dropSchema?: boolean | undefined;
        ssl?: boolean | undefined;
    };
    email: {
        enabled: boolean;
        from: string;
        brevoApiKey?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        } | undefined;
    };
    auth: {
        jwtSecret: string;
        jwtRefreshSecret: string;
        jwtExpiresIn: string;
        jwtRefreshExpiresIn: string;
        bcryptRounds: number;
        maxFailedAttempts: number;
        lockoutDurationMinutes: number;
        google?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
        github?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
    };
    app: {
        port: number;
        name: string;
        url: string;
        nodeEnv: "development" | "production" | "test" | "staging";
        corsOrigin: string;
        frontendUrl: string;
        rateLimitMax: number;
        rateLimitTtl: number;
    };
    redis: {
        host: string;
        port: number;
        db: number;
        ttl: number;
        keyPrefix: string;
        password?: string | undefined;
    };
    admin: {
        password: string;
        email: string;
        allowedIps?: string[] | undefined;
    };
    s3: {
        port: number;
        endpoint: string;
        useSSL: boolean;
        region: string;
        accessKey: string;
        secretKey: string;
        bucketName: string;
    };
    rabbitmq: {
        uri: string;
        exchange: string;
        dlxExchange: string;
        connectionInitOptions?: {
            wait: boolean;
            timeout: number;
            reject: boolean;
        } | undefined;
    };
    logging?: {
        level: "debug" | "info" | "warn" | "error";
        format: "json" | "pretty";
        transports: ("console" | "file")[];
        fileConfig?: {
            filename: string;
            maxSize: string;
            maxFiles: number;
        } | undefined;
    } | undefined;
    featureFlags?: {
        enableNewUI: boolean;
        enableBetaFeatures: boolean;
        enableAnalytics: boolean;
        maintenanceMode: boolean;
    } | undefined;
}, {
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        type?: "postgres" | undefined;
        synchronize?: boolean | undefined;
        dropSchema?: boolean | undefined;
        logging?: boolean | undefined;
        ssl?: boolean | undefined;
        autoLoadEntities?: boolean | undefined;
        migrationsRun?: boolean | undefined;
        rlsEnabled?: boolean | undefined;
    };
    email: {
        from: string;
        enabled?: boolean | undefined;
        brevoApiKey?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        } | undefined;
    };
    auth: {
        jwtSecret: string;
        jwtRefreshSecret: string;
        jwtExpiresIn?: string | undefined;
        jwtRefreshExpiresIn?: string | undefined;
        bcryptRounds?: number | undefined;
        maxFailedAttempts?: number | undefined;
        lockoutDurationMinutes?: number | undefined;
        google?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
        github?: {
            clientId: string;
            clientSecret: string;
        } | undefined;
    };
    app: {
        port: number;
        name: string;
        url: string;
        frontendUrl: string;
        nodeEnv?: "development" | "production" | "test" | "staging" | undefined;
        corsOrigin?: string | undefined;
        rateLimitMax?: number | undefined;
        rateLimitTtl?: number | undefined;
    };
    redis: {
        host: string;
        port: number;
        password?: string | undefined;
        db?: number | undefined;
        ttl?: number | undefined;
        keyPrefix?: string | undefined;
    };
    admin: {
        password: string;
        email: string;
        allowedIps?: string[] | undefined;
    };
    s3: {
        port: number;
        endpoint: string;
        region: string;
        accessKey: string;
        secretKey: string;
        bucketName: string;
        useSSL?: boolean | undefined;
    };
    rabbitmq: {
        uri: string;
        exchange: string;
        dlxExchange: string;
        connectionInitOptions?: {
            wait?: boolean | undefined;
            timeout?: number | undefined;
            reject?: boolean | undefined;
        } | undefined;
    };
    logging?: {
        level?: "debug" | "info" | "warn" | "error" | undefined;
        format?: "json" | "pretty" | undefined;
        transports?: ("console" | "file")[] | undefined;
        fileConfig?: {
            filename: string;
            maxSize?: string | undefined;
            maxFiles?: number | undefined;
        } | undefined;
    } | undefined;
    featureFlags?: {
        enableNewUI?: boolean | undefined;
        enableBetaFeatures?: boolean | undefined;
        enableAnalytics?: boolean | undefined;
        maintenanceMode?: boolean | undefined;
    } | undefined;
}>;

/**
 * Configuration types derived from Zod schemas
 * DO NOT manually define interfaces - types are inferred from schemas
 */
type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
type OAuthProvider = z.infer<typeof OAuthProviderSchema>;
type AuthConfig = z.infer<typeof AuthConfigSchema>;
type RedisConfig = z.infer<typeof RedisConfigSchema>;
type AppConfig = z.infer<typeof AppConfigSchema>;
type AdminConfig = z.infer<typeof AdminConfigSchema>;
type EmailConfig = z.infer<typeof EmailConfigSchema>;
type S3Config = z.infer<typeof S3ConfigSchema>;
type RabbitMQConfig = z.infer<typeof RabbitMQConfigSchema>;
type LoggingConfig = z.infer<typeof LoggingConfigSchema>;
type FeatureFlagsConfig = z.infer<typeof FeatureFlagsConfigSchema>;
/**
 * Complete application configuration type
 */
type Configuration = z.infer<typeof ConfigurationSchema>;
/**
 * Deep partial helper type
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Partial configuration for builder pattern
 */
type PartialConfiguration = DeepPartial<Configuration>;

/**
 * Fluent configuration builder
 * Helps construct configuration objects in a type-safe, chainable way
 */
declare class ConfigBuilder {
    private config;
    /**
     * Set environment (development, staging, production, test)
     */
    environment(env: AppConfig['nodeEnv']): this;
    /**
     * Configure application settings
     */
    app(config: Partial<AppConfig>): this;
    /**
     * Configure database connection
     */
    database(config: Partial<DatabaseConfig>): this;
    /**
     * Configure authentication
     */
    auth(config: Partial<AuthConfig>): this;
    /**
     * Configure Redis cache
     */
    redis(config: Partial<RedisConfig>): this;
    /**
     * Configure admin panel
     */
    admin(config: Partial<AdminConfig>): this;
    /**
     * Configure email service
     */
    email(config: Partial<EmailConfig>): this;
    /**
     * Configure S3 storage
     */
    s3(config: Partial<S3Config>): this;
    /**
     * Configure RabbitMQ
     */
    rabbitmq(config: Partial<RabbitMQConfig>): this;
    /**
     * Configure logging
     */
    logging(config: Partial<LoggingConfig>): this;
    /**
     * Configure feature flags
     */
    featureFlags(config: Partial<FeatureFlagsConfig>): this;
    /**
     * Load .env file and then load configuration from environment variables
     * @param envFilePath - Path to .env file (defaults to .env in current directory)
     * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
     * @param override - Whether to override existing environment variables
     */
    fromDotEnv(envFilePath?: string, prefix?: string, override?: boolean): this;
    /**
     * Load configuration from environment variables
     * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
     */
    fromEnv(prefix?: string): this;
    /**
     * Load configuration from a JSON file
     * @param filePath - Path to JSON config file
     */
    fromFile(filePath: string): this;
    /**
     * Load test configuration preset
     */
    fromTest(): this;
    /**
     * Merge with another configuration object
     * @param config - Configuration to merge
     */
    merge(config: PartialConfiguration): this;
    /**
     * Override specific values (alias for merge)
     * @param config - Configuration to override
     */
    override(config: PartialConfiguration): this;
    /**
     * Use a preset configuration (development, production, test, staging)
     * @param preset - Preset name
     */
    preset(preset: 'development' | 'production' | 'test' | 'staging'): this;
    /**
     * Conditionally apply configuration
     * @param condition - Boolean condition
     * @param fn - Function to apply if condition is true
     */
    when(condition: boolean, fn: (builder: ConfigBuilder) => void): this;
    /**
     * Conditionally apply configuration based on environment
     * @param env - Environment to check
     * @param fn - Function to apply if environment matches
     */
    whenEnv(env: AppConfig['nodeEnv'], fn: (builder: ConfigBuilder) => void): this;
    /**
     * Enable development mode optimizations
     */
    forDevelopment(): this;
    /**
     * Enable production mode optimizations
     */
    forProduction(): this;
    /**
     * Enable test mode optimizations
     */
    forTest(): this;
    /**
     * Enable staging mode optimizations
     */
    forStaging(): this;
    /**
     * Build and validate the final configuration
     * @returns Validated configuration
     * @throws Error if validation fails
     */
    build(): Configuration;
    /**
     * Build without validation (unsafe, use for debugging)
     * @returns Partial configuration without validation
     */
    buildUnsafe(): PartialConfiguration;
    /**
     * Get current config state (for inspection)
     * @returns Copy of current configuration state
     */
    peek(): PartialConfiguration;
    /**
     * Reset builder to empty state
     */
    reset(): this;
    /**
     * Clone the current builder state
     * @returns New builder with same configuration
     */
    clone(): ConfigBuilder;
}
/**
 * Create a new config builder instance
 * @returns New ConfigBuilder instance
 */
declare function createConfigBuilder(): ConfigBuilder;
/**
 * Quick helper to create config from .env file
 * @param envFilePath - Path to .env file (defaults to .env in current directory)
 * @param prefix - Optional prefix for environment variables
 * @param override - Whether to override existing environment variables
 * @returns Validated configuration
 */
declare function createConfigFromDotEnv(envFilePath?: string, prefix?: string, override?: boolean): Configuration;
/**
 * Quick helper to create config from environment
 * @param prefix - Optional prefix for environment variables
 * @returns Validated configuration
 */
declare function createConfigFromEnv(prefix?: string): Configuration;
/**
 * Quick helper to create config from preset
 * @param preset - Preset name
 * @param overrides - Optional configuration overrides
 * @returns Validated configuration
 */
declare function createConfigFromPreset(preset: 'development' | 'production' | 'test' | 'staging', overrides?: PartialConfiguration): Configuration;
/**
 * Quick helper to create test configuration
 * @returns Validated test configuration
 */
declare function createTestConfig(): Configuration;

/**
 * Configuration loaders - functions to load configuration from various sources
 * These are helpers that DON'T create fixed config, but provide utilities
 * for consuming projects to use when building their config
 */
/**
 * Load .env file into process.env
 * @param envFilePath - Path to .env file (defaults to .env in current directory)
 * @param override - Whether to override existing environment variables
 */
declare function loadDotEnv(envFilePath?: string, override?: boolean): void;
/**
 * Load configuration from environment variables
 * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
 * @returns Partial configuration loaded from environment
 */
declare function loadFromEnv(prefix?: string): PartialConfiguration;
/**
 * Load configuration from a JSON file
 * @param filePath - Path to JSON config file
 * @returns Partial configuration loaded from file
 */
declare function loadFromFile(filePath: string): PartialConfiguration;
/**
 * Load minimal configuration for testing
 * @returns Minimal configuration for test environment
 */
declare function loadTestConfig(): PartialConfiguration;

/**
 * Validation utilities for configuration
 */
/**
 * Validate configuration against schema
 * @param config - Configuration object to validate
 * @returns Validated and typed configuration
 * @throws Error if validation fails with detailed error messages
 */
declare function validateConfig(config: unknown): Configuration;
/**
 * Validate configuration and return result with errors
 * Non-throwing version for safer validation
 * @param config - Configuration object to validate
 * @returns Validation result with success flag and data or errors
 */
declare function safeValidateConfig(config: unknown): {
    success: boolean;
    data?: Configuration;
    errors?: string[];
};
/**
 * Validate partial configuration (for builder pattern)
 * @param config - Partial configuration object
 * @returns True if valid structure, throws on invalid
 */
declare function validatePartialConfig(config: PartialConfiguration): boolean;
/**
 * Log configuration in a safe way (with secrets masked)
 * @param config - Configuration object to log
 * @param logger - Optional logger function (defaults to console.log)
 */
declare function logConfigSafely(config: Configuration, logger?: (msg: string) => void): void;
/**
 * Get configuration summary for logging (minimal info, no secrets)
 * @param config - Configuration object
 * @returns Safe summary object
 */
declare function getConfigSummary(config: Configuration): Record<string, any>;

/**
 * Utility functions for configuration management
 */
/**
 * Deep merge two objects
 * @param target - Target object
 * @param source - Source object to merge
 * @returns Merged object
 */
declare function deepMerge<T = any>(target: any, source: any): T;
/**
 * Mask sensitive values for safe logging
 * Redacts passwords, secrets, keys, and tokens
 * @param config - Configuration object to mask
 * @returns Configuration object with sensitive values masked
 */
declare function maskSecrets(config: any): any;
/**
 * Parse string boolean values
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Boolean value
 */
declare function parseBoolean(value: string | undefined, defaultValue?: boolean): boolean;
/**
 * Parse string number values
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Number value
 */
declare function parseNumber(value: string | undefined, defaultValue: number): number;
/**
 * Parse comma-separated string values into array
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Array of strings
 */
declare function parseArray(value: string | undefined, defaultValue?: string[]): string[];
/**
 * Get required environment variable or throw error
 * @param key - Environment variable key
 * @param errorMessage - Custom error message
 * @returns Environment variable value
 * @throws Error if environment variable is not set
 */
declare function requireEnv(key: string, errorMessage?: string): string;
/**
 * Get optional environment variable with default value
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @returns Environment variable value or default
 */
declare function getEnv(key: string, defaultValue: string): string;
/**
 * Validate production secrets
 * Ensures critical secrets meet security requirements in production
 * @param config - Configuration object
 * @throws Error if validation fails
 */
declare function validateProductionSecrets(config: any): void;

/**
 * Default/preset configurations
 * These are OPTIONAL reference configurations that consuming projects can use
 * They are NOT automatically applied - projects must explicitly use them
 */
/**
 * Development environment preset
 * Optimized for local development with verbose logging and auto-sync
 */
declare const DEVELOPMENT_PRESET: PartialConfiguration;
/**
 * Production environment preset
 * Optimized for production with security and performance
 */
declare const PRODUCTION_PRESET: PartialConfiguration;
/**
 * Staging environment preset
 * Similar to production but with more debugging enabled
 */
declare const STAGING_PRESET: PartialConfiguration;
/**
 * Test environment preset
 * Optimized for running tests with fast setup and teardown
 */
declare const TEST_PRESET: PartialConfiguration;
/**
 * Get preset configuration by name
 * @param preset - Preset name
 * @returns Partial configuration for the preset
 */
declare function getPreset(preset: 'development' | 'production' | 'staging' | 'test'): PartialConfiguration;
/**
 * Default database configuration values (for reference)
 */
declare const DEFAULT_DATABASE_CONFIG: {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    autoLoadEntities: boolean;
    migrationsRun: boolean;
    rlsEnabled: boolean;
};
/**
 * Default Redis configuration values (for reference)
 */
declare const DEFAULT_REDIS_CONFIG: {
    host: string;
    port: number;
    db: number;
    ttl: number;
    keyPrefix: string;
};
/**
 * Default JWT configuration values (for reference)
 */
declare const DEFAULT_JWT_CONFIG: {
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    bcryptRounds: number;
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
};
/**
 * Default rate limiting configuration (for reference)
 */
declare const DEFAULT_RATE_LIMIT: {
    max: number;
    ttl: number;
};
/**
 * Default logging configuration (for reference)
 */
declare const DEFAULT_LOGGING_CONFIG: {
    level: "info";
    format: "json";
    transports: readonly ["console"];
};

/**
 * Log levels supported by the logger
 */
type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
/**
 * Severity levels for security events
 */
type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';
/**
 * Authentication event types
 */
type AuthEvent = 'login' | 'logout' | 'register' | 'failed';
/**
 * Metadata object for structured logging
 */
type LogMetadata = Record<string, any>;
/**
 * Logger configuration options
 */
interface LoggerConfig {
    /**
     * Enable JSON output format
     * @default false
     */
    json?: boolean;
    /**
     * Timestamp format for logs
     * @default 'ISO'
     */
    timestampFormat?: 'ISO' | 'locale' | 'unix';
    /**
     * Enable log levels
     * @default ['log', 'error', 'warn', 'debug', 'verbose']
     */
    levels?: LogLevel[];
    /**
     * Enable colored output (only for non-JSON mode)
     * @default true
     */
    colors?: boolean;
    /**
     * Include timestamp in logs
     * @default true
     */
    includeTimestamp?: boolean;
}
/**
 * Core logger interface - framework agnostic
 * Can be used in any TypeScript/JavaScript project
 */
interface ILogger {
    /**
     * Set context for all subsequent logs
     * @param context - Context name (e.g., module name, class name)
     */
    setContext(context: string): void;
    /**
     * Get current context
     */
    getContext(): string;
    /**
     * Log informational message
     * @param message - Log message
     * @param metadata - Optional structured data
     */
    log(message: string, metadata?: LogMetadata): void;
    /**
     * Log error message
     * @param message - Error message
     * @param trace - Stack trace (optional)
     * @param metadata - Optional structured data
     */
    error(message: string, trace?: string, metadata?: LogMetadata): void;
    /**
     * Log warning message
     * @param message - Warning message
     * @param metadata - Optional structured data
     */
    warn(message: string, metadata?: LogMetadata): void;
    /**
     * Log debug message
     * @param message - Debug message
     * @param metadata - Optional structured data
     */
    debug(message: string, metadata?: LogMetadata): void;
    /**
     * Log verbose message
     * @param message - Verbose message
     * @param metadata - Optional structured data
     */
    verbose(message: string, metadata?: LogMetadata): void;
    /**
     * Log business event with structured data
     * @param event - Event name
     * @param data - Event metadata
     */
    logEvent(event: string, data: LogMetadata): void;
    /**
     * Log database query execution
     * @param query - SQL query or operation name
     * @param duration - Execution duration in ms
     * @param params - Query parameters (optional)
     */
    logQuery(query: string, duration: number, params?: any[]): void;
    /**
     * Log HTTP request
     * @param method - HTTP method
     * @param url - Request URL
     * @param statusCode - Response status code
     * @param duration - Request duration in ms
     */
    logHttpRequest(method: string, url: string, statusCode: number, duration: number): void;
    /**
     * Log authentication event
     * @param event - Auth event type
     * @param userId - User ID (optional)
     * @param metadata - Additional metadata
     */
    logAuth(event: AuthEvent, userId?: string, metadata?: LogMetadata): void;
    /**
     * Log security event
     * @param event - Security event description
     * @param severity - Event severity level
     * @param metadata - Additional metadata
     */
    logSecurity(event: string, severity: SecuritySeverity, metadata?: LogMetadata): void;
}

/**
 * Framework-free console logger implementation
 * Can be used standalone or wrapped by framework-specific adapters
 */
declare class ConsoleLogger implements ILogger {
    private context;
    private config;
    constructor(context?: string, config?: LoggerConfig);
    /**
     * Set context for all subsequent logs
     */
    setContext(context: string): void;
    /**
     * Get current context
     */
    getContext(): string;
    /**
     * Log informational message
     */
    log(message: string, metadata?: LogMetadata): void;
    /**
     * Log error message
     */
    error(message: string, trace?: string, metadata?: LogMetadata): void;
    /**
     * Log warning message
     */
    warn(message: string, metadata?: LogMetadata): void;
    /**
     * Log debug message
     */
    debug(message: string, metadata?: LogMetadata): void;
    /**
     * Log verbose message
     */
    verbose(message: string, metadata?: LogMetadata): void;
    /**
     * Log business event with structured data
     */
    logEvent(event: string, data: LogMetadata): void;
    /**
     * Log database query execution
     */
    logQuery(query: string, duration: number, params?: any[]): void;
    /**
     * Log HTTP request
     */
    logHttpRequest(method: string, url: string, statusCode: number, duration: number): void;
    /**
     * Log authentication event
     */
    logAuth(event: AuthEvent, userId?: string, metadata?: LogMetadata): void;
    /**
     * Log security event
     */
    logSecurity(event: string, severity: SecuritySeverity, metadata?: LogMetadata): void;
    /**
     * Core logging method that handles formatting and output
     */
    private writeLog;
    /**
     * Write log in JSON format
     */
    private writeJsonLog;
    /**
     * Write log in text format
     */
    private writeTextLog;
    /**
     * Write to appropriate console stream based on level
     */
    private writeToConsole;
    /**
     * Get formatted timestamp based on config
     */
    private getTimestamp;
    /**
     * Create a child logger with a new context
     * Useful for creating scoped loggers while sharing the same configuration
     */
    createChild(context: string): ConsoleLogger;
    /**
     * Update logger configuration
     */
    updateConfig(config: Partial<LoggerConfig>): void;
}

export { type AdminConfig, AdminConfigSchema, type AppConfig, AppConfigSchema, type AuthConfig, AuthConfigSchema, type AuthEvent, ConfigBuilder, type Configuration, ConfigurationSchema, ConsoleLogger, DEFAULT_DATABASE_CONFIG, DEFAULT_JWT_CONFIG, DEFAULT_LOGGING_CONFIG, DEFAULT_RATE_LIMIT, DEFAULT_REDIS_CONFIG, DEVELOPMENT_PRESET, type DatabaseConfig, DatabaseConfigSchema, type EmailConfig, EmailConfigSchema, type FeatureFlagsConfig, FeatureFlagsConfigSchema, type ILogger, type LogLevel, type LogMetadata, type LoggerConfig, type LoggingConfig, LoggingConfigSchema, type OAuthProvider, OAuthProviderSchema, PRODUCTION_PRESET, type PartialConfiguration, type RabbitMQConfig, RabbitMQConfigSchema, type RedisConfig, RedisConfigSchema, type S3Config, S3ConfigSchema, STAGING_PRESET, type SecuritySeverity, TEST_PRESET, createConfigBuilder, createConfigFromDotEnv, createConfigFromEnv, createConfigFromPreset, createTestConfig, deepMerge, getConfigSummary, getEnv, getPreset, loadDotEnv, loadFromEnv, loadFromFile, loadTestConfig, logConfigSafely, maskSecrets, parseArray, parseBoolean, parseNumber, requireEnv, safeValidateConfig, validateConfig, validatePartialConfig, validateProductionSecrets };
