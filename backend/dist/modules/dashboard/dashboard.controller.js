"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getSummary(appMakerId, user) {
        return this.dashboardService.getNasabahSummary(appMakerId, user.nasabah.id);
    }
    async getStats(appMakerId) {
        return this.dashboardService.getAdminStats(appMakerId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('NASABAH'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSummary", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('api/v1/dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map