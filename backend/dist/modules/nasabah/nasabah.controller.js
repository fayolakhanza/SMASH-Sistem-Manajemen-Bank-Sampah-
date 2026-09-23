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
exports.NasabahController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const nasabah_service_1 = require("./nasabah.service");
const create_nasabah_dto_1 = require("./dto/create-nasabah.dto");
const update_nasabah_dto_1 = require("./dto/update-nasabah.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
const file_upload_util_1 = require("../../common/utils/file-upload.util");
let NasabahController = class NasabahController {
    nasabahService;
    constructor(nasabahService) {
        this.nasabahService = nasabahService;
    }
    async findAll(appMakerId) {
        return this.nasabahService.findAll(appMakerId);
    }
    async create(appMakerId, dto, file, req) {
        const fotoUrl = file ? (0, file_upload_util_1.getFileUrl)(req, file.filename) : undefined;
        return this.nasabahService.create(appMakerId, dto, fotoUrl);
    }
    async findOne(appMakerId, id) {
        return this.nasabahService.findOne(appMakerId, id);
    }
    async update(appMakerId, id, dto, file, req) {
        const fotoUrl = file ? (0, file_upload_util_1.getFileUrl)(req, file.filename) : undefined;
        return this.nasabahService.update(appMakerId, id, dto, fotoUrl);
    }
    async remove(appMakerId, id) {
        return this.nasabahService.remove(appMakerId, id);
    }
};
exports.NasabahController = NasabahController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NasabahController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', { storage: file_upload_util_1.multerStorage })),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_nasabah_dto_1.CreateNasabahDto, Object, Object]),
    __metadata("design:returntype", Promise)
], NasabahController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NasabahController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', { storage: file_upload_util_1.multerStorage })),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_nasabah_dto_1.UpdateNasabahDto, Object, Object]),
    __metadata("design:returntype", Promise)
], NasabahController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NasabahController.prototype, "remove", null);
exports.NasabahController = NasabahController = __decorate([
    (0, common_1.Controller)('api/v1/admin/nasabah'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [nasabah_service_1.NasabahService])
], NasabahController);
//# sourceMappingURL=nasabah.controller.js.map