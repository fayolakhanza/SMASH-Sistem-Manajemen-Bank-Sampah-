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
exports.SetorSampahController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const setor_service_1 = require("./setor.service");
const create_setor_dto_1 = require("./dto/create-setor.dto");
const verify_setor_dto_1 = require("./dto/verify-setor.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const file_upload_util_1 = require("../../common/utils/file-upload.util");
let SetorSampahController = class SetorSampahController {
    setorService;
    constructor(setorService) {
        this.setorService = setorService;
    }
    async createPengajuan(appMakerId, user, dto, file, req) {
        const fotoBuktiUrl = file
            ? (0, file_upload_util_1.getNasabahBuktiUrl)(req, file.filename)
            : undefined;
        return this.setorService.createPengajuan(appMakerId, user.nasabah.id, dto, fotoBuktiUrl);
    }
    async getMySetor(appMakerId, user, bulan) {
        return this.setorService.getMySetor(appMakerId, user.nasabah.id, bulan);
    }
    async getAdminList(appMakerId, status, bulan) {
        return this.setorService.getAdminList(appMakerId, status, bulan);
    }
    async getDetail(appMakerId, user, id) {
        return this.setorService.getDetail(appMakerId, id, user);
    }
    async verify(appMakerId, id, dto) {
        return this.setorService.verify(appMakerId, id, dto);
    }
};
exports.SetorSampahController = SetorSampahController;
__decorate([
    (0, common_1.Post)('pengajuan'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('NASABAH'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('fotoBukti', { storage: file_upload_util_1.nasabahBuktiStorage })),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_setor_dto_1.CreateSetorSampahDto, Object, Object]),
    __metadata("design:returntype", Promise)
], SetorSampahController.prototype, "createPengajuan", null);
__decorate([
    (0, common_1.Get)('my-setor'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('NASABAH'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('bulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], SetorSampahController.prototype, "getMySetor", null);
__decorate([
    (0, common_1.Get)('admin/list'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('bulan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SetorSampahController.prototype, "getAdminList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], SetorSampahController.prototype, "getDetail", null);
__decorate([
    (0, common_1.Put)('admin/verify/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, verify_setor_dto_1.VerifySetorSampahDto]),
    __metadata("design:returntype", Promise)
], SetorSampahController.prototype, "verify", null);
exports.SetorSampahController = SetorSampahController = __decorate([
    (0, common_1.Controller)('api/v1/setor-sampah'),
    __metadata("design:paramtypes", [setor_service_1.SetorSampahService])
], SetorSampahController);
//# sourceMappingURL=setor.controller.js.map