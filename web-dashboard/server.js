/**
 * WEB DASHBOARD TEST RUNNER
 * Express.js server providing web interface for test execution
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

class WebDashboardRunner {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server);
        this.port = process.env.PORT || 3001;
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketHandlers();
        
        this.activeTests = new Map();
        this.testHistory = [];
    }
    
    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use('/reports', express.static(path.join(process.cwd(), 'reports')));
    }
    
    setupRoutes() {
        // Dashboard home
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
        
        // API endpoints
        this.app.get('/api/suites', (req, res) => {
            res.json(this.getTestSuites());
        });
        
        this.app.get('/api/history', (req, res) => {
            res.json(this.testHistory.slice(-50)); // Last 50 runs
        });
        
        this.app.post('/api/run', (req, res) => {
            const testId = this.runTest(req.body);
            res.json({ testId, status: 'started' });
        });
        
        this.app.get('/api/status/:testId', (req, res) => {
            const test = this.activeTests.get(req.params.testId);
            res.json(test || { status: 'not_found' });
        });
    }
    
    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            
            socket.on('subscribe_test', (testId) => {
                socket.join(`test_${testId}`);
            });
            
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    
    getTestSuites() {
        return {
            smoke: { name: 'Smoke Tests', tags: '@smoke', priority: 1 },
            regression: { name: 'Regression Tests', tags: '@regression', priority: 2 },
            e2e: { name: 'E2E Tests', tags: '@e2e', priority: 3 },
            contact: { name: 'Contact Tests', tags: '@contact', priority: 2 }
        };
    }
    
    runTest(config) {
        const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const startTime = new Date();
        
        const testRun = {
            id: testId,
            config,
            status: 'running',
            startTime,
            logs: [],
            results: null
        };
        
        this.activeTests.set(testId, testRun);
        
        // Build command
        const args = this.buildCucumberCommand(config);
        
        // Execute test
        const process = spawn('npx', args, {
            shell: true,
            env: { ...process.env, ...this.buildEnvironment(config) }
        });
        
        process.stdout.on('data', (data) => {
            const log = data.toString();
            testRun.logs.push({ type: 'stdout', message: log, timestamp: new Date() });
            this.io.to(`test_${testId}`).emit('log', { type: 'stdout', message: log });
        });
        
        process.stderr.on('data', (data) => {
            const log = data.toString();
            testRun.logs.push({ type: 'stderr', message: log, timestamp: new Date() });
            this.io.to(`test_${testId}`).emit('log', { type: 'stderr', message: log });
        });
        
        process.on('close', (code) => {
            const endTime = new Date();
            const duration = endTime - startTime;
            
            testRun.status = code === 0 ? 'passed' : 'failed';
            testRun.endTime = endTime;
            testRun.duration = duration;
            testRun.exitCode = code;
            
            // Move to history
            this.testHistory.push({ ...testRun });
            this.activeTests.delete(testId);
            
            this.io.to(`test_${testId}`).emit('complete', {
                status: testRun.status,
                duration,
                exitCode: code
            });
        });
        
        return testId;
    }
    
    buildCucumberCommand(config) {
        const args = ['cucumber-js'];
        
        if (config.suite) {
            args.push('--tags', `@${config.suite}`);
        }
        
        if (config.parallel > 1) {
            args.push('--parallel', config.parallel.toString());
        }
        
        args.push('--format', 'json:reports/web-dashboard-results.json');
        args.push('--format', 'html:reports/web-dashboard-results.html');
        
        return args;
    }
    
    buildEnvironment(config) {
        return {
            HEADED: config.headed ? 'true' : 'false',
            BROWSER: config.browser || 'chromium',
            ENVIRONMENT: config.environment || 'prod'
        };
    }
    
    start() {
        this.server.listen(this.port, () => {
            console.log(`🌐 Web Dashboard running at http://localhost:${this.port}`);
        });
    }
}

module.exports = WebDashboardRunner;

// Start server if run directly
if (require.main === module) {
    const dashboard = new WebDashboardRunner();
    dashboard.start();
}
