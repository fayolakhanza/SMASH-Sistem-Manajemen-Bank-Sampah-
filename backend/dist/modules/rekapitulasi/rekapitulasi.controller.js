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
exports.RekapitulasiController = void 0;
const common_1 = require("@nestjs/common");
const rekapitulasi_service_1 = require("./rekapitulasi.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
let RekapitulasiController = class RekapitulasiController {
    rekapitulasiService;
    constructor(rekapitulasiService) {
        this.rekapitulasiService = rekapitulasiService;
    }
    async getRekapitulasiBulanan(appMakerId, bulan) {
        return this.rekapitulasiService.getRekapitulasiBulanan(appMakerId, bulan);
    }
};
exports.RekapitulasiController = RekapitulasiController;
__decorate([
    (0, common_1.Get)('bulanan'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Query)('bulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RekapitulasiController.prototype, "getRekapitulasiBulanan", null);
exports.RekapitulasiController = RekapitulasiController = __decorate([
    (0, common_1.Controller)('api/v1/rekapitulasi'),
    __metadata("design:paramtypes", [rekapitulasi_service_1.RekapitulasiService])
], RekapitulasiController);
//# sourceMappingURL=rekapitulasi.controller.js.map