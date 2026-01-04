# Production Readiness Checklist

Use this checklist before deploying to production.

## ✅ Database Setup

- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 Free or higher)
- [ ] Database user created with strong password
- [ ] Network access configured (IP whitelist)
- [ ] Connection string obtained and tested
- [ ] Database name set to `mosque-timing`
- [ ] Indexes verified (auto-created on first run)

## ✅ Environment Configuration

- [ ] `.env` file created (from `.env.example`)
- [ ] `MONGODB_URI` set with correct connection string
- [ ] `JWT_SECRET` generated (use `openssl rand -base64 32`)
- [ ] `JWT_EXPIRES_IN` configured (default: 7d)
- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` configured (default: 3000)
- [ ] `ALLOWED_ORIGINS` set with frontend URLs
- [ ] `RATE_LIMIT_WINDOW_MS` configured
- [ ] `RATE_LIMIT_MAX_REQUESTS` configured
- [ ] `LOG_LEVEL` set appropriately (info/warn/error)
- [ ] `EXPO_ACCESS_TOKEN` added (optional but recommended)

## ✅ Security

- [ ] JWT secret is strong and unique
- [ ] MongoDB password is strong
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets committed to Git
- [ ] CORS origins properly configured
- [ ] Rate limiting enabled
- [ ] Helmet.js configured
- [ ] Input validation on all endpoints
- [ ] MongoDB injection prevention enabled
- [ ] HTTPS enforced (handled by hosting platform)

## ✅ Code Quality

- [ ] All dependencies installed (`npm install`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Linting passes (`npm run lint` or add linter)
- [ ] Tests pass (`npm test`)
- [ ] Code reviewed
- [ ] No console.logs in production code (use logger)
- [ ] Error handling implemented
- [ ] Async operations handled properly

## ✅ Testing

- [ ] Authentication tests pass
- [ ] Mosque CRUD tests pass
- [ ] Notification tests pass
- [ ] API endpoints tested manually
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Rate limiting tested
- [ ] Token expiration tested

## ✅ Deployment Platform

- [ ] Platform selected (Render/Railway/Heroku/etc.)
- [ ] Account created
- [ ] Repository connected
- [ ] Build command configured: `npm install`
- [ ] Start command configured: `npm start`
- [ ] Environment variables added to platform
- [ ] Auto-deploy configured (optional)
- [ ] Custom domain configured (optional)

## ✅ Monitoring & Logging

- [ ] Winston logger configured
- [ ] Log files directory created (`logs/`)
- [ ] Health check endpoint tested (`/health`)
- [ ] Uptime monitoring setup (UptimeRobot/Pingdom)
- [ ] Error tracking configured (Sentry - optional)
- [ ] MongoDB Atlas monitoring enabled
- [ ] Alerts configured for critical issues

## ✅ Performance

- [ ] Database indexes created (auto-created)
- [ ] Connection pooling configured
- [ ] Rate limiting prevents abuse
- [ ] Pagination implemented on list endpoints
- [ ] Large payloads handled (10mb limit)
- [ ] Async operations for notifications
- [ ] Cleanup jobs scheduled (24h interval)

## ✅ Backup & Recovery

- [ ] MongoDB Atlas backups enabled (M10+ tier)
- [ ] Manual backup strategy for M0 tier
- [ ] Git repository backed up
- [ ] Environment variables documented
- [ ] Recovery procedure documented
- [ ] Database restore tested (if possible)

## ✅ Documentation

- [ ] README.md complete
- [ ] API_REFERENCE.md reviewed
- [ ] DEPLOYMENT_GUIDE.md followed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Error codes documented
- [ ] Rate limits documented

## ✅ Frontend Integration

- [ ] API service created (`services/apiService.ts`)
- [ ] `config.ts` updated with production URL
- [ ] JWT token storage implemented
- [ ] Token refresh logic implemented (if needed)
- [ ] Error handling on frontend
- [ ] Push notification registration working
- [ ] All API calls tested from app

## ✅ Notifications

- [ ] Expo push notifications configured
- [ ] Push tokens registered successfully
- [ ] Notifications sent on timing updates
- [ ] Ticket handling working
- [ ] Receipt checking working
- [ ] Invalid tokens removed automatically
- [ ] Cleanup job running (24h)
- [ ] Notification stats accessible

## ✅ Post-Deployment

- [ ] Health check returns 200 OK
- [ ] Can register new imam
- [ ] Can login successfully
- [ ] Can create/update mosque
- [ ] Can update timings
- [ ] Notifications sent successfully
- [ ] Push tokens registered
- [ ] Rate limiting works
- [ ] Error handling works
- [ ] Logs are being written
- [ ] MongoDB connection stable
- [ ] No memory leaks observed
- [ ] Response times acceptable

## ✅ Scaling Preparation

- [ ] Current load tested
- [ ] Bottlenecks identified
- [ ] Scaling strategy documented
- [ ] Database scaling plan (upgrade to M10+)
- [ ] Horizontal scaling possible (stateless)
- [ ] CDN considered for static assets
- [ ] Caching strategy planned (Redis - future)

## ✅ Maintenance

- [ ] Update schedule planned
- [ ] Dependency update strategy
- [ ] Security patch process
- [ ] Backup verification schedule
- [ ] Log rotation configured
- [ ] Cleanup jobs monitored
- [ ] Performance monitoring active

## ✅ Compliance & Legal

- [ ] Privacy policy created (if collecting user data)
- [ ] Terms of service created
- [ ] GDPR compliance checked (if EU users)
- [ ] Data retention policy defined
- [ ] User data deletion process
- [ ] Cookie policy (if applicable)

## ✅ Support & Operations

- [ ] Support email/contact configured
- [ ] Issue tracking setup (GitHub Issues)
- [ ] Runbook created for common issues
- [ ] On-call rotation defined (if team)
- [ ] Incident response plan
- [ ] Status page setup (optional)

## 🚀 Launch Checklist

Final checks before going live:

1. [ ] All above items completed
2. [ ] Staging environment tested
3. [ ] Load testing completed
4. [ ] Security audit passed
5. [ ] Team trained on operations
6. [ ] Rollback plan ready
7. [ ] Monitoring dashboards ready
8. [ ] Support team ready
9. [ ] Communication plan ready
10. [ ] Launch announcement prepared

## 📊 Success Metrics

Track these after launch:

- [ ] API response time < 200ms (avg)
- [ ] Uptime > 99.9%
- [ ] Error rate < 0.1%
- [ ] Push notification delivery > 95%
- [ ] Database query time < 50ms (avg)
- [ ] User registration success rate > 90%
- [ ] Login success rate > 95%

## 🔄 Regular Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Check notification delivery

### Weekly
- [ ] Review performance metrics
- [ ] Check database size
- [ ] Review security logs
- [ ] Update dependencies (if needed)

### Monthly
- [ ] Security audit
- [ ] Performance review
- [ ] Cost optimization
- [ ] Backup verification
- [ ] Documentation update

## 📞 Emergency Contacts

Document these:

- [ ] MongoDB Atlas support
- [ ] Hosting platform support
- [ ] Team lead contact
- [ ] Database admin contact
- [ ] DevOps contact

## 🎯 Rollback Plan

If something goes wrong:

1. [ ] Revert to previous deployment
2. [ ] Check database integrity
3. [ ] Verify MongoDB connection
4. [ ] Test critical endpoints
5. [ ] Notify users (if needed)
6. [ ] Document incident
7. [ ] Plan fix and re-deploy

---

**Note:** This checklist is comprehensive. Not all items may apply to your specific deployment. Use your judgment to determine what's necessary for your scale and requirements.

**Minimum for MVP:**
- Database setup
- Environment configuration
- Security basics
- Testing
- Deployment
- Basic monitoring

**Add later as you scale:**
- Advanced monitoring
- Caching
- CDN
- Load balancing
- Multi-region deployment
