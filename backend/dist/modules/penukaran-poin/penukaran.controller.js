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
exports.PenukaranPoinController = void 0;
const common_1 = require("@nestjs/common");
const penukaran_service_1 = require("./penukaran.service");
const create_penukaran_dto_1 = require("./dto/create-penukaran.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let PenukaranPoinController = class PenukaranPoinController {
    penukaranService;
    constructor(penukaranService) {
        this.penukaranService = penukaranService;
    }
    async tukarPoin(appMakerId, user, dto) {
        return this.penukaranService.tukarPoin(appMakerId, user.nasabah.id, dto);
    }
    async getMyPenukaran(appMakerId, user) {
        return this.penukaranService.getMyPenukaran(appMakerId, user.nasabah.id);
    }
    async getAdminList(appMakerId, bulan) {
        return this.penukaranService.getAdminList(appMakerId, bulan);
    }
    async updateStatus(appMakerId, id, dto) {
        return this.penukaranService.updateStatus(appMakerId, id, dto);
    }
    async getNota(appMakerId, user, id) {
        return this.penukaranService.getNota(appMakerId, id, user);
    }
};
exports.PenukaranPoinController = PenukaranPoinController;
__decorate([
    (0, common_1.Post)('tukar'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('NASABAH'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_penukaran_dto_1.CreatePenukaranPoinDto]),
    __metadata("design:returntype", Promise)
], PenukaranPoinController.prototype, "tukarPoin", null);
__decorate([
    (0, common_1.Get)('my-penukaran'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('NASABAH'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PenukaranPoinController.prototype, "getMyPenukaran", null);
__decorate([
    (0, common_1.Get)('admin/list'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Query)('bulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PenukaranPoinController.prototype, "getAdminList", null);
__decorate([
    (0, common_1.Put)('admin/status/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_penukaran_dto_1.UpdateStatusPenukaranDto]),
    __metadata("design:returntype", Promise)
], PenukaranPoinController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('nota/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PenukaranPoinController.prototype, "getNota", null);
exports.PenukaranPoinController = PenukaranPoinController = __decorate([
    (0, common_1.Controller)('api/v1/penukaran-poin'),
    __metadata("design:paramtypes", [penukaran_service_1.PenukaranPoinService])
], PenukaranPoinController);
//# sourceMappingURL=penukaran.controller.js.map